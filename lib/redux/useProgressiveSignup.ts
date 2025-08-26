"use client"

import { useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from './hooks'
import {
  setSignupData,
  setCurrentStep,
  markStepCompleted,
  setUserType,
  setBasicInfo,
  setProfileInfo,
  setTempUserId,
  setLoading,
  setAutoSaving,
  setError,
  markSignupComplete,
  resetSignup,
  loadSignupFromStorage,
  type SignupData,
} from './slices/signupSlice'
import {
  useSaveSignupStepMutation,
  useCreateTempUserMutation,
  useLoadSignupProgressQuery,
  useUpgradeToFullUserMutation,
  useGoogleSignupStepMutation,
} from './api/firebaseApi'
import { setUser } from './slices/authSlice'

export function useProgressiveSignup() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const signupState = useAppSelector((state) => state.signup)
  
  const [saveSignupStep, { isLoading: isSaving }] = useSaveSignupStepMutation()
  const [createTempUser] = useCreateTempUserMutation()
  const [upgradeToFullUser, { isLoading: isUpgrading }] = useUpgradeToFullUserMutation()
  const [googleSignupStep, { isLoading: isGoogleLoading }] = useGoogleSignupStepMutation()

  // Load existing signup progress on hook initialization
  useEffect(() => {
    const loadExistingProgress = () => {
      try {
        const localData = localStorage.getItem('bizzlink_signup_progress')
        if (localData) {
          const data = JSON.parse(localData) as SignupData
          
          // Ensure data integrity
          if (!data.completedSteps) {
            data.completedSteps = []
          }
          
          dispatch(loadSignupFromStorage(data))
          
          // If user had started signup, navigate to appropriate step
          if (data.currentStep > 1) {
            // User can continue from where they left off
            console.log('Resuming signup from step:', data.currentStep)
          }
        }
      } catch (error) {
        console.error('Error loading signup progress:', error)
        localStorage.removeItem('bizzlink_signup_progress')
      }
    }

    loadExistingProgress()
  }, [dispatch])

  // Auto-save functionality with debouncing
  const autoSave = useCallback(async (step: number, data: Partial<SignupData>) => {
    if (!data.tempUserId && step === 1 && data.userType) {
      // Create temp user on first step completion
      try {
        dispatch(setAutoSaving(true))
        const result = await createTempUser({ userType: data.userType as 'freelancer' | 'client' })
        if ('data' in result && result.data) {
          dispatch(setTempUserId(result.data.tempUserId))
          data.tempUserId = result.data.tempUserId
        }
      } catch (error) {
        console.error('Error creating temp user:', error)
      }
    }

    try {
      await saveSignupStep({ step, data })
      dispatch(setAutoSaving(false))
    } catch (error) {
      dispatch(setError('Failed to save progress'))
      dispatch(setAutoSaving(false))
    }
  }, [createTempUser, saveSignupStep, dispatch])

    // Step 1: User type selection
  const selectUserType = useCallback(async (userType: 'freelancer' | 'client') => {
    try {
      dispatch(setLoading(true))
      dispatch(setUserType(userType))
      
      const stepData = { 
        ...signupState.data,
        userType, 
        currentStep: 1,
        completedSteps: []
      }
      
      // Create temp user to get ID for tracking progress
      const result = await createTempUser({ userType })
      if ('data' in result && result.data) {
        dispatch(setTempUserId(result.data.tempUserId))
        
        // Update stepData with tempUserId
        const finalStepData = { ...stepData, tempUserId: result.data.tempUserId }
        
        // Save to localStorage immediately
        localStorage.setItem('bizzlink_signup_progress', JSON.stringify(finalStepData))
        
        // Save to Firebase
        await saveSignupStep({ 
          step: 1, 
          data: finalStepData
        })
        
        dispatch(markStepCompleted(1))
        dispatch(setLoading(false))
        
        console.log('✅ Step 1 completed: User type saved to localStorage and Firebase')
        return { success: true, tempUserId: result.data.tempUserId }
      }
    } catch (error) {
      dispatch(setError('Failed to save user type selection'))
      dispatch(setLoading(false))
      console.error('❌ Step 1 failed:', error)
      return { success: false, error: error as Error }
    }
  }, [dispatch, signupState.data, createTempUser, saveSignupStep])

  // Step 2: Basic information
  const saveBasicInfo = useCallback(async (basicInfo: {
    firstname: string
    lastname: string
    email: string
    password: string
    confirmPassword: string
  }) => {
    try {
      dispatch(setLoading(true))
      dispatch(setBasicInfo(basicInfo))
      
      // Ensure step 1 is marked complete and include it in completedSteps
      const currentCompletedSteps = signupState.data.completedSteps || []
      if (!currentCompletedSteps.includes(1)) {
        dispatch(markStepCompleted(1))
      }
      
      // Save to localStorage immediately with proper completedSteps
      const stepData = { 
        ...signupState.data,
        ...basicInfo, 
        currentStep: 2,
        completedSteps: [...currentCompletedSteps, ...(currentCompletedSteps.includes(1) ? [] : [1])],
        tempUserId: signupState.data.tempUserId 
      }
      localStorage.setItem('bizzlink_signup_progress', JSON.stringify(stepData))
      
      // Save step 2 progress to Firebase
      await saveSignupStep({ 
        step: 2, 
        data: stepData
      })
      
      dispatch(markStepCompleted(2))
      dispatch(setLoading(false))
      
      console.log('✅ Step 2 completed: Basic info saved to localStorage and Firebase')
      return { success: true }
    } catch (error) {
      dispatch(setError('Failed to save basic information'))
      dispatch(setLoading(false))
      console.error('❌ Step 2 failed:', error)
      return { success: false, error: error as Error }
    }
  }, [dispatch, saveSignupStep, signupState.data])

  // Step 3: Profile setup (Freelancer specific)
  const saveProfileInfo = useCallback(async (profileInfo: {
    title?: string
    overview?: string
    skills?: string
    experience?: string
    hourlyRate?: string
    bio?: string
    agreeToTerms: boolean
  }) => {
    try {
      dispatch(setLoading(true))
      dispatch(setProfileInfo(profileInfo))
      
      // Ensure steps 1 and 2 are marked complete
      const currentCompletedSteps = signupState.data.completedSteps || []
      if (!currentCompletedSteps.includes(1)) {
        dispatch(markStepCompleted(1))
      }
      if (!currentCompletedSteps.includes(2)) {
        dispatch(markStepCompleted(2))
      }
      
      // Save to localStorage immediately with proper completedSteps
      const stepData = { 
        ...signupState.data,
        ...profileInfo,
        currentStep: 3,
        completedSteps: [
          ...currentCompletedSteps, 
          ...(currentCompletedSteps.includes(1) ? [] : [1]),
          ...(currentCompletedSteps.includes(2) ? [] : [2])
        ],
        tempUserId: signupState.data.tempUserId
      }
      localStorage.setItem('bizzlink_signup_progress', JSON.stringify(stepData))
      
      // Save step 3 progress to Firebase
      await saveSignupStep({ 
        step: 3, 
        data: stepData
      })
      
      dispatch(markStepCompleted(3))
      dispatch(setLoading(false))
      
      console.log('✅ Step 3 completed: Profile info saved to localStorage and Firebase')
      return { success: true }
    } catch (error) {
      dispatch(setError('Failed to save profile information'))
      dispatch(setLoading(false))
      console.error('❌ Step 3 failed:', error)
      return { success: false, error: error as Error }
    }
  }, [dispatch, saveSignupStep, signupState.data])

  // Complete signup - upgrade temp user to full user
  const completeSignup = useCallback(async () => {
    try {
      dispatch(setLoading(true))
      
      const result = await upgradeToFullUser({ signupData: signupState.data })
      
      if ('data' in result && result.data) {
        dispatch(setUser(result.data))
        dispatch(markSignupComplete())
        
        // DON'T clear localStorage yet - preserve it for onboarding
        // Update localStorage with completed signup info instead
        const completedSignupData = {
          ...signupState.data,
          isComplete: true,
          fullUserId: result.data.userId,
          lastSavedAt: new Date().toISOString()
        }
        localStorage.setItem('bizzlink_signup_progress', JSON.stringify(completedSignupData))
        localStorage.setItem('bizzlink_user_onboarding', JSON.stringify({
          userId: result.data.userId,
          role: result.data.role,
          signupData: completedSignupData,
          onboardingStarted: new Date().toISOString()
        }))
        
        console.log('✅ Signup completed: User upgraded and data preserved for onboarding')
        
        // Redirect based on user role
        switch (result.data.role) {
          case 'freelancer':
            router.push('/freelancer/onboarding/specialty')
            break
          case 'client':
            router.push('/client/dashboard')
            break
          default:
            router.push('/dashboard')
        }
      } else {
        const errorMessage = 'error' in result ? (result.error as any)?.error || 'Signup failed' : 'Signup failed'
        dispatch(setError(errorMessage))
      }
    } catch (error: any) {
      dispatch(setError(error.message || 'Signup failed'))
    } finally {
      dispatch(setLoading(false))
    }
  }, [dispatch, router, signupState.data, upgradeToFullUser])

  // Google signup
  const handleGoogleSignup = useCallback(async (userType?: 'freelancer' | 'client') => {
    try {
      dispatch(setLoading(true))
      
      // Save Google signup attempt to localStorage
      const stepData = { 
        userType: userType || signupState.data.userType,
        currentStep: 2,
        isGoogleSignup: true
      }
      localStorage.setItem('bizzlink_signup_progress', JSON.stringify({
        ...signupState.data,
        ...stepData
      }))
      
      const result = await googleSignupStep({ userType })
      
      if ('data' in result && result.data) {
        dispatch(setUser(result.data.user))
        
        if (result.data.isNewUser) {
          console.log('✅ Google signup completed: New user created and saved to Firebase')
          
          // For new users, preserve signup data for onboarding instead of clearing
          const completedSignupData = {
            ...signupState.data,
            userType: userType || signupState.data.userType,
            isComplete: true,
            isGoogleSignup: true,
            fullUserId: result.data.user.userId,
            lastSavedAt: new Date().toISOString()
          }
          localStorage.setItem('bizzlink_signup_progress', JSON.stringify(completedSignupData))
          localStorage.setItem('bizzlink_user_onboarding', JSON.stringify({
            userId: result.data.user.userId,
            role: result.data.user.role,
            signupData: completedSignupData,
            onboardingStarted: new Date().toISOString(),
            isGoogleUser: true
          }))
          
          // New user - redirect to appropriate onboarding
          switch (result.data.user.role) {
            case 'freelancer':
              router.push('/freelancer/onboarding/specialty')
              break
            case 'client':
              router.push('/client/dashboard')
              break
            default:
              router.push('/dashboard')
          }
        } else {
          console.log('✅ Google login completed: Existing user authenticated')
          // For existing users, we can clear signup progress since they're returning
          localStorage.removeItem('bizzlink_signup_progress')
          localStorage.removeItem('bizzlink_user_onboarding')
          
          // Existing user - redirect to their dashboard
          switch (result.data.user.role) {
            case 'freelancer':
              router.push('/freelancer/dashboard')
              break
            case 'client':
              router.push('/client/dashboard')
              break
            case 'admin':
              router.push('/admin')
              break
            default:
              router.push('/dashboard')
          }
        }
      } else {
        const errorMessage = 'error' in result ? (result.error as any)?.error || 'Google signup failed' : 'Google signup failed'
        dispatch(setError(errorMessage))
      }
    } catch (error: any) {
      dispatch(setError(error.message || 'Google signup failed'))
    } finally {
      dispatch(setLoading(false))
    }
  }, [dispatch, router, googleSignupStep])

  // Reset signup process
  const resetSignupProcess = useCallback(() => {
    dispatch(resetSignup())
    localStorage.removeItem('bizzlink_signup_progress')
  }, [dispatch])

  // Navigate to specific step
  const goToStep = useCallback((step: number) => {
    dispatch(setCurrentStep(step))
  }, [dispatch])

  // Clear signup data (to be called after onboarding is complete)
  const clearSignupData = useCallback(() => {
    localStorage.removeItem('bizzlink_signup_progress')
    localStorage.removeItem('bizzlink_user_onboarding')
    dispatch(resetSignup())
    console.log('✅ Signup and onboarding data cleared')
  }, [dispatch])

  return {
    // State
    signupData: signupState.data || {},
    currentStep: signupState.data?.currentStep || 1,
    completedSteps: signupState.data?.completedSteps || [],
    loading: signupState.loading || isUpgrading || isGoogleLoading,
    autoSaving: signupState.autoSaving || isSaving,
    error: signupState.error,
    
    // Actions
    selectUserType,
    saveBasicInfo,
    saveProfileInfo,
    completeSignup,
    handleGoogleSignup,
    resetSignupProcess,
    goToStep,
    clearSignupData,
    
    // Utilities
    isStepCompleted: (step: number) => signupState.data?.completedSteps?.includes(step) || false,
    canProceedToStep: (step: number) => {
      // Can proceed if previous steps are completed or if going backwards
      return step <= (signupState.data?.currentStep || 1) || 
             (signupState.data?.completedSteps?.includes(step - 1) || false)
    }
  }
}
