# Profile Image Synchronization

This document explains how to properly handle profile images in the Bizzlink application to ensure consistent display across the platform.

## Overview

The user profile image is stored in two locations within the user document:
- `photoURL` - The main profile image URL field at the root level
- `about.profileUrl` - The profile image URL field in the 'about' nested object

To ensure consistency, both fields should always be updated together when a user changes their profile image.

## Implementation

### 1. Using the `useProfileImage` Hook

We've created a custom hook that handles the entire process:

```typescript
import { useProfileImage } from '@/lib/hooks/use-profile-image'

// In your component
const { updateProfileImage, isUploading, uploadProgress } = useProfileImage()

// When the user selects a new image
const handleImageChange = async (file: File) => {
  if (user?.userId) {
    const imageUrl = await updateProfileImage(user.userId, file)
    console.log('Updated image URL:', imageUrl)
  }
}
```

This hook:
1. Uploads the image to Firebase Storage
2. Updates both `photoURL` and `about.profileUrl` fields in Firestore
3. Provides loading state and progress updates

### 2. Direct API Usage

If you need more control, you can use the Firebase API directly:

```typescript
import { useUpdateUserProfileImageMutation } from '@/lib/redux/api/firebaseApi'
import { uploadProfileImage } from '@/lib/services/storageService'

// In your component
const [updateUserProfileImage] = useUpdateUserProfileImageMutation()

const handleImageUpdate = async (userId: string, file: File) => {
  // 1. Upload to storage
  const result = await uploadProfileImage(userId, file, (progress) => {
    console.log(`Upload progress: ${progress}%`)
  })
  
  // 2. Update both fields in Firestore
  await updateUserProfileImage({
    userId,
    imageUrl: result.url
  }).unwrap()
}
```

## Profile Image Display

When displaying the profile image, always check both fields:

```tsx
<Image
  src={user?.photoURL || user?.about?.profileUrl || "/placeholder-user.jpg"}
  alt={user?.displayName || 'User'}
  width={32}
  height={32}
  className="rounded-full"
/>
```

## Additional Information

- **Maximum File Size**: 5MB
- **Supported Formats**: JPEG, PNG, WebP
- **Storage Path**: `profile-pictures/{userId}/profile.{extension}`

## Best Practices

1. Always use the `updateUserProfileImage` mutation instead of updating the fields individually
2. When retrieving user data, prefer `photoURL` first, falling back to `about.profileUrl`
3. Include a default image as the final fallback (e.g., "/placeholder-user.jpg")
4. Always validate image size and type before uploading
