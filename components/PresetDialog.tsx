import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { X, BookmarkPlus } from 'lucide-react';
import { toast } from 'sonner';

interface PresetDialogProps {
 onClose: () => void;
 currentOptions: any;
}

export default function PresetDialog({ onClose, currentOptions }: PresetDialogProps) {
 const { createPreset } = useAppStore();
 const [name, setName] = useState('');

 const handleCreate = (e: React.FormEvent) => {
 e.preventDefault();
 if (!name.trim()) return;
 
 createPreset({
 name,
 options: currentOptions,
 description: `${currentOptions.width || 'Auto'} × ${currentOptions.height || 'Auto'}`,
 icon: '✨'
 });
 
 toast.success('Preset saved successfully');
 onClose();
 };

 return (
 <div className="fixed inset-0 z-[100] bg-slate-50/50 backdrop-blur-sm flex items-center justify-center p-4">
 <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
 
 <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50 ">
 <h2 className="font-semibold text-lg text-slate-900 flex items-center">
 <BookmarkPlus className="w-5 h-5 mr-2 text-indigo-500" /> 
 Save Transformation Preset
 </h2>
 <button onClick={onClose} className="text-slate-500 hover:text-slate-600 :text-slate-700 transition-colors">
 <X className="w-5 h-5" />
 </button>
 </div>

 <div className="p-6">
 <form onSubmit={handleCreate} className="space-y-4">
 <div>
 <label className="block text-sm font-medium text-slate-700 mb-1">Preset Name</label>
 <input 
 type="text"
 required
 autoFocus
 value={name}
 onChange={(e) => setName(e.target.value)}
 className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
 placeholder="e.g. Website Hero Image"
 />
 </div>

 <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 ">
 <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
 Saved Settings
 </h4>
 <div className="grid grid-cols-2 gap-2 text-sm">
 {Object.entries(currentOptions).map(([k, v]) => (
 <div key={k} className="flex flex-col">
 <span className="text-slate-500 text-xs capitalize">{k}</span>
 <span className="font-medium text-slate-700 ">{String(v)}</span>
 </div>
 ))}
 </div>
 </div>
 
 <div className="flex items-center gap-3 pt-2">
 <button 
 type="button" 
 onClick={onClose}
 className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 :bg-slate-200 transition-colors"
 >
 Cancel
 </button>
 <button 
 type="submit" 
 disabled={!name.trim()}
 className="flex-1 px-4 py-2 bg-indigo-600 text-slate-900 font-medium rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50"
 >
 Save Preset
 </button>
 </div>
 </form>
 </div>
 </div>
 </div>
 );
}
