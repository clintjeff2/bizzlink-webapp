import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User as FirebaseUser,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile,
  sendEmailVerification,
  signInAnonymously
} from 'firebase/auth'
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  orderBy,
  limit,
  startAfter,
  deleteDoc,
  Timestamp
} from 'firebase/firestore'
import { auth, db } from '../../../firebase'
import type { SignupData as SignupFormData } from '../slices/signupSlice'
import type {
  User,
  Project,
  Proposal,
  Contract,
  Conversation,
  Message,
  Review,
  Payment,
  Notification,
  Category,
  AdminSettings,
  LoginData,
  SignupData,
  UpdateProfileData,
  CreateProjectData,
  UpdateProjectData,
  CreateProposalData,
  UpdateProposalData,
  CreateContractData,
  UpdateContractData,
  CreateMessageData,
  CreateConversationData,
  CreateReviewData,
  ProjectQueryParams,
  ProposalQueryParams,
  ContractQueryParams,
  MessageQueryParams,
  ConversationQueryParams,
  PaginatedResponse,
  ApiResponse
} from '../types/firebaseTypes'

// Helper function to convert Firestore timestamps to serializable strings
const serializeUser = (user: any): User => {
  return {
    ...user,
    createdAt: user.createdAt instanceof Timestamp ? user.createdAt.toDate().toISOString() : user.createdAt,
    updatedAt: user.updatedAt instanceof Timestamp ? user.updatedAt.toDate().toISOString() : user.updatedAt,
    lastLoginAt: user.lastLoginAt instanceof Timestamp ? user.lastLoginAt.toDate().toISOString() : user.lastLoginAt,
  }
}

