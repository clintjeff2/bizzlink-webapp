import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  getDoc, 
  doc, 
  addDoc, 
  updateDoc, 
  onSnapshot, 
  Timestamp, 
  orderBy 
} from 'firebase/firestore';
import { db } from '@/firebase';
import { AppDispatch } from '../store';

import { 
  serializeTimestamp, 
  deserializeTimestamp,
  enrichProposalWithProjectData
} from '../utils/proposalUtils';

// Helper to serialize a proposal for Redux
const serializeProposal = async (proposal: any): Promise<any> => {
  if (!proposal) return null;
  
  // First enrich with project data if needed
  const enrichedProposal = await enrichProposalWithProjectData(proposal);
  
  // Then serialize all timestamp fields
  return {
    ...enrichedProposal,
    bid: enrichedProposal.bid ? {
      ...enrichedProposal.bid,
      deliveryDate: enrichedProposal.bid.deliveryDate ? serializeTimestamp(enrichedProposal.bid.deliveryDate) : null,
    } : null,
    submittedAt: serializeTimestamp(enrichedProposal.submittedAt),
    updatedAt: serializeTimestamp(enrichedProposal.updatedAt),
    respondedAt: enrichedProposal.respondedAt ? serializeTimestamp(enrichedProposal.respondedAt) : null
  };
};

// Helper to deserialize a proposal for Firebase
const deserializeProposal = (proposal: any): any => {
  if (!proposal) return null;
  
  return {
    ...proposal,
    bid: proposal.bid ? {
      ...proposal.bid,
      deliveryDate: proposal.bid.deliveryDate ? deserializeTimestamp(proposal.bid.deliveryDate) : null,
    } : null,
    submittedAt: deserializeTimestamp(proposal.submittedAt),
    updatedAt: deserializeTimestamp(proposal.updatedAt),
    respondedAt: proposal.respondedAt ? deserializeTimestamp(proposal.respondedAt) : null
  };
};

// Firebase Proposal interface (with Timestamps)
export interface FirebaseProposal {
  proposalId: string;
  projectId: string;
  freelancerId: string;
  freelancerInfo: {
    name: string;
    photoURL: string;
    title: string;
    rating: number;
    completedJobs: number;
  };
  
  bid: {
    amount: number;
    currency: string;
    type: "fixed" | "hourly";
    timeline: string;
    deliveryDate: Timestamp;
  };
  
  coverLetter: string;
  attachments: Array<{
    fileName: string;
    fileUrl: string;
    fileType: string;
  }>;
  
  questions: Array<{
    question: string;
    answer: string;
  }>;
  
  status: "submitted" | "shortlisted" | "accepted" | "rejected" | "withdrawn";
  isInvited: boolean;
  submittedAt: Timestamp;
  updatedAt: Timestamp;
  respondedAt: Timestamp;
  
  projectTitle?: string;
  clientInfo?: {
    name: string;
    photoURL: string;
    rating: number;
    location: string;
  };
  projectDescription?: string;
  projectBudget?: {
    min: number;
    max: number;
    currency: string;
  };
  skills?: string[];
}

// Define the Proposal interface based on the Firebase schema
// For Redux storage, we use serialized string dates instead of Firestore Timestamps
export interface Proposal {
  proposalId: string;
  projectId: string;
  freelancerId: string;
  freelancerInfo: {
    name: string;
    photoURL: string;
    title: string;
    rating: number;
    completedJobs: number;
  };
  
  bid: {
    amount: number;
    currency: string;
    type: "fixed" | "hourly";
    timeline: string;
    deliveryDate: string | null; // ISO string
  };
  
  coverLetter: string;
  attachments: Array<{
    fileName: string;
    fileUrl: string;
    fileType: string;
  }> | [];
  
  questions: Array<{
    question: string;
    answer: string;
  }> | [];
  
  status: "submitted" | "shortlisted" | "accepted" | "rejected" | "withdrawn";
  isInvited: boolean;
  submittedAt: string | null; // ISO string
  updatedAt: string | null;   // ISO string
  respondedAt: string | null; // ISO string
  
  // Project details that we can denormalize for quicker access
  projectTitle?: string;
  clientInfo?: {
    name: string;
    photoURL: string;
    rating: number;
    location: string;
  };
  projectDescription?: string;
  projectBudget?: {
    min: number;
    max: number;
    currency: string;
  };
  skills?: string[];
}

interface ProposalState {
  proposals: Proposal[];
  currentProposal: Proposal | null;
  loading: boolean;
  error: string | null;
  stats: {
    total: number;
    submitted: number;
    shortlisted: number;
    accepted: number;
    rejected: number;
    withdrawn: number;
  };
}

const initialState: ProposalState = {
  proposals: [],
  currentProposal: null,
  loading: false,
  error: null,
  stats: {
    total: 0,
    submitted: 0,
    shortlisted: 0,
    accepted: 0,
    rejected: 0,
    withdrawn: 0,
  }
}

