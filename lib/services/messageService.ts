import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs, 
  getDoc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  doc, 
  serverTimestamp, 
  onSnapshot,
  startAfter,
  Timestamp,
  DocumentData,
  DocumentReference,
  CollectionReference,
  Query
} from 'firebase/firestore';
import { db } from '@/firebase';
import { User } from '../redux/types/firebaseTypes';

export interface FirebaseConversation {
  conversationId: string;
  clientId?: string;
  freelancerId?: string;
  adminId?: string;
  participants: string[];
  type: "one_to_one" | "announcement" | "support";
  projectId?: string;
  proposalId?: string;
  contractId?: string;
  audienceType?: "all" | "clients" | "freelancers";
  lastMessage: {
    text: string;
    preview: string;
    senderId: string;
    timestamp: Timestamp;
    type: string;
  };
  unreadCount: Record<string, number>;
  pinned: boolean;
  isArchived: Record<string, boolean>;
  isMuted: Record<string, boolean>;
  createdBy: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  // UI-specific properties added on the client
  name?: string;
  avatar?: string;
  role?: string;
  project?: string;
}

export interface FirebaseMessage {
  messageId: string;
  conversationId: string;
  senderId: string;
  senderType: "client" | "freelancer" | "admin" | "system";
  text: string;
  type: "text" | "file" | "image" | "audio" | "video" | "location" | "contact" | "system" | "call_log";
  status: "sending" | "sent" | "delivered" | "read" | "failed";
  timestamp: Timestamp;
  readBy: Record<string, Timestamp>;
  deliveredTo: Record<string, Timestamp>;
  
  // Rich text formatting
  richText?: {
    html: string;
    mentions: string[];
    links: string[];
  };
  
  // Source tracking (for debugging - only in memory)
  _source?: 'subcollection' | 'top-level';
  
  // Translation data
  translation?: Record<string, string>;
  
  // Message type details
  subtype?: string;
  isImportant?: boolean;
  
  // Attachments
  attachments?: Array<{
    attachmentId: string;
    fileName: string;
    fileUrl: string;
    fileType: string;
    fileSize: number;
    thumbnailUrl?: string;
    duration?: number;
    dimensions?: {
      width: number;
      height: number;
    };
    metadata?: Record<string, any>;
  }>;
  
  // Audio message specific data
  audioMessage?: {
    duration: number;
    waveformData: number[];
    transcription?: string;
  };
  
  // Location sharing
  location?: {
    latitude: number;
    longitude: number;
    address: string;
    name: string;
  };
  
  // Message threading
  isReply?: boolean;
  replyToMessageId?: string;
  replyToSenderId?: string;
  replyPreview?: string;
  threadParticipants?: string[];
  
  // Message state flags
  isEdited?: boolean;
  isDeleted?: boolean;
  isForwarded?: boolean;
  originalMessageId?: string;
  
  // Reactions
  reactions?: Record<string, Array<{
    userId: string;
    reaction: string;
    timestamp: Timestamp;
  }>>;
  
  // Interactive actions
  actions?: Array<{
    actionId: string;
    actionType: string;
    label: string;
    value: string;
    url?: string;
    style?: string;
    confirmedBy?: string[];
  }>;
  
  // Timing metadata
  editedAt?: Timestamp;
  deletedAt?: Timestamp;
  expiresAt?: Timestamp;
  scheduledFor?: Timestamp;
  editWindow?: number;
  
  // UI-specific properties
  sender?: string;
  isOwn?: boolean;
  avatar?: string;
}

export interface Presence {
  userId: string;
  status: "online" | "away" | "busy" | "offline";
  lastActive: Timestamp;
  device?: {
    type: string;
    platform: string;
    appVersion: string;
  };
  typingIn?: {
    conversationId: string;
    timestamp: Timestamp;
  };
}

// Get all conversations for a user
export const getUserConversations = (userId: string, callback: (conversations: FirebaseConversation[]) => void) => {
  const conversationsRef = collection(db, 'conversations');
  const q = query(conversationsRef, where('participants', 'array-contains', userId));
  
  // Return the unsubscribe function
  return onSnapshot(q, (snapshot) => {
    const conversations: FirebaseConversation[] = [];
    
    snapshot.forEach((doc) => {
      const data = doc.data() as FirebaseConversation;
      conversations.push({
        ...data,
        conversationId: doc.id,
      });
    });
    
    callback(conversations);
  });
};