// Create Firebase API using RTK Query with fakeBaseQuery
export const firebaseApi = createApi({
  reducerPath: 'firebaseApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['User', 'Project', 'Proposal', 'Contract'],
  endpoints: (builder) => ({
    // Auth endpoints
    login: builder.mutation<User, LoginData>({
      queryFn: async ({ email, password }) => {
        try {
          const userCredential = await signInWithEmailAndPassword(auth, email, password)
          const firebaseUser = userCredential.user
          
          // Get user data from Firestore
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
          if (!userDoc.exists()) {
            throw new Error('User profile not found')
          }
          
          const userData = userDoc.data()
          return { data: serializeUser(userData) }
        } catch (error: any) {
          return { error: { status: 'CUSTOM_ERROR', error: error.message } }
        }
      },
      invalidatesTags: ['User'],
    }),

    signup: builder.mutation<User, SignupData>({
      queryFn: async (signupData) => {
        try {
          // Create Firebase user
          const userCredential = await createUserWithEmailAndPassword(
            auth, 
            signupData.email, 
            signupData.password
          )
          const firebaseUser = userCredential.user
          
          // Update Firebase profile
          await updateProfile(firebaseUser, {
            displayName: `${signupData.firstname} ${signupData.lastname}`
          })
          
          // Send email verification
          await sendEmailVerification(firebaseUser)
          
          // Create user document in Firestore
          const now = new Date().toISOString()
          // Create user data with string timestamps for Redux
          const userData: User = {
            userId: firebaseUser.uid,
            email: signupData.email,
            emailVerified: firebaseUser.emailVerified,
            firstname: signupData.firstname,
            lastname: signupData.lastname,
            displayName: `${signupData.firstname} ${signupData.lastname}`,
            role: (signupData.userType as string) === 'freelancer' ? 'freelancer' : 'client',
            title: signupData.title || '',
            overview: signupData.overview || '',
            hourRate: '$ 0',
            photoURL: firebaseUser.photoURL || '',
            isActive: true,
            isVerified: firebaseUser.emailVerified,
            accountStatus: 'pending',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            lastLoginAt: new Date().toISOString(),
            about: {
              streetAddress: '',
              city: '',
              state: '',
              country: '',
              zipCode: '',
              tel: '',
              dob: '',
              profileUrl: '',
              downloadLink: ''
            },
            skills: [],
            specialties: [],
            education: [],
            employment: [],
            portfolio: [],
            stats: {
              totalJobs: 0,
              completedJobs: 0,
              activeProjects: 0,
              totalEarnings: 0,
              totalSpent: 0,
              averageRating: 0,
              totalReviews: 0,
              responseRate: 0,
              onTimeDelivery: 0
            },
            preferences: {
              timezone: 'UTC',
              language: 'en',
              currency: 'USD',
              emailNotifications: true,
              pushNotifications: true,
              availability: 'available'
            }
          }
          
          // Create Firestore version with Firestore Timestamps
          const firestoreUserData = {
            ...userData,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
            lastLoginAt: Timestamp.now(),
          }
          
          await setDoc(doc(db, 'users', firebaseUser.uid), firestoreUserData)
          
          return { data: userData }
        } catch (error: any) {
          return { error: { status: 'CUSTOM_ERROR', error: error.message } }
        }
      },
      invalidatesTags: ['User'],
    }),

    googleAuth: builder.mutation<User, { mode: 'login' | 'signup' }>({
      queryFn: async ({ mode }) => {
        try {
          const provider = new GoogleAuthProvider()
          
          // Add popup configuration to handle CORP policy issues
          provider.setCustomParameters({
            prompt: 'select_account'
          })
          
          const userCredential = await signInWithPopup(auth, provider)
          const firebaseUser = userCredential.user
          
          // Check if user exists in Firestore
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
          
          if (userDoc.exists()) {
            // Existing user - login
            const userData = userDoc.data()
            return { data: serializeUser(userData) }
          } else if (mode === 'signup') {
            // New user - create profile
            const now = new Date().toISOString()
            const userData: User = {
              userId: firebaseUser.uid,
              email: firebaseUser.email!,
              emailVerified: firebaseUser.emailVerified,
              firstname: firebaseUser.displayName?.split(' ')[0] || '',
              lastname: firebaseUser.displayName?.split(' ').slice(1).join(' ') || '',
              displayName: firebaseUser.displayName || '',
              role: 'client', // Default role, can be updated later
              title: '',
              overview: '',
              hourRate: '$ 0',
              photoURL: firebaseUser.photoURL || '',
              isActive: true,
              isVerified: true, // Google users are pre-verified
              accountStatus: 'active',
              createdAt: now,
              updatedAt: now,
              lastLoginAt: now,
              about: {
                streetAddress: '',
                city: '',
                state: '',
                country: '',
                zipCode: '',
                tel: '',
                dob: '',
                profileUrl: '',
                downloadLink: ''
              },
              skills: [],
              specialties: [],
              education: [],
              employment: [],
              portfolio: [],
              stats: {
                totalJobs: 0,
                completedJobs: 0,
                activeProjects: 0,
                totalEarnings: 0,
                totalSpent: 0,
                averageRating: 0,
                totalReviews: 0,
                responseRate: 0,
                onTimeDelivery: 0
              },
              preferences: {
                timezone: 'UTC',
                language: 'en',
                currency: 'USD',
                emailNotifications: true,
                pushNotifications: true,
                availability: 'available'
              }
            }
            
            // For Firestore, create version with Firestore Timestamps
            const firestoreUserData = {
              ...userData,
              createdAt: Timestamp.now(),
              updatedAt: Timestamp.now(),
              lastLoginAt: Timestamp.now(),
            }
            
            await setDoc(doc(db, 'users', firebaseUser.uid), firestoreUserData)
            return { data: userData }
          } else {
            throw new Error('User not found. Please sign up first.')
          }
        } catch (error: any) {
          console.error('Google Auth Error:', error)
          
          // Handle specific Google Auth errors
          if (error.code === 'auth/popup-closed-by-user') {
            return { error: { status: 'CUSTOM_ERROR', error: 'Authentication cancelled. Please try again.' } }
          } else if (error.code === 'auth/popup-blocked') {
            return { error: { status: 'CUSTOM_ERROR', error: 'Popup blocked. Please allow popups and try again.' } }
          } else if (error.message?.includes('Cross-Origin-Opener-Policy')) {
            return { error: { status: 'CUSTOM_ERROR', error: 'Browser security settings are blocking authentication. Please try again or use a different browser.' } }
          } else if (error.code === 'auth/cancelled-popup-request') {
            return { error: { status: 'CUSTOM_ERROR', error: 'Authentication request was cancelled. Please try again.' } }
          }
          
          return { error: { status: 'CUSTOM_ERROR', error: error.message } }
        }
      },
      invalidatesTags: ['User'],
    }),

    logout: builder.mutation<void, void>({
      queryFn: async () => {
        try {
          await signOut(auth)
          return { data: undefined }
        } catch (error: any) {
          return { error: { status: 'CUSTOM_ERROR', error: error.message } }
        }
      },
      invalidatesTags: ['User'],
    }),

    resetPassword: builder.mutation<void, { email: string }>({
      queryFn: async ({ email }) => {
        try {
          await sendPasswordResetEmail(auth, email)
          return { data: undefined }
        } catch (error: any) {
          return { error: { status: 'CUSTOM_ERROR', error: error.message } }
        }
      },
    }),

    updateSignupData: builder.mutation<User, { userId: string; data: Partial<SignupData> }>({
      queryFn: async ({ userId, data }) => {
        try {
          const userRef = doc(db, 'users', userId)
          const userDoc = await getDoc(userRef)
          
          if (!userDoc.exists()) {
            return { error: { status: 'CUSTOM_ERROR', error: 'User not found' } }
          }
          
          const currentData = userDoc.data() as User
          
          // Transform signup data to user format
          const updateData: Partial<User> = {
            updatedAt: new Date().toISOString()
          }
          
          // Map properties correctly
          if (data.firstname) updateData.firstname = data.firstname
          if (data.lastname) updateData.lastname = data.lastname
          if (data.title) updateData.title = data.title
          if (data.overview) updateData.overview = data.overview
          if ((data as any).skills) updateData.skills = (data as any).skills.split(',').map((skill: string, index: number) => ({
            id: `skill-${index}`,
            text: skill.trim(),
            level: 'intermediate' as const,
            yearsOfExperience: 1
          }))
          
          // Create Firestore update with Firestore Timestamp
          const firestoreUpdateData = {
            ...updateData,
            updatedAt: Timestamp.now()
          }
          
          await updateDoc(userRef, firestoreUpdateData)
          
          const updatedDoc = await getDoc(userRef)
          const userData = updatedDoc.data() as any
          
          // Serialize the user data before returning to Redux
          return { data: serializeUser(userData) }
        } catch (error: any) {
          return { error: { status: 'CUSTOM_ERROR', error: error.message } }
        }
      },
      invalidatesTags: ['User'],
    }),

    // Project endpoints
    getProjects: builder.query<Project[], { 
      limit?: number; 
      status?: string; 
      skills?: string[]; 
      lastDoc?: any 
    }>({
      queryFn: async ({ limit: queryLimit = 10, status, skills, lastDoc }) => {
        try {
          let q = query(
            collection(db, 'projects'),
            orderBy('createdAt', 'desc'),
            limit(queryLimit)
          )
          
          if (status) {
            q = query(q, where('status', '==', status))
          }
          
          if (skills && skills.length > 0) {
            q = query(q, where('skills', 'array-contains-any', skills))
          }
          
          if (lastDoc) {
            q = query(q, startAfter(lastDoc))
          }
          
          const querySnapshot = await getDocs(q)
          const projects = querySnapshot.docs.map(doc => {
            const data = doc.data()
            return {
              projectId: doc.id,
              ...data
            } as Project
          })
          
          return { data: projects }
        } catch (error: any) {
          return { error: { status: 'CUSTOM_ERROR', error: error.message } }
        }
      },
      providesTags: ['Project'],
    }),

    getProject: builder.query<Project, string>({
      queryFn: async (projectId) => {
        try {
          const projectDoc = await getDoc(doc(db, 'projects', projectId))
          if (!projectDoc.exists()) {
            throw new Error('Project not found')
          }
          
          const data = projectDoc.data()
          const project = {
            projectId: projectDoc.id,
            ...data
          } as Project
          return { data: project }
        } catch (error: any) {
          return { error: { status: 'CUSTOM_ERROR', error: error.message } }
        }
      },
      providesTags: ['Project'],
    }),

    createProject: builder.mutation<Project, Omit<Project, 'projectId' | 'createdAt' | 'updatedAt'>>({
      queryFn: async (projectData) => {
        try {
          const docRef = doc(collection(db, 'projects'))
          const newProject = {
            ...projectData,
            projectId: docRef.id,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
          }
          
          await setDoc(docRef, newProject)
          
          return { data: newProject }
        } catch (error: any) {
          return { error: { status: 'CUSTOM_ERROR', error: error.message } }
        }
      },
      invalidatesTags: ['Project'],
    }),

    // Proposal endpoints
    getProposals: builder.query<Proposal[], { projectId?: string; freelancerId?: string }>({
      queryFn: async ({ projectId, freelancerId }) => {
        try {
          let q = query(collection(db, 'proposals'), orderBy('createdAt', 'desc'))
          
          if (projectId) {
            q = query(q, where('projectId', '==', projectId))
          }
          
          if (freelancerId) {
            q = query(q, where('freelancerId', '==', freelancerId))
          }
          
          const querySnapshot = await getDocs(q)
          const proposals = querySnapshot.docs.map(doc => {
            const data = doc.data()
            return {
              proposalId: doc.id,
              ...data
            } as Proposal
          })
          
          return { data: proposals }
        } catch (error: any) {
          return { error: { status: 'CUSTOM_ERROR', error: error.message } }
        }
      },
      providesTags: ['Proposal'],
    }),

    createProposal: builder.mutation<Proposal, Omit<Proposal, 'id' | 'createdAt'>>({
      queryFn: async (proposalData) => {
        try {
          const newProposal = {
            ...proposalData,
            createdAt: new Date().toISOString(),
          }
          
          const docRef = doc(collection(db, 'proposals'))
          await setDoc(docRef, newProposal)
          
          return { data: { id: docRef.id, ...newProposal } as Proposal }
        } catch (error: any) {
          return { error: { status: 'CUSTOM_ERROR', error: error.message } }
        }
      },
      invalidatesTags: ['Proposal', 'Project'],
    }),

    updateProposal: builder.mutation<Proposal, { id: string; updateData: Partial<Proposal> }>({
      queryFn: async ({ id, updateData }) => {
        try {
          const proposalRef = doc(db, 'proposals', id)
          await updateDoc(proposalRef, updateData)
          
          const updatedDoc = await getDoc(proposalRef)
          const docData = updatedDoc.data()
          const proposal = {
            proposalId: updatedDoc.id,
            ...docData
          } as Proposal
          
          return { data: proposal }
        } catch (error: any) {
          return { error: { status: 'CUSTOM_ERROR', error: error.message } }
        }
      },
      invalidatesTags: ['Proposal'],
    }),

    // Progressive Signup endpoints
    saveSignupStep: builder.mutation<{ success: boolean }, { step: number; data: Partial<SignupFormData> }>({
      queryFn: async ({ step, data }) => {
        try {
          // Create the data object with timestamp
          const stepData = { 
            ...data, 
            currentStep: step,
            lastSavedAt: new Date().toISOString(),
            stepCompletedAt: new Date().toISOString()
          }

          // Always save to localStorage first (immediate persistence)
          const existingLocalData = localStorage.getItem('bizzlink_signup_progress')
          const currentLocalData = existingLocalData ? JSON.parse(existingLocalData) : {}
          const updatedLocalData = { 
            ...currentLocalData, 
            ...stepData
          }
          localStorage.setItem('bizzlink_signup_progress', JSON.stringify(updatedLocalData))
          console.log(`📱 Step ${step} saved to localStorage`)

          // If we have a tempUserId, try to save to Firebase as well
          if (data.tempUserId) {
            try {
              await setDoc(doc(db, 'signup_progress', data.tempUserId), stepData)
              console.log(`🔥 Step ${step} saved to Firebase for user ${data.tempUserId}`)
            } catch (firebaseError: any) {
              console.warn(`⚠️ Firebase save failed for step ${step}: ${firebaseError.message}`)
              // Continue anyway since localStorage save was successful
            }
          } else {
            console.log(`⚠️ Step ${step} saved to localStorage only (no tempUserId)`)
          }

          return { data: { success: true } }
        } catch (error: any) {
          console.error(`❌ Failed to save step ${step}:`, error)
          return { error: { status: 'CUSTOM_ERROR', error: error.message } }
        }
      },
    }),

    createTempUser: builder.mutation<{ tempUserId: string }, { userType: 'freelancer' | 'client' }>({
      queryFn: async ({ userType }) => {
        try {
          let tempUserId: string
          
          try {
            // Try to create anonymous user first
            const userCredential = await signInAnonymously(auth)
            tempUserId = userCredential.user.uid
            console.log(`🔥 Created anonymous user: ${tempUserId}`)
          } catch (authError: any) {
            // If anonymous auth fails, generate a temporary ID
            console.warn(`⚠️ Anonymous auth failed: ${authError.message}`)
            tempUserId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
            console.log(`🔧 Using temporary ID: ${tempUserId}`)
          }

          // Save initial progress data to both localStorage and Firebase
          const initialData = {
            userType,
            currentStep: 1,
            tempUserId,
            createdAt: new Date().toISOString(),
            lastSavedAt: new Date().toISOString(),
            isComplete: false
          }

          // Try to save to Firebase first (if available)
          try {
            await setDoc(doc(db, 'signup_progress', tempUserId), initialData)
            console.log(`🔥 Created temp user ${tempUserId} in Firebase signup_progress collection`)
          } catch (firebaseError: any) {
            console.warn(`⚠️ Firebase save failed: ${firebaseError.message}`)
          }
          
          // Always save to localStorage as backup
          localStorage.setItem('bizzlink_signup_progress', JSON.stringify(initialData))
          console.log(`📱 Saved temp user data to localStorage`)

          return { data: { tempUserId } }
        } catch (error: any) {
          console.error('❌ Failed to create temp user:', error)
          return { error: { status: 'CUSTOM_ERROR', error: error.message } }
        }
      },
    }),

    loadSignupProgress: builder.query<SignupFormData | null, string>({
      queryFn: async (tempUserId) => {
        try {
          // Try to load from Firebase first
          try {
            const progressDoc = await getDoc(doc(db, 'signup_progress', tempUserId))
            
            if (progressDoc.exists()) {
              console.log(`🔥 Loaded signup progress from Firebase for user ${tempUserId}`)
              return { data: progressDoc.data() as SignupFormData }
            }
          } catch (firebaseError: any) {
            console.warn(`⚠️ Firebase load failed: ${firebaseError.message}`)
          }

          // Fallback to localStorage
          const localData = localStorage.getItem('bizzlink_signup_progress')
          if (localData) {
            console.log(`📱 Loaded signup progress from localStorage`)
            return { data: JSON.parse(localData) as SignupFormData }
          }

          console.log(`ℹ️ No signup progress found for user ${tempUserId}`)
          return { data: null }
        } catch (error: any) {
          console.error(`❌ Failed to load signup progress:`, error)
          return { error: { status: 'CUSTOM_ERROR', error: error.message } }
        }
      },
    }),

    upgradeToFullUser: builder.mutation<User, { signupData: SignupFormData }>({
      queryFn: async ({ signupData }) => {
        try {
          // Create the actual user account with email/password
          const userCredential = await createUserWithEmailAndPassword(
            auth, 
            signupData.email, 
            signupData.password
          )
          const firebaseUser = userCredential.user
          
          // Update Firebase profile
          await updateProfile(firebaseUser, {
            displayName: `${signupData.firstname} ${signupData.lastname}`
          })
          
          // Send email verification
          await sendEmailVerification(firebaseUser)
          
          // Create full user document with string timestamps for Redux
          const userData: User = {
            userId: firebaseUser.uid,
            email: signupData.email,
            emailVerified: firebaseUser.emailVerified,
            firstname: signupData.firstname,
            lastname: signupData.lastname,
            displayName: `${signupData.firstname} ${signupData.lastname}`,
            role: (signupData.userType as string) === 'freelancer' ? 'freelancer' : 'client',
            title: signupData.title || '',
            overview: signupData.overview || '',
            hourRate: '$ 0',
            photoURL: firebaseUser.photoURL || '',
            isActive: true,
            isVerified: firebaseUser.emailVerified,
            accountStatus: 'pending',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            lastLoginAt: new Date().toISOString(),
            about: {
              streetAddress: '',
              city: '',
              state: '',
              country: '',
              zipCode: '',
              tel: '',
              dob: '',
              profileUrl: '',
              downloadLink: ''
            },
            skills: [],
            specialties: [],
            education: [],
            employment: [],
            portfolio: [],
            stats: {
              totalJobs: 0,
              completedJobs: 0,
              activeProjects: 0,
              totalEarnings: 0,
              totalSpent: 0,
              averageRating: 0,
              totalReviews: 0,
              responseRate: 0,
              onTimeDelivery: 0
            },
            preferences: {
              timezone: 'UTC',
              language: 'en',
              currency: 'USD',
              emailNotifications: true,
              pushNotifications: true,
              availability: 'available'
            }
          }
          
          // Create Firestore version with Firestore Timestamps
          const firestoreUserData = {
            ...userData,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
            lastLoginAt: Timestamp.now(),
          }
          
          await setDoc(doc(db, 'users', firebaseUser.uid), firestoreUserData)
          
          // Clean up temporary data
          if (signupData.tempUserId) {
            await deleteDoc(doc(db, 'signup_progress', signupData.tempUserId))
          }
          // Don't clear localStorage here - let useProgressiveSignup handle it
          // localStorage.removeItem('bizzlink_signup_progress')
          
          return { data: userData }
        } catch (error: any) {
          return { error: { status: 'CUSTOM_ERROR', error: error.message } }
        }
      },
      invalidatesTags: ['User'],
    }),

    googleSignupStep: builder.mutation<{ user: User; isNewUser: boolean }, { userType?: 'freelancer' | 'client' }>({
      queryFn: async ({ userType }) => {
        try {
          const provider = new GoogleAuthProvider()
          
          // Add popup configuration to handle CORP policy issues
          provider.setCustomParameters({
            prompt: 'select_account'
          })
          
          const userCredential = await signInWithPopup(auth, provider)
          const firebaseUser = userCredential.user
          
          // Check if user exists in Firestore
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
          
          if (userDoc.exists()) {
            // Existing user - login
            const userData = userDoc.data()
            
            // Clean up any progress data only for existing users
            // For existing users returning, we can clear signup progress
            localStorage.removeItem('bizzlink_signup_progress')
            localStorage.removeItem('bizzlink_user_onboarding')
            
            return { data: { user: serializeUser(userData), isNewUser: false } }
          } else {
            // New user - create profile with provided userType or default
            const now = new Date().toISOString()
            const userData: User = {
              userId: firebaseUser.uid,
              email: firebaseUser.email!,
              emailVerified: firebaseUser.emailVerified,
              firstname: firebaseUser.displayName?.split(' ')[0] || '',
              lastname: firebaseUser.displayName?.split(' ').slice(1).join(' ') || '',
              displayName: firebaseUser.displayName || '',
              role: userType === 'freelancer' ? 'freelancer' : userType === 'client' ? 'client' : 'client',
              title: '',
              overview: '',
              hourRate: '$ 0',
              photoURL: firebaseUser.photoURL || '',
              isActive: true,
              isVerified: firebaseUser.emailVerified,
              accountStatus: 'active',
              createdAt: now,
              updatedAt: now,
              lastLoginAt: now,
              about: {
                streetAddress: '',
                city: '',
                state: '',
                country: '',
                zipCode: '',
                tel: '',
                dob: '',
                profileUrl: '',
                downloadLink: ''
              },
              skills: [],
              specialties: [],
              education: [],
              employment: [],
              portfolio: [],
              stats: {
                totalJobs: 0,
                completedJobs: 0,
                activeProjects: 0,
                totalEarnings: 0,
                totalSpent: 0,
                averageRating: 0,
                totalReviews: 0,
                responseRate: 0,
                onTimeDelivery: 0
              },
              preferences: {
                timezone: 'UTC',
                language: 'en',
                currency: 'USD',
                emailNotifications: true,
                pushNotifications: true,
                availability: 'available'
              }
            }
            
            // For Firestore, we need to convert string timestamps back to Firestore Timestamps
            const firestoreUserData = {
              ...userData,
              createdAt: Timestamp.now(),
              updatedAt: Timestamp.now(),
              lastLoginAt: Timestamp.now(),
            }
            
            await setDoc(doc(db, 'users', firebaseUser.uid), firestoreUserData)
            
            // Don't clean up progress data here - let the calling hook handle it
            // This preserves signup flow data for new Google users
            
            return { data: { user: userData, isNewUser: true } }
          }
        } catch (error: any) {
          console.error('Google Signup Error:', error)
          
          // Handle specific Google Auth errors
          if (error.code === 'auth/popup-closed-by-user') {
            return { error: { status: 'CUSTOM_ERROR', error: 'Authentication cancelled. Please try again.' } }
          } else if (error.code === 'auth/popup-blocked') {
            return { error: { status: 'CUSTOM_ERROR', error: 'Popup blocked. Please allow popups and try again.' } }
          } else if (error.message?.includes('Cross-Origin-Opener-Policy')) {
            return { error: { status: 'CUSTOM_ERROR', error: 'Browser security settings are blocking authentication. Please try again or use a different browser.' } }
          } else if (error.code === 'auth/cancelled-popup-request') {
            return { error: { status: 'CUSTOM_ERROR', error: 'Authentication request was cancelled. Please try again.' } }
          }
          
          return { error: { status: 'CUSTOM_ERROR', error: error.message } }
        }
      },
      invalidatesTags: ['User'],
    }),

    // Onboarding Data Persistence Endpoints
    updateUserSpecialties: builder.mutation<ApiResponse<User>, { userId: string; specialties: string[] }>({
      queryFn: async ({ userId, specialties }) => {
        try {
          const userRef = doc(db, 'users', userId)
          await updateDoc(userRef, { 
            specialties,
            updatedAt: Timestamp.now()
          })
          
          // Fetch updated user data
          const updatedUser = await getDoc(userRef)
          if (!updatedUser.exists()) {
            throw new Error('User not found')
          }
          
          return { data: { data: serializeUser({ userId, ...updatedUser.data() }), message: 'Specialties updated successfully' } }
        } catch (error: any) {
          return { error: { status: 'CUSTOM_ERROR', error: error.message } }
        }
      },
      invalidatesTags: ['User'],
    }),

    updateUserEducation: builder.mutation<ApiResponse<User>, { userId: string; education: UserEducation[] }>({
      queryFn: async ({ userId, education }) => {
        try {
          const userRef = doc(db, 'users', userId)
          await updateDoc(userRef, { 
            education,
            updatedAt: Timestamp.now()
          })
          
          const updatedUser = await getDoc(userRef)
          if (!updatedUser.exists()) {
            throw new Error('User not found')
          }
          
          return { data: { data: serializeUser({ userId, ...updatedUser.data() }), message: 'Education updated successfully' } }
        } catch (error: any) {
          return { error: { status: 'CUSTOM_ERROR', error: error.message } }
        }
      },
      invalidatesTags: ['User'],
    }),

    updateUserPortfolio: builder.mutation<ApiResponse<User>, { userId: string; portfolio: UserPortfolio[] }>({
      queryFn: async ({ userId, portfolio }) => {
        try {
          const userRef = doc(db, 'users', userId)
          await updateDoc(userRef, { 
            portfolio,
            updatedAt: Timestamp.now()
          })
          
          const updatedUser = await getDoc(userRef)
          if (!updatedUser.exists()) {
            throw new Error('User not found')
          }
          
          return { data: { data: serializeUser({ userId, ...updatedUser.data() }), message: 'Portfolio updated successfully' } }
        } catch (error: any) {
          return { error: { status: 'CUSTOM_ERROR', error: error.message } }
        }
      },
      invalidatesTags: ['User'],
    }),

    updateUserEmployment: builder.mutation<ApiResponse<User>, { userId: string; employment: UserEmployment[] }>({
      queryFn: async ({ userId, employment }) => {
        try {
          const userRef = doc(db, 'users', userId)
          await updateDoc(userRef, { 
            employment,
            updatedAt: Timestamp.now()
          })
          
          const updatedUser = await getDoc(userRef)
          if (!updatedUser.exists()) {
            throw new Error('User not found')
          }
          
          return { data: { data: serializeUser({ userId, ...updatedUser.data() }), message: 'Employment updated successfully' } }
        } catch (error: any) {
          return { error: { status: 'CUSTOM_ERROR', error: error.message } }
        }
      },
      invalidatesTags: ['User'],
    }),

    updateUserSkills: builder.mutation<ApiResponse<User>, { userId: string; skills: UserSkill[] }>({
      queryFn: async ({ userId, skills }) => {
        try {
          const userRef = doc(db, 'users', userId)
          await updateDoc(userRef, { 
            skills,
            updatedAt: Timestamp.now()
          })
          
          const updatedUser = await getDoc(userRef)
          if (!updatedUser.exists()) {
            throw new Error('User not found')
          }
          
          return { data: { data: serializeUser({ userId, ...updatedUser.data() }), message: 'Skills updated successfully' } }
        } catch (error: any) {
          return { error: { status: 'CUSTOM_ERROR', error: error.message } }
        }
      },
      invalidatesTags: ['User'],
    }),

    updateUserRates: builder.mutation<ApiResponse<User>, { userId: string; hourRate: string; title: string; overview: string }>({
      queryFn: async ({ userId, hourRate, title, overview }) => {
        try {
          const userRef = doc(db, 'users', userId)
          await updateDoc(userRef, { 
            hourRate,
            title,
            overview,
            updatedAt: Timestamp.now()
          })
          
          const updatedUser = await getDoc(userRef)
          if (!updatedUser.exists()) {
            throw new Error('User not found')
          }
          
          return { data: { data: serializeUser({ userId, ...updatedUser.data() }), message: 'Profile updated successfully' } }
        } catch (error: any) {
          return { error: { status: 'CUSTOM_ERROR', error: error.message } }
        }
      },
      invalidatesTags: ['User'],
    }),

    updateUserLocationAndProfile: builder.mutation<ApiResponse<User>, {
      userId: string;
      locationData: {
        country: string;
        countryCode: string;
        city: string;
        timezone: string;
        primaryLanguage: string;
        additionalLanguages: string[];
        phoneNumber?: string;
        dateOfBirth?: string;
        bio?: string;
        linkedinUrl?: string;
        websiteUrl?: string;
        githubUrl?: string;
        profileImageUrl?: string;
      };
    }>({
      queryFn: async ({ userId, locationData }) => {
        try {
          const userRef = doc(db, 'users', userId)
          
          // Prepare the update data
          const updateData: any = {
            updatedAt: Timestamp.now(),
            'about.country': locationData.country,
            'about.countryCode': locationData.countryCode,
            'about.city': locationData.city,
            'about.timezone': locationData.timezone,
            'about.primaryLanguage': locationData.primaryLanguage,
            'about.additionalLanguages': locationData.additionalLanguages,
            'preferences.timezone': locationData.timezone,
            'preferences.language': locationData.primaryLanguage,
          }

          // Add optional fields if provided
          if (locationData.phoneNumber) {
            updateData['about.tel'] = locationData.phoneNumber
          }
          if (locationData.dateOfBirth) {
            updateData['about.dateOfBirth'] = locationData.dateOfBirth
            updateData['about.dob'] = locationData.dateOfBirth // Keep both for compatibility
          }
          if (locationData.bio) {
            updateData['about.bio'] = locationData.bio
          }
          if (locationData.linkedinUrl) {
            updateData['about.linkedinUrl'] = locationData.linkedinUrl
          }
          if (locationData.websiteUrl) {
            updateData['about.websiteUrl'] = locationData.websiteUrl
          }
          if (locationData.githubUrl) {
            updateData['about.githubUrl'] = locationData.githubUrl
          }
          if (locationData.profileImageUrl) {
            updateData.photoURL = locationData.profileImageUrl
          }

          await updateDoc(userRef, updateData)
          
          const updatedUser = await getDoc(userRef)
          if (!updatedUser.exists()) {
            throw new Error('User not found')
          }
          
          return { data: { data: serializeUser({ userId, ...updatedUser.data() }), message: 'Location and profile updated successfully' } }
        } catch (error: any) {
          return { error: { status: 'CUSTOM_ERROR', error: error.message } }
        }
      },
      invalidatesTags: ['User'],
    }),

    // Get user onboarding data
    getUserOnboardingData: builder.query<User, string>({
      queryFn: async (userId) => {
        try {
          const userDoc = await getDoc(doc(db, 'users', userId))
          if (!userDoc.exists()) {
            throw new Error('User not found')
          }
          
          return { data: serializeUser({ userId, ...userDoc.data() }) }
        } catch (error: any) {
          return { error: { status: 'CUSTOM_ERROR', error: error.message } }
        }
      },
      providesTags: ['User'],
    }),

    // Get complete user profile data
    getUserProfile: builder.query<User, string>({
      queryFn: async (userId) => {
        try {
          const userDoc = await getDoc(doc(db, 'users', userId))
          if (!userDoc.exists()) {
            throw new Error('User not found')
          }
          
          return { data: serializeUser({ userId, ...userDoc.data() }) }
        } catch (error: any) {
          return { error: { status: 'CUSTOM_ERROR', error: error.message } }
        }
      },
      providesTags: ['User'],
    }),

    // Update comprehensive user profile
    updateUserProfile: builder.mutation<ApiResponse<User>, {
      userId: string;
      profileData: Partial<User>;
    }>({
      queryFn: async ({ userId, profileData }) => {
        try {
          const userRef = doc(db, 'users', userId)
          
          // Update the document with new data
          await updateDoc(userRef, {
            ...profileData,
            updatedAt: new Date().toISOString()
          })
          
          // Get the updated user data
          const updatedDoc = await getDoc(userRef)
          if (!updatedDoc.exists()) {
            throw new Error('Failed to retrieve updated user data')
          }
          
          const updatedUser = serializeUser({ userId, ...updatedDoc.data() })
          
          return {
            data: {
              success: true,
              message: 'Profile updated successfully',
              data: updatedUser
            }
          }
        } catch (error: any) {
          return { error: { status: 'CUSTOM_ERROR', error: error.message } }
        }
      },
      invalidatesTags: ['User'],
    }),
  }),
})

export const {
  useLoginMutation,
  useSignupMutation,
  useGoogleAuthMutation,
  useLogoutMutation,
  useResetPasswordMutation,
  useGetProjectsQuery,
  useGetProjectQuery,
  useCreateProjectMutation,
  useGetProposalsQuery,
  useCreateProposalMutation,
  useUpdateProposalMutation,
  // Progressive signup hooks
  useSaveSignupStepMutation,
  useCreateTempUserMutation,
  useLoadSignupProgressQuery,
  useUpgradeToFullUserMutation,
  useGoogleSignupStepMutation,
  // Onboarding hooks
  useUpdateUserSpecialtiesMutation,
  useUpdateUserEducationMutation,
  useUpdateUserPortfolioMutation,
  useUpdateUserEmploymentMutation,
  useUpdateUserSkillsMutation,
  useUpdateUserRatesMutation,
  useUpdateUserLocationAndProfileMutation,
  useGetUserOnboardingDataQuery,
  // Profile management hooks
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
} = firebaseApi
