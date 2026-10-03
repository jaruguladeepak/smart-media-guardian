import { Database, BarChart3, Binary } from 'lucide-react';

export default function DatasetExplorerPage() {
  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-900/30 flex items-center justify-center">
          <Database className="w-5 h-5 text-orange-600 dark:text-orange-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Dataset Explorer</h1>
          <p className="text-sm text-slate-500">Analyze the underlying feature distribution of your media library.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-sm text-slate-500 mb-1">Samples</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">1,240</div>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-sm text-slate-500 mb-1">Features Extracted</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">12</div>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-sm text-slate-500 mb-1">Missing Values</div>
          <div className="text-2xl font-bold text-emerald-500">0</div>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-sm text-slate-500 mb-1">Duplicate Records</div>
          <div className="text-2xl font-bold text-red-500">8</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-6 flex items-center">
            <BarChart3 className="w-4 h-4 mr-2 text-orange-500" />
            Distributions
          </h3>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-500 mb-2 uppercase">
                <span>Sharpness</span>
                <span>Normal Dist.</span>
              </div>
              <div className="w-full flex items-end gap-1 h-20 border-b border-slate-100 dark:border-slate-800 pb-1">
                {[2, 5, 12, 25, 45, 70, 95, 100, 85, 60, 35, 15, 8, 3].map((val, i) => (
                  <div key={i} className="flex-1 bg-orange-200 dark:bg-orange-900/50 rounded-t" style={{ height: `${val}%` }}></div>
                ))}
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-500 mb-2 uppercase">
                <span>Brightness</span>
                <span>Left Skewed</span>
              </div>
              <div className="w-full flex items-end gap-1 h-20 border-b border-slate-100 dark:border-slate-800 pb-1">
                {[100, 85, 65, 45, 30, 20, 15, 10, 8, 5, 3, 2, 1, 1].map((val, i) => (
                  <div key={i} className="flex-1 bg-indigo-200 dark:bg-indigo-900/50 rounded-t" style={{ height: `${val}%` }}></div>
                ))}
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-500 mb-2 uppercase">
                <span>Contrast</span>
                <span>Bimodal</span>
              </div>
              <div className="w-full flex items-end gap-1 h-20 border-b border-slate-100 dark:border-slate-800 pb-1">
                {[5, 15, 40, 75, 50, 20, 10, 30, 60, 90, 80, 45, 15, 5].map((val, i) => (
                  <div key={i} className="flex-1 bg-emerald-200 dark:bg-emerald-900/50 rounded-t" style={{ height: `${val}%` }}></div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-6 flex items-center">
            <Binary className="w-4 h-4 mr-2 text-indigo-500" />
            Correlation Matrix
          </h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-center">
              <thead>
                <tr>
                  <th className="p-2 border-b border-slate-200 dark:border-slate-700 text-slate-500 font-medium"></th>
                  <th className="p-2 border-b border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium">Sharpness</th>
                  <th className="p-2 border-b border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium">Contrast</th>
                  <th className="p-2 border-b border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium">Brightness</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-3 border-b border-slate-100 dark:border-slate-800/50 text-slate-700 dark:text-slate-300 font-medium text-left">Sharpness</td>
                  <td className="p-3 border-b border-slate-100 dark:border-slate-800/50 bg-indigo-50 dark:bg-indigo-900/20 font-bold">1.00</td>
                  <td className="p-3 border-b border-slate-100 dark:border-slate-800/50">0.42</td>
                  <td className="p-3 border-b border-slate-100 dark:border-slate-800/50">0.18</td>
                </tr>
                <tr>
                  <td className="p-3 border-b border-slate-100 dark:border-slate-800/50 text-slate-700 dark:text-slate-300 font-medium text-left">Contrast</td>
                  <td className="p-3 border-b border-slate-100 dark:border-slate-800/50">0.42</td>
                  <td className="p-3 border-b border-slate-100 dark:border-slate-800/50 bg-indigo-50 dark:bg-indigo-900/20 font-bold">1.00</td>
                  <td className="p-3 border-b border-slate-100 dark:border-slate-800/50">0.37</td>
                </tr>
                <tr>
                  <td className="p-3 text-slate-700 dark:text-slate-300 font-medium text-left">Brightness</td>
                  <td className="p-3">0.18</td>
                  <td className="p-3">0.37</td>
                  <td className="p-3 bg-indigo-50 dark:bg-indigo-900/20 font-bold">1.00</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
