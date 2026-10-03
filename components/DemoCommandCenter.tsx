import { useState } from 'react';
import { UploadCloud, Zap, FolderTree, ShieldCheck, Wand2, ArrowRight, Share2, Activity, PlayCircle, CheckCircle2 } from 'lucide-react';
import { useAppStore } from '@/lib/store';

interface DemoCommandCenterProps {
 onNavigate: (view: string) => void;
}

export default function DemoCommandCenter({ onNavigate }: DemoCommandCenterProps) {
 const { uploadedMedia, collections, activities, transformHistory, shareLinks } = useAppStore();

 const steps = [
 {
 id: 'upload',
 title: '01 Upload',
 description: 'Upload raw assets to Cloudinary',
 icon: UploadCloud,
 isComplete: uploadedMedia.length > 0,
 action: () => onNavigate('dashboard')
 },
 {
 id: 'analyze',
 title: '02 AI Analyze',
 description: 'Extract tags & intelligence',
 icon: Zap,
 isComplete: uploadedMedia.some(m => (m.tags?.length || 0) > 0),
 action: () => onNavigate('library')
 },
 {
 id: 'organize',
 title: '03 Organize',
 description: 'Auto-group via Smart Collections',
 icon: FolderTree,
 isComplete: collections.length > 0, // Using manual collections for demo simplicity, or checking if any smart collections exist
 action: () => onNavigate('collections')
 },
 {
 id: 'moderate',
 title: '04 Moderate',
 description: 'Review and approve AI flagged content',
 icon: ShieldCheck,
 isComplete: activities.some(a => a.type === 'ANALYSIS'), // Simplified check
 action: () => onNavigate('moderation')
 },
 {
 id: 'transform',
 title: '05 Transform',
 description: 'Apply on-the-fly Cloudinary transformations',
 icon: Wand2,
 isComplete: transformHistory.length > 0,
 action: () => onNavigate('transform')
 },
 {
 id: 'share',
 title: '06 Share',
 description: 'Generate public gallery links',
 icon: Share2,
 isComplete: shareLinks.length > 0 || collections.some(c => c.isPublic),
 action: () => onNavigate('collections')
 },
 {
 id: 'analytics',
 title: '07 Analytics',
 description: 'Review operational performance',
 icon: Activity,
 isComplete: true, // Always ready to view
 action: () => onNavigate('analytics')
 },
 ];

 const completedCount = steps.filter(s => s.isComplete).length;
 const progress = (completedCount / steps.length) * 100;

 return (
 <div className="max-w-4xl mx-auto py-8 animate-in fade-in duration-500">
 <div className="text-center mb-12">
 <div className="inline-flex items-center justify-center p-3 bg-indigo-100 text-indigo-600 rounded-2xl mb-4">
 <PlayCircle className="w-8 h-8" />
 </div>
 <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-4">
 MEDIAFLOW AI
 </h1>
 <p className="text-lg text-slate-500 max-w-xl mx-auto">
 Intelligent Media Operations Platform. Use this command center to drive your end-to-end hackathon demonstration.
 </p>
 </div>

 <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden mb-8">
 <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
 <div>
 <h2 className="text-xl font-bold text-slate-900 ">Pipeline Status</h2>
 <p className="text-sm text-slate-500 mt-1">{completedCount} of {steps.length} capabilities demonstrated</p>
 </div>
 <div className="w-full sm:w-64">
 <div className="flex justify-between text-xs font-medium mb-2">
 <span className="text-indigo-600 ">Progress</span>
 <span className="text-slate-500">{Math.round(progress)}%</span>
 </div>
 <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
 <div 
 className="h-full bg-indigo-500 transition-all duration-1000 ease-out" 
 style={{ width: `${progress}%` }} 
 />
 </div>
 </div>
 </div>

 <div className="divide-y divide-slate-100 ">
 {steps.map((step, index) => (
 <div 
 key={step.id}
 onClick={step.action}
 className={`p-6 flex items-center justify-between group cursor-pointer transition-colors ${step.isComplete ? 'hover:bg-slate-50 :bg-slate-100/50' : 'hover:bg-indigo-50/50 :bg-indigo-900/10'}`}
 >
 <div className="flex items-center gap-6">
 <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${step.isComplete ? 'bg-emerald-100 text-emerald-600 ' : 'bg-slate-100 text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-600 :bg-indigo-900/50 :text-indigo-400'}`}>
 {step.isComplete ? <CheckCircle2 className="w-6 h-6" /> : <step.icon className="w-6 h-6" />}
 </div>
 <div>
 <h3 className={`text-lg font-bold ${step.isComplete ? 'text-slate-900 ' : 'text-slate-700 group-hover:text-indigo-700 :text-indigo-300'}`}>
 {step.title}
 </h3>
 <p className="text-slate-500 text-sm mt-0.5">{step.description}</p>
 </div>
 </div>
 <div className="opacity-0 group-hover:opacity-100 transition-opacity">
 <button className="flex items-center text-sm font-medium text-indigo-600 bg-indigo-50 px-4 py-2 rounded-lg">
 Run Step <ArrowRight className="w-4 h-4 ml-2" />
 </button>
 </div>
 </div>
 ))}
 </div>
 </div>
 </div>
 );
}
