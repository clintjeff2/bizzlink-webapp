import { NextRequest } from "next/server";
import { handleMtnMomoWebhook } from "@/app/api/webhooks/mobile-money";

// MTN Mobile Money webhook handler
export async function POST(req: NextRequest) {
  return handleMtnMomoWebhook(req);
}

// Allow GET requests for webhook testing
export async function GET() {
  return new Response(
    JSON.stringify({
      status: "alive",
      message: "MTN Mobile Money webhook endpoint is operational",
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}