// Get messages for a specific conversation with real-time updates
// This function will fetch messages from both the subcollection and top-level collection
export const getConversationMessages = (conversationId: string, callback: (messages: FirebaseMessage[]) => void) => {
  if (!conversationId) {
    // Invalid conversationId
    callback([]);
    return () => {}; // Return empty unsubscribe function
  }
  
  try {
        // Set up dual listener for both subcollection and top-level collection
    
    // Create a map to store merged messages by ID
    let mergedMessages: Record<string, FirebaseMessage> = {};
    
    // Keep track of both listeners
    let unsubSubcollection: (() => void) | null = null;
    let unsubTopLevel: (() => void) | null = null;
    
    // Flag to track when both listeners have fired at least once
    let subcollectionInitialized = false;
    let topLevelInitialized = false;
    
    // Function to merge and notify about messages
    const mergeAndNotify = () => {
      // Only notify when both sources have been checked
      if (subcollectionInitialized && topLevelInitialized) {
        // Convert merged messages object to array and sort by timestamp
        const messageArray = Object.values(mergedMessages).sort((a, b) => {
          const timeA = a.timestamp?.toMillis?.() || 0;
          const timeB = b.timestamp?.toMillis?.() || 0;
          return timeA - timeB;
        });
        
        // Log stats about merged messages
        const subcollectionCount = Object.values(mergedMessages).filter(msg => msg._source === 'subcollection').length;
        const topLevelCount = Object.values(mergedMessages).filter(msg => msg._source === 'top-level').length;
        const duplicateIds = new Set();
        
        // Find message IDs that exist in both sources (before merging)
        Object.values(mergedMessages).forEach(msg => {
          if (msg._source === 'subcollection' && Object.values(mergedMessages).some(m => m._source === 'top-level' && m.messageId === msg.messageId)) {
            duplicateIds.add(msg.messageId);
          }
        });
        
        // Notify subscriber with merged message array
        callback(messageArray);
      }
    };
    
    // 1. Listen to messages in subcollection
    const messagesRef = collection(db, `conversations/${conversationId}/messages`);
    const subcollectionQuery = query(messagesRef, orderBy('timestamp', 'asc'));
    
    unsubSubcollection = onSnapshot(subcollectionQuery, (snapshot) => {
      
      snapshot.docs.forEach((doc, index) => {
        try {
          const data = doc.data();
          
          if (!data) {
            // Empty document data, skip
            return; // Skip this document
          }
          
          const messageData: FirebaseMessage = {
            ...data,
            messageId: doc.id,
            text: data.text || '',
            readBy: data.readBy || {},
            deliveredTo: data.deliveredTo || {},
            timestamp: data.timestamp || serverTimestamp(),
            _source: 'subcollection' // Mark source for debugging
          } as FirebaseMessage;
          
          // Add to merged messages map
          mergedMessages[doc.id] = messageData;
        } catch (docError) {
          // Error processing subcollection message document
        }
      });
      
      subcollectionInitialized = true;
      mergeAndNotify();
    }, (error) => {
      // Error getting subcollection messages
      subcollectionInitialized = true; // Mark as initialized even on error
      mergeAndNotify();
    });
    
    // 2. Listen to messages in top-level collection
    const topLevelMessagesRef = collection(db, 'messages');
    const topLevelQuery = query(
      topLevelMessagesRef, 
      where('conversationId', '==', conversationId),
      orderBy('timestamp', 'asc')
    );
    
    unsubTopLevel = onSnapshot(topLevelQuery, (snapshot) => {
      
      snapshot.docs.forEach((doc, index) => {
        try {
          const data = doc.data();
          
          if (!data) {
            // Empty document data, skip
            return; // Skip this document
          }
          
          const messageData: FirebaseMessage = {
            ...data,
            messageId: doc.id,
            text: data.text || '',
            readBy: data.readBy || {},
            deliveredTo: data.deliveredTo || {},
            timestamp: data.timestamp || serverTimestamp(),
            _source: 'top-level' // Mark source for debugging
          } as FirebaseMessage;
          
          // Check if this message would replace one from the subcollection
          const existingMsg = mergedMessages[doc.id];
          const willReplace = existingMsg && 
                             existingMsg._source === 'subcollection' && 
                             messageData.timestamp?.toMillis?.() > (existingMsg.timestamp?.toMillis?.() || 0);
          
          // Only add from top-level if we don't already have from subcollection
          // or if the top-level version is newer (has updated fields)
          if (!mergedMessages[doc.id] || willReplace) {
            mergedMessages[doc.id] = messageData;
          }
        } catch (docError) {
          // Error processing top-level message document
        }
      });
      
      topLevelInitialized = true;
      mergeAndNotify();
    }, (error) => {
      // Error getting top-level messages
      topLevelInitialized = true; // Mark as initialized even on error
      mergeAndNotify();
    });
    
    // Return combined unsubscribe function
    return () => {
      if (unsubSubcollection) unsubSubcollection();
      if (unsubTopLevel) unsubTopLevel();
    };
  } catch (error) {
    // Error setting up messages listener
    callback([]);
    return () => {}; // Return empty unsubscribe function
  }
};


