import { Handler } from "@netlify/functions";
import { authenticateUser } from "./utils/auth";
import { jsonResponse, errorResponse } from "./utils/response";
import { supabase } from "./utils/supabase";

export const handler: Handler = async (event, context) => {
  const user = await authenticateUser(event);
  if (!user) {
    return errorResponse(401, "Unauthorized");
  }

  if (event.httpMethod === "GET") {
    try {
      const { data, error } = await supabase
        .from('api_keys')
        .select('provider, api_key')
        .eq('user_email', user.email);

      if (error) throw error;

      const keys: Record<string, string> = {};
      data.forEach(item => {
        keys[item.provider] = item.api_key;
      });

      return jsonResponse(200, keys);
    } catch (error: any) {
      console.error("Error fetching keys from Supabase:", error);
      return errorResponse(500, error.message);
    }
  }

  if (event.httpMethod === "POST") {
    try {
      const { keys } = JSON.parse(event.body || "{}");
      
      const upsertData = Object.entries(keys).map(([provider, api_key]) => ({
        user_email: user.email,
        provider,
        api_key,
        created_at: new Date().toISOString()
      }));

      const { error } = await supabase
        .from('api_keys')
        .upsert(upsertData, { onConflict: 'user_email,provider' });

      if (error) throw error;

      return jsonResponse(200, { status: "success" });
    } catch (error: any) {
      console.error("Error saving keys to Supabase:", error);
      return errorResponse(500, error.message);
    }
  }

  return errorResponse(405, "Method Not Allowed");
};
