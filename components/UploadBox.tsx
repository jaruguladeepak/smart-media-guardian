'use client';

import { useState } from 'react';
import { UploadCloud, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function UploadBox({ onUploadSuccess }: { onUploadSuccess?: (data: any) => void }) {
 const [isDragging, setIsDragging] = useState(false);
 const [isUploading, setIsUploading] = useState(false);

 const handleUpload = async (file: File) => {
 if (!file) return;

 setIsUploading(true);
 const toastId = toast.loading('Uploading media to Cloudinary...');

 const formData = new FormData();
 formData.append('file', file);

 try {
 const response = await fetch('/api/upload', {
 method: 'POST',
 body: formData,
 });

 if (!response.ok) {
 throw new Error('Upload failed');
 }

 const data = await response.json();
 toast.success('Upload successful! Media securely stored.', { id: toastId });
 if (onUploadSuccess) onUploadSuccess(data);
 } catch (error) {
 console.error(error);
 toast.error('Failed to upload media. Please check your credentials.', { id: toastId });
 } finally {
 setIsUploading(false);
 }
 };

 const onDragOver = (e: React.DragEvent) => {
 e.preventDefault();
 setIsDragging(true);
 };

 const onDragLeave = () => {
 setIsDragging(false);
 };

 const onDrop = (e: React.DragEvent) => {
 e.preventDefault();
 setIsDragging(false);
 if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
 handleUpload(e.dataTransfer.files[0]);
 }
 };

 const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
 if (e.target.files && e.target.files.length > 0) {
 handleUpload(e.target.files[0]);
 }
 };

 return (
 <div className="w-full mx-auto">
 <div
 className={`relative group border-2 border-dashed rounded-2xl p-16 text-center transition-all duration-300 ease-in-out ${
 isDragging
 ? 'border-indigo-500 bg-indigo-50/50 scale-[1.02]'
 : 'border-slate-300 hover:border-indigo-400 :border-indigo-500 hover:bg-slate-50/50 :bg-slate-100/50'
 }`}
 onDragOver={onDragOver}
 onDragLeave={onDragLeave}
 onDrop={onDrop}
 >
 <div className="flex flex-col items-center justify-center space-y-6 relative z-10">
 <div className={`p-5 rounded-full transition-colors duration-300 ${isDragging ? 'bg-indigo-100 text-indigo-600 ' : 'bg-slate-100 text-slate-500 group-hover:bg-indigo-50 :bg-indigo-900/30 group-hover:text-indigo-500'}`}>
 <UploadCloud className="w-10 h-10" />
 </div>
 
 <div>
 <h3 className="text-lg font-semibold text-slate-900 ">
 Drag & Drop Media
 </h3>
 <p className="text-sm text-slate-500 mt-1">
 or click to browse your files
 </p>
 </div>

 <label className="relative cursor-pointer mt-2">
 <input
 type="file"
 className="hidden"
 accept="image/*,video/*"
 onChange={onFileChange}
 disabled={isUploading}
 />
 <div className="inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-slate-900 text-sm font-medium rounded-xl transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed">
 {isUploading ? (
 <>
 <Loader2 className="w-5 h-5 mr-2 animate-spin" />
 Uploading securely...
 </>
 ) : (
 'Select Media File'
 )}
 </div>
 </label>
 </div>
 
 {/* Subtle background glow effect on hover */}
 <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500"></div>
 </div>
 </div>
 );
}