// Send a new message to a conversation
export const sendMessage = async (conversationId: string, message: Omit<FirebaseMessage, 'messageId' | 'timestamp'>) => {
  try {
    // Reference to conversation's messages subcollection
    const conversationMessagesRef = collection(db, `conversations/${conversationId}/messages`);
    
    // Reference to top-level Messages collection
    const messagesCollectionRef = collection(db, 'messages');
    
    const newMessage = {
      ...message,
      timestamp: serverTimestamp(),
      status: 'sent',
    };
    
    // Generate a new document ID that we'll use for both locations
    const messageRef = doc(messagesCollectionRef);
    const messageId = messageRef.id;
    
    // STEP 1: First save to top-level Messages collection
    let topLevelSuccess = false;
    try {
      await setDoc(messageRef, {
        ...newMessage,
        messageId // Include the messageId in the document
      });
      topLevelSuccess = true;
    } catch (error) {
      console.error(`[SEND] ❌ Error saving message to top-level collection:`, error);
      // Continue to try saving to subcollection even if top-level fails
    }
    
    // STEP 2: Then save to conversation's messages subcollection with same ID
    let subcollectionSuccess = false;
    try {
      await setDoc(doc(conversationMessagesRef, messageId), {
        ...newMessage,
        messageId
      });
      subcollectionSuccess = true;
    } catch (error) {
      console.error(`[SEND] ❌ Error saving message to subcollection:`, error);
      throw error; // This is critical, so we rethrow
    }
    
    // STEP 3: Update conversation's lastMessage
    
    // Determine the preview text based on message type
    let previewText = message.text;
    
    if (message.type !== 'text' && message.attachments?.length) {
      // Create different preview text based on attachment type
      if (message.type === 'image') {
        previewText = message.text || '📷 Sent an image';
      } else if (message.type === 'video') {
        previewText = message.text || '🎥 Sent a video';
      } else if (message.type === 'audio') {
        previewText = message.text || '🎵 Sent an audio message';
      } else if (message.type === 'file') {
        previewText = message.text || `📎 Sent a file: ${message.attachments[0].fileName}`;
      }
    }
    
    console.log(`[SEND] 📝 Preview text: "${previewText.substring(0, 50)}${previewText.length > 50 ? '...' : ''}"`);
    
    let lastMessageSuccess = false;
    try {
      // Update the last message in the conversation
      const conversationRef = doc(db, 'conversations', conversationId);
      const startTime = performance.now();
      await updateDoc(conversationRef, {
        'lastMessage.text': previewText,
        'lastMessage.preview': previewText.substring(0, 100),
        'lastMessage.senderId': message.senderId,
        'lastMessage.timestamp': serverTimestamp(),
        'lastMessage.type': message.type,
        'updatedAt': serverTimestamp(),
        [`unreadCount.${message.senderId}`]: 0, // Reset sender's unread count
      });
      const endTime = performance.now();
      lastMessageSuccess = true;
      console.log(`[SEND] ✅ Successfully updated conversation lastMessage (took ${(endTime - startTime).toFixed(2)}ms)`);
    } catch (error) {
      console.error(`[SEND] ❌ Error updating conversation lastMessage:`, error);
      // Still continue since the message was saved
    }
    
    // STEP 4: Update unread counts for other participants
    console.log(`[SEND] 4️⃣ Updating unread counts for participants...`);
    let unreadCountSuccess = false;
    try {
      const conversationRef = doc(db, 'conversations', conversationId);
      const startTime = performance.now();
      const conversationSnapshot = await getDoc(conversationRef);
      
      if (conversationSnapshot.exists()) {
        const conversationData = conversationSnapshot.data() as FirebaseConversation;
        const updates: Record<string, number> = {};
        
        conversationData.participants.forEach((participantId) => {
          if (participantId !== message.senderId) {
            const currentCount = conversationData.unreadCount?.[participantId] || 0;
            updates[`unreadCount.${participantId}`] = currentCount + 1;
          }
        });
        
        if (Object.keys(updates).length > 0) {
          console.log(`[SEND] 🔢 Incrementing unread counts for participants:`, Object.keys(updates));
          await updateDoc(conversationRef, updates);
          const endTime = performance.now();
          unreadCountSuccess = true;
          console.log(`[SEND] ✅ Successfully updated unread counts for ${Object.keys(updates).length} participants (took ${(endTime - startTime).toFixed(2)}ms)`);
        } else {
          console.log(`[SEND] ℹ️ No other participants to update unread counts for`);
          unreadCountSuccess = true;
        }
      } else {
        console.warn(`[SEND] ⚠️ Conversation not found when updating unread counts`);
      }
    } catch (error) {
      console.error(`[SEND] ❌ Error updating unread counts:`, error);
    }
    
    console.log(`[SEND] 📊 Overall process status: top-level=${topLevelSuccess}, subcollection=${subcollectionSuccess}, lastMessage=${lastMessageSuccess}, unreadCounts=${unreadCountSuccess}`);
    console.log(`[SEND] 🎉 Message sending process completed for messageId: ${messageId}`);
    
    return messageId;
    
  } catch (error) {
    console.error(`[SEND] 💥 Critical error in sendMessage for conversation ${conversationId}:`, error);
    throw error;
  }
};

