import { useState, useEffect } from 'react';
import { MediaData } from '@/lib/types';
import { Activity, Beaker, Zap, BarChart, Server } from 'lucide-react';
import MlQualityPredictor from './MlQualityPredictor';

interface MlDashboardProps {
 mediaList: MediaData[];
 selectedMedia: MediaData | null;
 onSelectMedia: (media: MediaData) => void;
}

export default function MlDashboard({ mediaList, selectedMedia, onSelectMedia }: MlDashboardProps) {
 const [mlStatus, setMlStatus] = useState<'checking' | 'online' | 'offline'>('checking');
 
 useEffect(() => {
 // Check if Python ML Service is online
 fetch('http://localhost:8000/api/ml/status')
 .then(res => res.json())
 .then(data => {
 if (data.status === 'online') setMlStatus('online');
 else setMlStatus('offline');
 })
 .catch(() => setMlStatus('offline'));
 }, []);

 return (
 <div className="animate-in fade-in duration-300">
 <div className="flex items-center justify-between mb-6">
 <div>
 <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center">
 <Beaker className="w-6 h-6 mr-3 text-indigo-500" />
 Machine Learning Dashboard
 </h1>
 <p className="text-sm text-slate-500 mt-1">Live inference pipeline running locally via Python/FastAPI.</p>
 </div>
 
 <div className={`flex items-center px-3 py-1.5 rounded-full text-xs font-medium border ${mlStatus === 'online' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : mlStatus === 'checking' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
 <Server className="w-3.5 h-3.5 mr-1.5" />
 ML Service: {mlStatus.toUpperCase()}
 </div>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
 
 {/* Quality Predictor */}
 <div className="lg:col-span-2">
 <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm h-full flex flex-col">
 <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50 ">
 <h3 className="font-semibold flex items-center text-slate-900 ">
 <Zap className="w-5 h-5 mr-2 text-indigo-500" />
 Media Quality Prediction (Random Forest)
 </h3>
 </div>
 
 <div className="p-5 flex-1">
 {!selectedMedia ? (
 <div className="h-full min-h-[300px] flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl">
 <div className="text-center p-6">
 <h4 className="text-slate-900 font-medium mb-2">Select Media for Inference</h4>
 <p className="text-sm text-slate-500 mb-6 max-w-sm">Choose an asset from your library to extract OpenCV features and run Random Forest quality classification.</p>
 <div className="flex gap-2 justify-center flex-wrap max-w-md mx-auto">
 {mediaList.slice(0, 4).map(media => (
 <button 
 key={media.publicId}
 onClick={() => onSelectMedia(media)}
 className="w-16 h-16 rounded-lg overflow-hidden border-2 border-transparent hover:border-indigo-500 transition-colors"
 >
 <img src={media.secureUrl} alt="Thumbnail" className="w-full h-full object-cover" />
 </button>
 ))}
 </div>
 </div>
 </div>
 ) : (
 <MlQualityPredictor media={selectedMedia} onBack={() => onSelectMedia(null as any)} mlStatus={mlStatus} />
 )}
 </div>
 </div>
 </div>

 {/* Current Architecture Details */}
 <div className="space-y-6">
 <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
 <h4 className="font-semibold text-slate-900 flex items-center mb-4">
 <BarChart className="w-4 h-4 mr-2 text-slate-500" /> Model Specs
 </h4>
 <div className="space-y-3 text-sm">
 <div className="flex justify-between pb-2 border-b border-slate-100 ">
 <span className="text-slate-500">Algorithm</span>
 <span className="font-medium text-slate-900 ">Random Forest Classifier</span>
 </div>
 <div className="flex justify-between pb-2 border-b border-slate-100 ">
 <span className="text-slate-500">Feature Extraction</span>
 <span className="font-medium text-slate-900 ">OpenCV + NumPy</span>
 </div>
 <div className="flex justify-between pb-2 border-b border-slate-100 ">
 <span className="text-slate-500">Input Features</span>
 <span className="font-medium text-slate-900 ">9 (Resolution, Sharpness...)</span>
 </div>
 <div className="flex justify-between pb-2 border-b border-slate-100 ">
 <span className="text-slate-500">Test Accuracy</span>
 <span className="font-medium text-emerald-600 ">~74.19%</span>
 </div>
 </div>
 </div>
 </div>
 
 </div>
 </div>
 );
}
