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

// Define the Proposal interface based on the Firebase schema
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

// Service for interacting with Proposals in Firestore
const proposalService = {
  // Get all proposals for a specific freelancer
  getFreelancerProposals: async (freelancerId: string) => {
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
        proposals.push({
          ...data,
          proposalId: doc.id,
        } as Proposal);
      });
      
      return proposals;
    } catch (error) {
      console.error('Error getting freelancer proposals:', error);
      throw error;
    }
  },

  // Subscribe to real-time updates for a freelancer's proposals
  subscribeToFreelancerProposals: (freelancerId: string, callback: (proposals: Proposal[]) => void) => {
    const q = query(
      collection(db, 'proposals'),
      where('freelancerId', '==', freelancerId),
      orderBy('updatedAt', 'desc')
    );
    
    return onSnapshot(q, (querySnapshot) => {
      const proposals: Proposal[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        proposals.push({
          ...data,
          proposalId: doc.id,
        } as Proposal);
      });
      
      callback(proposals);
    }, (error) => {
      console.error('Error listening to proposals:', error);
    });
  },

  // Get a specific proposal by ID
  getProposal: async (proposalId: string) => {
    try {
      const docRef = doc(db, 'proposals', proposalId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          ...docSnap.data(),
          proposalId: docSnap.id,
        } as Proposal;
      } else {
        throw new Error('Proposal not found');
      }
    } catch (error) {
      console.error('Error getting proposal:', error);
      throw error;
    }
  },

  // Subscribe to real-time updates for a specific proposal
  subscribeToProposal: (proposalId: string, callback: (proposal: Proposal) => void) => {
    const docRef = doc(db, 'proposals', proposalId);
    
    return onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        callback({
          ...docSnap.data(),
          proposalId: docSnap.id,
        } as Proposal);
      }
    }, (error) => {
      console.error('Error listening to proposal:', error);
    });
  },

  // Update a proposal (e.g., withdraw, edit)
  updateProposal: async (proposalId: string, updates: Partial<Proposal>) => {
    try {
      const docRef = doc(db, 'proposals', proposalId);
      
      // Always update the updatedAt timestamp
      const updatedData = {
        ...updates,
        updatedAt: Timestamp.now(),
      };
      
      await updateDoc(docRef, updatedData);
      
      return {
        proposalId,
        ...updatedData,
      };
    } catch (error) {
      console.error('Error updating proposal:', error);
      throw error;
    }
  },

  // Withdraw a proposal
  withdrawProposal: async (proposalId: string) => {
    try {
      return await proposalService.updateProposal(proposalId, {
        status: 'withdrawn',
      });
    } catch (error) {
      console.error('Error withdrawing proposal:', error);
      throw error;
    }
  },

  // Get statistics for a freelancer's proposals
  getFreelancerProposalStats: async (freelancerId: string) => {
    try {
      const proposals = await proposalService.getFreelancerProposals(freelancerId);
      
      return {
        totalProposals: proposals.length,
        submittedProposals: proposals.filter(p => p.status === 'submitted').length,
        shortlistedProposals: proposals.filter(p => p.status === 'shortlisted').length,
        acceptedProposals: proposals.filter(p => p.status === 'accepted').length,
        rejectedProposals: proposals.filter(p => p.status === 'rejected').length,
        withdrawnProposals: proposals.filter(p => p.status === 'withdrawn').length,
      };
    } catch (error) {
      console.error('Error getting proposal stats:', error);
      throw error;
    }
  }
};

export default proposalService;
