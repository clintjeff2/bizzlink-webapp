"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { Navigation } from "@/components/navigation"
import { ConversationList } from "@/components/messages-components/conversation-list"
import { ChatHeader } from "@/components/messages-components/chat-header"
import { MessageList } from "@/components/messages-components/message-list"
import { MessageInput } from "@/components/messages-components/message-input"
import { MessagesWelcome } from "@/components/messages-components/messages-welcome"
import { CornerUpRight } from "lucide-react"
import { useMessages } from "@/lib/hooks/useMessages"
import { formatMessageTime, formatLastActive } from "@/lib/utils/messageUtils"

export default function MessagesPage() {
  // Use our custom messages hook
  const { 
    conversations,
    allConversations,
    messages,
    selectedConversation,
    selectConversation,
    sendMessage,
    updateTyping,
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
    currentUserId
  } = useMessages()
  
  // Error handling state
  const [localError, setLocalError] = useState<string | null>(null)

  // Helper function to extract progress percentage from upload status
  const extractProgressFromStatus = (status: string): number => {
    const match = status.match(/(\d+)%/);
    return match ? parseInt(match[1], 10) : 0;
  }
  
  // Handle sending a new message
  const handleSendMessage = async (text: string, attachments: File[]) => {
    try {
      // Reset any local error
      setLocalError(null)
      
      // Call the hook's sendMessage function
      await sendMessage(text, attachments)
    } catch (err) {
      console.error('Error sending message:', err)
      setLocalError('Failed to send message. Please try again.')
      
      // Clear error after 3 seconds
      setTimeout(() => setLocalError(null), 3000)
    }
  }
  
  // Handle typing state
  const handleTyping = (isTyping: boolean) => {
    try {
      updateTyping(isTyping)
    } catch (err) {
      console.error('Error updating typing status:', err)
      // Don't show error for typing issues as they're non-critical
    }
  }
  
  // Clear error on component mount/unmount
  useEffect(() => {
    return () => {
      setLocalError(null)
    }
  }, [])

  // Get users who are typing in the current conversation
  const getTypingUsers = () => {
    if (!selectedConversation || !presences) return [];
    
    const typingUsers = [];
    
    for (const userId in presences) {
      const presence = presences[userId];
      
      try {
        // Check if user is typing in this conversation
        if (
          presence?.typingIn?.conversationId === selectedConversation?.conversationId &&
          // Ensure it's not the current user
          userId !== selectedConversation?.createdBy
        ) {
          // Find user info from the conversation
          let userName = 'User';
          let avatar = '/placeholder-user.jpg';
          
          if (userId === selectedConversation?.clientId) {
            userName = selectedConversation?.name || 'Client';
            avatar = selectedConversation?.avatar || '/placeholder-user.jpg';
          } else if (userId === selectedConversation?.freelancerId) {
            userName = selectedConversation?.name || 'Freelancer';
            avatar = selectedConversation?.avatar || '/placeholder-user.jpg';
          }
          
          typingUsers.push({
            userId,
            name: userName,
            avatar
          });
        }
      } catch (err) {
        console.error('Error processing typing user:', err);
        // Continue to the next user on error
      }
    }
    
    return typingUsers;
  }

  return (
    <div className="h-screen bg-gray-50 overflow-hidden">
      <Navigation />

      {loading ? (
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <Spinner size="lg" />
        </div>
      ) : error && !localError ? (
        <div className="flex items-center justify-center h-[calc(100vh-64px)] text-center p-4">
          <div>
            <p className="text-red-500 font-medium mb-2">Error loading messages</p>
            <p className="text-gray-500">{error}</p>
          </div>
        </div>
      ) : (
        <div className="max-w-[1600px] mx-auto px-2 sm:px-4 lg:px-6 py-2 xs:py-3 sm:py-4 lg:py-6 h-[calc(100vh-64px)] flex flex-col">
          <div className="mb-2 sm:mb-3 lg:mb-4 hidden xs:flex justify-between items-center">
            <div>
              <p className="text-sm sm:text-base text-gray-600">Communicate with your freelancers and clients</p>
            </div>
            {showMessages && isMobileView() && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleBackToConversations}
                className="lg:hidden"
              >
                <CornerUpRight className="w-4 h-4 mr-1" /> Back
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 xs:gap-3 sm:gap-4 lg:gap-6 flex-1 overflow-hidden">
            {/* Conversations List */}
            <ConversationList 
              conversations={conversations}
              allConversations={allConversations}
              selectedConversation={selectedConversation}
              setSelectedConversation={selectConversation}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              isUserOnline={isUserOnline}
              getUnreadCount={getUnreadCount}
              formatMessageTime={formatMessageTime}
              showConversations={showConversations}
              isMobileView={isMobileView}
              presences={presences}
              currentUserId={currentUserId}
            />

            {/* Chat Area */}
            <div 
              className={`lg:col-span-8 h-full overflow-hidden ${
                (showMessages || !isMobileView()) ? 'block' : 'hidden lg:block'
              }`}
            >
              <Card className="border-0 shadow-lg h-full flex flex-col">
                {showWelcomeScreen ? (
                  <MessagesWelcome />
                ) : (
                  <div className="flex flex-col h-full overflow-hidden">
                    {/* Chat Header - Always render the header, it will handle null case internally */}
                    <ChatHeader 
                      selectedConversation={selectedConversation}
                      isUserOnline={isUserOnline}
                      formatLastActive={formatLastActive}
                      handleBackToConversations={handleBackToConversations}
                      isMobileView={isMobileView}
                    />
                    
                    {/* Message List - This component should scroll independently */}
                    <div className="flex-1 overflow-hidden">
                      <MessageList 
                        messages={messages} // messages already contains the selected conversation's messages
                        selectedConversation={selectedConversation}
                        typingUsers={selectedConversation ? getTypingUsers() : []}
                      />
                    </div>
                    
                    {/* Message Input - Fixed at the bottom, only show if conversation selected */}
                    {selectedConversation && (
                      <div className="flex-shrink-0">
                        {/* Upload Status Display */}
                        {uploadStatus && (
                          <div className="px-4 py-2 bg-blue-50 border-l-4 border-blue-400 mx-4 mb-2 rounded">
                            <p className="text-sm text-blue-700">{uploadStatus}</p>
                          </div>
                        )}
                        
                        {/* Upload Error Display */}
                        {localError && (
                          <div className="px-4 py-2 bg-red-50 border-l-4 border-red-400 mx-4 mb-2 rounded">
                            <p className="text-sm text-red-700">{localError}</p>
                          </div>
                        )}
                        
                        <MessageInput 
                          onSendMessage={handleSendMessage}
                          onTyping={handleTyping}
                          isUploading={!!uploadStatus}
                          uploadProgress={uploadStatus ? extractProgressFromStatus(uploadStatus) : 0}
                          uploadError={null}
                        />
                      </div>
                    )}
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
