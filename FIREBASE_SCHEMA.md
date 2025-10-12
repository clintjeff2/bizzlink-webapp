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
- **contractEvents** - Contract lifecycle event tracking
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
import { uploadProfileImage } from "@/lib/services/storageService";

const result = await uploadProfileImage(userId, file, (progress) => {
  console.log(`Upload progress: ${progress}%`);
});

// Returns: { url: string, thumbnailUrl: string, mediumUrl: string, path: string }
console.log(`Profile image uploaded: ${result.url}`);

// Delete profile image
import { deleteProfileImage } from "@/lib/services/storageService";
await deleteProfileImage(userId, "jpg");

// Get existing profile image URL
import { getProfileImageURL } from "@/lib/services/storageService";
const imageUrl = await getProfileImageURL(userId, "jpg");
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
import { uploadProjectRequirementFiles } from "@/lib/services/storageService";

const uploadResults = await uploadProjectRequirementFiles(
  projectId,
  files, // Array of File objects
  (progress, fileName) => {
    console.log(`Upload progress for ${fileName}: ${progress}%`);
  }
);

// Returns array of file metadata
uploadResults.forEach((result) => {
  console.log(`Uploaded: ${result.fileName} -> ${result.fileUrl}`);
});

// File metadata structure stored in project.requirements.attachments:
interface ProjectAttachment {
  fileName: string; // Original filename (e.g., "requirements.pdf")
  fileUrl: string; // Firebase Storage download URL
  fileType: string; // MIME type (e.g., "application/pdf")
  uploadedAt: string; // ISO timestamp when uploaded
}
```

### Milestone Review Attachments (`milestone-review-attachments/`)

**Purpose**: Stores files and documents submitted by freelancers as part of milestone completion reviews.

**Structure**:

```
milestone-review-attachments/
├── {contractId}/
│   ├── {milestoneId}/
│   │   ├── {timestamp}_{fileId}.pdf         // Documents
│   │   ├── {timestamp}_{fileId}.jpg         // Images
│   │   └── {timestamp}_{fileId}.zip         // Archive files
```

**File Naming Convention**:

- Files: `milestone-review-attachments/{contractId}/{milestoneId}/{timestamp}_{sanitized_filename}`
- Sanitized filename: Special characters replaced with underscores

**Supported Formats**: PDF, DOC, DOCX, PNG, JPG, JPEG, GIF, ZIP, TXT, MP4, MP3
**Max File Size**: 15MB per file
**Max Files**: 10 files per milestone submission
**Auto-generated URLs**: Stored in contract milestone's `submissionDetails.files` array
**Storage Path**: Also stored in the file metadata for future deletion management

#### Usage Example

```typescript
// Upload milestone submission files
import { uploadMilestoneFiles } from "@/lib/services/storageService";

const uploadResults = await uploadMilestoneFiles(
  contractId,
  milestoneId,
  files, // Array of File objects
  (progress, fileName) => {
    console.log(`Upload progress for ${fileName}: ${progress}%`);
  }
);

// Returns array of file metadata including storage paths
uploadResults.forEach((result) => {
  console.log(`Uploaded: ${result.fileName} -> ${result.fileUrl}`);
  console.log(`Storage path: ${result.storagePath}`);
});

// File metadata structure stored in contract.milestones[].submissionDetails.files:
interface MilestoneSubmissionFile {
  fileName: string; // Original filename (e.g., "final-design.pdf")
  fileUrl: string; // Firebase Storage download URL
  fileType: string; // MIME type (e.g., "application/pdf")
  storagePath: string; // Storage path for deletion management
}

