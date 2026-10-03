import { useAppStore } from '@/lib/store';
import { X, Sparkles, Wand2, FolderPlus, Download, Trash2, Loader2, Bookmark } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface BulkActionBarProps {
  onProcess: (action: string) => void;
  onAddToCollection: () => void;
}

export default function BulkActionBar({ onProcess, onAddToCollection }: BulkActionBarProps) {
  const { selectedItems, clearSelection } = useAppStore();
  const [isProcessing, setIsProcessing] = useState(false);

  if (selectedItems.length === 0) return null;

  const handleAction = (action: string) => {
    setIsProcessing(true);
    // Simulate processing time
    setTimeout(() => {
      onProcess(action);
      setIsProcessing(false);
    }, 500);
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-8 duration-300 fade-in">
      <div className="bg-slate-900 text-white rounded-2xl shadow-2xl flex items-center p-2 pl-6 gap-6 border border-slate-700/50 backdrop-blur-xl">
        
        {/* Selected Count */}
        <div className="flex items-center gap-3">
          <span className="bg-indigo-600 text-white text-sm font-bold w-6 h-6 rounded-full flex items-center justify-center">
            {selectedItems.length}
          </span>
          <span className="text-sm font-medium whitespace-nowrap hidden sm:inline">
            files selected
          </span>
        </div>

        <div className="w-px h-8 bg-slate-700"></div>

        {/* Actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button 
            onClick={() => handleAction('analyze')}
            disabled={isProcessing}
            className="flex items-center text-sm font-medium px-3 py-2 rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 mr-2 text-blue-400" />
            <span className="hidden md:inline">Analyze</span>
          </button>
          
          <button 
            onClick={() => handleAction('optimize')}
            disabled={isProcessing}
            className="flex items-center text-sm font-medium px-3 py-2 rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            <Wand2 className="w-4 h-4 mr-2 text-amber-400" />
            <span className="hidden md:inline">Optimize</span>
          </button>
          
          <button 
            onClick={onAddToCollection}
            disabled={isProcessing}
            className="flex items-center text-sm font-medium px-3 py-2 rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            <FolderPlus className="w-4 h-4 mr-2 text-emerald-400" />
            <span className="hidden md:inline">Add to...</span>
          </button>

          <button 
            onClick={() => handleAction('apply-preset')}
            disabled={isProcessing}
            className="flex items-center text-sm font-medium px-3 py-2 rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            <Bookmark className="w-4 h-4 mr-2 text-purple-400" />
            <span className="hidden md:inline">Apply Preset</span>
          </button>

          <button 
            onClick={() => handleAction('export')}
            disabled={isProcessing}
            className="flex items-center text-sm font-medium px-3 py-2 rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            <Download className="w-4 h-4 md:mr-2 text-slate-300" />
            <span className="hidden md:inline">Export</span>
          </button>
        </div>

        <div className="w-px h-8 bg-slate-700"></div>

        {/* Clear Selection */}
        <button 
          onClick={clearSelection}
          className="p-2 hover:bg-slate-800 rounded-xl transition-colors text-slate-400 hover:text-white"
          title="Clear Selection"
        >
          <X className="w-5 h-5" />
        </button>
        
      </div>
    </div>
  );
}
