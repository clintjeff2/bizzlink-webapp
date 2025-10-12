/**
 * Contract and Payment Module Types
 *
 * This file defines all type definitions for the contract and payment system
 */

import { Timestamp, FieldValue } from "firebase/firestore";

// Common Types
export type ContractStatus =
  | "pending_acceptance"
  | "active"
  | "paused"
  | "completed"
  | "cancelled"
  | "revision_requested"
  | "dispute";

export type MilestoneStatus =
  | "pending"
  | "active"
  | "in_review"
  | "completed"
  | "cancelled";

export type PaymentStatus =
  | "pending"
  | "escrowed"
  | "released"
  | "completed"
  | "refunded"
  | "failed";

export type PaymentType = "milestone" | "hourly" | "bonus" | "refund";

export type PaymentMethodType =
  | "card"
  | "paypal"
  | "bank_transfer"
  | "mtn_momo"
  | "orange_momo";

export type MobileMoneyProvider = "mtn_momo" | "orange_momo";

export type UserType = "client" | "freelancer" | "admin";

export type ContractEventType =
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
  | "dispute_resolved"
  | "progress_updated";

// Contract Interface
export interface Contract {
  contractId: string;
  projectId: string;
  proposalId: string;
  clientId: string;
  freelancerId: string;

  terms: {
    amount: number;
    currency: string;
    paymentType: "fixed"; // Can be extended for hourly in the future
    startDate: Timestamp | Date;
    endDate: Timestamp | Date;
    workingHoursPerWeek: number;
  };

  status: ContractStatus;
  progress: number; // 0-100

  milestones: Milestone[];

  timeTracking: {
    totalHours: number;
    weeklyLimit: number;
    isManualTime: boolean;
  };

  createdAt: Timestamp | FieldValue;
  updatedAt: Timestamp | FieldValue;
  completedAt?: Timestamp | null;
}

// Milestone Interface
export interface Milestone {
  id: string;
  title: string;
  description?: string;
  amount: number;
  dueDate: Timestamp | Date;
  status: MilestoneStatus;
  submittedAt?: Timestamp | null;
  approvedAt?: Timestamp | null;
  submissionDetails?: {
    description: string;
    links: string[];
    files: Array<{
      fileName: string;
      fileUrl: string;
      fileType: string;
      storagePath?: string; // Path in Firebase Storage for deletion
    }>;
  };
}

// Payment Interface
export interface Payment {
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

  status: PaymentStatus;
  type: PaymentType;

  paymentMethod: PaymentMethod;
  mobileMoneyDetails?: MobileMoneyDetails;

  escrow?: {
    releasedAt: Timestamp | null;
    releaseCondition: string;
  };

  createdAt: Timestamp | FieldValue;
  processedAt?: Timestamp | FieldValue;
  completedAt?: Timestamp | FieldValue;
}

// Payment Method Types
export interface BasePaymentMethod {
  type: PaymentMethodType;
  provider: string;
  last4?: string;
}

export interface CardPaymentMethod extends BasePaymentMethod {
  type: "card";
  cardName?: string;
  cardNumber?: string;
  expiryMonth?: string;
  expiryYear?: string;
  cvc?: string;
}

export interface MomoPaymentMethod extends BasePaymentMethod {
  type: "mtn_momo" | "orange_momo";
  countryCode: string;
  phoneNumber: string;
}

export type PaymentMethod =
  | BasePaymentMethod
  | CardPaymentMethod
  | MomoPaymentMethod;

// Mobile Money Details
export interface MobileMoneyDetails {
  countryCode: string; // Country code with + (e.g., "+237")
  phoneNumber: string; // Phone number without country code
  fullPhoneNumber: string; // Complete phone number (countryCode + phoneNumber)
  provider: MobileMoneyProvider;
  formattedPhone?: string; // Formatted phone number for display (e.g., "6 71 23 45 67")
}

// Contract Event Interface
export interface ContractEvent {
  eventId: string;
  contractId: string;
  milestoneId?: string; // Optional, for milestone-specific events

  // Event Details
  eventType: ContractEventType;

  // User Information
  createdBy: string; // User ID who triggered the event
  userType: UserType;

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
  createdAt: Timestamp | FieldValue;
}

// Dispute Interface
export interface Dispute {
  disputeId: string;
  contractId: string;
  milestoneId?: string;
  initiatedBy: string;
  userType: UserType;
  status: "open" | "under_review" | "resolved";
  reason: string;
  resolution?: string | null;
  adminNotes?: string | null;
  createdAt: Timestamp | FieldValue;
  updatedAt: Timestamp | FieldValue;
  resolvedAt?: Timestamp | null;
}

// Notification Interface
export interface Notification {
  notificationId: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  data: Record<string, any>;
  isRead: boolean;
  createdAt: Timestamp | FieldValue;
}

// Input Types for Functions
export interface CreateContractInput {
  projectId: string;
  proposalId: string;
  clientId: string;
  freelancerId: string;
  terms: {
    amount: number;
    currency: string;
    paymentType: "fixed";
    startDate: Date | Timestamp;
    endDate: Date | Timestamp;
    workingHoursPerWeek: number;
  };
  milestones: Array<{
    id: string;
    title: string;
    description?: string;
    amount: number;
    dueDate: Date | Timestamp;
    status: MilestoneStatus;
  }>;
  timeTracking: {
    totalHours: number;
    weeklyLimit: number;
    isManualTime: boolean;
  };
}

export interface PaymentMethodInput {
  type: PaymentMethodType;
  cardId?: string;
  cardBrand?: string;
  cardLast4?: string;
  accountId?: string;
  accountName?: string;
  accountLast4?: string;
}

export interface MobileMoneyDetailsInput {
  countryCode: string;
  phoneNumber: string;
  fullPhoneNumber: string;
  provider: MobileMoneyProvider;
  formattedPhone?: string;
}
