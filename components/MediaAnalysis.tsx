import { useState } from 'react';
import { MediaData } from '@/lib/types';
import TagList from './TagList';
import ModerationBadge from './ModerationBadge';
import { Loader2, Sparkles, FileText, Activity, Zap, Star, Plus, X, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { useAppStore } from '@/lib/store';

interface MediaAnalysisProps {
 media: MediaData;
 onUpdate: (updatedMedia: MediaData) => void;
}

export default function MediaAnalysis({ media, onUpdate }: MediaAnalysisProps) {
 const [isAnalyzing, setIsAnalyzing] = useState(false);
 const { mediaMetadata, toggleFavorite, addCustomTag, removeCustomTag, activities, addActivity } = useAppStore();
 const currentMetadata = mediaMetadata[media.publicId] || { customTags: [], isFavorite: false };
 const [newTag, setNewTag] = useState('');

 const handleAnalyze = async () => {
 setIsAnalyzing(true);
 const toastId = toast.loading('Running AI analysis...');
 
 try {
 const response = await fetch(`/api/analyze`, {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({ publicId: media.publicId, resourceType: media.resourceType }),
 });
 
 if (!response.ok) throw new Error('Analysis failed');
 const data = await response.json();
 
 onUpdate({
 ...media,
 tags: data.tags,
 moderation: data.moderation,
 metadata: data.metadata,
 });
 
 addActivity({
 publicId: media.publicId,
 type: 'ANALYSIS',
 description: 'AI analysis completed',
 });
 
 toast.success('Analysis complete!', { id: toastId });
 } catch (error) {
 console.error(error);
 toast.error('AI analysis failed. Please try again.', { id: toastId });
 } finally {
 setIsAnalyzing(false);
 }
 };


 const handleAddTag = (e: React.FormEvent) => {
 e.preventDefault();
 if (newTag.trim()) {
 addCustomTag(media.publicId, newTag.trim().toLowerCase());
 setNewTag('');
 }
 };

 const hasAnalysis = media.tags !== undefined || media.moderation !== undefined;
 // Filter activities relevant to this media item
 const mediaActivities = activities.filter(a => a.publicId === media.publicId);

 return (
 <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
 <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50 ">
 <h3 className="font-semibold flex items-center text-slate-900 ">
 <Activity className="w-5 h-5 mr-2 text-blue-500" />
 Media Intelligence
 </h3>
 {!hasAnalysis && (
 <button
 onClick={handleAnalyze}
 disabled={isAnalyzing}
 className="inline-flex items-center px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-slate-900 text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
 >
 {isAnalyzing ? (
 <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
 ) : (
 <Sparkles className="w-4 h-4 mr-1.5" />
 )}
 Run AI Analysis
 </button>
 )}
 </div>

 <div className="p-5 space-y-6">
 <div>
 <div className="flex items-center justify-between mb-3">
 <h4 className="text-sm font-medium text-slate-500 uppercase tracking-wider flex items-center">
 <Sparkles className="w-4 h-4 mr-2" /> AI Tags
 </h4>
 {media.metadata?.source ? (
 <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${
 media.metadata.source === 'LIVE' ? 'bg-emerald-50 text-emerald-600 border-emerald-200 ' :
 media.metadata.source === 'NOT_CONFIGURED' ? 'bg-amber-50 text-amber-600 border-amber-200 ' :
 'bg-slate-100 text-slate-500 border-slate-200 '
 }`}>
 {media.metadata.source.replace('_', ' ')}
 </span>
 ) : (
 <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-500 border border-slate-200 ">UNPROCESSED</span>
 )}
 </div>
 {hasAnalysis ? (
 <TagList tags={media.tags || []} />
 ) : (
 <p className="text-sm text-slate-500 italic">Run analysis to generate tags</p>
 )}
 </div>

 {/* Custom Tags Section */}
 <div>
 <h4 className="text-sm font-medium text-slate-500 mb-3 uppercase tracking-wider flex items-center">
 My Tags
 </h4>
 <div className="flex flex-wrap gap-2 mb-3">
 {currentMetadata.customTags.map(tag => (
 <span key={tag} className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 border border-indigo-200 transition-colors">
 {tag}
 <button onClick={() => removeCustomTag(media.publicId, tag)} className="ml-1.5 hover:text-indigo-900 :text-indigo-100 focus:outline-none">
 <X className="w-3 h-3" />
 </button>
 </span>
 ))}
 </div>
 <form onSubmit={handleAddTag} className="flex gap-2">
 <input 
 type="text" 
 value={newTag}
 onChange={(e) => setNewTag(e.target.value)}
 placeholder="Add custom tag..." 
 className="flex-1 text-sm bg-white border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
 />
 <button type="submit" disabled={!newTag.trim()} className="p-1.5 bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 :bg-indigo-900/30 :text-indigo-400 rounded-lg transition-colors disabled:opacity-50">
 <Plus className="w-4 h-4" />
 </button>
 </form>
 </div>

 {/* Favorite Button */}
 <div>
 <button 
 onClick={() => toggleFavorite(media.publicId)}
 className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border font-medium transition-all ${currentMetadata.isFavorite ? 'bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100 ' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 :bg-slate-100'}`}
 >
 <Star className={`w-4 h-4 ${currentMetadata.isFavorite ? 'fill-current' : ''}`} /> 
 {currentMetadata.isFavorite ? 'Favorited' : 'Add to Favorites'}
 </button>
 </div>

 <div className="grid grid-cols-2 gap-6">
 <div>
 <div className="flex items-center justify-between mb-3">
 <h4 className="text-sm font-medium text-slate-500 uppercase tracking-wider">
 Moderation
 </h4>
 <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-500 border border-slate-200">Demo / Local</span>
 </div>
 {hasAnalysis ? (
 <ModerationBadge status={media.moderation?.status || 'unknown'} />
 ) : (
 <p className="text-sm text-slate-500 italic">Pending</p>
 )}
 </div>

 <div>
 <h4 className="text-sm font-medium text-slate-500 mb-3 uppercase tracking-wider flex items-center">
 <FileText className="w-4 h-4 mr-2" /> File Info
 </h4>
 <div className="text-sm text-slate-700 space-y-1">
 <p><span className="font-medium text-slate-500">Format:</span> {media.format.toUpperCase()}</p>
 <p><span className="font-medium text-slate-500">Size:</span> {(media.bytes / 1024 / 1024).toFixed(2)} MB</p>
 <p><span className="font-medium text-slate-500">Dimensions:</span> {media.width} × {media.height}</p>
 </div>
 </div>
 </div>

 <div className="pt-4 border-t border-slate-100 ">
 <div className="flex items-center justify-between mb-3">
 <h4 className="text-sm font-medium text-slate-500 uppercase tracking-wider flex items-center">
 <Zap className="w-4 h-4 mr-2 text-amber-500" /> Delivery Optimization
 </h4>
 <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 border border-emerald-200">Live Cloudinary</span>
 </div>
 <div className="grid grid-cols-2 gap-4 text-sm bg-amber-50 p-4 rounded-lg border border-amber-100 ">
 <div>
 <p className="font-medium text-slate-700 ">Format</p>
 <p className="text-amber-600 font-semibold">AUTO (f_auto)</p>
 </div>
 <div>
 <p className="font-medium text-slate-700 ">Quality</p>
 <p className="text-amber-600 font-semibold">AUTO (q_auto)</p>
 </div>
 <div className="col-span-2 text-slate-600 mt-2 space-y-1 text-xs">
 <p className="flex items-center">✓ Automatic format selection for client</p>
 <p className="flex items-center">✓ Automatic quality optimization</p>
 </div>
 </div>
 </div>

 {/* Activity Feed */}
 <div className="pt-4 border-t border-slate-100 ">
 <h4 className="text-sm font-medium text-slate-500 mb-4 uppercase tracking-wider flex items-center">
 <Clock className="w-4 h-4 mr-2" /> Activity
 </h4>
 <div className="space-y-4">
 {mediaActivities.length > 0 ? (
 <div className="relative border-l border-slate-200 ml-2 space-y-4">
 {mediaActivities.map((activity) => (
 <div key={activity.id} className="relative pl-4">
 <div className="absolute -left-1 top-1.5 w-2 h-2 rounded-full bg-indigo-500 ring-4 ring-white "></div>
 <p className="text-sm font-medium text-slate-700 ">{activity.description}</p>
 <p className="text-xs text-slate-500 mt-0.5">
 {new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric' }).format(new Date(activity.timestamp))}
 </p>
 </div>
 ))}
 </div>
 ) : (
 <p className="text-sm text-slate-500 italic">No activity yet</p>
 )}
 </div>
 </div>

 </div>
 </div>
 );
}
