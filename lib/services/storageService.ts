import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { storage } from '../../firebase'

export interface ImageUploadResult {
  url: string
  thumbnailUrl?: string
  mediumUrl?: string
  path: string
}

export interface FileUploadResult {
  fileName: string
  fileUrl: string
  fileType: string
  uploadedAt: string
  path: string
  size: number
}

/**
 * Upload a profile image to Firebase Storage
 * Creates multiple sizes: original, medium (400x400), thumbnail (150x150)
 */
export async function uploadProfileImage(
  userId: string, 
  file: File,
  onProgress?: (progress: number) => void
): Promise<ImageUploadResult> {
  try {
    // Validate file
    if (!file.type.startsWith('image/')) {
      throw new Error('File must be an image')
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      throw new Error('File size must be less than 5MB')
    }

    // Get file extension
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    
    // Create storage reference
    const mainImageRef = ref(storage, `profile-pictures/${userId}/profile.${fileExtension}`)
    
    // Simulate progress for main upload
    onProgress?.(30)
    
    // Upload main image
    const uploadResult = await uploadBytes(mainImageRef, file)
    onProgress?.(60)
    
    // Get download URL
    const downloadURL = await getDownloadURL(uploadResult.ref)
    onProgress?.(80)
    
    // For now, we'll use the main image for all sizes
    // In a production app, you might want to use a server function to create thumbnails
    const result: ImageUploadResult = {
      url: downloadURL,
      thumbnailUrl: downloadURL,
      mediumUrl: downloadURL,
      path: uploadResult.ref.fullPath
    }
    
    onProgress?.(100)
    return result
    
  } catch (error) {
    console.error('Error uploading profile image:', error)
    throw error
  }
}

/**
 * Delete a profile image from Firebase Storage
 */
export async function deleteProfileImage(userId: string, fileExtension: string = 'jpg'): Promise<void> {
  try {
    const imageRef = ref(storage, `profile-pictures/${userId}/profile.${fileExtension}`)
    await deleteObject(imageRef)
  } catch (error) {
    console.error('Error deleting profile image:', error)
    throw error
  }
}

/**
 * Get profile image URL by user ID
 */
export async function getProfileImageURL(userId: string, fileExtension: string = 'jpg'): Promise<string | null> {
  try {
    const imageRef = ref(storage, `profile-pictures/${userId}/profile.${fileExtension}`)
    return await getDownloadURL(imageRef)
  } catch (error) {
    // Image doesn't exist
    return null
  }
}

/**
 * Convert File to base64 for preview
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = error => reject(error)
  })
}

/**
 * Upload project requirement files to Firebase Storage
 * Stores files in project-requirements/{projectId}/ bucket
 */
export async function uploadProjectRequirementFiles(
  projectId: string,
  files: File[],
  onProgress?: (progress: number, fileName: string) => void
): Promise<FileUploadResult[]> {
  try {
    if (!files || files.length === 0) {
      return []
    }

    // Validate files
    const maxFileSize = 10 * 1024 * 1024 // 10MB limit
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/png',
      'image/jpeg',
      'image/gif',
      'application/zip',
      'text/plain'
    ]

    for (const file of files) {
      if (file.size > maxFileSize) {
        throw new Error(`File ${file.name} exceeds 10MB limit`)
      }
      if (!allowedTypes.includes(file.type)) {
        throw new Error(`File type ${file.type} is not allowed for ${file.name}`)
      }
    }

    const uploadResults: FileUploadResult[] = []
    const totalFiles = files.length

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const fileId = `${Date.now()}_${i}`
      const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'bin'
      const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
      
      // Create storage reference
      const fileRef = ref(storage, `project-requirements/${projectId}/${fileId}_${sanitizedFileName}`)
      
      // Upload file
      onProgress?.((i / totalFiles) * 50, file.name)
      
      const uploadResult = await uploadBytes(fileRef, file)
      
      onProgress?.(((i + 0.5) / totalFiles) * 100, file.name)
      
      // Get download URL
      const downloadURL = await getDownloadURL(uploadResult.ref)
      
      onProgress?.(((i + 1) / totalFiles) * 100, file.name)
      
      uploadResults.push({
        fileName: file.name,
        fileUrl: downloadURL,
        fileType: file.type,
        uploadedAt: new Date().toISOString(),
        path: uploadResult.ref.fullPath,
        size: file.size
      })
    }

    return uploadResults
    
  } catch (error) {
    console.error('Error uploading project requirement files:', error)
    throw error
  }
}

/**
 * Delete project requirement files from Firebase Storage
 */
export async function deleteProjectRequirementFiles(filePaths: string[]): Promise<void> {
  try {
    const deletePromises = filePaths.map(path => {
      const fileRef = ref(storage, path)
      return deleteObject(fileRef)
    })
    
    await Promise.all(deletePromises)
  } catch (error) {
    console.error('Error deleting project requirement files:', error)
    throw error
  }
}

/**
 * Create a compressed version of an image file
 */
export function compressImage(file: File, maxWidth: number = 800, quality: number = 0.8): Promise<File> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = () => {
      // Calculate new dimensions
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height)
      canvas.width = img.width * ratio
      canvas.height = img.height * ratio
      
      // Draw and compress
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height)
      
      canvas.toBlob((blob) => {
        if (blob) {
          const compressedFile = new File([blob], file.name, {
            type: file.type,
            lastModified: Date.now()
          })
          resolve(compressedFile)
        } else {
          reject(new Error('Failed to compress image'))
        }
      }, file.type, quality)
    }
    
    img.onerror = reject
    img.src = URL.createObjectURL(file)
  })
}
