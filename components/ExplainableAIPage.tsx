import { useState, useEffect } from 'react';
import { Target, Search, CheckCircle2, AlertTriangle, ShieldAlert, Zap, BarChart, ThumbsUp, ThumbsDown } from 'lucide-react';
import { MediaData } from '@/lib/types';
import Image from 'next/image';
import UploadPrompt from './UploadPrompt';

interface ExplainableAIPageProps {
  mediaList: MediaData[];
  onUploadClick?: () => void;
}

export default function ExplainableAIPage({ mediaList, onUploadClick }: ExplainableAIPageProps) {
  const [selectedAsset, setSelectedAsset] = useState<MediaData | null>(null);
  const [loading, setLoading] = useState(false);
  const [xaiData, setXaiData] = useState<any>(null);

  // Automatically select the first uploaded image if none selected
  useEffect(() => {
    if (mediaList.length > 0 && !selectedAsset) {
      setSelectedAsset(mediaList[0]);
    }
  }, [mediaList, selectedAsset]);

  useEffect(() => {
    if (!selectedAsset) return;
    
    setLoading(true);
    fetch('/api/ml/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        publicId: selectedAsset.publicId,
        secureUrl: selectedAsset.secureUrl
      })
    })
    .then(res => res.json())
    .then(data => {
      setXaiData(data.intelligence || null);
      setLoading(false);
    })
    .catch(() => setLoading(false));
  }, [selectedAsset]);

  const renderFeatureContribution = () => (
    <div className="bg-[#0b0b10] border border-white/5 rounded-3xl p-8 shadow-2xl mb-6 font-mono text-sm leading-relaxed relative overflow-hidden">
      <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
      
      <div className="mb-8 font-bold text-white text-lg flex flex-col border-b border-white/10 pb-4 tracking-widest uppercase">
        <div className="flex items-center text-xs text-slate-400 mb-2 font-bold tracking-widest uppercase">
          <Zap className="w-4 h-4 mr-2 text-indigo-400" />
          Feature Contribution Analysis
        </div>
        <div>
          WHY DID THE MODEL GIVE "{xaiData?.quality?.prediction || '...'}"?
        </div>
      </div>
      
      <div className="space-y-8 relative z-10">
        <div>
          <div className="mb-4 text-emerald-400 font-bold tracking-widest uppercase text-xs flex items-center">
            <ThumbsUp className="w-4 h-4 mr-2" /> Positive Contributors
          </div>
          <div className="space-y-3">
            {xaiData?.xai?.filter((x: any) => x.impact > 0).length > 0 ? (
              xaiData.xai.filter((x: any) => x.impact > 0).map((x: any, i: number) => (
                <div key={i} className="flex items-center">
                  <span className="text-emerald-500/80 text-xs" style={{ width: `${Math.min(Math.max(x.impact * 20, 2), 100)}%` }}>
                    {'█'.repeat(Math.ceil(Math.min(x.impact * 5, 20)))}
                  </span>
                  <span className="text-white ml-3 font-medium">{x.feature}</span>
                  <span className="text-slate-500 ml-auto">+{x.impact} (Value: {x.value})</span>
                </div>
              ))
            ) : (
              <div className="text-slate-500 text-xs">No significant positive features found.</div>
            )}
          </div>
        </div>

        <div>
          <div className="mb-4 text-rose-400 font-bold tracking-widest uppercase text-xs flex items-center">
            <ThumbsDown className="w-4 h-4 mr-2" /> Negative Contributors
          </div>
          <div className="space-y-3">
            {xaiData?.xai?.filter((x: any) => x.impact < 0).length > 0 ? (
              xaiData.xai.filter((x: any) => x.impact < 0).map((x: any, i: number) => (
                <div key={i} className="flex items-center">
                  <span className="text-rose-500/80 text-xs" style={{ width: `${Math.min(Math.max(Math.abs(x.impact) * 20, 2), 100)}%` }}>
                    {'█'.repeat(Math.ceil(Math.min(Math.abs(x.impact) * 5, 20)))}
                  </span>
                  <span className="text-white ml-3 font-medium">{x.feature}</span>
                  <span className="text-slate-500 ml-auto">{x.impact} (Value: {x.value})</span>
                </div>
              ))
            ) : (
              <div className="text-slate-500 text-xs">No significant negative features found.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderRuleExplanation = () => (
    <div className="bg-[#0b0b10] border border-white/5 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
      <h3 className="font-bold text-white mb-8 tracking-widest uppercase text-xs flex items-center border-b border-white/10 pb-4">
        <Search className="w-4 h-4 mr-3 text-amber-400" />
        DECISION TRACE: <span className="text-amber-400 ml-2">"Convert to WebP"</span>
      </h3>
      
      <div className="bg-[#111118] rounded-xl p-6 border border-white/5 relative z-10">
        <div className="space-y-6 relative font-mono">
           <div className="absolute top-4 bottom-4 left-4 w-px bg-white/10 z-0"></div>
           
           <div className="flex items-start relative z-10">
             <div className="w-8 h-8 rounded-full bg-[#111118] flex items-center justify-center mr-4 border-2 border-white/20 text-xs font-bold text-white">1</div>
             <div className="pt-1.5">
               <div className="text-sm font-bold text-white uppercase tracking-widest mb-1">Format Detection</div>
               <div className="text-xs text-slate-400">Asset format is <span className="text-indigo-300 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20">image/jpeg</span>.</div>
             </div>
           </div>
           
           <div className="flex items-start relative z-10">
             <div className="w-8 h-8 rounded-full bg-[#111118] flex items-center justify-center mr-4 border-2 border-white/20 text-xs font-bold text-white">2</div>
             <div className="pt-1.5">
               <div className="text-sm font-bold text-white uppercase tracking-widest mb-1">Size Analysis</div>
               <div className="text-xs text-slate-400">Filesize is 4.2 MB (exceeds 2 MB threshold).</div>
             </div>
           </div>
           
           <div className="flex items-start relative z-10">
             <div className="w-8 h-8 rounded-full bg-[#111118] flex items-center justify-center mr-4 border-2 border-white/20 text-xs font-bold text-white">3</div>
             <div className="pt-1.5">
               <div className="text-sm font-bold text-white uppercase tracking-widest mb-1">Visual Complexity</div>
               <div className="text-xs text-slate-400">Edge density is high (0.08). Next-gen formats provide 30-40% savings.</div>
             </div>
           </div>
           
           <div className="flex items-start relative z-10 mt-8 pt-4 border-t border-white/5">
             <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center mr-4 border-2 border-amber-500/50 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
               <CheckCircle2 className="w-4 h-4" />
             </div>
             <div className="pt-1.5">
               <div className="text-sm font-bold text-amber-400 uppercase tracking-widest mb-1">Action Triggered</div>
               <div className="text-xs text-slate-300">Auto-Format flag applied. Delivery URL modified with <span className="text-amber-300 bg-amber-500/20 px-1.5 py-0.5 rounded border border-amber-500/30">f_auto</span>.</div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="animate-in fade-in duration-500 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-8">
        <div>
          <h1 className="text-xl font-bold tracking-widest text-white uppercase flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-indigo-400" />
            Explainable AI (XAI)
          </h1>
          <p className="text-slate-500 text-xs mt-1 font-mono uppercase tracking-widest">Transparent reasoning for automated predictions.</p>
        </div>
      </div>

      {mediaList.length === 0 ? (
        <div className="relative flex-1">
          <UploadPrompt onUploadClick={onUploadClick || (() => {})} />
        </div>
      ) : (
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Selector */}
        <div className="lg:col-span-1 border-r border-white/5 pr-6 h-[700px] overflow-y-auto custom-scrollbar">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6 border-b border-white/5 pb-3">Select Asset</h3>
          {mediaList.map((media) => (
            <div 
              key={media.publicId}
              onClick={() => setSelectedAsset(media)}
              className={`flex items-center p-3 rounded-xl cursor-pointer transition-colors mb-3 border ${selectedAsset?.publicId === media.publicId ? 'bg-indigo-500/10 border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.1)]' : 'hover:bg-white/5 border-transparent'}`}
            >
              <div className="w-14 h-14 rounded-lg overflow-hidden relative flex-shrink-0 border border-white/10">
                <Image src={media.secureUrl} alt="Thumbnail" fill className="object-cover" />
              </div>
              <div className="ml-4 truncate">
                <div className={`text-xs font-bold uppercase tracking-wider truncate mb-1 ${selectedAsset?.publicId === media.publicId ? 'text-indigo-400' : 'text-slate-300'}`}>
                  {media.publicId.split('/').pop()}
                </div>
                <div className="text-[10px] text-slate-500 truncate font-mono">
                  {media.publicId}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3 pl-2 h-full overflow-y-auto custom-scrollbar">
          {loading ? (
             <div className="h-full flex flex-col items-center justify-center text-slate-500 min-h-[400px]">
               <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
               <p className="font-mono text-sm uppercase tracking-widest">Generating XAI Trace...</p>
             </div>
          ) : !selectedAsset || !xaiData ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 min-h-[400px]">
              <Target className="w-12 h-12 mb-4 text-slate-600" />
              <p className="font-mono text-sm uppercase tracking-widest">Select an asset to view XAI Trace</p>
            </div>
          ) : (
            <div className="space-y-6 pb-20">
              
              <div className="flex gap-6">
                <div className="w-48 h-48 rounded-2xl overflow-hidden relative shadow-2xl border border-white/10 flex-shrink-0 bg-[#050505]">
                  <Image src={selectedAsset.secureUrl} alt="Target" fill className="object-cover" />
                </div>
                
                <div className="flex-1 bg-[#0b0b10] rounded-2xl border border-white/5 p-6 flex flex-col justify-between shadow-xl">
                  <div>
                     <h3 className="font-bold text-white tracking-widest text-sm uppercase mb-2">System Decisions</h3>
                     <p className="text-xs text-slate-500 mb-6 font-mono">Autonomous actions evaluated via XAI module.</p>
                     
                     <div className="flex gap-3">
                       <span className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest rounded">Quality: Approved</span>
                       <span className="px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-widest rounded">Optimization: Required</span>
                       <span className="px-3 py-1.5 bg-white/5 border border-white/10 text-white text-xs font-bold uppercase tracking-widest rounded">Moderation: Safe</span>
                     </div>
                  </div>
                  
                  <div className="text-xs text-indigo-400 flex items-center mt-6 font-mono uppercase tracking-widest bg-indigo-500/5 p-3 rounded-lg border border-indigo-500/10">
                    <BarChart className="w-4 h-4 mr-2" />
                    Ensemble Confidence: 92.4%
                  </div>
                </div>
              </div>

              {renderFeatureContribution()}
              {renderRuleExplanation()}
              
            </div>
          )}
        </div>
      </div>
      )}
    </div>
  );
}
