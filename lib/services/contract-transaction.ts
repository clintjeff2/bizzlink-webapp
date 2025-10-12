/**
 * Contract Transaction Service
 *
 * This service handles all transaction-related operations for contracts and payments,
 * ensuring that operations that modify multiple collections are performed atomically.
 */

import { db } from "@/firebase";
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  getDoc,
  getDocs,
  query,
  where,
  writeBatch,
  serverTimestamp,
  Timestamp,
  increment,
  runTransaction,
  DocumentData,
} from "firebase/firestore";

import {
  Contract,
  Payment,
  ContractEvent,
  Notification,
  CreateContractInput,
  PaymentMethodType,
  MobileMoneyDetails,
  Dispute,
  UserType,
  PaymentMethod,
} from "@/lib/types/contract.types";

/**
 * Create a new contract with initial payment record
 */
export async function createContract(
  contractData,
  paymentMethodData,
  mobileMoneyDetails = null
) {
  // Use a transaction to ensure both the contract and payment are created
  try {
    return await runTransaction(db, async (transaction) => {
      // Create the contract document
      const contractRef = doc(collection(db, "contracts"));
      transaction.set(contractRef, {
        ...contractData,
        contractId: contractRef.id,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // Create the first milestone payment record (pending)
      const firstMilestone = contractData.milestones[0];
      const paymentRef = doc(collection(db, "payments"));

      const paymentData = {
        paymentId: paymentRef.id,
        contractId: contractRef.id,
        milestoneId: firstMilestone.id,
        clientId: contractData.clientId,
        freelancerId: contractData.freelancerId,

        amount: {
          gross: Number(firstMilestone.amount),
          fee: Number(firstMilestone.amount) * 0.1, // 10% platform fee
          net: Number(firstMilestone.amount) * 0.9, // Freelancer gets 90%
          currency: contractData.terms.currency,
        },

        status: "pending", // Will become "escrowed" after payment processing
        type: "milestone",

        paymentMethod: paymentMethodData,
        createdAt: serverTimestamp(),
      };

      // Add mobile money details if provided
      if (mobileMoneyDetails) {
        paymentData.mobileMoneyDetails = mobileMoneyDetails;
      }

      transaction.set(paymentRef, paymentData);

      // Create contract creation event
      const eventRef = doc(collection(db, "contractEvents"));
      const paymentMethodName = getPaymentMethodName(paymentMethodData.type);

      transaction.set(eventRef, {
        eventId: eventRef.id,
        contractId: contractRef.id,
        eventType: "contract_created",
        createdBy: contractData.clientId,
        userType: "client",
        comment: `Contract created with ${paymentMethodName} payment method`,
        metadata: {
          totalAmount: contractData.terms.amount,
          currency: contractData.terms.currency,
          milestonesCount: contractData.milestones.length,
          paymentMethodType: paymentMethodData.type,
        },
        createdAt: serverTimestamp(),
      });

      // Create notification for freelancer
      const notificationRef = doc(collection(db, "notifications"));
      transaction.set(notificationRef, {
        notificationId: notificationRef.id,
        userId: contractData.freelancerId,
        type: "contract_offer_received",
        title: "New Contract Offer",
        message: "You have received a contract offer for your proposal",
        data: {
          contractId: contractRef.id,
          clientId: contractData.clientId,
          amount: contractData.terms.amount,
          currency: contractData.terms.currency,
        },
        isRead: false,
        createdAt: serverTimestamp(),
      });

      return {
        contractId: contractRef.id,
        paymentId: paymentRef.id,
      };
    });
  } catch (error) {
    console.error("Error in transaction:", error);
    throw error;
  }
}

/**
 * Freelancer accepts the contract
 */
export async function acceptContract(
  contractId: string,
  freelancerId: string,
  comment = ""
) {
  try {
    return await runTransaction(db, async (transaction) => {
      // Get the contract
      const contractRef = doc(db, "contracts", contractId);
      const contractSnap = await transaction.get(contractRef);

      if (!contractSnap.exists()) {
        throw new Error("Contract not found");
      }

      const contractData = contractSnap.data();

      // Verify the freelancer is correct
      if (contractData.freelancerId !== freelancerId) {
        throw new Error("Unauthorized: You are not assigned to this contract");
      }

      // Verify the contract is in pending_acceptance status
      if (contractData.status !== "pending_acceptance") {
        throw new Error("Contract is not in pending acceptance state");
      }

      // Update contract status to active
      // Note: Milestones should NOT be updated to active yet - they will be set to active only when funded
      // Keep the original milestones without changing status

      transaction.update(contractRef, {
        status: "active",
        updatedAt: serverTimestamp(),
        // Do not update milestone status - they remain in 'pending' state until funded
      });

      // Create contract acceptance event
      const eventRef = doc(collection(db, "contractEvents"));
      transaction.set(eventRef, {
        eventId: eventRef.id,
        contractId: contractId,
        eventType: "contract_accepted",
        createdBy: freelancerId,
        userType: "freelancer",
        comment: comment || "Contract terms accepted. Ready to begin work.",
        metadata: {
          previousStatus: "pending_acceptance",
          newStatus: "active",
          acceptedAt: serverTimestamp(),
        },
        createdAt: serverTimestamp(),
      });

      // Create notification for client
      const notificationRef = doc(collection(db, "notifications"));
      transaction.set(notificationRef, {
        notificationId: notificationRef.id,
        userId: contractData.clientId,
        type: "contract_accepted",
        title: "Contract Accepted",
        message:
          "Your freelancer has accepted the contract. Please fund the first milestone to begin work.",
        data: {
          contractId: contractId,
          freelancerId: freelancerId,
          nextAction: "fund_milestone",
        },
        isRead: false,
        createdAt: serverTimestamp(),
      });

      return {
        success: true,
        contractId: contractId,
      };
    });
  } catch (error) {
    console.error("Error accepting contract:", error);
    throw error;
  }
}

/**
 * Freelancer rejects the contract
 */
export async function rejectContract(contractId, freelancerId, reason = "") {
  try {
    return await runTransaction(db, async (transaction) => {
      // Get the contract
      const contractRef = doc(db, "contracts", contractId);
      const contractSnap = await transaction.get(contractRef);

      if (!contractSnap.exists()) {
        throw new Error("Contract not found");
      }

      const contractData = contractSnap.data();

      // Verify the freelancer is correct
      if (contractData.freelancerId !== freelancerId) {
        throw new Error("Unauthorized: You are not assigned to this contract");
      }

      // Verify the contract is in pending_acceptance status
      if (contractData.status !== "pending_acceptance") {
        throw new Error("Contract is not in pending acceptance state");
      }

      // Update contract status to rejected
      transaction.update(contractRef, {
        status: "cancelled",
        updatedAt: serverTimestamp(),
      });

      // Create contract rejection event
      const eventRef = doc(collection(db, "contractEvents"));
      transaction.set(eventRef, {
        eventId: eventRef.id,
        contractId: contractId,
        eventType: "contract_rejected",
        createdBy: freelancerId,
        userType: "freelancer",
        comment: reason || "Contract offer declined by freelancer.",
        metadata: {
          previousStatus: "pending_acceptance",
          newStatus: "cancelled",
          rejectedAt: serverTimestamp(),
          reason: reason || "No reason provided",
        },
        createdAt: serverTimestamp(),
      });

      // Create notification for client
      const notificationRef = doc(collection(db, "notifications"));
      transaction.set(notificationRef, {
        notificationId: notificationRef.id,
        userId: contractData.clientId,
        type: "contract_rejected",
        title: "Contract Rejected",
        message: "The freelancer has declined your contract offer.",
        data: {
          contractId: contractId,
          freelancerId: freelancerId,
          reason: reason || "No reason provided",
        },
        isRead: false,
        createdAt: serverTimestamp(),
      });

      return {
        success: true,
        contractId: contractId,
      };
    });
  } catch (error) {
    console.error("Error rejecting contract:", error);
    throw error;
  }
}

/**
 * Freelancer requests revisions to the contract
 */
export async function requestRevision(contractId, freelancerId, reason = "") {
  try {
    return await runTransaction(db, async (transaction) => {
      // Get the contract
      const contractRef = doc(db, "contracts", contractId);
      const contractSnap = await transaction.get(contractRef);

      if (!contractSnap.exists()) {
        throw new Error("Contract not found");
      }

      const contractData = contractSnap.data();

      // Verify the freelancer is correct
      if (contractData.freelancerId !== freelancerId) {
        throw new Error("Unauthorized: You are not assigned to this contract");
      }

      // Verify the contract is in pending_acceptance status
      if (contractData.status !== "pending_acceptance") {
        throw new Error("Contract is not in pending acceptance state");
      }

      // Update contract status to revision_requested
      transaction.update(contractRef, {
        status: "revision_requested",
        updatedAt: serverTimestamp(),
      });

      // Create revision request event
      const eventRef = doc(collection(db, "contractEvents"));
      transaction.set(eventRef, {
        eventId: eventRef.id,
        contractId: contractId,
        eventType: "revision_requested",
        createdBy: freelancerId,
        userType: "freelancer",
        comment: reason || "Requesting changes to contract terms.",
        metadata: {
          previousStatus: "pending_acceptance",
          newStatus: "revision_requested",
          revisionReason: reason || "General revision request",
          requestedAt: serverTimestamp(),
        },
        createdAt: serverTimestamp(),
      });

      // Create notification for client
      const notificationRef = doc(collection(db, "notifications"));
      transaction.set(notificationRef, {
        notificationId: notificationRef.id,
        userId: contractData.clientId,
        type: "contract_revision_requested",
        title: "Contract Revision Requested",
        message: "The freelancer has requested changes to your contract offer.",
        data: {
          contractId: contractId,
          freelancerId: freelancerId,
          reason: reason || "No reason provided",
          action: "review_contract",
        },
        isRead: false,
        createdAt: serverTimestamp(),
      });

      return {
        success: true,
        contractId: contractId,
      };
    });
  } catch (error) {
    console.error("Error requesting revision:", error);
    throw error;
  }
}

/**
 * Client funds a milestone (escrow payment)
 */
export async function fundMilestone(
  contractId,
  milestoneId,
  clientId,
  paymentMethodData,
  mobileMoneyDetails = null
) {
  try {
    return await runTransaction(db, async (transaction) => {
      // Get the contract
      const contractRef = doc(db, "contracts", contractId);
      const contractSnap = await transaction.get(contractRef);

      if (!contractSnap.exists()) {
        throw new Error("Contract not found");
      }

      const contractData = contractSnap.data();

      // Verify the client is correct
      if (contractData.clientId !== clientId) {
        throw new Error(
          "Unauthorized: You are not the client of this contract"
        );
      }

      // Find the milestone
      const milestoneIndex = contractData.milestones.findIndex(
        (m) => m.id === milestoneId
      );
      if (milestoneIndex === -1) {
        throw new Error("Milestone not found");
      }

      const milestone = contractData.milestones[milestoneIndex];

      // Check milestone status is pending or active
      if (milestone.status !== "pending" && milestone.status !== "active") {
        throw new Error("Milestone is not in a state that can be funded");
      }

      // Create or update payment record
      let paymentRef;
      let existingPayment = false;

      // Check if payment record already exists
      const paymentsQuery = await transaction.get(
        collection(db, "payments"),
        where("contractId", "==", contractId),
        where("milestoneId", "==", milestoneId)
      );

      if (!paymentsQuery.empty) {
        // Update existing payment record
        paymentRef = doc(db, "payments", paymentsQuery.docs[0].id);
        existingPayment = true;
      } else {
        // Create new payment record
        paymentRef = doc(collection(db, "payments"));
      }

      const paymentData = {
        paymentId: paymentRef.id,
        contractId: contractId,
        milestoneId: milestoneId,
        clientId: clientId,
        freelancerId: contractData.freelancerId,

        amount: {
          gross: Number(milestone.amount),
          fee: Number(milestone.amount) * 0.1, // 10% platform fee
          net: Number(milestone.amount) * 0.9, // 90% for freelancer
          currency: contractData.terms.currency,
        },

        status: "escrowed", // After funding it's immediately in escrow
        type: "milestone",

        paymentMethod: paymentMethodData,

        escrow: {
          releasedAt: null,
          releaseCondition: "milestone_completion_approval",
        },

        processedAt: serverTimestamp(),
        ...(existingPayment ? {} : { createdAt: serverTimestamp() }),
      };

      // Add mobile money details if provided
      if (mobileMoneyDetails) {
        paymentData.mobileMoneyDetails = mobileMoneyDetails;
      }

      if (existingPayment) {
        transaction.update(paymentRef, paymentData);
      } else {
        transaction.set(paymentRef, paymentData);
      }

      // Update milestone status to active
      const allMilestones = [...contractData.milestones];

      // Update only the specific milestone being funded
      allMilestones[milestoneIndex] = {
        ...allMilestones[milestoneIndex],
        status: "active",
      };

      // Update the contract with all milestones intact
      transaction.update(contractRef, {
        milestones: allMilestones,
        updatedAt: serverTimestamp(),
      });

      // Create milestone funding event
      const eventRef = doc(collection(db, "contractEvents"));
      const paymentMethodName = getPaymentMethodName(paymentMethodData.type);

      transaction.set(eventRef, {
        eventId: eventRef.id,
        contractId: contractId,
        milestoneId: milestoneId,
        eventType: "milestone_funded",
        createdBy: clientId,
        userType: "client",
        comment: `Milestone funded to escrow using ${paymentMethodName}`,
        amount: milestone.amount,
        currency: contractData.terms.currency,
        metadata: {
          paymentMethodType: paymentMethodData.type,
          escrowStatus: "secured",
          paymentId: paymentRef.id,
          ...(paymentMethodData.type === "mtn_momo" ||
          paymentMethodData.type === "orange_momo"
            ? { phoneNumber: mobileMoneyDetails?.fullPhoneNumber }
            : {}),
        },
        createdAt: serverTimestamp(),
      });

      // Create notifications for both parties
      // For freelancer
      const freelancerNotificationRef = doc(collection(db, "notifications"));
      transaction.set(freelancerNotificationRef, {
        notificationId: freelancerNotificationRef.id,
        userId: contractData.freelancerId,
        type: "milestone_funded",
        title: "Milestone Funded",
        message: `${milestone.title} has been funded. You can now start working.`,
        data: {
          contractId: contractId,
          milestoneId: milestoneId,
          milestoneTitle: milestone.title,
          amount: milestone.amount,
          currency: contractData.terms.currency,
        },
        isRead: false,
        createdAt: serverTimestamp(),
      });

      // For client (confirmation)
      const clientNotificationRef = doc(collection(db, "notifications"));
      transaction.set(clientNotificationRef, {
        notificationId: clientNotificationRef.id,
        userId: clientId,
        type: "payment_processed",
        title: "Payment Processed",
        message:
          "Your payment has been secured in escrow. Work will begin shortly.",
        data: {
          contractId: contractId,
          milestoneId: milestoneId,
          amount: milestone.amount,
          currency: contractData.terms.currency,
          status: "escrowed",
        },
        isRead: false,
        createdAt: serverTimestamp(),
      });

      return {
        success: true,
        contractId: contractId,
        milestoneId: milestoneId,
        paymentId: paymentRef.id,
      };
    });
  } catch (error) {
    console.error("Error funding milestone:", error);
    throw error;
  }
}

/**
 * Freelancer submits a milestone for review
 */
export async function submitMilestone(
  contractId: string,
  milestoneId: string,
  freelancerId: string,
  comment = "",
  deliverables = [],
  submissionDetails = {
    description: "",
    links: [] as string[],
    files: [] as { fileName: string; fileUrl: string; fileType: string }[],
  }
) {
  try {
    return await runTransaction(db, async (transaction) => {
      // Get the contract
      const contractRef = doc(db, "contracts", contractId);
      const contractSnap = await transaction.get(contractRef);

      if (!contractSnap.exists()) {
        throw new Error("Contract not found");
      }

      const contractData = contractSnap.data();

      // Verify the freelancer is correct
      if (contractData.freelancerId !== freelancerId) {
        throw new Error("Unauthorized: You are not assigned to this contract");
      }

      // Find the milestone
      const milestoneIndex = contractData.milestones.findIndex(
        (m) => m.id === milestoneId
      );
      if (milestoneIndex === -1) {
        throw new Error("Milestone not found");
      }

      const milestone = contractData.milestones[milestoneIndex];

      // Check milestone status is active
      if (milestone.status !== "active") {
        throw new Error("Milestone is not active and cannot be submitted");
      }

      // Check that milestone is funded (payment record exists and is escrowed)
      const paymentsRef = query(
        collection(db, "payments"),
        where("contractId", "==", contractId),
        where("milestoneId", "==", milestoneId),
        where("status", "==", "escrowed")
      );
      const paymentsQuery = await getDocs(paymentsRef);

      if (paymentsQuery.empty) {
        throw new Error("Milestone has not been funded yet");
      }

      // Update milestone status to in_review and add submission details
      // Get a copy of all existing milestones
      const allMilestones = [...contractData.milestones];

      // Create timestamp outside of the array to avoid Firestore limitation
      const submissionTimestamp = new Date();

      // Update only the specific milestone being submitted
      allMilestones[milestoneIndex] = {
        ...allMilestones[milestoneIndex],
        status: "in_review",
        submittedAt: submissionTimestamp,
        submissionDetails: {
          description: submissionDetails.description || "",
          links: submissionDetails.links || [],
          files: submissionDetails.files || [],
        },
      };

      // Update the contract with all milestones intact
      transaction.update(contractRef, {
        milestones: allMilestones,
        updatedAt: serverTimestamp(),
      });

      // Create milestone submission event
      const eventRef = doc(collection(db, "contractEvents"));
      transaction.set(eventRef, {
        eventId: eventRef.id,
        contractId: contractId,
        milestoneId: milestoneId,
        eventType: "milestone_submitted",
        createdBy: freelancerId,
        userType: "freelancer",
        comment:
          comment || `${milestone.title} completed and submitted for review`,
        metadata: {
          previousStatus: "active",
          newStatus: "in_review",
          deliverables: deliverables || [],
          submissionDetails: {
            description: submissionDetails.description || "",
            links: submissionDetails.links || [],
            files: submissionDetails.files || [],
          },
        },
        createdAt: serverTimestamp(),
      });

      // Create notification for client
      const notificationRef = doc(collection(db, "notifications"));
      transaction.set(notificationRef, {
        notificationId: notificationRef.id,
        userId: contractData.clientId,
        type: "milestone_submitted",
        title: "Work Submitted for Review",
        message: `${milestone.title} has been completed and is ready for your review`,
        data: {
          contractId: contractId,
          milestoneId: milestoneId,
          milestoneTitle: milestone.title,
          action: "review_required",
        },
        isRead: false,
        createdAt: serverTimestamp(),
      });

      return {
        success: true,
        contractId: contractId,
        milestoneId: milestoneId,
      };
    });
  } catch (error) {
    console.error("Error submitting milestone:", error);
    throw error;
  }
}

/**
 * Client approves a milestone and releases payment
 */
export async function approveMilestone(
  contractId,
  milestoneId,
  clientId,
  comment = ""
) {
  try {
    return await runTransaction(db, async (transaction) => {
      // Get the contract
      const contractRef = doc(db, "contracts", contractId);
      const contractSnap = await transaction.get(contractRef);

      if (!contractSnap.exists()) {
        throw new Error("Contract not found");
      }

      const contractData = contractSnap.data();

      // Verify the client is correct
      if (contractData.clientId !== clientId) {
        throw new Error(
          "Unauthorized: You are not the client of this contract"
        );
      }

      // Find the milestone
      const milestoneIndex = contractData.milestones.findIndex(
        (m) => m.id === milestoneId
      );
      if (milestoneIndex === -1) {
        throw new Error("Milestone not found");
      }

      const milestone = contractData.milestones[milestoneIndex];

      // Check milestone status is in_review
      if (milestone.status !== "in_review") {
        throw new Error("Milestone must be in review status to be approved");
      }

      // Get payment record
      const paymentsQuery = await transaction.get(
        collection(db, "payments"),
        where("contractId", "==", contractId),
        where("milestoneId", "==", milestoneId),
        where("status", "==", "escrowed")
      );

      if (paymentsQuery.empty) {
        throw new Error("No escrowed payment found for this milestone");
      }

      const paymentDoc = paymentsQuery.docs[0];
      const paymentRef = doc(db, "payments", paymentDoc.id);
      const paymentData = paymentDoc.data();

      // Release payment from escrow to completed
      transaction.update(paymentRef, {
        status: "completed",
        completedAt: serverTimestamp(),
        "escrow.releasedAt": serverTimestamp(),
      });

      // Get a copy of all existing milestones
      const allMilestones = [...contractData.milestones];

      // Create timestamp outside of the array to avoid Firestore limitation
      const approvalTimestamp = new Date();

      // Update the completed milestone
      allMilestones[milestoneIndex] = {
        ...allMilestones[milestoneIndex],
        status: "completed",
        approvedAt: approvalTimestamp,
      };

      // Update the contract with all milestones intact
      transaction.update(contractRef, {
        milestones: allMilestones,
        updatedAt: serverTimestamp(),
      });

      // Calculate new progress
      const completedMilestones = contractData.milestones.filter(
        (m, idx) => idx <= milestoneIndex || m.status === "completed"
      ).length;
      const progress = Math.round(
        (completedMilestones / contractData.milestones.length) * 100
      );

      // Update contract progress
      transaction.update(contractRef, {
        progress: progress,
      });

      // Check if all milestones are complete
      const allCompleted =
        milestoneIndex === contractData.milestones.length - 1;

      if (allCompleted) {
        // Mark contract as completed
        transaction.update(contractRef, {
          status: "completed",
          completedAt: serverTimestamp(),
          progress: 100,
        });

        // Create contract completion event
        const contractCompletionRef = doc(collection(db, "contractEvents"));
        transaction.set(contractCompletionRef, {
          eventId: contractCompletionRef.id,
          contractId: contractId,
          eventType: "contract_completed",
          createdBy: clientId,
          userType: "client",
          comment: "All milestones completed successfully. Project complete.",
          metadata: {
            previousStatus: "active",
            newStatus: "completed",
            totalAmount: contractData.terms.amount,
            totalPaid: contractData.terms.amount,
            milestonesCompleted: contractData.milestones.length,
          },
          createdAt: serverTimestamp(),
        });

        // Create completion notifications for both parties
        const freelancerCompletionRef = doc(collection(db, "notifications"));
        transaction.set(freelancerCompletionRef, {
          notificationId: freelancerCompletionRef.id,
          userId: contractData.freelancerId,
          type: "contract_completed",
          title: "Contract Completed",
          message:
            "Congratulations! You have successfully completed the project.",
          data: {
            contractId: contractId,
            totalEarned: contractData.terms.amount * 0.9, // 90% after fees
            currency: contractData.terms.currency,
            nextAction: "request_review",
          },
          isRead: false,
          createdAt: serverTimestamp(),
        });

        const clientCompletionRef = doc(collection(db, "notifications"));
        transaction.set(clientCompletionRef, {
          notificationId: clientCompletionRef.id,
          userId: clientId,
          type: "contract_completed",
          title: "Project Completed",
          message: "Your project has been completed successfully.",
          data: {
            contractId: contractId,
            totalSpent: contractData.terms.amount,
            currency: contractData.terms.currency,
            nextAction: "leave_review",
          },
          isRead: false,
          createdAt: serverTimestamp(),
        });
      }

      // Create milestone approval and payment release event
      const eventRef = doc(collection(db, "contractEvents"));
      transaction.set(eventRef, {
        eventId: eventRef.id,
        contractId: contractId,
        milestoneId: milestoneId,
        eventType: "milestone_payment_released",
        createdBy: clientId,
        userType: "client",
        comment: comment || "Work approved and payment released.",
        amount: milestone.amount,
        currency: contractData.terms.currency,
        metadata: {
          previousMilestoneStatus: "in_review",
          newMilestoneStatus: "completed",
          paymentReleasedTo: contractData.freelancerId,
          netAmount: paymentData.amount.net,
        },
        createdAt: serverTimestamp(),
      });

      // Create notifications
      // For freelancer (payment received)
      const freelancerNotificationRef = doc(collection(db, "notifications"));
      transaction.set(freelancerNotificationRef, {
        notificationId: freelancerNotificationRef.id,
        userId: contractData.freelancerId,
        type: "payment_released",
        title: "Payment Released",
        message: `Your payment for ${milestone.title} has been released`,
        data: {
          contractId: contractId,
          milestoneId: milestoneId,
          amount: paymentData.amount.net,
          currency: contractData.terms.currency,
          milestoneTitle: milestone.title,
        },
        isRead: false,
        createdAt: serverTimestamp(),
      });

      // For client (confirmation)
      const clientNotificationRef = doc(collection(db, "notifications"));
      transaction.set(clientNotificationRef, {
        notificationId: clientNotificationRef.id,
        userId: clientId,
        type: "milestone_completed",
        title: "Milestone Completed",
        message: `${milestone.title} has been completed.`,
        data: {
          contractId: contractId,
          completedMilestone: milestone.title,
          ...(milestoneIndex < contractData.milestones.length - 1
            ? {
                nextMilestone:
                  contractData.milestones[milestoneIndex + 1].title,
                nextAction: "fund_next_milestone",
              }
            : {}),
        },
        isRead: false,
        createdAt: serverTimestamp(),
      });

      return {
        success: true,
        contractId: contractId,
        milestoneId: milestoneId,
        isContractCompleted: allCompleted,
      };
    });
  } catch (error) {
    console.error("Error approving milestone:", error);
    throw error;
  }
}

/**
 * Client requests revisions for a submitted milestone
 */
export async function requestMilestoneRevision(
  contractId,
  milestoneId,
  clientId,
  comment = ""
) {
  try {
    return await runTransaction(db, async (transaction) => {
      // Get the contract
      const contractRef = doc(db, "contracts", contractId);
      const contractSnap = await transaction.get(contractRef);

      if (!contractSnap.exists()) {
        throw new Error("Contract not found");
      }

      const contractData = contractSnap.data();

      // Verify the client is correct
      if (contractData.clientId !== clientId) {
        throw new Error(
          "Unauthorized: You are not the client of this contract"
        );
      }

      // Find the milestone
      const milestoneIndex = contractData.milestones.findIndex(
        (m) => m.id === milestoneId
      );
      if (milestoneIndex === -1) {
        throw new Error("Milestone not found");
      }

      const milestone = contractData.milestones[milestoneIndex];

      // Check milestone status is in_review
      if (milestone.status !== "in_review") {
        throw new Error(
          "Milestone must be in review status to request revisions"
        );
      }

      // Get a copy of all existing milestones
      const allMilestones = [...contractData.milestones];

      // Update only the specific milestone being rejected
      allMilestones[milestoneIndex] = {
        ...allMilestones[milestoneIndex],
        status: "active",
        revisionNotes: comment || "Please make requested changes",
        revisionRequestedAt: new Date(), // Use new Date() instead of serverTimestamp() to avoid Firebase array limitations
      };

      // Update the contract with all milestones intact
      transaction.update(contractRef, {
        milestones: allMilestones,
        updatedAt: serverTimestamp(),
      });

      // Create revision request event
      const eventRef = doc(collection(db, "contractEvents"));
      const revisionNotes = comment || "Please make requested changes";
      transaction.set(eventRef, {
        eventId: eventRef.id,
        contractId: contractId,
        milestoneId: milestoneId,
        eventType: "milestone_rejected",
        createdBy: clientId,
        userType: "client",
        comment: comment || "Revisions requested for this milestone",
        metadata: {
          previousStatus: "in_review",
          newStatus: "active",
          revisionNotes: revisionNotes,
          expectedRevisionTime: "As soon as possible",
          revisionRequestedAt: serverTimestamp(),
        },
        createdAt: serverTimestamp(),
      });

      // Create notification for freelancer
      const notificationRef = doc(collection(db, "notifications"));
      transaction.set(notificationRef, {
        notificationId: notificationRef.id,
        userId: contractData.freelancerId,
        type: "milestone_revision_requested",
        title: "Revisions Requested",
        message: `Client has requested revisions for ${milestone.title}`,
        data: {
          contractId: contractId,
          milestoneId: milestoneId,
          milestoneTitle: milestone.title,
          revisionNotes: revisionNotes,
          revisionRequestedAt: new Date().toISOString(), // Use ISO string for better client-side compatibility
        },
        isRead: false,
        createdAt: serverTimestamp(),
      });

      return {
        success: true,
        contractId: contractId,
        milestoneId: milestoneId,
      };
    });
  } catch (error) {
    console.error("Error requesting milestone revision:", error);
    throw error;
  }
}

/**
 * Open a dispute for a contract or milestone
 */
export async function openDispute(
  contractId,
  userId,
  userType,
  reason,
  milestoneId = null
) {
  try {
    return await runTransaction(db, async (transaction) => {
      // Get the contract
      const contractRef = doc(db, "contracts", contractId);
      const contractSnap = await transaction.get(contractRef);

      if (!contractSnap.exists()) {
        throw new Error("Contract not found");
      }

      const contractData = contractSnap.data();

      // Verify the user is involved in this contract
      if (
        contractData.clientId !== userId &&
        contractData.freelancerId !== userId
      ) {
        throw new Error("Unauthorized: You are not involved in this contract");
      }

      // Create dispute record
      const disputeRef = doc(collection(db, "disputes"));

      const disputeData = {
        disputeId: disputeRef.id,
        contractId: contractId,
        milestoneId: milestoneId,
        initiatedBy: userId,
        userType: userType, // 'client' or 'freelancer'
        status: "open",
        reason: reason,
        resolution: null,
        adminNotes: null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        resolvedAt: null,
      };

      transaction.set(disputeRef, disputeData);

      // Create dispute event
      const eventRef = doc(collection(db, "contractEvents"));
      transaction.set(eventRef, {
        eventId: eventRef.id,
        contractId: contractId,
        milestoneId: milestoneId,
        eventType: "dispute_opened",
        createdBy: userId,
        userType: userType,
        comment: reason || "Dispute opened",
        metadata: {
          disputeId: disputeRef.id,
          reason: reason,
        },
        createdAt: serverTimestamp(),
      });

      // Create notifications
      // Notify the other party
      const otherPartyId =
        userType === "client"
          ? contractData.freelancerId
          : contractData.clientId;
      const otherPartyNotificationRef = doc(collection(db, "notifications"));

      transaction.set(otherPartyNotificationRef, {
        notificationId: otherPartyNotificationRef.id,
        userId: otherPartyId,
        type: "dispute_opened",
        title: "Dispute Opened",
        message: `A dispute has been opened for ${
          milestoneId ? "a milestone in " : ""
        }your contract`,
        data: {
          contractId: contractId,
          milestoneId: milestoneId,
          disputeId: disputeRef.id,
          initiatedBy: userId,
          reason: reason,
        },
        isRead: false,
        createdAt: serverTimestamp(),
      });

      // Notify admin (using a special admin user ID or group)
      const adminNotificationRef = doc(collection(db, "notifications"));
      transaction.set(adminNotificationRef, {
        notificationId: adminNotificationRef.id,
        userId: "admin", // Special admin user or group ID
        type: "dispute_opened",
        title: "New Dispute",
        message: `A new dispute has been opened for contract ${contractId}`,
        data: {
          contractId: contractId,
          milestoneId: milestoneId,
          disputeId: disputeRef.id,
          initiatedBy: userId,
          initiatedByType: userType,
          reason: reason,
        },
        isRead: false,
        createdAt: serverTimestamp(),
      });

      return {
        success: true,
        contractId: contractId,
        disputeId: disputeRef.id,
      };
    });
  } catch (error) {
    console.error("Error opening dispute:", error);
    throw error;
  }
}

/**
 * Freelancer updates progress on a contract
 */
export async function updateContractProgress(
  contractId,
  freelancerId,
  progressValue,
  comment = ""
) {
  try {
    return await runTransaction(db, async (transaction) => {
      // Get the contract
      const contractRef = doc(db, "contracts", contractId);
      const contractSnap = await transaction.get(contractRef);

      if (!contractSnap.exists()) {
        throw new Error("Contract not found");
      }

      const contractData = contractSnap.data();

      // Verify the freelancer is correct
      if (contractData.freelancerId !== freelancerId) {
        throw new Error("Unauthorized: You are not assigned to this contract");
      }

      // Validate progress value
      const progress = Math.min(Math.max(0, progressValue), 100);

      // Update contract progress
      transaction.update(contractRef, {
        progress: progress,
        updatedAt: serverTimestamp(),
      });

      // Create progress update event
      const eventRef = doc(collection(db, "contractEvents"));
      transaction.set(eventRef, {
        eventId: eventRef.id,
        contractId: contractId,
        eventType: "progress_updated",
        createdBy: freelancerId,
        userType: "freelancer",
        comment: comment || `Progress updated to ${progress}%`,
        metadata: {
          previousProgress: contractData.progress,
          newProgress: progress,
        },
        createdAt: serverTimestamp(),
      });

      return {
        success: true,
        contractId: contractId,
        progress: progress,
      };
    });
  } catch (error) {
    console.error("Error updating progress:", error);
    throw error;
  }
}

/**
 * Helper function to get payment method display name
 */
function getPaymentMethodName(type) {
  switch (type) {
    case "mtn_momo":
      return "MTN Mobile Money";
    case "orange_momo":
      return "Orange Money";
    case "card":
      return "Card";
    case "paypal":
      return "PayPal";
    case "bank_transfer":
      return "Bank Transfer";
    default:
      return "Unknown";
  }
}
