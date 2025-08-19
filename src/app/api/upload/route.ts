import { NextResponse } from 'next/server';
import { adminStorage } from '@/lib/firebase-admin';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
    }

    // Convert file to buffer
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    
    const bucket = adminStorage.bucket();
    const fileName = `quotes/${uuidv4()}-${file.name}`;
    const fileUpload = bucket.file(fileName);

    await fileUpload.save(fileBuffer, {
      metadata: {
        contentType: file.type,
      },
    });

    // Make the file public and get the URL
    await fileUpload.makePublic();
    const publicUrl = fileUpload.publicUrl();

    return NextResponse.json({ url: publicUrl }, { status: 200 });
  } catch (error) {
    console.error('Error uploading file:', error);
    // It's good practice to check the error type
    if (error instanceof Error) {
        // Handle specific Firebase Admin SDK errors if needed
        if ('code' in error && error.code === 'storage/unauthorized') {
             return NextResponse.json({ error: 'Firebase Storage: Unauthorized access. Check server credentials and permissions.' }, { status: 500 });
        }
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unknown error occurred during file upload.' }, { status: 500 });
  }
}
