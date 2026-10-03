import { useState, useEffect } from 'react';
import { Layers, Play, CheckCircle2, AlertTriangle, ShieldAlert, Image as ImageIcon, Database, Activity, Sparkles, Server } from 'lucide-react';
import { toast } from 'sonner';

export default function BatchIntelligencePage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [report, setReport] = useState<any>(null);

  const totalAssets = 500;

  const startBatch = () => {
    setIsProcessing(true);
    setProgress(0);
    setReport(null);
    toast.info(`Initializing batch intelligence pipeline for ${totalAssets} assets...`);

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.random() * 8 + 2; // Add 2-10% each tick
      if (currentProgress >= 100) {
        clearInterval(interval);
        setProgress(100);
        
        setTimeout(() => {
          setIsProcessing(false);
          setReport({
            safe: 421,
            needsReview: 53,
            flagged: 26,
            duplicates: 18,
            anomalies: 31,
            lowQuality: 47,
            needsOptimization: 89,
            aiTags: 1247,
            clusters: 8,
            embeddings: 500
          });
          toast.success("Batch intelligence processing complete!");
        }, 800);
      } else {
        setProgress(currentProgress);
      }
    }, 400); // Fast simulation for demo purposes
  };

  const steps = [
    { name: 'Upload & Ingest', icon: Server, desc: 'Syncing to Cloudinary' },
    { name: 'Metadata & Tags', icon: Database, desc: 'Extracting EXIF & AI Tags' },
    { name: 'Moderation', icon: ShieldAlert, desc: 'Checking for unsafe content' },
    { name: 'Feature Extraction', icon: Activity, desc: 'Calculating classical ML signals' },
    { name: 'ML Quality Model', icon: Sparkles, desc: 'Predicting aesthetic quality' },
    { name: 'DL Embeddings', icon: Layers, desc: 'Generating 512D ResNet vectors' },
    { name: 'Similarity Engine', icon: ImageIcon, desc: 'Finding duplicates via pHash + Cosine' },
    { name: 'Decision Engine', icon: CheckCircle2, desc: 'Generating optimization actions' }
  ];

  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-900/30 flex items-center justify-center shadow-sm">
          <Layers className="w-5 h-5 text-orange-600 dark:text-orange-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Batch Intelligence Pipeline</h1>
          <p className="text-sm text-slate-500">Run the entire MediaFlow AI architecture end-to-end on bulk datasets.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Pipeline Execution */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-6 uppercase tracking-wider text-sm flex items-center">
              <Play className="w-4 h-4 mr-2 text-indigo-500" /> Job Configuration
            </h3>
            
            <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-slate-600 dark:text-slate-400">Target Dataset</span>
                <span className="text-sm font-bold dark:text-slate-200">Demo_Corp_Assets_V2</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-slate-600 dark:text-slate-400">Asset Count</span>
                <span className="text-sm font-bold dark:text-slate-200">{totalAssets} Images</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">Pipeline Strictness</span>
                <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">High (Production)</span>
              </div>
            </div>

            <button 
              onClick={startBatch}
              disabled={isProcessing}
              className="w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-lg transition-colors shadow-lg disabled:opacity-50 flex justify-center items-center"
            >
              {isProcessing ? 'Processing Batch...' : 'Run Full Pipeline'}
            </button>
            
            {isProcessing && (
              <div className="mt-6">
                <div className="flex justify-between text-xs font-bold text-slate-500 mb-2 uppercase">
                  <span>Progress</span>
                  <span>{Math.floor(progress)}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-500 transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-inner">
            <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-4 text-xs uppercase tracking-wider">Execution Graph</h3>
            <div className="space-y-0">
              {steps.map((step, i) => {
                const stepThreshold = (i + 1) * (100 / steps.length);
                const isCompleted = progress >= stepThreshold;
                const isCurrent = progress > (i * (100 / steps.length)) && progress < stepThreshold;
                const isPending = progress === 0 || progress <= (i * (100 / steps.length));
                
                let colorClass = 'text-slate-400 border-slate-200 dark:border-slate-700 dark:text-slate-600';
                let iconColor = 'text-slate-300 dark:text-slate-600';
                
                if (isCompleted || (progress === 100 && report)) {
                  colorClass = 'text-emerald-700 dark:text-emerald-400 border-emerald-500';
                  iconColor = 'text-emerald-500';
                } else if (isCurrent && isProcessing) {
                  colorClass = 'text-indigo-700 dark:text-indigo-400 border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20';
                  iconColor = 'text-indigo-500';
                }

                return (
                  <div key={i} className="flex">
                    <div className="flex flex-col items-center mr-4">
                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors bg-white dark:bg-slate-900 z-10 ${colorClass}`}>
                        {isCompleted || (progress===100 && report) ? <CheckCircle2 className="w-4 h-4" /> : <step.icon className={`w-3.5 h-3.5 ${iconColor}`} />}
                      </div>
                      {i < steps.length - 1 && (
                        <div className={`w-0.5 h-6 ${isCompleted || (progress===100 && report) ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'} -mt-1 -mb-1`}></div>
                      )}
                    </div>
                    <div className={`py-1.5 ${isCurrent && isProcessing ? 'animate-pulse' : ''}`}>
                      <h4 className={`text-sm font-bold ${isCompleted || isCurrent || (progress===100 && report) ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
                        {step.name}
                      </h4>
                      <p className="text-[10px] text-slate-500">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Intelligence Report */}
        <div className="lg:col-span-2">
          {report ? (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xl animate-in slide-in-from-bottom-4 h-full">
              <div className="flex items-center justify-between mb-8 border-b border-slate-100 dark:border-slate-800 pb-6">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white">Batch Intelligence Report</h2>
                  <p className="text-slate-500">{totalAssets} Assets Processed End-to-End</p>
                </div>
                <div className="px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-lg font-bold border border-emerald-200 dark:border-emerald-800/50 flex items-center">
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  Success
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                {/* Moderation Block */}
                <div>
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center">
                    <ShieldAlert className="w-4 h-4 mr-2" /> Moderation
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-700 dark:text-slate-300 font-medium">Safe</span>
                      <span className="text-lg font-black text-emerald-600">{report.safe}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-700 dark:text-slate-300 font-medium">Needs Review</span>
                      <span className="text-lg font-black text-amber-500">{report.needsReview}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-700 dark:text-slate-300 font-medium">Flagged</span>
                      <span className="text-lg font-black text-rose-500">{report.flagged}</span>
                    </div>
                  </div>
                </div>

                {/* Health & Quality Block */}
                <div>
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center">
                    <Activity className="w-4 h-4 mr-2" /> Media Health
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-700 dark:text-slate-300 font-medium">Low Quality</span>
                      <span className="text-lg font-black text-orange-500">{report.lowQuality}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-700 dark:text-slate-300 font-medium">Needs Optimization</span>
                      <span className="text-lg font-black text-amber-500">{report.needsOptimization}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-700 dark:text-slate-300 font-medium">Anomalies Detected</span>
                      <span className="text-lg font-black text-indigo-500">{report.anomalies}</span>
                    </div>
                  </div>
                </div>

                {/* Machine Learning Block */}
                <div>
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center">
                    <Sparkles className="w-4 h-4 mr-2" /> ML / AI Outputs
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-700 dark:text-slate-300 font-medium">AI Tags Generated</span>
                      <span className="text-lg font-black text-blue-500">{report.aiTags}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-700 dark:text-slate-300 font-medium">Duplicate Groups</span>
                      <span className="text-lg font-black text-fuchsia-500">{report.duplicates}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-700 dark:text-slate-300 font-medium">512D Embeddings</span>
                      <span className="text-lg font-black text-emerald-500">{report.embeddings}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-200 dark:border-indigo-900/30 rounded-xl p-5">
                <h4 className="font-bold text-indigo-900 dark:text-indigo-400 mb-2 flex items-center">
                  <Server className="w-4 h-4 mr-2" />
                  Decision Engine Actions Ready
                </h4>
                <p className="text-sm text-indigo-700 dark:text-indigo-300 mb-4">
                  The MediaFlow Decision Engine has prepared 136 automated actions across {totalAssets} assets based on the generated ML insights.
                </p>
                <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-sm transition-colors shadow">
                  Review & Execute Actions
                </button>
              </div>

            </div>
          ) : (
            <div className="bg-slate-50 dark:bg-slate-900/30 rounded-xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col items-center justify-center h-full text-center min-h-[500px]">
              <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-full shadow-sm flex items-center justify-center mb-6">
                <Layers className="w-8 h-8 text-slate-300 dark:text-slate-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">No Report Generated</h3>
              <p className="text-slate-500 max-w-sm">
                Run the full intelligence pipeline on the left to process assets and generate a unified ML report.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
