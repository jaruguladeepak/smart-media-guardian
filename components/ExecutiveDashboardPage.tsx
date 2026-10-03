import { BarChart, Activity, Sparkles, AlertTriangle, CheckCircle2, ShieldAlert, ImageIcon } from 'lucide-react';
import { MediaData } from '@/lib/types';
import Image from 'next/image';

interface ExecutiveDashboardPageProps {
  mediaList: MediaData[];
}

export default function ExecutiveDashboardPage({ mediaList }: ExecutiveDashboardPageProps) {
  const totalAssets = mediaList.length;
  // Mock aggregated stats for demo
  const safeCount = Math.floor(totalAssets * 0.91) || 0;
  const analyzedCount = totalAssets || 0;
  const optimizableCount = Math.floor(totalAssets * 0.42) || 0;

  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-white flex items-center justify-center shadow-md">
          <BarChart className="w-5 h-5 text-white dark:text-slate-900" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Media Intelligence Command Center</h1>
          <p className="text-sm text-slate-500">Executive overview of autonomous AI operations and media health.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Assets</div>
            <div className="text-3xl font-black text-slate-900 dark:text-white">{totalAssets}</div>
          </div>
          <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
            <ImageIcon className="w-6 h-6 text-slate-400" />
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex items-center justify-between border-l-4 border-l-emerald-500">
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Moderation Status</div>
            <div className="text-3xl font-black text-slate-900 dark:text-white">91% <span className="text-sm text-emerald-500 ml-1">Safe</span></div>
          </div>
          <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center">
            <ShieldAlert className="w-6 h-6 text-emerald-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex items-center justify-between border-l-4 border-l-amber-500">
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Optimization Queue</div>
            <div className="text-3xl font-black text-slate-900 dark:text-white">{optimizableCount} <span className="text-sm text-amber-500 ml-1">Assets</span></div>
          </div>
          <div className="w-12 h-12 rounded-full bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center">
            <Activity className="w-6 h-6 text-amber-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Quality Distribution */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-6 flex items-center text-sm uppercase tracking-wider">
            <Sparkles className="w-4 h-4 mr-2 text-indigo-500" />
            Quality Distribution (Random Forest)
          </h3>
          
          <div className="space-y-4">
            {[
              { label: 'Excellent', val: 32, color: 'bg-emerald-500' },
              { label: 'Good', val: 44, color: 'bg-blue-500' },
              { label: 'Average', val: 18, color: 'bg-amber-500' },
              { label: 'Poor', val: 6, color: 'bg-rose-500' }
            ].map((q, i) => (
              <div key={i} className="flex items-center text-sm">
                <div className="w-24 font-bold text-slate-700 dark:text-slate-300">{q.label}</div>
                <div className="flex-1 px-4">
                  <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${q.color}`} style={{ width: `${q.val}%` }}></div>
                  </div>
                </div>
                <div className="w-12 text-right font-medium text-slate-500">{q.val}%</div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Activity */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-6 flex items-center text-sm uppercase tracking-wider">
            <Activity className="w-4 h-4 mr-2 text-indigo-500" />
            AI Pipeline Activity
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700/50">
              <div className="text-xl mb-1">🧠</div>
              <div className="text-lg font-bold text-slate-900 dark:text-white">8,721</div>
              <div className="text-xs text-slate-500">Assets Analyzed</div>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700/50">
              <div className="text-xl mb-1">🔍</div>
              <div className="text-lg font-bold text-slate-900 dark:text-white">2,103</div>
              <div className="text-xs text-slate-500">Similar Matches</div>
            </div>
            <div className="p-3 bg-rose-50 dark:bg-rose-900/10 rounded-lg border border-rose-100 dark:border-rose-900/30">
              <div className="text-xl mb-1">⚠️</div>
              <div className="text-lg font-bold text-rose-600">143</div>
              <div className="text-xs text-rose-500 font-medium">Anomalies Detected</div>
            </div>
            <div className="p-3 bg-indigo-50 dark:bg-indigo-900/10 rounded-lg border border-indigo-100 dark:border-indigo-900/30">
              <div className="text-xl mb-1">⚡</div>
              <div className="text-lg font-bold text-indigo-600">643</div>
              <div className="text-xs text-indigo-500 font-medium">Optimizations Active</div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Recommendations */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
           <h3 className="font-bold text-slate-700 dark:text-slate-300 flex items-center text-sm uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4 mr-2 text-indigo-500" />
            Top Recommendations
          </h3>
          <button className="px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400 text-xs font-bold rounded transition-colors">
            Execute All
          </button>
        </div>
        
        <div className="space-y-3">
          {[
            { num: 1, action: 'Optimize 143 large JPEG assets to WebP format', priority: 'High', color: 'amber' },
            { num: 2, action: 'Review 32 anomalous images flagged by Isolation Forest', priority: 'High', color: 'rose' },
            { num: 3, action: 'Investigate 18 duplicate groups for deletion (Save ~1.2GB)', priority: 'Medium', color: 'blue' },
            { num: 4, action: 'Generate 16:9 responsive versions for 76 hero assets', priority: 'Low', color: 'emerald' },
          ].map((rec, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700/50 hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors cursor-pointer group">
              <div className="flex items-center">
                <div className={`w-6 h-6 rounded bg-${rec.color}-100 dark:bg-${rec.color}-900/40 text-${rec.color}-600 dark:text-${rec.color}-400 font-bold text-xs flex items-center justify-center mr-4`}>
                  {rec.num}
                </div>
                <div className="font-medium text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {rec.action}
                </div>
              </div>
              <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase bg-${rec.color}-50 text-${rec.color}-600 dark:bg-${rec.color}-900/20 dark:text-${rec.color}-400`}>
                {rec.priority}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
