"use client"

import React, { useRef, useEffect } from "react"
import { MessageBubble } from "./message-bubble"
import { TypingIndicator } from "./typing-indicator"
import { Presence } from "@/lib/services/messageService"

interface MessageListProps {
  messages: any[];
  selectedConversation: any;
  typingUsers?: {
    userId: string;
    name: string;
    avatar: string;
  }[];
}

// Memoized component to prevent unnecessary re-renders
const MessageListComponent = ({ messages = [], selectedConversation, typingUsers = [] }: MessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }
  
  useEffect(() => {
    scrollToBottom()
  }, [messages])
  
  // If no selected conversation or no messages, show an empty state
  if (!selectedConversation) {
    return (
      <div className="flex items-center justify-center h-full p-4 text-center">
        <p className="text-gray-500">Select a conversation to view messages</p>
      </div>
    );
  }
  
  // Helper function to format message timestamp
  const formatMessageTime = (timestamp: any) => {
    if (!timestamp) return '';
    
    try {
      // Handle Firebase Timestamp objects
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return '';
      }
      
      return new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }).format(date);
    } catch (error) {
      return '';
    }
  }

  // Helper function to normalize timestamp to a Date object
  const normalizeTimestamp = (timestamp: any): Date => {
    if (!timestamp) return new Date(0);
    
    try {
      if (timestamp.toDate) {
        // Firebase Timestamp object
        return timestamp.toDate();
      } else if (timestamp instanceof Date) {
        // JavaScript Date object
        return timestamp;
      } else if (typeof timestamp === 'number') {
        // Unix timestamp in milliseconds
        return new Date(timestamp);
      } else if (timestamp.seconds) {
        // Firebase timestamp in seconds format
        return new Date(timestamp.seconds * 1000);
      } else {
        // Try to parse as a date string
        const date = new Date(timestamp);
        return isNaN(date.getTime()) ? new Date(0) : date;
      }
    } catch (error) {
      console.error("Error normalizing timestamp:", error);
      return new Date(0);
    }
  };

  // Helper function to group messages by date
  const groupMessagesByDate = (messages: any[]) => {
    const groups: Record<string, any[]> = {};
    
    // First sort messages by timestamp to ensure chronological order
    const sortedMessages = [...messages].sort((a, b) => {
      const dateA = normalizeTimestamp(a.timestamp);
      const dateB = normalizeTimestamp(b.timestamp);
      
      // Sort by scheduled time if available
      if (a.scheduledFor && b.scheduledFor) {
        const schedA = normalizeTimestamp(a.scheduledFor);
        const schedB = normalizeTimestamp(b.scheduledFor);
        return schedA.getTime() - schedB.getTime();
      }
      
      return dateA.getTime() - dateB.getTime();
    });
    
    // Process messages and group by date
    sortedMessages.forEach(msg => {
      let date: Date;
      
      // Use scheduled time for scheduled messages, otherwise use regular timestamp
      if (msg.scheduledFor) {
        date = normalizeTimestamp(msg.scheduledFor);
      } else {
        date = normalizeTimestamp(msg.timestamp);
      }
      
      // Format the date as a string for grouping
      const dateStr = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }).format(date);
      
      // Handle special case for today
      const today = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }).format(new Date());
      
      // Format differently if it's today
      const displayStr = dateStr === today ? 'Today' : dateStr;
      
      // Initialize group if needed
      if (!groups[displayStr]) {
        groups[displayStr] = [];
      }
      
      groups[displayStr].push(msg);
    });
    
    return groups;
  };

  // Group the messages by date
  const messageGroups = groupMessagesByDate(messages);
  
  return (
    <div className="flex-1 overflow-y-auto p-2 xs:p-3 sm:p-4 space-y-4 sm:space-y-6 lg:space-y-8 h-full">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-500 mb-2">No messages yet</p>
            <p className="text-sm text-gray-400">Start the conversation by sending a message</p>
          </div>
        </div>
      ) : (
        Object.entries(messageGroups).map(([date, msgs]) => {
          return (
            <div key={date} className="space-y-3 sm:space-y-4">
            <div className="flex justify-center">
              <span className="px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] xs:text-xs font-medium text-gray-500 bg-gray-100 rounded-full">
                {date}
              </span>
            </div>
            <div className="space-y-2 sm:space-y-3 md:space-y-4">
              {msgs.map((message) => {
                // Skip expired messages
                const now = new Date();
                if (message.expiresAt) {
                  const expireDate = normalizeTimestamp(message.expiresAt);
                  if (expireDate < now) {
                    return null;
                  }
                }
                
                // Skip scheduled messages that should not be visible yet
                if (message.scheduledFor) {
                  const scheduleDate = normalizeTimestamp(message.scheduledFor);
                  if (scheduleDate > now) {
                    return null;
                  }
                }
                
                // Create a stable key for each message
                const messageKey = message.messageId || 
                  `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
                  
                return (
                  <MessageBubble 
                    key={messageKey}
                    message={message} 
                    formatMessageTime={formatMessageTime}
                  />
                );
              })}
            </div>
          </div>
        );
        })
      )}
      
      {/* Typing indicators */}
      {typingUsers.length > 0 && (
        <div className="space-y-2">
          {typingUsers.map((user) => (
            <TypingIndicator
              key={user.userId}
              isTyping={true}
              userName={user.name}
              avatar={user.avatar}
            />
          ))}
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}

// Export memoized component to prevent unnecessary re-renders
export const MessageList = React.memo(MessageListComponent, (prevProps, nextProps) => {
  // Custom comparison function for more granular control
  return (
    prevProps.messages.length === nextProps.messages.length &&
    prevProps.selectedConversation?.conversationId === nextProps.selectedConversation?.conversationId &&
    prevProps.typingUsers?.length === nextProps.typingUsers?.length &&
    JSON.stringify(prevProps.messages.map(m => m.messageId)) === JSON.stringify(nextProps.messages.map(m => m.messageId))
  );
});
