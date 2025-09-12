import { FirebaseConversation, FirebaseMessage, Presence } from '../services/messageService';
import { User } from '../redux/types/firebaseTypes';
import { Timestamp } from 'firebase/firestore';

export const enrichConversationData = (
  conversation: FirebaseConversation, 
  currentUser: User,
  users: Record<string, User>
): FirebaseConversation => {
  // Determine the other user in the conversation based on roles
  const isCurrentUserClient = currentUser.role === 'client';
  const isCurrentUserFreelancer = currentUser.role === 'freelancer';
  
  // Determine the other user ID based on the current user's role
  let otherUserId: string | undefined;
  
  if (isCurrentUserClient && conversation.freelancerId) {
    otherUserId = conversation.freelancerId;
  } else if (isCurrentUserFreelancer && conversation.clientId) {
    otherUserId = conversation.clientId;
  } else {
    // If we can't determine based on role, look for any participant that isn't the current user
    otherUserId = conversation.participants?.find(id => id !== currentUser.userId && id !== 'system');
  }
  
  // Get the other user from the users collection
  const otherUser = users[otherUserId || ''] || {};
  
  // Set display name with proper fallback - avoid showing partial user IDs
  const name = otherUser.displayName || 
               (otherUser.firstname && otherUser.lastname ? `${otherUser.firstname} ${otherUser.lastname}` : 
               otherUser.firstname || otherUser.lastname || 
               'Loading...'); // Better fallback than showing user ID fragment
  
  // Set avatar URL
  const avatar = otherUser.photoURL || '/placeholder-user.jpg';
  
  // Set role label for UI display
  const role = isCurrentUserFreelancer ? 'client' : 'freelancer';
  
  // Set project name
  let project = 'Direct Message';
  
  // For simplicity, we'll just use ID-based names for now
  // In a real app, we would do asynchronous enrichment of these names
  if (conversation.proposalId) {
    project = `Proposal #${conversation.proposalId.substring(0, 6)}`;
  } else if (conversation.projectId) {
    project = `Project #${conversation.projectId.substring(0, 6)}`;
  } else if (conversation.contractId) {
    project = `Contract #${conversation.contractId.substring(0, 6)}`;
  }
  
  // Create the enriched conversation object with type safety
  const enriched = {
    ...conversation,
    name,
    avatar,
    role,
    project
  };
  
  // Add otherUserId as a non-typed property to avoid type errors
  (enriched as any).otherUserId = otherUserId;
  
  return enriched;
};

export const enrichMessageData = (
  message: FirebaseMessage, 
  currentUser: User,
  users: Record<string, User>
): FirebaseMessage => {
  // Handle potentially invalid message objects
  if (!message) {
    console.error('Attempted to enrich invalid message:', message);
    return {} as FirebaseMessage;
  }
  
  // Get sender information
  const sender = users[message.senderId] || {};
  const senderName = sender.displayName || 
                    (sender.firstname && sender.lastname ? `${sender.firstname} ${sender.lastname}` : 
                    sender.firstname || sender.lastname || 'Unknown User');
  
  // Convert timestamps to consistent format if needed
  let timestamp = message.timestamp;
  if (timestamp && typeof timestamp.toDate !== 'function' && timestamp.seconds) {
    // Convert firestore timestamp-like object to a proper timestamp
    timestamp = new Timestamp(timestamp.seconds, timestamp.nanoseconds || 0);
  }
  
  // Process read and delivered statuses
  const readBy = message.readBy || {};
  const deliveredTo = message.deliveredTo || {};
  
  // Handle rich text content if available
  const richText = message.richText || undefined;
  
  // Handle possibly undefined fields
  const safeMessage: FirebaseMessage = {
    ...message,
    messageId: message.messageId || '',
    conversationId: message.conversationId || '',
    senderId: message.senderId || '',
    senderType: message.senderType || 'client',
    text: message.text || '',
    type: message.type || 'text',
    status: message.status || 'sent',
    timestamp: timestamp,
    readBy: readBy,
    deliveredTo: deliveredTo,
    richText: richText,
    
    // Required field from schema
    isImportant: message.isImportant || false,
    
    // Handle threading data
    isReply: message.isReply || false,
    replyToMessageId: message.replyToMessageId,
    replyToSenderId: message.replyToSenderId,
    replyPreview: message.replyPreview,
    
    // Handle message state flags
    isEdited: message.isEdited || false,
    isDeleted: message.isDeleted || false,
    isForwarded: message.isForwarded || false,
    originalMessageId: message.originalMessageId,
    
    // Handle reactions
    reactions: message.reactions || {},
    
    // Handle audio messages
    audioMessage: message.audioMessage,
    
    // Handle location data
    location: message.location,
    
    // Handle interactive actions
    actions: message.actions,
    
    // Add UI-specific properties
    isOwn: message.senderId === currentUser?.userId,
    sender: senderName,
    avatar: sender.photoURL || '/placeholder-user.jpg',
  };
  
  // Ensure attachments are properly structured if they exist
  if (message.attachments && Array.isArray(message.attachments)) {
    safeMessage.attachments = message.attachments.map(attachment => ({
      attachmentId: attachment.attachmentId || '',
      fileName: attachment.fileName || 'Unnamed file',
      fileUrl: attachment.fileUrl || '',
      fileType: attachment.fileType || '',
      fileSize: attachment.fileSize || 0,
      thumbnailUrl: attachment.thumbnailUrl || '',
      duration: attachment.duration,
      dimensions: attachment.dimensions,
      metadata: attachment.metadata
    }));
  }
  
  return safeMessage;
};

// Format timestamp for conversation list
export const formatMessageTime = (timestamp: any) => {
  if (!timestamp) return "";
  
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  // Less than 24 hours, show time
  if (diff < 24 * 60 * 60 * 1000) {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(date);
  } 
  // Less than 7 days, show day of week
  else if (diff < 7 * 24 * 60 * 60 * 1000) {
    return new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date);
  } 
  // Otherwise show date
  else {
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
  }
};

// Format how long ago a user was last active
export const formatLastActive = (timestamp: any) => {
  if (!timestamp) return "Never";
  
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  // Less than a minute
  if (diff < 60 * 1000) {
    return "just now";
  }
  // Less than an hour
  else if (diff < 60 * 60 * 1000) {
    const minutes = Math.floor(diff / (60 * 1000));
    return `${minutes}m ago`;
  }
  // Less than a day
  else if (diff < 24 * 60 * 60 * 1000) {
    const hours = Math.floor(diff / (60 * 60 * 1000));
    return `${hours}h ago`;
  }
  // Less than a week
  else if (diff < 7 * 24 * 60 * 60 * 1000) {
    const days = Math.floor(diff / (24 * 60 * 60 * 1000));
    return `${days}d ago`;
  }
  // Otherwise
  else {
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
  }
};
