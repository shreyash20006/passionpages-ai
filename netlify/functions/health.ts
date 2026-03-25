import { Handler } from "@netlify/functions";
import { jsonResponse } from "./utils/response";

export const handler: Handler = async (event, context) => {
  return jsonResponse(200, { status: "ok" });
};
