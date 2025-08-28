/**
 * Bizzlink Firebase Database Types
 * 
 * This file contains all TypeScript interfaces for Firebase Firestore collections.
 * These types ensure consistency between web and mobile applications.
 * 
 * @version 1.0.0
 * @lastUpdated 2025-08-26
 */

import { Timestamp } from 'firebase/firestore'

// =============================================================================
// USER TYPES
// =============================================================================

export interface User {
  userId: string;                    // Firebase Auth UID
  email: string;
  emailVerified: boolean;
  firstname: string;
  lastname: string;
  displayName: string;               // computed: firstname + lastname
    role: 'client' | 'admin' | 'freelancer'
  title: string;                     // Professional title
  overview: string;                  // Bio/description
  hourRate: string;                  // e.g., "$ 20"
  photoURL: string;                  // Profile image URL
  isActive: boolean;
  isVerified: boolean;               // Identity verification
  paymentVerified?: boolean;         // Payment method verification
  phoneVerified?: boolean;           // Phone number verification
  accountStatus: "active" | "suspended" | "pending";
  createdAt: string;                 // ISO string instead of Timestamp
  updatedAt: string;                 // ISO string instead of Timestamp
  lastLoginAt: string;               // ISO string instead of Timestamp
  
  // Professional Links
  websiteUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  
  // Additional profile data
  languages?: Array<{
    language: string;
    proficiency: string;
  }>;
  certifications?: Array<{
    id: string;
    name: string;
    issuer: string;
    issueDate: string;
    expirationDate?: string;
    credentialId: string;
    credentialUrl?: string;
  }>;
  
  // Personal Information
  about: UserAboutInfo;
  
  // Professional Info (for service providers)
  skills: UserSkill[];
  specialties: string[];             // Array of specialty categories
  education: UserEducation[];
  employment: UserEmployment[];
  portfolio: UserPortfolio[];
  
  // Statistics
  stats: UserStats;
  
  // Preferences
  preferences: UserPreferences;
}

export interface UserAboutInfo {
  streetAddress: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  tel: string;
  dob: string;                       // ISO date
  profileUrl: string;
  downloadLink: string;
  bio?: string;                      // Personal bio/description
  timezone?: string;                 // User's timezone
  
  // Professional Links
  websiteUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  
  // Client-specific Company Information
  companyName?: string;              // Company name for clients
  industry?: string;                 // Industry for clients
  companySize?: string;              // Company size for clients
  companyDescription?: string;       // Company description for clients
  
  // Languages
  primaryLanguage?: string;
  additionalLanguages?: Array<{
    language: string;
    proficiency: string;
  }>;
}

export interface UserSkill {
  id: string;
  text: string;
  level: "beginner" | "intermediate" | "expert";
  yearsOfExperience: number;
}

export interface UserEducation {
  id: number;
  schoolName: string;
  location: string;
  degree: string;
  studyField: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface UserEmployment {
  id: number;
  companyName: string;
  jobTitle: string;
  city: string;
  country: string;
  startDate: string;
  endDate: string;                   // "Present" for current
  description: string;
  current?: boolean;                 // true if currently employed here
}

export interface UserCertification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expirationDate?: string;
  credentialId: string;
  credentialUrl?: string;
}

export interface UserPortfolio {
  id: string;
  title: string;
  description: string;
  imageLink: string;
  projectUrl: string;
  role: string;
  completionDate: string;
  skills: Array<{
    id: string;
    text: string;
  }>;
}

export interface UserStats {
  totalJobs: number;
  completedJobs: number;
  activeProjects: number;
  totalEarnings: number;
  totalSpent: number;                // For clients
  averageRating: number;
  totalReviews: number;
  responseRate: number;
  onTimeDelivery: number;
  repeatClients: number;
  hirRate?: number;                  // For clients - hire rate percentage
}

export interface UserPreferences {
  timezone: string;
  language: string;
  currency: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  availability: "available" | "busy" | "unavailable";
}

// =============================================================================
// PROJECT TYPES
// =============================================================================

