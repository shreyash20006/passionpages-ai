import { HandlerEvent } from "@netlify/functions";
import { admin } from "./firebase";

export const authenticateUser = async (event: HandlerEvent) => {
  const authHeader = event.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    return {
      uid: decodedToken.uid,
      email: decodedToken.email
    };
  } catch (error) {
    console.error("Error verifying Firebase token:", error);
    return null;
  }
};
