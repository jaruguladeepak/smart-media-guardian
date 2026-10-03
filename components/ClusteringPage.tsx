import { useState, useEffect } from 'react';
import { PieChart, FolderPlus } from 'lucide-react';
import { MediaData } from '@/lib/types';
import Image from 'next/image';

interface ClusteringPageProps {
 mediaList: MediaData[];
}

export default function ClusteringPage({ mediaList }: ClusteringPageProps) {
 const [loading, setLoading] = useState(false);
 const [clusters, setClusters] = useState<any[]>([]);

 useEffect(() => {
 if (mediaList.length < 4) return;
 
 setLoading(true);
 // Mock clustering output
 setTimeout(() => {
 setClusters([
 { id: 0, name: 'Portraits & People', items: mediaList.slice(0, 2) },
 { id: 1, name: 'Events & Gathering', items: mediaList.slice(2, 4) },
 { id: 2, name: 'Documents & Receipts', items: [] },
 { id: 3, name: 'Outdoor & Nature', items: [] }
 ]);
 setLoading(false);
 }, 1500);
 }, [mediaList]);

 return (
 <div className="animate-in fade-in duration-300">
 <div className="flex items-center gap-3 mb-6">
 <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
 <PieChart className="w-5 h-5 text-purple-600 " />
 </div>
 <div>
 <h1 className="text-2xl font-bold tracking-tight text-slate-900 ">Unsupervised Clustering</h1>
 <p className="text-sm text-slate-500">K-Means clustering based on extracted visual features.</p>
 </div>
 </div>

 {loading ? (
 <div className="py-20 flex flex-col items-center justify-center">
 <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-4"></div>
 <p className="text-slate-500 font-medium">Running K-Means algorithm...</p>
 </div>
 ) : (
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 {clusters.map((cluster) => (
 <div key={cluster.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
 <div className="p-4 border-b border-slate-100 flex justify-between items-center">
 <h3 className="font-bold text-slate-700 ">
 Cluster {cluster.id} → {cluster.name}
 </h3>
 <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">
 {cluster.items.length} items
 </span>
 </div>
 <div className="p-4">
 <div className="flex flex-wrap gap-2 mb-4 h-24 overflow-hidden">
 {cluster.items.map((item: any, idx: number) => (
 <div key={idx} className="relative w-16 h-16 rounded border border-slate-200 overflow-hidden">
 {item && item.secureUrl ? (
 <Image src={item.secureUrl} alt="Item" fill className="object-cover" />
 ) : (
 <div className="w-full h-full bg-slate-100 "></div>
 )}
 </div>
 ))}
 {cluster.items.length === 0 && (
 <div className="w-full h-full flex items-center justify-center text-sm text-slate-400">
 No matching items in this dataset.
 </div>
 )}
 </div>
 
 <button 
 disabled={cluster.items.length === 0}
 className="w-full py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 disabled:hover:bg-slate-100 text-slate-700 :bg-slate-700 font-medium rounded-lg text-sm transition-colors flex items-center justify-center"
 >
 <FolderPlus className="w-4 h-4 mr-2" />
 Create Collection from Cluster
 </button>
 </div>
 </div>
 ))}
 </div>
 )}
 </div>
 );
}
