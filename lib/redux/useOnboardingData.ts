"use client"

import { useState, useEffect } from 'react'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import { useAuth } from '@/components/auth-provider-redux'
import {
  useGetUserOnboardingDataQuery,
  useUpdateUserSpecialtiesMutation,
  useUpdateUserEducationMutation,
  useUpdateUserPortfolioMutation,
  useUpdateUserEmploymentMutation,
  useUpdateUserSkillsMutation,
  useUpdateUserRatesMutation,
} from './api/firebaseApi'
import type { User, UserEducation, UserPortfolio, UserEmployment, UserSkill } from './types/firebaseTypes'

export interface OnboardingData {
  specialties: string[]
  education: UserEducation[]
  portfolio: UserPortfolio[]
  employment: UserEmployment[]
  skills: UserSkill[]
  rates: {
    hourRate: string
    title: string
    overview: string
  }
}

export function useOnboardingData() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch user data from Firebase
  const { 
    data: userData, 
    isLoading: isLoadingData, 
    error: fetchError,
    refetch: refetchUserData 
  } = useGetUserOnboardingDataQuery(user?.userId || '', {
    skip: !user?.userId
  })

  // Mutation hooks
  const [updateSpecialties] = useUpdateUserSpecialtiesMutation()
  const [updateEducation] = useUpdateUserEducationMutation()
  const [updatePortfolio] = useUpdateUserPortfolioMutation()
  const [updateEmployment] = useUpdateUserEmploymentMutation()
  const [updateSkills] = useUpdateUserSkillsMutation()
  const [updateRates] = useUpdateUserRatesMutation()

  // Save specialties to Firebase
  const saveSpecialties = async (specialties: string[]) => {
    if (!user?.userId) return false
    
    try {
      setIsLoading(true)
      setError(null)
      const result = await updateSpecialties({ userId: user.userId, specialties })
      
      if ('error' in result) {
        throw new Error((result.error as any)?.error || 'Failed to save specialties')
      }
      
      return true
    } catch (err: any) {
      setError(err.message)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // Save education to Firebase
  const saveEducation = async (education: UserEducation[]) => {
    if (!user?.userId) return false
    
    try {
      setIsLoading(true)
      setError(null)
      const result = await updateEducation({ userId: user.userId, education })
      
      if ('error' in result) {
        throw new Error((result.error as any)?.error || 'Failed to save education')
      }
      
      return true
    } catch (err: any) {
      setError(err.message)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // Save portfolio to Firebase
  const savePortfolio = async (portfolio: UserPortfolio[]) => {
    if (!user?.userId) return false
    
    try {
      setIsLoading(true)
      setError(null)
      const result = await updatePortfolio({ userId: user.userId, portfolio })
      
      if ('error' in result) {
        throw new Error((result.error as any)?.error || 'Failed to save portfolio')
      }
      
      return true
    } catch (err: any) {
      setError(err.message)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // Save employment to Firebase
  const saveEmployment = async (employment: UserEmployment[]) => {
    if (!user?.userId) return false
    
    try {
      setIsLoading(true)
      setError(null)
      const result = await updateEmployment({ userId: user.userId, employment })
      
      if ('error' in result) {
        throw new Error((result.error as any)?.error || 'Failed to save employment')
      }
      
      return true
    } catch (err: any) {
      setError(err.message)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // Save skills to Firebase
  const saveSkills = async (skills: UserSkill[]) => {
    if (!user?.userId) return false
    
    try {
      setIsLoading(true)
      setError(null)
      const result = await updateSkills({ userId: user.userId, skills })
      
      if ('error' in result) {
        throw new Error((result.error as any)?.error || 'Failed to save skills')
      }
      
      return true
    } catch (err: any) {
      setError(err.message)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // Save rates and profile info to Firebase
  const saveRates = async (hourRate: string, title: string, overview: string) => {
    if (!user?.userId) return false
    
    try {
      setIsLoading(true)
      setError(null)
      const result = await updateRates({ userId: user.userId, hourRate, title, overview })
      
      if ('error' in result) {
        throw new Error((result.error as any)?.error || 'Failed to save rates')
      }
      
      return true
    } catch (err: any) {
      setError(err.message)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // Helper to get current onboarding data
  const getOnboardingData = (): OnboardingData => {
    return {
      specialties: userData?.specialties || [],
      education: userData?.education || [],
      portfolio: userData?.portfolio || [],
      employment: userData?.employment || [],
      skills: userData?.skills || [],
      rates: {
        hourRate: userData?.hourRate || '',
        title: userData?.title || '',
        overview: userData?.overview || ''
      }
    }
  }

  return {
    // Data
    userData,
    onboardingData: getOnboardingData(),
    
    // Loading states
    isLoading: isLoading || isLoadingData,
    error: error || (fetchError as any)?.error,
    
    // Actions
    saveSpecialties,
    saveEducation,
    savePortfolio,
    saveEmployment,
    saveSkills,
    saveRates,
    refetchUserData,
    
    // Helpers
    hasData: !!userData
  }
}
