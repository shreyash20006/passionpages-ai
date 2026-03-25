import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    const serviceAccountStr = process.env.FIREBASE_SERVICE_ACCOUNT;
    if (serviceAccountStr) {
      const serviceAccount = JSON.parse(serviceAccountStr);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
    } else {
      console.warn("FIREBASE_SERVICE_ACCOUNT environment variable not set. Using default application credentials.");
      admin.initializeApp();
    }
  } catch (error) {
    console.error("Error initializing Firebase Admin:", error);
    admin.initializeApp();
  }
}

export { admin };