// Delete milestone file
import { deleteMilestoneFile } from "@/lib/services/storageService";
await deleteMilestoneFile(storagePath);
```

### Message Attachments (`message-attachments/`)

**Purpose**: Stores files exchanged in conversations between users.

**Structure**:

```
message-attachments/
├── {conversationId}/
│   ├── {messageId}/
│   │   ├── {timestamp}_{fileId}.pdf         // Documents
│   │   ├── {timestamp}_{fileId}.jpg         // Images
│   │   └── {timestamp}_{fileId}.mp3         // Audio messages
```

**File Naming Convention**:

- Files: `message-attachments/{conversationId}/{messageId}/{timestamp}_{sanitized_filename}`
- Audio messages: `message-attachments/{conversationId}/{messageId}/audio_{timestamp}.mp3`
- Sanitized filename: Special characters replaced with underscores

**Supported Formats**: PDF, DOC, DOCX, PNG, JPG, JPEG, GIF, MP3, MP4, TXT
**Max File Size**: 10MB per file
**Max Files**: 5 files per message
**Auto-generated URLs**: Stored in message document's `attachments` array

#### Usage Example

```typescript
// Upload message attachment files
import { uploadMessageAttachment } from "@/lib/services/messageAttachmentService";

const result = await uploadMessageAttachment(
  conversationId,
  messageId,
  file, // File object
  (progress) => {
    console.log(`Upload progress: ${progress}%`);
  }
);

console.log(`File uploaded: ${result.fileName} -> ${result.fileUrl}`);

// Audio message recording
import { recordAudioMessage } from "@/lib/services/messageAttachmentService";

const audioResult = await recordAudioMessage(
  conversationId,
  messageId,
  audioBlob, // Audio Blob from recorder
  duration, // Duration in seconds
  (progress) => {
    console.log(`Upload progress: ${progress}%`);
  }
);

console.log(
  `Audio uploaded: ${audioResult.fileUrl}, duration: ${audioResult.duration}s`
);
```

### Proposal Attachments (`proposal-attachments/`)

**Purpose**: Stores supporting documents and files submitted by freelancers with their project proposals.

**Structure**:

```
proposal-attachments/
├── {projectId}/
│   ├── {proposalId}/
│   │   ├── {timestamp}_{fileId}.pdf         // CV/Resume
│   │   ├── {timestamp}_{fileId}.jpg         // Portfolio samples
│   │   └── {timestamp}_{fileId}.zip         // Code samples
```

**File Naming Convention**:

- Files: `proposal-attachments/{projectId}/{proposalId}/{timestamp}_{sanitized_filename}`
- Sanitized filename: Special characters replaced with underscores

**Supported Formats**: PDF, DOC, DOCX, PNG, JPG, JPEG, GIF, ZIP, TXT
**Max File Size**: 8MB per file
**Max Files**: 3 files per proposal
**Auto-generated URLs**: Stored in proposal document's `attachments` array

#### Usage Example

```typescript
// Upload proposal attachment files
import { uploadProposalAttachments } from "@/lib/services/proposalService";

const uploadResults = await uploadProposalAttachments(
  projectId,
  proposalId,
  files, // Array of File objects
  (progress, fileName) => {
    console.log(`Upload progress for ${fileName}: ${progress}%`);
  }
);

