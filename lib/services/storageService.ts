import { ref, uploadBytes, getDownloadURL, deleteObject, uploadBytesResumable } from 'firebase/storage'
import { storage } from '@/firebase'
import { v4 as uuidv4 } from 'uuid'

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

export interface MessageAttachment {
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

/**
 * Upload a profile image to Firebase Storage
 * Creates multiple sizes: original, medium (400x400), thumbnail (150x150)
 * 
 * Note: After uploading the image, be sure to call updateUserProfileImage from the Redux API
 * to update both photoURL and about.profileUrl fields in the user document.
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
 * Validate a file for proposal attachments
 * @param file The file to validate
 * @returns Object with validation result and error message if any
 */
export const validateProposalFile = (file: File) => {
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = [
    'application/pdf', 
    'image/jpeg', 
    'image/png', 
    'image/gif',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/zip',
    'text/plain'
  ];
  
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File "${file.name}" exceeds the 5MB size limit`
    };
  }
  
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `File "${file.name}" has an unsupported format`
    };
  }
  
  return { valid: true, error: null };
}

/**
 * Upload a proposal attachment to Firebase Storage
 * @param file The file to upload
 * @param projectId The ID of the project this proposal is for
 * @param onProgress Optional callback for upload progress
 * @returns Promise with file metadata including download URL
 */
export const uploadProposalAttachment = async (
  file: File, 
  projectId: string,
  onProgress?: (progress: number) => void
) => {
  // Create a unique filename to avoid collisions
  const fileExtension = file.name.split('.').pop() || 'file';
  const uniqueFilename = `${Date.now()}_${uuidv4().substring(0, 8)}.${fileExtension}`;
  
  // Create the storage reference
  const fileRef = ref(storage, `proposal-attachments/${projectId}/${uniqueFilename}`);
  
  try {
    // Upload the file
    const uploadTask = uploadBytesResumable(fileRef, file);
    
    // Return a promise that resolves when the upload is complete
    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Calculate and report progress
          const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          if (onProgress) {
            onProgress(progress);
          }
        },
        (error) => {
          // Handle errors
          reject(error);
        },
        async () => {
          // Upload completed successfully
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            
            // Calculate and explicitly store the file size in bytes
            const fileSizeInBytes = file.size || 0;
            
            // Return file metadata with guaranteed size
            resolve({
              fileName: file.name,
              fileUrl: downloadURL,
              fileType: file.type,
              size: fileSizeInBytes,  // Explicitly include file size
              uploadedAt: new Date().toISOString(),
              path: fileRef.fullPath
            });
          } catch (error) {
            reject(error);
          }
        }
      );
    });
  } catch (error) {
    console.error('Error uploading proposal attachment:', error);
    throw error;
  }
}

/**
 * Upload multiple proposal files and track progress for each
 * @param files Array of files to upload
 * @param projectId The ID of the project this proposal is for
 * @param onFileProgress Optional callback for individual file progress
 * @returns Promise with array of file metadata
 */
export const uploadProposalAttachments = async (
  files: File[],
  projectId: string,
  onFileProgress?: (fileName: string, progress: number) => void
) => {
  const uploadPromises = files.map(file => {
    return uploadProposalAttachment(
      file,
      projectId,
      (progress) => {
        if (onFileProgress) {
          onFileProgress(file.name, progress);
        }
      }
    );
  });
  
  // Wait for all uploads to complete
  return Promise.all(uploadPromises);
}

/**
 * Delete a profile image from Firebase Storage
 */
export async function deleteStorageItem(path: string): Promise<void> {
  try {
    const fileRef = ref(storage, path)
    await deleteObject(fileRef)
  } catch (error) {
    console.error('Error deleting file:', error)
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

/**
 * Upload a message attachment to Firebase Storage (for conversations)
 */
export const uploadMessageAttachment = async (
  conversationId: string,
  file: File,
  onProgress?: (progress: number) => void
): Promise<{
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
}> => {
  try {
    // Generate a unique ID for the attachment
    const attachmentId = uuidv4();
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9-_.]/g, '_');
    
    // Create storage reference
    const storagePath = `message-attachments/${conversationId}/${attachmentId}_${sanitizedFileName}`;
    const fileRef = ref(storage, storagePath);
    
    // Report initial progress
    onProgress?.(10);
    
    // Upload the file
    const uploadTask = uploadBytesResumable(fileRef, file);
    
    // Create a promise that resolves when the upload completes
    const uploadPromise = new Promise<{fileUrl: string, path: string}>((resolve, reject) => {
      uploadTask.on(
        'state_changed', 
        (snapshot: any) => {
          // Calculate and report progress (10-70%)
          const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 60) + 10;
          onProgress?.(progress);
        },
        (error: any) => {
          // Handle upload error
          reject(error);
        },
        async () => {
          try {
            // Get download URL
            const fileUrl = await getDownloadURL(uploadTask.snapshot.ref);
            resolve({
              fileUrl,
              path: uploadTask.snapshot.ref.fullPath
            });
          } catch (error) {
            reject(error);
          }
        }
      );
    });
    
    // Wait for the file to upload
    const { fileUrl } = await uploadPromise;
    
    // Report progress for thumbnail generation
    onProgress?.(80);
    
    // Result object with basic file info
    const result: {
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
    } = {
      attachmentId,
      fileName: file.name,
      fileUrl,
      fileType: file.type,
      fileSize: file.size
    };
    
    // Generate thumbnail and metadata for images and videos
    if (file.type.startsWith('image/')) {
      // Get image dimensions and create thumbnail for images
      const dimensions = await getImageDimensions(file);
      if (dimensions) {
        result.dimensions = dimensions;
      }
      
      const thumbnailUrl = await createImageThumbnail(file, conversationId, attachmentId);
      if (thumbnailUrl) {
        result.thumbnailUrl = thumbnailUrl;
      }
    } else if (file.type.startsWith('video/')) {
      // Get video metadata and create thumbnail for videos
      try {
        const videoMetadata = await getVideoMetadata(file);
        result.duration = videoMetadata.duration;
        result.dimensions = {
          width: videoMetadata.width,
          height: videoMetadata.height
        };
        
        const thumbnailUrl = await createVideoThumbnail(file, conversationId, attachmentId);
        if (thumbnailUrl) {
          result.thumbnailUrl = thumbnailUrl;
        }
      } catch (videoError) {
        console.error("Error processing video:", videoError);
      }
    }
    
    // Report completion
    onProgress?.(100);
    
    return result;
  } catch (error) {
    console.error('Error uploading message attachment:', error);
    throw error;
  }
};

// Create thumbnail for an image
const createImageThumbnail = async (
  imageFile: File, 
  conversationId: string,
  attachmentId: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = async () => {
      try {
        // Create a canvas to resize the image
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Target size for thumbnail
        const MAX_SIZE = 150;
        
        // Calculate dimensions to maintain aspect ratio
        let width = img.width;
        let height = img.height;
        
        if (width > height) {
          if (width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
        }
        
        // Set canvas size and draw resized image
        canvas.width = width;
        canvas.height = height;
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Convert canvas to blob
        canvas.toBlob(async (blob) => {
          if (!blob) {
            reject(new Error('Failed to create thumbnail'));
            return;
          }
          
          // Upload the thumbnail
          const thumbnailFile = new File([blob], `thumb_${imageFile.name}`, { type: 'image/jpeg' });
          const thumbnailPath = `message-attachments/${conversationId}/thumbnails/${attachmentId}_thumb.jpg`;
          const thumbnailRef = ref(storage, thumbnailPath);
          
          await uploadBytes(thumbnailRef, thumbnailFile);
          const thumbnailUrl = await getDownloadURL(thumbnailRef);
          resolve(thumbnailUrl);
        }, 'image/jpeg', 0.8);
      } catch (err) {
        console.error('Error creating thumbnail:', err);
        reject(err);
      }
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image for thumbnail creation'));
    };
    
    // Load the image from the file
    img.src = URL.createObjectURL(imageFile);
  });
};

// Create thumbnail for a video
const createVideoThumbnail = async (
  videoFile: File,
  conversationId: string,
  attachmentId: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Create a video element to capture a frame
    const video = document.createElement('video');
    video.preload = 'metadata';
    
    video.onloadedmetadata = () => {
      // Seek to 25% of the video
      video.currentTime = Math.min(video.duration * 0.25, 1.0);
    };
    
    video.onseeked = async () => {
      try {
        // Create canvas to capture the frame
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Draw the video frame to the canvas
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert canvas to blob
        canvas.toBlob(async (blob) => {
          if (!blob) {
            reject(new Error('Failed to create video thumbnail'));
            return;
          }
          
          // Upload the thumbnail
          const thumbnailFile = new File([blob], `thumb_${videoFile.name}.jpg`, { type: 'image/jpeg' });
          const thumbnailPath = `message-attachments/${conversationId}/thumbnails/${attachmentId}_thumb.jpg`;
          const thumbnailRef = ref(storage, thumbnailPath);
          
          await uploadBytes(thumbnailRef, thumbnailFile);
          const thumbnailUrl = await getDownloadURL(thumbnailRef);
          
          // Clean up
          URL.revokeObjectURL(video.src);
          
          resolve(thumbnailUrl);
        }, 'image/jpeg', 0.8);
      } catch (err) {
        console.error('Error creating video thumbnail:', err);
        reject(err);
      }
    };
    
    video.onerror = () => {
      reject(new Error('Failed to load video for thumbnail creation'));
    };
    
    // Load the video
    video.src = URL.createObjectURL(videoFile);
  });
};

// Get image dimensions
const getImageDimensions = async (imageFile: File): Promise<{width: number, height: number}> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height
      });
      URL.revokeObjectURL(img.src);
    };
    img.onerror = () => {
      reject(new Error('Failed to load image for dimension calculation'));
    };
    img.src = URL.createObjectURL(imageFile);
  });
};

// Get video metadata (duration and dimensions)
const getVideoMetadata = async (videoFile: File): Promise<{
  duration: number;
  width: number;
  height: number;
}> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    
    video.onloadedmetadata = () => {
      resolve({
        duration: video.duration,
        width: video.videoWidth,
        height: video.videoHeight
      });
      URL.revokeObjectURL(video.src);
    };
    
    video.onerror = () => {
      reject(new Error('Failed to load video metadata'));
    };
    
    video.src = URL.createObjectURL(videoFile);
  });
};

/**
 * Delete a message attachment from storage
 */
export async function deleteMessageAttachment(filePath: string): Promise<void> {
  try {
    const fileRef = ref(storage, filePath);
    await deleteObject(fileRef);
  } catch (error) {
    console.error('Error deleting message attachment:', error);
    throw error;
  }
}