export interface Project {
  projectId: string;
  title: string;
  description: string;
  detailedRequirements?: string;      // Detailed requirements and specifications
  category: string;
  subcategory: string;
  clientId: string;                  // Reference to users collection
  clientInfo: ProjectClientInfo;
  budget: ProjectBudget;
  timeline: ProjectTimeline;
  requirements: ProjectRequirements;
  status: "draft" | "active" | "in_progress" | "completed" | "cancelled";
  visibility: "public" | "private" | "invited_only";
  proposalCount: number;
  hiredFreelancerId: string;         // When project is awarded
  milestones: ProjectMilestone[];
  createdAt: string;                 // ISO string instead of Timestamp
  updatedAt: string;                 // ISO string instead of Timestamp
  publishedAt: string | null;        // ISO string instead of Timestamp
  closedAt: string | null;           // ISO string instead of Timestamp
}

export interface ProjectClientInfo {
  name: string;
  photoURL: string;
  verificationStatus: boolean;
}

export interface ProjectBudget {
  type: "fixed" | "hourly";
  amount: number;
  currency: string;
  minAmount: number;                 // For hourly projects
  maxAmount: number;
}

export interface ProjectTimeline {
  duration: string;                  // "1 week", "2 months", etc.
  startDate: string;                 // ISO string instead of Timestamp
  endDate: string;                   // ISO string instead of Timestamp
  isUrgent: boolean;
}

export interface ProjectRequirements {
  skills: string[];
  experienceLevel: "entry" | "intermediate" | "expert";
  freelancerType: "individual" | "team";
  location: "remote" | "onsite" | "hybrid";
  attachments: ProjectAttachment[];
}

export interface ProjectAttachment {
  fileName: string;
  fileUrl: string;
  fileType: string;
  uploadedAt: string;               // ISO string instead of Timestamp
}

export interface ProjectMilestone {
  id: string;
  title: string;
  description: string;
  amount: number;
  dueDate: string;                   // ISO string instead of Timestamp
  status: "pending" | "in_progress" | "completed" | "approved";
  deliverables: string[];
}

// =============================================================================
// PROPOSAL TYPES
// =============================================================================

export interface Proposal {
  proposalId: string;
  projectId: string;
  freelancerId: string;
  freelancerInfo: ProposalFreelancerInfo;
  bid: ProposalBid;
  coverLetter: string;
  attachments: ProposalAttachment[];
  questions: ProposalQuestion[];
  status: "submitted" | "shortlisted" | "accepted" | "rejected" | "withdrawn";
  isInvited: boolean;
  submittedAt: Timestamp;
  updatedAt: Timestamp;
  respondedAt: Timestamp;
}

export interface ProposalFreelancerInfo {
  name: string;
  photoURL: string;
  title: string;
  rating: number;
  completedJobs: number;
}

export interface ProposalBid {
  amount: number;
  currency: string;
  type: "fixed" | "hourly";
  timeline: string;
  deliveryDate: Timestamp;
}

export interface ProposalAttachment {
  fileName: string;
  fileUrl: string;
  fileType: string;
}

export interface ProposalQuestion {
  question: string;
  answer: string;
}

// =============================================================================
// CONTRACT TYPES
// =============================================================================

export interface Contract {
  contractId: string;
  projectId: string;
  proposalId: string;
  clientId: string;
  freelancerId: string;
  terms: ContractTerms;
  status: "active" | "paused" | "completed" | "cancelled" | "disputed";
  progress: number;                  // 0-100
  milestones: ContractMilestone[];
  timeTracking: ContractTimeTracking;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  completedAt: Timestamp;
}

export interface ContractTerms {
  amount: number;
  currency: string;
  paymentType: "fixed" | "hourly";
  startDate: Timestamp;
  endDate: Timestamp;
  workingHoursPerWeek: number;
}

export interface ContractMilestone {
  id: string;
  title: string;
  amount: number;
  dueDate: Timestamp;
  status: string;
  submittedAt: Timestamp;
  approvedAt: Timestamp;
}

export interface ContractTimeTracking {
  totalHours: number;
  weeklyLimit: number;
  isManualTime: boolean;
}

// =============================================================================
// MESSAGING TYPES
// =============================================================================

