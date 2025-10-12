import { NextRequest } from "next/server";
import { handleOrangeMoneyWebhook } from "@/app/api/webhooks/mobile-money";

// Orange Money webhook handler
export async function POST(req: NextRequest) {
  return handleOrangeMoneyWebhook(req);
}

// Allow GET requests for webhook testing
export async function GET() {
  return new Response(
    JSON.stringify({
      status: "alive",
      message: "Orange Money webhook endpoint is operational",
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}
