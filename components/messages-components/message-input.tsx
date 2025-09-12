"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Paperclip,
  Smile,
  Mic,
  Send,
  Image as ImageIcon,
  FileText,
  X,
  Film
} from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface MessageInputProps {
  onSendMessage: (text: string, attachments: File[]) => void;
  onTyping?: (isTyping: boolean) => void;
  isRecording?: boolean;
  onStartRecording?: () => void;
  onStopRecording?: () => void;
  isUploading?: boolean;
  uploadProgress?: number;
  uploadError?: string | null;
}

export function MessageInput({
  onSendMessage,
  onTyping,
  isRecording = false,
  onStartRecording,
  onStopRecording,
  isUploading = false,
  uploadProgress = 0,
  uploadError = null
}: MessageInputProps) {
  const [message, setMessage] = useState("")
  const [attachments, setAttachments] = useState<File[]>([])
  const [attachmentType, setAttachmentType] = useState<string | null>(null)
  const [isTyping, setIsTyping] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleSend = () => {
    // Allow sending only if there's a message or attachments
    if (message.trim() || attachments.length > 0) {
      // Pass message text only if there's actual text
      const messageText = message.trim() || '';
      onSendMessage(messageText, attachments)
      setMessage("")
      setAttachments([])
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }
  
  // Handle typing indicator
  useEffect(() => {
    // Don't emit typing events if there's no handler
    if (!onTyping) return;
    
    if (message && !isTyping) {
      setIsTyping(true);
      onTyping(true);
    }
    
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Set new timeout to stop typing indicator after 3 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      if (isTyping) {
        setIsTyping(false);
        onTyping(false);
      }
    }, 3000);
    
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [message, isTyping, onTyping]);

  const triggerFileInput = (type: string) => {
    setAttachmentType(type)
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    // Filter files based on attachmentType
    const filteredFiles = Array.from(files).filter(file => {
      if (attachmentType === "image") return file.type.startsWith("image/")
      if (attachmentType === "video") return file.type.startsWith("video/")
      if (attachmentType === "document") {
        return !file.type.startsWith("image/") && 
               !file.type.startsWith("video/") &&
               !file.type.startsWith("audio/")
      }
      return true
    })

    setAttachments(prev => [...prev, ...filteredFiles])
    
    // Reset the file input value so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="border-t p-2 sm:p-3 lg:p-4 bg-white">
      {/* Attachment preview */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2 sm:mb-3 overflow-x-auto pb-2 max-w-full">
          {attachments.map((file, index) => (
            <div key={index} className="relative flex-shrink-0">
              <div className="bg-gray-100 p-2 rounded flex items-center gap-2">
                {file.type.startsWith("image/") ? (
                  <div className="relative w-10 h-10 sm:w-14 sm:h-14 rounded overflow-hidden">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : file.type.startsWith("video/") ? (
                  <div className="flex items-center">
                    <Film className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-gray-500" />
                    <span className="text-xs text-gray-700 max-w-[80px] sm:max-w-[100px] truncate">{file.name}</span>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <FileText className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-gray-500" />
                    <span className="text-xs text-gray-700 max-w-[80px] sm:max-w-[100px] truncate">{file.name}</span>
                  </div>
                )}
                <Button 
                  size="sm"
                  variant="ghost"
                  className="h-4 w-4 sm:h-5 sm:w-5 p-0 rounded-full absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 bg-gray-900 text-white"
                  onClick={() => removeAttachment(index)}
                >
                  <X className="h-2 w-2 sm:h-3 sm:w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Message input area */}
      <div className="flex items-end gap-1 sm:gap-2">
        <div className="flex-1 rounded-lg border bg-white overflow-hidden">
          <Textarea
            placeholder="Type a message..."
            className="min-h-[36px] sm:min-h-[40px] max-h-[120px] sm:max-h-[200px] resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 py-2 sm:py-3 text-sm sm:text-base px-2 sm:px-3"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          
          <div className="flex items-center border-t p-1 sm:p-2 bg-gray-50">
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
              multiple
            />
            
            {/* Upload status indicator */}
            {isUploading && (
              <div className="flex items-center gap-1 mr-2 text-xs text-gray-500">
                <div className="w-16 sm:w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 rounded-full transition-all duration-300" 
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <span className="whitespace-nowrap text-[10px] sm:text-xs">{uploadProgress}%</span>
              </div>
            )}
            
            {uploadError && (
              <div className="text-[10px] sm:text-xs text-red-500 mr-2 truncate max-w-[100px] sm:max-w-[150px]">
                {uploadError}
              </div>
            )}
            
            <TooltipProvider>
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-6 w-6 sm:h-8 sm:w-8 rounded-full"
                  >
                    <Paperclip className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-36 sm:w-48 p-2" side="top">
                  <div className="grid grid-cols-3 gap-1 sm:gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="flex flex-col items-center justify-center h-12 sm:h-16"
                      onClick={() => triggerFileInput("image")}
                    >
                      <ImageIcon className="h-4 w-4 sm:h-5 sm:w-5 mb-0.5 sm:mb-1" />
                      <span className="text-[10px] sm:text-xs">Image</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="flex flex-col items-center justify-center h-12 sm:h-16"
                      onClick={() => triggerFileInput("video")}
                    >
                      <Film className="h-4 w-4 sm:h-5 sm:w-5 mb-0.5 sm:mb-1" />
                      <span className="text-[10px] sm:text-xs">Video</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="flex flex-col items-center justify-center h-12 sm:h-16"
                      onClick={() => triggerFileInput("document")}
                    >
                      <FileText className="h-4 w-4 sm:h-5 sm:w-5 mb-0.5 sm:mb-1" />
                      <span className="text-[10px] sm:text-xs">File</span>
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-6 w-6 sm:h-8 sm:w-8 rounded-full"
                  >
                    <Smile className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add emoji</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        
        <div>
          {isRecording ? (
            <Button 
              size="icon" 
              variant="destructive"
              className="rounded-full h-8 w-8 sm:h-10 sm:w-10"
              onClick={onStopRecording}
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          ) : (message.trim() || attachments.length > 0) && !isUploading ? (
            <Button 
              size="icon" 
              className="rounded-full h-8 w-8 sm:h-10 sm:w-10"
              onClick={handleSend}
            >
              <Send className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          ) : (
            <Button 
              size="icon" 
              className="rounded-full h-8 w-8 sm:h-10 sm:w-10"
              onClick={onStartRecording}
            >
              <Mic className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
