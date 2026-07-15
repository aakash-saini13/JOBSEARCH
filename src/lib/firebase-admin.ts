import { initializeApp, getApps, applicationDefault } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

// Initialize Firebase Admin only once
if (!getApps().length) {
  try {
    initializeApp({
      credential: applicationDefault()
    });
  } catch (error) {
    console.warn("Could not initialize firebase-admin with application credentials. Please set GOOGLE_APPLICATION_CREDENTIALS or configure manually.", error);
  }
}

export const adminAuth = getApps().length > 0 ? getAuth() : null;
