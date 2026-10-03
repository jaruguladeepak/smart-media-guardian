import { useState } from 'react';
import { Database, Activity, AlertTriangle, CheckCircle2, Server, GitBranch, History, Cpu, FileText, Settings, ShieldAlert, ArrowRight, Save, Upload, RotateCw } from 'lucide-react';
import { toast } from 'sonner';

export default function MlOpsCenterPage() {
  const [activeTab, setActiveTab] = useState<'registry' | 'audit' | 'drift' | 'review'>('registry');

  const renderRegistry = () => (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-slate-900 dark:text-white flex items-center">
          <GitBranch className="w-5 h-5 mr-2 text-indigo-500" />
          Model Registry
        </h3>
        <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center shadow-sm">
          <Upload className="w-4 h-4 mr-2" />
          Import Model
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 uppercase text-xs font-bold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4">Version</th>
                <th className="px-6 py-4">Architecture</th>
                <th className="px-6 py-4">Dataset</th>
                <th className="px-6 py-4">Accuracy</th>
                <th className="px-6 py-4">F1 Score</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              <tr className="bg-indigo-50/50 dark:bg-indigo-900/10">
                <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">v3.2.0</td>
                <td className="px-6 py-4">Random Forest</td>
                <td className="px-6 py-4 font-mono text-xs">human_v2</td>
                <td className="px-6 py-4 text-emerald-600 font-bold">87.3%</td>
                <td className="px-6 py-4">0.86</td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 font-bold text-[10px] uppercase rounded-full border border-emerald-200 dark:border-emerald-800/50">
                    Production
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="text-slate-500 hover:text-indigo-600 transition-colors font-medium">View details</button>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">v3.1.5</td>
                <td className="px-6 py-4">Gradient Boosting</td>
                <td className="px-6 py-4 font-mono text-xs">human_v1</td>
                <td className="px-6 py-4 font-medium">85.1%</td>
                <td className="px-6 py-4">0.84</td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold text-[10px] uppercase rounded-full border border-slate-200 dark:border-slate-700">
                    Archived
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="text-slate-500 hover:text-indigo-600 transition-colors font-medium">Promote</button>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">v3.1.0</td>
                <td className="px-6 py-4">Logistic Regression</td>
                <td className="px-6 py-4 font-mono text-xs">baseline_0</td>
                <td className="px-6 py-4 text-rose-500 font-medium">78.2%</td>
                <td className="px-6 py-4">0.76</td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold text-[10px] uppercase rounded-full border border-slate-200 dark:border-slate-700">
                    Archived
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="text-slate-500 hover:text-indigo-600 transition-colors font-medium">Promote</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderAuditLog = () => (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-slate-900 dark:text-white flex items-center">
          <History className="w-5 h-5 mr-2 text-indigo-500" />
          Prediction Audit Log
        </h3>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 uppercase text-xs font-bold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4">Asset ID</th>
                <th className="px-6 py-4">Model Ver</th>
                <th className="px-6 py-4">Prediction</th>
                <th className="px-6 py-4">Confidence</th>
                <th className="px-6 py-4">Processing Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {[
                { time: '10:42:15 AM', id: 'IMG_8942', ver: 'v3.2.0', pred: 'GOOD', conf: 0.94, time_ms: 142 },
                { time: '10:41:03 AM', id: 'hero_banner_v2', ver: 'v3.2.0', pred: 'EXCELLENT', conf: 0.88, time_ms: 184 },
                { time: '10:38:22 AM', id: 'upload_tmp_44', ver: 'v3.2.0', pred: 'POOR', conf: 0.96, time_ms: 156 },
                { time: '10:22:11 AM', id: 'campaign_asset_1', ver: 'v3.2.0', pred: 'AVERAGE', conf: 0.62, time_ms: 177 },
                { time: '09:14:05 AM', id: 'product_shot_9', ver: 'v3.2.0', pred: 'GOOD', conf: 0.82, time_ms: 148 },
              ].map((log, i) => (
                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 text-slate-500 font-mono text-xs">{log.time}</td>
                  <td className="px-6 py-4 font-medium text-indigo-600 dark:text-indigo-400">{log.id}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded text-xs font-mono">{log.ver}</span>
                  </td>
                  <td className="px-6 py-4 font-bold">
                    <span className={log.pred === 'POOR' ? 'text-rose-500' : log.pred === 'AVERAGE' ? 'text-amber-500' : 'text-emerald-500'}>
                      {log.pred}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs">{(log.conf * 100).toFixed(1)}%</td>
                  <td className="px-6 py-4 text-slate-500">{log.time_ms}ms</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderDrift = () => (
    <div className="space-y-6 animate-in fade-in">
       <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-slate-900 dark:text-white flex items-center">
          <Activity className="w-5 h-5 mr-2 text-indigo-500" />
          Data Drift Detection & Lifecycle
        </h3>
        <span className="text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700">
          Last Check: 10 mins ago
        </span>
      </div>

      <div className="bg-slate-900 text-slate-300 border border-slate-800 rounded-xl p-8 shadow-sm font-mono text-sm flex justify-center">
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="text-emerald-400 font-bold tracking-widest">TRAINING BASELINE</div>
          <div className="text-slate-500">↓</div>
          <div className="text-indigo-400 font-bold tracking-widest">PRODUCTION DATA</div>
          <div className="text-slate-500">↓</div>
          <div className="text-white tracking-widest">Drift Detection</div>
          <div className="text-slate-500">↓</div>
          
          <div className="border border-rose-500 px-4 py-2 mt-2 mb-2 text-rose-400 font-bold bg-rose-500/10">
            ┌───────────────┐<br/>
            │ Drift detected│<br/>
            └───────────────┘
          </div>
          
          <div className="text-slate-500">↓</div>
          <div className="text-white tracking-widest">Human Review</div>
          <div className="text-slate-500">↓</div>
          <div className="text-teal-400 font-bold tracking-widest">Dataset v3</div>
          <div className="text-slate-500">↓</div>
          <div className="text-white tracking-widest">Retrain</div>
          <div className="text-slate-500">↓</div>
          <div className="text-white tracking-widest">Evaluate</div>
          <div className="text-slate-500">↓</div>
          <div className="text-emerald-400 font-bold tracking-widest">Register Model</div>
          <div className="text-slate-500">↓</div>
          <div className="text-indigo-400 font-bold tracking-widest">Deploy</div>
        </div>
      </div>
    </div>
  );

  const renderReview = () => (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-slate-900 dark:text-white flex items-center">
          <CheckCircle2 className="w-5 h-5 mr-2 text-indigo-500" />
          Human Review Queue
        </h3>
        <span className="text-sm font-medium text-slate-500">12 items pending</span>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm p-6 text-center py-20 flex flex-col items-center">
         <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mb-4">
           <ShieldAlert className="w-8 h-8 text-indigo-500" />
         </div>
         <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Review 12 Low-Confidence Assets</h3>
         <p className="text-slate-500 max-w-md mb-8 text-sm">
           These assets were flagged because the model prediction confidence fell below the 70% threshold. Your corrections will be added to the feedback dataset for retraining.
         </p>
         <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-colors shadow-lg shadow-indigo-200 dark:shadow-none flex items-center">
           Start Review Session <ArrowRight className="w-4 h-4 ml-2" />
         </button>
      </div>
    </div>
  );

  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center shadow-sm">
          <Database className="w-5 h-5 text-purple-600 dark:text-purple-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">MLOps Center</h1>
          <p className="text-sm text-slate-500">Production intelligence, model registry, monitoring, and retraining.</p>
        </div>
      </div>

      <div className="flex border-b border-slate-200 dark:border-slate-800 mb-8 overflow-x-auto no-scrollbar">
        {[
          { id: 'registry', label: 'Model Registry', icon: GitBranch },
          { id: 'audit', label: 'Prediction Audit Log', icon: History },
          { id: 'drift', label: 'Data Drift', icon: Activity },
          { id: 'review', label: 'Human Review', icon: CheckCircle2 },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center py-3 px-6 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <tab.icon className="w-4 h-4 mr-2" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'registry' && renderRegistry()}
      {activeTab === 'audit' && renderAuditLog()}
      {activeTab === 'drift' && renderDrift()}
      {activeTab === 'review' && renderReview()}

    </div>
  );
}
