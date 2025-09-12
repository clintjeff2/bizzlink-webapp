"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { 
  CheckCheck,
  Reply,
  Forward,
  MoreVertical,
  Play,
  FileText,
} from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface MessageAttachment {
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
}

interface AudioMessageData {
  duration: number;
  waveformData: number[];
  transcription?: string;
}

interface MessageAction {
  actionId: string;
  actionType: string;
  label: string;
  value: string;
  style: string;
}

interface MessageReactionUser {
  userId: string;
  reaction: string;
  timestamp: Date;
}

interface MessageProps {
  messageId: string;
  conversationId: string;
  senderId: string;
  senderType: string;
  text: string;
  type: string;
  status: string;
  timestamp: Date;
  readBy: Record<string, Date>;
  deliveredTo: Record<string, Date>;
  attachments?: MessageAttachment[];
  audioMessage?: AudioMessageData;
  actions?: MessageAction[];
  reactions?: Record<string, MessageReactionUser[]>;
  // UI-specific properties
  sender: string;
  isOwn: boolean;
  avatar: string;
}

interface MessageBubbleProps {
  message: MessageProps;
  formatMessageTime: (date: Date) => string;
}

export function MessageBubble({ message, formatMessageTime }: MessageBubbleProps) {
  return (
    <div className={`flex ${message.isOwn ? "justify-end" : "justify-start"} group`}>
      <div
        className={`flex items-start space-x-1 sm:space-x-2 max-w-[75%] sm:max-w-xs md:max-w-md lg:max-w-lg ${message.isOwn ? "flex-row-reverse space-x-reverse sm:space-x-reverse" : ""}`}
      >
        <Avatar className="h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0">
          <AvatarImage
            src={message.avatar || "/placeholder.svg"}
            alt={message.sender || "User"}
          />
          <AvatarFallback>{message.sender?.charAt(0) || "U"}</AvatarFallback>
        </Avatar>
        
        <div className="space-y-1">
          {/* Message content - different rendering based on type */}
          <div
            className={cn(
              "rounded-2xl px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base",
              message.isOwn ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900",
              message.type === "system" && "bg-gray-200 text-gray-700 italic"
            )}
          >
            {/* Text content */}
            {message.text && <p className="text-sm whitespace-pre-wrap break-words">{message.text}</p>}
            
            {/* Image attachment */}
            {message.type === "image" && message.attachments?.[0] && (
              <div className="mt-2">
                <div className="relative group/image">
                  <Image 
                    src={message.attachments[0].fileUrl}
                    alt={message.attachments[0].fileName || "Image"}
                    width={300}
                    height={200}
                    className="rounded-lg max-w-full object-cover cursor-pointer"
                    style={{ maxHeight: "200px" }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover/image:bg-opacity-30 transition-all duration-200 flex items-center justify-center opacity-0 group-hover/image:opacity-100">
                    <Button 
                      size="sm" 
                      variant="secondary" 
                      className="bg-white text-gray-900"
                    >
                      View Full Size
                    </Button>
                  </div>
                </div>
                <p className={`text-xs mt-1 ${message.isOwn ? "text-blue-100" : "text-gray-500"}`}>
                  {message.attachments[0].fileName} • {(message.attachments[0].fileSize / 1024 / 1024).toFixed(1)} MB
                </p>
              </div>
            )}
            
            {/* Video attachment */}
            {message.type === "video" && message.attachments?.[0] && (
              <div className="mt-2 flex flex-col space-y-2">
                <div className="relative group/video rounded-lg overflow-hidden">
                  <div className="relative">
                    <Image 
                      src={(message.attachments[0]).thumbnailUrl || "/placeholder.jpg"}
                      alt={message.attachments[0].fileName || "Video"}
                      width={320}
                      height={180}
                      className="w-full object-cover"
                      style={{ maxHeight: "180px" }}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                      <div className="rounded-full bg-white bg-opacity-80 p-3">
                        <Play className="h-6 w-6 text-gray-900" />
                      </div>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 px-2 py-1 rounded text-xs text-white">
                      {Math.floor(((message.attachments[0]).duration || 0) / 60)}:
                      {(((message.attachments[0]).duration || 0) % 60).toString().padStart(2, '0')}
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover/video:bg-opacity-30 transition-all duration-200 flex items-center justify-center opacity-0 group-hover/video:opacity-100">
                    <Button 
                      size="sm" 
                      variant="secondary" 
                      className="bg-white text-gray-900"
                    >
                      Play Video
                    </Button>
                  </div>
                </div>
                <p className={`text-xs ${message.isOwn ? "text-blue-100" : "text-gray-500"}`}>
                  {message.attachments[0].fileName} • {(message.attachments[0].fileSize / 1024 / 1024).toFixed(1)} MB
                </p>
              </div>
            )}
            
            {/* File attachment */}
            {message.type === "file" && message.attachments?.[0] && (
              <div className={`mt-2 flex items-center p-2 rounded bg-opacity-10 ${message.isOwn ? "bg-white" : "bg-gray-700"}`}>
                <FileText className={`h-6 w-6 mr-2 ${message.isOwn ? "text-white" : "text-gray-600"}`} />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${message.isOwn ? "text-white" : "text-gray-900"}`}>
                    {message.attachments[0].fileName}
                  </p>
                  <p className={`text-xs ${message.isOwn ? "text-blue-100" : "text-gray-500"}`}>
                    {(message.attachments[0].fileSize / 1024 / 1024).toFixed(1)} MB
                  </p>
                </div>
                <Button 
                  size="sm" 
                  variant={message.isOwn ? "outline" : "default"} 
                  className={message.isOwn ? "border-white text-white hover:bg-blue-700" : ""}
                >
                  Download
                </Button>
              </div>
            )}
            
            {/* Audio message */}
            {message.type === "audio" && message.audioMessage && (
              <div className="mt-2 flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                  <Button size="sm" variant={message.isOwn ? "outline" : "ghost"} className="h-8 w-8 p-0">
                    <Play className="h-4 w-4" />
                  </Button>
                  <div className="flex-1">
                    <div className="flex space-x-1 h-4">
                      {message.audioMessage.waveformData.map((amp: number, i: number) => (
                        <div 
                          key={i}
                          className={`w-0.5 rounded-full ${message.isOwn ? "bg-blue-200" : "bg-blue-600"}`}
                          style={{ height: `${amp * 16}px` }}
                        ></div>
                      ))}
                    </div>
                  </div>
                  <span className={`text-xs ${message.isOwn ? "text-blue-100" : "text-gray-600"}`}>
                    {Math.floor(message.audioMessage.duration / 60)}:
                    {(message.audioMessage.duration % 60).toString().padStart(2, '0')}
                  </span>
                </div>
                {message.audioMessage.transcription && (
                  <p className={`text-xs italic ${message.isOwn ? "text-blue-100" : "text-gray-500"}`}>
                    {message.audioMessage.transcription}
                  </p>
                )}
              </div>
            )}
          
            {/* Interactive buttons */}
            {message.actions && message.actions.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {message.actions.map((action: MessageAction) => (
                  <Button 
                    key={action.actionId}
                    size="sm" 
                    variant={action.style === "primary" ? "default" : "outline"}
                    className={`text-xs ${message.isOwn && action.style === "primary" ? "bg-white text-blue-600 hover:bg-gray-100" : ""}`}
                  >
                    {action.label}
                  </Button>
                ))}
              </div>
            )}
          </div>
          
          {/* Message metadata */}
          <div
            className={`flex items-center justify-between mt-1 text-xs ${
              message.isOwn ? "text-blue-100" : "text-gray-500"
            }`}
          >
            <span>{formatMessageTime(message.timestamp)}</span>
            {message.isOwn && (
              <div className="flex items-center space-x-1">
                {message.status === "sending" && <span className="text-[10px]">Sending...</span>}
                {/* Check both status and readBy for accurate read detection */}
                {(message.status === "sent" || message.status === "delivered") && 
                 (!message.readBy || Object.keys(message.readBy).length === 0) && 
                 <CheckCheck className="w-3 h-3" />}
                {(message.status === "read" || (message.readBy && Object.keys(message.readBy).length > 0)) && 
                 <CheckCheck className="w-3 h-3 text-green-600" />}
              </div>
            )}
          </div>
        </div>
        
        {/* Reactions */}
        {message.reactions && Object.keys(message.reactions).length > 0 && (
          <div 
            className={`flex ${message.isOwn ? "justify-end" : "justify-start"}`}
          >
            <div className="flex items-center space-x-1 bg-white rounded-full px-2 py-0.5 shadow-sm border border-gray-100">
              {Object.entries(message.reactions).flatMap(([reactionType, users]) => 
                (users as MessageReactionUser[]).map((user: MessageReactionUser) => (
                  <span key={`${user.userId}-${reactionType}`} className="text-sm">{user.reaction}</span>
                ))
              )}
              <span className="text-xs text-gray-500">
                {Object.values(message.reactions).flat().length}
              </span>
            </div>
          </div>
        )}
        
        {/* Reply & Forward options - shown on hover */}
        <div 
          className={`flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity ${
            message.isOwn ? "justify-end" : "justify-start"
          }`}
        >
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 rounded-full">
            <Reply className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 rounded-full">
            <Forward className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 rounded-full">
            <MoreVertical className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}
