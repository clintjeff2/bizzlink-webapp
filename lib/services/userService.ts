import { 
  doc, 
  getDoc,
  getDocs,
  collection,
  query,
  where,
  documentId
} from 'firebase/firestore';
import { db } from '@/firebase';
import { User } from '../redux/types/firebaseTypes';

/**
 * Fetches a user by their userId
 */
export const getUserById = async (userId: string): Promise<User | null> => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      return { 
        userId, 
        ...userDoc.data() as Omit<User, 'userId'> 
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
};

/**
 * Fetches multiple users by their userIds
 */
export const getUsersByIds = async (userIds: string[]): Promise<Record<string, User>> => {
  if (!userIds || userIds.length === 0) {
    return {};
  }
  
  try {
    // Firebase only allows up to 10 IDs in an 'in' query, so batch them
    const batchSize = 10;
    const users: Record<string, User> = {};
    
    for (let i = 0; i < userIds.length; i += batchSize) {
      const batch = userIds.slice(i, i + batchSize);
      
      const usersQuery = query(
        collection(db, 'users'),
        where(documentId(), 'in', batch)
      );
      
      const userSnapshot = await getDocs(usersQuery);
      
      userSnapshot.forEach((doc) => {
        const userData = doc.data() as Omit<User, 'userId'>;
        users[doc.id] = { userId: doc.id, ...userData };
      });
    }
    
    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    return {};
  }
};

/**
 * Fetches project data by projectId
 */
export const getProjectById = async (projectId: string) => {
  try {
    const projectRef = doc(db, 'projects', projectId);
    const projectDoc = await getDoc(projectRef);
    
    if (projectDoc.exists()) {
      return { 
        projectId, 
        ...projectDoc.data() 
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching project:', error);
    return null;
  }
};

/**
 * Fetches proposal data by proposalId
 */
export const getProposalById = async (proposalId: string) => {
  try {
    const proposalRef = doc(db, 'proposals', proposalId);
    const proposalDoc = await getDoc(proposalRef);
    
    if (proposalDoc.exists()) {
      return { 
        proposalId, 
        ...proposalDoc.data() 
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching proposal:', error);
    return null;
  }
};

/**
 * Fetches contract data by contractId
 */
export const getContractById = async (contractId: string) => {
  try {
    const contractRef = doc(db, 'contracts', contractId);
    const contractDoc = await getDoc(contractRef);
    
    if (contractDoc.exists()) {
      return { 
        contractId, 
        ...contractDoc.data() 
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching contract:', error);
    return null;
  }
};