// Mark messages as read
export const markMessagesAsRead = async (conversationId: string, userId: string) => {
  if (!conversationId || !userId) {
    // Invalid parameters
    return;
  }
  
  try {
    // Update the unread count for this user in the conversation
    const conversationRef = doc(db, 'conversations', conversationId);
    await updateDoc(conversationRef, {
      [`unreadCount.${userId}`]: 0
    });
    
    // Get all unread messages for this user
    const messagesRef = collection(db, `conversations/${conversationId}/messages`);
    const q = query(
      messagesRef, 
      where('senderId', '!=', userId),
      // Firebase doesn't support direct query on readBy.userId being null,
      // so we'll filter client-side
    );
    
    const snapshot = await getDocs(q);
    
    // Mark each message as read - filter for messages that haven't been read by this user
    // Skip if there are no docs
    if (!snapshot.docs.length) {
      return;
    }
    
    const unreadDocs = snapshot.docs.filter(doc => {
      const data = doc.data();
      // Check if readBy exists, and if the user hasn't read it yet
      return !data.readBy || !data.readBy[userId];
    });
    
    // Skip if there are no unread messages
    if (!unreadDocs.length) {
      return;
    }
    
    // Create an array to hold all update promises
    const updatePromises = [];
    
    // Update all unread messages in the subcollection
    for (const messageDoc of unreadDocs) {
      const messageId = messageDoc.id;
      
      // Update in subcollection
      updatePromises.push(
        updateDoc(messageDoc.ref, {
          [`readBy.${userId}`]: serverTimestamp(),
          status: 'read'
        })
      );
      
      // Update in top-level Messages collection
      const topLevelMessageRef = doc(db, 'messages', messageId);
      updatePromises.push(
        updateDoc(topLevelMessageRef, {
          [`readBy.${userId}`]: serverTimestamp(),
          status: 'read'
        }).catch(err => {
          // Handle case where the document doesn't exist in the top-level collection
          // or there are permission issues
          if (err.code === 'permission-denied') {
            console.debug(`Permission denied accessing message ${messageId} in top-level collection - this is normal if message exists only in subcollection`);
          } else {
            console.warn(`Message ${messageId} not found in top-level Messages collection or error: ${err.code}`);
          }
          // Continue execution without failing - this is a non-critical update
        })
      );
    }
    
    await Promise.all(updatePromises);
  } catch (error) {
    console.error('Error marking messages as read:', error);
    // Don't throw the error further to prevent UI issues
  }
};

