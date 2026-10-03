import { useState, useEffect } from 'react';
import { Activity, Server, Clock, Zap, CheckCircle2, AlertTriangle, ArrowRight, RotateCw, Settings } from 'lucide-react';
import { toast } from 'sonner';

export default function PipelineMonitorPage() {
 const [isLive, setIsLive] = useState(true);
 
 const pipelineMetrics = [
 { name: 'Cloudinary Upload', time: 420, status: 'success' },
 { name: 'Feature Extraction', time: 310, status: 'success' },
 { name: 'ML Prediction', time: 180, status: 'success' },
 { name: 'DL Embedding', time: 620, status: 'success' },
 { name: 'Similarity Search', time: 210, status: 'success' },
 { name: 'Decision Engine', time: 100, status: 'success' },
 ];
 
 const totalProcessingTime = pipelineMetrics.reduce((acc, curr) => acc + curr.time, 0);

 const [recentJobs, setRecentJobs] = useState([
 { id: 'JOB-9421', asset: 'IMG_4921.jpg', status: 'completed', time: '1.84s', timestamp: 'Just now' },
 { id: 'JOB-9420', asset: 'hero_banner_final.png', status: 'completed', time: '2.10s', timestamp: '2 mins ago' },
 { id: 'JOB-9419', asset: 'corrupted_file.jpg', status: 'failed', time: '0.42s', timestamp: '5 mins ago', error: 'DL Embedding Timeout' },
 { id: 'JOB-9418', asset: 'profile_pic.jpeg', status: 'completed', time: '1.75s', timestamp: '12 mins ago' },
 ]);

 return (
 <div className="animate-in fade-in duration-500 h-full flex flex-col font-mono text-sm">
 <div className="flex items-center justify-between mb-6">
 <div>
 <h1 className="text-xl font-bold tracking-widest text-slate-900 uppercase flex items-center gap-2">
 <Server className="w-5 h-5 text-indigo-400" />
 MediaFlow Pipeline Monitor
 </h1>
 <p className="text-slate-500 text-xs mt-1">Real-time observability • v5.0.0-stable</p>
 </div>
 <div className="flex items-center gap-3 bg-slate-50 px-3 py-1.5 rounded-lg border border-emerald-500/20">
 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
 <span className="text-emerald-400 font-bold text-xs uppercase tracking-widest">System Operational</span>
 </div>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 flex-shrink-0">
 
 {/* Pipeline Health */}
 <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 shadow-2xl relative overflow-hidden">
 <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
 <h3 className="font-bold text-slate-900 mb-6 uppercase tracking-widest text-xs flex items-center border-b border-slate-200 pb-3">
 <Activity className="w-4 h-4 mr-2 text-indigo-400" />
 Pipeline Health
 </h3>
 <div className="space-y-4 relative z-10">
 {[
 { label: 'API Gateway', status: 'Operational', ping: '12ms' },
 { label: 'Cloudinary Link', status: 'Operational', ping: '45ms' },
 { label: 'ML Inference Node', status: 'Operational', ping: '18ms' },
 { label: 'Vision Service', status: 'Operational', ping: '32ms' },
 { label: 'Task Queue', status: 'Operational', ping: '5ms' },
 ].map((svc, i) => (
 <div key={i} className="flex justify-between items-center group">
 <span className="text-slate-500 w-40">{svc.label}</span>
 <span className="flex-1 border-b border-dashed border-slate-200 mx-4 opacity-50"></span>
 <div className="flex items-center gap-3">
 <span className="text-emerald-400 flex items-center gap-2">
 <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
 {svc.status}
 </span>
 <span className="text-slate-600 text-xs w-10 text-right group-hover:text-slate-500 transition-colors">{svc.ping}</span>
 </div>
 </div>
 ))}
 </div>
 </div>

 {/* Latency */}
 <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 shadow-2xl relative overflow-hidden">
 <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
 <h3 className="font-bold text-slate-900 mb-6 uppercase tracking-widest text-xs flex items-center border-b border-slate-200 pb-3">
 <Clock className="w-4 h-4 mr-2 text-amber-400" />
 Latency Breakdown
 </h3>
 <div className="space-y-3 relative z-10">
 {pipelineMetrics.map((metric, i) => (
 <div key={i} className="flex justify-between items-center">
 <span className="text-slate-500 w-32">{metric.name.split(' ')[0]}</span>
 <div className="flex-1 mx-4 h-1.5 bg-slate-100 rounded-full overflow-hidden">
 <div 
 className="h-full bg-indigo-500/50 rounded-full" 
 style={{ width: `${(metric.time / 800) * 100}%` }}
 ></div>
 </div>
 <span className="text-slate-600 w-16 text-right">{metric.time}ms</span>
 </div>
 ))}
 <div className="pt-3 mt-3 border-t border-slate-200 flex justify-between items-center font-bold">
 <span className="text-slate-900">Total Time</span>
 <span className="text-amber-400 text-lg">{(totalProcessingTime / 1000).toFixed(2)}s</span>
 </div>
 </div>
 </div>

 </div>

 {/* Live Stream */}
 <div className="bg-slate-50 rounded-xl border border-slate-200 shadow-2xl flex-1 flex flex-col min-h-0 relative overflow-hidden">
 <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
 <h3 className="font-bold text-slate-900 flex items-center text-xs uppercase tracking-widest">
 <Zap className="w-4 h-4 mr-2 text-indigo-400" />
 Live Execution Stream
 </h3>
 <div className="flex gap-2">
 <div className="w-2 h-2 rounded-full bg-red-500"></div>
 <div className="w-2 h-2 rounded-full bg-amber-500"></div>
 <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
 </div>
 </div>
 
 <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-1">
 {recentJobs.map((job) => (
 <div key={job.id} className="flex items-center py-2 px-3 hover:bg-slate-100 rounded transition-colors group">
 <span className="text-slate-500 w-24">{job.timestamp.split(' ')[0]}</span>
 <span className="text-indigo-400 w-24 font-bold">{job.id}</span>
 <span className="text-slate-600 flex-1 truncate">{job.asset}</span>
 
 {job.status === 'completed' ? (
 <span className="text-emerald-400 w-24 flex items-center">
 <CheckCircle2 className="w-3.5 h-3.5 mr-2" /> SUCCESS
 </span>
 ) : (
 <span className="text-rose-400 w-48 flex items-center truncate">
 <AlertTriangle className="w-3.5 h-3.5 mr-2 flex-shrink-0" /> {job.error}
 </span>
 )}
 
 <span className="text-slate-500 w-16 text-right group-hover:text-slate-600">{job.time}</span>
 </div>
 ))}
 
 <div className="py-2 px-3 text-slate-600 animate-pulse flex items-center">
 <span className="text-slate-500 w-24">Just now</span>
 <span className="text-slate-600 w-24 font-bold">JOB-9422</span>
 <span className="flex-1">Waiting for next payload...</span>
 <span className="w-4 flex justify-end"><div className="w-1.5 h-4 bg-indigo-500/50 animate-bounce"></div></span>
 </div>
 </div>
 </div>
 </div>
 );
}
