/**
 * Mobile Money Payment Webhook Handlers
 *
 * This file implements webhook handlers for MTN Mobile Money and Orange Money payment callbacks
 */

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/firebase";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { ContractEvent, Payment } from "@/lib/types/contract.types";

/**
 * MTN Mobile Money webhook handler
 */
export async function handleMtnMomoWebhook(req: NextRequest) {
  try {
    // Verify the webhook signature from MTN
    const signature = req.headers.get("x-mtn-signature");
    if (!verifyMtnSignature(req, signature)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // Parse the webhook payload
    const data = await req.json();
    console.log("MTN MoMo webhook received:", data);

    const { paymentId, status, transactionId, amount, currency, phoneNumber } =
      data;

    if (!paymentId || !status) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Process the payment based on status
    if (status === "SUCCESSFUL") {
      await processSuccessfulPayment(paymentId, {
        provider: "mtn_momo",
        transactionId,
        amount,
        currency,
        phoneNumber,
      });

      return NextResponse.json({ success: true });
    } else if (status === "FAILED") {
      await processFailedPayment(paymentId, "Payment failed", {
        provider: "mtn_momo",
        transactionId,
        failureReason: data.failureReason || "Unknown reason",
      });

      return NextResponse.json({ success: true });
    } else {
      // Handle other statuses (pending, processing, etc.)
      console.log(`Payment ${paymentId} is in status: ${status}`);
      return NextResponse.json({ success: true });
    }
  } catch (error) {
    console.error("Error processing MTN MoMo webhook:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * Orange Money webhook handler
 */
export async function handleOrangeMoneyWebhook(req: NextRequest) {
  try {
    // Verify the webhook signature from Orange
    const signature = req.headers.get("x-orange-signature");
    if (!verifyOrangeSignature(req, signature)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // Parse the webhook payload
    const data = await req.json();
    console.log("Orange Money webhook received:", data);

    const { paymentId, status, transactionId, amount, currency, phoneNumber } =
      data;

    if (!paymentId || !status) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Process the payment based on status
    if (status === "SUCCESSFUL") {
      await processSuccessfulPayment(paymentId, {
        provider: "orange_momo",
        transactionId,
        amount,
        currency,
        phoneNumber,
      });

      return NextResponse.json({ success: true });
    } else if (status === "FAILED") {
      await processFailedPayment(paymentId, "Payment failed", {
        provider: "orange_momo",
        transactionId,
        failureReason: data.failureReason || "Unknown reason",
      });

      return NextResponse.json({ success: true });
    } else {
      // Handle other statuses (pending, processing, etc.)
      console.log(`Payment ${paymentId} is in status: ${status}`);
      return NextResponse.json({ success: true });
    }
  } catch (error) {
    console.error("Error processing Orange Money webhook:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * Process a successful payment by updating the payment record and sending notifications
 */
async function processSuccessfulPayment(
  paymentId: string,
  paymentDetails: any
) {
  try {
    // Get payment document
    const paymentRef = doc(db, "payments", paymentId);
    const paymentSnap = await getDoc(paymentRef);

    if (!paymentSnap.exists()) {
      throw new Error(`Payment ${paymentId} not found`);
    }

    const payment = paymentSnap.data() as Payment;

    // Check if payment is already processed
    if (payment.status === "escrowed") {
      console.log(`Payment ${paymentId} is already in escrowed state`);
      return;
    }

    // Get contract document
    const contractRef = doc(db, "contracts", payment.contractId);
    const contractSnap = await getDoc(contractRef);

    if (!contractSnap.exists()) {
      throw new Error(`Contract ${payment.contractId} not found`);
    }

    const contract = contractSnap.data();

    // Find the milestone
    const milestoneIndex = contract.milestones.findIndex(
      (m: any) => m.id === payment.milestoneId
    );
    if (milestoneIndex === -1) {
      throw new Error(`Milestone ${payment.milestoneId} not found in contract`);
    }

    // Update payment status to escrowed
    await updateDoc(paymentRef, {
      status: "escrowed",
      processedAt: serverTimestamp(),
      escrow: {
        releasedAt: null,
        releaseCondition: "milestone_completion_approval",
      },
      transactionId: paymentDetails.transactionId,
    });

    // Update milestone status to active
    await updateDoc(contractRef, {
      [`milestones.${milestoneIndex}.status`]: "active",
      updatedAt: serverTimestamp(),
    });

    // Create milestone funding event
    const eventRef = await addDoc(collection(db, "contractEvents"), {
      contractId: payment.contractId,
      milestoneId: payment.milestoneId,
      eventType: "milestone_funded",
      createdBy: payment.clientId,
      userType: "client",
      comment: `Milestone funded to escrow using ${getPaymentProviderName(
        paymentDetails.provider
      )}`,
      amount: payment.amount.gross,
      currency: payment.amount.currency,
      metadata: {
        paymentMethodType: paymentDetails.provider,
        escrowStatus: "secured",
        paymentId: paymentId,
        transactionId: paymentDetails.transactionId,
      },
      createdAt: serverTimestamp(),
    });

    // Create notifications for both parties
    // For freelancer
    await addDoc(collection(db, "notifications"), {
      userId: payment.freelancerId,
      type: "milestone_funded",
      title: "Milestone Funded",
      message: `A milestone in your contract has been funded. You can now start working.`,
      data: {
        contractId: payment.contractId,
        milestoneId: payment.milestoneId,
        amount: payment.amount.gross,
        currency: payment.amount.currency,
      },
      isRead: false,
      createdAt: serverTimestamp(),
    });

    // For client (confirmation)
    await addDoc(collection(db, "notifications"), {
      userId: payment.clientId,
      type: "payment_processed",
      title: "Payment Processed",
      message:
        "Your payment has been secured in escrow. Work will begin shortly.",
      data: {
        contractId: payment.contractId,
        milestoneId: payment.milestoneId,
        amount: payment.amount.gross,
        currency: payment.amount.currency,
        status: "escrowed",
      },
      isRead: false,
      createdAt: serverTimestamp(),
    });

    return {
      success: true,
      paymentId,
      contractId: payment.contractId,
      milestoneId: payment.milestoneId,
    };
  } catch (error) {
    console.error("Error processing successful payment:", error);
    throw error;
  }
}

/**
 * Process a failed payment by updating the payment record and sending notifications
 */
async function processFailedPayment(
  paymentId: string,
  reason: string,
  details: any
) {
  try {
    // Get payment document
    const paymentRef = doc(db, "payments", paymentId);
    const paymentSnap = await getDoc(paymentRef);

    if (!paymentSnap.exists()) {
      throw new Error(`Payment ${paymentId} not found`);
    }

    const payment = paymentSnap.data() as Payment;

    // Update payment status to failed
    await updateDoc(paymentRef, {
      status: "failed",
      failureReason: reason,
      failureDetails: details,
      processedAt: serverTimestamp(),
    });

    // Create payment failure event
    const eventRef = await addDoc(collection(db, "contractEvents"), {
      contractId: payment.contractId,
      milestoneId: payment.milestoneId,
      eventType: "payment_failed",
      createdBy: payment.clientId,
      userType: "client",
      comment: `Payment failed: ${reason}`,
      amount: payment.amount.gross,
      currency: payment.amount.currency,
      metadata: {
        paymentMethodType: payment.paymentMethod.type,
        failureReason: reason,
        failureDetails: details,
      },
      createdAt: serverTimestamp(),
    });

    // Notify client about payment failure
    await addDoc(collection(db, "notifications"), {
      userId: payment.clientId,
      type: "payment_failed",
      title: "Payment Failed",
      message: `Your payment for the milestone could not be processed. Reason: ${reason}`,
      data: {
        contractId: payment.contractId,
        milestoneId: payment.milestoneId,
        amount: payment.amount.gross,
        currency: payment.amount.currency,
        failureReason: reason,
        action: "retry_payment",
      },
      isRead: false,
      createdAt: serverTimestamp(),
    });

    return {
      success: true,
      paymentId,
      status: "failed",
    };
  } catch (error) {
    console.error("Error processing failed payment:", error);
    throw error;
  }
}

/**
 * Verify MTN Mobile Money webhook signature
 */
function verifyMtnSignature(
  req: NextRequest,
  signature: string | null
): boolean {
  // In a production environment, implement proper signature verification
  // This would typically involve checking the signature against the request body
  // using a shared secret or public key from MTN

  // For development, return true
  return true;
}

/**
 * Verify Orange Money webhook signature
 */
function verifyOrangeSignature(
  req: NextRequest,
  signature: string | null
): boolean {
  // In a production environment, implement proper signature verification
  // This would typically involve checking the signature against the request body
  // using a shared secret or public key from Orange

  // For development, return true
  return true;
}

/**
 * Get payment provider display name
 */
function getPaymentProviderName(provider: string): string {
  switch (provider) {
    case "mtn_momo":
      return "MTN Mobile Money";
    case "orange_momo":
      return "Orange Money";
    default:
      return provider;
  }
}
