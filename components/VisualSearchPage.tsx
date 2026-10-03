import { useState, useEffect } from 'react';
import { Search, Image as ImageIcon, Crosshair, Sparkles, Filter, Hash, Type } from 'lucide-react';
import { MediaData } from '@/lib/types';
import Image from 'next/image';

interface VisualSearchPageProps {
  mediaList: MediaData[];
}

export default function VisualSearchPage({ mediaList }: VisualSearchPageProps) {
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Select first image as search query for demo
  const targetMedia = mediaList.length > 0 ? mediaList[0] : null;

  const performSearch = (query: string) => {
    if (!query.trim() && !targetMedia) return;
    
    setLoading(true);
    setTimeout(() => {
      // Mock multimodal search results
      // In reality, this would convert the text query into an embedding using CLIP 
      // and perform a cosine similarity search against image embeddings.
      const results = mediaList.slice(0, 8).map((m, i) => ({
        asset: m,
        score: 97 - (i * 4) + (Math.random() * 2),
        matchedOn: i % 3 === 0 ? 'Semantic Embedding' : i % 3 === 1 ? 'AI Tag' : 'Metadata'
      }));
      
      // Sort by score
      results.sort((a, b) => b.score - a.score);
      setSearchResults(results);
      setLoading(false);
    }, 1200);
  };

  useEffect(() => {
    if (mediaList.length > 0) {
      performSearch('');
    }
  }, [mediaList]);

  return (
    <div className="animate-in fade-in duration-300 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-pink-50 dark:bg-pink-900/30 flex items-center justify-center shadow-sm">
          <Search className="w-5 h-5 text-pink-600 dark:text-pink-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Multimodal Search</h1>
          <p className="text-sm text-slate-500">Query your library using natural language or image embeddings.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm mb-6 flex gap-4">
        <div className="flex-1 relative">
          <input 
            type="text" 
            placeholder='e.g., "people standing near a car" or "high quality outdoor photos"' 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && performSearch(searchQuery)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all dark:text-white"
          />
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
        </div>
        <button 
          onClick={() => performSearch(searchQuery)}
          className="px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-lg text-sm transition-colors shadow-sm flex items-center"
        >
          <Sparkles className="w-4 h-4 mr-2" /> Semantic Search
        </button>
      </div>

      {!targetMedia && mediaList.length === 0 ? (
        <div className="py-20 text-center text-slate-500 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          Please upload media to test multimodal search.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1">
          
          {/* Query Image (if multimodal) */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-800 h-full">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center">
                <Filter className="w-4 h-4 mr-2" /> Search Modality
              </h3>
              
              <div className="space-y-4">
                <div>
                  <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Text Query (CLIP)</div>
                  <div className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-xs text-slate-500 min-h-[40px]">
                    {searchQuery ? `"${searchQuery}"` : 'No text query'}
                  </div>
                </div>
                
                <div>
                  <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center justify-between">
                    <span>Visual Reference (ResNet)</span>
                    {targetMedia && <span className="text-[10px] text-pink-500 bg-pink-50 dark:bg-pink-900/30 px-1 rounded">Active</span>}
                  </div>
                  {targetMedia ? (
                    <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-slate-300 dark:border-slate-700 shadow-sm mb-2">
                       <Image src={targetMedia.secureUrl} alt="Query" fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-xs text-slate-500">
                      No image selected
                    </div>
                  )}
                  <button className="w-full py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-colors">
                    {targetMedia ? 'Change Image' : 'Select Image'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-3 h-full">
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm min-h-full">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-slate-700 dark:text-slate-300 flex items-center">
                  <ImageIcon className="w-5 h-5 mr-2 text-pink-500" />
                  Semantic Matches
                </h3>
                {searchResults.length > 0 && !loading && (
                  <span className="text-xs text-slate-500 font-medium">Found {searchResults.length} assets</span>
                )}
              </div>

              {loading ? (
                <div className="py-20 flex flex-col items-center justify-center">
                  <div className="w-10 h-10 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin mb-4"></div>
                  <p className="text-slate-500 font-medium text-sm">Mapping query to latent space...</p>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="space-y-6">
                  {searchResults.slice(0, 3).map((res, i) => (
                    <div key={i} className="flex flex-col md:flex-row gap-6 p-6 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-800/30 hover:border-pink-300 dark:hover:border-pink-900/50 transition-colors group">
                      
                      <div className="w-full md:w-1/3 flex flex-col">
                        <div className="text-sm font-bold text-slate-500 tracking-widest mb-2 flex justify-between items-center">
                          <span>MATCH #{i + 1}</span>
                          <span className="text-pink-600 dark:text-pink-400 bg-pink-100 dark:bg-pink-900/30 px-2 py-0.5 rounded text-xs">{res.score.toFixed(1)}%</span>
                        </div>
                        <div className="relative w-full aspect-square rounded-lg overflow-hidden border border-slate-300 dark:border-slate-700">
                           <Image src={res.asset.secureUrl} alt="Result" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                      </div>

                      <div className="w-full md:w-2/3 flex flex-col md:flex-row gap-6">
                        <div className="flex-1 font-mono text-sm space-y-3 pt-2 md:border-r border-slate-200 dark:border-slate-700 pr-6">
                          <div className="flex justify-between items-center"><span className="text-slate-500">Semantic:</span> <span className="font-bold text-slate-900 dark:text-white">{(res.score + Math.random() * 5).toFixed(0)}%</span></div>
                          <div className="flex justify-between items-center"><span className="text-slate-500">Visual:</span> <span className="font-bold text-slate-900 dark:text-white">{(res.score - Math.random() * 8).toFixed(0)}%</span></div>
                          <div className="flex justify-between items-center"><span className="text-slate-500">AI Tags:</span> <span className="font-bold text-slate-900 dark:text-white">{(res.score + Math.random() * 12 > 100 ? 100 : res.score + Math.random() * 12).toFixed(0)}%</span></div>
                          <div className="flex justify-between items-center"><span className="text-slate-500">Metadata:</span> <span className="font-bold text-slate-900 dark:text-white">{(res.score - Math.random() * 15).toFixed(0)}%</span></div>
                        </div>
                        
                        <div className="flex-1 pt-2 space-y-2 text-sm text-slate-700 dark:text-slate-300">
                          <div className="font-bold mb-3 uppercase tracking-wider text-xs text-slate-500">Why matched:</div>
                          <div className="flex items-start"><span className="text-emerald-500 mr-2 font-bold">✓</span> Similar composition</div>
                          <div className="flex items-start"><span className="text-emerald-500 mr-2 font-bold">✓</span> {res.matchedOn === 'Semantic Embedding' ? 'Similar semantic embedding' : 'Shared visual taxonomy'}</div>
                          <div className="flex items-start"><span className="text-emerald-500 mr-2 font-bold">✓</span> Matches "{searchQuery || 'visual query'}"</div>
                          <div className="flex items-start"><span className="text-emerald-500 mr-2 font-bold">✓</span> Same collection grouping</div>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center text-slate-500">
                  No matching media found for this query.
                </div>
              )}
            </div>
          </div>
          
        </div>
      )}
    </div>
  );
}
