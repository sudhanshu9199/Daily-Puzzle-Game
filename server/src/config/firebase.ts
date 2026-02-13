import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

// In production, use environment variables for your service account!
// For local dev, you can point to a service-account.json file
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

export const firebaseAdmin = admin;