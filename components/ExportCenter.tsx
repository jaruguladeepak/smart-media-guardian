import { useState } from 'react';
import { MediaData } from '@/lib/types';
import { generateTransformedUrl, TransformOptions } from '@/lib/transformations';
import { Download, ExternalLink, Loader2 } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { toast } from 'sonner';

interface ExportCenterProps {
  media: MediaData;
}

export default function ExportCenter({ media }: ExportCenterProps) {
  const [options, setOptions] = useState<TransformOptions>({
    format: 'auto',
    quality: 'auto',
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [exportUrl, setExportUrl] = useState<string | null>(null);
  
  const { addActivity } = useAppStore();

  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate generation time to feel like a "render"
    setTimeout(() => {
      const url = generateTransformedUrl(media.publicId, media.resourceType, options);
      setExportUrl(url);
      setIsGenerating(false);
      
      addActivity({
        publicId: media.publicId,
        type: 'EXPORT',
        description: 'Generated export URL',
      });
      
      toast.success('Export ready!');
    }, 800);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm mt-6">
      <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
        <h3 className="font-semibold flex items-center text-slate-900 dark:text-white">
          <Download className="w-5 h-5 mr-2 text-indigo-500" />
          Export Center
        </h3>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Format
            </label>
            <select 
              value={options.format || 'auto'}
              onChange={(e) => {
                setOptions(prev => ({ ...prev, format: e.target.value }));
                setExportUrl(null);
              }}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            >
              <option value="auto">Auto (Recommended)</option>
              {media.resourceType === 'image' ? (
                <>
                  <option value="webp">WebP</option>
                  <option value="avif">AVIF</option>
                  <option value="jpg">JPG</option>
                  <option value="png">PNG</option>
                </>
              ) : (
                <>
                  <option value="mp4">MP4</option>
                  <option value="webm">WebM</option>
                </>
              )}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Quality
            </label>
            <select 
              value={options.quality || 'auto'}
              onChange={(e) => {
                setOptions(prev => ({ ...prev, quality: e.target.value }));
                setExportUrl(null);
              }}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            >
              <option value="auto">Auto (Recommended)</option>
              <option value="good">Good</option>
              <option value="best">Best (Largest file)</option>
              <option value="eco">Eco (Smallest file)</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full sm:w-auto px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-medium rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors disabled:opacity-50 flex items-center justify-center"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating...
              </>
            ) : (
              'Generate Export'
            )}
          </button>
          
          {exportUrl && (
            <div className="flex items-center gap-2 w-full sm:w-auto animate-in fade-in slide-in-from-left-4 duration-300">
              <span className="text-emerald-500 flex items-center text-sm font-medium mr-2">
                ✓ Ready
              </span>
              <a 
                href={exportUrl} 
                target="_blank"
                rel="noreferrer"
                className="flex items-center px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-medium rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
              >
                <ExternalLink className="w-4 h-4 mr-2" /> Open Media
              </a>
              <a 
                href={exportUrl}
                download
                className="flex items-center px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <Download className="w-4 h-4 mr-2" /> Download
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
