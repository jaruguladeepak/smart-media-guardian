import { useState } from 'react';
import { Network, Plus, Play, MoreVertical, Zap, FolderOutput, ShieldCheck, Settings, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AutonomousWorkflowsPage() {
  const [workflows] = useState([
    {
      id: 1,
      name: "Optimize Low-Quality Uploads",
      trigger: "New image uploaded",
      condition: "Quality < 60",
      actions: [
        "Generate WebP format",
        "Generate 4:5 social format",
        "Add tag 'needs-optimization'",
        "Notify human reviewer"
      ],
      active: true,
      runs: 124,
      lastRun: "2 mins ago"
    },
    {
      id: 2,
      name: "Duplicate Resolution",
      trigger: "Duplicate group detected",
      condition: "Similarity > 95%",
      actions: [
        "Keep highest-quality original",
        "Move other assets to Review",
        "Calculate recoverable storage",
        "Request human confirmation"
      ],
      active: true,
      runs: 48,
      lastRun: "1 hour ago"
    },
    {
      id: 3,
      name: "Auto-Tag Anomaly Detection",
      trigger: "Image anomaly detected",
      condition: "Risk Level == High",
      actions: [
        "Quarantine asset",
        "Add tag 'quarantine'",
        "Run Deep Moderation scan",
        "Email Admin"
      ],
      active: false,
      runs: 12,
      lastRun: "5 days ago"
    }
  ]);

  const [activeRun, setActiveRun] = useState<any>(null);

  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center shadow-sm">
            <Network className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Autonomous Workflows</h1>
            <p className="text-sm text-slate-500">Connect Cloudinary, ML, and Decision Engine into reusable automation rules.</p>
          </div>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center shadow-sm transition-colors">
          <Plus className="w-4 h-4 mr-2" /> Create Workflow
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {workflows.map((wf) => (
          <div key={wf.id} className={`bg-white dark:bg-slate-900 border ${wf.active ? 'border-indigo-200 dark:border-indigo-800 shadow-md shadow-indigo-100 dark:shadow-none' : 'border-slate-200 dark:border-slate-800 opacity-75'} rounded-xl p-6 transition-all hover:shadow-lg`}>
            
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-lg">{wf.name}</h3>
                <div className="flex items-center mt-1">
                  <div className={`w-2 h-2 rounded-full mr-2 ${wf.active ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></div>
                  <span className="text-xs font-bold text-slate-500 uppercase">{wf.active ? 'Active' : 'Paused'}</span>
                </div>
              </div>
              <button onClick={() => setActiveRun(wf)} className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1 text-xs font-bold px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded">
                <Play className="w-3 h-3" /> Test
              </button>
            </div>

            <div className="space-y-4 font-mono text-sm mb-6">
              <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
                <div className="text-xs text-slate-400 font-bold mb-1 uppercase tracking-wider">WHEN</div>
                <div className="text-indigo-600 dark:text-indigo-400 font-bold flex items-center">
                  <Zap className="w-4 h-4 mr-2" /> {wf.trigger}
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
                <div className="text-xs text-slate-400 font-bold mb-1 uppercase tracking-wider">IF</div>
                <div className="text-amber-600 dark:text-amber-400 font-bold flex items-center">
                  <Settings className="w-4 h-4 mr-2" /> {wf.condition}
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
                <div className="text-xs text-slate-400 font-bold mb-2 uppercase tracking-wider">THEN</div>
                <div className="space-y-2">
                  {wf.actions.map((action, i) => (
                    <div key={i} className="flex items-start text-emerald-600 dark:text-emerald-400 font-bold">
                      <span className="mr-2">→</span> <span>{action}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div className="text-slate-500">
                <span className="font-bold text-slate-700 dark:text-slate-300">{wf.runs}</span> Executions
              </div>
              <div className="text-slate-500">
                Last run: {wf.lastRun}
              </div>
            </div>

          </div>
        ))}

        <div className="bg-slate-50 dark:bg-slate-800/30 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors h-full min-h-[400px]">
          <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-800 shadow flex items-center justify-center mb-4">
            <Plus className="w-6 h-6 text-slate-400" />
          </div>
          <h3 className="font-bold text-slate-700 dark:text-slate-300">Create New Workflow</h3>
          <p className="text-sm text-slate-500 mt-2 max-w-xs">Automate media operations using the Intelligence API.</p>
        </div>
      </div>

      {activeRun && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 text-slate-300 w-full max-w-lg rounded-xl border border-slate-700 shadow-2xl p-8 font-mono text-sm leading-relaxed relative animate-in zoom-in-95">
            <button onClick={() => setActiveRun(null)} className="absolute top-4 right-4 text-slate-500 hover:text-white">✕</button>
            
            <div className="text-white font-bold text-base mb-6 pb-4 border-b border-slate-800">
              WORKFLOW RUN #1042<br/>
              <span className="text-slate-500 font-normal text-xs">{new Date().toISOString()}</span>
            </div>

            <div className="space-y-2 mb-8">
              <div className="flex items-start"><span className="text-emerald-500 mr-3">✓</span> Asset received (ID: demo_upload_8892)</div>
              <div className="flex items-start"><span className="text-emerald-500 mr-3">✓</span> Quality analyzed: 47/100</div>
              <div className="flex items-start"><span className="text-emerald-500 mr-3">✓</span> Condition matched: {activeRun.condition}</div>
              {activeRun.actions.map((action: string, i: number) => (
                <div key={i} className="flex items-start"><span className="text-emerald-500 mr-3">✓</span> {action} (simulated execution)</div>
              ))}
            </div>

            <div className="border border-slate-800 bg-slate-950 p-4 rounded-lg mb-6">
              <div className="text-xs text-slate-500 mb-2 uppercase tracking-widest">Audit Trail Record</div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="text-slate-500">workflow_id:</div><div className="text-indigo-300">WF-{activeRun.id}</div>
                <div className="text-slate-500">model_version:</div><div className="text-white">v3.1.4 (RF)</div>
                <div className="text-slate-500">latency:</div><div className="text-white">342ms</div>
              </div>
            </div>

            <div className="text-emerald-400 font-bold tracking-widest">Result: COMPLETED</div>
          </div>
        </div>
      )}
    </div>
  );
}
