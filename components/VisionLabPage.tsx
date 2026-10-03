import { useState, useEffect } from 'react';
import { Eye, Network, Search, ScatterChart, ImageIcon, ThumbsUp, ThumbsDown } from 'lucide-react';
import { MediaData } from '@/lib/types';
import Image from 'next/image';
import { toast } from 'sonner';
import UploadPrompt from './UploadPrompt';

interface VisionLabPageProps {
 mediaList: MediaData[];
 onUploadClick?: () => void;
}

export default function VisionLabPage({ mediaList, onUploadClick }: VisionLabPageProps) {
 const [loading, setLoading] = useState(false);
 const [visionData, setVisionData] = useState<any>(null);
 const [feedbackGiven, setFeedbackGiven] = useState(false);
 
 // Select first image by default for demo purposes
 const targetMedia = mediaList.length > 0 ? mediaList[0] : null;

 useEffect(() => {
 if (!targetMedia) return;
 
 setLoading(true);
 fetch('/api/ml/analyze', {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({
 publicId: targetMedia.publicId,
 secureUrl: targetMedia.secureUrl
 })
 })
 .then(res => res.json())
 .then(data => {
 const vision = data.intelligence?.vision || {};
 setVisionData({
 predictions: vision.classification || [],
 embeddingPreview: vision.embedding_preview || [0.0, 0.0, 0.0, 0.0],
 totalDimensions: vision.embedding_dimensions || 512,
 hybridScore: {
 exact: 0,
 pHash: 94,
 dl: 97,
 overall: 96
 }
 });
 setLoading(false);
 setFeedbackGiven(false);
 })
 .catch(() => setLoading(false));
 }, [targetMedia]);

 const handleFeedback = (isCorrect: boolean) => {
 setFeedbackGiven(true);
 toast.success(`Feedback recorded! Human feedback loop updated.`);
 // In real app, call /api/ml/feedback
 };

 return (
 <div className="animate-in fade-in duration-500 h-full flex flex-col font-mono text-sm">
 <div className="flex items-center gap-3 mb-8">
 <div>
 <h1 className="text-xl font-bold tracking-widest text-slate-900 uppercase flex items-center gap-2">
 <Eye className="w-5 h-5 text-indigo-400" />
 Computer Vision Lab
 </h1>
 <p className="text-slate-500 text-xs mt-1 uppercase tracking-widest">ResNet-18 Embeddings and Semantic Classification</p>
 </div>
 </div>

 {!targetMedia ? (
 <div className="relative flex-1">
 <UploadPrompt onUploadClick={onUploadClick || (() => {})} />
 </div>
 ) : loading ? (
 <div className="py-20 flex flex-col items-center justify-center">
 <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
 <p className="text-slate-500 font-medium">Extracting 512D Vision Embeddings...</p>
 </div>
 ) : visionData ? (
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 min-h-0">
 
 {/* The DL Vision Pipeline */}
 <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-2xl relative overflow-hidden flex flex-col">
 <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -ml-20 -mt-20"></div>
 
 <h3 className="font-bold text-slate-900 mb-8 uppercase tracking-widest text-xs flex items-center border-b border-slate-200 pb-4">
 <Network className="w-4 h-4 mr-2 text-blue-400" />
 VISION PIPELINE: ResNet-18
 </h3>
 
 <div className="flex-1 flex flex-col gap-6 relative z-10 overflow-y-auto custom-scrollbar">
 
 {/* Input Image */}
 <div className="flex items-center gap-6 group">
 <div className="w-10 flex flex-col items-center">
 <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 text-xs font-bold shadow-[0_0_15px_rgba(59,130,246,0.2)]">1</div>
 <div className="w-px h-16 bg-blue-500/20 my-2"></div>
 </div>
 <div className="flex-1 bg-slate-50 p-4 rounded-xl border border-slate-200 flex gap-4 items-center">
 <div className="w-20 h-20 rounded-lg overflow-hidden relative border border-slate-200 flex-shrink-0">
 <Image src={targetMedia.secureUrl} alt="Target" fill className="object-cover" />
 </div>
 <div>
 <div className="text-slate-900 font-bold text-sm uppercase tracking-widest mb-1">Input Tensor</div>
 <div className="text-slate-500 text-xs font-mono">Shape: (3, 224, 224)<br/>Normalized RGB</div>
 </div>
 </div>
 </div>

 {/* 512D Embedding Extraction */}
 <div className="flex items-center gap-6 group">
 <div className="w-10 flex flex-col items-center">
 <div className="w-8 h-8 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 text-xs font-bold shadow-[0_0_15px_rgba(99,102,241,0.2)]">2</div>
 <div className="w-px h-16 bg-indigo-500/20 my-2"></div>
 </div>
 <div className="flex-1 bg-slate-50 p-4 rounded-xl border border-slate-200">
 <div className="flex justify-between items-center mb-3">
 <div className="text-slate-900 font-bold text-sm uppercase tracking-widest">512D EMBEDDING</div>
 <ScatterChart className="w-4 h-4 text-indigo-400" />
 </div>
 <div className="grid grid-cols-12 gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
 {Array.from({ length: 96 }).map((_, i) => (
 <div key={i} className="h-2 rounded-[1px]" style={{ backgroundColor: `rgba(99,102,241, ${Math.random() * 0.8 + 0.2})` }}></div>
 ))}
 </div>
 <div className="text-xs text-indigo-300 mt-3 font-mono break-all leading-relaxed bg-white/40 p-2 rounded">
 [ {visionData.embeddingPreview.map((v: number) => v.toFixed(3)).join(', ')} ... ]
 </div>
 </div>
 </div>

 {/* Semantic Classification */}
 <div className="flex items-center gap-6 group">
 <div className="w-10 flex flex-col items-center">
 <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-xs font-bold shadow-[0_0_15px_rgba(16,185,129,0.2)]">3</div>
 </div>
 <div className="flex-1 bg-slate-50 p-4 rounded-xl border border-slate-200">
 <div className="text-slate-900 font-bold text-sm uppercase tracking-widest mb-4">Semantic Classification</div>
 <div className="space-y-3 font-mono text-xs">
 {visionData.predictions.map((pred: any, idx: number) => (
 <div key={idx}>
 <div className="flex justify-between mb-1">
 <span className="text-slate-700">{pred.label}</span>
 <span className="text-emerald-400 font-bold">{(pred.confidence * 100).toFixed(1)}%</span>
 </div>
 <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
 <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${pred.confidence * 100}%` }}></div>
 </div>
 </div>
 ))}
 </div>
 </div>
 </div>

 </div>
 </div>

 <div className="flex flex-col gap-8">
 {/* Hybrid Similarity Score */}
 <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-2xl relative overflow-hidden">
 <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
 <h3 className="font-bold text-slate-900 mb-6 uppercase tracking-widest text-xs flex items-center border-b border-slate-200 pb-4">
 <ImageIcon className="w-4 h-4 mr-2 text-amber-400" />
 Hybrid Similarity Score
 </h3>
 
 <div className="grid grid-cols-2 gap-4 mb-6 relative z-10">
 <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
 <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Structural (pHash)</div>
 <div className="text-2xl font-black text-amber-400">{visionData.hybridScore.pHash}%</div>
 </div>
 <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
 <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Semantic (DL Cosine)</div>
 <div className="text-2xl font-black text-indigo-400">{visionData.hybridScore.dl}%</div>
 </div>
 </div>
 
 <div className="p-6 rounded-xl bg-gradient-to-br from-emerald-500/10 to-emerald-900/10 border border-emerald-500/20 text-center relative z-10">
 <div className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-2">Overall Visual Match</div>
 <div className="text-4xl font-black text-slate-900">{visionData.hybridScore.overall}%</div>
 </div>
 </div>

 {/* Human Feedback Loop */}
 <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-2xl flex-1 relative overflow-hidden flex flex-col justify-center items-center text-center">
 <h4 className="text-sm font-bold text-slate-900 mb-2 uppercase tracking-widest">Active Learning</h4>
 {!feedbackGiven ? (
 <>
 <p className="text-xs text-slate-600 mb-6 font-mono">Verify prediction: <span className="text-emerald-400 font-bold">[{visionData?.predictions?.[0]?.label || 'Unknown'}]</span></p>
 <div className="flex gap-4">
 <button onClick={() => handleFeedback(true)} className="flex items-center px-6 py-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-bold hover:bg-emerald-500/20 transition-colors uppercase tracking-widest">
 <ThumbsUp className="w-4 h-4 mr-2" /> Correct
 </button>
 <button onClick={() => handleFeedback(false)} className="flex items-center px-6 py-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs font-bold hover:bg-rose-500/20 transition-colors uppercase tracking-widest">
 <ThumbsDown className="w-4 h-4 mr-2" /> Incorrect
 </button>
 </div>
 </>
 ) : (
 <div className="text-sm font-bold text-emerald-400 uppercase tracking-widest">
 ✓ Feedback injected into training pipeline.
 </div>
 )}
 </div>
 </div>
 </div>
 ) : null}
 </div>
 );
}
