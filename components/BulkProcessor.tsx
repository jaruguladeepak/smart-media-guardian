import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { X, CheckCircle2, Circle, Loader2, Sparkles, Wand2, Download, Image as ImageIcon } from 'lucide-react';
import { MediaData } from '@/lib/types';
import { toast } from 'sonner';

interface BulkProcessorProps {
  action: string | null;
  onClose: () => void;
  mediaList: MediaData[];
}

export default function BulkProcessor({ action, onClose, mediaList }: BulkProcessorProps) {
  const { selectedItems, clearSelection, addActivity, presets, addTransformHistory } = useAppStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);

  // Configuration options for processing
  const [options, setOptions] = useState({
    analyze: action === 'analyze',
    optimize: action === 'optimize',
    removeBackground: false,
    smartCrop: false,
    export: action === 'export',
  });

  if (!action) return null;

  const handleProcess = () => {
    setIsProcessing(true);
    let current = 0;
    
    // Simulate processing each file individually (local orchestration)
    const interval = setInterval(() => {
      current++;
      setProgress(current);
      
      if (current >= selectedItems.length) {
        clearInterval(interval);
        setIsProcessing(false);
        setIsDone(true);
        
        // Log bulk activity
        if (action === 'apply-preset' && selectedPresetId) {
          const preset = presets.find(p => p.id === selectedPresetId);
          if (preset) {
            // Apply preset to transform history for all selected items
            selectedItems.forEach(publicId => {
              addTransformHistory({
                publicId,
                name: preset.name,
                description: `Applied preset via bulk action`,
                options: preset.options,
                url: '#', // In a real app, generate the transformed URL here
              });
            });
            addActivity({
              publicId: 'bulk',
              type: 'TRANSFORMATION',
              description: `Applied preset "${preset.name}" to ${selectedItems.length} files`,
            });
          }
        } else {
          addActivity({
            publicId: 'bulk',
            type: 'TRANSFORMATION',
            description: `Bulk processed ${selectedItems.length} files`,
          });
        }
        
        toast.success(`Successfully processed ${selectedItems.length} files`);
      }
    }, 600);
  };

  const selectedMediaNodes = mediaList.filter(m => selectedItems.includes(m.publicId));

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
          <h2 className="font-semibold text-lg text-slate-900 dark:text-white flex items-center">
            {isDone ? (
              <><CheckCircle2 className="w-5 h-5 mr-2 text-emerald-500" /> Bulk Processing Complete</>
            ) : (
              action === 'export' ? 'Bulk Export' : action === 'apply-preset' ? 'Apply Preset' : 'Bulk Processing'
            )}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!isProcessing && !isDone ? (
            // configuration phase
            <div className="space-y-6">
              <p className="text-slate-600 dark:text-slate-400 font-medium">
                {selectedItems.length} files selected
              </p>

              {action === 'export' ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl border border-indigo-100 bg-indigo-50 dark:border-indigo-900/50 dark:bg-indigo-900/20">
                    <p className="text-sm text-indigo-800 dark:text-indigo-300 font-medium flex items-center mb-1">
                      <Download className="w-4 h-4 mr-2" /> Automatic Optimization
                    </p>
                    <p className="text-xs text-indigo-600/80 dark:text-indigo-400">
                      Files will be delivered with f_auto and q_auto parameters for best performance.
                    </p>
                  </div>
                </div>
              ) : action === 'apply-preset' ? (
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Select a preset to apply
                  </label>
                  <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
                    {presets.map(preset => (
                      <button
                        key={preset.id}
                        onClick={() => setSelectedPresetId(preset.id)}
                        className={`w-full text-left p-3 rounded-xl border transition-colors flex items-center ${
                          selectedPresetId === preset.id 
                            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30' 
                            : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        <span className="text-lg mr-3">{preset.icon || '⭐'}</span>
                        <div>
                          <p className="text-sm font-medium text-slate-900 dark:text-white">{preset.name}</p>
                          <p className="text-xs text-slate-500">{preset.description || `${preset.options.width || 'Auto'} × ${preset.options.height || 'Auto'}`}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <label className="flex items-center p-3 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <input type="checkbox" checked={options.analyze} onChange={(e) => setOptions({...options, analyze: e.target.checked})} className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500" />
                    <Sparkles className="w-4 h-4 ml-3 mr-2 text-blue-500" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Run AI Analysis</span>
                  </label>
                  
                  <label className="flex items-center p-3 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <input type="checkbox" checked={options.optimize} onChange={(e) => setOptions({...options, optimize: e.target.checked})} className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500" />
                    <Wand2 className="w-4 h-4 ml-3 mr-2 text-amber-500" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Smart Optimize (f_auto, q_auto)</span>
                  </label>
                  
                  <label className="flex items-center p-3 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <input type="checkbox" checked={options.removeBackground} onChange={(e) => setOptions({...options, removeBackground: e.target.checked})} className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500" />
                    <ImageIcon className="w-4 h-4 ml-3 mr-2 text-slate-400" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Remove Background</span>
                  </label>
                </div>
              )}
              
              <button
                onClick={handleProcess}
                disabled={action === 'apply-preset' && !selectedPresetId}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors mt-4 disabled:opacity-50"
              >
                {action === 'export' ? `Generate ${selectedItems.length} Exports` : action === 'apply-preset' ? `Apply Preset to ${selectedItems.length} Files` : `Process ${selectedItems.length} Files`}
              </button>
            </div>
          ) : isProcessing ? (
            // Processing state
            <div className="space-y-6">
              <div className="flex justify-between items-center text-sm font-medium text-slate-700 dark:text-slate-300">
                <span>Processing media...</span>
                <span>{progress} / {selectedItems.length}</span>
              </div>
              
              <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-600 transition-all duration-300 ease-out"
                  style={{ width: `${(progress / selectedItems.length) * 100}%` }}
                ></div>
              </div>

              <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                {selectedMediaNodes.map((media, i) => (
                  <div key={media.publicId} className="flex items-center text-sm">
                    {i < progress ? (
                      <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-500 flex-shrink-0" />
                    ) : i === progress ? (
                      <Loader2 className="w-4 h-4 mr-2 text-indigo-500 animate-spin flex-shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 mr-2 text-slate-300 dark:text-slate-700 flex-shrink-0" />
                    )}
                    <span className={`truncate ${i < progress ? 'text-slate-900 dark:text-white' : i === progress ? 'text-indigo-600 dark:text-indigo-400 font-medium' : 'text-slate-400 dark:text-slate-500'}`}>
                      {media.publicId.split('/').pop()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            // Done state
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
              </div>
              <p className="text-lg font-medium text-slate-900 dark:text-white">
                {selectedItems.length} / {selectedItems.length} successful
              </p>
              <button
                onClick={() => {
                  clearSelection();
                  onClose();
                }}
                className="w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-medium rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
              >
                Return to Library
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
