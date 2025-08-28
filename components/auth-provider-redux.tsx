"use client"

import type React from "react"
import { createContext, useContext, useEffect } from "react"
import { useRouter } from "next/navigation"
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase'
import { useAppDispatch, useAppSelector, setUser, setLoading, User } from '@/lib/redux'
import { getUserData } from '@/lib/redux/utils'
import { useLogoutMutation } from '@/lib/redux/api/firebaseApi'

interface AuthContextType {
  // Keep the same interface for backward compatibility
  user: User | null
  login: (email: string, password: string) => Promise<void>
  signup: (userData: any) => Promise<void>
  logout: () => Promise<void>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProviderRedux({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch()
  const { user, loading } = useAppSelector((state) => state.auth)
  const router = useRouter()
  const [logoutMutation] = useLogoutMutation()

  useEffect(() => {
    dispatch(setLoading(true))
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in, get their data from Firestore
        const userData = await getUserData(firebaseUser.uid)
        if (userData) {
          dispatch(setUser(userData))
        }
      } else {
        // User is signed out
        dispatch(setUser(null))
      }
      dispatch(setLoading(false))
    })

    return () => unsubscribe()
  }, [dispatch])

  // These functions can now use Redux actions instead of local state
  const login = async (email: string, password: string) => {
    // This will be handled by RTK Query mutations
    throw new Error('Use useLoginMutation from Redux instead')
  }

  const signup = async (userData: any) => {
    // This will be handled by RTK Query mutations
    throw new Error('Use useSignupMutation from Redux instead')
  }

  const logout = async () => {
    try {
      await logoutMutation().unwrap()
      // Redirect to home page after logout
      router.push('/')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
