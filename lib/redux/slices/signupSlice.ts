import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface SignupData {
  // Step 1 - User Type Selection
  userType: 'freelancer' | 'client' | ''
  
  // Step 2 - Basic Info
  firstname: string
  lastname: string
  email: string
  password: string
  confirmPassword: string
  
  // Step 3 - Profile Setup (varies by user type)
  title?: string
  overview?: string
  skills?: string
  experience?: string
  hourlyRate?: string
  bio?: string
  agreeToTerms: boolean
  
  // Progress tracking
  currentStep: number
  completedSteps: number[]
  lastSavedAt?: string
  isComplete: boolean
  
  // Firebase user ID (when partially created)
  tempUserId?: string
}

interface SignupState {
  data: SignupData
  loading: boolean
  error: string | null
  autoSaving: boolean
}

const initialSignupData: SignupData = {
  userType: '',
  firstname: '',
  lastname: '',
  email: '',
  password: '',
  confirmPassword: '',
  title: '',
  overview: '',
  skills: '',
  experience: '',
  hourlyRate: '',
  bio: '',
  agreeToTerms: false,
  currentStep: 1,
  completedSteps: [],
  isComplete: false,
}

const initialState: SignupState = {
  data: initialSignupData,
  loading: false,
  error: null,
  autoSaving: false,
}

export const signupSlice = createSlice({
  name: 'signup',
  initialState,
  reducers: {
    setSignupData: (state, action: PayloadAction<Partial<SignupData>>) => {
      // Preserve completedSteps array if not explicitly provided
      const newData = { ...state.data, ...action.payload }
      
      // Ensure critical arrays are preserved if not explicitly set
      if (!action.payload.completedSteps && state.data.completedSteps) {
        newData.completedSteps = state.data.completedSteps
      } else if (!newData.completedSteps) {
        newData.completedSteps = []
      }
      
      state.data = newData
      state.data.lastSavedAt = new Date().toISOString()
    },
    
    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.data.currentStep = action.payload
    },
    
    markStepCompleted: (state, action: PayloadAction<number>) => {
      const step = action.payload
      // Ensure completedSteps is initialized as an array
      if (!state.data.completedSteps) {
        state.data.completedSteps = []
      }
      if (!state.data.completedSteps.includes(step)) {
        state.data.completedSteps.push(step)
      }
    },
    
    setUserType: (state, action: PayloadAction<'freelancer' | 'client'>) => {
      state.data.userType = action.payload
      state.data.lastSavedAt = new Date().toISOString()
    },
    
    setBasicInfo: (state, action: PayloadAction<{
      firstname: string
      lastname: string
      email: string
      password: string
      confirmPassword: string
    }>) => {
      Object.assign(state.data, action.payload)
      state.data.lastSavedAt = new Date().toISOString()
    },
    
    setProfileInfo: (state, action: PayloadAction<Partial<SignupData>>) => {
      Object.assign(state.data, action.payload)
      state.data.lastSavedAt = new Date().toISOString()
    },
    
    setTempUserId: (state, action: PayloadAction<string>) => {
      state.data.tempUserId = action.payload
    },
    
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    
    setAutoSaving: (state, action: PayloadAction<boolean>) => {
      state.autoSaving = action.payload
    },
    
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    
    markSignupComplete: (state) => {
      state.data.isComplete = true
      state.data.lastSavedAt = new Date().toISOString()
    },
    
    resetSignup: (state) => {
      state.data = initialSignupData
      state.loading = false
      state.error = null
      state.autoSaving = false
    },
    
    loadSignupFromStorage: (state, action: PayloadAction<SignupData>) => {
      const loadedData = action.payload
      
      // Ensure critical arrays are properly initialized
      if (!loadedData.completedSteps) {
        loadedData.completedSteps = []
      }
      
      state.data = loadedData
    },
  },
})

export const {
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
} = signupSlice.actions

export default signupSlice.reducer
