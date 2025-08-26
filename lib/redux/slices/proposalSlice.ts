import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Proposal {
  id: string
  projectId: string
  projectTitle: string
  freelancerId: string
  freelancerName: string
  freelancerPhotoURL?: string
  coverLetter: string
  proposedRate: number
  estimatedDuration: string
  status: 'pending' | 'accepted' | 'rejected'
  createdAt: string
}

interface ProposalState {
  proposals: Proposal[]
  sentProposals: Proposal[]
  receivedProposals: Proposal[]
  loading: boolean
  error: string | null
}

const initialState: ProposalState = {
  proposals: [],
  sentProposals: [],
  receivedProposals: [],
  loading: false,
  error: null
}

export const proposalSlice = createSlice({
  name: 'proposals',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setProposals: (state, action: PayloadAction<Proposal[]>) => {
      state.proposals = action.payload
      state.error = null
    },
    setSentProposals: (state, action: PayloadAction<Proposal[]>) => {
      state.sentProposals = action.payload
      state.error = null
    },
    setReceivedProposals: (state, action: PayloadAction<Proposal[]>) => {
      state.receivedProposals = action.payload
      state.error = null
    },
    addProposal: (state, action: PayloadAction<Proposal>) => {
      state.proposals.unshift(action.payload)
      state.sentProposals.unshift(action.payload)
    },
    updateProposal: (state, action: PayloadAction<Proposal>) => {
      const updateArrays = [state.proposals, state.sentProposals, state.receivedProposals]
      
      updateArrays.forEach(array => {
        const index = array.findIndex(p => p.id === action.payload.id)
        if (index !== -1) {
          array[index] = action.payload
        }
      })
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
      state.loading = false
    }
  }
})

export const {
  setLoading,
  setProposals,
  setSentProposals,
  setReceivedProposals,
  addProposal,
  updateProposal,
  setError
} = proposalSlice.actions

export default proposalSlice.reducer
