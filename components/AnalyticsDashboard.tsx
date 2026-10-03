import { useMemo } from 'react';
import { useAppStore } from '@/lib/store';
import { Activity, UploadCloud, Zap, Wand2, ShieldCheck, Download } from 'lucide-react';

export default function AnalyticsDashboard() {
  const { uploadedMedia, activities, transformHistory, mediaMetadata } = useAppStore();

  const stats = useMemo(() => {
    return {
      uploads: uploadedMedia.length,
      transformations: transformHistory.length,
      optimized: uploadedMedia.filter(m => m.format === 'webp' || m.format === 'avif' || m.format === 'mp4').length,
      favorites: Object.values(mediaMetadata).filter(m => m.isFavorite).length,
      moderated: uploadedMedia.filter(m => m.moderation && m.moderation.status !== 'unknown').length,
      analyzed: uploadedMedia.filter(m => m.tags && m.tags.length > 0).length,
    };
  }, [uploadedMedia, transformHistory, mediaMetadata]);

  // Derive simple charts data
  const activityByType = useMemo(() => {
    const counts: Record<string, number> = {};
    activities.forEach(a => {
      counts[a.type] = (counts[a.type] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [activities]);

  // Group uploads by recent days (mocking a bit since all might be today)
  // Let's just group by hour for a hackathon demo
  const uploadsByHour = useMemo(() => {
    const hours: Record<string, number> = {};
    const uploadActivities = activities.filter(a => a.type === 'UPLOAD');
    
    uploadActivities.forEach(a => {
      const d = new Date(a.timestamp);
      const hourLabel = `${d.getHours()}:00`;
      hours[hourLabel] = (hours[hourLabel] || 0) + 1;
    });
    
    return Object.entries(hours).sort((a, b) => a[0].localeCompare(b[0]));
  }, [activities]);

  const renderBar = (value: number, max: number, colorClass: string) => {
    const percentage = max > 0 ? (value / max) * 100 : 0;
    return (
      <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mt-1 relative">
        <div 
          className={`absolute top-0 left-0 h-full rounded-full ${colorClass} transition-all duration-1000 ease-out`} 
          style={{ width: `${Math.max(percentage, 2)}%` }}
        />
      </div>
    );
  };

  return (
    <div className="animate-in fade-in duration-300">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-2 flex items-center gap-2">
          <Activity className="w-6 h-6 text-indigo-500" />
          Media Analytics
        </h1>
        <p className="text-slate-500">Track your media pipeline performance and usage.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-slate-500 font-medium text-sm">Total Uploads</h3>
            <UploadCloud className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-3xl font-bold text-slate-900 dark:text-white">{stats.uploads}</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-slate-500 font-medium text-sm">Transformations</h3>
            <Wand2 className="w-5 h-5 text-indigo-500" />
          </div>
          <div className="text-3xl font-bold text-slate-900 dark:text-white">{stats.transformations}</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-slate-500 font-medium text-sm">AI Analyzed</h3>
            <Zap className="w-5 h-5 text-amber-500" />
          </div>
          <div className="text-3xl font-bold text-slate-900 dark:text-white">{stats.analyzed}</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-slate-500 font-medium text-sm">Moderated</h3>
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="text-3xl font-bold text-slate-900 dark:text-white">{stats.moderated}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Distribution */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-6">Activity Distribution</h3>
          {activityByType.length > 0 ? (
            <div className="space-y-5">
              {activityByType.map(([type, count]) => {
                const max = activityByType[0][1];
                let color = "bg-blue-500";
                if (type === 'TRANSFORMATION') color = "bg-indigo-500";
                if (type === 'ANALYSIS') color = "bg-amber-500";
                if (type === 'EXPORT') color = "bg-emerald-500";
                if (type === 'FAVORITE') color = "bg-yellow-400";
                
                return (
                  <div key={type}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-slate-700 dark:text-slate-300 capitalize">{type.toLowerCase().replace('_', ' ')}</span>
                      <span className="text-slate-500">{count}</span>
                    </div>
                    {renderBar(count, max, color)}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-10 text-center text-slate-500">No activity recorded yet</div>
          )}
        </div>

        {/* Uploads Timeline */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-6">Uploads by Hour</h3>
          {uploadsByHour.length > 0 ? (
            <div className="h-64 flex items-end gap-2 mt-auto pt-4">
              {uploadsByHour.map(([hour, count]) => {
                const maxCount = Math.max(...uploadsByHour.map(u => u[1]));
                const heightPercent = (count / maxCount) * 100;
                return (
                  <div key={hour} className="flex-1 flex flex-col items-center justify-end h-full group">
                    <div className="w-full relative flex items-end justify-center h-full pb-2">
                      <div className="w-full bg-emerald-500 rounded-t-sm transition-all duration-500 group-hover:bg-emerald-400" style={{ height: `${Math.max(heightPercent, 5)}%` }}></div>
                      <div className="absolute -top-6 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold text-slate-700 dark:text-slate-300">{count}</div>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-2">{hour}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-20 text-center text-slate-500 flex flex-col items-center">
              <Download className="w-8 h-8 mb-2 opacity-20" />
              <span>No uploads today</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