// Returns array of file metadata
uploadResults.forEach((result) => {
  console.log(`Uploaded: ${result.fileName} -> ${result.fileUrl}`);
});
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
  userId: string; // Firebase Auth UID
  email: string;
  emailVerified: boolean;
  firstname: string;
  lastname: string;
  displayName: string; // computed: firstname + lastname
  role: "freelancer" | "client" | "admin";
  title: string; // Professional title
  overview: string; // Bio/description
  hourRate: string; // e.g., "$ 20"
  photoURL: string; // Profile image URL
  isActive: boolean;
  isVerified: boolean; // Identity verification
  paymentVerified: boolean; // Payment method verification
  phoneVerified: boolean; // Phone number verification
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
    countryCode: string; // ISO country code (e.g., "US", "GB")
    zipCode: string;
    tel: string; // Phone number with country code
    dob: string; // ISO date
    profileUrl: string;
    downloadLink: string;
    bio: string; // Personal bio/description
    linkedinUrl: string; // LinkedIn profile URL
    websiteUrl: string; // Personal website URL
    githubUrl: string; // GitHub profile URL
    primaryLanguage: string; // Primary spoken language
    additionalLanguages: string[]; // Additional languages spoken
    timezone: string; // User's timezone (e.g., "UTC-05:00 (Eastern Time)")
    dateOfBirth: string; // Date of birth (ISO date)

    // Client-specific Company Information
    companyName: string; // Company name for clients
    industry: string; // Industry/sector for clients
    companySize: string; // Company size (e.g., "1-10 employees")
    companyDescription: string; // Company description for clients
  };

  // Professional Info (for service providers)
  skills: Array<{
    id: string;
    text: string;
    level: "beginner" | "intermediate" | "expert";
    yearsOfExperience: number;
  }>;
  specialties: string[]; // Array of specialty categories

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
    endDate: string; // "Present" for current
    description: string;
    current: boolean; // true if currently employed here
  }>;

  certifications: Array<{
    id: number;
    name: string; // Certificate name
    issuer: string; // Issuing organization
    issueDate: string; // Date issued (YYYY-MM format)
    expirationDate: string; // Expiration date (YYYY-MM format, optional)
    credentialId: string; // Credential ID or license number
    credentialUrl: string; // URL to verify credential (optional)
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
    totalSpent: number; // For clients
    averageRating: number;
    totalReviews: number;
    responseRate: number;
    onTimeDelivery: number;
    repeatClients: number;
    hirRate: number; // For clients - hire rate percentage
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
  clientId: string; // Reference to users collection
  clientInfo: {
    name: string;
    photoURL: string;
    verificationStatus: boolean;
  };

  budget: {
    type: "fixed" | "hourly";
    amount: number;
    currency: string;
    minAmount: number; // For hourly projects
    maxAmount: number;
  };

  timeline: {
    duration: string; // "1 week", "2 months", etc.
    startDate: string; // ISO string (serialized for Redux)
    endDate: string; // ISO string (serialized for Redux)
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
      uploadedAt: string; // ISO string (serialized for Redux)
    }>;
  };

  status: "draft" | "active" | "in_progress" | "completed" | "cancelled";
  visibility: "public" | "private" | "invited_only";
  proposalCount: number;
  hiredFreelancerId: string; // When project is awarded

  milestones: Array<{
    id: string;
    title: string;
    description: string;
    amount: number;
    dueDate: string; // ISO string (serialized for Redux)
    status: "pending" | "in_progress" | "completed" | "approved";
    deliverables: string[];
  }>;

  createdAt: string; // ISO string (serialized for Redux)
  updatedAt: string; // ISO string (serialized for Redux)
  publishedAt: string | null; // ISO string (serialized for Redux)
  closedAt: string | null; // ISO string (serialized for Redux)
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
    paymentType: "fixed";
    startDate: Timestamp;
    endDate: Timestamp;
    workingHoursPerWeek: number;
  };

  status:
    | "pending_acceptance"
    | "active"
    | "paused"
    | "completed"
    | "cancelled"
    | "revision_requested";
  progress: number; // 0-100

  milestones: Array<{
    id: string;
    title: string;
    description?: string;
    amount: number;
    dueDate: Timestamp;
    status: "pending" | "active" | "in_review" | "completed" | "cancelled";
    submittedAt: Timestamp;
    approvedAt: Timestamp;
    revisionNotes?: string; // Client's revision requests when rejecting a milestone submission
    revisionRequestedAt?: Date; // Timestamp when revision was requested
    submissionDetails?: {
      description: string; // Detailed description of the work submitted
      links: string[]; // Array of URLs to relevant resources, demos, repositories, etc.
      files: Array<{
        fileName: string; // Original filename
        fileUrl: string; // URL to the uploaded file
        fileType: string; // MIME type of the file
      }>;
    };
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

**Purpose**: Manages message threads between users with support for various communication contexts.

```typescript
interface Conversation {
  conversationId: string;

  // Participant Structure
  clientId?: string; // For one-to-one conversations
  freelancerId?: string; // For one-to-one conversations
  adminId?: string; // For announcements/support
  audienceType?: "all" | "clients" | "freelancers"; // For announcements
  participants: string[]; // All participant IDs (kept for query efficiency)

  // Basic Info
  type: "one_to_one" | "announcement" | "support";

  // Context Links
  projectId?: string;
  contractId?: string;
  proposalId?: string;

  // Message Status
  lastMessage: {
    text: string;
    preview: string;
    senderId: string;
    timestamp: Timestamp;
    type: "text" | "file" | "image" | "audio" | "video" | "system";
  };
  unreadCount: Record<string, number>; // userId -> unread count

  // Administrative
  pinned: boolean;
  isArchived: Record<string, boolean>; // Per user archive status
  isMuted: Record<string, boolean>; // Per user notification settings

  // Metadata
  createdBy: string; // User ID of creator
  createdAt: Timestamp;
  updatedAt: Timestamp;

  // Call History (for future audio/video features)
  callHistory?: Array<{
    callId: string;
    initiator: string;
    type: "audio" | "video";
    participants: string[];
    startTime: Timestamp;
    endTime: Timestamp;
    duration: number; // in seconds
    status: "completed" | "missed" | "rejected" | "failed";
  }>;

  // Analytics & Metrics
  metrics?: {
    messageCount: number;
    mediaCount: number;
    participantCount: number;
    responseTime: number; // Average response time in minutes
    activityScore: number; // For ranking conversations by activity
  };
}
```

### 6. Messages Subcollection (`conversations/{conversationId}/messages/{messageId}`)

**Purpose**: Stores individual messages with advanced media support and tracking.

```typescript
interface Message {
  messageId: string;
  conversationId: string; // Reference to parent conversation

  // Sender information
  senderId: string;
  senderType: "client" | "freelancer" | "admin";

  // Message Content
  text: string;
  richText?: {
    // Optional formatted text
    html: string; // HTML content for rich formatting
    mentions: string[]; // User IDs mentioned in the message
    links: string[]; // URLs contained in the message
  };
  translation?: Record<string, string>; // Language code -> translated text

  // Message Type & Classification
  type:
    | "text"
    | "file"
    | "image"
    | "audio"
    | "video"
    | "location"
    | "contact"
    | "system"
    | "call_log";
  subtype?: string; // E.g., "milestone_update", "payment_reminder", etc.
  isImportant: boolean; // Flagged as important

  // Media & Attachments
  attachments: Array<{
    attachmentId: string;
    fileName: string;
    fileUrl: string;
    fileType: string;
    fileSize: number;
    thumbnailUrl?: string; // For images and videos
    duration?: number; // For audio/video in seconds
    dimensions?: {
      // For images and videos
      width: number;
      height: number;
    };
    metadata?: Record<string, any>; // Additional file metadata
  }>;

  // Voice Messages
  audioMessage?: {
    duration: number; // In seconds
    waveformData: number[]; // For visual representation
    transcription?: string; // Speech-to-text content
  };

  // Location Sharing
  location?: {
    latitude: number;
    longitude: number;
    address: string;
    name: string; // Place name
  };

  // Message Tracking & Status
  readBy: Record<string, Timestamp>; // User ID -> read timestamp
  deliveredTo: Record<string, Timestamp>; // User ID -> delivery timestamp
  reactions: Record<
    string,
    Array<{
      userId: string;
      reaction: string; // Emoji or reaction type
      timestamp: Timestamp;
    }>
  >;

  // Message Lifecycle
  status: "sending" | "sent" | "delivered" | "read" | "failed";
  isEdited: boolean;
  isDeleted: boolean; // Soft delete flag
  isForwarded: boolean;
  originalMessageId?: string; // If forwarded from another message

  // Reply Threading
  isReply: boolean;
  replyToMessageId?: string; // If replying to a specific message
  replyToSenderId?: string; // User ID of the original message sender
  replyPreview?: string; // Preview of the replied message
  threadParticipants?: string[]; // For thread-specific participants

  // Action Buttons & Interactive Elements
  actions?: Array<{
    actionId: string;
    actionType: "button" | "link" | "form";
    label: string;
    value: string; // Data payload for the action
    url?: string; // For links
    style?: string; // UI styling hint
    confirmedBy?: string[]; // User IDs who performed this action
  }>;

  // Timekeeping
  expiresAt?: Timestamp; // For disappearing messages
  scheduledFor?: Timestamp; // For scheduled messages
  editWindow?: number; // Time in seconds during which editing is allowed
  timestamp: Timestamp; // When the message was sent
  editedAt?: Timestamp;
  deletedAt?: Timestamp;
}
```

### 7. Presence Collection (`presence/{userId}`)

**Purpose**: Tracks user online status and availability for real-time communications.

```typescript
interface Presence {
  userId: string;
  status: "online" | "away" | "busy" | "offline";
  lastActive: Timestamp;
  device: {
    type: "mobile" | "desktop" | "tablet";
    platform: string; // e.g., "iOS", "Android", "Web"
    appVersion: string;
    pushToken?: string; // For push notifications
  };
  settings: {
    showStatus: boolean; // Whether to display online status
    allowCalls: boolean; // Whether to allow incoming calls
    availableForProjects: boolean; // Available for new work (freelancers)
  };
  location?: {
    // Optional location sharing
    country: string;
    timezone: string;
    lastUpdated: Timestamp;
  };
  activeConversations: string[]; // List of conversation IDs where user is active
  typingIn?: {
    // Typing indicators
    conversationId: string;
    timestamp: Timestamp;
  };
  updatedAt: Timestamp;
}
```

### 8. Calls Collection (`calls/{callId}`)

**Purpose**: Manages audio and video call information for the platform.

```typescript
interface Call {
  callId: string;
  conversationId: string;
  type: "audio" | "video" | "screen_share";
  initiator: string; // User ID who started the call
  participants: string[]; // All invited participants
  activeParticipants: Record<
    string,
    {
      joinedAt: Timestamp;
      leftAt?: Timestamp;
      deviceInfo: string;
      connectionQuality: "excellent" | "good" | "poor" | "bad";
      hasVideo: boolean;
      hasAudio: boolean;
      isScreenSharing: boolean;
    }
  >;
  status:
    | "ringing"
    | "ongoing"
    | "completed"
    | "missed"
    | "declined"
    | "failed";
  startedAt: Timestamp;
  endedAt?: Timestamp;
  duration?: number; // In seconds
  recordingUrl?: string; // If call recording is enabled and available
  quality: {
    averageRating: number; // 1-5 rating of call quality
    issues: string[]; // Array of reported issues
    connectionEvents: Array<{
      type: "interruption" | "reconnect" | "quality_change";
      timestamp: Timestamp;
      data: any; // Additional data about the event
    }>;
  };
  metadata: {
    // Context information for the call
    projectId?: string;
    contractId?: string;
    purpose?: string;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### 9. Reviews Collection (`reviews/{reviewId}`)

**Purpose**: Stores ratings and feedback between clients and freelancers.

```typescript
interface Review {
  reviewId: string;
  contractId: string;
  projectId: string;
  reviewerId: string; // Who is giving the review
  revieweeId: string; // Who is being reviewed
  type: "client_to_freelancer" | "freelancer_to_client";

  rating: {
    overall: number; // 1-5
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

### 10. Payments Collection (`payments/{paymentId}`)

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
    type: "card" | "paypal" | "bank_transfer" | "mtn_momo" | "orange_momo";
    last4: string;
    provider: string;
    // Mobile Money specific fields (for mtn_momo and orange_momo types)
    countryCode?: string; // Country code with + (e.g., "+237")
    phoneNumber?: string; // Phone number without country code
  };

  // Mobile Money Details (additional field when payment method is mobile money)
  mobileMoneyDetails?: {
    countryCode: string; // Country code with + (e.g., "+237")
    phoneNumber: string; // Phone number without country code
    fullPhoneNumber: string; // Complete phone number (countryCode + phoneNumber)
    provider: "mtn_momo" | "orange_momo"; // Mobile money provider
    formattedPhone?: string; // Formatted phone number for display (e.g., "6 71 23 45 67")
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

**Key Features**:

- Support for traditional payment methods (card, PayPal, bank transfer)
- **Mobile Money Integration**: Full support for MTN Mobile Money and Orange Money
- Comprehensive payment tracking with escrow functionality
- **Mobile Money Details**: Additional metadata for mobile payments including full phone numbers and provider information

**Mobile Money Payment Flow**:

1. Client selects MTN Momo or Orange Money as payment method
2. Client provides country code and phone number
3. Payment record is created with mobile money details
4. Payment processing integrates with respective mobile money APIs
5. Payment status is tracked through completion

**Mobile Money Validation Rules**:

- Country code must include the `+` prefix (e.g., "+237")
- Phone number must be at least 8 digits long
- Phone number is stored without country code in `phoneNumber` field
- Full phone number (with country code) is stored in `mobileMoneyDetails.fullPhoneNumber`
- Provider field must match the payment method type (`mtn_momo` or `orange_momo`)

**Usage Example**:

```typescript
// Creating a mobile money payment record
const paymentData = {
  paymentId: "pay_123",
  contractId: "contract_456",
  milestoneId: "milestone_789",
  clientId: "client_123",
  freelancerId: "freelancer_456",

  amount: {
    gross: 500.0,
    fee: 25.0,
    net: 475.0,
    currency: "XAF",
  },

  status: "pending",
  type: "milestone",

  paymentMethod: {
    type: "mtn_momo",
    countryCode: "+237",
    phoneNumber: "671234567",
    provider: "mtn_momo",
    last4: "4567",
  },

  mobileMoneyDetails: {
    countryCode: "+237",
    phoneNumber: "671234567",
    fullPhoneNumber: "+237671234567",
    provider: "mtn_momo",
  },

  createdAt: serverTimestamp(),
};
```

### 11. Notifications Collection (`notifications/{notificationId}`)

**Purpose**: Manages user notifications across the platform.

```typescript
interface Notification {
  notificationId: string;
  userId: string;
  type:
    | "project_posted"
    | "proposal_received"
    | "payment_released"
    | "message_received";
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

### 12. Categories Collection (`categories/{categoryId}`)

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

### 13. Admin Collection (`admin/{documentId}`)

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

### 12. Contract Events Collection (`contractEvents/{eventId}`)

**Purpose**: Tracks all events and activities related to contracts for audit trail and status tracking.

```typescript
interface ContractEvent {
  eventId: string;
  contractId: string;
  milestoneId?: string; // Optional, for milestone-specific events

  // Event Details
  eventType:
    | "contract_created"
    | "contract_accepted"
    | "contract_rejected"
    | "contract_cancelled"
    | "contract_paused"
    | "contract_resumed"
    | "contract_completed"
    | "revision_requested"
    | "milestone_funded"
    | "milestone_submitted"
    | "milestone_approved"
    | "milestone_rejected"
    | "milestone_payment_released"
    | "dispute_opened"
    | "dispute_resolved";

  // User Information
  createdBy: string; // User ID who triggered the event
  userType: "client" | "freelancer" | "admin";

  // Event Data
  comment?: string; // Optional comment or reason
  amount?: number; // For payment-related events
  currency?: string; // For payment-related events

  // Additional Context
  metadata?: {
    previousStatus?: string; // For status change events
    newStatus?: string; // For status change events
    paymentMethodType?: string; // For payment events
    revisionReason?: string; // For revision requests
    [key: string]: any; // Additional event-specific data
  };

  // Timestamps
  createdAt: Timestamp;
}
```

**Key Features**:

- **Comprehensive Event Tracking**: Records all significant contract lifecycle events
- **Audit Trail**: Maintains complete history of contract modifications and status changes
- **Multi-user Support**: Tracks events from clients, freelancers, and administrators
- **Flexible Metadata**: Supports additional context for different event types
- **Milestone Integration**: Links events to specific milestones when applicable

**Event Types Description**:

- **contract_created**: When a client creates a new contract
- **contract_accepted**: When a freelancer accepts a contract offer
- **contract_rejected**: When a freelancer rejects a contract offer
- **contract_cancelled**: When either party cancels an active contract
- **contract_paused**: When a contract is temporarily paused
- **contract_resumed**: When a paused contract is resumed
- **contract_completed**: When all milestones are completed and contract is finished
- **revision_requested**: When a freelancer requests changes to contract terms
- **milestone_funded**: When a client funds a milestone payment to escrow
- **milestone_submitted**: When a freelancer submits work for a milestone with detailed description, links, and files
- **milestone_approved**: When a client approves completed milestone work
- **milestone_rejected**: When a client rejects milestone work and requests revisions
- **milestone_payment_released**: When escrow payment is released to freelancer
- **dispute_opened**: When a dispute is raised regarding the contract
- **dispute_resolved**: When a dispute is resolved

**Usage Example**:

```typescript
// Creating a contract acceptance event
const contractEvent = {
  eventId: "event_123",
  contractId: "contract_456",
  eventType: "contract_accepted",
  createdBy: "freelancer_789",
  userType: "freelancer",
  comment: "Contract terms accepted. Ready to start work.",
  metadata: {
    previousStatus: "pending_acceptance",
    newStatus: "active",
  },
  createdAt: serverTimestamp(),
};

// Creating a milestone funding event
const milestoneEvent = {
  eventId: "event_124",
  contractId: "contract_456",
  milestoneId: "milestone_001",
  eventType: "milestone_funded",
  createdBy: "client_123",
  userType: "client",
  comment: "First milestone funded to escrow",
  amount: 500.0,
  currency: "USD",
  metadata: {
    paymentMethodType: "mtn_momo",
  },
  createdAt: serverTimestamp(),
};

// Creating a milestone submission event with detailed submission information
const submissionEvent = {
  eventId: "event_125",
  contractId: "contract_456",
  milestoneId: "milestone_001",
  eventType: "milestone_submitted",
  createdBy: "freelancer_789",
  userType: "freelancer",
  comment: "Website design milestone completed as requested",
  metadata: {
    previousStatus: "active",
    newStatus: "in_review",
    deliverables: ["website_design", "responsive_layouts"],
    submissionDetails: {
      description:
        "I've completed the website design including all responsive layouts for mobile, tablet and desktop. The color scheme follows the brand guidelines with the exact hex colors provided.",
      links: [
        "https://design-preview.example.com/project123",
        "https://github.com/username/project-repository",
      ],
      files: [
        {
          fileName: "design-documentation.pdf",
          fileUrl: "https://storage.example.com/files/design-doc.pdf",
          fileType: "application/pdf",
        },
        {
          fileName: "prototype.fig",
          fileUrl: "https://storage.example.com/files/prototype.fig",
          fileType: "application/figma",
        },
      ],
    },
  },
  createdAt: serverTimestamp(),
};
```

**Security Considerations**:

- Events are immutable once created (append-only)
- Only authorized users can create events for their contracts
- All events include user identification and timestamps
- Sensitive payment information is not stored in events (only references)

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

The platform uses Firebase Storage for file management:

#### Profile Image Upload

```typescript
// Upload profile image with automatic compression and multiple sizes
import { uploadProfileImage } from "@/lib/services/storageService";

const result = await uploadProfileImage(userId, file, (progress) => {
  console.log(`Upload progress: ${progress}%`);
});

// Returns: { url: string, thumbnailUrl: string, mediumUrl: string, path: string }
```

#### Location Data Update

```typescript
// Save comprehensive location and profile data
import { useLocationData } from "@/lib/hooks/useLocationData";

const { saveLocationData, isUpdating } = useLocationData();

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
  profileImageFile: selectedFile, // File object
});
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
    profileImageUrl: "https://storage.firebase.com/...", // After upload
  },
});
```

#### Proposal Attachments Upload

```typescript
// Upload proposal attachment files
import { proposalAttachmentService } from "@/lib/services/storage/proposalAttachmentService";

