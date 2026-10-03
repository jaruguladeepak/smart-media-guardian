import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
 cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
 api_key: process.env.CLOUDINARY_API_KEY,
 api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET() {
 try {
 if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
 return NextResponse.json({
 status: 'error',
 message: 'Cloudinary credentials missing in environment variables',
 }, { status: 500 });
 }

 // Ping Cloudinary API
 const pingResult = await cloudinary.api.ping();

 return NextResponse.json({
 status: 'live',
 ping: pingResult,
 });
 } catch (error: any) {
 console.error('Cloudinary Health Check Error:', error);
 return NextResponse.json({
 status: 'error',
 message: error.message || 'Failed to connect to Cloudinary',
 }, { status: 500 });
 }
}
