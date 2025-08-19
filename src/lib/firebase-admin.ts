// This file is for SERVER-SIDE Admin SDK initialization

import admin from 'firebase-admin';
import { projectId, storageBucket } from './firebase-config';

// Define the shape of your service account credentials
interface ServiceAccount {
  type: string;
  project_id: string;
  private_key_id: string;
  private_key: string;
  client_email: string;
  client_id: string;
  auth_uri: string;
  token_uri: string;
  auth_provider_x509_cert_url: string;
  client_x509_cert_url: string;
  universe_domain: string;
}

// Function to safely parse the service account JSON
const getServiceAccount = (): ServiceAccount | undefined => {
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!serviceAccountJson) {
    console.warn(
      'Firebase Admin SDK: FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set. ' +
      'Using default credentials. This is expected for local development but required for production.'
    );
    return undefined;
  }
  try {
    return JSON.parse(serviceAccountJson);
  } catch (error) {
    console.error('Error parsing FIREBASE_SERVICE_ACCOUNT_KEY:', error);
    return undefined;
  }
};

const serviceAccount = getServiceAccount();

if (!admin.apps.length) {
  admin.initializeApp({
    // Use the parsed service account if available, otherwise use default credentials
    credential: serviceAccount ? admin.credential.cert(serviceAccount) : admin.credential.applicationDefault(),
    storageBucket: storageBucket,
    projectId: projectId,
  });
}

export const adminDb = admin.firestore();
export const adminStorage = admin.storage();
