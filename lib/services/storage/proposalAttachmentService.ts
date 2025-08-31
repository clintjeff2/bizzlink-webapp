import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

/**
 * Service for uploading proposal attachments to Firebase Storage
 */
export const proposalAttachmentService = {
  /**
   * Upload a file to Firebase storage and get the download URL
   * 
   * @param file The file to upload
   * @param projectId The ID of the project this proposal is for
   * @param onProgress Optional callback for upload progress
   * @returns Promise with file metadata including download URL
   */
  uploadFile: async (
    file: File, 
    projectId: string,
    onProgress?: (progress: number) => void
  ) => {
    const storage = getStorage();
    
    // Create a unique filename to avoid collisions
    const fileExtension = file.name.split('.').pop();
    const uniqueFilename = `${Date.now()}_${uuidv4().substring(0, 8)}.${fileExtension}`;
    
    // Create the storage reference
    const fileRef = ref(storage, `proposal-attachments/${projectId}/${uniqueFilename}`);
    
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
            
            // Return file metadata
            resolve({
              fileName: file.name,
              fileUrl: downloadURL,
              fileType: file.type,
            });
          } catch (error) {
            reject(error);
          }
        }
      );
    });
  },
  
  /**
   * Upload multiple files and track progress for each
   * 
   * @param files Array of files to upload
   * @param projectId The ID of the project this proposal is for
   * @param onFileProgress Optional callback for individual file progress
   * @returns Promise with array of file metadata
   */
  uploadMultipleFiles: async (
    files: File[],
    projectId: string,
    onFileProgress?: (fileName: string, progress: number) => void
  ) => {
    const uploadPromises = files.map(file => {
      return proposalAttachmentService.uploadFile(
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
  },
  
  /**
   * Validate a file for size and type
   * 
   * @param file The file to validate
   * @returns Object with validation result and error message if any
   */
  validateFile: (file: File) => {
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
};

export default proposalAttachmentService;
