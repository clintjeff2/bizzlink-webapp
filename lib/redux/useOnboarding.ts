/**
 * Custom hook for managing onboarding state and data persistence
 * This helps preserve signup data during the onboarding process
 */

import { useCallback } from 'react'

export interface OnboardingData {
  userId: string
  role: 'freelancer' | 'client'
  signupData: any
  onboardingStarted: string
  isGoogleUser?: boolean
  onboardingCompleted?: string
  currentOnboardingStep?: string
}

export const useOnboarding = () => {
  // Get onboarding data from localStorage
  const getOnboardingData = useCallback((): OnboardingData | null => {
    try {
      const data = localStorage.getItem('bizzlink_user_onboarding')
      return data ? JSON.parse(data) : null
    } catch (error) {
      console.error('Error loading onboarding data:', error)
      return null
    }
  }, [])

  // Get signup data from localStorage
  const getSignupData = useCallback(() => {
    try {
      const data = localStorage.getItem('bizzlink_signup_progress')
      return data ? JSON.parse(data) : null
    } catch (error) {
      console.error('Error loading signup data:', error)
      return null
    }
  }, [])

  // Update onboarding progress
  const updateOnboardingProgress = useCallback((updates: Partial<OnboardingData>) => {
    try {
      const currentData = getOnboardingData()
      if (currentData) {
        const updatedData = { ...currentData, ...updates }
        localStorage.setItem('bizzlink_user_onboarding', JSON.stringify(updatedData))
        return updatedData
      }
      return null
    } catch (error) {
      console.error('Error updating onboarding progress:', error)
      return null
    }
  }, [getOnboardingData])

  // Mark onboarding as complete and clean up data
  const completeOnboarding = useCallback(() => {
    try {
      const onboardingData = getOnboardingData()
      if (onboardingData) {
        // Mark as completed
        const completedData = {
          ...onboardingData,
          onboardingCompleted: new Date().toISOString()
        }
        localStorage.setItem('bizzlink_user_onboarding', JSON.stringify(completedData))
        
        // Clean up signup progress since onboarding is complete
        localStorage.removeItem('bizzlink_signup_progress')
        
        console.log('✅ Onboarding completed and signup data cleaned up')
        return completedData
      }
    } catch (error) {
      console.error('Error completing onboarding:', error)
    }
    return null
  }, [getOnboardingData])

  // Clear all onboarding data (for logout or reset)
  const clearOnboardingData = useCallback(() => {
    try {
      localStorage.removeItem('bizzlink_user_onboarding')
      localStorage.removeItem('bizzlink_signup_progress')
      console.log('✅ All onboarding data cleared')
    } catch (error) {
      console.error('Error clearing onboarding data:', error)
    }
  }, [])

  // Check if user should be redirected to onboarding
  const shouldRedirectToOnboarding = useCallback((userId: string): { redirect: boolean; path?: string } => {
    const onboardingData = getOnboardingData()
    
    if (!onboardingData || onboardingData.userId !== userId) {
      return { redirect: false }
    }

    // If onboarding is already completed, no redirect needed
    if (onboardingData.onboardingCompleted) {
      return { redirect: false }
    }

    // Redirect based on role and current step
    switch (onboardingData.role) {
      case 'freelancer':
        return { 
          redirect: true, 
          path: onboardingData.currentOnboardingStep || '/freelancer/onboarding/specialty' 
        }
      case 'client':
        return { 
          redirect: true, 
          path: onboardingData.currentOnboardingStep || '/client/dashboard' 
        }
      default:
        return { redirect: false }
    }
  }, [getOnboardingData])

  return {
    getOnboardingData,
    getSignupData,
    updateOnboardingProgress,
    completeOnboarding,
    clearOnboardingData,
    shouldRedirectToOnboarding
  }
}
