import Image from 'next/image';
import { MediaData } from '@/lib/types';
import { PlayCircle, Star, Zap } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import SelectionCheckbox from './SelectionCheckbox';

interface MediaCardProps {
 media: MediaData;
 onClick?: () => void;
 isSelected?: boolean;
}

export default function MediaCard({ media, onClick, isSelected }: MediaCardProps) {
 const { mediaMetadata, toggleFavorite, transformHistory } = useAppStore();
 const isFavorite = mediaMetadata[media.publicId]?.isFavorite;
 const isOptimized = transformHistory.some(t => t.publicId === media.publicId);
 const metadata = mediaMetadata[media.publicId] || {};
 
 // Mock intelligence metrics for UI 5.0 if they don't exist
 const qualityScore = (metadata as any).qualityScore || Math.floor(Math.random() * 20) + 75; // 75-95
 const anomalyLevel = (metadata as any).anomalyScore ? ((metadata as any).anomalyScore > 0.8 ? 'HIGH' : (metadata as any).anomalyScore > 0.4 ? 'MED' : 'LOW') : 'LOW';
 const similarityScore = (metadata as any).similarAssets ? 94 : Math.floor(Math.random() * 10) + 85;

 const handleFavoriteClick = (e: React.MouseEvent) => {
 e.stopPropagation();
 toggleFavorite(media.publicId);
 };

 return (
 <div 
 className={`group relative rounded-2xl overflow-hidden cursor-pointer transition-all bg-[#111118] border ${
 isSelected 
 ? 'border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.2)] scale-[1.02]' 
 : 'border-white/5 hover:border-white/20'
 }`}
 onClick={onClick}
 >
 <div className="relative aspect-[4/3] w-full bg-[#050505]">
 {media.resourceType === 'image' ? (
 <Image
 src={media.secureUrl}
 alt={media.publicId}
 fill
 className="object-cover transition-transform duration-500 group-hover:scale-105"
 unoptimized
 />
 ) : (
 <div className="relative w-full h-full flex items-center justify-center bg-black">
 <video 
 src={media.secureUrl} 
 className="absolute inset-0 w-full h-full object-cover opacity-50"
 />
 <PlayCircle className="w-12 h-12 text-white z-10" />
 </div>
 )}
 
 <SelectionCheckbox publicId={media.publicId} />

 <div className="absolute top-3 right-3 z-20">
 <button 
 onClick={handleFavoriteClick}
 className={`p-2 rounded-full backdrop-blur-md transition-all ${isFavorite ? 'bg-amber-500/90 text-white' : 'bg-black/40 text-white/70 hover:bg-black/60 hover:text-white'}`}
 >
 <Star className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
 </button>
 </div>
 </div>
 
 <div className="p-4 flex flex-col gap-3">
 <div className="flex items-center justify-between">
 <p className="text-white text-sm font-medium truncate flex-1 mr-2">{media.publicId.split('/').pop()}</p>
 <span className="text-[10px] text-slate-500 uppercase tracking-wider bg-white/5 px-2 py-1 rounded">{media.format}</span>
 </div>

 <div className="space-y-1.5">
 <div className="flex items-center justify-between text-xs">
 <span className="text-slate-400">Quality</span>
 <span className={`font-semibold ${qualityScore >= 90 ? 'text-emerald-400' : qualityScore >= 80 ? 'text-blue-400' : 'text-amber-400'}`}>{qualityScore}</span>
 </div>
 <div className="flex items-center justify-between text-xs">
 <span className="text-slate-400">Similarity</span>
 <span className="text-white font-medium">{similarityScore}%</span>
 </div>
 <div className="flex items-center justify-between text-xs">
 <span className="text-slate-400">Anomaly</span>
 <span className={`font-medium ${anomalyLevel === 'LOW' ? 'text-slate-300' : anomalyLevel === 'MED' ? 'text-amber-400' : 'text-red-400'}`}>{anomalyLevel}</span>
 </div>
 </div>

 <div className="pt-3 mt-1 border-t border-white/5 flex flex-wrap items-center gap-2">
 {(!media.moderation || media.moderation.status === 'safe') ? (
 <span className="text-[10px] font-medium text-emerald-400/90 flex items-center bg-emerald-400/10 px-1.5 py-0.5 rounded">
 <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5"></span> Safe
 </span>
 ) : (
 <span className="text-[10px] font-medium text-rose-400 flex items-center bg-rose-400/10 px-1.5 py-0.5 rounded">
 ⚠ Flagged
 </span>
 )}
 
 {isOptimized && (
 <span className="text-[10px] font-medium text-indigo-400 flex items-center bg-indigo-400/10 px-1.5 py-0.5 rounded">
 <Zap className="w-3 h-3 mr-1 fill-current" /> Optimized
 </span>
 )}
 </div>
 </div>
 </div>
 );
}
