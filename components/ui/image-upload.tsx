"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Upload, X, User, Camera, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { uploadProfileImage, compressImage } from "@/lib/services/storageService"
import { useAuth } from "@/components/auth-provider"

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  onError?: (error: string) => void
  onFileSelect?: (file: File) => void
  className?: string
  maxSize?: number // in MB
  disabled?: boolean
}

export default function ImageUpload({ 
  value, 
  onChange, 
  onError, 
  onFileSelect,
  className,
  maxSize = 5,
  disabled = false
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [preview, setPreview] = useState<string | null>(value || null)
  
  // Get current user from AuthProvider context (which reads from localStorage)
  const { user, loading } = useAuth()
  const userId = user?.userId

  // Debug logging
  console.log('ImageUpload - User:', user)
  console.log('ImageUpload - UserId:', userId)
  console.log('ImageUpload - Loading:', loading)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (disabled || isUploading || !userId) return
    
    const file = acceptedFiles[0]
    if (!file) return

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      onError?.(`File size must be less than ${maxSize}MB`)
      return
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      onError?.('Please upload an image file')
      return
    }

    try {
      setIsUploading(true)
      setUploadProgress(0)

      // Create preview
      const previewUrl = URL.createObjectURL(file)
      setPreview(previewUrl)

      // Call the file selection callback
      onFileSelect?.(file)

      // Compress image if it's too large
      let fileToUpload = file
      if (file.size > 1024 * 1024) { // If larger than 1MB, compress
        setUploadProgress(10)
        fileToUpload = await compressImage(file, 800, 0.8)
      }

      setUploadProgress(20)

      // For now, just set a preview URL and let the parent handle the actual upload
      onChange(previewUrl)

    } catch (error: any) {
      setIsUploading(false)
      setUploadProgress(0)
      setPreview(value || null) // Reset to original value
      onError?.(error.message || 'Failed to upload image. Please try again.')
      console.error('Upload error:', error)
    } finally {
      setIsUploading(false)
    }
  }, [disabled, isUploading, maxSize, onChange, onError, onFileSelect, userId, value])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: 1,
    disabled: disabled || isUploading || !userId
  })

  const removeImage = useCallback(() => {
    setPreview(null)
    onChange('')
    setUploadProgress(0)
  }, [onChange])

  if (loading) {
    return (
      <div className="text-center p-6">
        <Loader2 className="w-12 h-12 mx-auto mb-2 animate-spin text-blue-600" />
        <p className="text-gray-600">Loading...</p>
      </div>
    )
  }

  if (!userId) {
    return (
      <div className="text-center p-6 text-gray-500">
        <User className="w-12 h-12 mx-auto mb-2" />
        <p>Please log in to upload a profile image</p>
        <p className="text-xs mt-1">User: {user ? 'Found' : 'Not found'}, UserId: {userId || 'None'}</p>
      </div>
    )
  }

  return (
    <div className={cn("w-full", className)}>
      {preview ? (
        <div className="relative">
          <div className="relative w-32 h-32 mx-auto">
            <Image
              src={preview}
              alt="Profile"
              fill
              className="rounded-full object-cover border-4 border-white shadow-lg"
            />
            {!disabled && (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute -top-2 -right-2 rounded-full w-8 h-8 p-0"
                onClick={removeImage}
                disabled={isUploading}
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
          
          {isUploading && (
            <div className="mt-4 space-y-2">
              <Progress value={uploadProgress} className="w-full" />
              <p className="text-sm text-gray-600 text-center">
                Uploading... {uploadProgress}%
              </p>
            </div>
          )}
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer transition-colors hover:border-blue-400 hover:bg-blue-50",
            isDragActive && "border-blue-400 bg-blue-50",
            disabled && "opacity-50 cursor-not-allowed",
            isUploading && "pointer-events-none"
          )}
        >
          <input {...getInputProps()} />
          
          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              {isUploading ? (
                <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
              ) : (
                <Camera className="w-8 h-8 text-gray-400" />
              )}
            </div>
            
            <div>
              <p className="text-base font-medium text-gray-900">
                {isDragActive ? "Drop your photo here" : "Upload profile photo"}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Drag and drop or click to select
              </p>
              <p className="text-xs text-gray-500 mt-2">
                PNG, JPG, GIF up to {maxSize}MB
              </p>
            </div>
            
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={disabled || isUploading}
              className="mx-auto"
            >
              <Upload className="w-4 h-4 mr-2" />
              Choose File
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
