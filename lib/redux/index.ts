// Store
export { store } from './store'
export type { RootState, AppDispatch } from './store'

// Provider
export { ReduxProvider } from './provider'

// Hooks
export { useAppDispatch, useAppSelector } from './hooks'

// API
export {
  firebaseApi,
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
} from './api/firebaseApi'

// Slices
export { authSlice, setLoading, setUser, setError, logout, updateUser } from './slices/authSlice'
export type { User } from './slices/authSlice'

export { 
  projectSlice, 
  setLoading as setProjectLoading,
  setProjects,
  addProject,
  updateProject,
  setCurrentProject,
  setError as setProjectError,
  setFilters,
  clearFilters 
} from './slices/projectSlice'
export type { Project } from './slices/projectSlice'

export {
  proposalSlice,
  setLoading as setProposalLoading,
  setProposals,
  setCurrentProposal,
  clearCurrentProposal,
  updateProposalStats,
  setError as setProposalError,
  fetchFreelancerProposals,
  fetchProposal,
  updateProposalStatus,
  withdrawProposal,
  subscribeToFreelancerProposals,
  subscribeToProposal
} from './slices/proposalSlice'
export type { Proposal } from './slices/proposalSlice'

// Proposal selectors
export {
  selectAllProposals,
  selectCurrentProposal,
  selectProposalLoading,
  selectProposalError,
  selectProposalStats,
  selectSubmittedProposals,
  selectShortlistedProposals,
  selectAcceptedProposals,
  selectRejectedProposals,
  selectWithdrawnProposals
} from './selectors/proposalSelectors'

// Signup slice
export {
  signupSlice,
  setSignupData,
  setCurrentStep,
  markStepCompleted,
  setUserType,
  setBasicInfo,
  setProfileInfo,
  setTempUserId,
  setLoading as setSignupLoading,
  setAutoSaving,
  setError as setSignupError,
  markSignupComplete,
  resetSignup,
  loadSignupFromStorage,
} from './slices/signupSlice'
export type { SignupData } from './slices/signupSlice'

// Progressive signup hook
export { useProgressiveSignup } from './useProgressiveSignup'
