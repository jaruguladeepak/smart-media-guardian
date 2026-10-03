import { MediaData } from '@/lib/types';
import { useAppStore } from '@/lib/store';
import { History, Download, Eye, RotateCcw } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface TransformHistoryProps {
 media: MediaData;
 onApplyOptions?: (options: any) => void;
}

export default function TransformHistory({ media, onApplyOptions }: TransformHistoryProps) {
 const { transformHistory } = useAppStore();
 
 const history = transformHistory.filter(h => h.publicId === media.publicId);

 if (history.length === 0) return null;

 return (
 <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm mt-6">
 <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50 ">
 <h3 className="font-semibold flex items-center text-slate-900 ">
 <History className="w-5 h-5 mr-2 text-indigo-500" />
 Transformation History
 </h3>
 </div>
 <div className="divide-y divide-slate-100 max-h-[300px] overflow-y-auto">
 {history.map((entry) => (
 <div key={entry.id} className="p-4 hover:bg-slate-50 :bg-slate-100/50 transition-colors flex items-center justify-between group">
 <div className="flex-1 min-w-0 pr-4">
 <div className="flex items-center justify-between mb-1">
 <p className="text-sm font-medium text-slate-900 truncate">
 {entry.name}
 </p>
 <span className="text-xs text-slate-500 whitespace-nowrap ml-2">
 {formatDistanceToNow(new Date(entry.timestamp), { addSuffix: true })}
 </span>
 </div>
 <p className="text-xs text-slate-500 truncate">
 {Object.keys(entry.options).map(key => `${key}: ${entry.options[key]}`).join(' · ')}
 </p>
 </div>
 
 <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
 <a 
 href={entry.url}
 target="_blank"
 rel="noreferrer"
 title="Preview"
 className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 :bg-indigo-900/30 rounded-lg transition-colors"
 >
 <Eye className="w-4 h-4" />
 </a>
 {onApplyOptions && (
 <button 
 onClick={() => onApplyOptions(entry.options)}
 title="Use Again"
 className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 :bg-indigo-900/30 rounded-lg transition-colors"
 >
 <RotateCcw className="w-4 h-4" />
 </button>
 )}
 </div>
 </div>
 ))}
 </div>
 </div>
 );
}
