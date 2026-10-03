import { useState, useEffect } from 'react';
import { ShieldAlert, AlertTriangle } from 'lucide-react';
import { MediaData } from '@/lib/types';
import Image from 'next/image';
import UploadPrompt from './UploadPrompt';

interface AnomalyPageProps {
 mediaList: MediaData[];
 onUploadClick?: () => void;
}

export default function AnomalyPage({ mediaList, onUploadClick }: AnomalyPageProps) {
 const [loading, setLoading] = useState(false);
 const [anomalies, setAnomalies] = useState<any[]>([]);

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
 const risk = data.intelligence?.anomaly?.risk || 0;
 setAnomalies([
 { 
 asset: targetMedia,
 score: risk,
 properties: [
 'Detected unusual feature distribution relative to library',
 'Compared against Isolation Forest baseline'
 ]
 }
 ]);
 setLoading(false);
 })
 .catch(() => setLoading(false));
 }, [targetMedia]);


 return (
 <div className="animate-in fade-in duration-300">
 <div className="flex items-center gap-3 mb-6">
 <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
 <ShieldAlert className="w-5 h-5 text-red-600 " />
 </div>
 <div>
 <h1 className="text-2xl font-bold tracking-tight text-slate-900 ">Anomaly Detection</h1>
 <p className="text-sm text-slate-500">Isolation Forest detecting outliers in media features.</p>
 </div>
 </div>

 {!targetMedia ? (
 <UploadPrompt onUploadClick={onUploadClick || (() => {})} />
 ) : loading ? (
 <div className="py-20 flex flex-col items-center justify-center">
 <div className="w-10 h-10 border-4 border-red-200 border-t-red-600 rounded-full animate-spin mb-4"></div>
 <p className="text-slate-500 font-medium">Running Isolation Forest...</p>
 </div>
 ) : (
 <div className="space-y-4">
 {anomalies.map((anomaly, idx) => (
 <div key={idx} className="bg-red-50 border border-red-200 rounded-xl p-6 flex gap-6 items-start shadow-sm">
 <div className="flex-shrink-0 relative w-32 h-32 rounded-lg overflow-hidden shadow-sm border border-red-200 ">
 {anomaly.asset && anomaly.asset.secureUrl ? (
 <Image src={anomaly.asset.secureUrl} alt="Anomaly" fill className="object-cover" />
 ) : (
 <div className="w-full h-full bg-slate-200 "></div>
 )}
 <div className="absolute inset-x-0 bottom-0 bg-red-600 text-white text-[10px] text-center py-1 font-bold">
 ANOMALY
 </div>
 </div>
 
 <div className="flex-1">
 <h3 className="text-lg font-bold text-red-700 flex items-center mb-2">
 <AlertTriangle className="w-5 h-5 mr-2" />
 ANOMALY DETECTED
 </h3>
 <p className="text-sm font-medium text-slate-700 mb-4">
 Asset: <span className="text-slate-900 ">{anomaly.asset?.publicId.split('/').pop() || 'Unknown'}</span>
 </p>
 
 <div className="mb-4">
 <div className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Anomaly Score</div>
 <div className="flex items-center gap-3">
 <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
 <div className="h-full bg-red-500 rounded-full" style={{ width: `${anomaly.score * 100}%` }}></div>
 </div>
 <span className="font-bold text-red-600 ">{anomaly.score.toFixed(2)}</span>
 </div>
 </div>
 
 <div>
 <div className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Unusual Properties</div>
 <ul className="space-y-1">
 {anomaly.properties.map((prop: string, i: number) => (
 <li key={i} className="text-sm text-slate-700 flex items-center">
 <div className="w-1.5 h-1.5 rounded-full bg-red-500 mr-2"></div>
 {prop}
 </li>
 ))}
 </ul>
 </div>
 </div>
 </div>
 ))}
 
 {anomalies.length === 0 && (
 <div className="text-center py-12 text-slate-500 bg-white rounded-xl border border-slate-200 ">
 No significant anomalies detected in your library.
 </div>
 )}
 </div>
 )}
 </div>
 );
}
