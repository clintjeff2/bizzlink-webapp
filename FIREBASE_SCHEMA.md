# Bizzlink Firebase Database Schema

This document outlines the complete Firebase Firestore database schema for the Bizzlink platform. This schema is designed to support both web and mobile applications with consistent data structures.

## Table of Contents

1. [Collections Overview](#collections-overview)
2. [Storage Buckets](#storage-buckets)
3. [Data Types & Conventions](#data-types--conventions)
4. [Collection Schemas](#collection-schemas)
5. [Relationships](#relationships)
6. [Security Rules Guidelines](#security-rules-guidelines)
7. [API Integration](#api-integration)

## Collections Overview

The Bizzlink platform uses the following main collections:

- **users** - User profiles and account information
- **projects** - Project listings and details
- **proposals** - Freelancer proposals for projects
- **contracts** - Active work agreements
- **conversations** - Message threads between users
- **messages** - Individual messages within conversations
- **reviews** - Ratings and feedback
- **payments** - Payment transactions and records
- **notifications** - User notifications
- **categories** - Project categories and skills
- **admin** - Platform settings and analytics

## Storage Buckets

### Profile Pictures (`profile-pictures/`)
**Purpose**: Stores user profile images with organized folder structure.

**Structure**:
```
profile-pictures/
├── {userId}/
│   ├── profile.jpg          // Main profile image
│   ├── profile_thumb.jpg    // Thumbnail version (150x150)
│   └── profile_medium.jpg   // Medium version (400x400)
```

**File Naming Convention**:
- Main image: `profile-pictures/{userId}/profile.{ext}`
- Thumbnail: `profile-pictures/{userId}/profile_thumb.{ext}`
- Medium: `profile-pictures/{userId}/profile_medium.{ext}`

**Supported Formats**: JPG, PNG, WebP
**Max File Size**: 5MB
**Auto-generated URLs**: Stored in user document `photoURL` field

#### Usage Example
```typescript
// Upload profile image with automatic compression and multiple sizes
import { uploadProfileImage } from '@/lib/services/storageService'

const result = await uploadProfileImage(userId, file, (progress) => {
  console.log(`Upload progress: ${progress}%`)
})

// Returns: { url: string, thumbnailUrl: string, mediumUrl: string, path: string }
console.log(`Profile image uploaded: ${result.url}`)

// Delete profile image
import { deleteProfileImage } from '@/lib/services/storageService'
await deleteProfileImage(userId, 'jpg')

// Get existing profile image URL
import { getProfileImageURL } from '@/lib/services/storageService'
const imageUrl = await getProfileImageURL(userId, 'jpg')
```

### Project Requirements (`project-requirements/`)
**Purpose**: Stores project requirement documents and attachments uploaded by clients.

**Structure**:
```
project-requirements/
├── {projectId}/
│   ├── {fileId}_document.pdf        // Project requirement documents
│   ├── {fileId}_mockup.png          // Design mockups
│   ├── {fileId}_specification.doc   // Technical specifications
│   └── {fileId}_reference.zip       // Reference materials
```

**File Naming Convention**:
- Files: `project-requirements/{projectId}/{timestamp}_{index}_{sanitized_filename}`
- Sanitized filename: Special characters replaced with underscores

**Supported Formats**: PDF, DOC, DOCX, PNG, JPG, JPEG, GIF, ZIP, TXT
**Max File Size**: 10MB per file
**Max Files**: 5 files per project
**Auto-generated URLs**: Stored in project document `requirements.attachments` array

#### Usage Example
```typescript
// Upload project requirement files
import { uploadProjectRequirementFiles } from '@/lib/services/storageService'

const uploadResults = await uploadProjectRequirementFiles(
  projectId,
  files, // Array of File objects
  (progress, fileName) => {
    console.log(`Upload progress for ${fileName}: ${progress}%`)
  }
)

// Returns array of file metadata
uploadResults.forEach(result => {
  console.log(`Uploaded: ${result.fileName} -> ${result.fileUrl}`)
})

// File metadata structure stored in project.requirements.attachments:
interface ProjectAttachment {
  fileName: string;    // Original filename (e.g., "requirements.pdf")
  fileUrl: string;     // Firebase Storage download URL
  fileType: string;    // MIME type (e.g., "application/pdf")
  uploadedAt: string;  // ISO timestamp when uploaded
}
```


## Data Types & Conventions

### Naming Conventions
- Collection names: lowercase, plural (e.g., `users`, `projects`)
- Field names: camelCase (e.g., `firstName`, `createdAt`)
- Document IDs: Auto-generated or UUID format

### Data Types
- **string** - Text data
- **number** - Numeric values (integers and floats)
- **boolean** - True/false values
- **timestamp** - Firestore Timestamp objects
- **array** - Lists of values
- **object** - Nested data structures

### Status Values
- Use consistent status enums across collections
- Always include timestamps for status changes
- Maintain audit trails for important status updates

## Collection Schemas

### 1. Users Collection (`users/{userId}`)

**Purpose**: Stores user profiles, authentication data, and professional information.

```typescript
interface User {
  userId: string;                    // Firebase Auth UID
  email: string;
  emailVerified: boolean;
  firstname: string;
  lastname: string;
  displayName: string;               // computed: firstname + lastname
  role: "freelancer" | "client" | "admin";
  title: string;                     // Professional title
  overview: string;                  // Bio/description
  hourRate: string;                  // e.g., "$ 20"
  photoURL: string;                  // Profile image URL
  isActive: boolean;
  isVerified: boolean;               // Identity verification
  paymentVerified: boolean;          // Payment method verification
  phoneVerified: boolean;            // Phone number verification
  accountStatus: "active" | "suspended" | "pending";
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastLoginAt: Timestamp;
  
  // Personal Information
  about: {
    streetAddress: string;
    city: string;
    state: string;
    country: string;
    countryCode: string;             // ISO country code (e.g., "US", "GB")
    zipCode: string;
    tel: string;                     // Phone number with country code
    dob: string;                     // ISO date
    profileUrl: string;
    downloadLink: string;
    bio: string;                     // Personal bio/description
    linkedinUrl: string;             // LinkedIn profile URL
    websiteUrl: string;              // Personal website URL
    githubUrl: string;               // GitHub profile URL
    primaryLanguage: string;         // Primary spoken language
    additionalLanguages: string[];   // Additional languages spoken
    timezone: string;                // User's timezone (e.g., "UTC-05:00 (Eastern Time)")
    dateOfBirth: string;             // Date of birth (ISO date)
    
    // Client-specific Company Information
    companyName: string;             // Company name for clients
    industry: string;                // Industry/sector for clients
    companySize: string;             // Company size (e.g., "1-10 employees")
    companyDescription: string;      // Company description for clients
  };
  
  // Professional Info (for service providers)
  skills: Array<{
    id: string;
    text: string;
    level: "beginner" | "intermediate" | "expert";
    yearsOfExperience: number;
  }>;
  specialties: string[];             // Array of specialty categories
  
  education: Array<{
    id: number;
    schoolName: string;
    location: string;
    degree: string;
    studyField: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  
  employment: Array<{
    id: number;
    companyName: string;
    jobTitle: string;
    city: string;
    country: string;
    startDate: string;
    endDate: string;                 // "Present" for current
    description: string;
    current: boolean;                // true if currently employed here
  }>;
  
  certifications: Array<{
    id: number;
    name: string;                    // Certificate name
    issuer: string;                  // Issuing organization
    issueDate: string;              // Date issued (YYYY-MM format)
    expirationDate: string;         // Expiration date (YYYY-MM format, optional)
    credentialId: string;           // Credential ID or license number
    credentialUrl: string;          // URL to verify credential (optional)
  }>;
  
  portfolio: Array<{
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
  }>;
  
  // Statistics
  stats: {
    totalJobs: number;
    completedJobs: number;
    activeProjects: number;
    totalEarnings: number;
    totalSpent: number;              // For clients
    averageRating: number;
    totalReviews: number;
    responseRate: number;
    onTimeDelivery: number;
    repeatClients: number;
    hirRate: number;                 // For clients - hire rate percentage
  };
  
  // Preferences
  preferences: {
    timezone: string;
    language: string;
    currency: string;
    emailNotifications: boolean;
    pushNotifications: boolean;
    availability: "available" | "busy" | "unavailable";
  };
}
```

**Key Features**:
- Comprehensive user profiles for both clients and service providers
- Professional information including skills, education, and portfolio
- Statistics tracking for performance metrics
- Flexible preferences system

### 2. Projects Collection (`projects/{projectId}`)

**Purpose**: Stores project listings, requirements, and status information.

```typescript
interface Project {
  projectId: string;
  title: string;
  description: string;
  category: string;
  subcategory: string;
  clientId: string;                  // Reference to users collection
  clientInfo: {
    name: string;
    photoURL: string;
    verificationStatus: boolean;
  };
  
  budget: {
    type: "fixed" | "hourly";
    amount: number;
    currency: string;
    minAmount: number;               // For hourly projects
    maxAmount: number;
  };
  
  timeline: {
    duration: string;                // "1 week", "2 months", etc.
    startDate: string;               // ISO string (serialized for Redux)
    endDate: string;                 // ISO string (serialized for Redux)
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
      uploadedAt: string;            // ISO string (serialized for Redux)
    }>;
  };
  
  status: "draft" | "active" | "in_progress" | "completed" | "cancelled";
  visibility: "public" | "private" | "invited_only";
  proposalCount: number;
  hiredFreelancerId: string;         // When project is awarded
  
  milestones: Array<{
    id: string;
    title: string;
    description: string;
    amount: number;
    dueDate: string;                 // ISO string (serialized for Redux)
    status: "pending" | "in_progress" | "completed" | "approved";
    deliverables: string[];
  }>;
  
  createdAt: string;                 // ISO string (serialized for Redux)
  updatedAt: string;                 // ISO string (serialized for Redux)
  publishedAt: string | null;        // ISO string (serialized for Redux)
  closedAt: string | null;           // ISO string (serialized for Redux)
}
```

**Key Features**:
- Flexible budget system (fixed or hourly)
- Milestone-based project structure
- Rich requirements specification
- Client information embedding for quick access
- **Date Serialization**: All timestamp fields are stored as Firestore Timestamp objects in the database but automatically converted to ISO strings when stored in Redux state to maintain serializability

### 3. Proposals Collection (`proposals/{proposalId}`)

**Purpose**: Stores freelancer proposals submitted for projects.

```typescript
interface Proposal {
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
}
```

### 4. Contracts Collection (`contracts/{contractId}`)

**Purpose**: Manages active work agreements between clients and freelancers.

```typescript
interface Contract {
  contractId: string;
  projectId: string;
  proposalId: string;
  clientId: string;
  freelancerId: string;
  
  terms: {
    amount: number;
    currency: string;
    paymentType: "fixed" | "hourly";
    startDate: Timestamp;
    endDate: Timestamp;
    workingHoursPerWeek: number;
  };
  
  status: "active" | "paused" | "completed" | "cancelled" | "disputed";
  progress: number;                  // 0-100
  
  milestones: Array<{
    id: string;
    title: string;
    amount: number;
    dueDate: Timestamp;
    status: string;
    submittedAt: Timestamp;
    approvedAt: Timestamp;
  }>;
  
  timeTracking: {
    totalHours: number;
    weeklyLimit: number;
    isManualTime: boolean;
  };
  
  createdAt: Timestamp;
  updatedAt: Timestamp;
  completedAt: Timestamp;
}
```

### 5. Conversations Collection (`conversations/{conversationId}`)

**Purpose**: Manages message threads between users.

```typescript
interface Conversation {
  conversationId: string;
  participants: string[];           // Array of user IDs
  type: "project_inquiry" | "contract_discussion" | "general";
  projectId?: string;               // Optional, if related to project
  contractId?: string;              // Optional, if related to contract
  lastMessage: {
    text: string;
    senderId: string;
    timestamp: Timestamp;
  };
  unreadCount: Record<string, number>; // userId -> unread count
  isArchived: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### 6. Messages Subcollection (`conversations/{conversationId}/messages/{messageId}`)

**Purpose**: Stores individual messages within conversations.

```typescript
interface Message {
  messageId: string;
  senderId: string;
  text: string;
  type: "text" | "file" | "image" | "system";
  attachments: Array<{
    fileName: string;
    fileUrl: string;
    fileType: string;
    fileSize: number;
  }>;
  isRead: boolean;
  readAt: Timestamp;
  editedAt: Timestamp;
  timestamp: Timestamp;
}
```

### 7. Reviews Collection (`reviews/{reviewId}`)

**Purpose**: Stores ratings and feedback between clients and freelancers.

```typescript
interface Review {
  reviewId: string;
  contractId: string;
  projectId: string;
  reviewerId: string;               // Who is giving the review
  revieweeId: string;               // Who is being reviewed
  type: "client_to_freelancer" | "freelancer_to_client";
  
  rating: {
    overall: number;                // 1-5
    communication: number;
    quality: number;
    timeliness: number;
    professionalism: number;
  };
  
  feedback: string;
  isPublic: boolean;
  isRecommended: boolean;
  
  response: {
    text: string;
    respondedAt: Timestamp;
  };
  
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### 8. Payments Collection (`payments/{paymentId}`)

**Purpose**: Tracks all payment transactions and financial records.

```typescript
interface Payment {
  paymentId: string;
  contractId: string;
  milestoneId: string;
  clientId: string;
  freelancerId: string;
  
  amount: {
    gross: number;
    fee: number;
    net: number;
    currency: string;
  };
  
  status: "pending" | "escrowed" | "released" | "refunded" | "failed";
  type: "milestone" | "hourly" | "bonus" | "refund";
  
  paymentMethod: {
    type: "card" | "paypal" | "bank_transfer";
    last4: string;
    provider: string;
  };
  
  escrow: {
    releasedAt: Timestamp;
    releaseCondition: string;
  };
  
  createdAt: Timestamp;
  processedAt: Timestamp;
  completedAt: Timestamp;
}
```

### 9. Notifications Collection (`notifications/{notificationId}`)

**Purpose**: Manages user notifications across the platform.

```typescript
interface Notification {
  notificationId: string;
  userId: string;
  type: "project_posted" | "proposal_received" | "payment_released" | "message_received";
  title: string;
  message: string;
  data: {
    projectId?: string;
    contractId?: string;
    conversationId?: string;
  };
  isRead: boolean;
  isPush: boolean;
  isEmail: boolean;
  createdAt: Timestamp;
  readAt: Timestamp;
}
```

### 10. Categories Collection (`categories/{categoryId}`)

**Purpose**: Manages project categories and skill taxonomies.

```typescript
interface Category {
  categoryId: string;
  name: string;
  description: string;
  icon: string;
  isActive: boolean;
  subcategories: Array<{
    id: string;
    name: string;
    description: string;
  }>;
  skillSuggestions: string[];
  createdAt: Timestamp;
}
```

### 11. Admin Collection (`admin/{documentId}`)

**Purpose**: Stores platform settings and analytics.

```typescript
interface AdminSettings {
  settings: {
    platformFee: number;
    minimumWithdrawal: number;
    currencies: string[];
    paymentMethods: string[];
  };
  analytics: {
    totalUsers: number;
    totalProjects: number;
    totalRevenue: number;
    lastUpdated: Timestamp;
  };
}
```

## Relationships

### Primary Relationships
- **User → Projects**: One-to-many (client creates multiple projects)
- **Project → Proposals**: One-to-many (project receives multiple proposals)
- **Proposal → Contract**: One-to-one (accepted proposal becomes contract)
- **Contract → Payments**: One-to-many (contract has multiple payments)
- **Contract → Reviews**: One-to-many (bidirectional reviews)
- **User → Conversations**: Many-to-many (users participate in multiple conversations)
- **Conversation → Messages**: One-to-many (conversation contains multiple messages)

### Data Embedding Strategy
- **Client info in projects**: For quick access without additional queries
- **Freelancer info in proposals**: For efficient proposal listing
- **Last message in conversations**: For conversation list optimization

## Security Rules Guidelines

### Authentication Requirements
- All collections require authenticated users
- Users can only access their own data and public information
- Admin collection restricted to admin role users

### Data Validation
- Validate required fields on document creation
- Ensure proper data types and value ranges
- Implement business logic constraints (e.g., bid amounts, status transitions)

### Privacy Considerations
- Personal information (about section) only visible to user and relevant parties
- Financial information restricted to involved parties
- Message content only accessible to conversation participants

## API Integration

### Web Application
The web app uses RTK Query with Firebase integration. All interfaces are defined in:
- `lib/redux/types/firebaseTypes.ts` - Centralized type definitions
- `lib/redux/api/firebaseApi.ts` - API endpoints and mutations

### Mobile Application
Mobile apps should implement the same interfaces for consistency:
- Use identical field names and data structures
- Implement the same validation rules
- Follow the same status flow patterns

### Best Practices
1. **Type Safety**: Always use TypeScript interfaces for data operations
2. **Consistency**: Maintain field naming and data structure consistency
3. **Validation**: Implement client-side validation before Firestore operations
4. **Error Handling**: Use consistent error response formats
5. **Caching**: Implement appropriate caching strategies for performance

### Storage Integration

The platform uses Firebase Storage for file management, particularly for profile images:

#### Profile Image Upload
```typescript
// Upload profile image with automatic compression and multiple sizes
import { uploadProfileImage } from '@/lib/services/storageService'

const result = await uploadProfileImage(userId, file, (progress) => {
  console.log(`Upload progress: ${progress}%`)
})

// Returns: { url: string, thumbnailUrl: string, mediumUrl: string, path: string }
```

#### Location Data Update
```typescript
// Save comprehensive location and profile data
import { useLocationData } from '@/lib/hooks/useLocationData'

const { saveLocationData, isUpdating } = useLocationData()

const success = await saveLocationData({
  country: "United States",
  countryCode: "US",
  city: "New York",
  timezone: "UTC-05:00 (Eastern Time)",
  primaryLanguage: "English",
  additionalLanguages: ["Spanish", "French"],
  phoneNumber: "+1 555 123 4567",
  dateOfBirth: "1990-01-15",
  bio: "Experienced full-stack developer...",
  linkedinUrl: "https://linkedin.com/in/username",
  websiteUrl: "https://mywebsite.com",
  githubUrl: "https://github.com/username",
  profileImageFile: selectedFile // File object
})
```

#### Firebase API Mutations
```typescript
// Update user location and profile information
useUpdateUserLocationAndProfileMutation({
  userId: "user123",
  locationData: {
    country: "United States",
    countryCode: "US",
    // ... other location data
    profileImageUrl: "https://storage.firebase.com/..." // After upload
  }
})
```

## Firebase Timestamp Serialization

**Important Note**: To ensure compatibility with Redux (which requires serializable data), all Firestore Timestamp objects are automatically converted to ISO string format when retrieved from the database and converted back to Timestamps when saving to Firestore.

### Data Flow
1. **Frontend → API**: Data with string dates (ISO format)
2. **API → Firestore**: Automatically converted to Timestamp objects
3. **Firestore → API**: Timestamp objects from database
4. **API → Redux**: Automatically serialized to ISO strings

### Affected Fields
- `Project.timeline.startDate` and `endDate`
- `Project.createdAt`, `updatedAt`, `publishedAt`, `closedAt`
- `ProjectMilestone.dueDate`
- All other timestamp fields across collections

This ensures Redux compatibility while maintaining proper Firestore Timestamp functionality.

## Version Control

### Schema Updates
- All schema changes must be documented
- Backward compatibility should be maintained when possible
- Migration scripts should be provided for breaking changes
- Version the schema documentation

### Change Log

#### Version 1.0.1 (August 28, 2025)
- **Added** `paymentVerified` field to User interface for payment method verification
- **Added** `phoneVerified` field to User interface for phone number verification  
- **Added** `hirRate` field to UserStats interface for client hire rate percentage
- **Added** client-specific company fields to UserAboutInfo interface:
  - `companyName` - Company name for clients
  - `industry` - Industry/sector for clients  
  - `companySize` - Company size (e.g., "1-10 employees")
  - `companyDescription` - Company description for clients
- **Updated** User interface documentation to reflect verification fields
- **Updated** UserStats interface to include hirRate for client metrics

#### Version 1.0.0 (August 26, 2025)
- Initial schema documentation
- Track all modifications with timestamps
- Document the reasoning behind changes
- Maintain migration paths for existing data

---

**Last Updated**: August 28, 2025  
**Version**: 1.0.1  
**Maintained by**: Bizzlink Development Team

For questions or suggestions regarding this schema, please contact the development team.
