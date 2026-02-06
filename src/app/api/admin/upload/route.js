import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { put } from '@vercel/blob';

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export async function POST(request) {
  try {
    const req = await request;
    const token = req.cookies?.get('adminToken')?.value;
    if (!token || !(await verifyToken(token))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.error('BLOB_READ_WRITE_TOKEN is not set');
      return NextResponse.json(
        { error: 'File storage is not configured on the server' },
        { status: 500 }
      );
    }

    const formData = await req.formData();
    const file = formData.get('file');

    if (!file || typeof file === 'string') {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Basic validation
    const fileSize = file.size ?? 0;
    const fileType = file.type || '';

    if (!fileType.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Only image uploads are allowed' },
        { status: 400 }
      );
    }

    if (fileSize > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { error: 'File is too large. Maximum size is 5MB.' },
        { status: 400 }
      );
    }

    const safeName = file.name?.replace?.(/[^a-zA-Z0-9_.-]/g, '_') || 'upload';

    const blob = await put(safeName, file, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    return NextResponse.json(
      { message: 'File uploaded successfully', url: blob.url },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