export interface Conversation {
  conversationId: string;
  participants: string[];           // Array of user IDs
  type: "project_inquiry" | "contract_discussion" | "general";
  projectId?: string;               // Optional, if related to project
  contractId?: string;              // Optional, if related to contract
  lastMessage: ConversationLastMessage;
  unreadCount: Record<string, number>; // userId -> unread count
  isArchived: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface ConversationLastMessage {
  text: string;
  senderId: string;
  timestamp: Timestamp;
}

export interface Message {
  messageId: string;
  senderId: string;
  text: string;
  type: "text" | "file" | "image" | "system";
  attachments: MessageAttachment[];
  isRead: boolean;
  readAt: Timestamp;
  editedAt: Timestamp;
  timestamp: Timestamp;
}

export interface MessageAttachment {
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
}

// =============================================================================
// REVIEW TYPES
// =============================================================================

export interface Review {
  reviewId: string;
  contractId: string;
  projectId: string;
  reviewerId: string;               // Who is giving the review
  revieweeId: string;               // Who is being reviewed
  type: "client_to_freelancer" | "freelancer_to_client";
  rating: ReviewRating;
  feedback: string;
  isPublic: boolean;
  isRecommended: boolean;
  response: ReviewResponse;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface ReviewRating {
  overall: number;                  // 1-5
  communication: number;
  quality: number;
  timeliness: number;
  professionalism: number;
}

export interface ReviewResponse {
  text: string;
  respondedAt: Timestamp;
}

// =============================================================================
// PAYMENT TYPES
// =============================================================================

export interface Payment {
  paymentId: string;
  contractId: string;
  milestoneId: string;
  clientId: string;
  freelancerId: string;
  amount: PaymentAmount;
  status: "pending" | "escrowed" | "released" | "refunded" | "failed";
  type: "milestone" | "hourly" | "bonus" | "refund";
  paymentMethod: PaymentMethod;
  escrow: PaymentEscrow;
  createdAt: Timestamp;
  processedAt: Timestamp;
  completedAt: Timestamp;
}

export interface PaymentAmount {
  gross: number;
  fee: number;
  net: number;
  currency: string;
}

export interface PaymentMethod {
  type: "card" | "paypal" | "bank_transfer";
  last4: string;
  provider: string;
}

export interface PaymentEscrow {
  releasedAt: Timestamp;
  releaseCondition: string;
}

// =============================================================================
// NOTIFICATION TYPES
// =============================================================================

export interface Notification {
  notificationId: string;
  userId: string;
  type: "project_posted" | "proposal_received" | "payment_released" | "message_received";
  title: string;
  message: string;
  data: NotificationData;
  isRead: boolean;
  isPush: boolean;
  isEmail: boolean;
  createdAt: Timestamp;
  readAt: Timestamp;
}

export interface NotificationData {
  projectId?: string;
  contractId?: string;
  conversationId?: string;
}

// =============================================================================
// CATEGORY TYPES
// =============================================================================

export interface Category {
  categoryId: string;
  name: string;
  description: string;
  icon: string;
  isActive: boolean;
  subcategories: CategorySubcategory[];
  skillSuggestions: string[];
  createdAt: Timestamp;
}

export interface CategorySubcategory {
  id: string;
  name: string;
  description: string;
}

// =============================================================================
// ADMIN TYPES
// =============================================================================

export interface AdminSettings {
  settings: AdminPlatformSettings;
  analytics: AdminAnalytics;
}

export interface AdminPlatformSettings {
  platformFee: number;
  minimumWithdrawal: number;
  currencies: string[];
  paymentMethods: string[];
}

export interface AdminAnalytics {
  totalUsers: number;
  totalProjects: number;
  totalRevenue: number;
  lastUpdated: Timestamp;
}

// =============================================================================
// API REQUEST/RESPONSE TYPES
// =============================================================================

// Auth-related types
export interface LoginData {
  email: string;
  password: string;
}

export interface SignupData {
  userType: "freelancer" | "client";
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  title?: string;
  overview?: string;
}

export interface UpdateProfileData {
  firstname?: string;
  lastname?: string;
  title?: string;
  overview?: string;
  hourRate?: string;
  skills?: UserSkill[];
  about?: Partial<UserAboutInfo>;
  photoURL?: string;
}

// Project-related types
export interface CreateProjectData {
  title: string;
  description: string;
  category: string;
  subcategory: string;
  budget: ProjectBudget;
  timeline: ProjectTimeline;
  requirements: ProjectRequirements;
}

export interface UpdateProjectData {
  title?: string;
  description?: string;
  budget?: Partial<ProjectBudget>;
  timeline?: Partial<ProjectTimeline>;
  requirements?: Partial<ProjectRequirements>;
  status?: Project['status'];
}

// Proposal-related types
export interface CreateProposalData {
  projectId: string;
  bid: ProposalBid;
  coverLetter: string;
  attachments?: ProposalAttachment[];
  questions?: ProposalQuestion[];
}

export interface UpdateProposalData {
  bid?: Partial<ProposalBid>;
  coverLetter?: string;
  status?: Proposal['status'];
}

// Contract-related types
export interface CreateContractData {
  projectId: string;
  proposalId: string;
  freelancerId: string;
  terms: ContractTerms;
  milestones?: ContractMilestone[];
}

export interface UpdateContractData {
  terms?: Partial<ContractTerms>;
  status?: Contract['status'];
  progress?: number;
}

// Message-related types
export interface CreateMessageData {
  conversationId: string;
  text: string;
  type?: Message['type'];
  attachments?: MessageAttachment[];
}

export interface CreateConversationData {
  participants: string[];
  type: Conversation['type'];
  projectId?: string;
  contractId?: string;
}

// Review-related types
export interface CreateReviewData {
  contractId: string;
  projectId: string;
  revieweeId: string;
  type: Review['type'];
  rating: ReviewRating;
  feedback: string;
  isPublic: boolean;
  isRecommended: boolean;
}

// Query parameter types
export interface ProjectQueryParams {
  limit?: number;
  status?: Project['status'];
  category?: string;
  skills?: string[];
  minBudget?: number;
  maxBudget?: number;
  experienceLevel?: ProjectRequirements['experienceLevel'];
  location?: ProjectRequirements['location'];
  lastDoc?: any;
}

export interface ProposalQueryParams {
  projectId?: string;
  freelancerId?: string;
  status?: Proposal['status'];
  limit?: number;
}

export interface ContractQueryParams {
  clientId?: string;
  freelancerId?: string;
  status?: Contract['status'];
  limit?: number;
}

export interface MessageQueryParams {
  conversationId: string;
  limit?: number;
  lastDoc?: any;
}

export interface ConversationQueryParams {
  userId: string;
  type?: Conversation['type'];
  limit?: number;
}

// =============================================================================
// UTILITY TYPES
// =============================================================================

export type UserRole = User['role'];
export type ProjectStatus = Project['status'];
export type ProposalStatus = Proposal['status'];
export type ContractStatus = Contract['status'];
export type PaymentStatus = Payment['status'];
export type MessageType = Message['type'];
export type ConversationType = Conversation['type'];
export type ReviewType = Review['type'];
export type NotificationType = Notification['type'];

// Firebase document with ID
export type FirebaseDocument<T> = T & { id: string };

// Partial update types
export type PartialUpdate<T> = Partial<T> & { updatedAt: Timestamp };

// Create data types (without system fields)
export type CreateData<T> = Omit<T, 'createdAt' | 'updatedAt' | keyof { [K in keyof T]: T[K] extends string ? K : never }[keyof T] extends `${string}Id` ? keyof T : never>;

// Response wrapper for API calls
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

// Pagination response
export interface PaginatedResponse<T> {
  data: T[];
  hasMore: boolean;
  lastDoc: any;
  total?: number;
}

// Search filters
export interface SearchFilters {
  query?: string;
  category?: string;
  subcategory?: string;
  minBudget?: number;
  maxBudget?: number;
  experienceLevel?: string;
  location?: string;
  skills?: string[];
  dateRange?: {
    start: Timestamp;
    end: Timestamp;
  };
}
