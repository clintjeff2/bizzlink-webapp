"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/navigation"
import { Search, Send, Paperclip, MoreVertical, Phone, Video, CheckCheck } from "lucide-react"
import Image from "next/image"

const conversations = [
  {
    id: 1,
    name: "Sarah Chen",
    avatar: "/professional-woman-developer.png",
    lastMessage: "I've completed the homepage design. Please review and let me know your feedback.",
    time: "10 min ago",
    unread: 2,
    online: true,
    project: "E-commerce Website Development",
    role: "freelancer",
  },
  {
    id: 2,
    name: "Marcus Johnson",
    avatar: "/professional-man-designer.png",
    lastMessage: "The wireframes are ready for your review. I've incorporated all your feedback.",
    time: "2 hours ago",
    unread: 0,
    online: false,
    project: "Mobile App UI/UX Design",
    role: "freelancer",
  },
  {
    id: 3,
    name: "Elena Rodriguez",
    avatar: "/professional-woman-marketer.png",
    lastMessage: "Thank you for choosing me for your SEO project. When can we schedule a kickoff call?",
    time: "1 day ago",
    unread: 1,
    online: true,
    project: "SEO Optimization Campaign",
    role: "freelancer",
  },
  {
    id: 4,
    name: "TechStart Inc.",
    avatar: "/business-client.png",
    lastMessage: "Great work on the API integration. The payment system is working perfectly now.",
    time: "2 days ago",
    unread: 0,
    online: false,
    project: "Backend Development",
    role: "client",
  },
]

const messages = [
  {
    id: 1,
    sender: "Sarah Chen",
    content:
      "Hi! I've completed the homepage design for your e-commerce website. I've focused on creating a clean, modern layout that highlights your products effectively.",
    time: "2:30 PM",
    isOwn: false,
    avatar: "/professional-woman-developer.png",
  },
  {
    id: 2,
    sender: "Sarah Chen",
    content:
      "I've also implemented the responsive design so it looks great on all devices. Would you like to schedule a call to review it together?",
    time: "2:32 PM",
    isOwn: false,
    avatar: "/professional-woman-developer.png",
  },
  {
    id: 3,
    sender: "You",
    content:
      "This looks fantastic! I love the clean design and the way you've organized the product categories. The mobile version is perfect too.",
    time: "2:45 PM",
    isOwn: true,
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 4,
    sender: "You",
    content:
      "Let's schedule a call for tomorrow at 3 PM to discuss the next phase. Can you also show me how the shopping cart functionality will work?",
    time: "2:46 PM",
    isOwn: true,
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 5,
    sender: "Sarah Chen",
    content:
      "Perfect! I'll send you a calendar invite for tomorrow at 3 PM. I'll prepare a demo of the shopping cart functionality and show you the checkout process flow.",
    time: "3:15 PM",
    isOwn: false,
    avatar: "/professional-woman-developer.png",
  },
]

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState(conversations[0])
  const [newMessage, setNewMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.project.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const sendMessage = () => {
    if (newMessage.trim()) {
      // Add message logic here
      setNewMessage("")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Messages</h1>
          <p className="text-gray-600">Communicate with your freelancers and clients</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Conversations List */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-0 h-full flex flex-col">
              {/* Search */}
              <div className="p-4 border-b border-gray-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-0"
                  />
                </div>
              </div>

              {/* Conversations */}
              <div className="flex-1 overflow-y-auto">
                {filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation)}
                    className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedConversation.id === conversation.id ? "bg-blue-50 border-blue-200" : ""
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="relative">
                        <Image
                          src={conversation.avatar || "/placeholder.svg"}
                          alt={conversation.name}
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded-full"
                        />
                        {conversation.online && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="text-sm font-semibold text-gray-900 truncate">{conversation.name}</h3>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500">{conversation.time}</span>
                            {conversation.unread > 0 && (
                              <Badge className="bg-blue-500 hover:bg-blue-500 text-white text-xs px-2 py-0.5">
                                {conversation.unread}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 mb-1 truncate">{conversation.project}</p>
                        <p className="text-sm text-gray-700 line-clamp-2">{conversation.lastMessage}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Chat Area */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg h-full">
              <CardContent className="p-0 h-full flex flex-col">
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 bg-white rounded-t-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <Image
                          src={selectedConversation.avatar || "/placeholder.svg"}
                          alt={selectedConversation.name}
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded-full"
                        />
                        {selectedConversation.online && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{selectedConversation.name}</h3>
                        <div className="flex items-center space-x-2">
                          <p className="text-sm text-gray-600">{selectedConversation.project}</p>
                          <Badge variant="outline" className="text-xs">
                            {selectedConversation.role}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Phone className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Video className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className={`flex ${message.isOwn ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${message.isOwn ? "flex-row-reverse space-x-reverse" : ""}`}
                      >
                        <Image
                          src={message.avatar || "/placeholder.svg"}
                          alt={message.sender}
                          width={32}
                          height={32}
                          className="w-8 h-8 rounded-full"
                        />
                        <div
                          className={`rounded-2xl px-4 py-2 ${
                            message.isOwn ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <div
                            className={`flex items-center justify-between mt-1 ${
                              message.isOwn ? "text-blue-100" : "text-gray-500"
                            }`}
                          >
                            <span className="text-xs">{message.time}</span>
                            {message.isOwn && <CheckCheck className="w-3 h-3 ml-2" />}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200 bg-white rounded-b-lg">
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Paperclip className="w-4 h-4" />
                    </Button>
                    <div className="flex-1 relative">
                      <Input
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                        className="pr-12 border-gray-200 focus:border-blue-500 focus:ring-0"
                      />
                    </div>
                    <Button
                      onClick={sendMessage}
                      disabled={!newMessage.trim()}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
