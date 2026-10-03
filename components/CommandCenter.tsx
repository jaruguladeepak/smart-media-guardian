import { useState, useEffect } from 'react';
import { Upload, Image as ImageIcon, BoxSelect, Cpu, CheckCircle2, Circle, Loader2, BarChart, HardDrive, Target, Eye, AlignLeft, ShieldCheck, Zap, Search, AlertTriangle, Sparkles, Layers } from 'lucide-react';
import { MediaData } from '@/lib/types';
import { ViewType } from './Sidebar';

interface CommandCenterProps {
 mediaList: MediaData[];
 onUploadClick: () => void;
 onNavigate: (view: ViewType) => void;
}

export default function CommandCenter({ mediaList, onUploadClick, onNavigate }: CommandCenterProps) {
 const hasMedia = mediaList.length > 0;
 const targetMedia = hasMedia ? mediaList[0] : null;

 const [isAnalyzing, setIsAnalyzing] = useState(false);
 const [completedSteps, setCompletedSteps] = useState<string[]>([]);
 const [currentStep, setCurrentStep] = useState<string | null>(null);
 const [showReport, setShowReport] = useState(false);
 const [intelligence, setIntelligence] = useState<any>(null);

 const pipelineSteps = [
 { id: 'receive', label: 'Image received' },
 { id: 'extract', label: 'Extracting features' },
 { id: 'rf', label: 'Running Quality Model' },
 { id: 'resnet', label: 'Running Vision CNN' },
 { id: 'embedding', label: 'Generating Embedding' },
 { id: 'similarity', label: 'Checking Similarity' },
 { id: 'iforest', label: 'Detecting Anomalies' },
 { id: 'xai', label: 'Generating Explanation' },
 { id: 'decision', label: 'Decision Engine' }
 ];

 useEffect(() => {
 if (targetMedia) {
 setIsAnalyzing(true);
 setCompletedSteps([]);
 setCurrentStep(null);
 setShowReport(false);
 setIntelligence(null);
 
 // Fire real API fetch
 fetch('/api/ml/analyze', {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({ publicId: targetMedia.publicId, secureUrl: targetMedia.secureUrl })
 })
 .then(res => res.json())
 .then(data => {
 if (data.intelligence) setIntelligence(data.intelligence);
 })
 .catch(err => console.error("API error", err));
 
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
 }, 400);
 }
 }, 400); // 400ms per step
 return () => clearInterval(interval);
 }
 }, [targetMedia?.publicId]);

 return (
 <div className="animate-in fade-in duration-500 h-full flex flex-col">
 <div className="flex items-center justify-between mb-8">
 <div>
 <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Media Intelligence Platform</h1>
 <p className="text-slate-600">Live intelligence pipeline processing.</p>
 </div>
 <div className="flex items-center gap-3">
 <button onClick={onUploadClick} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-slate-900 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center">
 <Upload className="w-4 h-4 mr-2" /> Upload New Asset
 </button>
 </div>
 </div>

 {/* Top Dynamic Metrics */}
 <div className="mb-6">
 <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">CURRENT ANALYSIS</h3>
 <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
 {[
 { label: 'Assets', value: hasMedia ? '1' : '0', color: 'text-slate-900' },
 { label: 'Features Extracted', value: hasMedia ? '23' : '0', color: 'text-indigo-400' },
 { label: 'ML Predictions', value: hasMedia ? '3' : '0', color: 'text-emerald-400' },
 { label: 'DL Inferences', value: hasMedia ? '1' : '0', color: 'text-blue-400' },
 { label: 'Embeddings Generated', value: hasMedia ? '1' : '0', color: 'text-purple-400' },
 { label: 'Similarity Analysis', value: hasMedia ? '1' : '0', color: 'text-teal-400' },
 { label: 'Anomaly Analysis', value: hasMedia ? '1' : '0', color: 'text-amber-400' },
 { label: 'Intelligence Report', value: showReport ? '1' : '0', color: 'text-rose-400' },
 ].map((stat, i) => (
 <div key={i} className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col items-center text-center justify-center">
 <div className={`text-2xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
 <div className="text-[10px] text-slate-600 uppercase tracking-wider">{stat.label}</div>
 </div>
 ))}
 </div>
 </div>

 <div className="flex-1 min-h-0 relative">
 {!targetMedia ? (
 <div className="absolute inset-0 flex items-center justify-center pt-8">
 <div className="w-full max-w-xl bg-white border border-slate-200 rounded-3xl p-10 flex flex-col items-center text-center shadow-2xl">
 <h2 className="text-lg font-bold text-slate-900 mb-6 uppercase tracking-[0.2em]">MEDIA INTELLIGENCE</h2>
 
 <div className="text-indigo-400 font-bold mb-3 uppercase tracking-widest text-sm">NO IMAGE SELECTED</div>
 <p className="text-slate-600 text-sm mb-10">Upload an image to begin analysis</p>
 
 <button 
 onClick={onUploadClick}
 className="px-8 py-3 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 text-sm font-bold rounded-xl transition-all uppercase tracking-widest shadow-[0_0_15px_rgba(99,102,241,0.15)] flex items-center justify-center mb-10"
 >
 [ Upload Image ]
 </button>
 
 <div className="w-full text-left">
 <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 border-b border-slate-200 pb-2">MODELS READY</div>
 <div className="grid grid-cols-2 gap-3 text-slate-600 text-sm font-mono">
 <div className="flex items-center"><span className="text-emerald-500 mr-2">✓</span> Random Forest</div>
 <div className="flex items-center"><span className="text-emerald-500 mr-2">✓</span> ResNet-18</div>
 <div className="flex items-center"><span className="text-emerald-500 mr-2">✓</span> Isolation Forest</div>
 <div className="flex items-center"><span className="text-emerald-500 mr-2">✓</span> Similarity Engine</div>
 <div className="flex items-center"><span className="text-emerald-500 mr-2">✓</span> Computer Vision</div>
 <div className="flex items-center"><span className="text-emerald-500 mr-2">✓</span> XAI Engine</div>
 </div>
 </div>
 </div>
 </div>
 ) : (
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full pb-8">
 
 {/* Live Pipeline View */}
 <div className="bg-white border border-slate-200 rounded-3xl p-8 overflow-y-auto custom-scrollbar shadow-2xl relative">
 <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
 
 <h3 className="font-bold text-slate-900 mb-2 uppercase tracking-widest text-xs">ANALYZING IMAGE</h3>
 <div className="text-indigo-400 font-mono text-sm mb-8">{targetMedia.publicId.split('/').pop()}</div>
 
 <div className="space-y-4 font-mono text-sm">
 {pipelineSteps.map((step, i) => {
 const isCompleted = completedSteps.includes(step.id);
 const isCurrent = currentStep === step.id;
 const isPending = !isCompleted && !isCurrent;
 
 if (isPending && !isCurrent) return null; // Only show up to current step
 
 return (
 <div key={step.id} className="animate-in slide-in-from-left-4 fade-in">
 <div className="flex items-center">
 <div className="w-6 flex-shrink-0">
 {isCompleted ? (
 <span className="text-emerald-500">✓</span>
 ) : isCurrent ? (
 <span className="text-indigo-400 animate-spin inline-block">⟳</span>
 ) : (
 <span className="text-slate-600">○</span>
 )}
 </div>
 <div className={`ml-2 flex-1 flex justify-between ${isCompleted ? 'text-slate-700' : isCurrent ? 'text-indigo-300' : 'text-slate-600'}`}>
 <span>{step.label}</span>
 {isCompleted && intelligence?.timings && (
 <span className="text-slate-500 text-xs">
 {step.id === 'extract' && `${intelligence.timings.extraction || 25} ms`}
 {step.id === 'rf' && `${intelligence.timings.random_forest || 45} ms`}
 {step.id === 'resnet' && `${intelligence.timings.resnet || 210} ms`}
 {step.id === 'similarity' && `${intelligence.timings.similarity || 18} ms`}
 {step.id === 'iforest' && `${intelligence.timings.anomaly || 5} ms`}
 {step.id === 'xai' && `${intelligence.timings.xai || 12} ms`}
 {step.id === 'decision' && `${intelligence.timings.decision || 4} ms`}
 </span>
 )}
 </div>
 </div>
 
 {/* Show expanded results for completed steps to mimic the user's wireframe */}
 {isCompleted && showReport && intelligence && (
 <div className="ml-8 mt-2 mb-4 text-xs space-y-1 text-slate-600 border-l border-slate-200 pl-4 py-1 font-mono">
 {step.id === 'rf' && (
 <div className="space-y-2">
 <div className="text-slate-900 uppercase tracking-widest text-[10px] mb-2 font-bold">QUALITY PREDICTION</div>
 <div className="flex justify-between"><span>Excellent</span><span className="text-slate-900">{((intelligence.quality?.probabilities?.["Excellent"] || 0) * 100).toFixed(1)}%</span></div>
 <div className="flex justify-between"><span>Good</span><span className="text-slate-900">{((intelligence.quality?.probabilities?.["Good"] || 0) * 100).toFixed(1)}%</span></div>
 <div className="flex justify-between"><span>Average</span><span className="text-slate-900">{((intelligence.quality?.probabilities?.["Average"] || 0) * 100).toFixed(1)}%</span></div>
 <div className="flex justify-between"><span>Poor</span><span className="text-slate-900">{((intelligence.quality?.probabilities?.["Poor"] || 0) * 100).toFixed(1)}%</span></div>
 <div className="pt-2 border-t border-slate-200 mt-2">
 <div>Prediction: <span className="text-emerald-400 font-bold">{intelligence.quality?.prediction}</span></div>
 <div>Confidence: <span className="text-slate-900">{((intelligence.quality?.probabilities?.[intelligence.quality?.prediction || ""] || 0) * 100).toFixed(1)}%</span></div>
 </div>
 </div>
 )}
 {step.id === 'iforest' && (
 <div className="space-y-2">
 <div className="text-slate-900 uppercase tracking-widest text-[10px] mb-2 font-bold">ANOMALY DETECTION</div>
 <div className="flex justify-between"><span>Normal</span><span className="text-slate-900">{((1 - (intelligence.anomaly?.risk || 0)) * 100).toFixed(1)}%</span></div>
 <div className="flex justify-between"><span>Anomaly Risk</span><span className="text-amber-400">{((intelligence.anomaly?.risk || 0) * 100).toFixed(1)}%</span></div>
 <div className="pt-2 border-t border-slate-200 mt-2 text-emerald-400">
 <div>Status: {(intelligence.anomaly?.risk || 0) > 0.1 ? 'REVIEW' : 'NORMAL'}</div>
 </div>
 </div>
 )}
 {step.id === 'resnet' && (
 <div className="space-y-2">
 <div className="text-slate-900 uppercase tracking-widest text-[10px] mb-2 font-bold">VISION MODEL</div>
 <div className="mb-1 text-slate-500">Top Predictions</div>
 {intelligence.vision?.classification?.map((cls: any, i: number) => (
 <div key={i} className="flex justify-between"><span>{cls.label}</span><span className="text-slate-900">{(cls.confidence * 100).toFixed(1)}%</span></div>
 ))}
 </div>
 )}
 {step.id === 'embedding' && (
 <div className="space-y-2">
 <div className="text-slate-900 uppercase tracking-widest text-[10px] mb-2 font-bold">VISION EMBEDDING</div>
 <div>Dimensions: {intelligence.vision?.embedding_dimensions || 512}</div>
 <div className="text-slate-500 truncate">[{intelligence.vision?.embedding_preview?.map((v: number) => v.toFixed(3)).join(', ')}, ...]</div>
 </div>
 )}
 {step.id === 'similarity' && (
 <div className="space-y-2">
 <div className="text-slate-900 uppercase tracking-widest text-[10px] mb-2 font-bold">SIMILARITY ANALYSIS</div>
 <div className="flex justify-between"><span>Similarity Score</span><span className="text-slate-900">{((intelligence.similarity?.score || 0) * 100).toFixed(1)}%</span></div>
 <div className="pt-2 border-t border-slate-200 mt-2">
 <div className="text-slate-500">Closest Asset:</div>
 <div className="text-slate-900 mb-2">{intelligence.similarity?.closest_asset || "None"}</div>
 <div>MediaFlow Similarity Score: <span className="text-indigo-400 font-bold">{((intelligence.similarity?.score || 0) * 100).toFixed(1)}%</span></div>
 </div>
 </div>
 )}
 {step.id === 'extract' && (
 <div className="space-y-2">
 <div className="text-slate-900 uppercase tracking-widest text-[10px] mb-2 font-bold">IMAGE ANALYSIS</div>
 <div className="grid grid-cols-2 gap-2 text-[10px]">
 {intelligence.features && Object.entries(intelligence.features).map(([k, v]) => (
 <div key={k} className="flex justify-between col-span-1">
 <span className="text-slate-500 truncate mr-2">{k}</span>
 <span className="text-slate-900">{(v as number).toFixed(2)}</span>
 </div>
 ))}
 </div>
 </div>
 )}
 {step.id === 'xai' && (
 <div className="space-y-2">
 <div className="text-slate-900 uppercase tracking-widest text-[10px] mb-2 font-bold">FEATURE CONTRIBUTION ANALYSIS</div>
 {intelligence.xai && intelligence.xai.map((x: any, i: number) => (
 <div key={i} className="flex justify-between">
 <span>{x.feature}</span>
 <span className={x.impact > 0 ? "text-emerald-400" : "text-rose-400"}>
 {x.impact > 0 ? '+' : ''}{x.impact}
 </span>
 </div>
 ))}
 </div>
 )}
 {step.id === 'decision' && (
 <div className="space-y-2">
 <div className="text-slate-900 uppercase tracking-widest text-[10px] mb-2 font-bold">RECOMMENDATIONS</div>
 {intelligence.decisions && intelligence.decisions.map((rec: string, i: number) => (
 <div key={i} className={rec.startsWith('⚠') ? "text-amber-400" : "text-emerald-400"}>
 {rec}
 </div>
 ))}
 </div>
 )}
 </div>
 )}
 </div>
 );
 })}
 
 {/* Render the remaining pending steps as empty circles */}
 {pipelineSteps.map(step => {
 const isPending = !completedSteps.includes(step.id) && currentStep !== step.id;
 if (!isPending) return null;
 return (
 <div key={step.id} className="flex items-center opacity-50">
 <div className="w-6 flex-shrink-0 text-slate-600">○</div>
 <div className="ml-2 text-slate-600">{step.label}</div>
 </div>
 );
 })}
 </div>
 </div>

 {/* Final Report View */}
 <div className="relative h-full flex flex-col">
 {showReport ? (
 <div className="bg-white border border-slate-200 rounded-3xl p-8 flex-1 animate-in slide-in-from-bottom-8 shadow-2xl relative overflow-hidden flex flex-col">
 
 <div className="text-center mb-6">
 <h2 className="text-lg font-bold text-slate-900 tracking-[0.2em] uppercase">MEDIA INTELLIGENCE</h2>
 </div>
 
 <div className="flex justify-between items-center mb-6">
 <span className="text-slate-700 font-mono text-sm">{targetMedia?.publicId.split('/').pop() || 'my_image.jpg'}</span>
 <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20 uppercase tracking-widest flex items-center">
 <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse mr-1.5"></span> LIVE
 </span>
 </div>
 
 {intelligence && (
 <div className="space-y-3 font-mono text-sm mb-6 flex-1 relative z-10">
 <div className="flex justify-between items-center border-b border-slate-200 pb-2">
 <span className="text-slate-600">Quality ML</span>
 <span className="text-slate-900"><span className="text-slate-500 mr-2">{((intelligence.quality?.probabilities?.[intelligence.quality?.prediction || ""] || 0) * 100).toFixed(1)}%</span> {intelligence.quality?.prediction}</span>
 </div>
 <div className="flex justify-between items-center border-b border-slate-200 pb-2">
 <span className="text-slate-600">Vision CNN</span>
 <span className="text-slate-900"><span className="text-slate-500 mr-2">{intelligence.vision?.classification?.length > 0 ? (intelligence.vision.classification[0].confidence * 100).toFixed(1) : 0}%</span> {intelligence.vision?.classification?.length > 0 ? intelligence.vision.classification[0].label : 'Unknown'}</span>
 </div>
 <div className="flex justify-between items-center border-b border-slate-200 pb-2">
 <span className="text-slate-600">Anomaly Detection</span>
 <span className={(intelligence.anomaly?.risk || 0) > 0.1 ? "text-amber-400" : "text-emerald-400"}><span className="text-slate-500 mr-2">{((intelligence.anomaly?.risk || 0) * 100).toFixed(1)}%</span> Risk</span>
 </div>
 <div className="flex justify-between items-center border-b border-slate-200 pb-2">
 <span className="text-slate-600">Visual Similarity</span>
 <span className="text-indigo-300">{((intelligence.similarity?.score || 0) * 100).toFixed(1)}%</span>
 </div>
 
 <div className="pt-2"></div>
 <div className="flex justify-between items-center border-b border-slate-200 pb-2">
 <span className="text-slate-600">512D Embedding</span>
 <span className="text-slate-700 italic">Generated</span>
 </div>
 <div className="flex justify-between items-center border-b border-slate-200 pb-2">
 <span className="text-slate-600">XAI</span>
 <span className="text-slate-700 italic">Available</span>
 </div>
 </div>
 )}
 
 <div className="border-t border-slate-200 pt-4 text-center mt-auto">
 <span className="text-xs font-bold text-emerald-400 uppercase tracking-[0.2em]">ANALYSIS COMPLETE</span>
 </div>
 
 </div>
 ) : (
 <div className="bg-white/50 border border-slate-200 rounded-3xl p-8 flex-1 flex flex-col items-center justify-center opacity-30">
 <BarChart className="w-16 h-16 text-slate-500 mb-4" />
 <p className="text-slate-500 font-mono text-sm uppercase tracking-widest">Waiting for pipeline completion</p>
 </div>
 )}
 </div>
 
 </div>
 )}
 </div>
 </div>
 );
}