// Upload a single file
const uploadResult = await proposalAttachmentService.uploadFile(
  file, // File object
  projectId,
  (progress) => {
    console.log(`Upload progress: ${progress}%`);
  }
);

console.log(
  `File uploaded: ${uploadResult.fileName} -> ${uploadResult.fileUrl}`
);

// Upload multiple files with progress tracking
const results = await proposalAttachmentService.uploadMultipleFiles(
  files, // Array of File objects
  projectId,
  (fileName, progress) => {
    console.log(`Upload progress for ${fileName}: ${progress}%`);
  }
);

// Validate files before upload
const validation = proposalAttachmentService.validateFile(file);
if (!validation.valid) {
  console.error(validation.error);
}
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

#### Version 1.0.2 (October 10, 2025)

- **Enhanced** Payment Collection schema to support mobile money payments
- **Added** Mobile Money support for MTN Mobile Money and Orange Money
- **Added** `countryCode` and `phoneNumber` fields to `paymentMethod` object for mobile money transactions
- **Added** `mobileMoneyDetails` object to Payment interface with comprehensive mobile money metadata:
  - `countryCode` - Country code with + prefix (e.g., "+237")
  - `phoneNumber` - Phone number without country code
  - `fullPhoneNumber` - Complete international phone number
  - `provider` - Mobile money provider ("mtn_momo" | "orange_momo")
