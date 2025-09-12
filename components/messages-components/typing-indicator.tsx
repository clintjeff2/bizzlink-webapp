"use client"

interface TypingIndicatorProps {
  isTyping: boolean;
  userName: string;
  avatar: string;
}

export function TypingIndicator({ isTyping, userName, avatar }: TypingIndicatorProps) {
  if (!isTyping) return null;

  return (
    <div className="flex items-start space-x-2 max-w-[95%] mb-4 animate-opacity-in">
      <div className="h-8 w-8 rounded-full overflow-hidden flex-shrink-0">
        <img 
          src={avatar || "/placeholder-user.jpg"} 
          alt={userName}
          className="h-full w-full object-cover"
        />
      </div>
      
      <div className="bg-gray-100 rounded-2xl px-4 py-2 inline-flex items-center">
        <div className="flex space-x-1">
          <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0ms" }}></div>
          <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "150ms" }}></div>
          <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "300ms" }}></div>
        </div>
        <span className="text-gray-500 text-xs ml-2">{userName} is typing...</span>
      </div>
    </div>
  );
}
