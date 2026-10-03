import { useMemo, useState } from 'react';
import { useAppStore } from '@/lib/store';
import { AlertTriangle, Trash2, FileWarning, Search, ShieldAlert, Sparkles, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import { MediaData } from '@/lib/types';
import MediaCard from './MediaCard';

export default function CleanupCenter() {
 const { uploadedMedia, mediaMetadata } = useAppStore();
 const [activeTab, setActiveTab] = useState<'duplicates' | 'unoptimized' | 'metadata'>('duplicates');

 // Basic duplicate detection: Group by exact size + format for a hackathon demo
 // In a real app, you'd use pHash or ETag
 const duplicates = useMemo(() => {
 const groups: Record<string, MediaData[]> = {};
 uploadedMedia.forEach(m => {
 // Deterministic signature based on size and dimension + format
 const signature = `${m.bytes}-${m.width}x${m.height}-${m.format}`;
 if (!groups[signature]) groups[signature] = [];
 groups[signature].push(m);
 });
 
 // Return only groups with > 1 item
 return Object.values(groups).filter(g => g.length > 1);
 }, [uploadedMedia]);

 const unoptimized = useMemo(() => {
 return uploadedMedia.filter(m => m.format !== 'webp' && m.format !== 'avif' && m.format !== 'mp4');
 }, [uploadedMedia]);

 const missingMetadata = useMemo(() => {
 return uploadedMedia.filter(m => {
 const meta = mediaMetadata[m.publicId];
 return (!m.tags || m.tags.length === 0) && (!meta || meta.customTags.length === 0);
 });
 }, [uploadedMedia, mediaMetadata]);

 return (
 <div className="animate-in fade-in duration-300 pb-20">
 <div className="mb-6">
 <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-2 flex items-center gap-2">
 <AlertTriangle className="w-6 h-6 text-amber-500" />
 Media Cleanup Center
 </h1>
 <p className="text-slate-500">Detect duplicates, find unoptimized assets, and fix missing metadata.</p>
 </div>

 <div className="flex space-x-2 mb-8 bg-white p-1 rounded-xl border border-slate-200 shadow-sm w-fit">
 <button
 onClick={() => setActiveTab('duplicates')}
 className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'duplicates' ? 'bg-amber-100 text-amber-700 ' : 'text-slate-600 hover:bg-slate-50 :bg-slate-800'}`}
 >
 <ImageIcon className="w-4 h-4 mr-2" />
 Duplicates <span className="ml-2 bg-white px-1.5 py-0.5 rounded text-xs">{duplicates.length}</span>
 </button>
 <button
 onClick={() => setActiveTab('unoptimized')}
 className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'unoptimized' ? 'bg-amber-100 text-amber-700 ' : 'text-slate-600 hover:bg-slate-50 :bg-slate-800'}`}
 >
 <FileWarning className="w-4 h-4 mr-2" />
 Unoptimized <span className="ml-2 bg-white px-1.5 py-0.5 rounded text-xs">{unoptimized.length}</span>
 </button>
 <button
 onClick={() => setActiveTab('metadata')}
 className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'metadata' ? 'bg-amber-100 text-amber-700 ' : 'text-slate-600 hover:bg-slate-50 :bg-slate-800'}`}
 >
 <Search className="w-4 h-4 mr-2" />
 Missing Tags <span className="ml-2 bg-white px-1.5 py-0.5 rounded text-xs">{missingMetadata.length}</span>
 </button>
 </div>

 <div className="space-y-6">
 {activeTab === 'duplicates' && (
 <div>
 {duplicates.length > 0 ? (
 <div className="space-y-8">
 {duplicates.map((group, idx) => (
 <div key={idx} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
 <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100 ">
 <h3 className="font-semibold text-slate-800 flex items-center">
 <ImageIcon className="w-5 h-5 mr-2 text-amber-500" />
 Potential Duplicate Set #{idx + 1}
 </h3>
 <span className="text-sm text-slate-500">{(group[0].bytes / 1024).toFixed(1)} KB • {group[0].format}</span>
 </div>
 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
 {group.map((media) => (
 <div key={media.publicId} className="relative group">
 <MediaCard 
 media={media} 
 isSelected={false} 
 />
 <button className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600">
 <Trash2 className="w-4 h-4" />
 </button>
 </div>
 ))}
 </div>
 </div>
 ))}
 </div>
 ) : (
 <div className="py-20 text-center bg-white rounded-2xl border border-slate-200 ">
 <ShieldAlert className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
 <h3 className="text-lg font-medium text-slate-900 mb-2">No duplicates found</h3>
 <p className="text-slate-500">Your media library is clean and deduplicated.</p>
 </div>
 )}
 </div>
 )}

 {activeTab === 'unoptimized' && (
 <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
 {unoptimized.length > 0 ? unoptimized.map(media => (
 <MediaCard 
 key={media.publicId}
 media={media} 
 isSelected={false} 
 />
 )) : (
 <div className="col-span-full py-20 text-center bg-white rounded-2xl border border-slate-200 ">
 <Sparkles className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
 <h3 className="text-lg font-medium text-slate-900 mb-2">Fully Optimized</h3>
 <p className="text-slate-500">All your media is in modern, optimized formats.</p>
 </div>
 )}
 </div>
 )}

 {activeTab === 'metadata' && (
 <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
 {missingMetadata.length > 0 ? missingMetadata.map(media => (
 <MediaCard 
 key={media.publicId}
 media={media} 
 isSelected={false} 
 />
 )) : (
 <div className="col-span-full py-20 text-center bg-white rounded-2xl border border-slate-200 ">
 <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
 <h3 className="text-lg font-medium text-slate-900 mb-2">Metadata Complete</h3>
 <p className="text-slate-500">All your media has been tagged and analyzed.</p>
 </div>
 )}
 </div>
 )}
 </div>
 </div>
 );
}
