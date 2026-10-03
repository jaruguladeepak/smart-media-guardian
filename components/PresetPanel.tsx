import { useAppStore } from '@/lib/store';
import { Bookmark, Plus, X } from 'lucide-react';
import { Preset } from '@/lib/types';

interface PresetPanelProps {
 onApplyPreset: (options: any) => void;
 onCreatePresetClick: () => void;
}

export default function PresetPanel({ onApplyPreset, onCreatePresetClick }: PresetPanelProps) {
 const { presets, deletePreset } = useAppStore();

 const renderPresetCard = (preset: Preset) => (
 <div 
 key={preset.id}
 onClick={() => onApplyPreset(preset.options)}
 className="group relative bg-white border border-slate-200 rounded-xl p-4 cursor-pointer hover:border-indigo-400 hover:shadow-md transition-all text-left w-full"
 >
 <div className="flex justify-between items-start mb-2">
 <h4 className="font-semibold text-slate-900 flex items-center">
 <span className="mr-2">{preset.icon || '⭐'}</span>
 {preset.name}
 </h4>
 {preset.category === 'custom' && (
 <button 
 onClick={(e) => {
 e.stopPropagation();
 deletePreset(preset.id);
 }}
 className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-500 transition-opacity rounded"
 >
 <X className="w-4 h-4" />
 </button>
 )}
 </div>
 <p className="text-sm text-indigo-600 font-medium mb-1">
 {preset.description || `${preset.options.width} × ${preset.options.height}`}
 </p>
 <p className="text-xs text-slate-500 truncate">
 {Object.entries(preset.options)
 .filter(([k, v]) => v !== undefined && k !== 'width' && k !== 'height')
 .map(([k, v]) => `${k}: ${v}`)
 .join(' · ')}
 </p>
 </div>
 );

 return (
 <div className="space-y-6">
 <div>
 <div className="flex items-center justify-between mb-4">
 <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
 Social Media
 </h3>
 </div>
 <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
 {presets.filter(p => p.category === 'social').map(renderPresetCard)}
 </div>
 </div>

 <div>
 <div className="flex items-center justify-between mb-4">
 <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
 Professional
 </h3>
 </div>
 <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
 {presets.filter(p => p.category === 'professional').map(renderPresetCard)}
 </div>
 </div>

 <div>
 <div className="flex items-center justify-between mb-4">
 <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
 My Custom Presets
 </h3>
 <button 
 onClick={onCreatePresetClick}
 className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-700 :text-indigo-300"
 >
 <Plus className="w-4 h-4 mr-1" /> Create Preset
 </button>
 </div>
 
 {presets.filter(p => p.category === 'custom').length > 0 ? (
 <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
 {presets.filter(p => p.category === 'custom').map(renderPresetCard)}
 </div>
 ) : (
 <div className="bg-slate-50 border border-dashed border-slate-200 rounded-xl p-8 text-center">
 <Bookmark className="w-8 h-8 text-slate-300 mx-auto mb-3" />
 <p className="text-sm text-slate-500 mb-4">You haven't created any custom presets yet.</p>
 <button 
 onClick={onCreatePresetClick}
 className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 :bg-slate-700 transition-colors"
 >
 Create Your First Preset
 </button>
 </div>
 )}
 </div>
 </div>
 );
}
