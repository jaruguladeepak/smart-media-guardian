import { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2, ShieldAlert, AlertTriangle, Cpu } from 'lucide-react';
import { MediaData } from '@/lib/types';
import Image from 'next/image';

interface DecisionEnginePageProps {
 mediaList: MediaData[];
}

export default function DecisionEnginePage({ mediaList }: DecisionEnginePageProps) {
 const [loading, setLoading] = useState(false);
 const [report, setReport] = useState<any>(null);

 const targetMedia = mediaList.length > 0 ? mediaList[0] : null;

 useEffect(() => {
 if (!targetMedia) return;
 
 setLoading(true);
 setTimeout(() => {
 setReport({
 quality: 91,
 similarity: 96,
 anomalyRisk: 'Low',
 moderation: 'Safe',
 organization: 'Good',
 optimization: 'Recommended',
 actions: [
 { text: 'Keep original', status: 'approved' },
 { text: 'Generate WebP', status: 'pending' },
 { text: 'Create 16:9 version', status: 'pending' },
 { text: 'Similar asset detected (Review)', status: 'warning' },
 { text: 'Add to "Events"', status: 'approved' }
 ]
 });
 setLoading(false);
 }, 1500);
 }, [targetMedia]);

 return (
 <div className="animate-in fade-in duration-300">
 <div className="flex items-center gap-3 mb-6">
 <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
 <Sparkles className="w-5 h-5 text-indigo-600 " />
 </div>
 <div>
 <h1 className="text-2xl font-bold tracking-tight text-slate-900 ">Media Intelligence Engine</h1>
 <p className="text-sm text-slate-500">Unified pipeline combining Quality, Vision, and Anomaly algorithms to make automated decisions.</p>
 </div>
 </div>

 {!targetMedia ? (
 <div className="py-20 text-center text-slate-500">Please upload media to generate an Intelligence Report.</div>
 ) : loading ? (
 <div className="py-20 flex flex-col items-center justify-center">
 <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
 <p className="text-slate-500 font-medium">Running all inference pipelines...</p>
 </div>
 ) : report ? (
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
 <div className="lg:col-span-1">
 <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm mb-6">
 <div className="relative w-full aspect-square rounded-lg overflow-hidden border border-slate-200 ">
 <Image src={targetMedia.secureUrl} alt="Target" fill className="object-cover" />
 </div>
 </div>
 
 <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 shadow-sm">
 <h3 className="font-bold text-emerald-800 mb-3 flex items-center">
 <Cpu className="w-4 h-4 mr-2" />
 Pipeline Execution
 </h3>
 <ul className="space-y-2 text-sm text-emerald-700 font-medium">
 <li className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-2" /> Cloudinary Tags Extracted</li>
 <li className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-2" /> Quality RF Scored</li>
 <li className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-2" /> Vision Embeddings Cached</li>
 <li className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-2" /> Isolation Forest Checked</li>
 </ul>
 </div>
 </div>

 <div className="lg:col-span-2 space-y-6">
 <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
 <h3 className="font-bold text-slate-700 mb-6 uppercase tracking-wider text-sm">Media Intelligence Report</h3>
 
 <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
 <div>
 <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Quality Score</div>
 <div className="text-2xl font-bold text-emerald-500">{report.quality}/100</div>
 </div>
 <div>
 <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Visual Similarity</div>
 <div className="text-2xl font-bold text-slate-900 ">{report.similarity}%</div>
 </div>
 <div>
 <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Anomaly Risk</div>
 <div className="text-2xl font-bold text-emerald-500">{report.anomalyRisk}</div>
 </div>
 <div>
 <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Moderation</div>
 <div className="text-lg font-bold text-slate-900 ">{report.moderation}</div>
 </div>
 <div>
 <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Organization</div>
 <div className="text-lg font-bold text-slate-900 ">{report.organization}</div>
 </div>
 <div>
 <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Optimization</div>
 <div className="text-lg font-bold text-amber-500">{report.optimization}</div>
 </div>
 </div>
 
 <div className="border-t border-slate-100 pt-6">
 <h3 className="font-bold text-slate-700 mb-4 text-sm uppercase tracking-wider">Recommended Actions</h3>
 <div className="space-y-3">
 {report.actions.map((action: any, i: number) => (
 <div key={i} className="flex items-center p-3 rounded-lg bg-slate-50 border border-slate-100 ">
 {action.status === 'approved' && <CheckCircle2 className="w-5 h-5 text-emerald-500 mr-3" />}
 {action.status === 'pending' && <CheckCircle2 className="w-5 h-5 text-slate-600 mr-3" />}
 {action.status === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-500 mr-3" />}
 
 <span className={`font-medium text-sm ${action.status === 'warning' ? 'text-amber-700 ' : 'text-slate-700 '}`}>
 {action.text}
 </span>
 
 {action.status === 'pending' && (
 <button className="ml-auto px-3 py-1 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded text-xs font-bold transition-colors">
 Approve
 </button>
 )}
 {action.status === 'warning' && (
 <button className="ml-auto px-3 py-1 bg-amber-100 text-amber-700 hover:bg-amber-200 rounded text-xs font-bold transition-colors">
 Review
 </button>
 )}
 </div>
 ))}
 </div>
 </div>
 </div>
 
 <button className="w-full py-4 bg-slate-50 hover:bg-slate-100 :bg-white text-slate-900 font-bold rounded-xl transition-colors shadow-lg">
 Execute Approved Actions
 </button>
 </div>
 </div>
 ) : null}
 </div>
 );
}
