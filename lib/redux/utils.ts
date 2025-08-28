import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '../../firebase'
import { User } from './slices/authSlice'

export const getCurrentUser = (): Promise<FirebaseUser | null> => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe()
      resolve(user)
    })
  })
}

export const getUserData = async (uid: string): Promise<User | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid))
    if (userDoc.exists()) {
      const userData = userDoc.data()
      
      // Convert Firebase Timestamps to ISO strings to prevent Redux serialization warnings
      return {
        ...userData,
        createdAt: userData.createdAt?.seconds ? 
          new Date(userData.createdAt.seconds * 1000).toISOString() : 
          userData.createdAt,
        updatedAt: userData.updatedAt?.seconds ? 
          new Date(userData.updatedAt.seconds * 1000).toISOString() : 
          userData.updatedAt,
        lastLoginAt: userData.lastLoginAt?.seconds ? 
          new Date(userData.lastLoginAt.seconds * 1000).toISOString() : 
          userData.lastLoginAt
      } as User
    }
    return null
  } catch (error) {
    console.error('Error fetching user data:', error)
    return null
  }
}

export const formatFirebaseError = (error: any): string => {
  const errorCode = error?.code || 'unknown'
  
  switch (errorCode) {
    case 'auth/user-not-found':
      return 'No account found with this email address.'
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.'
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.'
    case 'auth/weak-password':
      return 'Password should be at least 6 characters long.'
    case 'auth/invalid-email':
      return 'Please enter a valid email address.'
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.'
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection.'
    default:
      return error?.message || 'An unexpected error occurred.'
  }
}
