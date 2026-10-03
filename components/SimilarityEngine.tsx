import { useState, useEffect } from 'react';
import { Network, Loader2, ArrowRight } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { MediaData } from '@/lib/types';
import MediaCard from './MediaCard';
import Image from 'next/image';

interface SimilarityEngineProps {
  media: MediaData;
}

export default function SimilarityEngine({ media }: SimilarityEngineProps) {
  const { uploadedMedia } = useAppStore();
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const findSimilar = async () => {
      if (uploadedMedia.length <= 1) {
        setLoading(false);
        return;
      }
      
      try {
        const payload = {
          target: {
            id: media.publicId,
            width: media.width,
            height: media.height,
            bytes: media.bytes,
            format: media.format
          },
          library: uploadedMedia.map(m => ({
            id: m.publicId,
            width: m.width,
            height: m.height,
            bytes: m.bytes,
            format: m.format
          }))
        };

        const backendUrl = process.env.NEXT_PUBLIC_ML_API_URL || 'http://127.0.0.1:8000';
        const response = await fetch(`${backendUrl}/api/similarity`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          const data = await response.json();
          setMatches(data.matches);
        } else {
          setError(true);
        }
      } catch (e) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    findSimilar();
  }, [media, uploadedMedia]);

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center h-48">
        <Loader2 className="w-6 h-6 text-indigo-500 animate-spin mb-3" />
        <p className="text-sm text-slate-500 font-medium">Extracting Perceptual Hash (pHash)...</p>
      </div>
    );
  }

  if (error) {
    return null; // Fail silently if ML backend isn't available
  }

  if (matches.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Similarity Engine</h3>
        <p className="text-sm text-slate-400">No visually similar assets found in library.</p>
      </div>
    );
  }

  const topMatch = matches[0];
  const matchedMedia = uploadedMedia.find(m => m.publicId === topMatch.id);

  if (!matchedMedia) return null;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 uppercase tracking-wider">
          <Network className="w-4 h-4 text-indigo-500" />
          Similarity Engine
        </h3>
        <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-600 border border-indigo-100 dark:bg-indigo-900/30 dark:border-indigo-800/50 dark:text-indigo-400">
          pHash Matching
        </span>
      </div>

      <div className="p-5 flex flex-col items-center">
        <div className="text-sm font-medium text-slate-500 mb-6 text-center">
          Found a <span className="text-indigo-600 dark:text-indigo-400 font-bold">{topMatch.similarity}%</span> structural match
        </div>

        <div className="flex items-center gap-4 w-full justify-center">
          <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm">
            <Image src={media.secureUrl} alt="Target" fill className="object-cover" />
            <div className="absolute inset-x-0 bottom-0 bg-black/60 text-white text-[10px] text-center py-1">TARGET</div>
          </div>

          <div className="flex flex-col items-center text-slate-300 dark:text-slate-600">
            <ArrowRight className="w-6 h-6" />
            <span className="text-[10px] font-bold mt-1 tracking-widest">{topMatch.similarity}%</span>
          </div>

          <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.3)]">
            <Image src={matchedMedia.secureUrl} alt="Match" fill className="object-cover" />
            <div className="absolute inset-x-0 bottom-0 bg-indigo-600 text-white text-[10px] text-center py-1 font-bold">MATCH</div>
          </div>
        </div>

        {topMatch.similarity > 90 && (
          <div className="mt-6 w-full flex justify-center gap-3">
            <button className="px-4 py-1.5 text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
              Compare Side-by-Side
            </button>
            <button className="px-4 py-1.5 text-xs font-bold bg-red-50 text-red-600 border border-red-100 dark:bg-red-900/20 dark:border-red-900/50 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors">
              Delete Match
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