// Async thunks for Firebase operations
export const fetchFreelancerProposals = createAsyncThunk(
  'proposals/fetchFreelancerProposals',
  async (freelancerId: string, { rejectWithValue }) => {
    try {
      const q = query(
        collection(db, 'proposals'),
        where('freelancerId', '==', freelancerId),
        orderBy('updatedAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const proposals: Proposal[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        // Serialize Timestamps before storing in Redux
        const serializedProposal = serializeProposal({
          ...data,
          proposalId: doc.id,
        });
        proposals.push(serializedProposal as Proposal);
      });
      
      return proposals;
    } catch (error) {
      console.error('Error fetching freelancer proposals:', error);
      return rejectWithValue('Failed to fetch proposals');
    }
  }
);

export const fetchProposal = createAsyncThunk(
  'proposals/fetchProposal',
  async (proposalId: string, { rejectWithValue }) => {
    try {
      const docRef = doc(db, 'proposals', proposalId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        // Serialize Timestamps before storing in Redux
        const serializedProposal = serializeProposal({
          ...docSnap.data(),
          proposalId: docSnap.id,
        });
        return serializedProposal as Proposal;
      } else {
        return rejectWithValue('Proposal not found');
      }
    } catch (error) {
      console.error('Error fetching proposal:', error);
      return rejectWithValue('Failed to fetch proposal');
    }
  }
);

export const updateProposalStatus = createAsyncThunk(
  'proposals/updateProposalStatus',
  async ({ 
    proposalId, 
    status, 
    updates = {} 
  }: { 
    proposalId: string, 
    status?: Proposal['status'], 
    updates?: Record<string, any> 
  }, { rejectWithValue }) => {
    try {
      const docRef = doc(db, 'proposals', proposalId);
      
      // Create Firestore Timestamp for database
      const firestoreUpdatedData: Record<string, any> = {
        updatedAt: Timestamp.now(),
        ...updates
      };

      // Add status if provided
      if (status) {
        firestoreUpdatedData.status = status;
      }
      
      await updateDoc(docRef, firestoreUpdatedData);
      
      // Return serialized data for Redux
      const serializedUpdates: Record<string, any> = {
        updatedAt: serializeTimestamp(firestoreUpdatedData.updatedAt),
      };

      // Add status if provided
      if (status) {
        serializedUpdates.status = status;
      }

      // Add any other updates
      Object.keys(updates).forEach(key => {
        if (updates[key] instanceof Timestamp) {
          serializedUpdates[key] = serializeTimestamp(updates[key]);
        } else {
          serializedUpdates[key] = updates[key];
        }
      });
      
      return { proposalId, updates: serializedUpdates };
    } catch (error) {
      console.error('Error updating proposal:', error);
      return rejectWithValue('Failed to update proposal');
    }
  }
);

export const withdrawProposal = createAsyncThunk(
  'proposals/withdrawProposal',
  async (proposalId: string, { dispatch }) => {
    return dispatch(updateProposalStatus({ proposalId, status: 'withdrawn' }));
  }
);

// Setup subscription to proposals - not a thunk but an action creator
// This is used to set up real-time listener for proposals
export const subscribeToFreelancerProposals = (freelancerId: string) => (dispatch: AppDispatch) => {
  const q = query(
    collection(db, 'proposals'),
    where('freelancerId', '==', freelancerId),
    orderBy('updatedAt', 'desc')
  );
  
  return onSnapshot(q, async (querySnapshot) => {
    try {
      const proposals: Proposal[] = [];
      const processingPromises: Promise<void>[] = [];
      
      // First pass: collect all proposals with basic serialization
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const basicSerializedProposal = {
          ...data,
          proposalId: doc.id,
          submittedAt: serializeTimestamp(data.submittedAt),
          updatedAt: serializeTimestamp(data.updatedAt),
          respondedAt: serializeTimestamp(data.respondedAt),
          bid: data.bid ? {
            ...data.bid,
            deliveryDate: data.bid.deliveryDate ? serializeTimestamp(data.bid.deliveryDate) : null,
          } : null,
        };
        proposals.push(basicSerializedProposal as Proposal);
      });
      
      // Dispatch the basic proposals immediately for a quick UI update
      dispatch(setProposals(proposals));
      dispatch(updateProposalStats(proposals));
      
      // Second pass: enrich with project data in the background
      // Create an array to collect the enrichment operations
      const enrichmentPromises = proposals.map(proposal => 
        enrichProposalWithProjectData(proposal)
          .then(enrichedProposal => ({
            index: proposals.findIndex(p => p.proposalId === proposal.proposalId),
            data: enrichedProposal as Proposal
          }))
          .catch(error => {
            console.error(`Error enriching proposal ${proposal.proposalId}:`, error);
            return null;
          })
      );
      
      // Wait for all enrichment operations to complete
      const results = await Promise.all(enrichmentPromises);
      
      // Create a new array with the enriched proposals
      const enrichedProposals = [...proposals];
      
      // Update the array with enriched data
      results.forEach(result => {
        if (result && result.index !== -1) {
          enrichedProposals[result.index] = result.data;
        }
      });
      
      // Update the state with the fully enriched proposals
      dispatch(setProposals(enrichedProposals));
    } catch (error) {
      console.error('Error processing proposals:', error);
      dispatch(setError('Failed to process proposals. Please try again.'));
    }
  }, (error) => {
    console.error('Error listening to proposals:', error);
    dispatch(setError('Failed to listen to proposals updates'));
  });
};

