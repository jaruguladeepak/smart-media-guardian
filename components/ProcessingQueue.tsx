import { useState, useEffect } from 'react';
import { Activity, Clock, CheckCircle2, XCircle, Loader2, RotateCcw } from 'lucide-react';
import { useAppStore } from '@/lib/store';

export default function ProcessingQueue() {
  const { activities } = useAppStore();
  
  // For the hackathon demo, we'll derive "queue" state from recent activities
  // and simulate some processing/failed states based on demoMode
  const { demoMode } = useAppStore();

  return (
    <div className="max-w-4xl mx-auto py-8 animate-in fade-in duration-500">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-2 flex items-center gap-2">
          <Activity className="w-6 h-6 text-indigo-500" />
          Processing Queue
        </h1>
        <p className="text-slate-500">Monitor background tasks, AI analyses, and bulk transformations.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
          <div className="flex gap-4 text-sm font-medium">
            <span className="text-slate-900 dark:text-white pb-4 border-b-2 border-indigo-500 -mb-4">All Tasks</span>
            <span className="text-slate-500 pb-4 border-b-2 border-transparent -mb-4">Pending (0)</span>
            <span className="text-slate-500 pb-4 border-b-2 border-transparent -mb-4">Failed {demoMode ? '(1)' : '(0)'}</span>
          </div>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {demoMode && (
            <div className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 flex items-center justify-center flex-shrink-0">
                  <XCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white">Bulk AI Analysis (Batch #442)</h4>
                  <p className="text-sm text-slate-500">Failed: Cloudinary Vision Add-on rate limit exceeded</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400">Just now</span>
                <button className="flex items-center px-3 py-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700">
                  <RotateCcw className="w-4 h-4 mr-1.5" /> Retry
                </button>
              </div>
            </div>
          )}

          {activities.length > 0 ? activities.slice(0, 10).map(activity => (
            <div key={activity.id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white capitalize">{activity.type.replace('_', ' ')}</h4>
                  <p className="text-sm text-slate-500">{activity.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400">
                  {new Date(activity.timestamp).toLocaleTimeString()}
                </span>
                <span className="px-2.5 py-1 text-xs font-medium bg-emerald-50 text-emerald-700 rounded-full dark:bg-emerald-900/20 dark:text-emerald-400">
                  Completed
                </span>
              </div>
            </div>
          )) : (
            <div className="p-12 text-center text-slate-500">
              <Clock className="w-8 h-8 mx-auto mb-3 opacity-50" />
              <p>No recent tasks in the queue.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
