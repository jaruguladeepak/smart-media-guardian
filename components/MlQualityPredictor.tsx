import { useState, useEffect } from 'react';
import { MediaData } from '@/lib/types';
import { Loader2, AlertCircle } from 'lucide-react';
import Image from 'next/image';

interface MlQualityPredictorProps {
 media: MediaData;
 onBack: () => void;
 mlStatus: 'checking' | 'online' | 'offline';
}

interface PredictionData {
 prediction: string;
 confidence: number;
 features: Record<string, number>;
 explanation: { name: string; weight: number }[];
}

export default function MlQualityPredictor({ media, onBack, mlStatus }: MlQualityPredictorProps) {
 const [data, setData] = useState<PredictionData | null>(null);
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState<string | null>(null);

 useEffect(() => {
 if (mlStatus !== 'online') return;
 
 setLoading(true);
 setError(null);
 
 // We send the Cloudinary secure URL to the Python FastAPI backend
 fetch('http://localhost:8000/api/ml/quality', {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({ url: media.secureUrl })
 })
 .then(res => {
 if (!res.ok) throw new Error('Inference failed');
 return res.json();
 })
 .then(resData => {
 setData(resData);
 setLoading(false);
 })
 .catch(err => {
 console.error(err);
 setError('Failed to extract features and run model. Make sure the Python service is running.');
 setLoading(false);
 });
 }, [media.secureUrl, mlStatus]);

 if (mlStatus !== 'online') {
 return (
 <div className="h-full min-h-[300px] flex flex-col items-center justify-center p-6 text-center">
 <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
 <h3 className="text-lg font-medium text-slate-900 mb-2">ML Backend Offline</h3>
 <p className="text-sm text-slate-500 max-w-sm">
 Please start the Python FastAPI service on port 8000 to enable machine learning inference.
 </p>
 <button onClick={onBack} className="mt-6 px-4 py-2 bg-slate-100 rounded-lg text-sm font-medium">
 Select Another Asset
 </button>
 </div>
 );
 }

 if (loading || !data) {
 return (
 <div className="h-full min-h-[300px] flex flex-col items-center justify-center">
 <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-4" />
 <p className="text-sm text-slate-500 animate-pulse">Running Random Forest Inference...</p>
 </div>
 );
 }

 const formatValue = (key: string, val: number) => {
 if (key === 'Resolution') return (val / 1000000).toFixed(2) + ' MP';
 if (key === 'AspectRatio') return val.toFixed(2);
 return val.toFixed(3);
 };

 const getPredictionColor = (pred: string) => {
 switch (pred.toUpperCase()) {
 case 'EXCELLENT': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
 case 'GOOD': return 'bg-blue-100 text-blue-800 border-blue-200';
 case 'AVERAGE': return 'bg-amber-100 text-amber-800 border-amber-200';
 default: return 'bg-red-100 text-red-800 border-red-200';
 }
 };

 return (
 <div className="space-y-6">
 <div className="flex items-center justify-between">
 <button onClick={onBack} className="text-xs font-medium text-slate-500 hover:text-slate-900 :text-white transition-colors">
 ← Back to selection
 </button>
 </div>

 <div className="flex flex-col md:flex-row gap-6">
 
 {/* Left Col: Image & Prediction */}
 <div className="w-full md:w-1/3 space-y-4">
 <div className="aspect-square rounded-xl overflow-hidden bg-slate-100 relative">
 <img src={media.secureUrl} alt="Analyzed media" className="w-full h-full object-contain" />
 </div>
 
 <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 text-center">
 <h4 className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-2">Random Forest Prediction</h4>
 <div className={`text-xl font-bold py-2 rounded-lg border ${getPredictionColor(data.prediction)}`}>
 {data.prediction}
 </div>
 <div className="mt-3 text-sm font-medium text-slate-600 ">
 Confidence: {(data.confidence * 100).toFixed(1)}%
 </div>
 </div>
 </div>

 {/* Right Col: Features & Explainability */}
 <div className="w-full md:w-2/3 space-y-6">
 
 {/* Explainability */}
 <div>
 <h4 className="text-sm font-semibold text-slate-900 mb-3">Model Explainability (Top Features)</h4>
 <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-3">
 {data.explanation.map((item, idx) => (
 <div key={idx} className="space-y-1">
 <div className="flex justify-between text-xs">
 <span className="font-medium text-slate-700 ">{item.name}</span>
 <span className="text-indigo-600 font-mono">{(item.weight * 100).toFixed(1)}% influence</span>
 </div>
 <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
 <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${Math.min(item.weight * 300, 100)}%` }}></div>
 </div>
 </div>
 ))}
 </div>
 </div>

 {/* Raw Extracted Features */}
 <div>
 <h4 className="text-sm font-semibold text-slate-900 mb-3">Extracted OpenCV Features</h4>
 <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
 {Object.entries(data.features).map(([key, val]) => (
 <div key={key} className="bg-slate-50 p-3 rounded-lg border border-slate-100 ">
 <p className="text-[10px] uppercase font-bold text-slate-400 mb-1 truncate">{key}</p>
 <p className="font-mono text-sm font-medium text-slate-700 ">{formatValue(key, val as number)}</p>
 </div>
 ))}
 </div>
 </div>

 </div>
 </div>
 </div>
 );
}
