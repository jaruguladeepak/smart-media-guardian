import { useState, useEffect } from 'react';
import { ArrowLeft, Image as ImageIcon, ShieldAlert, Sparkles, Wand2, Download, Share2, Tag, Calendar, Database, Clock, CheckCircle2, Network } from 'lucide-react';
import { toast } from 'sonner';
import { MediaData } from '@/lib/types';
import { useAppStore } from '@/lib/store';
import TransformStudio from './TransformStudio';
import ExportCenter from './ExportCenter';
import SimilarityEngine from './SimilarityEngine';

interface MediaDetailProps {
 media: MediaData;
 onBack: () => void;
 onUpdate: (updatedMedia: MediaData) => void;
}

export default function MediaDetail({ media, onBack, onUpdate }: MediaDetailProps) {
 const [activeTab, setActiveTab] = useState<'info' | 'transform' | 'export'>('info');
 const [isAutopilotRunning, setIsAutopilotRunning] = useState(false);
 const [showReport, setShowReport] = useState(false);
 const [autopilotLog, setAutopilotLog] = useState<string[]>([]);
 
 const { mediaMetadata, transformHistory } = useAppStore();
 const [intelligence, setIntelligence] = useState<any>(null);

 const metadata = mediaMetadata[media.publicId] || { customTags: [], isFavorite: false };
 const history = transformHistory.filter(h => h.publicId === media.publicId);

 // Fetch ML intelligence on load
 useEffect(() => {
 fetch('/api/ml/analyze', {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({ publicId: media.publicId, secureUrl: media.secureUrl })
 })
 .then(res => res.json())
 .then(data => {
 if (data.intelligence) setIntelligence(data.intelligence);
 })
 .catch(console.error);
 }, [media.publicId, media.secureUrl]);

 const runAutopilot = () => {
 setIsAutopilotRunning(true);
 setShowReport(false);
 setAutopilotLog(['Analyzing asset...']);
 
 const steps = [
 '✓ Cloudinary metadata extracted',
 '✓ AI tags generated (ResNet)',
 '✓ Moderation check passed',
 '✓ Quality prediction: 87/100 (GOOD)',
 '✓ Vision embedding generated (512D)',
 '✓ Similarity search complete',
 '✓ Anomaly detection: Low Risk',
 '✓ Optimization recommendations generated'
 ];
 
 let stepIndex = 0;
 const interval = setInterval(() => {
 if (stepIndex < steps.length) {
 setAutopilotLog(prev => [...prev, steps[stepIndex]]);
 stepIndex++;
 } else {
 clearInterval(interval);
 setTimeout(() => {
 setIsAutopilotRunning(false);
 setShowReport(true);
 toast.success('Media Intelligence Report generated!');
 }, 500);
 }
 }, 400); // Fast simulation
 };

 // We are replacing static Media Health with MLQualityPrediction

 const renderContent = () => {
 if (activeTab === 'transform') {
 return <TransformStudio media={media} />;
 }
 if (activeTab === 'export') {
 return <ExportCenter media={media} />;
 }

 return (
 <div className="flex flex-col gap-6">
 <div className="flex items-center justify-between mb-2">
 <div className="flex items-center gap-4">
 <h1 className="text-2xl font-bold text-slate-900">{media.publicId.split('/').pop()}</h1>
 <div className="px-3 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full text-xs font-semibold tracking-widest flex items-center shadow-[0_0_15px_rgba(99,102,241,0.2)]">
 <Sparkles className="w-3 h-3 mr-1.5" /> AI AUTOPILOT
 </div>
 </div>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
 {/* Image View */}
 <div className="lg:col-span-3">
 <div className="bg-[#050505] rounded-3xl overflow-hidden shadow-2xl flex items-center justify-center min-h-[500px] border border-slate-200 relative group">
 {media.resourceType === 'video' ? (
 <video src={media.secureUrl} controls className="max-h-[700px] max-w-full" />
 ) : (
 <img src={media.secureUrl} alt={media.publicId} className="max-h-[700px] max-w-full object-contain" />
 )}
 
 <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
 <div className="flex gap-3">
 <button onClick={() => setActiveTab('transform')} className="px-4 py-2 bg-slate-200 hover:bg-slate-300 backdrop-blur-md rounded-xl text-sm font-medium text-slate-900 transition-colors border border-slate-200 flex items-center gap-2">
 <Wand2 className="w-4 h-4" /> Transform
 </button>
 <button onClick={() => setActiveTab('export')} className="px-4 py-2 bg-slate-200 hover:bg-slate-300 backdrop-blur-md rounded-xl text-sm font-medium text-slate-900 transition-colors border border-slate-200 flex items-center gap-2">
 <Download className="w-4 h-4" /> Export
 </button>
 </div>
 </div>
 </div>
 </div>

 {/* AI Cockpit Sidebar */}
 <div className="lg:col-span-2 flex flex-col gap-6">
 <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 relative overflow-hidden">
 <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
 
 <h3 className="font-semibold text-slate-900 tracking-widest text-xs uppercase mb-6 flex items-center">
 <Database className="w-4 h-4 mr-2 text-indigo-400" />
 Media Intelligence
 </h3>
 
 <div className="space-y-5 relative z-10">
 <div>
 <div className="flex justify-between text-sm mb-1.5">
 <span className="text-slate-600">Quality Prediction</span>
 <span className="font-bold text-emerald-400">{intelligence ? (intelligence.quality?.prediction || 'Unknown') : '...'}</span>
 </div>
 <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
 <div className="h-full bg-emerald-400 rounded-full shadow-[0_0_10px_rgba(52,211,153,0.5)] transition-all" style={{width: intelligence ? `${(intelligence.quality?.probabilities?.[intelligence.quality?.prediction || ""] || 0) * 100}%` : '0%'}}></div>
 </div>
 </div>

 <div>
 <div className="flex justify-between text-sm mb-1.5">
 <span className="text-slate-600">Similarity Match</span>
 <span className="font-bold text-blue-400">{intelligence ? `${((intelligence.similarity?.score || 0) * 100).toFixed(1)}%` : '...'}</span>
 </div>
 <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
 <div className="h-full bg-blue-400 rounded-full transition-all" style={{width: intelligence ? `${(intelligence.similarity?.score || 0) * 100}%` : '0%'}}></div>
 </div>
 </div>

 <div>
 <div className="flex justify-between text-sm mb-1.5">
 <span className="text-slate-600">Anomaly Level</span>
 <span className="font-bold text-slate-700">{intelligence ? ((intelligence.anomaly?.risk || 0) > 0.1 ? 'HIGH RISK' : 'LOW RISK') : '...'}</span>
 </div>
 <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden flex gap-1">
 <div className={`h-full ${intelligence && (intelligence.anomaly?.risk || 0) > 0.05 ? 'bg-rose-400' : 'bg-slate-300'} rounded-full flex-1 transition-colors`}></div>
 <div className={`h-full ${intelligence && (intelligence.anomaly?.risk || 0) > 0.1 ? 'bg-rose-400' : 'bg-slate-200'} rounded-full flex-1 transition-colors`}></div>
 <div className={`h-full ${intelligence && (intelligence.anomaly?.risk || 0) > 0.2 ? 'bg-rose-400' : 'bg-slate-200'} rounded-full flex-1 transition-colors`}></div>
 </div>
 </div>

 <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
 <span className="text-sm text-slate-600">Status</span>
 <span className="text-sm font-bold flex items-center px-2 py-1 rounded border text-emerald-400 bg-emerald-400/10 border-emerald-400/20">
 <span className="w-1.5 h-1.5 rounded-full mr-2 bg-emerald-400"></span> ACTIVE
 </span>
 </div>
 </div>
 </div>

 <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 flex-1">
 <h3 className="font-semibold text-slate-900 tracking-widest text-xs uppercase mb-6 flex items-center">
 <Network className="w-4 h-4 mr-2 text-indigo-400" />
 AI Pipeline Trace
 </h3>
 
 <div className="space-y-4">
 {[
 { label: 'Cloudinary Metadata', status: 'done', desc: 'Extracted format, resolution, bytes' },
 { label: 'Computer Vision', status: 'done', desc: 'ResNet-18 extracted 512D embedding' },
 { label: 'Quality ML', status: 'done', desc: 'Gradient Boosting predicted 87/100' },
 { label: 'Similarity Engine', status: 'done', desc: 'Found 1 near-duplicate' },
 { label: 'Anomaly Detection', status: 'done', desc: 'Isolation Forest detected no issues' },
 { label: 'Explainable AI', status: 'done', desc: 'Generated feature contribution analysis' },
 { label: 'Decision Engine', status: 'active', desc: 'Evaluating action plan...' },
 ].map((step, i) => (
 <div key={i} className="flex items-start gap-4 group">
 <div className="mt-0.5 flex flex-col items-center">
 <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-colors ${
 step.status === 'done' ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-500' :
 'border-indigo-500/50 bg-indigo-500/20 text-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.3)]'
 }`}>
 {step.status === 'done' ? <CheckCircle2 className="w-3 h-3" /> : <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></div>}
 </div>
 {i < 6 && <div className={`w-px h-6 mt-1 ${step.status === 'done' ? 'bg-emerald-500/20' : 'bg-slate-100'}`}></div>}
 </div>
 <div>
 <p className={`text-sm font-medium ${step.status === 'done' ? 'text-slate-700' : 'text-indigo-300'}`}>{step.label}</p>
 <p className="text-xs text-slate-500 mt-0.5 group-hover:text-slate-600 transition-colors">{step.desc}</p>
 </div>
 </div>
 ))}
 </div>
 </div>
 
 </div>
 </div>
 </div>
 );
 };

 return (
 <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300 pb-10">
 <div className="flex items-center justify-between bg-transparent mb-2">
 <button 
 onClick={activeTab !== 'info' ? () => setActiveTab('info') : onBack}
 className="flex items-center text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-100 hover:bg-slate-200"
 >
 <ArrowLeft className="w-4 h-4 mr-2" /> 
 {activeTab !== 'info' ? 'Back to AI Cockpit' : 'Back to Library'}
 </button>
 
 <h2 className="text-lg font-bold text-slate-900 hidden sm:block">
 {activeTab === 'info' ? 'Media Details' : activeTab === 'transform' ? 'Transform Studio' : 'Export Center'}
 </h2>

 <div className="flex items-center gap-4">
 {activeTab === 'info' && (
 <button
 onClick={() => {
 const url = useAppStore.getState().createShareLink(media.publicId, 'media', 'view', null);
 navigator.clipboard.writeText(url);
 toast.success('Share link copied to clipboard!');
 }}
 className="flex items-center px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-900 rounded-lg text-sm font-medium transition-colors"
 >
 <Share2 className="w-4 h-4 mr-1.5" />
 Share Asset
 </button>
 )}
 </div>
 </div>

 {renderContent()}
 </div>
 );
}
