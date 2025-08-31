# Proposal Schema Updates

This document outlines the updates made to the proposal schema for the Bizzlink platform.

## Overview

The proposal system has been enhanced to allow freelancers to submit proposals for projects. The implementation includes:

1. "Apply Now" buttons on both the projects list and project detail pages
2. A dedicated proposal submission page at `/projects/[projectId]/proposal` with:
   - Custom bid amount and timeline inputs
   - Rich cover letter editor
   - File attachment uploads with progress tracking
   - Custom questions for the client
3. Firebase integration for data persistence including file storage
4. Automatic proposal count tracking for projects
5. Notification creation for project owners when they receive a new proposal

## Schema Modifications

The original proposal schema from `FIREBASE_SCHEMA.md` has been extended with the following modifications:

### Proposal Schema (proposals/{proposalId})

```typescript
interface Proposal {
  proposalId: string;               // Firestore document ID
  projectId: string;                // Reference to the project
  freelancerId: string;             // Reference to the freelancer
  freelancerInfo: {
    name: string;                   // Freelancer's display name
    photoURL: string;               // Freelancer's profile image
    title: string;                  // Freelancer's professional title
    rating: number;                 // Freelancer's average rating
    completedJobs: number;          // Number of jobs completed by the freelancer
  };
  
  bid: {
    amount: number;                 // Bid amount
    currency: string;               // Currency (e.g., "$")
    type: "fixed" | "hourly";       // Type of bid
    timeline: string;               // Estimated timeline (e.g., "2 weeks")
    deliveryDate: Timestamp;        // Estimated delivery date
  };
  
  coverLetter: string;              // Proposal description/cover letter
  attachments: Array<{             
    fileName: string;               // Attachment filename
    fileUrl: string;                // URL to the attachment
    fileType: string;               // File type/MIME type
  }>;
  
  questions: Array<{
    question: string;               // Question asked by the client
    answer: string;                 // Answer provided by the freelancer
  }>;
  
  status: "submitted" | "shortlisted" | "accepted" | "rejected" | "withdrawn";
  isInvited: boolean;               // Whether the freelancer was invited to apply
  submittedAt: Timestamp;           // When the proposal was submitted
  updatedAt: Timestamp;             // When the proposal was last updated
  respondedAt: Timestamp | null;    // When the client responded (or null if not yet responded)
}
```

### Modifications to Project Schema

The `proposalCount` field in the Project schema is now actively maintained:

- When a new proposal is submitted, the project's `proposalCount` is incremented
- This count is displayed on project cards and detail pages

### New Notification Type

A new notification type has been added to alert project owners when they receive a new proposal:

```typescript
{
  notificationId: string;
  userId: string;                  // Project owner's ID
  type: 'proposal_received';       // New notification type
  title: 'New Proposal Received';
  message: string;                 // Dynamic message including freelancer name and project title
  data: {
    projectId: string;
    proposalId: string;
  };
  isRead: false;
  isPush: true;
  isEmail: true;
  createdAt: Timestamp;
  readAt: null;
}
```

## API Enhancements

The Firebase API has been enhanced with the following features:

1. **Duplicate Prevention**: Freelancers can't submit multiple proposals for the same project
2. **Automatic Counting**: Project proposal counts are automatically maintained
3. **Notifications**: Project owners receive notifications when new proposals arrive
4. **Data Validation**: Ensures all required fields are present before submission
5. **Date Handling**: Proper conversion between JavaScript Date objects and Firestore Timestamps

## Future Enhancements

Potential future enhancements to the proposal system:

1. File attachment uploads for proposals
2. Custom questions from clients that freelancers must answer
3. Proposal editing for freelancers before client response
4. Proposal templates for frequent freelancer use
5. Proposal analytics for freelancers to track success rates
