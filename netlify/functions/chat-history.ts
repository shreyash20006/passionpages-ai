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
        .from('chat_messages')
        .select('*')
        .eq('user_email', user.email)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return jsonResponse(200, data);
    } catch (error: any) {
      console.error("Error fetching chat history:", error);
      return errorResponse(500, error.message);
    }
  }

  if (event.httpMethod === "POST") {
    try {
      const { role, content } = JSON.parse(event.body || "{}");

      const { data, error } = await supabase
        .from('chat_messages')
        .insert([{
          user_email: user.email,
          role,
          content,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;
      return jsonResponse(200, data);
    } catch (error: any) {
      console.error("Error saving chat message:", error);
      return errorResponse(500, error.message);
    }
  }

  return errorResponse(405, "Method Not Allowed");
};
