import Image from 'next/image'
import { MessageSquare } from 'lucide-react'

export function MessagesWelcome() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
      <div className="mb-6">
        {/* Just use the icon as logo since the image might not exist */}
        <div className="relative w-[50px] h-[50px] mx-auto">
          <div className="flex items-center justify-center w-[50px] h-[50px] bg-blue-100 rounded-full">
            <MessageSquare size={24} className="text-blue-500" />
          </div>
        </div>
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-3">Welcome to Messages</h2>
      <p className="text-gray-500 max-w-md mb-6">
        Select a conversation from the list to start messaging with your clients and freelancers
      </p>
      <div className="flex items-center justify-center p-4 bg-blue-50 rounded-full">
        <MessageSquare size={32} className="text-blue-500" />
      </div>
    </div>
  )
}
