import { 
  LayoutDashboard, 
  Image as ImageIcon, 
  Layers, 
  Star, 
  Sparkles, 
  ShieldAlert, 
  Wand2, 
  Bookmark, 
  Activity, 
  Settings,
  AlertTriangle,
  Clock,
  Search,
  HeartPulse,
  Combine,
  Network,
  Database,
  Beaker,
  PieChart,
  Eye,
  LineChart,
  History,
  Share2,
  BoxSelect,
  Cloud,
  Bot,
  Target,
  Rocket
} from 'lucide-react';

export type ViewType = 'dashboard' | 'library' | 'search' | 'collections' | 'favorites' | 
  'ai_analysis' | 'moderation' | 'media_health' | 'similarity' | 'cleanup' | 'decision_engine' | 'batch_intelligence' | 'ai_agent' |
  'ml_dashboard' | 'pipeline_monitor' | 'mlops_center' | 'explainable_ai' | 'knowledge_graph' | 'model_lab' | 'dataset_explorer' | 'dataset_studio' | 'feature_engineering' | 'clustering' | 'anomaly_detection' | 'vision_lab' | 'visual_search' | 'embedding_explorer' | 'experiments' | 'workflows' |
  'transform' | 'presets' | 'bulk_processing' | 'export_center' |
  'analytics' | 'forecasting' | 'activity' | 'queue' |
  'galleries' | 'share_links' |
  'cloudinary_status' | 'analyze_asset' | 'settings';

interface SidebarProps {
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
}

export default function Sidebar({ activeView, setActiveView }: SidebarProps) {
  
  const mainLinks = [
    { id: 'dashboard', label: 'Command Center', icon: LayoutDashboard },
    { id: 'library', label: 'Media Library', icon: ImageIcon },
    { id: 'ai_agent', label: 'AI Copilot', icon: Bot },
  ];

  const intelligenceLinks = [
    { id: 'decision_engine', label: 'Autopilot', icon: Sparkles },
    { id: 'visual_search', label: 'Visual Search', icon: Search },
    { id: 'similarity', label: 'Similarity', icon: Combine },
    { id: 'knowledge_graph', label: 'Knowledge Graph', icon: Network },
    { id: 'anomaly_detection', label: 'Anomaly Detection', icon: AlertTriangle },
  ];

  const mlLinks = [
    { id: 'dataset_studio', label: 'Dataset Studio', icon: Database },
    { id: 'model_lab', label: 'Model Lab', icon: Beaker },
    { id: 'vision_lab', label: 'Vision Lab', icon: Eye },
    { id: 'explainable_ai', label: 'Explainable AI', icon: Target },
    { id: 'embedding_explorer', label: 'Embeddings', icon: Layers },
  ];

  const operationsLinks = [
    { id: 'workflows', label: 'Workflows', icon: Network },
    { id: 'moderation', label: 'Moderation', icon: ShieldAlert },
    { id: 'transform', label: 'Transform Studio', icon: BoxSelect },
    { id: 'cleanup', label: 'Cleanup', icon: Bookmark },
    { id: 'bulk_processing', label: 'Batch Processing', icon: Activity },
    { id: 'export_center', label: 'Export', icon: Share2 },
  ];

  const mlopsLinks = [
    { id: 'mlops_center', label: 'MLOps Center', icon: Database },
    { id: 'pipeline_monitor', label: 'Pipeline Monitor', icon: Activity },
  ];

  const renderLink = (link: any) => {
    const Icon = link.icon;
    const isActive = activeView === link.id;
    return (
      <button
        key={link.id}
        onClick={() => setActiveView(link.id as ViewType)}
        className={`w-full flex items-center px-4 py-3 mb-1 rounded-xl text-sm font-medium transition-all ${
          isActive 
            ? 'bg-white/10 text-white font-semibold' 
            : 'text-white/70 hover:bg-white/5 hover:text-white'
        }`}
      >
        <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${isActive ? 'bg-emerald-500/20 text-emerald-300' : 'text-white/60'}`}>
          <Icon className="w-4 h-4" />
        </div>
        {link.label}
      </button>
    );
  };

  return (
    <aside className="absolute top-0 left-0 z-40 w-64 h-full transition-transform -translate-x-full sm:translate-x-0 bg-[#050505] text-white flex flex-col sm:rounded-l-2xl border-r border-white/5 overflow-hidden shadow-2xl">
      <div className="h-20 flex items-center px-8 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 grid grid-cols-2 gap-0.5 opacity-90">
            <div className="bg-indigo-500 rounded-sm"></div>
            <div className="bg-white/80 rounded-sm"></div>
            <div className="bg-emerald-500 rounded-sm"></div>
            <div className="bg-indigo-400 rounded-sm"></div>
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            MediaFlow
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8 no-scrollbar">
        
        <div>
          <h3 className="px-5 text-[11px] font-bold text-emerald-400 uppercase tracking-wider mb-3">
            MediaFlow AI
          </h3>
          <nav>
            {mainLinks.map(renderLink)}
          </nav>
        </div>

        <div>
          <h3 className="px-5 text-[11px] font-bold text-indigo-400 uppercase tracking-wider mb-3">
            Intelligence
          </h3>
          <nav>
            {intelligenceLinks.map(renderLink)}
          </nav>
        </div>

        <div>
          <h3 className="px-5 text-[11px] font-bold text-indigo-400 uppercase tracking-wider mb-3">
            ML / Data Science
          </h3>
          <nav>
            {mlLinks.map(renderLink)}
          </nav>
        </div>

        <div>
          <h3 className="px-5 text-[11px] font-bold text-emerald-400 uppercase tracking-wider mb-3">
            Operations
          </h3>
          <nav>
            {operationsLinks.map(renderLink)}
          </nav>
        </div>

        <div>
          <h3 className="px-5 text-[11px] font-bold text-rose-400 uppercase tracking-wider mb-3">
            MLOps
          </h3>
          <nav>
            {mlopsLinks.map(renderLink)}
          </nav>
        </div>

        <div>
          <h3 className="px-5 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
            System
          </h3>
          <nav>
            {[{ id: 'analyze_asset', label: 'Analyze Asset (Demo)', icon: Rocket }].map(renderLink)}
          </nav>
        </div>

      </div>
    </aside>
  );
}