- **Updated** Payment Collection documentation with mobile money validation rules and usage examples
- **Updated** Collection numbering sequence for better organization
- **Enhanced** Mobile money payment flow documentation for cross-platform development consistency

### Change Log

#### Version 1.0.2 (October 10, 2025)

- **Enhanced Mobile Money Integration**: Added comprehensive phone number validation for MTN and Orange mobile money payments
- **Added** `formattedPhone` field to `mobileMoneyDetails` object for better display formatting
- **Added** country-specific phone number validation with provider availability checking
- **Enhanced** mobile money payment method selection to show only available countries per provider
- **Added** real-time phone number validation with error messages and formatting
- **Improved** user experience with auto-detection of mobile money providers based on phone number prefixes
- **Updated** payment validation logic to ensure phone numbers match selected countries and providers

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

#### Version 1.1.2 (October 12, 2025)

- **Enhanced** Milestone revision requests with detailed notes for freelancers
- **Added** new fields to the Contract Collection's milestone objects:
  - `revisionNotes` - Client's detailed explanation of requested changes
  - `revisionRequestedAt` - Timestamp when revision was requested
- **Enhanced** `milestone_rejected` event type to include revision notes in metadata
- **Updated** Contract milestone documentation with revision request example
- **Improved** User experience by displaying revision notes directly to freelancers

