"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { 
  Phone, 
  Video, 
  MoreVertical, 
  Star,
  Flag,
  Trash2,
  CornerUpRight
} from "lucide-react"

interface ChatHeaderProps {
  selectedConversation: any
  handleBackToConversations: () => void
  isMobileView: () => boolean
  isUserOnline: (userId: string) => boolean
  formatLastActive: (date: Date) => string
}

export function ChatHeader({
  selectedConversation,
  handleBackToConversations,
  isMobileView,
  isUserOnline,
  formatLastActive
}: ChatHeaderProps) {
  // If no conversation is selected, return null or a placeholder
  if (!selectedConversation) {
    // Only log this once when in development mode
    if (process.env.NODE_ENV === 'development') {
      // Using a more subtle console method for less noise
      console.debug("ChatHeader: No conversation selected");
    }
    return (
      <div className="p-2 sm:p-3 lg:p-4 border-b border-gray-200 bg-white rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3">
            {isMobileView() && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-1 h-8 w-8"
                onClick={handleBackToConversations}
              >
                <CornerUpRight className="w-4 h-4" />
              </Button>
            )}
            <div className="min-w-0 flex-1">
              <h3 className="text-sm sm:text-base font-semibold text-gray-900">Select a conversation</h3>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Only log in development mode to avoid console noise
  if (process.env.NODE_ENV === 'development') {
    console.debug("ChatHeader: Rendering conversation", selectedConversation.conversationId);
  }
  
  return (
    <div className="p-2 sm:p-3 lg:p-4 border-b border-gray-200 bg-white rounded-t-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Back button for mobile */}
          {isMobileView() && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-1 h-8 w-8"
              onClick={handleBackToConversations}
            >
              <CornerUpRight className="w-4 h-4" />
            </Button>
          )}
          <div className="relative">
            <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
              <AvatarImage
                src={selectedConversation.avatar || "/placeholder.svg"}
                alt={selectedConversation.name}
              />
              <AvatarFallback>{selectedConversation.name?.charAt(0) || '?'}</AvatarFallback>
            </Avatar>
            {selectedConversation.role === "freelancer" && isUserOnline(selectedConversation.freelancerId) && (
              <div className="absolute bottom-0 right-0 w-2 h-2 sm:w-3 sm:h-3 bg-green-500 border-2 border-white rounded-full"></div>
            )}
            {selectedConversation.role === "client" && isUserOnline(selectedConversation.clientId) && (
              <div className="absolute bottom-0 right-0 w-2 h-2 sm:w-3 sm:h-3 bg-green-500 border-2 border-white rounded-full"></div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm sm:text-base font-semibold text-gray-900 truncate">{selectedConversation.name || 'Unknown'}</h3>
            <div className="flex items-center space-x-1 sm:space-x-2">
              <p className="text-xs text-gray-600 truncate">{selectedConversation.project || 'No project'}</p>
              <Badge 
                variant={selectedConversation.type === "one_to_one" ? "outline" : 
                        selectedConversation.type === "announcement" ? "secondary" : "default"} 
                className="text-[10px] sm:text-xs hidden sm:inline-flex"
              >
                {selectedConversation.role || 'user'}
              </Badge>
              
              {selectedConversation.role === "freelancer" && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <span className="text-[10px] sm:text-xs text-gray-500 hidden sm:inline-block">
                        {isUserOnline(selectedConversation.freelancerId || "") 
                          ? "Online" 
                          : `Last active ${formatLastActive(new Date())}`
                        }
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        {isUserOnline(selectedConversation.freelancerId || "") 
                          ? "User is currently online" 
                          : `Last seen: ${new Date().toLocaleString()}`
                        }
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center">
          {/* Only show these buttons on larger screens */}
          <div className="hidden sm:flex items-center space-x-1 sm:space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Phone className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Audio Call</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Video className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Video Call</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-1 sm:p-2">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56">
              <div className="space-y-2">
                {/* Show these options in the menu on mobile */}
                <div className="sm:hidden border-b border-gray-100 pb-2 mb-2">
                  <Button variant="ghost" className="w-full justify-start text-sm">
                    <Phone className="w-4 h-4 mr-2" />
                    Audio Call
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-sm">
                    <Video className="w-4 h-4 mr-2" />
                    Video Call
                  </Button>
                </div>
                <Button variant="ghost" className="w-full justify-start text-sm">
                  <Star className="w-4 h-4 mr-2" />
                  {selectedConversation.pinned ? "Unpin conversation" : "Pin conversation"}
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm">
                  <Flag className="w-4 h-4 mr-2" />
                  Report conversation
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm text-red-500 hover:text-red-600 hover:bg-red-50">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete conversation
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  )
}
