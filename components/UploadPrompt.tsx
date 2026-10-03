import { Upload, CheckCircle2 } from 'lucide-react';

interface UploadPromptProps {
 onUploadClick: () => void;
}

export default function UploadPrompt({ onUploadClick }: UploadPromptProps) {
 return (
 <div className="absolute inset-0 flex items-center justify-center pt-8">
 <div className="w-full max-w-xl bg-slate-50 border border-slate-200 rounded-3xl p-10 flex flex-col items-center text-center shadow-2xl">
 <h2 className="text-lg font-bold text-slate-900 mb-6 uppercase tracking-[0.2em]">MEDIA INTELLIGENCE</h2>
 
 <div className="text-indigo-400 font-bold mb-3 uppercase tracking-widest text-sm">NO IMAGE SELECTED</div>
 <p className="text-slate-500 text-sm mb-10">Upload an image to begin</p>
 
 <button 
 onClick={onUploadClick}
 className="bg-indigo-600 hover:bg-indigo-700 text-slate-900 font-bold py-3 px-8 rounded-full transition-colors flex items-center mb-10 shadow-lg shadow-indigo-600/20"
 >
 <Upload className="w-5 h-5 mr-3" /> Upload Image
 </button>
 
 <div className="w-full">
 <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">MODELS READY</h3>
 <div className="grid grid-cols-2 gap-y-3 text-sm text-slate-500 text-left px-8">
 <div className="flex items-center"><CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2" /> Random Forest</div>
 <div className="flex items-center"><CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2" /> ResNet-18</div>
 <div className="flex items-center"><CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2" /> Isolation Forest</div>
 <div className="flex items-center"><CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2" /> Similarity Engine</div>
 <div className="flex items-center"><CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2" /> Computer Vision</div>
 <div className="flex items-center"><CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2" /> XAI Engine</div>
 </div>
 </div>
 </div>
 </div>
 );
}
