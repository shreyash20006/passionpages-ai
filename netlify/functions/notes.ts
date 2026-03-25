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
        .from('saved_notes')
        .select('*')
        .eq('user_email', user.email)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return jsonResponse(200, data);
    } catch (error: any) {
      console.error("Error fetching notes:", error);
      return errorResponse(500, error.message);
    }
  }

  if (event.httpMethod === "POST") {
    try {
      const { title, data: noteData } = JSON.parse(event.body || "{}");

      const { data, error } = await supabase
        .from('saved_notes')
        .insert([{
          user_email: user.email,
          title,
          data: noteData,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;
      return jsonResponse(200, data);
    } catch (error: any) {
      console.error("Error saving note:", error);
      return errorResponse(500, error.message);
    }
  }

  if (event.httpMethod === "DELETE") {
    try {
      const id = event.queryStringParameters?.id;
      if (!id) return errorResponse(400, "Missing ID");

      const { error } = await supabase
        .from('saved_notes')
        .delete()
        .eq('id', id)
        .eq('user_email', user.email);

      if (error) throw error;
      return jsonResponse(200, { status: "success" });
    } catch (error: any) {
      console.error("Error deleting note:", error);
      return errorResponse(500, error.message);
    }
  }

  return errorResponse(405, "Method Not Allowed");
};
