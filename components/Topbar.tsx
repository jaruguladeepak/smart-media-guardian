import { useState, useRef, useEffect } from 'react';
import { Search, Bell, User, Check, Trash2, CheckCircle2, CloudLightning, Activity, AlertTriangle, FlaskConical } from 'lucide-react';
import { useAppStore } from '@/lib/store';

interface TopbarProps {
 onUploadClick: () => void;
}

export default function Topbar({ onUploadClick }: TopbarProps) {
 const [showNotifications, setShowNotifications] = useState(false);
 const [healthStatus, setHealthStatus] = useState<'checking' | 'live' | 'error' | 'not-configured'>('checking');
 const { activities, markActivityRead, markAllActivitiesRead, demoMode, setDemoMode } = useAppStore();
 const dropdownRef = useRef<HTMLDivElement>(null);

 const unreadCount = activities.filter(a => !a.isRead).length;

 useEffect(() => {
 function handleClickOutside(event: MouseEvent) {
 if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
 setShowNotifications(false);
 }
 }
 document.addEventListener('mousedown', handleClickOutside);
 return () => document.removeEventListener('mousedown', handleClickOutside);
 }, []);

 useEffect(() => {
 async function checkHealth() {
 try {
 const res = await fetch('/api/health');
 if (res.ok) {
 const data = await res.json();
 setHealthStatus(data.status === 'live' ? 'live' : 'error');
 } else {
 setHealthStatus('error');
 }
 } catch (err) {
 setHealthStatus('error');
 }
 }
 checkHealth();
 }, []);

 return (
 <header className="h-20 flex items-center justify-between px-4 sm:px-8 bg-[#0a0a0f]/80 backdrop-blur-md sticky top-0 z-30 border-b border-white/5">
 <div className="flex-1 flex items-center">
 <button 
 onClick={() => {
 const event = new KeyboardEvent('keydown', { key: 'k', ctrlKey: true });
 window.dispatchEvent(event);
 }}
 className="hidden md:flex items-center gap-3 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-slate-400 text-sm transition-colors w-64"
 >
 <Search className="w-4 h-4" />
 <span>Search MediaFlow...</span>
 <div className="ml-auto flex gap-1">
 <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] font-mono">Ctrl</kbd>
 <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] font-mono">K</kbd>
 </div>
 </button>
 </div>

 <div className="flex items-center space-x-4 sm:space-x-6">
 
 {/* Demo Mode Switch */}
 <div className="hidden md:flex items-center gap-2 bg-slate-100 p-1 rounded-full border border-slate-200 ">
 <button 
 onClick={() => setDemoMode(false)}
 className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${!demoMode ? 'bg-white shadow-sm text-slate-800 ' : 'text-slate-400 hover:text-slate-600 :text-slate-300'}`}
 >
 LIVE
 </button>
 <button 
 onClick={() => setDemoMode(true)}
 className={`px-3 py-1 flex items-center gap-1 rounded-full text-xs font-bold transition-all ${demoMode ? 'bg-amber-100 shadow-sm text-amber-700 ' : 'text-slate-400 hover:text-slate-600 :text-slate-300'}`}
 >
 <FlaskConical className="w-3 h-3" />
 DEMO
 </button>
 </div>

 {/* Real Cloudinary Status Indicator */}
 <div className={`hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${healthStatus === 'live' ? 'bg-emerald-50 text-emerald-600 border-emerald-100 ' : healthStatus === 'checking' ? 'bg-slate-50 text-slate-500 border-slate-200 ' : 'bg-red-50 text-red-600 border-red-100 '}`}>
 {healthStatus === 'live' ? (
 <>
 <span className="relative flex h-2 w-2">
 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
 <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
 </span>
 Cloudinary LIVE
 </>
 ) : healthStatus === 'checking' ? (
 <>
 <Activity className="w-3 h-3 animate-pulse" />
 Checking Connection...
 </>
 ) : (
 <>
 <AlertTriangle className="w-3 h-3" />
 Cloudinary ERROR
 </>
 )}
 </div>

 <div className="relative" ref={dropdownRef}>
 <button 
 onClick={() => setShowNotifications(!showNotifications)}
 className="relative p-2 text-slate-400 hover:text-white transition-colors bg-white/5 rounded-full shadow-sm border border-white/10"
 >
 <Bell className="w-5 h-5" />
 {unreadCount > 0 && (
 <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-500 rounded-full">
 {unreadCount > 9 ? '9+' : unreadCount}
 </span>
 )}
 </button>

 {/* Notifications Dropdown */}
 {showNotifications && (
 <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-top-2 z-50">
 <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 ">
 <h3 className="font-semibold text-slate-900 ">Notifications</h3>
 {unreadCount > 0 && (
 <button 
 onClick={markAllActivitiesRead}
 className="text-xs font-medium text-emerald-600 hover:text-emerald-700 "
 >
 Mark all read
 </button>
 )}
 </div>
 <div className="max-h-[400px] overflow-y-auto overscroll-contain">
 {activities.length > 0 ? (
 <div className="divide-y divide-slate-100 ">
 {activities.map((activity) => (
 <div 
 key={activity.id} 
 className={`p-4 transition-colors hover:bg-slate-50 :bg-slate-800/50 ${!activity.isRead ? 'bg-emerald-50/50 ' : ''}`}
 onClick={() => !activity.isRead && markActivityRead(activity.id)}
 >
 <div className="flex items-start gap-3">
 <div className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${!activity.isRead ? 'bg-emerald-500' : 'bg-transparent'}`} />
 <div className="flex-1 min-w-0">
 <p className={`text-sm ${!activity.isRead ? 'font-medium text-slate-900 ' : 'text-slate-600 '}`}>
 {activity.description}
 </p>
 <div className="flex items-center gap-2 mt-1">
 <span className="text-xs text-slate-400">
 {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
 </span>
 <span className="text-[10px] font-medium text-slate-400 uppercase">{activity.type}</span>
 </div>
 </div>
 </div>
 </div>
 ))}
 </div>
 ) : (
 <div className="py-8 text-center text-slate-500 text-sm">
 No new notifications
 </div>
 )}
 </div>
 </div>
 )}
 </div>
 
 <div className="flex items-center gap-3 pl-4 sm:pl-6 border-l border-white/10">
 <div className="text-right hidden sm:block">
 <p className="text-sm font-semibold text-white">Demo User</p>
 </div>
 <div className="w-10 h-10 rounded-full bg-indigo-500/20 overflow-hidden shadow-sm border border-indigo-500/30">
 <div className="w-full h-full flex items-center justify-center text-indigo-400">
 <User className="w-5 h-5" />
 </div>
 </div>
 </div>
 </div>
 </header>
 );
}
