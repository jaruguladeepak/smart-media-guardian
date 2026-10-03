import { useState, useEffect } from 'react';
import { Search, Upload, Bot, Image as ImageIcon, Activity, Database, AlertTriangle, ShieldAlert, Sparkles, Network } from 'lucide-react';
import { ViewType } from './Sidebar';

interface CommandPaletteProps {
 isOpen: boolean;
 onClose: () => void;
 onNavigate: (view: ViewType) => void;
}

export default function CommandPalette({ isOpen, onClose, onNavigate }: CommandPaletteProps) {
 const [search, setSearch] = useState('');

 useEffect(() => {
 const handleKeyDown = (e: KeyboardEvent) => {
 if (e.key === 'Escape') {
 onClose();
 }
 };
 window.addEventListener('keydown', handleKeyDown);
 return () => window.removeEventListener('keydown', handleKeyDown);
 }, [onClose]);

 if (!isOpen) return null;

 const commands = [
 { id: 'analyze_asset', label: 'Analyze asset', icon: Sparkles, section: 'Actions' },
 { id: 'upload_media', label: 'Upload media', icon: Upload, section: 'Actions' },
 { id: 'decision_engine', label: 'Run AI Autopilot', icon: Bot, section: 'Actions' },
 { id: 'visual_search', label: 'Search visually', icon: Search, section: 'Navigation' },
 { id: 'ml_dashboard', label: 'Open ML Dashboard', icon: Activity, section: 'Navigation' },
 { id: 'dataset_studio', label: 'Open Dataset Studio', icon: Database, section: 'Navigation' },
 { id: 'anomaly_detection', label: 'View anomalies', icon: AlertTriangle, section: 'Navigation' },
 { id: 'moderation', label: 'Open moderation', icon: ShieldAlert, section: 'Navigation' },
 { id: 'batch_intelligence', label: 'Start batch analysis', icon: Network, section: 'Actions' },
 { id: 'mlops_center', label: 'Open MLOps', icon: Activity, section: 'Navigation' },
 ];

 const filteredCommands = commands.filter(c => c.label.toLowerCase().includes(search.toLowerCase()));

 return (
 <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-[15vh] p-4">
 <div 
 className="w-full max-w-2xl bg-[#0d0d12] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
 onClick={(e) => e.stopPropagation()}
 >
 <div className="flex items-center px-4 py-3 border-b border-white/10">
 <Search className="w-5 h-5 text-slate-400 mr-3" />
 <input 
 autoFocus
 type="text" 
 placeholder="Search MediaFlow..." 
 className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-slate-500 text-lg"
 value={search}
 onChange={(e) => setSearch(e.target.value)}
 />
 <div className="text-xs text-slate-500 bg-white/5 px-2 py-1 rounded">ESC</div>
 </div>
 
 <div className="max-h-[60vh] overflow-y-auto p-2">
 {filteredCommands.length === 0 ? (
 <div className="py-8 text-center text-slate-500">No commands found</div>
 ) : (
 <div className="space-y-1">
 {filteredCommands.map((cmd) => (
 <button
 key={cmd.id}
 onClick={() => {
 if (cmd.id === 'upload_media') {
 // Trigger upload (custom handling needed, we can just navigate or emit event)
 // For now, let's navigate to library, we will pass upload modal logic later
 onNavigate('library');
 } else {
 onNavigate(cmd.id as ViewType);
 }
 onClose();
 }}
 className="w-full flex items-center px-4 py-3 text-left hover:bg-white/5 rounded-xl transition-colors group"
 >
 <cmd.icon className="w-5 h-5 text-slate-400 group-hover:text-white mr-4 transition-colors" />
 <div className="flex-1">
 <span className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors">{cmd.label}</span>
 </div>
 <span className="text-[10px] text-slate-500 uppercase tracking-wider">{cmd.section}</span>
 </button>
 ))}
 </div>
 )}
 </div>
 </div>
 </div>
 );
}
