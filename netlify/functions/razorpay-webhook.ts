import { Handler } from "@netlify/functions";
import { jsonResponse, errorResponse } from "./utils/response";
import { supabaseClient } from "./utils/supabase";
const crypto = require("crypto");

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return errorResponse(405, "Method Not Allowed");
  }

  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  
  // Verify the webhook signature
  if (webhookSecret) {
    const signature = event.headers["x-razorpay-signature"];
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(event.body || "")
      .digest("hex");

    if (signature !== expectedSignature) {
      console.error("Webhook signature mismatch.");
      return errorResponse(400, "Invalid signature");
    }
  }

  try {
    const payload = JSON.parse(event.body || "{}");
    const eventName = payload.event;
    
    // We only care about successful payments
    if (eventName === "payment.captured" || eventName === "order.paid") {
      const entity = payload.payload.payment?.entity || payload.payload.order?.entity;
      
      // Extract the notes attached to the order
      const notes = entity?.notes || {};
      const { userId, tierId, isYearly } = notes;

      if (!userId) {
        console.error("Success event without a userId in notes!");
        return jsonResponse(200, { message: "Ignored - no userId" });
      }

      console.log(\`Upgrading user \${userId} to \${tierId}\`);

      // Update the user's subscription in Supabase
      const { error } = await supabaseClient
        .from("subscriptions")
        .upsert({
          id: userId, // Using userId as primary key or linked ID
          user_id: userId,
          tier_id: tierId,
          is_yearly: isYearly === "true",
          status: "active",
          updated_at: new Date().toISOString()
        });
        
      if (error) {
        console.error("Error upgrading user in DB:", error);
      }
    }

    return jsonResponse(200, { status: "ok" });
  } catch (error: any) {
    console.error("Webhook Error:", error);
    return errorResponse(500, "Internal Server Error");
  }
};
