// Example profile image update component
import React, { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Camera } from 'lucide-react'
import { useProfileImage } from '@/lib/hooks/use-profile-image'
import { useSelector } from 'react-redux'
import { RootState } from '@/lib/redux/store'
import Image from 'next/image'

export function ProfileImageUpload() {
  const { user } = useSelector((state: RootState) => state.auth)
  const { updateProfileImage, isUploading, uploadProgress } = useProfileImage()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  // Use either photoURL or about.profileUrl, whichever is available
  const currentImageUrl = user?.photoURL || user?.about?.profileUrl || '/placeholder-user.jpg'

  const handleSelectFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && user?.userId) {
      // Create a local preview
      setPreviewUrl(URL.createObjectURL(file))
      
      // Upload and update the profile image
      const imageUrl = await updateProfileImage(user.userId, file)
      
      // If upload failed, reset the preview
      if (!imageUrl) {
        setPreviewUrl(null)
      }
    }
  }

  return (
    <div className="relative flex flex-col items-center">
      <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-100">
        <Image 
          src={previewUrl || currentImageUrl} 
          alt="Profile" 
          fill 
          className="object-cover"
        />
        {isUploading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-white text-center">
              <p className="font-bold text-xl">{uploadProgress}%</p>
              <p className="text-xs">Uploading...</p>
            </div>
          </div>
        )}
      </div>
      
      <Button 
        variant="outline" 
        size="sm" 
        className="mt-4" 
        onClick={handleSelectFile}
        disabled={isUploading}
      >
        <Camera className="w-4 h-4 mr-2" />
        Change Photo
      </Button>
      
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
        disabled={isUploading}
      />
      
      <p className="text-xs text-gray-500 mt-2">
        JPEG, PNG or WebP. Max 5MB.
      </p>
    </div>
  )
}