#### Version 1.1.1 (October 12, 2025)

- **Enhanced** Milestone submission with detailed work information
- **Added** `submissionDetails` field to the Contract Collection's milestone objects:
  - `description` - Detailed explanation of the completed work
  - `links` - Array of URLs to demos, repositories, and other relevant resources
  - `files` - Array of uploaded files with metadata and download links
- **Enhanced** `milestone_submitted` event type to include submission details in metadata
- **Updated** Contract Event documentation with milestone submission example
- **Improved** User experience by displaying submission details on both client and freelancer contract views

#### Version 1.1.0 (October 10, 2025)

- **Added** `contractEvents` collection for comprehensive contract lifecycle tracking
- **Enhanced** Contract status management with new status values:
  - `pending_acceptance` - Initial status when contract is created
  - `revision_requested` - When freelancer requests contract changes
  - `active` - When contract is accepted and work begins
  - `paused` - When contract is temporarily suspended
  - `completed` - When all milestones are finished
  - `cancelled` - When contract is terminated
- **Updated** Milestone status options to include:
  - `pending` - Milestone not yet active
  - `active` - Currently being worked on
  - `in_review` - Submitted for client review
  - `completed` - Approved and payment released
  - `cancelled` - Milestone cancelled
- **Added** Contract event tracking for audit trail and compliance
- **Enhanced** Payment flow documentation with escrow lifecycle
- **Updated** Collections overview to include contractEvents

#### Version 1.0.0 (August 26, 2025)

- Initial schema documentation
- Track all modifications with timestamps
- Document the reasoning behind changes
- Maintain migration paths for existing data

---

**Last Updated**: October 12, 2025  
**Version**: 1.1.1  
**Maintained by**: Bizzlink Development Team

For questions or suggestions regarding this schema, please contact the development team.
