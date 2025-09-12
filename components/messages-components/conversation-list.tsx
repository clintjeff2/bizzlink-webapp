"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"

interface ConversationListProps {
  conversations: any[]
  allConversations: any[]
  activeTab: string
  setActiveTab: (tab: string) => void
  selectedConversation: any
  setSelectedConversation: (conversation: any) => void
  showConversations: boolean
  isMobileView: () => boolean
  formatMessageTime: (timestamp: any) => string
  getUnreadCount: (conversation: any) => number
  isUserOnline: (userId: string) => boolean
  presences?: Record<string, any>
  currentUserId?: string
}

export function ConversationList({
  conversations,
  allConversations,
  activeTab,
  setActiveTab,
  selectedConversation,
  setSelectedConversation,
  showConversations,
  isMobileView,
  formatMessageTime,
  getUnreadCount,
  isUserOnline,
  presences = {},
  currentUserId
}: ConversationListProps) {
  // The conversations are already filtered by the useMessages hook based on the activeTab
  const filteredConversations = conversations || [];

  // Calculate the number of conversations with unread messages for the badge
  const unreadConversationsCount = (allConversations || []).filter(conversation => 
    getUnreadCount(conversation) > 0
  ).length;

  return (
    <Card 
      className={`border-0 shadow-lg lg:col-span-4 h-full overflow-hidden ${
        (showConversations || !isMobileView()) ? 'block' : 'hidden lg:block'
      }`}
    >
      <CardContent className="p-0 h-full flex flex-col overflow-hidden">
        
        {/* Conversation Tabs */}
        <div className="border-b border-gray-200">
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <div className="px-2 sm:px-3 lg:px-4">
              <TabsList className="grid grid-cols-5 my-1 sm:my-2 h-8 sm:h-10">
                <TabsTrigger value="all" className="text-xs sm:text-sm px-0 sm:px-2">All</TabsTrigger>
                <TabsTrigger value="unread" className="text-xs sm:text-sm px-0 sm:px-2 relative">
                  <span>Unread</span>
                  {unreadConversationsCount > 0 && (
                    <Badge className="ml-1 h-4 w-auto min-w-4 px-1 text-xs leading-none bg-red-500 hover:bg-red-600">
                      {unreadConversationsCount}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="clients" className="text-xs sm:text-sm px-0 sm:px-2">Clients</TabsTrigger>
                <TabsTrigger value="freelancers" className="text-xs sm:text-sm px-0 sm:px-2">
                  <span className="hidden xs:inline">Freelancers</span>
                  <span className="inline xs:hidden">Freelc.</span>
                </TabsTrigger>
                <TabsTrigger value="pinned" className="text-xs sm:text-sm px-0 sm:px-2">Pinned</TabsTrigger>
              </TabsList>
            </div>
          </Tabs>
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
          {filteredConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-4 text-center">
              <Search className="h-10 w-10 sm:h-12 sm:w-12 text-gray-300 mb-2" />
              <h3 className="text-gray-500">No conversations found</h3>
              <p className="text-sm text-gray-400">Try adjusting your search or filters</p>
            </div>
          ) : (
            filteredConversations.map((conversation: any) => (
              <div
                key={conversation.conversationId}
                onClick={() => {
                  setSelectedConversation(conversation);
                  // On mobile, this will trigger the view change via useEffect
                }}
                className={cn(
                  "p-3 sm:p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors",
                  selectedConversation && selectedConversation.conversationId === conversation.conversationId ? "bg-blue-50 border-blue-200" : "",
                  conversation.unreadCount?.client1 > 0 ? "bg-blue-50/20" : "",
                  conversation.pinned ? "border-l-4 border-l-blue-500" : ""
                )}
              >
                <div className="flex items-start space-x-2 sm:space-x-3">
                  <div className="relative">
                    <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                      <AvatarImage
                        src={conversation.avatar || "/placeholder.svg"}
                        alt={conversation.name}
                      />
                      <AvatarFallback>{conversation.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {conversation.role === "freelancer" && isUserOnline(conversation.freelancerId) && (
                      <div className="absolute bottom-0 right-0 w-2 h-2 sm:w-3 sm:h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                    {conversation.role === "client" && isUserOnline(conversation.clientId) && (
                      <div className="absolute bottom-0 right-0 w-2 h-2 sm:w-3 sm:h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                    {conversation.role === "admin" && (
                      <div className="absolute bottom-0 right-0 w-2 h-2 sm:w-3 sm:h-3 bg-purple-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5 sm:mb-1">
                      <h3 className="text-xs sm:text-sm font-semibold text-gray-900 truncate">{conversation.name}</h3>
                      <div className="flex items-center space-x-1 sm:space-x-2">
                        <span className="text-xs text-gray-500">
                          {conversation.lastMessage?.timestamp ? 
                           formatMessageTime(conversation.lastMessage.timestamp) : ''}
                        </span>
                        {getUnreadCount(conversation) > 0 && (
                          <Badge className="bg-blue-500 hover:bg-blue-500 text-white text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5">
                            {getUnreadCount(conversation)}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 sm:space-x-2 mb-0.5 sm:mb-1">
                      <p className="text-[10px] sm:text-xs text-gray-600 truncate">{conversation.project}</p>
                      <Badge 
                        variant={conversation.type === "one_to_one" ? "outline" : 
                                conversation.type === "announcement" ? "secondary" : "default"} 
                        className="text-[10px] sm:text-xs"
                      >
                        {conversation.role}
                      </Badge>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-700 line-clamp-1 sm:line-clamp-2">
                      {conversation.lastMessage?.senderId !== currentUserId ? conversation.lastMessage?.text : "You: " + conversation.lastMessage?.text}
                    </p>
                    {/* Show typing indicator for the other participant */}
                    {conversation && presences && 
                      ((conversation.freelancerId && currentUserId === conversation.clientId && 
                        presences[conversation.freelancerId]?.typingIn?.conversationId === conversation.conversationId) || 
                       (conversation.clientId && currentUserId === conversation.freelancerId && 
                        presences[conversation.clientId]?.typingIn?.conversationId === conversation.conversationId)) ? (
                      <p className="text-[10px] sm:text-xs text-blue-500 mt-0.5 sm:mt-1">typing...</p>
                    ) : null}
                  </div>
                </div>
              </div>
            ))
          )}
        </ScrollArea>
        </div>
      </CardContent>
    </Card>
  )
}