// Setup subscription to a single proposal
export const subscribeToProposal = (proposalId: string) => (dispatch: AppDispatch) => {
  const docRef = doc(db, 'proposals', proposalId);
  
  return onSnapshot(docRef, async (docSnap) => {
    if (docSnap.exists()) {
      try {
        // Get the proposal data from Firestore
        const proposalData = {
          ...docSnap.data(),
          proposalId: docSnap.id,
        };
        
        // Use our helper function to serialize and enrich the proposal
        const serializedProposal = await serializeProposal(proposalData);
        
        dispatch(setCurrentProposal(serializedProposal as Proposal));
      } catch (error) {
        console.error("Error processing proposal data:", error);
        
        // Fallback to basic serialization if enrichment fails
        const basicSerializedProposal = {
          ...docSnap.data(),
          proposalId: docSnap.id,
          submittedAt: serializeTimestamp(docSnap.data().submittedAt),
          updatedAt: serializeTimestamp(docSnap.data().updatedAt),
          respondedAt: serializeTimestamp(docSnap.data().respondedAt),
        };
        
        dispatch(setCurrentProposal(basicSerializedProposal as Proposal));
      }
    } else {
      dispatch(setError('Proposal not found'));
    }
  }, (error) => {
    console.error('Error listening to proposal:', error);
    dispatch(setError('Failed to listen to proposal updates'));
  });
};

// Slice definition
export const proposalSlice = createSlice({
  name: 'proposals',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setProposals: (state, action: PayloadAction<Proposal[]>) => {
      state.proposals = action.payload;
      state.error = null;
    },
    setCurrentProposal: (state, action: PayloadAction<Proposal>) => {
      state.currentProposal = action.payload;
      state.error = null;
    },
    clearCurrentProposal: (state) => {
      state.currentProposal = null;
    },
    updateProposalStats: (state, action: PayloadAction<Proposal[]>) => {
      const proposals = action.payload;
      state.stats = {
        total: proposals.length,
        submitted: proposals.filter(p => p.status === 'submitted').length,
        shortlisted: proposals.filter(p => p.status === 'shortlisted').length,
        accepted: proposals.filter(p => p.status === 'accepted').length,
        rejected: proposals.filter(p => p.status === 'rejected').length,
        withdrawn: proposals.filter(p => p.status === 'withdrawn').length,
      };
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchFreelancerProposals
      .addCase(fetchFreelancerProposals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFreelancerProposals.fulfilled, (state, action) => {
        state.loading = false;
        state.proposals = action.payload;
        // Also update stats
        state.stats = {
          total: action.payload.length,
          submitted: action.payload.filter(p => p.status === 'submitted').length,
          shortlisted: action.payload.filter(p => p.status === 'shortlisted').length,
          accepted: action.payload.filter(p => p.status === 'accepted').length,
          rejected: action.payload.filter(p => p.status === 'rejected').length,
          withdrawn: action.payload.filter(p => p.status === 'withdrawn').length,
        };
      })
      .addCase(fetchFreelancerProposals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // fetchProposal
      .addCase(fetchProposal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProposal.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProposal = action.payload;
      })
      .addCase(fetchProposal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // updateProposalStatus
      .addCase(updateProposalStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProposalStatus.fulfilled, (state, action) => {
        state.loading = false;
        // Update the proposal in the array if it exists
        const index = state.proposals.findIndex(p => p.proposalId === action.payload.proposalId);
        if (index !== -1) {
          state.proposals[index] = {
            ...state.proposals[index],
            ...action.payload.updates
          };
        }
        // Also update the current proposal if it matches
        if (state.currentProposal && state.currentProposal.proposalId === action.payload.proposalId) {
          state.currentProposal = {
            ...state.currentProposal,
            ...action.payload.updates
          };
        }
        
        // Recalculate stats
        const proposals = state.proposals;
        state.stats = {
          total: proposals.length,
          submitted: proposals.filter(p => p.status === 'submitted').length,
          shortlisted: proposals.filter(p => p.status === 'shortlisted').length,
          accepted: proposals.filter(p => p.status === 'accepted').length,
          rejected: proposals.filter(p => p.status === 'rejected').length,
          withdrawn: proposals.filter(p => p.status === 'withdrawn').length,
        };
      })
      .addCase(updateProposalStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const {
  setLoading,
  setProposals,
  setCurrentProposal,
  clearCurrentProposal,
  updateProposalStats,
  setError
} = proposalSlice.actions;

export default proposalSlice.reducer;
