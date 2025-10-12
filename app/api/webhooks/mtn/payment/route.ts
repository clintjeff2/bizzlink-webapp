import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

/**
 * MTN Mobile Money payment initiation API
 */
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { amount, currency, phone, description, contractId, milestoneId } =
      data;

    if (!amount || !phone || !contractId || !milestoneId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // In a real implementation, this would call the MTN Mobile Money API
    // For this mockup, we'll simulate a successful transaction

    // Generate a mock transaction ID
    const transactionId = `mtn_${uuidv4()}`;

    // Normally we would send a payment request to MTN here
    // And return a pending status with a reference

    return NextResponse.json({
      success: true,
      message: "Payment request initiated successfully",
      transactionId: transactionId,
      status: "pending",
      provider: "mtn_momo",
      amount,
      currency,
      phone,
      contractId,
      milestoneId,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Error processing MTN payment:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process payment" },
      { status: 500 }
    );
  }
}
