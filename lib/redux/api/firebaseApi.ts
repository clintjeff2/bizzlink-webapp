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

// Create a cache for Firestore documents to handle non-serializable data
const documentCache = new Map();

// Cache cleanup function - call this periodically or when cache gets too large
const cleanupDocumentCache = () => {
  // Only keep the 50 most recent documents to prevent memory leaks
  if (documentCache.size > 50) {
    // Convert to array, sort by insertion time (if you added timestamps)
    // and delete oldest entries
    const entries = Array.from(documentCache.entries());
    const toDelete = entries.slice(0, entries.length - 50);
    
    toDelete.forEach(([key]) => {
      documentCache.delete(key);
    });
  }
};
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
  ApiResponse,
  UserEducation,
  UserEmployment,
  UserPortfolio,
  UserSkill,
  UserCertification
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

// Helper function to convert Firestore timestamps in projects to serializable strings
const serializeProject = (project: any): Project => {
  return {
    ...project,
    createdAt: project.createdAt instanceof Timestamp ? project.createdAt.toDate().toISOString() : project.createdAt,
    updatedAt: project.updatedAt instanceof Timestamp ? project.updatedAt.toDate().toISOString() : project.updatedAt,
    publishedAt: project.publishedAt instanceof Timestamp ? project.publishedAt.toDate().toISOString() : project.publishedAt,
    closedAt: project.closedAt instanceof Timestamp ? project.closedAt.toDate().toISOString() : project.closedAt,
    timeline: {
      ...project.timeline,
      startDate: project.timeline?.startDate instanceof Timestamp 
        ? project.timeline.startDate.toDate().toISOString() 
        : project.timeline?.startDate instanceof Date
        ? project.timeline.startDate.toISOString()
        : project.timeline?.startDate,
      endDate: project.timeline?.endDate instanceof Timestamp 
        ? project.timeline.endDate.toDate().toISOString() 
        : project.timeline?.endDate instanceof Date
        ? project.timeline.endDate.toISOString()
        : project.timeline?.endDate,
    },
    milestones: project.milestones?.map((milestone: any) => ({
      ...milestone,
      dueDate: milestone.dueDate instanceof Timestamp 
        ? milestone.dueDate.toDate().toISOString() 
        : milestone.dueDate instanceof Date
        ? milestone.dueDate.toISOString()
        : milestone.dueDate,
    })) || [],
    requirements: {
      ...project.requirements,
      attachments: project.requirements?.attachments?.map((attachment: any) => ({
        ...attachment,
        uploadedAt: attachment.uploadedAt instanceof Timestamp
          ? attachment.uploadedAt.toDate().toISOString()
          : attachment.uploadedAt instanceof Date
          ? attachment.uploadedAt.toISOString()
          : attachment.uploadedAt,
      })) || [],
    },
  }
}

