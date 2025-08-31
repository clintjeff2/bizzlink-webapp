import { Timestamp } from "firebase/firestore";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";

/**
 * Converts Firestore Timestamps to ISO string dates for Redux storage
 */
export const serializeTimestamp = (timestamp: Timestamp | undefined | null): string | null => {
  if (!timestamp) return null;
  return timestamp.toDate().toISOString();
};

/**
 * Converts ISO string dates back to Firestore Timestamps for database operations
 */
export const deserializeTimestamp = (isoString: string | null): Timestamp | null => {
  if (!isoString) return null;
  return Timestamp.fromDate(new Date(isoString));
};

/**
 * Helper function to format a date string for display
 */
export const formatDate = (dateString: string | null): string => {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

/**
 * Project interface based on FIREBASE_SCHEMA.md
 */
interface Project {
  projectId: string;
  title: string;
  description: string;
  category: string;
  subcategory: string;
  clientId: string;
  clientInfo: {
    name: string;
    photoURL: string;
    verificationStatus: boolean;
  };
  budget: {
    type: "fixed" | "hourly";
    amount: number;
    currency: string;
    minAmount?: number;
    maxAmount?: number;
  };
  timeline: {
    duration: string;
    startDate: string;
    endDate: string;
    isUrgent: boolean;
  };
  requirements: {
    skills: string[];
    experienceLevel: "entry" | "intermediate" | "expert";
    freelancerType: "individual" | "team";
    location: "remote" | "onsite" | "hybrid";
    attachments: Array<{
      fileName: string;
      fileUrl: string;
      fileType: string;
      uploadedAt: string;
    }>;
  };
  status: "draft" | "active" | "in_progress" | "completed" | "cancelled";
}

/**
 * Helper function to fetch project data for a proposal
 */
export const fetchProjectForProposal = async (projectId: string): Promise<Project | null> => {
  try {
    const projectRef = doc(db, 'projects', projectId);
    const projectSnap = await getDoc(projectRef);
    
    if (projectSnap.exists()) {
      return {
        ...projectSnap.data(),
        projectId: projectSnap.id
      } as Project;
    }
    return null;
  } catch (error) {
    console.error('Error fetching project data:', error);
    return null;
  }
};

/**
 * Helper function to fetch client data for a proposal
 */
export const fetchClientForProposal = async (clientId: string) => {
  try {
    const clientRef = doc(db, 'users', clientId);
    const clientSnap = await getDoc(clientRef);
    
    if (clientSnap.exists()) {
      return {
        ...clientSnap.data(),
        userId: clientSnap.id
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching client data:', error);
    return null;
  }
};

/**
 * Helper to enrich a proposal with project data
 */
export const enrichProposalWithProjectData = async (proposal: any) => {
  if (!proposal.projectTitle || !proposal.projectDescription) {
    try {
      const projectData = await fetchProjectForProposal(proposal.projectId);
      
      if (projectData) {
        return {
          ...proposal,
          projectTitle: projectData.title,
          projectDescription: projectData.description,
          projectBudget: projectData.budget,
          skills: projectData.requirements?.skills || [],
          clientInfo: projectData.clientInfo
        };
      }
    } catch (error) {
      console.error('Error enriching proposal:', error);
    }
  }
  return proposal;
};
