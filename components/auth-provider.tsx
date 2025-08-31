"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface User {
  userId: string
  email: string
  firstName: string
  lastName: string
  displayName: string
  role: "freelancer" | "client" | "admin"
  photoURL?: string
  isVerified: boolean
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  signup: (userData: any) => Promise<void>
  logout: () => void
  completeOnboarding: (userData?: Partial<User>) => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem("bizzlink_user")
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        localStorage.removeItem("bizzlink_user")
      }
    } else {
      // Check for onboarding user that needs to be promoted to full user
      const onboardingData = localStorage.getItem('bizzlink_user_onboarding')
      const signupData = localStorage.getItem('bizzlink_signup_progress')
      
      if (onboardingData) {
        try {
          const data = JSON.parse(onboardingData)
          if (data.signupData && data.signupData.isComplete) {
            // Create full user from onboarding data
            const fullUser: User = {
              userId: data.userId,
              email: data.signupData.email,
              firstName: data.signupData.firstname,
              lastName: data.signupData.lastname,
              displayName: `${data.signupData.firstname} ${data.signupData.lastname}`,
              role: data.role,
              photoURL: data.signupData.photoURL,
              isVerified: false, // Will be verified through onboarding
            }
            
            setUser(fullUser)
            localStorage.setItem("bizzlink_user", JSON.stringify(fullUser))
          }
        } catch (error) {
          // Error promoting onboarding user
        }
      } else if (signupData) {
        try {
          const data = JSON.parse(signupData)
          if (data.isComplete && data.fullUserId) {
            // Create full user from signup data
            const fullUser: User = {
              userId: data.fullUserId,
              email: data.email,
              firstName: data.firstname,
              lastName: data.lastname,
              displayName: `${data.firstname} ${data.lastname}`,
              role: data.userType,
              photoURL: data.photoURL,
              isVerified: false,
            }
            
            setUser(fullUser)
            localStorage.setItem("bizzlink_user", JSON.stringify(fullUser))
          }
        } catch (error) {
          // Error promoting signup user
        }
      }
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mock user data based on email
      let mockUser: User
      if (email === "admin@bizzlink.com") {
        mockUser = {
          userId: "admin-1",
          email,
          firstName: "Admin",
          lastName: "User",
          displayName: "Admin User",
          role: "admin",
          photoURL: "/placeholder.svg?height=40&width=40",
          isVerified: true,
        }
      } else if (email.includes("client")) {
        mockUser = {
          userId: "client-1",
          email,
          firstName: "John",
          lastName: "Client",
          displayName: "John Client",
          role: "client",
          photoURL: "/placeholder.svg?height=40&width=40",
          isVerified: true,
        }
      } else {
        mockUser = {
          userId: "freelancer-1",
          email,
          firstName: "Sarah",
          lastName: "Chen",
          displayName: "Sarah Chen",
          role: "freelancer",
          photoURL: "/placeholder.svg?height=40&width=40",
          isVerified: true,
        }
      }

      setUser(mockUser)
      localStorage.setItem("bizzlink_user", JSON.stringify(mockUser))

      // Redirect based on role
      switch (mockUser.role) {
        case "admin":
          router.push("/admin")
          break
        case "client":
          router.push("/client/dashboard")
          break
        case "freelancer":
          router.push("/freelancer/dashboard")
          break
        default:
          router.push("/dashboard")
      }
    } catch (error) {
      // Login failed
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signup = async (userData: any) => {
    setLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const newUser: User = {
        userId: `${userData.userType}-${Date.now()}`,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        displayName: `${userData.firstName} ${userData.lastName}`,
        role: userData.userType,
        photoURL: "/placeholder.svg?height=40&width=40",
        isVerified: false,
      }

      setUser(newUser)
      localStorage.setItem("bizzlink_user", JSON.stringify(newUser))

      // Redirect based on role - freelancers go to onboarding flow
      switch (newUser.role) {
        case "admin":
          router.push("/admin")
          break
        case "client":
          router.push("/client/dashboard")
          break
        case "freelancer":
          router.push("/freelancer/onboarding/specialty")
          break
        default:
          router.push("/dashboard")
      }
    } catch (error) {
      // Signup failed
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("bizzlink_user")
    localStorage.removeItem("bizzlink_signup_progress")
    localStorage.removeItem("bizzlink_user_onboarding")
    router.push("/")
  }

  const completeOnboarding = (updatedUserData?: Partial<User>) => {
    if (user && updatedUserData) {
      const updatedUser = { ...user, ...updatedUserData, isVerified: true }
      setUser(updatedUser)
      localStorage.setItem("bizzlink_user", JSON.stringify(updatedUser))
    }
    
    // Clear onboarding data
    localStorage.removeItem("bizzlink_signup_progress")
    localStorage.removeItem("bizzlink_user_onboarding")
  }

  return <AuthContext.Provider value={{ user, login, signup, logout, completeOnboarding, loading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
