import { useState } from 'react'
import { uploadProfileImage } from '@/lib/services/storageService'
import { useUpdateUserProfileImageMutation } from '@/lib/redux/api/firebaseApi'
import { useToast } from '@/hooks/use-toast'

/**
 * Custom hook for handling profile image uploads with synchronized Firebase fields
 */
export function useProfileImage() {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [updateUserProfileImage] = useUpdateUserProfileImageMutation()
  const { toast } = useToast()

  /**
   * Upload and update a user's profile image
   * This will update both photoURL and about.profileUrl in the user document
   */
  const updateProfileImage = async (userId: string, file: File) => {
    if (!userId) {
      toast({
        title: 'Error',
        description: 'User ID is required to update profile image',
        variant: 'destructive',
      })
      return null
    }

    try {
      setIsUploading(true)
      setUploadProgress(0)

      // 1. Upload the image to Firebase Storage
      const result = await uploadProfileImage(userId, file, (progress) => {
        setUploadProgress(progress)
      })

      // 2. Update both photoURL and about.profileUrl in the user document
      const response = await updateUserProfileImage({
        userId,
        imageUrl: result.url,
      }).unwrap()

      if (response.success) {
        toast({
          title: 'Success',
          description: 'Profile image updated successfully',
        })
        return result.url
      } else {
        throw new Error(response.message || 'Failed to update profile image')
      }
    } catch (error: any) {
      console.error('Error updating profile image:', error)
      toast({
        title: 'Error',
        description: error.message || 'Failed to update profile image',
        variant: 'destructive',
      })
      return null
    } finally {
      setIsUploading(false)
    }
  }

  return {
    updateProfileImage,
    isUploading,
    uploadProgress,
  }
}
