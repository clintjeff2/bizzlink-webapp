import { useUpdateUserLocationAndProfileMutation } from '@/lib/redux/api/firebaseApi'
import { uploadProfileImage } from '@/lib/services/storageService'
import { useToast } from '@/hooks/use-toast'
import { useState, useEffect } from 'react'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import { useAuth } from '@/components/auth-provider-redux'

export interface LocationData {
  country: string
  countryCode: string
  city: string
  timezone: string
  primaryLanguage: string
  additionalLanguages: string[]
  phoneNumber?: string
  dateOfBirth?: string
  bio?: string
  linkedinUrl?: string
  websiteUrl?: string
  githubUrl?: string
  profileImageFile?: File
}

export function useLocationData() {
  const { toast } = useToast()
  const { user } = useAuth()
  const userId = user?.userId
  const [updateLocationAndProfile, { isLoading: isUpdating }] = useUpdateUserLocationAndProfileMutation()

  const saveLocationData = async (data: LocationData): Promise<boolean> => {
    if (!userId) {
      toast({
        title: "Authentication Error",
        description: "Please log in to save your data.",
        variant: "destructive"
      })
      return false
    }

    try {
      let profileImageUrl: string | undefined

      // Upload profile image if provided
      if (data.profileImageFile) {
        try {
          const uploadResult = await uploadProfileImage(userId, data.profileImageFile)
          profileImageUrl = uploadResult.url
        } catch (error) {
          console.error('Failed to upload profile image:', error)
          toast({
            title: "Image Upload Failed",
            description: "Your profile was saved but the image upload failed. You can try uploading the image again later.",
            variant: "destructive"
          })
        }
      }

      // Prepare location data for Firebase
      const locationData = {
        country: data.country,
        countryCode: data.countryCode,
        city: data.city,
        timezone: data.timezone,
        primaryLanguage: data.primaryLanguage,
        additionalLanguages: data.additionalLanguages,
        phoneNumber: data.phoneNumber,
        dateOfBirth: data.dateOfBirth,
        bio: data.bio,
        linkedinUrl: data.linkedinUrl,
        websiteUrl: data.websiteUrl,
        githubUrl: data.githubUrl,
        profileImageUrl
      }

      // Update user data in Firebase
      const result = await updateLocationAndProfile({
        userId,
        locationData
      }).unwrap()

      if (result.data) {
        toast({
          title: "Profile Updated!",
          description: "Your location and profile information has been saved successfully."
        })
        return true
      } else {
        throw new Error("Failed to save data")
      }
    } catch (error: any) {
      console.error('Failed to save location data:', error)
      toast({
        title: "Save Failed",
        description: error.message || "Failed to save your profile. Please try again.",
        variant: "destructive"
      })
      return false
    }
  }

  return {
    saveLocationData,
    isUpdating,
    userId
  }
}
