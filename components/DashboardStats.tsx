import { MediaData } from '@/lib/types';
import { BarChart, Image as ImageIcon, Video, ShieldAlert } from 'lucide-react';

interface DashboardStatsProps {
 mediaList: MediaData[];
}

export default function DashboardStats({ mediaList }: DashboardStatsProps) {
 const total = mediaList.length;
 if (total === 0) return null;

 const images = mediaList.filter(m => m.resourceType === 'image').length;
 const videos = mediaList.filter(m => m.resourceType === 'video').length;
 const flagged = mediaList.filter(m => m.moderation?.status === 'flagged' || m.moderation?.status === 'rejected').length;
 const safe = mediaList.filter(m => m.moderation?.status === 'safe').length;

 // Calculate tag frequencies
 const tagCounts: Record<string, number> = {};
 mediaList.forEach(m => {
 m.tags?.forEach(tag => {
 tagCounts[tag] = (tagCounts[tag] || 0) + 1;
 });
 });

 const popularTags = Object.entries(tagCounts)
 .sort((a, b) => b[1] - a[1])
 .slice(0, 5);

 const calculateWidth = (count: number, max: number) => {
 if (max === 0) return '0%';
 return `${Math.max((count / max) * 100, 2)}%`;
 };

 return (
 <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-8">
 <div className="flex items-center mb-6">
 <BarChart className="w-5 h-5 text-indigo-500 mr-2" />
 <h2 className="text-lg font-semibold text-slate-900 ">Platform Analytics</h2>
 </div>

 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
 <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 ">
 <p className="text-sm text-slate-500 mb-1">Total Media</p>
 <p className="text-2xl font-bold text-slate-900 ">{total}</p>
 </div>
 <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 ">
 <p className="text-sm text-slate-500 mb-1 flex items-center">
 <ImageIcon className="w-4 h-4 mr-1" /> Images
 </p>
 <p className="text-2xl font-bold text-slate-900 ">{images}</p>
 </div>
 <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 ">
 <p className="text-sm text-slate-500 mb-1 flex items-center">
 <Video className="w-4 h-4 mr-1" /> Videos
 </p>
 <p className="text-2xl font-bold text-slate-900 ">{videos}</p>
 </div>
 <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 ">
 <p className="text-sm text-slate-500 mb-1 flex items-center text-red-500">
 <ShieldAlert className="w-4 h-4 mr-1" /> Flagged
 </p>
 <p className="text-2xl font-bold text-slate-900 ">{flagged}</p>
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
 <div className="space-y-4">
 <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">Media Types</h3>
 <div>
 <div className="flex justify-between text-sm mb-1">
 <span className="text-slate-700 ">Images</span>
 <span className="font-medium">{images}</span>
 </div>
 <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
 <div className="h-full bg-blue-500 rounded-full" style={{ width: calculateWidth(images, total) }}></div>
 </div>
 </div>
 <div>
 <div className="flex justify-between text-sm mb-1">
 <span className="text-slate-700 ">Videos</span>
 <span className="font-medium">{videos}</span>
 </div>
 <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
 <div className="h-full bg-purple-500 rounded-full" style={{ width: calculateWidth(videos, total) }}></div>
 </div>
 </div>

 <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mt-6 mb-2">Moderation Safety</h3>
 <div>
 <div className="flex justify-between text-sm mb-1">
 <span className="text-slate-700 ">Safe</span>
 <span className="font-medium text-green-600">{safe}</span>
 </div>
 <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
 <div className="h-full bg-green-500 rounded-full" style={{ width: calculateWidth(safe, total) }}></div>
 </div>
 </div>
 <div>
 <div className="flex justify-between text-sm mb-1">
 <span className="text-slate-700 ">Flagged</span>
 <span className="font-medium text-red-600">{flagged}</span>
 </div>
 <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
 <div className="h-full bg-red-500 rounded-full" style={{ width: calculateWidth(flagged, total) }}></div>
 </div>
 </div>
 </div>

 <div>
 <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-4">Popular AI Tags</h3>
 {popularTags.length > 0 ? (
 <div className="space-y-3">
 {popularTags.map(([tag, count]) => (
 <div key={tag}>
 <div className="flex justify-between text-sm mb-1">
 <span className="text-slate-700 ">{tag}</span>
 <span className="text-slate-500">{count}</span>
 </div>
 <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
 <div className="h-full bg-indigo-500 rounded-full opacity-80" style={{ width: calculateWidth(count, popularTags[0][1]) }}></div>
 </div>
 </div>
 ))}
 </div>
 ) : (
 <div className="text-sm text-slate-500 italic py-4">No tags analyzed yet.</div>
 )}
 </div>
 </div>
 </div>
 );
}