// Find an existing conversation or create a new one
export const findOrCreateConversation = async (
  currentUser: User,
  otherUserId: string,
  proposalId?: string
): Promise<string> => {
  try {
    const conversationsRef = collection(db, 'conversations');
    
    // Determine the roles - this is crucial
    const isCurrentUserFreelancer = currentUser.role === 'freelancer';
    
    // Set clientId and freelancerId based on user roles
    // If current user is a freelancer, the other user is a client
    // If current user is a client, the other user is a freelancer
    const clientId = isCurrentUserFreelancer ? otherUserId : currentUser.userId;
    const freelancerId = isCurrentUserFreelancer ? currentUser.userId : otherUserId;
    
    console.log("Creating conversation with roles:", {
      currentUserRole: currentUser.role,
      currentUserId: currentUser.userId,
      otherUserId,
      clientId,
      freelancerId,
      proposalId
    });
    
    // First check if we already have a conversation between these users with this proposal
    let q;
    
    if (proposalId) {
      q = query(
        conversationsRef,
        where('clientId', '==', clientId),
        where('freelancerId', '==', freelancerId),
        where('proposalId', '==', proposalId)
      );
    } else {
      // If no proposalId, find any conversation between these users
      q = query(
        conversationsRef,
        where('clientId', '==', clientId),
        where('freelancerId', '==', freelancerId),
        limit(1)
      );
    }
    
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      // Return existing conversation ID
      console.log("Found existing conversation with matching proposal:", snapshot.docs[0].id);
      return snapshot.docs[0].id;
    }
    
    console.log("No conversation with matching proposal found");
    
    // If we didn't find a conversation with this specific proposal,
    // check if there's any conversation between these users
    if (proposalId) {
      const generalQuery = query(
        conversationsRef,
        where('clientId', '==', clientId),
        where('freelancerId', '==', freelancerId),
        limit(1)
      );
      
      const generalSnapshot = await getDocs(generalQuery);
      
      if (!generalSnapshot.empty) {
        // We found a conversation between these users but with a different proposal
        // Update it to include this proposal rather than creating a new one
        const existingConvRef = generalSnapshot.docs[0].ref;
        console.log("Found existing conversation between users, updating with new proposal:", generalSnapshot.docs[0].id);
        
        await updateDoc(existingConvRef, {
          proposalId,
          updatedAt: Timestamp.now()
        });
        
        return generalSnapshot.docs[0].id;
      }
    }
    
    // No existing conversation found, create a new one
    console.log("Creating new conversation between client and freelancer");
    
    const newConversation: Omit<FirebaseConversation, 'conversationId'> = {
      clientId,
      freelancerId,
      participants: [clientId, freelancerId],
      type: 'one_to_one',
      proposalId,
      lastMessage: {
        text: '',
        preview: '',
        senderId: '',
        timestamp: Timestamp.now(),
        type: 'system'
      },
      unreadCount: {
        [clientId]: 0,
        [freelancerId]: 0
      },
      pinned: false,
      isArchived: {
        [clientId]: false,
        [freelancerId]: false
      },
      isMuted: {
        [clientId]: false,
        [freelancerId]: false
      },
      createdBy: currentUser.userId,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };
    
    // Add the conversation document
    const conversationDoc = await addDoc(conversationsRef, newConversation);
    console.log("Created new conversation with ID:", conversationDoc.id);
    
    // Create a system message to indicate conversation start
    const messagesRef = collection(db, `conversations/${conversationDoc.id}/messages`);
    await addDoc(messagesRef, {
      conversationId: conversationDoc.id,
      senderId: 'system',
      senderType: 'system',
      text: 'Conversation started',
      type: 'system',
      status: 'sent',
      timestamp: Timestamp.now(),
      readBy: {},
      deliveredTo: {}
    });
    
    return conversationDoc.id;
  } catch (error) {
    console.error("Error in findOrCreateConversation:", error);
    throw error;
  }
};

