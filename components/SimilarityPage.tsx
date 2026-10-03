import { useState, useEffect } from 'react';
import { Combine, Layers, Trash2, ArrowRight } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { MediaData } from '@/lib/types';
import Image from 'next/image';
import UploadPrompt from './UploadPrompt';

interface SimilarityPageProps {
  mediaList: MediaData[];
  onUploadClick?: () => void;
}

export default function SimilarityPage({ mediaList, onUploadClick }: SimilarityPageProps) {
  const [loading, setLoading] = useState(false);
  const [similarityData, setSimilarityData] = useState<any>(null);

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
      setSimilarityData(data.intelligence?.similarity || null);
      setLoading(false);
    })
    .catch(() => setLoading(false));
  }, [targetMedia]);

  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center">
          <Combine className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Similarity Engine</h1>
          <p className="text-sm text-slate-500">Find duplicates and visually similar assets across the entire library.</p>
        </div>
      </div>
      {!targetMedia ? (
        <UploadPrompt onUploadClick={onUploadClick || (() => {})} />
      ) : loading ? (
        <div className="py-20 flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
          <p className="text-slate-500 font-medium">Computing perceptual hashes and distances...</p>
        </div>
      ) : similarityData ? (
        <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex justify-between items-center">
                <h3 className="font-bold text-slate-700 dark:text-slate-300">Similarity Match</h3>
                <span className="text-xs font-bold px-2 py-1 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 rounded-md">
                  Found closest match
                </span>
              </div>
              
              <div className="p-6">
                <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar items-center">
                    <div className="flex-shrink-0 flex flex-col items-center">
                      <div className="relative w-40 h-40 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 mb-3 shadow-sm">
                        {targetMedia.secureUrl ? (
                          <Image src={targetMedia.secureUrl} alt="Target" fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full bg-slate-100 dark:bg-slate-800"></div>
                        )}
                      </div>
                      <span className="text-lg font-bold text-slate-700 dark:text-slate-300">Uploaded</span>
                    </div>

                    <ArrowRight className="w-8 h-8 text-slate-400" />

                    <div className="flex-shrink-0 flex flex-col items-center">
                      <div className="relative w-40 h-40 rounded-lg border-2 border-indigo-500 border-dashed mb-3 shadow-sm flex items-center justify-center bg-slate-50 dark:bg-slate-900">
                        <span className="text-xs text-slate-500 font-mono p-2 text-center break-all">{similarityData.closest_asset}</span>
                      </div>
                      <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                        {(similarityData.score * 100).toFixed(1)}% Match
                      </span>
                    </div>
                </div>
                
                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <button className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 font-medium rounded-lg text-sm transition-colors flex items-center">
                    <Combine className="w-4 h-4 mr-2" />
                    Compare Details
                  </button>
                  <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 font-medium rounded-lg text-sm transition-colors flex items-center">
                    <Layers className="w-4 h-4 mr-2" />
                    Group Assets
                  </button>
                  <button className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400 font-medium rounded-lg text-sm transition-colors flex items-center ml-auto">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Mark Duplicate
                  </button>
                </div>
              </div>
            </div>
        </div>
      ) : null}
    </div>
  );
}
