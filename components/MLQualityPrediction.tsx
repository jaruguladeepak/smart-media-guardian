import { useState, useEffect } from 'react';
import { BrainCircuit, Loader2, BarChart2 } from 'lucide-react';
import { MediaData } from '@/lib/types';

interface MLQualityPredictionProps {
 media: MediaData;
}

export default function MLQualityPrediction({ media }: MLQualityPredictionProps) {
 const [data, setData] = useState<any>(null);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState(false);

 useEffect(() => {
 const fetchPrediction = async () => {
 try {
 const backendUrl = process.env.NEXT_PUBLIC_ML_API_URL || 'http://127.0.0.1:8000';
 const response = await fetch(`${backendUrl}/api/ml/quality`, {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({
 url: media.secureUrl || ""
 })
 });
 if (response.ok) {
 const json = await response.json();
 setData(json);
 } else {
 setError(true);
 }
 } catch (e) {
 setError(true);
 } finally {
 setLoading(false);
 }
 };
 fetchPrediction();
 }, [media]);

 if (loading) {
 return (
 <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col items-center justify-center h-48">
 <Loader2 className="w-6 h-6 text-indigo-500 animate-spin mb-3" />
 <p className="text-sm text-slate-500 font-medium">Running ML Inference...</p>
 </div>
 );
 }

 if (error || !data) {
 return (
 <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
 <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">ML Quality Prediction</h3>
 <div className="text-sm text-slate-400 p-3 bg-slate-50 rounded-lg">
 Python ML service is not running. Start the service to enable Media Quality ML predictions.
 </div>
 </div>
 );
 }

 const qualityColor = data.prediction === 'Excellent' ? 'text-emerald-500' : 
 data.prediction === 'Good' ? 'text-blue-500' : 
 data.prediction === 'Average' ? 'text-amber-500' : 'text-red-500';

 return (
 <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm relative overflow-hidden group">
 <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>
 
 <div className="flex items-center justify-between mb-4">
 <h3 className="text-sm font-bold text-slate-700 flex items-center gap-1.5 uppercase tracking-wider">
 <BrainCircuit className="w-4 h-4 text-indigo-500" />
 ML Quality Model
 </h3>
 <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-600 border border-indigo-100 ">
 {(data.confidence * 100).toFixed(1)}% CONFIDENCE
 </span>
 </div>
 
 <div className="mb-5 text-center">
 <div className={`text-3xl font-extrabold uppercase tracking-tight ${qualityColor} drop-shadow-sm mb-1`}>
 {data.prediction}
 </div>
 <div className="text-xs text-slate-400 flex items-center justify-center gap-1">
 <BarChart2 className="w-3 h-3" />
 Random Forest Classifier
 </div>
 </div>
 
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
 {/* Features Block */}
 <div className="space-y-3">
 <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-1">
 Image Features
 </div>
 <div className="grid grid-cols-1 gap-1.5">
 {Object.entries(data.features || {}).map(([key, value]: [string, any]) => (
 <div key={key} className="flex justify-between items-center text-xs">
 <span className="text-slate-600 font-medium">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
 <span className="text-slate-900 font-mono text-[11px]">
 {typeof value === 'number' ? (value > 100 ? value.toLocaleString() : value.toFixed(3)) : value}
 </span>
 </div>
 ))}
 </div>
 </div>

 {/* Probabilities Block */}
 <div className="space-y-3">
 <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-1">
 Probabilities
 </div>
 <div className="grid grid-cols-1 gap-1.5">
 {['Poor', 'Average', 'Good', 'Excellent'].map((label) => {
 const prob = data.probabilities ? data.probabilities[label] : 0;
 const probPercent = ((prob || 0) * 100).toFixed(1);
 return (
 <div key={label} className="flex justify-between items-center text-xs">
 <span className="text-slate-600 font-medium">{label}</span>
 <div className="flex items-center gap-2">
 <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
 <div className="h-full bg-indigo-500/70" style={{ width: `${probPercent}%` }}></div>
 </div>
 <span className="text-slate-500 w-8 text-right font-mono text-[11px]">{probPercent}%</span>
 </div>
 </div>
 );
 })}
 </div>
 </div>
 </div>
 </div>
 );
}