// Helper function to convert string dates to Timestamps for Firestore storage
const deserializeProjectForStorage = (project: any): any => {
  // Convert project for Firestore storage
  const result = { ...project }
  
  // Convert timeline dates to Timestamps if they're strings or Date objects
  if (result.timeline) {
    if (typeof result.timeline.startDate === 'string') {
      result.timeline.startDate = Timestamp.fromDate(new Date(result.timeline.startDate))
    } else if (result.timeline.startDate instanceof Date) {
      result.timeline.startDate = Timestamp.fromDate(result.timeline.startDate)
    }
    
    if (typeof result.timeline.endDate === 'string') {
      result.timeline.endDate = Timestamp.fromDate(new Date(result.timeline.endDate))
    } else if (result.timeline.endDate instanceof Date) {
      result.timeline.endDate = Timestamp.fromDate(result.timeline.endDate)
    }
  }
  
  // Convert milestone dates to Timestamps
  if (result.milestones) {
    result.milestones = result.milestones.map((milestone: any) => ({
      ...milestone,
      dueDate: typeof milestone.dueDate === 'string' 
        ? Timestamp.fromDate(new Date(milestone.dueDate))
        : milestone.dueDate instanceof Date
        ? Timestamp.fromDate(milestone.dueDate)
        : milestone.dueDate,
    }))
  }
  
  // Convert attachment dates to Timestamps
  if (result.requirements?.attachments) {
    result.requirements.attachments = result.requirements.attachments.map((attachment: any) => ({
      ...attachment,
      uploadedAt: typeof attachment.uploadedAt === 'string'
        ? Timestamp.fromDate(new Date(attachment.uploadedAt))
        : attachment.uploadedAt instanceof Date
        ? Timestamp.fromDate(attachment.uploadedAt)
        : attachment.uploadedAt,
    }))
  }
  
  // Return the deserialized project
  return result
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
              onTimeDelivery: 0,
              repeatClients: 0
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
                onTimeDelivery: 0,
              repeatClients: 0
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

    logout: builder.mutation<{ success: boolean }, void>({
      queryFn: async () => {
        try {
          await signOut(auth)
          return { data: { success: true } }
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
    getProjects: builder.query<{ projects: Project[], lastDoc: any }, { 
      limit?: number; 
      status?: string; 
      skills?: string[];
      categories?: string[];
      experienceLevel?: string;
      minBudget?: number;
      maxBudget?: number;
      freelancerId?: string;
      matchFreelancerSkills?: boolean;
      lastDoc?: any 
    }>({
      queryFn: async ({ 
        limit: queryLimit = 10, 
        status = 'active', 
        skills, 
        categories,
        experienceLevel,
        minBudget,
        maxBudget,
        freelancerId,
        matchFreelancerSkills = false,
        lastDoc 
      }) => {
        try {
          // Start projects query with the provided parameters

          // Start with base query - always filter by active status for public listings
          // This ensures we only show projects that are open for proposals
          let q = query(
            collection(db, 'projects'),
            where('status', '==', status),
            orderBy('createdAt', 'desc'),
            limit(queryLimit)
          )
          
          // Apply additional filters
          if (categories && categories.length > 0) {
            // Firebase doesn't support multiple 'where' clauses on different fields
            // with array-contains-any, so we'll filter by category in memory if needed
            q = query(q, where('category', 'in', categories))
          }
          
          if (skills && skills.length > 0 && !matchFreelancerSkills) {
            q = query(q, where('requirements.skills', 'array-contains-any', skills))
          }
          
          // Experience level is no longer part of the initial query filter
          // It will be applied as a client-side filter instead
          
          if (lastDoc) {
            // If lastDoc is a string (document ID), retrieve the actual DocumentSnapshot from cache
            const actualLastDoc = typeof lastDoc === 'string' ? documentCache.get(lastDoc) : lastDoc;
            if (actualLastDoc) {
              q = query(q, startAfter(actualLastDoc));
            }
          }
          
          // Fetch freelancer data if we need to match by freelancer skills
          let freelancerData = null;
          if (freelancerId && matchFreelancerSkills) {
            const userDoc = await getDoc(doc(db, 'users', freelancerId));
            if (userDoc.exists()) {
              freelancerData = userDoc.data();
              // Freelancer data fetched successfully
            }
          }
          
          // Execute query
          const querySnapshot = await getDocs(q)
          // Query execution completed
          
          // Get projects and apply any in-memory filtering
          let projects = querySnapshot.docs.map(doc => {
            const data = doc.data()
            const project = {
              projectId: doc.id,
              ...data
            } as Project
            
            // Serialize project for Redux
            return serializeProject(project)
          })
          
          // Apply budget filtering in memory since Firebase doesn't easily support
          // complex filtering on nested fields
          if (minBudget !== undefined || maxBudget !== undefined) {
            projects = projects.filter(project => {
              const projectBudget = project.budget.type === 'fixed' 
                ? project.budget.amount 
                : project.budget.maxAmount;
                
              const meetsMinBudget = minBudget !== undefined ? projectBudget >= minBudget : true;
              const meetsMaxBudget = maxBudget !== undefined ? projectBudget <= maxBudget : true;
              
              return meetsMinBudget && meetsMaxBudget;
            });
          }
          
          // Filter by freelancer skills if requested
          if (freelancerId && matchFreelancerSkills && freelancerData) {
            // First, try to match projects based on skills/specialties
            const matchedProjects = projects.filter(project => {
              // Extract freelancer skills and specialties
              const freelancerSkills = freelancerData.skills?.map((s: any) => s.text.toLowerCase()) || [];
              const freelancerSpecialties = freelancerData.specialties?.map((s: string) => s.toLowerCase()) || [];
              
              // Check if project skills match freelancer skills or specialties
              const projectSkills = project.requirements?.skills?.map(s => s.toLowerCase()) || [];
              const projectCategory = project.category?.toLowerCase();
              const projectSubcategory = project.subcategory?.toLowerCase();
              
              // Calculate matches:
              // 1. Check if any project skills match freelancer skills (more relaxed matching)
              const hasSkillMatch = projectSkills.some(skill => 
                freelancerSkills.some((fSkill: string) => 
                  fSkill.includes(skill) || skill.includes(fSkill)
                )
              );
              
              // 2. Check if project category/subcategory matches freelancer specialties
              // More relaxed matching using partial matches
              const hasSpecialtyMatch = 
                (projectCategory && freelancerSpecialties.some((specialty: string) => 
                  specialty.includes(projectCategory) || 
                  projectCategory.includes(specialty))) || 
                (projectSubcategory && freelancerSpecialties.some((specialty: string) => 
                  specialty.includes(projectSubcategory) || 
                  projectSubcategory.includes(specialty)));
              
              // 3. Check experience level match - instead of filtering, use it for scoring
              const requiredLevel = project.requirements?.experienceLevel || 'entry';
              const freelancerLevel = determineFreelancerLevel(freelancerData);
              const hasLevelMatch = 
                requiredLevel === 'entry' || 
                (requiredLevel === 'intermediate' && (freelancerLevel === 'intermediate' || freelancerLevel === 'expert')) ||
                (requiredLevel === 'expert' && freelancerLevel === 'expert');
              
              // Consider a project a good match if it matches skills OR specialties
              // We no longer filter by experience level, just skill/specialty match
              return hasSkillMatch || hasSpecialtyMatch;
            });
            
            // If we found skill or specialty matches, use them to boost those projects to the top
            // but don't exclude non-matching projects entirely
            if (matchedProjects.length > 0) {
              // Sort projects so matched ones appear first
              const nonMatchedProjects = projects.filter(
                project => !matchedProjects.some(p => p.projectId === project.projectId)
              );
              
              // Combine matched projects (first) with non-matched projects (after)
              projects = [...matchedProjects, ...nonMatchedProjects];
            }
            
            // Add a relevance score to each project for better sorting
            projects = projects.map(project => {
              const requiredLevel = project.requirements?.experienceLevel || 'entry';
              const freelancerLevel = determineFreelancerLevel(freelancerData);
              
              // Check if level matches (freelancer meets or exceeds required level)
              const hasLevelMatch = 
                requiredLevel === 'entry' || 
                (requiredLevel === 'intermediate' && (freelancerLevel === 'intermediate' || freelancerLevel === 'expert')) ||
                (requiredLevel === 'expert' && freelancerLevel === 'expert');
              
              // Calculate relevance score (higher is better)
              const relevanceScore = (hasLevelMatch ? 100 : 0) + 
                (matchedProjects.some(p => p.projectId === project.projectId) ? 200 : 0);
              
              return {
                ...project,
                relevanceScore
              };
            });
          }
          
          // Filter out projects that already have a hired freelancer
          projects = projects.filter(project => !project.hiredFreelancerId);
          
          // Project filtering completed
          
          // Helper function to determine freelancer experience level based on profile data
          function determineFreelancerLevel(freelancerData: any): 'entry' | 'intermediate' | 'expert' {
            // Check if the freelancer has explicitly set their experience level
            if (freelancerData.experienceLevel) {
              return freelancerData.experienceLevel;
            }
            
            // Otherwise, calculate based on years of experience or completed projects
            const yearsOfExperience = freelancerData.yearsOfExperience || 0;
            const completedProjects = freelancerData.completedProjects || 0;
            const rating = freelancerData.rating || 0;
            
            // Simple algorithm to determine level
            if (yearsOfExperience > 5 || completedProjects > 20 || rating > 4.5) {
              return 'expert';
            } else if (yearsOfExperience > 2 || completedProjects > 5 || rating > 4.0) {
              return 'intermediate';
            } else {
              return 'entry';
            }
          }
          
          // Get the last document for pagination
          const lastVisible = querySnapshot.docs.length > 0 ? querySnapshot.docs[querySnapshot.docs.length - 1] : null;
          
          // We need to make lastDoc serializable for Redux
          // Instead of returning the DocumentSnapshot directly, store it in a cache and return a reference
          // We'll use the document ID as a reference
          const lastDocId = lastVisible ? lastVisible.id : null;
          
          // Store the actual DocumentSnapshot in a module-level cache
          if (lastVisible) {
            // Add to documentCache
            documentCache.set(lastDocId, lastVisible);
            
            // Clean up the cache occasionally to prevent memory leaks
            cleanupDocumentCache();
          }
          
          return { 
            data: { 
              projects: projects,
              // Return a serializable reference instead of the actual DocumentSnapshot
              lastDoc: lastDocId
            }
          }
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
          
          // Serialize the project before returning it to Redux
          return { data: serializeProject(project) }
        } catch (error: any) {
          return { error: { status: 'CUSTOM_ERROR', error: error.message } }
        }
      },
      providesTags: ['Project'],
    }),

    getProjectsByClient: builder.query<Project[], { 
      clientId: string;
      status?: string;
      limit?: number;
    }>({
      queryFn: async ({ clientId, status, limit: queryLimit = 50 }) => {
        try {
          // Starting client projects query
          
          let q = query(
            collection(db, 'projects'),
            where('clientId', '==', clientId),
            limit(queryLimit)
          )
          
          if (status) {
            q = query(
              collection(db, 'projects'),
              where('clientId', '==', clientId),
              where('status', '==', status),
              limit(queryLimit)
            )
            // Added status filter to query
          }
          
          // Execute Firestore query
          const querySnapshot = await getDocs(q)
          
          const projects = querySnapshot.docs.map((doc, index) => {
            const data = doc.data()
            console.log(`9.${index + 1}. Project data:`, { 
              id: doc.id, 
              clientId: data.clientId,
              title: data.title,
              status: data.status,
              createdAt: data.createdAt 
            })
            const project = {
              projectId: doc.id,
              ...data
            } as Project
            
            // Serialize each project before returning to Redux
            return serializeProject(project)
          })
          
          // Sort by createdAt in memory (most recent first)
          projects.sort((a, b) => {
            // Handle different timestamp formats safely
            let aTime = 0;
            let bTime = 0;
            
            if (a.createdAt) {
              if (typeof a.createdAt === 'string') {
                aTime = new Date(a.createdAt).getTime();
              } else if (typeof a.createdAt === 'object' && a.createdAt !== null && 'seconds' in a.createdAt) {
                // Firestore timestamp object
                aTime = (a.createdAt as { seconds: number }).seconds * 1000;
              }
            }
            
            if (b.createdAt) {
              if (typeof b.createdAt === 'string') {
                bTime = new Date(b.createdAt).getTime();
              } else if (typeof b.createdAt === 'object' && b.createdAt !== null && 'seconds' in b.createdAt) {
                // Firestore timestamp object
                bTime = (b.createdAt as { seconds: number }).seconds * 1000;
              }
            }
            return bTime - aTime
          })
          
          // Return projects to Redux
          return { data: projects }
        } catch (error: any) {
          console.error("=== FIREBASE QUERY ERROR ===")
          console.error("Error details:", error)
          console.error("Error message:", error.message)
          console.error("Error code:", error.code)
          console.error("============================")
          return { error: { status: 'CUSTOM_ERROR', error: error.message } }
        }
      },
      providesTags: ['Project'],
    }),

    createProject: builder.mutation<Project, Omit<Project, 'projectId' | 'createdAt' | 'updatedAt' | 'publishedAt' | 'closedAt'>>({
      queryFn: async (projectData) => {
        try {
          const docRef = doc(collection(db, 'projects'))
          const now = Timestamp.now()
          
          // Deserialize string dates to Timestamps for Firestore storage
          const deserializedProjectData = deserializeProjectForStorage(projectData)
          
          const newProject = {
            ...deserializedProjectData,
            projectId: docRef.id,
            createdAt: now,
            updatedAt: now,
            publishedAt: projectData.status === 'active' ? now : null,
            closedAt: null,
          }
          
          await setDoc(docRef, newProject)
          
          // Serialize the project before returning it to Redux
          const serializedProject = serializeProject(newProject)
          
          return { data: serializedProject }
        } catch (error: any) {
          console.error('🚀 CreateProject error:', error)
          return { error: { status: 'CUSTOM_ERROR', error: error.message } }
        }
      },
      invalidatesTags: ['Project'],
    }),

    updateProject: builder.mutation<Project, { projectId: string; updateData: Partial<Project> }>({
      queryFn: async ({ projectId, updateData }) => {
        try {
          const projectRef = doc(db, 'projects', projectId)
          
          // Deserialize string dates to Timestamps for Firestore storage
          const deserializedUpdateData = deserializeProjectForStorage(updateData)
          
          const updateDataWithTimestamp = {
            ...deserializedUpdateData,
            updatedAt: Timestamp.now(),
            // Set publishedAt if status is being changed to active
            ...(updateData.status === 'active' && !updateData.publishedAt && { publishedAt: Timestamp.now() }),
            // Set closedAt if status is being changed to completed or cancelled
            ...((['completed', 'cancelled'].includes(updateData.status as string)) && { closedAt: Timestamp.now() })
          }
          
          await updateDoc(projectRef, updateDataWithTimestamp)
          
          const updatedDoc = await getDoc(projectRef)
          const docData = updatedDoc.data()
          const project = {
            projectId: updatedDoc.id,
            ...docData
          } as Project
          
          // Serialize the project before returning it to Redux
          return { data: serializeProject(project) }
        } catch (error: any) {
          return { error: { status: 'CUSTOM_ERROR', error: error.message } }
        }
      },
      invalidatesTags: ['Project'],
    }),

    saveProjectDraft: builder.mutation<{ success: boolean; projectId?: string }, {
      projectData: Partial<Project>;
      isDraft: boolean;
    }>({
      queryFn: async ({ projectData, isDraft }) => {
        try {
          let docRef: any
          
          if (projectData.projectId) {
            // Update existing draft
            docRef = doc(db, 'projects', projectData.projectId)
            await updateDoc(docRef, {
              ...projectData,
              status: isDraft ? 'draft' : 'active',
              updatedAt: Timestamp.now(),
              ...((!isDraft && !projectData.publishedAt) && { publishedAt: Timestamp.now() })
            })
          } else {
            // Create new draft
            docRef = doc(collection(db, 'projects'))
            const now = Timestamp.now()
            await setDoc(docRef, {
              ...projectData,
              projectId: docRef.id,
              status: isDraft ? 'draft' : 'active',
              createdAt: now,
              updatedAt: now,
              publishedAt: isDraft ? null : now,
              closedAt: null,
            })
          }
          
          return { 
            data: { 
              success: true, 
              projectId: docRef.id 
            } 
          }
        } catch (error: any) {
          return { error: { status: 'CUSTOM_ERROR', error: error.message } }
        }
      },
      invalidatesTags: ['Project'],
    }),

    // Proposal endpoints
    getProposal: builder.query<Proposal, string>({
      queryFn: async (proposalId) => {
        try {
          const docRef = doc(db, 'proposals', proposalId);
          const docSnap = await getDoc(docRef);
          
          if (!docSnap.exists()) {
            throw new Error('Proposal not found');
          }
          
          const data = docSnap.data();
          
          // Serialize timestamps for Redux
          const serializedData = {
            ...data,
            submittedAt: data.submittedAt ? data.submittedAt.toDate().toISOString() : null,
            updatedAt: data.updatedAt ? data.updatedAt.toDate().toISOString() : null,
            respondedAt: data.respondedAt ? data.respondedAt.toDate().toISOString() : null,
            bid: data.bid ? {
              ...data.bid,
              deliveryDate: data.bid.deliveryDate ? data.bid.deliveryDate.toDate().toISOString() : null
            } : null
          };
          
          const proposal = {
            proposalId: docSnap.id,
            ...serializedData
          } as Proposal;
          
          return { data: proposal };
        } catch (error: any) {
          return { error: { status: 'CUSTOM_ERROR', error: error.message } };
        }
      },
      providesTags: (result, error, id) => [{ type: 'Proposal', id }],
    }),

    getProposals: builder.query<Proposal[], { projectId?: string; freelancerId?: string }>({
      queryFn: async ({ projectId, freelancerId }) => {
        console.log('API - getProposals called with:', { projectId, freelancerId });
        
        try {
          let q = query(collection(db, 'proposals'), orderBy('createdAt', 'desc'))
          
          if (projectId) {
            console.log('API - Filtering proposals by projectId:', projectId);
            q = query(q, where('projectId', '==', projectId))
          }
          
          if (freelancerId) {
            console.log('API - Filtering proposals by freelancerId:', freelancerId);
            q = query(q, where('freelancerId', '==', freelancerId))
          }
          
          console.log('API - Executing Firestore query for proposals');
          const querySnapshot = await getDocs(q)
          console.log('API - Found proposal documents:', querySnapshot.size);
          
          const proposals = querySnapshot.docs.map(doc => {
            console.log('API - Processing proposal document:', doc.id);
            const data = doc.data()
            
            // Serialize Firestore timestamps to ISO strings for Redux
            const serializedData = {
              ...data,
              submittedAt: data.submittedAt ? data.submittedAt.toDate().toISOString() : null,
              updatedAt: data.updatedAt ? data.updatedAt.toDate().toISOString() : null,
              respondedAt: data.respondedAt ? data.respondedAt.toDate().toISOString() : null,
              bid: data.bid ? {
                ...data.bid,
                deliveryDate: data.bid.deliveryDate ? data.bid.deliveryDate.toDate().toISOString() : null
              } : null
            };
            
            const processedProposal = {
              proposalId: doc.id,
              ...serializedData
            } as Proposal;
            
            console.log('API - Processed proposal:', {
              id: processedProposal.proposalId,
              projectId: processedProposal.projectId,
              freelancerId: processedProposal.freelancerId,
              status: processedProposal.status
            });
            
            return processedProposal;
          })
          
          console.log('API - Returning proposals data, count:', proposals.length);
          return { data: proposals }
        } catch (error: any) {
          console.error("Error fetching proposals:", error);
          return { error: { status: 'CUSTOM_ERROR', error: error.message } }
        }
      },
      providesTags: ['Proposal'],
    }),

    createProposal: builder.mutation<Proposal, any>({
      queryFn: async (proposalData) => {
        try {
          // Ensure required fields
          if (!proposalData.projectId) {
            throw new Error("Project ID is required")
          }
          if (!proposalData.freelancerId) {
            throw new Error("Freelancer ID is required")
          }
          
          // Check if the freelancer has already submitted a proposal for this project
          const existingProposalQuery = query(
            collection(db, 'proposals'),
            where('projectId', '==', proposalData.projectId),
            where('freelancerId', '==', proposalData.freelancerId)
          )
          
          const existingProposalSnapshot = await getDocs(existingProposalQuery)
          
          if (!existingProposalSnapshot.empty) {
            throw new Error("You have already submitted a proposal for this project")
          }
          
          // Convert JS Date objects to Firestore Timestamps with safer handling
          let formattedProposalData = {
            ...proposalData,
            submittedAt: (() => {
              if (proposalData.submittedAt instanceof Date) {
                return Timestamp.fromDate(proposalData.submittedAt);
              } else if (typeof proposalData.submittedAt === 'string') {
                return Timestamp.fromDate(new Date(proposalData.submittedAt));
              } else if (proposalData.submittedAt instanceof Timestamp) {
                return proposalData.submittedAt;
              } else {
                return Timestamp.now();
              }
            })(),
            updatedAt: (() => {
              if (proposalData.updatedAt instanceof Date) {
                return Timestamp.fromDate(proposalData.updatedAt);
              } else if (typeof proposalData.updatedAt === 'string') {
                return Timestamp.fromDate(new Date(proposalData.updatedAt));
              } else if (proposalData.updatedAt instanceof Timestamp) {
                return proposalData.updatedAt;
              } else {
                return Timestamp.now();
              }
            })(),
            respondedAt: null, // Initialize as null until the client responds
            bid: {
              ...proposalData.bid,
              deliveryDate: (() => {
                if (proposalData.bid?.deliveryDate instanceof Date) {
                  return Timestamp.fromDate(proposalData.bid.deliveryDate);
                } else if (typeof proposalData.bid?.deliveryDate === 'string') {
                  return Timestamp.fromDate(new Date(proposalData.bid.deliveryDate));
                } else if (proposalData.bid?.deliveryDate instanceof Timestamp) {
                  return proposalData.bid.deliveryDate;
                } else {
                  return Timestamp.fromDate(new Date(Date.now() + (30 * 24 * 60 * 60 * 1000))); // Default to 30 days from now
                }
              })()
            }
          }
          
          // Create a new proposal document
          const proposalRef = doc(collection(db, 'proposals'))
          const proposalId = proposalRef.id
          
          // Add the proposalId to the data
          formattedProposalData.proposalId = proposalId
          
          // Save the proposal
          await setDoc(proposalRef, formattedProposalData)
          
          // Update the project's proposal count
          const projectRef = doc(db, 'projects', proposalData.projectId)
          await updateDoc(projectRef, {
            proposalCount: (await getDoc(projectRef)).data()?.proposalCount + 1 || 1
          })
          
          // Create a notification for the project owner
          try {
            const projectSnapshot = await getDoc(projectRef)
            const projectData = projectSnapshot.data()
            
            if (projectData && projectData.clientId) {
              const notificationRef = doc(collection(db, 'notifications'))
              await setDoc(notificationRef, {
                notificationId: notificationRef.id,
                userId: projectData.clientId,
                type: 'proposal_received',
                title: 'New Proposal Received',
                message: `${proposalData.freelancerInfo.name} submitted a proposal for your project "${projectData.title}"`,
                data: {
                  projectId: proposalData.projectId,
                  proposalId: proposalId
                },
                isRead: false,
                isPush: true,
                isEmail: true,
                createdAt: Timestamp.now(),
                readAt: null
              })
            }
          } catch (notificationError) {
            // Don't fail the proposal submission if notification creation fails
            console.error('Failed to create notification:', notificationError)
          }
          
          // Return serialized proposal data for Redux with safer handling
          const serializedProposal = {
            ...formattedProposalData,
            submittedAt: formattedProposalData.submittedAt?.toDate ? 
              formattedProposalData.submittedAt.toDate().toISOString() : 
              formattedProposalData.submittedAt ? new Date(formattedProposalData.submittedAt).toISOString() : null,
            updatedAt: formattedProposalData.updatedAt?.toDate ? 
              formattedProposalData.updatedAt.toDate().toISOString() : 
              formattedProposalData.updatedAt ? new Date(formattedProposalData.updatedAt).toISOString() : null,
            respondedAt: null,
            bid: {
              ...formattedProposalData.bid,
              deliveryDate: formattedProposalData.bid?.deliveryDate?.toDate ? 
                formattedProposalData.bid.deliveryDate.toDate().toISOString() : 
                formattedProposalData.bid?.deliveryDate ? new Date(formattedProposalData.bid.deliveryDate).toISOString() : null
            }
          }
          
          return { data: serializedProposal as Proposal }
        } catch (error: any) {
          return { error: { status: 'CUSTOM_ERROR', error: error.message } }
        }
      },
      invalidatesTags: ['Proposal', 'Project'],
    }),

    updateProposal: builder.mutation<Proposal, { id: string; proposal: any }>({
      queryFn: async ({ id, proposal }) => {
        try {
          const proposalRef = doc(db, 'proposals', id);
          
          // Convert dates back to Firestore Timestamps
          const formattedProposalData = {
            ...proposal,
            // Safely handle submittedAt date
            submittedAt: (() => {
              if (proposal.submittedAt instanceof Date) {
                return Timestamp.fromDate(proposal.submittedAt);
              } else if (typeof proposal.submittedAt === 'string') {
                return Timestamp.fromDate(new Date(proposal.submittedAt));
              } else if (proposal.submittedAt instanceof Timestamp) {
                return proposal.submittedAt;
              } else {
                return Timestamp.fromDate(new Date());
              }
            })(),
            updatedAt: Timestamp.fromDate(new Date()),
            bid: {
              ...proposal.bid,
              // Safely handle deliveryDate
              deliveryDate: (() => {
                if (proposal.bid?.deliveryDate instanceof Date) {
                  return Timestamp.fromDate(proposal.bid.deliveryDate);
                } else if (typeof proposal.bid?.deliveryDate === 'string') {
                  return Timestamp.fromDate(new Date(proposal.bid.deliveryDate));
                } else if (proposal.bid?.deliveryDate instanceof Timestamp) {
                  return proposal.bid.deliveryDate;
                } else {
                  return Timestamp.fromDate(new Date(Date.now() + (30 * 24 * 60 * 60 * 1000))); // Default to 30 days from now
                }
              })()
            }
          };
          
          // Update the document
          await setDoc(proposalRef, formattedProposalData);
          
          // Fetch the updated document
          const updatedDoc = await getDoc(proposalRef);
          if (!updatedDoc.exists()) {
            throw new Error('Proposal not found after update');
          }
          
          const docData = updatedDoc.data();
          
          // Serialize the data for Redux
          const serializedProposal = {
            proposalId: updatedDoc.id,
            ...docData,
            submittedAt: docData.submittedAt.toDate().toISOString(),
            updatedAt: docData.updatedAt.toDate().toISOString(),
            respondedAt: docData.respondedAt ? docData.respondedAt.toDate().toISOString() : null,
            bid: {
              ...docData.bid,
              deliveryDate: docData.bid.deliveryDate.toDate().toISOString()
            }
          };
          
          return { data: serializedProposal as Proposal };
        } catch (error: any) {
          console.error('Error updating proposal:', error);
          return { error: { status: 'CUSTOM_ERROR', error: error.message } };
        }
      },
      invalidatesTags: ['Proposal', 'Project'],
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
              onTimeDelivery: 0,
              repeatClients: 0
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
                onTimeDelivery: 0,
              repeatClients: 0
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
          
          const userData = serializeUser({ userId, ...updatedUser.data() });
          
          // Return in the format RTK Query expects
          return { 
            data: {
              success: true,
              data: userData,
              message: 'Specialties updated successfully' 
            }
          }
        } catch (error: any) {
          return { 
            error: { 
              status: 'CUSTOM_ERROR', 
              data: error.message 
            }
          }
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
          
          return { data: { data: serializeUser({ userId, ...updatedUser.data() }), success: true, message: 'Education updated successfully' } }
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
          
          return { data: { data: serializeUser({ userId, ...updatedUser.data() }), success: true, message: 'Portfolio updated successfully' } }
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
          
          return { data: { data: serializeUser({ userId, ...updatedUser.data() }), success: true, message: 'Employment updated successfully' } }
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
          
          return { data: { data: serializeUser({ userId, ...updatedUser.data() }), success: true, message: 'Skills updated successfully' } }
        } catch (error: any) {
          return { error: { status: 'CUSTOM_ERROR', error: error.message } }
        }
      },
      invalidatesTags: ['User'],
    }),

    updateUserCertifications: builder.mutation<ApiResponse<User>, { userId: string; certifications: UserCertification[] }>({
      queryFn: async ({ userId, certifications }) => {
        try {
          const userRef = doc(db, 'users', userId)
          await updateDoc(userRef, { 
            certifications,
            updatedAt: Timestamp.now()
          })
          
          const updatedUser = await getDoc(userRef)
          if (!updatedUser.exists()) {
            throw new Error('User not found')
          }
          
          return { data: { data: serializeUser({ userId, ...updatedUser.data() }), success: true, message: 'Certifications updated successfully' } }
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
          
          return { data: { data: serializeUser({ userId, ...updatedUser.data() }), success: true, message: 'Profile updated successfully' } }
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
          
          return { data: { data: serializeUser({ userId, ...updatedUser.data() }), success: true, message: 'Location and profile updated successfully' } }
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
  useGetProjectsByClientQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useGetProposalQuery,
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
  useUpdateUserCertificationsMutation,
  useUpdateUserRatesMutation,
  useUpdateUserLocationAndProfileMutation,
  useGetUserOnboardingDataQuery,
  // Profile management hooks
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
} = firebaseApi
