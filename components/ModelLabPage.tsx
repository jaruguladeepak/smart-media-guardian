import { Beaker, Database, Activity, CheckCircle2, GitCommit } from 'lucide-react';

export default function ModelLabPage() {
 return (
 <div className="animate-in fade-in duration-500 h-full flex flex-col font-mono text-sm max-w-4xl mx-auto">
 <div className="flex items-center justify-between mb-8">
 <div>
 <h1 className="text-2xl font-bold tracking-widest text-white uppercase flex items-center gap-3">
 <Beaker className="w-6 h-6 text-indigo-400" />
 Model Lab
 </h1>
 <p className="text-slate-500 text-sm mt-2">Training history and model evaluation metrics.</p>
 </div>
 </div>

 <div className="bg-[#0b0b10] rounded-3xl border border-white/5 p-8 shadow-2xl relative overflow-hidden flex flex-col min-h-[500px]">
 <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
 
 <h3 className="font-bold text-white mb-8 uppercase tracking-widest text-sm flex items-center border-b border-white/10 pb-4">
 <Database className="w-5 h-5 mr-3 text-indigo-400" />
 TRAINED MODELS
 </h3>

 <div className="flex flex-col lg:flex-row gap-12 relative z-10">
 <div className="flex-1 space-y-6">
 <div>
 <h2 className="text-2xl font-bold text-white tracking-wider text-indigo-300">Random Forest v3.2</h2>
 <div className="text-slate-400 mt-2 text-sm flex items-center gap-2">
 <Database className="w-4 h-4" />
 Dataset: human_v2
 </div>
 </div>

 <div className="grid grid-cols-2 gap-4">
 <div className="bg-[#111118] p-4 rounded-xl border border-white/5">
 <div className="text-slate-500 uppercase tracking-widest text-xs mb-1">Accuracy</div>
 <div className="text-2xl font-bold text-emerald-400">88.0%</div>
 </div>
 <div className="bg-[#111118] p-4 rounded-xl border border-white/5">
 <div className="text-slate-500 uppercase tracking-widest text-xs mb-1">F1 Score</div>
 <div className="text-2xl font-bold text-blue-400">0.86</div>
 </div>
 </div>

 <div className="pt-4">
 <button className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 font-bold py-3 px-6 rounded-lg text-sm transition-colors shadow-sm flex items-center gap-2">
 <GitCommit className="w-4 h-4" />
 [ Register Model ]
 </button>
 </div>
 </div>

 <div className="flex-1">
 <h4 className="font-bold text-slate-300 mb-4 uppercase tracking-wider text-xs flex items-center gap-2">
 <Activity className="w-4 h-4 text-emerald-500" />
 5-Fold Cross Validation
 </h4>
 <div className="space-y-3 p-6 bg-[#111118] rounded-2xl border border-white/5">
 <div className="flex justify-between items-center border-b border-white/5 pb-2">
 <span className="text-slate-500">Fold 1</span> 
 <span className="font-bold text-white">86.2%</span>
 </div>
 <div className="flex justify-between items-center border-b border-white/5 pb-2">
 <span className="text-slate-500">Fold 2</span> 
 <span className="font-bold text-white">88.1%</span>
 </div>
 <div className="flex justify-between items-center border-b border-white/5 pb-2">
 <span className="text-slate-500">Fold 3</span> 
 <span className="font-bold text-white">87.0%</span>
 </div>
 <div className="flex justify-between items-center border-b border-white/5 pb-2">
 <span className="text-slate-500">Fold 4</span> 
 <span className="font-bold text-white">86.8%</span>
 </div>
 <div className="flex justify-between items-center pt-1">
 <span className="text-slate-500">Fold 5</span> 
 <span className="font-bold text-emerald-400">88.9%</span>
 </div>
 </div>
 
 <div className="mt-6 p-4 bg-indigo-900/10 border border-indigo-500/20 rounded-xl text-xs text-indigo-300/80 leading-relaxed">
 This model was trained in Experiment #24 and evaluated on a 20% holdout set. 
 It is currently deployed as the primary quality predictor in the live pipeline.
 </div>
 </div>
 </div>
 </div>
 </div>
 );
}
