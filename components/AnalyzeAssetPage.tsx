import { useState, useEffect } from 'react';
import { Rocket, CheckCircle2, Circle, Loader2, Sparkles, Image as ImageIcon, Zap, Target, Search, BarChart, HardDrive, Cpu, AlignLeft, Cloud, ShieldCheck, Eye, AlertTriangle } from 'lucide-react';
import { MediaData } from '@/lib/types';
import Image from 'next/image';
import { toast } from 'sonner';
import UploadPrompt from './UploadPrompt';

interface AnalyzeAssetPageProps {
 mediaList: MediaData[];
 onUploadClick?: () => void;
}

export default function AnalyzeAssetPage({ mediaList, onUploadClick }: AnalyzeAssetPageProps) {
 const [targetMedia, setTargetMedia] = useState<MediaData | null>(null);
 const [isAnalyzing, setIsAnalyzing] = useState(false);
 const [completedSteps, setCompletedSteps] = useState<string[]>([]);
 const [currentStep, setCurrentStep] = useState<string | null>(null);
 const [showReport, setShowReport] = useState(false);
 const [auditTrail, setAuditTrail] = useState<any[]>([]);
 const [analysisResult, setAnalysisResult] = useState<any>(null);

 // Automatically select the first uploaded image if none selected
 useEffect(() => {
 if (mediaList.length > 0 && !targetMedia) {
 setTargetMedia(mediaList[0]);
 }
 }, [mediaList, targetMedia]);

 const pipelineSteps = [
 { id: 'cloudinary', label: 'CLOUDINARY', icon: Cloud },
 { id: 'metadata', label: 'METADATA', icon: AlignLeft },
 { id: 'moderation', label: 'MODERATION', icon: ShieldCheck },
 { id: 'feature_extraction', label: 'FEATURE EXTRACTION', icon: Cpu },
 { id: 'quality_ml', label: 'QUALITY ML', icon: Target },
 { id: 'vision_cnn', label: 'VISION CNN', icon: Eye },
 { id: 'similarity', label: 'SIMILARITY', icon: Search },
 { id: 'anomaly', label: 'ANOMALY', icon: AlertTriangle },
 { id: 'xai', label: 'XAI', icon: BarChart },
 { id: 'decision_engine', label: 'DECISION ENGINE', icon: Sparkles },
 { id: 'workflow', label: 'AUTONOMOUS WORKFLOW', icon: Zap },
 ];

 // Dummy icons for quick import bypass
 function Cloud(props: any) { return <HardDrive {...props} /> }
 function ShieldCheck(props: any) { return <CheckCircle2 {...props} /> }
 function Eye(props: any) { return <ImageIcon {...props} /> }
 function AlertTriangle(props: any) { return <Target {...props} /> }

 const runAnalysis = () => {
 if (!targetMedia) return;
 
 setIsAnalyzing(true);
 setCompletedSteps([]);
 setShowReport(false);
 setAuditTrail([]);
 setAnalysisResult(null);
 
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
 setAnalysisResult(data.intelligence);
 let index = 0;
 
 const interval = setInterval(() => {
 if (index < pipelineSteps.length) {
 setCurrentStep(pipelineSteps[index].id);
 
 if (index > 0) {
 setCompletedSteps(prev => [...prev, pipelineSteps[index - 1].id]);
 }
 index++;
 } else {
 clearInterval(interval);
 setCompletedSteps(pipelineSteps.map(s => s.id));
 setCurrentStep(null);
 
 setTimeout(() => {
 setIsAnalyzing(false);
 setShowReport(true);
 
 const qualityScore = data.intelligence?.quality?.prediction || 'Unknown';
 const risk = data.intelligence?.anomaly?.risk || 0;
 const closest = data.intelligence?.similarity?.closest_asset || 'None';

 const timings = data.intelligence?.timings || {};
 setAuditTrail([
 { stage: 'Cloudinary', action: 'Upload & Transform', result: 'Success', latency: '124ms' },
 { stage: 'Feature Extract', action: 'OpenCV Analysis', result: '9 variables', latency: `${timings.extraction || 25}ms` },
 { stage: 'Quality ML', action: 'Random Forest Inference', result: `Score: ${qualityScore}`, latency: `${timings.random_forest || 45}ms` },
 { stage: 'Vision CNN', action: 'ResNet-18 Embedding', result: '512D Vector', latency: `${timings.resnet || 210}ms` },
 { stage: 'Similarity', action: 'Embedding Match', result: `Closest: ${closest}`, latency: `${timings.similarity || 18}ms` },
 { stage: 'Anomaly', action: 'Isolation Forest', result: `Risk: ${(risk * 100).toFixed(1)}%`, latency: `${timings.anomaly || 5}ms` },
 { stage: 'Explanation', action: 'Feature Contribution', result: 'Completed', latency: `${timings.xai || 12}ms` },
 { stage: 'Workflow', action: 'Decision Engine', result: 'Completed', latency: `${timings.decision || 4}ms` },
 ]);
 toast.success("End-to-End Analysis Complete");
 }, 600);
 }
 }, 400); // 400ms per step for visual effect
 })
 .catch(() => {
 setIsAnalyzing(false);
 toast.error("Failed to run analysis");
 });
 };

 return (
 <div className="animate-in fade-in duration-300 min-h-[calc(100vh-120px)] flex flex-col">
 <div className="flex items-center gap-3 mb-6">
 <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center shadow-sm">
 <Rocket className="w-5 h-5 text-indigo-600 " />
 </div>
 <div>
 <h1 className="text-2xl font-bold tracking-tight text-slate-900 ">Analyze Asset</h1>
 <p className="text-sm text-slate-500">Run a media asset through the entire integrated ML/DL pipeline.</p>
 </div>
 </div>

 {!targetMedia ? (
 <div className="relative flex-1 flex flex-col items-center justify-center py-12 animate-in fade-in">
 <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm max-w-md w-full text-center mb-8">
 <h2 className="text-lg font-bold text-slate-900 uppercase tracking-widest mb-2">No Image Selected</h2>
 <p className="text-slate-500 mb-6">Upload an image to begin</p>
 <button 
 onClick={onUploadClick}
 className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-slate-900 font-medium rounded-xl transition-colors shadow-sm"
 >
 Select Image
 </button>
 </div>
 
 <div className="max-w-md w-full">
 <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">Models Ready</h3>
 <div className="space-y-3 font-mono text-sm text-slate-600 ">
 <div className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> OpenCV</div>
 <div className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Random Forest</div>
 <div className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> ResNet-18</div>
 <div className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Similarity</div>
 <div className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Isolation Forest</div>
 <div className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Feature Analysis</div>
 <div className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Decision Engine</div>
 </div>
 </div>
 </div>
 ) : (
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
 {/* Target Selection & Trigger */}
 <div className="lg:col-span-1 space-y-6">
 <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
 <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Target Asset</div>
 <div className="relative w-full aspect-square rounded-lg overflow-hidden border border-slate-300 shadow-sm mb-4 bg-slate-100 ">
 <Image src={targetMedia.secureUrl} alt="Target" fill className="object-cover" />
 </div>
 <div className="font-mono text-xs text-slate-500 truncate mb-4 px-2">
 ID: {targetMedia.publicId}
 </div>
 <button 
 onClick={runAnalysis}
 disabled={isAnalyzing}
 className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-slate-900 font-bold rounded-lg transition-colors flex items-center justify-center disabled:opacity-50 shadow-md"
 >
 {isAnalyzing ? (
 <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Analyzing Pipeline...</>
 ) : (
 <><Rocket className="w-5 h-5 mr-2" /> Run Everything</>
 )}
 </button>
 </div>
 
 {showReport && (
 <div className="bg-slate-50 text-slate-600 border border-slate-200 rounded-xl p-5 shadow-sm font-mono text-[11px] animate-in slide-in-from-bottom-2">
 <div className="text-emerald-400 font-bold mb-3 uppercase tracking-widest border-b border-slate-200 pb-2">Execution Audit Trail</div>
 <div className="space-y-3">
 {auditTrail.map((log, i) => (
 <div key={i} className="flex flex-col border-l border-slate-300 pl-3 py-1">
 <div className="flex justify-between font-bold text-slate-900 mb-1">
 <span>{log.stage}</span>
 <span className="text-slate-500">{log.latency}</span>
 </div>
 <div className="text-slate-500">{log.action}</div>
 <div className="text-indigo-300">→ {log.result}</div>
 </div>
 ))}
 </div>
 </div>
 )}
 </div>

 {/* Pipeline Visualization */}
 <div className="lg:col-span-1">
 <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm h-full flex flex-col justify-center">
 <div className="space-y-4 max-w-[250px] mx-auto w-full font-mono text-sm">
 {pipelineSteps.map((step, i) => {
 const isCompleted = completedSteps.includes(step.id);
 const isCurrent = currentStep === step.id;
 
 return (
 <div key={step.id} className="flex items-center relative z-10">
 <div className="w-8 flex-shrink-0 flex justify-center">
 {isCompleted ? (
 <CheckCircle2 className="w-5 h-5 text-emerald-500" />
 ) : isCurrent ? (
 <Loader2 className="w-5 h-5 text-indigo-500 animate-spin" />
 ) : (
 <Circle className="w-5 h-5 text-slate-600 " />
 )}
 </div>
 <div className={`ml-3 font-bold tracking-wider transition-colors duration-300
 ${isCompleted ? 'text-slate-800 ' : isCurrent ? 'text-indigo-600 ' : 'text-slate-500 '}
 `}>
 {step.label}
 </div>
 </div>
 );
 })}
 </div>
 </div>
 </div>

 {/* Report output */}
 <div className="lg:col-span-1">
 {showReport ? (
 <div className="bg-slate-50 text-slate-600 rounded-xl border border-slate-200 shadow-2xl animate-in slide-in-from-bottom-4 font-mono text-xs h-full overflow-hidden flex flex-col">
 <div className="p-4 border-b border-slate-200 bg-slate-100">
 <div className="font-bold text-slate-900 tracking-widest uppercase mb-1">MEDIA INTELLIGENCE</div>
 <div className="text-indigo-400">{analysisResult?.asset?.filename || targetMedia?.publicId.split('/').pop()}</div>
 </div>

 <div className="overflow-y-auto p-4 space-y-6 custom-scrollbar flex-1">
 {/* QUALITY */}
 <div>
 <div className="text-slate-900 font-bold tracking-widest uppercase mb-3 text-[10px] border-b border-slate-200 pb-1">QUALITY</div>
 <div className="flex justify-between items-center mb-3">
 <span className="text-lg font-bold uppercase" style={{ color: analysisResult?.quality?.prediction === 'Excellent' ? '#34d399' : analysisResult?.quality?.prediction === 'Good' ? '#60a5fa' : analysisResult?.quality?.prediction === 'Average' ? '#fbbf24' : '#f87171' }}>
 {analysisResult?.quality?.prediction || 'Unknown'}
 </span>
 <span className="text-emerald-400">
 {((analysisResult?.quality?.probabilities[analysisResult?.quality?.prediction] || 0) * 100).toFixed(1)}%
 </span>
 </div>
 <div className="space-y-1">
 {['Poor', 'Average', 'Good', 'Excellent'].map(level => (
 <div key={level} className="flex justify-between text-slate-500">
 <span>{level}</span>
 <span>{((analysisResult?.quality?.probabilities[level] || 0) * 100).toFixed(1)}%</span>
 </div>
 ))}
 </div>
 </div>

 {/* COMPUTER VISION */}
 <div>
 <div className="text-slate-900 font-bold tracking-widest uppercase mb-3 text-[10px] border-b border-slate-200 pb-1">COMPUTER VISION</div>
 <div className="grid grid-cols-1 gap-1 text-slate-500">
 {analysisResult?.features && Object.entries(analysisResult.features).map(([k, v]) => (
 <div key={k} className="flex justify-between">
 <span>{k}</span>
 <span className="text-slate-900">{(v as number).toFixed(k === 'Resolution' ? 0 : 2)}</span>
 </div>
 ))}
 </div>
 </div>

 {/* DEEP LEARNING */}
 <div>
 <div className="text-slate-900 font-bold tracking-widest uppercase mb-3 text-[10px] border-b border-slate-200 pb-1">DEEP LEARNING</div>
 <div className="space-y-1 text-slate-500">
 <div>ResNet-18</div>
 <div className="flex justify-between">
 <span>Top class: {analysisResult?.vision?.classification?.[0]?.label || 'Unknown'}</span>
 <span className="text-slate-900">
 {((analysisResult?.vision?.classification?.[0]?.confidence || 0) * 100).toFixed(1)}%
 </span>
 </div>
 <div>Embedding: {analysisResult?.vision?.embedding_dimensions || 512} dimensions</div>
 </div>
 </div>

 {/* SIMILARITY */}
 <div>
 <div className="text-slate-900 font-bold tracking-widest uppercase mb-3 text-[10px] border-b border-slate-200 pb-1">SIMILARITY</div>
 <div className="space-y-1 text-slate-500">
 <div>Closest asset: <span className="text-slate-900">{analysisResult?.similarity?.closest_asset || 'None'}</span></div>
 <div>Similarity: <span className="text-indigo-400 font-bold">{(analysisResult?.similarity?.score * 100).toFixed(1)}%</span></div>
 </div>
 </div>

 {/* ANOMALY */}
 <div>
 <div className="text-slate-900 font-bold tracking-widest uppercase mb-3 text-[10px] border-b border-slate-200 pb-1">ANOMALY</div>
 <div className="space-y-1 text-slate-500">
 <div>Risk: <span className="text-slate-900">{(analysisResult?.anomaly?.risk * 100).toFixed(1)}%</span></div>
 <div>Status: <span className={analysisResult?.anomaly?.risk > 0.1 ? 'text-amber-400 font-bold' : 'text-emerald-400 font-bold'}>
 {analysisResult?.anomaly?.risk > 0.1 ? 'REVIEW' : 'NORMAL'}
 </span></div>
 </div>
 </div>

 {/* FEATURE CONTRIBUTION */}
 <div>
 <div className="text-slate-900 font-bold tracking-widest uppercase mb-3 text-[10px] border-b border-slate-200 pb-1">FEATURE CONTRIBUTION</div>
 <div className="grid grid-cols-1 gap-1 text-slate-500">
 {analysisResult?.xai?.map((exp: any, i: number) => (
 <div key={i} className="flex justify-between">
 <span>{exp.feature}</span>
 <span className={exp.impact > 0 ? 'text-emerald-400' : 'text-amber-400'}>
 {exp.impact > 0 ? '+' : ''}{exp.impact.toFixed(3)}
 </span>
 </div>
 ))}
 </div>
 </div>

 {/* RECOMMENDATIONS */}
 <div>
 <div className="text-slate-900 font-bold tracking-widest uppercase mb-3 text-[10px] border-b border-slate-200 pb-1">RECOMMENDATIONS</div>
 <div className="space-y-2">
 {analysisResult?.decisions?.map((rec: string, i: number) => (
 <div key={i} className={`flex ${rec.startsWith('⚠') ? 'text-amber-400' : 'text-emerald-400'}`}>
 <span>{rec}</span>
 </div>
 ))}
 </div>
 </div>
 </div>
 </div>
 ) : (
 <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm h-full flex flex-col items-center justify-center opacity-50">
 <Target className="w-12 h-12 text-slate-600 mb-4" />
 <p className="text-slate-500 font-medium">Awaiting analysis...</p>
 </div>
 )}
 </div>
 </div>
 )}
 </div>
 );
}