// Update user presence status
export const updateUserPresence = async (userId: string, status: "online" | "away" | "busy" | "offline") => {
  const presenceRef = doc(db, 'presence', userId);
  
  await setDoc(presenceRef, {
    userId,
    status,
    lastActive: serverTimestamp(),
    device: {
      type: 'web',
      platform: navigator.platform,
      appVersion: '1.0.0'
    }
  }, { merge: true });
};

// Listen for presence updates
export const listenToUserPresence = (userIds: string[], callback: (presences: Record<string, Presence>) => void) => {
  if (!userIds.length) return () => {};
  
  const presences: Record<string, Presence> = {};
  const unsubscribers: (() => void)[] = [];
  
  userIds.forEach(userId => {
    const presenceRef = doc(db, 'presence', userId);
    const unsubscribe = onSnapshot(presenceRef, (doc) => {
      if (doc.exists()) {
        presences[userId] = doc.data() as Presence;
      } else {
        presences[userId] = {
          userId,
          status: 'offline',
          lastActive: Timestamp.now()
        };
      }
      
      callback(presences);
    });
    
    unsubscribers.push(unsubscribe);
  });
  
  return () => {
    unsubscribers.forEach(unsubscribe => unsubscribe());
  };
};

// Update typing indicator
export const updateTypingStatus = async (userId: string, conversationId: string | null) => {
  const presenceRef = doc(db, 'presence', userId);
  
  if (conversationId) {
    await updateDoc(presenceRef, {
      'typingIn': {
        conversationId,
        timestamp: serverTimestamp()
      }
    });
  } else {
    await updateDoc(presenceRef, {
      'typingIn': null
    });
  }
};

// Fetch messages from the top-level Messages collection
export const getMessagesFromTopLevelCollection = (
  options: {
    userId?: string,
    conversationId?: string,
    limit?: number,
    startAfter?: Timestamp,
    type?: FirebaseMessage['type']
  },
  callback: (messages: FirebaseMessage[]) => void
) => {
  try {
    const messagesRef = collection(db, 'messages');
    let q: Query = messagesRef;
    
    // Apply filters based on options
    if (options.userId) {
      q = query(q, where('senderId', '==', options.userId));
    }
    
    if (options.conversationId) {
      q = query(q, where('conversationId', '==', options.conversationId));
    }
    
    if (options.type) {
      q = query(q, where('type', '==', options.type));
    }
    
    // Apply timestamp ordering
    q = query(q, orderBy('timestamp', 'desc'));
    
    // Apply pagination if needed
    if (options.startAfter) {
      q = query(q, startAfter(options.startAfter));
    }
    
    // Apply limit
    if (options.limit) {
      q = query(q, limit(options.limit));
    }
    
    // Return the unsubscribe function
    return onSnapshot(q, (snapshot) => {
      const messages: FirebaseMessage[] = [];
      
      snapshot.forEach((doc) => {
        try {
          const data = doc.data();
          
          // Make sure we have valid data
          if (!data) {
            console.warn(`Empty document data for message ${doc.id}`);
            return; // Skip this document
          }
          
          const messageData: FirebaseMessage = {
            ...data,
            messageId: doc.id,
            // Ensure these fields are defined even if missing in the document
            text: data.text || '',
            readBy: data.readBy || {},
            deliveredTo: data.deliveredTo || {},
            // Convert timestamp to a consistent format if it exists
            timestamp: data.timestamp || serverTimestamp()
          } as FirebaseMessage;
          
          messages.push(messageData);
        } catch (docError) {
          console.error(`Error processing message document ${doc.id}:`, docError);
          // Skip problematic documents but continue processing others
        }
      });
      
      callback(messages);
    }, (error) => {
      console.error('Error getting messages from top-level collection:', error);
      callback([]);
    });
  } catch (error) {
    console.error('Error setting up messages listener for top-level collection:', error);
    callback([]);
    return () => {}; // Return empty unsubscribe function
  }
};
