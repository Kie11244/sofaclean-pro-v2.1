import { NextResponse } from 'next/server';
import * as admin from 'firebase-admin';
import { getStorage } from 'firebase-admin/storage';
import { Readable } from 'stream';
import { projectId } from '@/lib/firebase-config';

// This is a robust way to initialize Firebase Admin SDK in a serverless environment
function initializeFirebaseAdmin() {
    if (!admin.apps.length) {
        try {
            admin.initializeApp({
                credential: admin.credential.applicationDefault(),
                storageBucket: `${projectId}.appspot.com`,
            });
             console.log("Firebase Admin SDK initialized.");
        } catch (error: any) {
            console.error("Firebase Admin SDK initialization error:", error.message);
            // We re-throw the error to be caught by the handler
            throw new Error(`Firebase admin initialization failed: ${error.message}`);
        }
    }
    return admin.app();
}


export async function POST(request: Request) {
    try {
        initializeFirebaseAdmin();
    } catch (initError: any) {
        console.error('Initialization failed in POST handler:', initError.message);
        return NextResponse.json({ success: false, error: initError.message }, { status: 500 });
    }

    try {
        const storage = getStorage();
        const bucket = storage.bucket();

        const formData = await request.formData();
        const files = formData.getAll('files') as File[];

        if (!files || files.length === 0) {
            return NextResponse.json({ success: true, urls: [] });
        }

        const uploadPromises = files.map(async (file) => {
            const safeFileName = `quote_images/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '')}`;
            const blob = bucket.file(safeFileName);

            const fileBuffer = Buffer.from(await file.arrayBuffer());
            
            return new Promise<string>((resolve, reject) => {
                const stream = blob.createWriteStream({
                    resumable: false,
                    contentType: file.type,
                });

                stream.on('error', (err) => {
                    console.error(`Error uploading ${file.name}:`, err);
                    reject(new Error(`Failed to upload ${file.name}: ${err.message}`));
                });

                stream.on('finish', () => {
                     const publicUrl = `https://storage.googleapis.com/${bucket.name}/${safeFileName}`;
                    resolve(publicUrl);
                });
                
                stream.end(fileBuffer);
            });
        });

        const urls = await Promise.all(uploadPromises);

        return NextResponse.json({ success: true, urls });
    } catch (error: any) {
        console.error('Failed to upload images:', error);
        return NextResponse.json({ success: false, error: error.message || 'Unknown upload error' }, { status: 500 });
    }
}
