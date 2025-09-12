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
  MapPin,
  Mic,
  Phone,
  Clock,
  Star,
  AlertTriangle,
  User,
  Video,
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
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
  subtype?: string;
  status: string;
  timestamp: Date;
  readBy: Record<string, Date>;
  deliveredTo: Record<string, Date>;
  
  // Rich text content
  richText?: {
    html: string;
    mentions: string[];
    links: string[];
  };
  
  // Media attachments
  attachments?: MessageAttachment[];
  audioMessage?: AudioMessageData;
  
  // Location data
  location?: {
    latitude: number;
    longitude: number;
    address: string;
    name: string;
  };
  
  // Message state flags
  isEdited?: boolean;
  isDeleted?: boolean;
  isForwarded?: boolean;
  originalMessageId?: string;
  isImportant?: boolean;
  
  // Threading support
  isReply?: boolean;
  replyToMessageId?: string;
  replyToSenderId?: string;
  replyPreview?: string;
  threadParticipants?: string[];
  
  // Interactive elements
  actions?: MessageAction[];
  reactions?: Record<string, MessageReactionUser[]>;
  
  // Timing metadata
  editedAt?: Date;
  deletedAt?: Date;
  expiresAt?: Date;
  scheduledFor?: Date;
  
  // UI-specific properties
  sender: string;
  isOwn: boolean;
  avatar: string;
  translation?: Record<string, string>;
}

interface MessageBubbleProps {
  message: MessageProps;
  formatMessageTime: (timestamp: any) => string;
}

