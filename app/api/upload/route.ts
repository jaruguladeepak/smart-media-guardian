import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

cloudinary.config({
 cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
 api_key: process.env.CLOUDINARY_API_KEY,
 api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
 try {
 const formData = await request.formData();
 const file = formData.get('file') as File;
 
 if (!file) {
 return NextResponse.json({ error: 'No file provided' }, { status: 400 });
 }

 // Production Security: Validate file type and size
 const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm'];
 if (!allowedTypes.includes(file.type)) {
 return NextResponse.json({ error: 'Unsupported file type. Only standard images and videos are allowed.' }, { status: 400 });
 }

 const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
 if (file.size > MAX_FILE_SIZE) {
 return NextResponse.json({ error: 'File size exceeds 50MB limit.' }, { status: 400 });
 }

 const bytes = await file.arrayBuffer();
 const buffer = Buffer.from(bytes);

 // Upload to Cloudinary
 const uploadResult = await new Promise((resolve, reject) => {
 const uploadStream = cloudinary.uploader.upload_stream(
 {
 folder: 'smart-media-guardian',
 resource_type: 'auto', // Handle both images and videos
 },
 (error, result) => {
 if (error) reject(error);
 else resolve(result);
 }
 );
 
 uploadStream.end(buffer);
 });

 return NextResponse.json(uploadResult);
 } catch (error) {
 console.error('Upload error:', error);
 return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
 }
}
