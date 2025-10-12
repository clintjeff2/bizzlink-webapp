# Client-Freelancer-Payment Lifecycle Documentation

This document provides a comprehensive overview of the complete process from contract creation by a client through project completion and final payment release to the freelancer using the Bizzlink platform.

## Table of Contents

1. [Overview](#overview)
2. [Phase 1: Contract Creation](#phase-1-contract-creation)
3. [Phase 2: Freelancer Review & Acceptance](#phase-2-freelancer-review--acceptance)
4. [Phase 3: Initial Payment & Escrow](#phase-3-initial-payment--escrow)
5. [Phase 4: Work Execution & Progress](#phase-4-work-execution--progress)
6. [Phase 5: Milestone Completion & Payment Release](#phase-5-milestone-completion--payment-release)
7. [Phase 6: Contract Completion](#phase-6-contract-completion)
8. [Database Collections Used](#database-collections-used)
9. [Payment Flow Details](#payment-flow-details)
10. [Error Handling & Edge Cases](#error-handling--edge-cases)

## Overview

The Bizzlink platform facilitates secure transactions between clients and freelancers through a structured contract and escrow system. The entire lifecycle involves multiple database collections working together to ensure transparency, security, and proper tracking of all activities.

**Key Collections Involved:**

- `contracts` - Core contract management
- `payments` - Payment processing and escrow
- `contractEvents` - Audit trail and event tracking
- `users` - Client and freelancer profiles
- `projects` - Original project requirements
- `proposals` - Freelancer proposals
- `notifications` - User communication
- `conversations` & `messages` - Direct communication

---

## Phase 1: Contract Creation

### Process Overview

When a client decides to hire a freelancer, they initiate the contract creation process through the `/client/contracts/create` page.

### Database Operations

#### 1.1 Contract Document Creation

**Collection**: `contracts`
**Status**: `pending_acceptance`

```typescript
// Contract created with initial status
const contractData = {
  contractId: "contract_generated_id",
  projectId: "project_123",
  proposalId: "proposal_456",
  clientId: "client_user_id",
  freelancerId: "freelancer_user_id",

  terms: {
    amount: 1000, // Total calculated from milestones
    currency: "USD",
    paymentType: "fixed",
    startDate: Timestamp,
    endDate: Timestamp,
    workingHoursPerWeek: 40,
  },

  status: "pending_acceptance", // Initial status
  progress: 0,

  milestones: [
    {
      id: "milestone_1",
      title: "Phase 1 - Design",
      description: "Complete UI/UX design",
      amount: 400,
      dueDate: Timestamp,
      status: "pending",
    },
    {
      id: "milestone_2",
      title: "Phase 2 - Development",
      description: "Frontend development",
      amount: 600,
      dueDate: Timestamp,
      status: "pending",
    },
  ],

  timeTracking: {
    totalHours: 0,
    weeklyLimit: 40,
    isManualTime: true,
  },

  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp(),
};
```

#### 1.2 Initial Payment Record Creation

**Collection**: `payments`
**Status**: `pending`

```typescript
// Payment record for first milestone (not yet processed)
const paymentData = {
  paymentId: "payment_generated_id",
  contractId: "contract_generated_id",
  milestoneId: "milestone_1",
  clientId: "client_user_id",
  freelancerId: "freelancer_user_id",

  amount: {
    gross: 400,
    fee: 40, // 10% platform fee
    net: 360,
    currency: "USD",
  },

  status: "pending", // Will change to "escrowed" after payment processing
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
    formattedPhone: "6 71 23 45 67",
  },

  createdAt: serverTimestamp(),
};
```

#### 1.3 Contract Creation Event

**Collection**: `contractEvents`

```typescript
const eventData = {
  eventId: "event_generated_id",
  contractId: "contract_generated_id",
  eventType: "contract_created",
  createdBy: "client_user_id",
  userType: "client",
  comment: "Contract created with MTN Mobile Money payment method",
  metadata: {
    totalAmount: 1000,
    currency: "USD",
    milestonesCount: 2,
    paymentMethodType: "mtn_momo",
  },
  createdAt: serverTimestamp(),
};
```

#### 1.4 Notification to Freelancer

**Collection**: `notifications`

```typescript
const notificationData = {
  notificationId: "notification_generated_id",
  userId: "freelancer_user_id",
  type: "contract_offer_received",
  title: "New Contract Offer",
  message: "You have received a contract offer for Project XYZ",
  data: {
    contractId: "contract_generated_id",
    projectTitle: "Project XYZ",
    clientName: "Client Name",
    amount: 1000,
    currency: "USD",
  },
  isRead: false,
  createdAt: serverTimestamp(),
};
```

---

## Phase 2: Freelancer Review & Acceptance

### Process Overview

The freelancer reviews the contract terms through `/contracts/[id]` page and can either accept, reject, or request revisions.

### 2.1 Freelancer Accepts Contract

#### Contract Status Update

**Collection**: `contracts`
**Status**: `pending_acceptance` → `active`

```typescript
// Update contract status and activate first milestone
await updateDoc(contractRef, {
  status: "active",
  updatedAt: serverTimestamp(),
  milestones: [
    {
      ...milestone1,
      status: "active", // First milestone becomes active
    },
    {
      ...milestone2,
      status: "pending", // Subsequent milestones remain pending
    },
  ],
});
```

#### Contract Acceptance Event

**Collection**: `contractEvents`

```typescript
const acceptanceEvent = {
  eventId: "event_acceptance_id",
  contractId: "contract_generated_id",
  eventType: "contract_accepted",
  createdBy: "freelancer_user_id",
  userType: "freelancer",
  comment: "Contract terms accepted. Ready to begin work.",
  metadata: {
    previousStatus: "pending_acceptance",
    newStatus: "active",
    acceptedAt: serverTimestamp(),
  },
  createdAt: serverTimestamp(),
};
```

#### Notification to Client

**Collection**: `notifications`

```typescript
const clientNotification = {
  notificationId: "notification_acceptance_id",
  userId: "client_user_id",
  type: "contract_accepted",
  title: "Contract Accepted",
  message:
    "Your freelancer has accepted the contract. Please fund the first milestone to begin work.",
  data: {
    contractId: "contract_generated_id",
    freelancerName: "Freelancer Name",
    nextAction: "fund_milestone",
  },
  isRead: false,
  createdAt: serverTimestamp(),
};
```

### 2.2 Alternative: Freelancer Requests Revision

#### Contract Status Update

**Collection**: `contracts`
**Status**: `pending_acceptance` → `revision_requested`

```typescript
await updateDoc(contractRef, {
  status: "revision_requested",
  updatedAt: serverTimestamp(),
});
```

#### Revision Request Event

**Collection**: `contractEvents`

```typescript
const revisionEvent = {
  eventId: "event_revision_id",
  contractId: "contract_generated_id",
  eventType: "revision_requested",
  createdBy: "freelancer_user_id",
  userType: "freelancer",
  comment: "Requesting changes to milestone timeline and payment structure",
  metadata: {
    previousStatus: "pending_acceptance",
    newStatus: "revision_requested",
    revisionReason: "Timeline needs adjustment for better quality delivery",
  },
  createdAt: serverTimestamp(),
};
```

---

## Phase 3: Initial Payment & Escrow

### Process Overview

Once the contract is accepted, the client funds the milestones(either one by one, or all at once, by choosing a payment method and filling details in anycase) through the payment dialog in `/client/contracts/[id]`.

### 3.1 Milestone Payment Processing

#### Payment Status Update

**Collection**: `payments`
**Status**: `pending` → `escrowed`

```typescript
// Update existing payment record to escrowed status
await updateDoc(paymentRef, {
  status: "escrowed",
  processedAt: serverTimestamp(),
  escrow: {
    releasedAt: null,
    releaseCondition: "milestone_completion_approval",
  },
});
```

#### Milestone Status Update

**Collection**: `contracts`

```typescript
// Update milestone status to active after funding
await updateDoc(contractRef, {
  milestones: [
    {
      ...milestone1,
      status: "active", // Now funded and active
    },
  ],
  updatedAt: serverTimestamp(),
});
```

#### Milestone Funding Event

**Collection**: `contractEvents`

```typescript
const fundingEvent = {
  eventId: "event_funding_id",
  contractId: "contract_generated_id",
  milestoneId: "milestone_1",
  eventType: "milestone_funded",
  createdBy: "client_user_id",
  userType: "client",
  comment: "First milestone funded to escrow using MTN Mobile Money",
  amount: 400,
  currency: "USD",
  metadata: {
    paymentMethodType: "mtn_momo",
    escrowStatus: "secured",
    phoneNumber: "+237671234567",
  },
  createdAt: serverTimestamp(),
};
```

#### Notifications to Both Parties

**Collection**: `notifications`

```typescript
// Notification to freelancer
const freelancerNotification = {
  userId: "freelancer_user_id",
  type: "milestone_funded",
  title: "Milestone Funded",
  message: "First milestone has been funded. You can now start working.",
  data: {
    contractId: "contract_generated_id",
    milestoneTitle: "Phase 1 - Design",
    amount: 400,
    currency: "USD",
  },
  createdAt: serverTimestamp(),
};

// Notification to client (confirmation)
const clientConfirmation = {
  userId: "client_user_id",
  type: "payment_processed",
  title: "Payment Processed",
  message: "Your payment has been secured in escrow. Work will begin shortly.",
  data: {
    contractId: "contract_generated_id",
    amount: 400,
    currency: "USD",
    status: "escrowed",
  },
  createdAt: serverTimestamp(),
};
```

---

## Phase 4: Work Execution & Progress

### Process Overview

The freelancer works on the active milestone while both parties can track progress and communicate through the messaging module which already works well.

The freelancer should also be able to update progress manually

### 4.1 Work Progress Updates

#### Progress Tracking

**Collection**: `contracts`

```typescript
// Freelancer updates progress (this could be manual)
await updateDoc(contractRef, {
  progress: 25, // 25% complete
  updatedAt: serverTimestamp(),
});
```

#### Communication: ALREADY DONE

**Collection**: `conversations` & `messages`

```typescript
// Automatic conversation creation for contract
const conversationData = {
  conversationId: "conv_contract_id",
  clientId: "client_user_id",
  freelancerId: "freelancer_user_id",
  type: "one_to_one",
  contractId: "contract_generated_id", // Link to contract
  lastMessage: {
    text: "Contract conversation started",
    senderId: "system",
    timestamp: serverTimestamp(),
    type: "system",
  },
  createdAt: serverTimestamp(),
};
```

### 4.2 Milestone Submission

#### Milestone Status Update

**Collection**: `contracts`
**Milestone Status**: `active` → `in_review`

```typescript
await updateDoc(contractRef, {
  milestones: [
    {
      ...milestone1,
      status: "in_review",
      submittedAt: serverTimestamp(),
    },
  ],
  updatedAt: serverTimestamp(),
});
```

#### Milestone Submission Event

**Collection**: `contractEvents`

```typescript
const submissionEvent = {
  eventId: "event_submission_id",
  contractId: "contract_generated_id",
  milestoneId: "milestone_1",
  eventType: "milestone_submitted",
  createdBy: "freelancer_user_id",
  userType: "freelancer",
  comment: "Phase 1 design work completed and submitted for review",
  metadata: {
    previousStatus: "active",
    newStatus: "in_review",
    deliverables: ["wireframes.pdf", "mockups.figma", "style_guide.pdf"],
  },
  createdAt: serverTimestamp(),
};
```

#### Client Notification

**Collection**: `notifications`

```typescript
const reviewNotification = {
  userId: "client_user_id",
  type: "milestone_submitted",
  title: "Work Submitted for Review",
  message: "Phase 1 - Design has been completed and is ready for your review",
  data: {
    contractId: "contract_generated_id",
    milestoneId: "milestone_1",
    milestoneTitle: "Phase 1 - Design",
    action: "review_required",
  },
  createdAt: serverTimestamp(),
};
```

---

## Phase 5: Milestone Completion & Payment Release

### Process Overview

The client reviews the submitted work and either approves it (releasing payment) or requests revisions.

### 5.1 Client Approves Work

#### Payment Release

**Collection**: `payments`
**Status**: `escrowed` → `completed`

```typescript
await updateDoc(paymentRef, {
  status: "completed",
  completedAt: serverTimestamp(),
  escrow: {
    releasedAt: serverTimestamp(),
    releaseCondition: "milestone_completion_approval",
  },
});
```

#### Milestone Completion

**Collection**: `contracts`
**Milestone Status**: `in_review` → `completed`

```typescript
await updateDoc(contractRef, {
  milestones: [
    {
      ...milestone1,
      status: "completed",
      approvedAt: serverTimestamp(),
    },
    {
      ...milestone2,
      status: "active", // Next milestone becomes active
    },
  ],
  progress: 40, // Updated based on milestone completion
  updatedAt: serverTimestamp(),
});
```

#### Payment Release Event

**Collection**: `contractEvents`

```typescript
const releaseEvent = {
  eventId: "event_release_id",
  contractId: "contract_generated_id",
  milestoneId: "milestone_1",
  eventType: "milestone_payment_released",
  createdBy: "client_user_id",
  userType: "client",
  comment: "Excellent work quality. Payment released.",
  amount: 400,
  currency: "USD",
  metadata: {
    previousMilestoneStatus: "in_review",
    newMilestoneStatus: "completed",
    paymentReleasedTo: "freelancer_user_id",
    netAmount: 360, // After platform fee
  },
  createdAt: serverTimestamp(),
};
```

#### Notifications

**Collection**: `notifications`

```typescript
// Freelancer notification (payment received)
const paymentNotification = {
  userId: "freelancer_user_id",
  type: "payment_released",
  title: "Payment Released",
  message: "Your payment for Phase 1 - Design has been released",
  data: {
    contractId: "contract_generated_id",
    amount: 360, // Net amount after fees
    currency: "USD",
    milestoneTitle: "Phase 1 - Design",
  },
  createdAt: serverTimestamp(),
};

// Client notification (confirmation)
const clientConfirmation = {
  userId: "client_user_id",
  type: "milestone_completed",
  title: "Milestone Completed",
  message: "Phase 1 - Design has been completed. Phase 2 is now active.",
  data: {
    contractId: "contract_generated_id",
    completedMilestone: "Phase 1 - Design",
    nextMilestone: "Phase 2 - Development",
    nextAction: "fund_next_milestone",
  },
  createdAt: serverTimestamp(),
};
```

### 5.2 Client Requests Revisions

#### Milestone Status Update

**Collection**: `contracts`
**Milestone Status**: `in_review` → `active` (back to work)

```typescript
await updateDoc(contractRef, {
  milestones: [
    {
      ...milestone1,
      status: "active", // Back to work with revisions
    },
  ],
  updatedAt: serverTimestamp(),
});
```

#### Revision Request Event

**Collection**: `contractEvents`

```typescript
const revisionEvent = {
  eventId: "event_revision_milestone_id",
  contractId: "contract_generated_id",
  milestoneId: "milestone_1",
  eventType: "milestone_rejected",
  createdBy: "client_user_id",
  userType: "client",
  comment: "Please adjust the color scheme and typography as discussed",
  metadata: {
    previousStatus: "in_review",
    newStatus: "active",
    revisionNotes: "Color scheme needs to match brand guidelines better",
    expectedRevisionTime: "2 days",
  },
  createdAt: serverTimestamp(),
};
```

---

## Phase 6: Contract Completion

### Process Overview

When all milestones are completed and payments released, the contract reaches completion.

### 6.1 Final Milestone Completion

#### Contract Completion

**Collection**: `contracts`
**Status**: `active` → `completed`

```typescript
await updateDoc(contractRef, {
  status: "completed",
  progress: 100,
  completedAt: serverTimestamp(),
  updatedAt: serverTimestamp(),
});
```

#### Contract Completion Event

**Collection**: `contractEvents`

```typescript
const completionEvent = {
  eventId: "event_completion_id",
  contractId: "contract_generated_id",
  eventType: "contract_completed",
  createdBy: "client_user_id",
  userType: "client",
  comment: "All milestones completed successfully. Excellent work!",
  metadata: {
    previousStatus: "active",
    newStatus: "completed",
    totalAmount: 1000,
    totalPaid: 1000,
    milestonesCompleted: 2,
    projectDuration: "30 days",
  },
  createdAt: serverTimestamp(),
};
```

#### Final Notifications

**Collection**: `notifications`

```typescript
// Both parties get completion notification
const completionNotifications = [
  {
    userId: "freelancer_user_id",
    type: "contract_completed",
    title: "Contract Completed",
    message: "Congratulations! You have successfully completed the project.",
    data: {
      contractId: "contract_generated_id",
      totalEarned: 900, // Total after platform fees
      currency: "USD",
      nextAction: "request_review",
    },
  },
  {
    userId: "client_user_id",
    type: "contract_completed",
    title: "Project Completed",
    message: "Your project has been completed successfully.",
    data: {
      contractId: "contract_generated_id",
      totalSpent: 1000,
      currency: "USD",
      nextAction: "leave_review",
    },
  },
];
```

---

## Database Collections Used

### Primary Collections

1. **contracts** - Core contract management and status tracking
2. **payments** - Payment processing, escrow, and transaction records
3. **contractEvents** - Complete audit trail of all contract activities
4. **notifications** - User notifications for all contract events

### Supporting Collections

5. **users** - Client and freelancer profile information
6. **projects** - Original project requirements and details
7. **proposals** - Freelancer proposals that led to contracts
8. **conversations** - Communication channels between parties
9. **messages** - Individual messages within conversations
10. **reviews** - Post-completion ratings and feedback

---

## Payment Flow Details

### Mobile Money Payment Processing

#### MTN Mobile Money Flow

1. Client selects MTN Mobile Money during contract creation
2. Phone number validation using country-specific rules
3. Payment record created with `pending` status
4. On milestone funding:
   - SMS payment request sent to client's phone
   - Client enters PIN to confirm payment
   - Payment status updated to `escrowed`
   - Funds held securely until milestone approval

#### Orange Money Flow

1. Similar process to MTN but using Orange Money APIs
2. Country availability validation (different from MTN)
3. Orange-specific phone number formatting and validation
4. Integration with Orange Money payment gateway

### Escrow System

1. **Funding**: Client payment goes to platform escrow account
2. **Security**: Funds held until client approves milestone
3. **Release**: Payment released to freelancer upon approval
4. **Protection**: Both parties protected from fraud/non-payment

---

## Error Handling & Edge Cases

### Contract Creation Failures

- **Validation Errors**: Invalid payment method, missing milestones
- **Payment Failures**: Mobile money timeout, insufficient funds
- **Recovery**: Contract marked as `failed`, payment record deleted

### Payment Processing Issues

- **Mobile Money Timeout**: Retry mechanism with user notification
- **Insufficient Funds**: Error notification, payment marked as `failed`
- **Network Issues**: Automatic retry with exponential backoff

### Dispute Handling

- **Milestone Disputes**: Additional event types for dispute tracking
- **Payment Disputes**: Escrow protection with manual review process
- **Resolution Tracking**: Complete audit trail in `contractEvents`

### Contract Cancellation

- **Active Contracts**: Escrow funds returned to client
- **Partial Completion**: Pro-rated payments based on completed work
- **Event Tracking**: Detailed cancellation reasons in events

---

## Summary

This comprehensive lifecycle ensures:

1. **Transparency**: Complete audit trail via `contractEvents`
2. **Security**: Escrow system protects both parties
3. **Flexibility**: Support for revisions and dispute resolution
4. **Communication**: Real-time notifications and messaging
5. **Payment Options**: Multiple payment methods including mobile money
6. **Progress Tracking**: Real-time milestone and progress updates

The system leverages Firebase's real-time capabilities to provide instant updates to both clients and freelancers throughout the entire project lifecycle, from initial contract creation through final payment release and project completion.
