import { Handler } from "@netlify/functions";
import { authenticateUser } from "./utils/auth";
import { jsonResponse, errorResponse } from "./utils/response";

export const handler: Handler = async (event, context) => {
  if (event.httpMethod !== "POST") {
    return errorResponse(405, "Method Not Allowed");
  }

  try {
    const { tierId, isYearly } = JSON.parse(event.body || "{}");

    // Try to get user if logged in (optional — allows guest checkout)
    let userId = "guest";
    try {
      const user = await authenticateUser(event);
      if (user && user.uid) userId = user.uid;
    } catch (_) {
      // Not logged in — allow anonymous pricing check
    }

    let price = 0;
    if (tierId === "pro") price = isYearly ? 799 : 99;
    if (tierId === "college") price = isYearly ? 49 * 12 : 49;

    if (price === 0) {
      return errorResponse(400, "Invalid plan selected");
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return errorResponse(500, "Razorpay keys are not configured in Netlify Environment Variables");
    }

    // Razorpay amount is in paise (1 INR = 100 paise)
    const amountInPaise = price * 100;

    const orderPayload = {
      amount: amountInPaise,
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
      notes: {
        userId: userId,
        tierId: tierId,
        isYearly: isYearly ? "true" : "false",
      },
    };

    // Make REST API call to Razorpay using Basic Auth
    const base64Auth = btoa(`${keyId}:${keySecret}`);

    const razorpayResponse = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${base64Auth}`,
      },
      body: JSON.stringify(orderPayload),
    });

    if (!razorpayResponse.ok) {
      const errorData = await razorpayResponse.text();
      console.error("Razorpay API Error:", errorData);
      return errorResponse(razorpayResponse.status, `Razorpay Error: ${errorData}`);
    }

    const orderData = await razorpayResponse.json();

    return jsonResponse(200, {
      id: orderData.id,
      amount: orderData.amount,
      currency: orderData.currency,
      keyId: keyId, // Send public key ID to frontend
    });

  } catch (error: any) {
    console.error("razorpay-order handler error:", error);
    return errorResponse(500, error.message || "Internal Server Error");
  }
};
