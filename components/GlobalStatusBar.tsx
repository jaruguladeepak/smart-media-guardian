import { CheckCircle2, Activity, Database, HeartPulse, Check, CircleDot } from 'lucide-react';

interface GlobalStatusBarProps {
 assetCount: number;
 analyzedCount: number;
 anomalyCount: number;
 pipelineSuccess: number;
}

export default function GlobalStatusBar({ isProcessing }: { isProcessing?: boolean }) {
 return (
 <div className="h-8 border-t border-slate-200 bg-[#050505] flex items-center justify-between px-4 text-[11px] font-medium text-slate-500 tracking-wide z-40 relative">
 <div className="flex items-center gap-6">
 <div className="flex items-center gap-1.5 text-emerald-400">
 <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
 Cloudinary CONNECTED
 </div>
 <div className="flex items-center gap-1.5 text-emerald-400">
 <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
 ML Service READY
 </div>
 <div className="flex items-center gap-1.5 text-emerald-400">
 <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
 Vision Model READY
 </div>
 <div className={`flex items-center gap-1.5 ${isProcessing ? 'text-indigo-400' : 'text-slate-500'}`}>
 <span className={`w-2 h-2 rounded-full ${isProcessing ? 'bg-indigo-500 animate-pulse' : 'bg-slate-500'}`}></span>
 Pipeline {isProcessing ? 'PROCESSING' : 'IDLE'}
 </div>
 </div>
 
 <div className="flex items-center gap-4">
 {isProcessing ? (
 <span className="text-indigo-400 animate-pulse">Running live analysis...</span>
 ) : (
 <span className="text-slate-500 italic">Nothing is being analyzed yet.</span>
 )}
 </div>
 </div>
 );
}
