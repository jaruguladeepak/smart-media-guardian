import { useState, useEffect } from 'react';
import { MediaData } from '@/lib/types';
import { generateTransformedUrl, TransformOptions } from '@/lib/transformations';
import { Settings2, Image as ImageIcon, Video as VideoIcon, Loader2, Wand2, Check } from 'lucide-react';
import Image from 'next/image';
import { useAppStore } from '@/lib/store';
import CompareSlider from './CompareSlider';
import TransformHistory from './TransformHistory';
import PresetPanel from './PresetPanel';
import PresetDialog from './PresetDialog';
import { toast } from 'sonner';

interface TransformStudioProps {
 media: MediaData;
}

export default function TransformStudio({ media }: TransformStudioProps) {
 const [options, setOptions] = useState<TransformOptions>({
 format: 'auto',
 quality: 'auto',
 });
 
 const [previewUrl, setPreviewUrl] = useState<string>('');
 const [originalUrl, setOriginalUrl] = useState<string>('');
 const [isGenerating, setIsGenerating] = useState(false);
 
 const [activeTab, setActiveTab] = useState<'manual' | 'presets'>('manual');
 const [showPresetDialog, setShowPresetDialog] = useState(false);
 
 const { addActivity, addTransformHistory } = useAppStore();

 // Generate preview when options or media changes
 useEffect(() => {
 setIsGenerating(true);
 // Add a small delay to debounce UI updates and show loading state
 const timer = setTimeout(() => {
 // Original URL (just standard f_auto/q_auto for baseline)
 const orig = generateTransformedUrl(media.publicId, media.resourceType, { format: 'auto', quality: 'auto' });
 setOriginalUrl(orig);

 const url = generateTransformedUrl(media.publicId, media.resourceType, options);
 setPreviewUrl(url);
 setIsGenerating(false);
 }, 500);
 return () => clearTimeout(timer);
 }, [media, options]);

 const handleCropChange = (ratio: string) => {
 if (ratio === 'original') {
 const { width, height, crop, gravity, ...rest } = options;
 setOptions(rest);
 return;
 }

 // Set arbitrary dimensions to enforce ratio for content-aware cropping
 let w = 800;
 let h = 800;
 
 if (ratio === '16:9') h = Math.round((w * 9) / 16);
 else if (ratio === '4:5') h = Math.round((w * 5) / 4);

 setOptions(prev => ({
 ...prev,
 width: w,
 height: h,
 crop: 'fill',
 gravity: 'auto' // Smart content-aware cropping
 }));

 addActivity({
 publicId: media.publicId,
 type: 'TRANSFORMATION',
 description: `Applied ${ratio} Smart Crop preview`,
 });
 };

 const handleApply = () => {
 addTransformHistory({
 publicId: media.publicId,
 name: 'Custom Transformation',
 description: 'Applied transformation settings',
 options: { ...options },
 url: previewUrl,
 });
 addActivity({
 publicId: media.publicId,
 type: 'TRANSFORMATION',
 description: 'Saved transformation to history',
 });
 toast.success('Transformation saved to history!');
 };

 // Determine if any options are changed from default
 const hasChanges = Object.keys(options).length > 2 || options.format !== 'auto' || options.quality !== 'auto' || options.backgroundRemoval;

 return (
 <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm mt-6">
 <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50 ">
 <h3 className="font-semibold flex items-center text-slate-900 ">
 <Settings2 className="w-5 h-5 mr-2 text-indigo-500" />
 Transform Studio
 </h3>
 <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 border border-emerald-200">Live Cloudinary URL API</span>
 </div>

 <div className="flex flex-col">
 {/* Preview Area */}
 <div className="w-full p-6 border-b border-slate-100 flex flex-col">
 <h4 className="text-sm font-medium text-slate-500 mb-4 uppercase tracking-wider">
 Live Preview
 </h4>
 <div className="flex-1 rounded-lg flex items-center justify-center relative overflow-hidden min-h-[400px]">
 {isGenerating && (
 <div className="absolute inset-0 z-50 bg-white/50 flex items-center justify-center backdrop-blur-sm transition-all">
 <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
 </div>
 )}
 
 {originalUrl && previewUrl && (
 <CompareSlider 
 originalSrc={originalUrl} 
 transformedSrc={previewUrl} 
 isVideo={media.resourceType === 'video'} 
 />
 )}
 </div>
 <div className="mt-4 p-3 bg-slate-50 rounded text-xs text-slate-500 break-all font-mono">
 {previewUrl}
 </div>
 </div>

 {/* Controls Area */}
 <div className="w-full p-6 space-y-6">
 
 <div className="flex border-b border-slate-200 ">
 <button
 onClick={() => setActiveTab('manual')}
 className={`pb-2 text-sm font-medium border-b-2 transition-colors px-4 ${activeTab === 'manual' ? 'border-indigo-500 text-indigo-600 ' : 'border-transparent text-slate-500 hover:text-slate-700 :text-slate-600'}`}
 >
 Manual Settings
 </button>
 <button
 onClick={() => setActiveTab('presets')}
 className={`pb-2 text-sm font-medium border-b-2 transition-colors px-4 ${activeTab === 'presets' ? 'border-indigo-500 text-indigo-600 ' : 'border-transparent text-slate-500 hover:text-slate-700 :text-slate-600'}`}
 >
 Presets
 </button>
 </div>

 {activeTab === 'presets' ? (
 <PresetPanel 
 onApplyPreset={(opts) => {
 setOptions(opts);
 toast.success('Preset applied! Click Apply Transformation to save.');
 }} 
 onCreatePresetClick={() => setShowPresetDialog(true)} 
 />
 ) : (
 <>
 <div>
 <h4 className="text-sm font-medium text-slate-900 mb-3 flex items-center">
 <ImageIcon className="w-4 h-4 mr-2 text-slate-500" /> Smart Crop (Content-Aware)
 </h4>
 <div className="flex flex-wrap gap-2">
 <button 
 onClick={() => handleCropChange('original')}
 className={`px-3 py-1.5 text-sm rounded-md border ${!options.crop ? 'bg-indigo-50 border-indigo-200 text-indigo-700 ' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 '}`}
 >
 Original
 </button>
 <button 
 onClick={() => handleCropChange('1:1')}
 className={`px-3 py-1.5 text-sm rounded-md border ${options.width === options.height && options.crop ? 'bg-indigo-50 border-indigo-200 text-indigo-700 ' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 '}`}
 >
 1:1 (Square)
 </button>
 <button 
 onClick={() => handleCropChange('4:5')}
 className={`px-3 py-1.5 text-sm rounded-md border ${options.width === 800 && options.height === 1000 ? 'bg-indigo-50 border-indigo-200 text-indigo-700 ' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 '}`}
 >
 4:5 (Portrait)
 </button>
 <button 
 onClick={() => handleCropChange('16:9')}
 className={`px-3 py-1.5 text-sm rounded-md border ${options.width === 800 && options.height === 450 ? 'bg-indigo-50 border-indigo-200 text-indigo-700 ' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 '}`}
 >
 16:9 (Landscape)
 </button>
 </div>
 <p className="text-xs text-slate-500 mt-2">Automatically focuses on the most important subject.</p>
 </div>

 {media.resourceType === 'image' && (
 <div>
 <h4 className="text-sm font-medium text-slate-900 mb-3 flex items-center">
 <Wand2 className="w-4 h-4 mr-2 text-slate-500" /> AI Background
 </h4>
 <button 
 onClick={() => {
 const newBgRemoval = !options.backgroundRemoval;
 setOptions(prev => ({ ...prev, backgroundRemoval: newBgRemoval }));
 addActivity({
 publicId: media.publicId,
 type: 'TRANSFORMATION',
 description: newBgRemoval ? 'Applied Background Removal' : 'Reverted Background Removal',
 });
 }}
 className={`px-4 py-2 text-sm font-medium rounded-md border flex items-center transition-colors ${options.backgroundRemoval ? 'bg-indigo-600 border-indigo-600 text-slate-900 shadow-sm' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 :bg-slate-200'}`}
 >
 <Wand2 className={`w-4 h-4 mr-2 ${options.backgroundRemoval ? 'text-indigo-200' : 'text-slate-500'}`} />
 {options.backgroundRemoval ? 'Background Removed' : 'Remove Background'}
 </button>
 </div>
 )}

 <div className="grid grid-cols-2 gap-4">
 <div>
 <label className="block text-sm font-medium text-slate-900 mb-1">
 Format
 </label>
 <select 
 value={options.format || 'auto'}
 onChange={(e) => setOptions(prev => ({ ...prev, format: e.target.value }))}
 className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
 >
 <option value="auto">Auto (f_auto)</option>
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
 <label className="block text-sm font-medium text-slate-900 mb-1">
 Quality
 </label>
 <select 
 value={options.quality || 'auto'}
 onChange={(e) => setOptions(prev => ({ ...prev, quality: e.target.value }))}
 className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
 >
 <option value="auto">Auto (q_auto)</option>
 <option value="good">Good</option>
 <option value="best">Best</option>
 <option value="eco">Eco</option>
 </select>
 </div>
 </div>

 <div className="pt-4 border-t border-slate-100 flex gap-3">
 <button 
 onClick={handleApply}
 disabled={!hasChanges}
 className="flex-1 flex items-center justify-center px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-slate-900 font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
 >
 <Check className="w-4 h-4 mr-2" /> Apply Transformation
 </button>
 
 {hasChanges && (
 <button
 onClick={() => setShowPresetDialog(true)}
 className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 :bg-slate-200 text-slate-700 font-medium rounded-xl transition-colors"
 >
 Save as Preset
 </button>
 )}
 </div>
 </>
 )}

 </div>
 </div>
 
 {/* Transformation History (rendered inside Studio) */}
 <TransformHistory media={media} onApplyOptions={(opts) => setOptions(opts)} />

 {/* Save Preset Dialog */}
 {showPresetDialog && (
 <PresetDialog 
 currentOptions={options} 
 onClose={() => setShowPresetDialog(false)} 
 />
 )}
 </div>
 );
}
