import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '../redux/hooks';
import { 
  getUserConversations, 
  getConversationMessages, 
  getMessagesFromTopLevelCollection,
  sendMessage, 
  markMessagesAsRead, 
  updateUserPresence, 
  findOrCreateConversation, 
  listenToUserPresence, 
  updateTypingStatus,
  FirebaseConversation, 
  FirebaseMessage, 
  Presence 
} from '../services/messageService';
import { enrichConversationData, enrichMessageData } from '../utils/messageUtils';
import { User } from '../redux/types/firebaseTypes';

export const useMessages = () => {
  const router = useRouter();
  const { user: currentUser, isAuthenticated } = useAppSelector(state => state.auth);
  
  // Refs to track initialization and prevent duplicate calls
  const initializedRef = useRef(false);
  const processingUrlRef = useRef(false);
  const subscriptionsRef = useRef<{[key: string]: boolean}>({});
  const authReadyRef = useRef(false);
  
  // Track loaded user IDs to avoid unnecessary re-fetching
  const loadedUserIdsRef = useRef<Set<string>>(new Set());
  
  // Track current users to access latest state in closures
  const usersRef = useRef<Record<string, User>>({});
  
  const [conversations, setConversations] = useState<FirebaseConversation[]>([]);
  const [messages, setMessages] = useState<Record<string, FirebaseMessage[]>>({});
  const [users, setUsers] = useState<Record<string, User>>({});
  const [presences, setPresences] = useState<Record<string, Presence>>({});
  
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  
  // Mobile view state
  const [showConversations, setShowConversations] = useState(true);
  const [showMessages, setShowMessages] = useState(false);
  const [showWelcomeScreen, setShowWelcomeScreen] = useState(false);

  // Determine if we're on a small screen (mobile view)
  const isMobileView = useCallback(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth < 1024;
    }
    return false;
  }, []);
  
  // Track when authentication is ready
  useEffect(() => {
    if (isAuthenticated && currentUser?.userId) {
      authReadyRef.current = true;
      
      // Reset initialization status to allow reloading conversations
      // if auth changed and we previously initialized
      if (initializedRef.current) {
        initializedRef.current = false;
        // Reset refs when auth changes
        initialConversationCountRef.current = null;
        autoSelectRunRef.current = false;
      }
    } else {
      // Reset loading if auth is not ready
      setLoading(false);
    }
  }, [isAuthenticated, currentUser?.userId]);
  
  // Handle page load and reset state
  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleLoad = () => {
        // Reset state on page load to ensure clean initialization
        initializedRef.current = false;
        processingUrlRef.current = false;
        subscriptionsRef.current = {};
        conversationsLoadedRef.current = false;
        authReadyRef.current = false;
        initialConversationCountRef.current = null;
        autoSelectRunRef.current = false;
        
        // Wait a brief moment to ensure auth state has been loaded
        setTimeout(() => {
          if (isAuthenticated && currentUser?.userId) {
            authReadyRef.current = true;
          }
        }, 100);
      };
      
      window.addEventListener('load', handleLoad);
      
      return () => {
        window.removeEventListener('load', handleLoad);
      };
    }
  }, [isAuthenticated, currentUser]);
  
  // Track when conversations are loaded
  const conversationsLoadedRef = useRef(false);
  
  // Track initial conversation count to avoid re-processing URL params
  const initialConversationCountRef = useRef<number | null>(null);
  
  // Track if auto-select has run to prevent repeated execution
  const autoSelectRunRef = useRef(false);
  
  // Load conversations from Firebase
  useEffect(() => {
    let unsubscribeConversations: (() => void) | undefined;
    
    // Make sure we load conversations whenever auth is ready
    if (isAuthenticated && currentUser && currentUser.userId) {
      setLoading(true);
      initializedRef.current = true;
      
      // Set online status
      updateUserPresence(currentUser.userId, 'online');
      
      // Subscribe to conversations
      unsubscribeConversations = getUserConversations(currentUser.userId, async (fbConversations) => {
        // Create a map of existing conversations for quick lookup
        const existingConversationsMap = new Map<string, FirebaseConversation>();
        conversations.forEach(conv => {
          existingConversationsMap.set(conv.conversationId, conv);
        });
        
        // Identify new conversations that need user data fetching
        const newConversations = fbConversations.filter(conv => 
          !existingConversationsMap.has(conv.conversationId)
        );
        
        // For new conversations, collect user IDs that we need to fetch
        const newUserIds = new Set<string>();
        newConversations.forEach(conv => {
          conv.participants.forEach(userId => {
            if (userId !== currentUser.userId && userId !== 'system') {
              newUserIds.add(userId);
            }
          });
        });
        
        // Only fetch user data if we have new conversations with missing user data
        const missingUserIds = Array.from(newUserIds).filter(userId => 
          !usersRef.current[userId] && !loadedUserIdsRef.current.has(userId)
        );
        
        // Use current users state as the base for enrichment
        let usersForEnrichment = { ...usersRef.current };
        
        // Only fetch missing user data if needed for new conversations
        if (missingUserIds.length > 0) {
          try {
            const { getUsersByIds } = await import('../services/userService');
            const fetchedUsers = await getUsersByIds(missingUserIds);
            
            // Merge fetched users with existing users
            usersForEnrichment = {
              ...usersForEnrichment,
              ...fetchedUsers
            };
            
            // Mark these users as loaded
            missingUserIds.forEach(userId => {
              if (fetchedUsers[userId]) {
                loadedUserIdsRef.current.add(userId);
              }
            });
            
            // Update users state only if we fetched new users
            setUsers(usersForEnrichment);
          } catch (error) {
            // Failed to fetch users, continue with available data
          }
        }
        
        // Smart enrichment: preserve existing conversation data, only update necessary fields
        const enrichedConversations = fbConversations.map(conv => {
          const existingConv = existingConversationsMap.get(conv.conversationId);
          
          if (existingConv) {
            // For existing conversations, only update lastMessage and metadata, 
            // preserve the already enriched user data (name, avatar, etc.)
            return {
              ...existingConv,
              lastMessage: conv.lastMessage,
              unreadCount: conv.unreadCount,
              updatedAt: conv.updatedAt,
              pinned: conv.pinned,
              isArchived: conv.isArchived,
              isMuted: conv.isMuted,
              participants: conv.participants, // Update participants in case they changed
              // Keep the enriched name, avatar, and role from existing conversation
            };
          } else {
            // For new conversations, do full enrichment
            return enrichConversationData(conv, currentUser, usersForEnrichment);
          }
        });
        
        // Sort conversations by last message timestamp BEFORE setting state to prevent flickering
        enrichedConversations.sort((a, b) => {
          const timestampA = a.lastMessage?.timestamp?.toMillis?.() || 0;
          const timestampB = b.lastMessage?.timestamp?.toMillis?.() || 0;
          return timestampB - timestampA;
        });
        
        // Use functional state update to ensure we're working with the latest state
        setConversations(prevConversations => {
          // Double-check sorting to prevent any race conditions
          const finalSorted = [...enrichedConversations].sort((a, b) => {
            const timestampA = a.lastMessage?.timestamp?.toMillis?.() || 0;
            const timestampB = b.lastMessage?.timestamp?.toMillis?.() || 0;
            return timestampB - timestampA;
          });
          return finalSorted;
        });
        
        // Mark conversations as loaded and track initial count
        conversationsLoadedRef.current = true;
        if (initialConversationCountRef.current === null) {
          initialConversationCountRef.current = enrichedConversations.length;
        }
        
        // Listen to presence for all participants (only if we have new conversations)
        if (newConversations.length > 0 || conversations.length === 0) {
          const allUserIds = new Set<string>();
          fbConversations.forEach(conv => {
            conv.participants.forEach(userId => {
              if (userId !== currentUser.userId && userId !== 'system') {
                allUserIds.add(userId);
              }
            });
          });
          const unsubPresence = listenToUserPresence(Array.from(allUserIds), setPresences);
        }
        
        setLoading(false);
      });
      
      // Set offline status on unmount
      return () => {
        if (unsubscribeConversations) {
          unsubscribeConversations();
        }
        updateUserPresence(currentUser.userId, 'offline');
      };
    } else {
      // Make sure we don't show perpetual loading
      setLoading(false);
    }
    // Remove authReadyRef.current dependency to prevent unnecessary conversation reloads
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.userId, isAuthenticated]);
  
  // Process URL parameters and create or select conversation if needed
  useEffect(() => {
    // If we're already processing URL params, don't run this effect again
    if (processingUrlRef.current) {
      return;
    }
    
    // Wait for authentication to be ready before processing URL params
    if (!authReadyRef.current) {
      return;
    }
    
    // Wait for conversations to be loaded before processing URL params
    if (!conversationsLoadedRef.current) {
      // Add a failsafe for cases where conversations might not load
      if (loading) {
        // If we're still loading after a delay, let's proceed anyway
        // This prevents users from getting stuck in a loading state
        const timeoutId = setTimeout(() => {
          if (!conversationsLoadedRef.current && loading) {
            conversationsLoadedRef.current = true;
            setLoading(false);
          }
        }, 5000); // 5 second timeout
        
        return () => clearTimeout(timeoutId);
      }
      return;
    }
    
    const processUrlParams = async () => {
      processingUrlRef.current = true;
      
      if (!isAuthenticated || !currentUser || !currentUser.userId) {
        processingUrlRef.current = false;
        return;
      }
      
      try {
        // Get URL search params
        const url = new URL(window.location.href);
        const userParam = url.searchParams.get('user');
        const proposalParam = url.searchParams.get('proposal');
        
        // If both user and proposal parameters exist, find or create conversation
        if (userParam && proposalParam) {
          setLoading(true);
          
          // First check if we already have a conversation with this user and proposal
          const existingConversation = conversations.find(conv => {
            // Check if this is a conversation between the current user and the target user
            // related to the specified proposal
            const hasCurrentUser = conv.participants.includes(currentUser.userId);
            const hasTargetUser = conv.participants.includes(userParam);
            const hasProposal = conv.proposalId === proposalParam;
            
            return hasCurrentUser && hasTargetUser && hasProposal;
          });
          
          let conversationId;
          
          if (existingConversation) {
            conversationId = existingConversation.conversationId;
          } else {
            // Only create a new conversation if one doesn't exist
            // The findOrCreateConversation function will handle the determination of client vs freelancer roles
            conversationId = await findOrCreateConversation(
              currentUser,
              userParam,
              proposalParam
            );
          }
          
          // Select the conversation
          setSelectedConversationId(conversationId);
          
          // On mobile, show the message view
          if (isMobileView()) {
            setShowConversations(false);
            setShowMessages(true);
          } else {
            setShowConversations(true);
            setShowMessages(true);
          }
          
          setShowWelcomeScreen(false); // Hide welcome screen when we have a conversation
          setLoading(false);
        } else {
          // When accessing /messages without URL params, show the welcome screen
          setSelectedConversationId(null);
          setShowWelcomeScreen(true);
          setLoading(false);
          
          // UI visibility settings
          if (isMobileView()) {
            setShowConversations(true);
            setShowMessages(false);
          } else {
            setShowConversations(true);
            setShowMessages(true);
          }
        }
      } catch (err) {
        // Error processing URL params
        setError('Failed to load conversation');
        setLoading(false);
      } finally {
        processingUrlRef.current = false;
      }
    };
    
    processUrlParams();
    
    // Add cleanup function
    return () => {
      processingUrlRef.current = false;
    };
    
    // Add dependencies to ensure this runs when conversations are loaded
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.userId, isAuthenticated, isMobileView, authReadyRef.current, conversationsLoadedRef.current, initialConversationCountRef.current]);
  
  // Load messages for selected conversation
  useEffect(() => {
    let unsubscribeMessages: (() => void) | undefined;
    
    // Don't attempt to load messages if auth isn't ready
    if (!authReadyRef.current) {
      return;
    }
    
    if (selectedConversationId && isAuthenticated && currentUser && currentUser.userId) {
      // Prevent multiple subscriptions to the same conversation
      if (subscriptionsRef.current[selectedConversationId]) {
        return;
      }
      
      subscriptionsRef.current[selectedConversationId] = true;
      
      // Get messages for the selected conversation
      unsubscribeMessages = getConversationMessages(
        selectedConversationId, 
        (fbMessages) => {
          const enrichedMessages = fbMessages.map(msg => 
            enrichMessageData(msg, currentUser, usersRef.current));
          
          setMessages(prev => ({
            ...prev,
            [selectedConversationId]: enrichedMessages
          }));
          
          // Mark messages as read only if there are unread messages and user is active
          if (currentUser && fbMessages.length > 0) {
            // Check if there are any unread messages
            const hasUnreadMessages = fbMessages.some(msg => 
              msg.senderId !== currentUser.userId && 
              (!msg.readBy || !msg.readBy[currentUser.userId])
            );
            
            if (hasUnreadMessages) {
              try {
                markMessagesAsRead(selectedConversationId, currentUser.userId);
              } catch (error) {
                // Error marking messages as read
              }
            }
          }
        }
      );
      
      setShowWelcomeScreen(false);
    }
    
    return () => {
      if (unsubscribeMessages) {
        unsubscribeMessages();
        
        // Remove the subscription reference
        if (selectedConversationId) {
          delete subscriptionsRef.current[selectedConversationId];
        }
      }
    };
    // Include authReadyRef.current to respond to auth state changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedConversationId, isAuthenticated, currentUser?.userId, authReadyRef.current]);
  
  // Handle cases where conversations are loaded but no conversation is selected
  useEffect(() => {
    // Only run this when loading is done, conversations are loaded, and no URL params are being processed
    // Also only run this once to avoid repeated execution
    if (!loading && conversationsLoadedRef.current && !processingUrlRef.current && 
        !selectedConversationId && isAuthenticated && currentUser?.userId &&
        !autoSelectRunRef.current) {
      
      autoSelectRunRef.current = true;
      
      // If no conversation is selected but we have conversations, show the welcome screen
      if (conversations.length === 0) {
        setShowWelcomeScreen(true);
      } else if (conversations.length === 1) {
        // If there's only one conversation, select it automatically
        setSelectedConversationId(conversations[0].conversationId);
        setShowWelcomeScreen(false);
      } else {
        // If there are multiple conversations but none selected, show welcome screen
        setShowWelcomeScreen(true);
      }
    }
  }, [loading, conversations.length, selectedConversationId, isAuthenticated, currentUser?.userId, conversationsLoadedRef.current]);
  
  // Handle sending a new message
  const handleSendMessage = useCallback(async (text: string, attachments: File[] = []) => {
    if (!selectedConversationId || !currentUser) {
      return Promise.reject(new Error('No conversation selected or user not logged in'));
    }
    
    // Validate that there's either text or attachments
    if (text.length === 0 && attachments.length === 0) {
      setError('Message cannot be empty');
      return Promise.reject(new Error('Message cannot be empty'));
    }
    
    // Return a promise so we can handle it in the UI
    return new Promise(async (resolve, reject) => {
      try {
        // Show loading state (could add UI indicator here)
        setError(null);
        
        // Stop typing indicator
        await updateTypingStatus(currentUser.userId, null);
        
        // Determine message type based on attachments
        let messageType: FirebaseMessage['type'] = 'text';
        let uploadedAttachments: any[] = [];
        
        // If there are attachments, upload them first
        if (attachments.length > 0) {
          // Set message type based on first attachment type
          const firstAttachment = attachments[0];
          if (firstAttachment.type.startsWith('image/')) {
            messageType = 'image';
          } else if (firstAttachment.type.startsWith('video/')) {
            messageType = 'video';
          } else if (firstAttachment.type.startsWith('audio/')) {
            messageType = 'audio';
          } else {
            messageType = 'file';
          }
          
          // Show uploading message using upload status, not error
          setUploadStatus(`Uploading ${attachments.length > 1 ? 'files' : 'file'}...`);
          
          // Upload files to Firebase Storage
          try {
            const { uploadMessageAttachment } = await import('../services/storageService');
            
            // Initialize progress tracking
            setUploadStatus(`Preparing ${attachments.length} ${attachments.length === 1 ? 'file' : 'files'} for upload...`);
            
            // Process attachments in parallel with individual progress tracking
            const uploadPromises = attachments.map((file, index) => 
              uploadMessageAttachment(selectedConversationId, file, (progress) => {
                // Update UI with progress for this specific file
                setUploadStatus(`Uploading ${file.name}: ${Math.round(progress)}% (${index + 1}/${attachments.length})`);
              }).catch(err => {
                // Error uploading file
                return null; // Return null for failed uploads so we can filter them out
              })
            );
            
            // Wait for all uploads to complete
            uploadedAttachments = await Promise.all(uploadPromises);
            
            // Filter out any failed uploads
            uploadedAttachments = uploadedAttachments.filter(attachment => 
              attachment !== null && attachment !== undefined
            );
            
            // Show success or partial success message
            if (uploadedAttachments.length === 0) {
              setUploadStatus('All file uploads failed. Please try again.');
              return reject(new Error('All file uploads failed'));
            } else if (uploadedAttachments.length < attachments.length) {
              setUploadStatus(`Warning: ${attachments.length - uploadedAttachments.length} of ${attachments.length} files failed to upload.`);
              // Continue with the files that did upload successfully
            } else {
              // All uploads succeeded
              setUploadStatus(null);
            }
          } catch (uploadError) {
            // Error uploading attachments
            setUploadStatus('Failed to upload attachments');
            return reject(uploadError);
          }
        }
        
        // Prepare new message
        const newMessage: Omit<FirebaseMessage, 'messageId' | 'timestamp'> = {
          conversationId: selectedConversationId,
          senderId: currentUser.userId,
          senderType: currentUser.role,
          text: text, // Use the text as is
          type: messageType,
          status: 'sending',
          readBy: {},
          deliveredTo: {}
        };
        
        // Only add attachments field if we have successful uploads
        if (uploadedAttachments.length > 0) {
          newMessage.attachments = uploadedAttachments;
        }
        
        // Send the message to Firebase
        // This will store the message in both the conversation subcollection and top-level Messages collection
        const messageId = await sendMessage(selectedConversationId, newMessage);
        
        // Reset error and upload status if message sent successfully
        setError(null);
        setUploadStatus(null);
        resolve(messageId);
      } catch (err) {
        // Error sending message
        setError('Failed to send message');
        setUploadStatus(null); // Clear upload status on error too
        reject(err);
      }
    });
  }, [selectedConversationId, currentUser]);
  
  // Handle typing indicator
  const handleTyping = useCallback(async (isTyping: boolean) => {
    if (!currentUser || !selectedConversationId) return;
    
    try {
      await updateTypingStatus(
        currentUser.userId, 
        isTyping ? selectedConversationId : null
      );
    } catch (err) {
      // Error updating typing status
    }
  }, [currentUser, selectedConversationId]);
  
  // Check if user is online
  const isUserOnline = useCallback((userId: string) => {
    const presence = presences[userId];
    return presence?.status === 'online' || presence?.status === 'away';
  }, [presences]);
  
  // Get unread count for a conversation
  const getUnreadCount = useCallback((conversation: FirebaseConversation) => {
    if (!currentUser) return 0;
    return conversation.unreadCount?.[currentUser.userId] || 0;
  }, [currentUser]);
  
  // Handle back button click on mobile
  const handleBackToConversations = useCallback(() => {
    setShowConversations(true);
    setShowMessages(false);
  }, []);
  
  // Select a conversation
  const selectConversation = useCallback((conversationIdOrObj: string | FirebaseConversation) => {
    // Handle either a string ID or a conversation object
    const conversationId = typeof conversationIdOrObj === 'string' 
      ? conversationIdOrObj 
      : conversationIdOrObj.conversationId;
    
    setSelectedConversationId(conversationId);
    
    // On mobile, switch to messages view
    if (isMobileView()) {
      setShowConversations(false);
      setShowMessages(true);
    }
  }, [isMobileView]);
  
  // Find selected conversation object
  const selectedConversation = selectedConversationId 
    ? conversations.find(c => c.conversationId === selectedConversationId) || null
    : null;
  
  // Get messages for selected conversation
  const selectedMessages = selectedConversationId ? messages[selectedConversationId] || [] : [];
  
  // Filter conversations based on tab
  const filteredConversations = conversations.filter(conversation => {
    // Tab filter
    let matchesTab = true;
    if (activeTab === 'unread') {
      matchesTab = getUnreadCount(conversation) > 0;
    } else if (activeTab === 'clients') {
      matchesTab = conversation.role === 'client';
    } else if (activeTab === 'freelancers') {
      matchesTab = conversation.role === 'freelancer';
    } else if (activeTab === 'pinned') {
      matchesTab = conversation.pinned;
    }
    
    return matchesTab;
  });
  
  // Sync users state with ref for use in closures
  useEffect(() => {
    usersRef.current = users;
  }, [users]);
  
  return {
    conversations: filteredConversations,
    allConversations: conversations, // Add unfiltered conversations for badge counting
    messages: selectedMessages,
    selectedConversation,
    selectConversation,
    sendMessage: handleSendMessage,
    updateTyping: handleTyping,
    loading,
    error,
    uploadStatus,
    activeTab,
    setActiveTab,
    isUserOnline,
    getUnreadCount,
    showConversations,
    showMessages,
    showWelcomeScreen,
    handleBackToConversations,
    isMobileView,
    presences,
    currentUserId: currentUser?.userId || ''
  };
};
