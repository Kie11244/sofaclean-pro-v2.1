'use server';

import admin from 'firebase-admin';
import { projectId, storageBucket } from '@/lib/firebase-config';

// Function to initialize Firebase Admin SDK
const initializeFirebaseAdmin = () => {
    // Check if the app is already initialized to avoid errors
    if (admin.apps.length === 0) {
        try {
            admin.initializeApp({
                credential: admin.credential.applicationDefault(),
                storageBucket: storageBucket,
                projectId: projectId
            });
        } catch (error: any) {
            console.error("Firebase admin initialization error:", error.message);
            // In a serverless environment, sometimes an error is thrown even if the app is initialized.
            // We can check the error code to see if it's the "already-exists" error.
            if (error.code !== 'app/duplicate-app') {
                 throw new Error(`Firebase admin initialization failed: ${error.message}`);
            }
        }
    }
};


export async function uploadImageAction(formData: FormData) {
    try {
        initializeFirebaseAdmin();
    } catch (error: any) {
        console.error("Caught initialization error:", error.message);
        return { success: false, error: error.message };
    }


    const images = formData.getAll('images') as File[];

    if (!images || images.length === 0) {
        return { success: false, error: "No images found to upload." };
    }
    
    const bucket = admin.storage().bucket();
    const urls: string[] = [];

    try {
        for (const image of images) {
            const fileName = `quote_images/${Date.now()}_${image.name.replace(/[^a-zA-Z0-9._-]/g, '')}`;
            const file = bucket.file(fileName);
            const stream = file.createWriteStream({
                metadata: {
                    contentType: image.type,
                },
            });

            const buffer = Buffer.from(await image.arrayBuffer());
            
            await new Promise((resolve, reject) => {
                stream.on('error', (err) => {
                    console.error("Stream error:", err);
                    reject(err);
                });
                stream.on('finish', resolve);
                stream.end(buffer);
            });

            await file.makePublic();

            urls.push(file.publicUrl());
        }

        return { success: true, urls: urls };

    } catch (error: any) {
        console.error("Error in uploadImageAction:", error);
        return { success: false, error: error.message || "An unknown error occurred during upload." };
    }
}
