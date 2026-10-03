import { useState, useEffect } from 'react';
import { Network, Tag, Folder, Sparkles, Image as ImageIcon } from 'lucide-react';
import { MediaData } from '@/lib/types';
import Image from 'next/image';

interface KnowledgeGraphPageProps {
  mediaList: MediaData[];
}

export default function KnowledgeGraphPage({ mediaList }: KnowledgeGraphPageProps) {
  const [loading, setLoading] = useState(false);
  const [activeNode, setActiveNode] = useState<any>(null);

  // Select a default target for the graph
  const targetMedia = mediaList.length > 0 ? mediaList[0] : null;

  useEffect(() => {
    if (!targetMedia) return;
    
    setLoading(true);
    setTimeout(() => {
      // Build a mock graph representation around the target media
      setActiveNode({
        type: 'image',
        id: targetMedia.publicId,
        url: targetMedia.secureUrl,
        label: 'Target Asset',
        connections: [
          { type: 'tag', label: 'Golden Retriever', confidence: 0.91, relatedAssets: 12 },
          { type: 'tag', label: 'Outdoor', confidence: 0.84, relatedAssets: 45 },
          { type: 'collection', label: 'Marketing Q3', relatedAssets: 8 },
          { type: 'cluster', label: 'Cluster 0 (High Contrast)', relatedAssets: 24 },
          { type: 'similarity', label: 'Similar Image (96%)', relatedAssets: 1, thumb: mediaList[1]?.secureUrl }
        ]
      });
      setLoading(false);
    }, 1500);
  }, [targetMedia, mediaList]);

  return (
    <div className="animate-in fade-in duration-300 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6 flex-shrink-0">
        <div className="w-10 h-10 rounded-xl bg-fuchsia-50 dark:bg-fuchsia-900/30 flex items-center justify-center">
          <Network className="w-5 h-5 text-fuchsia-600 dark:text-fuchsia-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Media Knowledge Graph</h1>
          <p className="text-sm text-slate-500">Explore multi-dimensional relationships between your assets, metadata, and ML insights.</p>
        </div>
      </div>

      {!targetMedia ? (
        <div className="py-20 text-center text-slate-500">Please upload media to generate a Knowledge Graph.</div>
      ) : loading ? (
        <div className="flex-1 flex flex-col items-center justify-center bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="w-10 h-10 border-4 border-fuchsia-200 border-t-fuchsia-600 rounded-full animate-spin mb-4"></div>
          <p className="text-slate-500 font-medium">Constructing relationship vectors...</p>
        </div>
      ) : activeNode ? (
        <div className="flex-1 bg-slate-50 dark:bg-[#0a0f1c] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden flex items-center justify-center min-h-[600px]"
             style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)', backgroundSize: '40px 40px' }}>
          
          {/* Mock Graph Lines (SVG) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
            {activeNode.connections.map((conn: any, i: number) => {
              const angle = (i / activeNode.connections.length) * Math.PI * 2;
              const radius = 250;
              const x2 = Math.cos(angle) * radius + 50 + '%';
              const y2 = Math.sin(angle) * radius + 50 + '%';
              
              return (
                <line 
                  key={i} 
                  x1="50%" y1="50%" 
                  x2={x2} y2={y2} 
                  stroke="currentColor" 
                  strokeWidth="2"
                  className="text-slate-300 dark:text-slate-700 stroke-dasharray-4 animate-[dash_20s_linear_infinite]"
                  opacity="0.5"
                />
              );
            })}
          </svg>

          {/* Center Node (Target Image) */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
            <div className="w-32 h-32 rounded-full border-4 border-fuchsia-500 shadow-[0_0_30px_rgba(217,70,239,0.3)] overflow-hidden relative bg-white">
              <Image src={activeNode.url} alt="Center Node" fill className="object-cover" />
            </div>
            <div className="mt-4 px-4 py-1.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full text-xs font-bold shadow-lg">
              {activeNode.id.split('/').pop()}
            </div>
          </div>

          {/* Surrounding Nodes */}
          {activeNode.connections.map((conn: any, i: number) => {
            const angle = (i / activeNode.connections.length) * Math.PI * 2;
            const radius = 250; // Distance from center
            const x = `calc(50% + ${Math.cos(angle) * radius}px)`;
            const y = `calc(50% + ${Math.sin(angle) * radius}px)`;

            let Icon = Tag;
            let bgColor = 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400 border-blue-200 dark:border-blue-800';
            
            if (conn.type === 'collection') {
              Icon = Folder;
              bgColor = 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 border-amber-200 dark:border-amber-800';
            } else if (conn.type === 'cluster') {
              Icon = Sparkles;
              bgColor = 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
            } else if (conn.type === 'similarity') {
              Icon = ImageIcon;
              bgColor = 'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-400 border-pink-200 dark:border-pink-800';
            }

            return (
              <div 
                key={i}
                className="absolute z-10 flex flex-col items-center transform -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 transition-transform"
                style={{ left: x, top: y }}
              >
                {conn.type === 'similarity' && conn.thumb ? (
                  <div className="w-16 h-16 rounded-full border-4 border-pink-400 overflow-hidden relative shadow-lg mb-2">
                    <Image src={conn.thumb} alt="Similar" fill className="object-cover" />
                  </div>
                ) : (
                  <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center shadow-lg mb-2 ${bgColor}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                )}
                
                <div className={`px-3 py-1.5 rounded-lg text-xs font-bold border shadow-sm backdrop-blur-md bg-white/80 dark:bg-slate-900/80 ${bgColor.replace('bg-', 'border-')}`}>
                  {conn.label}
                </div>
                
                <div className="mt-1 text-[10px] font-medium text-slate-500 dark:text-slate-400 bg-white/50 dark:bg-slate-900/50 px-2 py-0.5 rounded-full">
                  {conn.relatedAssets} Connected Assets
                </div>
              </div>
            );
          })}

          <div className="absolute bottom-6 left-6 p-4 bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg backdrop-blur-md max-w-xs z-20">
            <h3 className="font-bold text-slate-700 dark:text-slate-300 text-sm mb-2 flex items-center">
              <Network className="w-4 h-4 mr-2 text-fuchsia-500" />
              Graph Inspector
            </h3>
            <p className="text-xs text-slate-500 mb-3">
              This node shares <strong className="text-slate-700 dark:text-slate-300">Semantic Tags</strong>, <strong className="text-slate-700 dark:text-slate-300">Visual Similarity</strong>, and <strong className="text-slate-700 dark:text-slate-300">Collections</strong> with {activeNode.connections.reduce((acc: number, curr: any) => acc + curr.relatedAssets, 0)} other assets in your library.
            </p>
            <button className="w-full px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded text-xs font-medium transition-colors">
              Expand All Nodes
            </button>
          </div>
        </div>
      ) : null}
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes dash {
          to {
            stroke-dashoffset: -100;
          }
        }
        .stroke-dasharray-4 {
          stroke-dasharray: 4 4;
        }
      `}} />
    </div>
  );
}