export function MessageBubble({ message, formatMessageTime }: MessageBubbleProps) {
  return (
    <div className={`flex ${message.isOwn ? "justify-end" : "justify-start"} group w-full`}>
      <div
        className={`flex items-start space-x-1 sm:space-x-2 max-w-[85%] sm:max-w-[90%] md:max-w-[92%] lg:max-w-[95%] ${message.isOwn ? "flex-row-reverse space-x-reverse sm:space-x-reverse" : ""}`}
      >
        <Avatar className="h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0">
          <AvatarImage
            src={message.avatar || "/placeholder.svg"}
            alt={message.sender || "User"}
          />
          <AvatarFallback>{message.sender?.charAt(0) || "U"}</AvatarFallback>
        </Avatar>
        
        <div className="space-y-1 max-w-full overflow-hidden">
          {/* Message content - different rendering based on type */}
          <div
            className={cn(
              "rounded-2xl px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base ",
              message.isOwn ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900 ",
              message.type === "system" && "bg-gray-200 text-gray-700 italic",
              message.isDeleted && "bg-gray-100 text-gray-500 italic",
              message.isImportant && "border-2 border-amber-400"
            )}
          >
            {/* Flags for special message types */}
            {message.isImportant && (
              <div className={`flex items-center mb-1 ${message.isOwn ? "text-yellow-200" : "text-amber-500"}`}>
                <Star className="h-3 w-3 mr-1" />
                <span className="text-xs">Important</span>
              </div>
            )}
            
            {/* Text content */}
            {message.isDeleted ? (
              <p className="text-sm italic opacity-70">This message was deleted</p>
            ) : message.richText?.html ? (
              <div 
                className="text-sm whitespace-pre-wrap break-words max-w-full"
                dangerouslySetInnerHTML={{ __html: message.richText.html }}
              />
            ) : message.text ? (
              <p className="text-sm whitespace-pre-wrap break-words max-w-full">{message.text}</p>
            ) : null}
            
            {/* Reply indicator */}
            {message.isReply && message.replyPreview && (
              <div className={`mb-1 p-1 text-xs border-l-2 ${message.isOwn ? "border-blue-300" : "border-gray-400"} pl-2`}>
                <p className={`font-medium ${message.isOwn ? "text-blue-200" : "text-gray-600"}`}>
                  Replying to {message.replyToSenderId === message.senderId ? "yourself" : "another user"}
                </p>
                <p className="truncate">{message.replyPreview}</p>
              </div>
            )}
            
            {/* Image attachment */}
            {message.type === "image" && message.attachments?.[0] && (
              <div className="mt-2 max-w-full">
                <div className="relative group/image max-w-full">
                  {message.attachments[0].fileUrl ? (
                    <Image 
                      src={message.attachments[0].fileUrl}
                      alt={message.attachments[0].fileName || "Image"}
                      width={240}
                      height={160}
                      className="rounded-lg w-auto max-w-full object-cover cursor-pointer"
                      style={{ maxHeight: "160px" }}
                      onError={(e) => {
                        // Fallback on error
                        const target = e.target as HTMLImageElement;
                        target.src = "/placeholder.svg";
                        target.onerror = null; // Prevent infinite error loop
                      }}
                    />
                  ) : (
                    <div className="rounded-lg bg-gray-100 w-[240px] h-[160px] flex items-center justify-center">
                      <p className="text-gray-500 text-sm">Image not available</p>
                    </div>
                  )}
                  {message.attachments[0].fileUrl && (
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover/image:bg-opacity-30 transition-all duration-200 flex items-center justify-center opacity-0 group-hover/image:opacity-100">
                      <a 
                        href={message.attachments[0].fileUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="bg-white text-gray-900 text-xs px-2 py-1 rounded-md shadow hover:bg-gray-100"
                      >
                        View Full Size
                      </a>
                    </div>
                  )}
                </div>
                <p className={`text-[10px] sm:text-xs mt-1 truncate ${message.isOwn ? "text-blue-100" : "text-gray-500"}`}>
                  {message.attachments[0].fileName || "Image"} 
                  {message.attachments[0].fileSize && `• ${(message.attachments[0].fileSize / 1024 / 1024).toFixed(1)} MB`}
                </p>
              </div>
            )}
            
            {/* Video attachment */}
            {message.type === "video" && message.attachments?.[0] && (
              <div className="mt-2 flex flex-col space-y-1 max-w-full">
                <div className="relative group/video rounded-lg overflow-hidden">
                  <div className="relative max-w-full">
                    <Image 
                      src={message.attachments[0].thumbnailUrl || "/placeholder.jpg"}
                      alt={message.attachments[0].fileName || "Video"}
                      width={240}
                      height={135}
                      className="max-w-full object-cover"
                      style={{ maxHeight: "135px" }}
                      onError={(e) => {
                        // Fallback on error
                        const target = e.target as HTMLImageElement;
                        target.src = "/placeholder.svg";
                        target.onerror = null; // Prevent infinite error loop
                      }}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                      <div className="rounded-full bg-white bg-opacity-80 p-2 sm:p-3">
                        <Play className="h-4 w-4 sm:h-6 sm:w-6 text-gray-900" />
                      </div>
                    </div>
                    {message.attachments[0].duration && (
                      <div className="absolute bottom-1 sm:bottom-2 right-1 sm:right-2 bg-black bg-opacity-70 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded text-[10px] sm:text-xs text-white">
                        {Math.floor((message.attachments[0].duration || 0) / 60)}:
                        {((message.attachments[0].duration || 0) % 60).toString().padStart(2, '0')}
                      </div>
                    )}
                  </div>
                  {message.attachments[0].fileUrl && (
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover/video:bg-opacity-30 transition-all duration-200 flex items-center justify-center opacity-0 group-hover/video:opacity-100">
                      <a 
                        href={message.attachments[0].fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white text-gray-900 text-xs px-2 py-1 rounded-md shadow hover:bg-gray-100"
                      >
                        Play Video
                      </a>
                    </div>
                  )}
                </div>
                <p className={`text-xs ${message.isOwn ? "text-blue-100" : "text-gray-500"}`}>
                  {message.attachments[0].fileName || "Video"} 
                  {message.attachments[0].fileSize && `• ${(message.attachments[0].fileSize / 1024 / 1024).toFixed(1)} MB`}
                </p>
              </div>
            )}
            
            {/* Location message */}
            {message.type === "location" && message.location && (
              <div className="mt-2 w-full max-w-full overflow-hidden">
                <div className="relative group/location">
                  <div className="bg-gray-100 rounded-lg overflow-hidden w-full h-32 flex items-center justify-center">
                    <div className="absolute inset-0 bg-cover bg-center" 
                         style={{ 
                           backgroundImage: `url(https://maps.googleapis.com/maps/api/staticmap?center=${message.location.latitude},${message.location.longitude}&zoom=15&size=600x300&maptype=roadmap&markers=color:red%7C${message.location.latitude},${message.location.longitude}&key=YOUR_API_KEY)`,
                           opacity: 0.7
                         }}>
                    </div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-30 p-2 text-white text-center">
                      <MapPin className="h-6 w-6 mb-1" />
                      <div className="font-medium truncate max-w-full">{message.location.name}</div>
                      <div className="text-xs truncate max-w-full">{message.location.address}</div>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover/location:bg-opacity-20 transition-all duration-200 flex items-center justify-center opacity-0 group-hover/location:opacity-100">
                    <a 
                      href={`https://maps.google.com/?q=${message.location.latitude},${message.location.longitude}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-white text-gray-900 text-xs px-2 py-1 rounded-md shadow hover:bg-gray-100"
                    >
                      Open in Maps
                    </a>
                  </div>
                </div>
              </div>
            )}
            
            {/* Call log */}
            {message.type === "call_log" && (
              <div className="mt-1 flex items-center">
                {message.subtype === "video" ? (
                  <Video className={`h-4 w-4 mr-1.5 ${message.isOwn ? "text-blue-200" : "text-gray-500"}`} />
                ) : (
                  <Phone className={`h-4 w-4 mr-1.5 ${message.isOwn ? "text-blue-200" : "text-gray-500"}`} />
                )}
                <span className={`text-xs ${message.isOwn ? "text-blue-100" : "text-gray-500"}`}>
                  {message.text || "Call ended"}
                </span>
              </div>
            )}
            
            {/* File attachment */}
            {message.type === "file" && message.attachments?.[0] && (
              <div className={`mt-2 flex items-center p-2 rounded bg-opacity-10 ${message.isOwn ? "bg-white" : "bg-gray-700"} overflow-hidden`}>
                <FileText className={`h-4 w-4 sm:h-6 sm:w-6 mr-1 sm:mr-2 flex-shrink-0 ${message.isOwn ? "text-white" : "text-gray-600"}`} />
                <div className="flex-1 min-w-0 mr-1 sm:mr-2">
                  <p className={`text-xs sm:text-sm font-medium truncate ${message.isOwn ? "text-white" : "text-gray-900"}`}>
                    {message.attachments[0].fileName || "File"}
                  </p>
                  {message.attachments[0].fileSize && (
                    <p className={`text-[10px] sm:text-xs ${message.isOwn ? "text-blue-100" : "text-gray-500"}`}>
                      {(message.attachments[0].fileSize / 1024 / 1024).toFixed(1)} MB
                    </p>
                  )}
                </div>
                {message.attachments[0].fileUrl ? (
                  <a 
                    href={message.attachments[0].fileUrl} 
                    download={message.attachments[0].fileName}
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={`text-xs px-2 py-1 rounded ${message.isOwn 
                      ? "bg-transparent border border-white text-white hover:bg-blue-700" 
                      : "bg-blue-600 text-white hover:bg-blue-700"}`}
                  >
                    Download
                  </a>
                ) : (
                  <span className={`text-xs px-2 py-1 rounded ${message.isOwn 
                    ? "text-blue-100" 
                    : "text-gray-400"}`}
                  >
                    Unavailable
                  </span>
                )}
              </div>
            )}
            
            {/* Audio message */}
            {message.type === "audio" && message.audioMessage && (
              <div className="mt-2 flex flex-col space-y-1 max-w-full">
                <div className="flex items-center space-x-1 sm:space-x-2 max-w-full">
                  <Button size="sm" variant={message.isOwn ? "outline" : "ghost"} className="h-6 w-6 sm:h-8 sm:w-8 p-0 flex-shrink-0">
                    <Play className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                  <div className="flex-1 min-w-0 overflow-hidden">
                    <div className="flex space-x-0.5 sm:space-x-1 h-4 overflow-hidden">
                      {message.audioMessage.waveformData.slice(0, 30).map((amp: number, i: number) => (
                        <div 
                          key={i}
                          className={`w-0.5 rounded-full ${message.isOwn ? "bg-blue-200" : "bg-blue-600"}`}
                          style={{ height: `${amp * 12}px` }}
                        ></div>
                      ))}
                    </div>
                  </div>
                  <span className={`text-[10px] sm:text-xs flex-shrink-0 ${message.isOwn ? "text-blue-100" : "text-gray-600"}`}>
                    {Math.floor(message.audioMessage.duration / 60)}:
                    {(message.audioMessage.duration % 60).toString().padStart(2, '0')}
                  </span>
                </div>
                {message.audioMessage.transcription && (
                  <p className={`text-[10px] sm:text-xs italic truncate ${message.isOwn ? "text-blue-100" : "text-gray-500"}`}>
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
          
          {/* Message metadata with integrated Reply & Forward options */}
          <div
            className={`flex items-center justify-between mt-1 text-xs ${
              message.isOwn ? "text-gray-500" : "text-gray-500"
            }`}
          >
            <span>{formatMessageTime(message.timestamp)}</span>
            
            <div className="flex items-center space-x-1">
              {/* Reply & Forward options - shown on hover */}
              <div className="flex items-center space-x-0.5 sm:space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="sm" className="h-5 w-5 p-0 rounded-full">
                  <Reply className="h-2.5 w-2.5" />
                </Button>
                <Button variant="ghost" size="sm" className="h-5 w-5 p-0 rounded-full">
                  <Forward className="h-2.5 w-2.5" />
                </Button>
                <Button variant="ghost" size="sm" className="h-5 w-5 p-0 rounded-full">
                  <MoreVertical className="h-2.5 w-2.5" />
                </Button>
              </div>
              
              {/* Message status indicators - always visible */}
              <div className="flex items-center gap-1">
                {message.isEdited && (
                  <span className="text-[9px] opacity-70">(edited)</span>
                )}
                
                {message.expiresAt && (
                  <span className="flex items-center text-[9px] opacity-70">
                    <Clock className="w-2 h-2 mr-0.5" />
                    Expires
                  </span>
                )}
                
                {message.isOwn && (
                  <>
                    {message.status === "sending" && <span className="text-[10px]">Sending...</span>}
                    {/* Check both status and readBy for accurate read detection */}
                    {(message.status === "sent" || message.status === "delivered") && 
                     (!message.readBy || Object.keys(message.readBy).length === 0) && 
                     <CheckCheck className="w-3 h-3" />}
                    {(message.status === "read" || (message.readBy && Object.keys(message.readBy).length > 0)) && 
                     <CheckCheck className="w-3 h-3 text-green-600" />}
                  </>
                )}
              </div>
            </div>
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
      </div>
    </div>
  );
}
