import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs,
  Timestamp,
  startAfter
} from 'firebase/firestore';
import { db } from '@/firebase';
import { User, Project } from '../redux/types/firebaseTypes';

/**
 * Fetches featured freelancers based on rating and completed jobs
 */
export const getFeaturedFreelancers = async (count = 6): Promise<User[]> => {
  try {
    const usersRef = collection(db, 'users');
    // Query freelancers with high ratings, sorted by rating and completed jobs
    const q = query(
      usersRef,
      where('role', '==', 'freelancer'),
      where('isActive', '==', true),
      where('stats.averageRating', '>=', 4.5),
      orderBy('stats.averageRating', 'desc'),
      orderBy('stats.completedJobs', 'desc'),
      limit(count)
    );
    
    const querySnapshot = await getDocs(q);
    const freelancers: User[] = [];
    
    querySnapshot.forEach((doc) => {
      const userData = doc.data();
      // Convert Firestore timestamps to ISO strings
      freelancers.push({
        userId: doc.id,
        ...userData,
        createdAt: userData.createdAt instanceof Timestamp ? 
          userData.createdAt.toDate().toISOString() : userData.createdAt,
        updatedAt: userData.updatedAt instanceof Timestamp ? 
          userData.updatedAt.toDate().toISOString() : userData.updatedAt,
        lastLoginAt: userData.lastLoginAt instanceof Timestamp ? 
          userData.lastLoginAt.toDate().toISOString() : userData.lastLoginAt,
      } as User);
    });
    
    return freelancers;
  } catch (error) {
    console.error('Error fetching featured freelancers:', error);
    return [];
  }
};

/**
 * Fetches latest active projects
 */
export const getLatestProjects = async (count = 3): Promise<Project[]> => {
  try {
    const projectsRef = collection(db, 'projects');
    // Query active projects, sorted by publishedAt date (most recent first)
    const q = query(
      projectsRef,
      where('status', '==', 'active'),
      orderBy('publishedAt', 'desc'),
      limit(count)
    );
    
    const querySnapshot = await getDocs(q);
    const projects: Project[] = [];
    
    querySnapshot.forEach((doc) => {
      const projectData = doc.data();
      // Convert Firestore timestamps to ISO strings
      projects.push({
        projectId: doc.id,
        ...projectData,
        createdAt: projectData.createdAt instanceof Timestamp ? 
          projectData.createdAt.toDate().toISOString() : projectData.createdAt,
        updatedAt: projectData.updatedAt instanceof Timestamp ? 
          projectData.updatedAt.toDate().toISOString() : projectData.updatedAt,
        publishedAt: projectData.publishedAt instanceof Timestamp ? 
          projectData.publishedAt.toDate().toISOString() : projectData.publishedAt,
        closedAt: projectData.closedAt instanceof Timestamp ? 
          projectData.closedAt.toDate().toISOString() : projectData.closedAt,
        
        // Handle nested timestamps in timeline
        timeline: {
          ...projectData.timeline,
          startDate: projectData.timeline?.startDate instanceof Timestamp ? 
            projectData.timeline.startDate.toDate().toISOString() : projectData.timeline?.startDate,
          endDate: projectData.timeline?.endDate instanceof Timestamp ? 
            projectData.timeline.endDate.toDate().toISOString() : projectData.timeline?.endDate,
        }
      } as Project);
    });
    
    return projects;
  } catch (error) {
    console.error('Error fetching latest projects:', error);
    return [];
  }
};

/**
 * Calculate time difference in human-readable format
 */
export const getTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds ago`;
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
  }
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} ${diffInMonths === 1 ? 'month' : 'months'} ago`;
  }
  
  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} ${diffInYears === 1 ? 'year' : 'years'} ago`;
};

/**
 * Format currency with locale and currency symbol
 */
export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

/**
 * Generate budget range string from project budget
 */
export const getBudgetRangeString = (project: Project): string => {
  if (project.budget.type === 'fixed') {
    return formatCurrency(project.budget.amount, project.budget.currency);
  } else {
    return `${formatCurrency(project.budget.minAmount, project.budget.currency)} - ${formatCurrency(project.budget.maxAmount, project.budget.currency)} /hr`;
  }
};

/**
 * Get category counts
 * This function would typically fetch from analytics data
 * For now, we'll return mock data
 */
export const getCategoryMetrics = async () => {
  const categories = [
    { name: "Web Development", count: "2,847", icon: "💻", color: "bg-blue-50 text-blue-600" },
    { name: "Mobile Apps", count: "1,923", icon: "📱", color: "bg-green-50 text-green-600" },
    { name: "UI/UX Design", count: "3,156", icon: "🎨", color: "bg-pink-50 text-pink-600" },
    { name: "Digital Marketing", count: "2,234", icon: "📈", color: "bg-orange-50 text-orange-600" },
    { name: "Content Writing", count: "1,876", icon: "✍️", color: "bg-cyan-50 text-cyan-600" },
    { name: "Data Science", count: "987", icon: "📊", color: "bg-blue-50 text-blue-600" },
  ];
  
  return categories;
};

/**
 * Get platform statistics
 * This would typically come from an analytics collection
 * For now, we'll return mock data
 */
export const getPlatformStats = async () => {
  const stats = [
    { label: "Active Freelancers", value: "50,000+", icon: "Users", color: "text-blue-600" },
    { label: "Projects Completed", value: "125,000+", icon: "Briefcase", color: "text-green-600" },
    { label: "Total Earnings", value: "$45M+", icon: "DollarSign", color: "text-green-600" },
    { label: "Client Satisfaction", value: "98.5%", icon: "TrendingUp", color: "text-orange-600" },
  ];
  
  return stats;
};
