import { NextResponse } from 'next/server';

export async function POST(req: Request) {
 try {
 const body = await req.json();

 // Call the real Python ML backend
 // ML_API_URL is server-side only; NEXT_PUBLIC_ML_API_URL is a fallback for local dev
 const backendUrl = process.env.ML_API_URL || process.env.NEXT_PUBLIC_ML_API_URL || 'http://127.0.0.1:8000';
 const response = await fetch(`${backendUrl}/api/ml/analyze`, {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify(body)
 });

 if (!response.ok) {
 const errorText = await response.text();
 return NextResponse.json({ error: "Python backend failed", details: errorText }, { status: response.status });
 }

 const data = await response.json();
 return NextResponse.json({ intelligence: data });
 } catch (error) {
 return NextResponse.json({ error: "Failed to connect to Python backend" }, { status: 500 });
 }
}
