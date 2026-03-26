import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    const serviceAccountStr = process.env.FIREBASE_SERVICE_ACCOUNT;
    if (serviceAccountStr) {
      const serviceAccount = JSON.parse(serviceAccountStr);
      admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
    } else {
      admin.initializeApp();
    }
  } catch (error) {
    console.error('Error initializing Firebase Admin:', error);
    try { admin.initializeApp(); } catch {}
  }
}

export const authenticateUser = async (req: any) => {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.split('Bearer ')[1];
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    return { uid: decoded.uid, email: decoded.email };
  } catch {
    return null;
  }
};
