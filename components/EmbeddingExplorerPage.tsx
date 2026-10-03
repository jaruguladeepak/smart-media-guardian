import { useState, useEffect } from 'react';
import { ScatterChart, ZoomIn, Target } from 'lucide-react';
import { MediaData } from '@/lib/types';
import Image from 'next/image';

interface EmbeddingExplorerPageProps {
 mediaList: MediaData[];
}

export default function EmbeddingExplorerPage({ mediaList }: EmbeddingExplorerPageProps) {
 const [loading, setLoading] = useState(false);
 const [points, setPoints] = useState<any[]>([]);
 const [hoveredPoint, setHoveredPoint] = useState<any>(null);

 useEffect(() => {
 if (mediaList.length < 3) return;
 
 setLoading(true);
 setTimeout(() => {
 // Mock PCA 2D coordinates for UI display
 const mockPoints = mediaList.map((m, i) => ({
 id: m.publicId,
 url: m.secureUrl,
 x: Math.random() * 80 + 10, // 10% to 90%
 y: Math.random() * 80 + 10,
 cluster: i % 4
 }));
 setPoints(mockPoints);
 setLoading(false);
 }, 1500);
 }, [mediaList]);

 const clusterColors = [
 'bg-blue-500',
 'bg-emerald-500',
 'bg-amber-500',
 'bg-pink-500'
 ];

 return (
 <div className="animate-in fade-in duration-300 flex flex-col h-full">
 <div className="flex items-center gap-3 mb-6 flex-shrink-0">
 <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
 <ScatterChart className="w-5 h-5 text-violet-600 " />
 </div>
 <div>
 <h1 className="text-2xl font-bold tracking-tight text-slate-900 ">Embedding Explorer (PCA)</h1>
 <p className="text-sm text-slate-500">512D ResNet vectors projected into 2D space for visual clustering analysis.</p>
 </div>
 </div>

 <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex relative min-h-[500px]">
 
 {loading || mediaList.length < 3 ? (
 <div className="absolute inset-0 flex flex-col items-center justify-center">
 {loading ? (
 <>
 <div className="w-10 h-10 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin mb-4"></div>
 <p className="text-slate-500 font-medium">Computing PCA dimensionality reduction...</p>
 </>
 ) : (
 <p className="text-slate-500">Please upload at least 3 assets to plot the embedding space.</p>
 )}
 </div>
 ) : (
 <>
 {/* The Plot */}
 <div className="flex-1 relative bg-slate-50 ] overflow-hidden" 
 style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)', backgroundSize: '40px 40px' }}>
 
 {/* Axes lines */}
 <div className="absolute inset-x-0 top-1/2 h-px bg-slate-200 "></div>
 <div className="absolute inset-y-0 left-1/2 w-px bg-slate-200 "></div>
 
 {/* Points */}
 {points.map((p, i) => (
 <div 
 key={i}
 className={`absolute w-3 h-3 rounded-full cursor-pointer transition-transform transform hover:scale-150 hover:z-10 shadow-sm border border-white ${clusterColors[p.cluster]}`}
 style={{ left: `${p.x}%`, top: `${p.y}%` }}
 onMouseEnter={() => setHoveredPoint(p)}
 onMouseLeave={() => setHoveredPoint(null)}
 ></div>
 ))}
 
 {/* Hover Preview Panel */}
 {hoveredPoint && (
 <div 
 className="absolute bg-white p-2 rounded-lg shadow-xl border border-slate-200 z-20 pointer-events-none transition-all duration-200"
 style={{ 
 left: `${hoveredPoint.x}%`, 
 top: `${hoveredPoint.y}%`,
 transform: 'translate(-50%, -120%)'
 }}
 >
 <div className="relative w-24 h-24 rounded overflow-hidden">
 <Image src={hoveredPoint.url} alt="Preview" fill className="object-cover" />
 </div>
 <div className="text-[10px] font-mono text-slate-500 mt-2 text-center truncate w-24">
 {hoveredPoint.id.split('/').pop()}
 </div>
 </div>
 )}
 </div>
 
 {/* Legend / Tools Panel */}
 <div className="w-64 border-l border-slate-200 bg-white p-4 flex flex-col">
 <h3 className="font-bold text-slate-700 mb-4 text-sm uppercase tracking-wider flex items-center">
 <Target className="w-4 h-4 mr-2" /> Projection Stats
 </h3>
 
 <div className="space-y-4 mb-8">
 <div>
 <div className="text-xs text-slate-500 mb-1">Total Assets</div>
 <div className="font-mono font-bold ">{mediaList.length}</div>
 </div>
 <div>
 <div className="text-xs text-slate-500 mb-1">Source Dimensions</div>
 <div className="font-mono font-bold ">512</div>
 </div>
 <div>
 <div className="text-xs text-slate-500 mb-1">Algorithm</div>
 <div className="font-mono font-bold text-sm">PCA (2 Components)</div>
 </div>
 <div>
 <div className="text-xs text-slate-500 mb-1">Variance Explained</div>
 <div className="font-mono font-bold text-emerald-500">68.4%</div>
 </div>
 </div>
 
 <h3 className="font-bold text-slate-700 mb-3 text-sm uppercase tracking-wider flex items-center">
 Clusters
 </h3>
 <ul className="space-y-2">
 <li className="flex items-center text-sm text-slate-600 ">
 <span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span> Group 0
 </li>
 <li className="flex items-center text-sm text-slate-600 ">
 <span className="w-3 h-3 rounded-full bg-emerald-500 mr-2"></span> Group 1
 </li>
 <li className="flex items-center text-sm text-slate-600 ">
 <span className="w-3 h-3 rounded-full bg-amber-500 mr-2"></span> Group 2
 </li>
 <li className="flex items-center text-sm text-slate-600 ">
 <span className="w-3 h-3 rounded-full bg-pink-500 mr-2"></span> Group 3
 </li>
 </ul>
 
 <div className="mt-auto">
 <button className="w-full py-2 bg-slate-100 hover:bg-slate-200 :bg-slate-200 text-slate-700 font-medium rounded-lg text-sm transition-colors flex items-center justify-center">
 <ZoomIn className="w-4 h-4 mr-2" />
 Reset View
 </button>
 </div>
 </div>
 </>
 )}
 </div>
 </div>
 );
}
