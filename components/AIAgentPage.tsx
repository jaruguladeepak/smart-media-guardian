import { useState, useRef, useEffect } from 'react';
import { Bot, User, Send, Sparkles, CheckCircle2, AlertTriangle, Layers, Zap, Loader2, ArrowRight, X, Edit3 } from 'lucide-react';
import { MediaData } from '@/lib/types';

interface AIAgentPageProps {
 mediaList: MediaData[];
}

type Message = {
 id: string;
 role: 'user' | 'assistant';
 content: string;
 plan?: ExecutionPlan | null;
 report?: any | null;
};

type ExecutionPlan = {
 completedSteps: string[];
 pendingSteps: string[];
 estimatedOperations: number;
 risk: 'Low' | 'Medium' | 'High';
 status: 'pending' | 'executing' | 'completed' | 'cancelled';
};

export default function AIAgentPage({ mediaList }: AIAgentPageProps) {
 const [messages, setMessages] = useState<Message[]>([
 {
 id: '1',
 role: 'assistant',
 content: 'I am the MediaFlow AI Agent. I can autonomously orchestrate the entire intelligence pipeline. What would you like me to do with your media library?'
 }
 ]);
 const [input, setInput] = useState('');
 const [isProcessing, setIsProcessing] = useState(false);
 const messagesEndRef = useRef<HTMLDivElement>(null);

 const scrollToBottom = () => {
 messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
 };

 useEffect(() => {
 scrollToBottom();
 }, [messages]);

 const handleSend = () => {
 if (!input.trim()) return;

 const userMessage: Message = { id: Date.now().toString(), role: 'user', content: input };
 setMessages(prev => [...prev, userMessage]);
 setInput('');
 setIsProcessing(true);

 // Simulate Agent Reasoning based on MediaFlow AI 4.0 requirements
 setTimeout(() => {
 const generatedPlan: ExecutionPlan = {
 completedSteps: [
 `Scan ${mediaList.length > 0 ? mediaList.length : '1,284'} assets`,
 'Identify quality < 50',
 'Detect duplicate groups',
 'Preserve original assets'
 ],
 pendingSteps: [
 'Optimize 87 images',
 'Create 16:9 variants',
 'Create Instagram variants',
 'Move 14 duplicate candidates to Review'
 ],
 estimatedOperations: 188,
 risk: 'Low',
 status: 'pending'
 };

 setMessages(prev => [...prev, {
 id: (Date.now() + 1).toString(),
 role: 'assistant',
 content: "I've analyzed your request and prepared the following action plan.",
 plan: generatedPlan
 }]);
 setIsProcessing(false);
 }, 1500);
 };

 const executePlan = (msgId: string) => {
 setMessages(prev => prev.map(m => {
 if (m.id === msgId && m.plan) {
 return { ...m, plan: { ...m.plan, status: 'executing' } };
 }
 return m;
 }));

 // Simulate execution time
 setTimeout(() => {
 setMessages(prev => prev.map(m => {
 if (m.id === msgId && m.plan) {
 return { ...m, plan: { ...m.plan, status: 'completed' } };
 }
 return m;
 }));
 
 // Add completion report
 setMessages(prev => [...prev, {
 id: (Date.now() + 2).toString(),
 role: 'assistant',
 content: "Execution completed successfully. I have processed 188 operations.",
 report: {
 assets_processed: 188,
 storage_saved: "1.2 GB",
 failed_operations: 0,
 moved_to_review: 14
 }
 }]);
 }, 3000);
 };

 const cancelPlan = (msgId: string) => {
 setMessages(prev => prev.map(m => {
 if (m.id === msgId && m.plan) {
 return { ...m, plan: { ...m.plan, status: 'cancelled' } };
 }
 return m;
 }));
 };

 return (
 <div className="flex h-[calc(100vh-120px)] bg-[#050505] rounded-3xl overflow-hidden border border-slate-200 shadow-2xl animate-in fade-in relative">
 
 {/* Background elements */}
 <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
 
 {/* Agent Header / Sidebar area for future */}
 <div className="hidden lg:flex w-72 bg-slate-50 border-r border-slate-200 flex-col p-6 z-10">
 <div className="flex items-center gap-4 mb-8">
 <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.2)]">
 <Bot className="w-5 h-5 text-indigo-400" />
 </div>
 <div>
 <h2 className="font-bold text-slate-900 tracking-widest uppercase text-sm">AI Copilot</h2>
 <p className="text-[10px] text-indigo-400/80 font-mono tracking-wider mt-1">Autonomous Ops</p>
 </div>
 </div>
 
 <div className="space-y-4">
 <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200 pb-2">Suggested Prompts</h3>
 {[
 "Find poor-quality images, remove duplicates, optimize them and create Instagram versions.",
 "Show me all poor quality images containing people uploaded this month.",
 "Organize my latest uploads by semantic category and auto-tag them.",
 "Analyze my library and identify potential anomalies or unsafe content."
 ].map((cmd, i) => (
 <button 
 key={i}
 onClick={() => setInput(cmd)}
 className="text-left p-3 w-full rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-200 text-xs font-medium text-slate-500 hover:text-slate-700 transition-colors shadow-sm"
 >
 "{cmd}"
 </button>
 ))}
 </div>
 </div>

 {/* Main Chat Area */}
 <div className="flex-1 flex flex-col relative z-10">
 <div className="flex-1 p-6 overflow-y-auto space-y-6 custom-scrollbar bg-transparent">
 {messages.map((msg) => (
 <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
 <div className={`flex max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
 
 <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-sm border
 ${msg.role === 'user' ? 'ml-3 bg-slate-200 border-slate-300 text-slate-900' : 'mr-3 bg-indigo-500/20 border-indigo-500/30 text-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.2)]'}
 `}>
 {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
 </div>
 
 <div className="flex flex-col">
 <div className={`p-4 shadow-sm text-sm border
 ${msg.role === 'user' 
 ? 'bg-slate-200 border-slate-200 text-slate-900 rounded-2xl rounded-tr-sm' 
 : 'bg-slate-50 border-slate-200 text-slate-600 rounded-2xl rounded-tl-sm'}
 `}>
 {msg.content}
 </div>

 {msg.plan && (
 <div className="mt-4 bg-slate-50 border border-indigo-500/30 rounded-2xl overflow-hidden shadow-2xl w-[500px] max-w-full relative">
 <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
 <div className="bg-slate-50/80 text-slate-900 px-5 py-4 border-b border-indigo-500/20 flex justify-between items-center backdrop-blur-sm relative z-10">
 <div className="flex items-center text-sm font-bold tracking-widest uppercase">
 <Layers className="w-4 h-4 mr-2 text-indigo-400" />
 Execution Plan
 </div>
 {msg.plan.status === 'executing' && (
 <div className="text-xs font-bold text-indigo-300 flex items-center bg-indigo-500/20 px-2 py-1 rounded border border-indigo-500/30 uppercase tracking-widest">
 <Loader2 className="w-3 h-3 mr-1.5 animate-spin" /> Executing
 </div>
 )}
 {msg.plan.status === 'completed' && (
 <div className="text-xs font-bold text-emerald-400 flex items-center bg-emerald-500/20 px-2 py-1 rounded border border-emerald-500/30 uppercase tracking-widest">
 <CheckCircle2 className="w-3 h-3 mr-1.5" /> Executed
 </div>
 )}
 {msg.plan.status === 'cancelled' && (
 <div className="text-xs font-bold text-rose-400 flex items-center bg-rose-500/20 px-2 py-1 rounded border border-rose-500/30 uppercase tracking-widest">
 <AlertTriangle className="w-3 h-3 mr-1.5" /> Cancelled
 </div>
 )}
 </div>
 
 <div className="p-6 space-y-5 font-mono text-sm text-slate-600 relative z-10">
 {/* Completed Checks */}
 <div className="space-y-2">
 {msg.plan.completedSteps.map((step, i) => (
 <div key={i} className="flex items-start">
 <span className="text-emerald-500 mr-3 mt-0.5"><CheckCircle2 className="w-4 h-4" /></span>
 <span>{step}</span>
 </div>
 ))}
 </div>
 
 {/* Pending Actions */}
 <div className="space-y-2">
 {msg.plan.pendingSteps.map((step, i) => (
 <div key={i} className="flex items-start">
 <span className="text-indigo-400 font-bold mr-3 mt-0.5"><ArrowRight className="w-4 h-4" /></span>
 <span className={msg.plan!.status === 'completed' ? 'line-through opacity-50' : ''}>{step}</span>
 </div>
 ))}
 </div>

 <div className="pt-5 border-t border-slate-200 flex justify-between text-xs uppercase tracking-widest text-slate-500">
 <div>Est. Ops: <span className="text-slate-900 font-bold">{msg.plan.estimatedOperations}</span></div>
 <div>Risk: <span className="text-emerald-400 font-bold">{msg.plan.risk}</span></div>
 </div>
 </div>

 {msg.plan.status === 'pending' && (
 <div className="bg-slate-50/80 p-5 flex gap-3 border-t border-indigo-500/20 backdrop-blur-sm relative z-10">
 <button 
 onClick={() => executePlan(msg.id)}
 className="flex-1 bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/40 text-indigo-300 font-bold py-2.5 px-4 rounded-xl text-xs uppercase tracking-widest transition-colors flex justify-center items-center shadow-[0_0_15px_rgba(99,102,241,0.1)]"
 >
 Approve & Execute
 </button>
 <button className="bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 font-bold py-2.5 px-4 rounded-xl text-xs uppercase tracking-widest transition-colors flex justify-center items-center">
 <Edit3 className="w-4 h-4 mr-1.5" /> Modify
 </button>
 <button 
 onClick={() => cancelPlan(msg.id)}
 className="bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 font-bold py-2.5 px-4 rounded-xl text-xs uppercase tracking-widest transition-colors flex justify-center items-center"
 >
 <X className="w-4 h-4" />
 </button>
 </div>
 )}
 </div>
 )}

 {msg.report && (
 <div className="mt-4 bg-slate-50 border border-emerald-500/30 rounded-2xl overflow-hidden shadow-2xl w-[400px] max-w-full relative">
 <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
 <div className="bg-slate-50/80 px-5 py-4 border-b border-emerald-500/20 flex justify-between items-center backdrop-blur-sm relative z-10">
 <div className="flex items-center text-sm font-bold text-emerald-400 uppercase tracking-widest">
 <Zap className="w-4 h-4 mr-2" />
 EXECUTION REPORT
 </div>
 </div>
 <div className="p-6 font-mono text-sm space-y-3 text-slate-600 relative z-10">
 <div className="flex justify-between items-center"><span>Assets Processed</span> <span className="font-bold">{msg.report.assets_processed}</span></div>
 <div className="flex justify-between items-center"><span>Storage Saved</span> <span className="font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">{msg.report.storage_saved}</span></div>
 <div className="flex justify-between items-center"><span>Moved to Review</span> <span className="font-bold text-amber-400">{msg.report.moved_to_review}</span></div>
 <div className="flex justify-between items-center pt-3 mt-1 border-t border-slate-200 text-xs text-slate-500 uppercase tracking-widest">
 <span>Errors</span> <span className="font-bold">{msg.report.failed_operations}</span>
 </div>
 </div>
 </div>
 )}
 </div>
 </div>
 </div>
 ))}
 {isProcessing && (
 <div className="flex justify-start animate-in fade-in">
 <div className="flex max-w-[85%] flex-row">
 <div className="w-8 h-8 ml-0 mr-3 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-sm bg-indigo-500/20 border border-indigo-500/30 text-indigo-400">
 <Bot className="w-4 h-4" />
 </div>
 <div className="p-4 rounded-2xl shadow-sm bg-slate-50 border border-slate-200 rounded-tl-sm flex items-center">
 <div className="flex gap-1.5">
 <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
 <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
 <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
 </div>
 </div>
 </div>
 </div>
 )}
 <div ref={messagesEndRef} />
 </div>

 {/* Input Area */}
 <div className="p-6 bg-[#050505]/80 backdrop-blur-md border-t border-slate-200 z-10 relative">
 <div className="max-w-4xl mx-auto relative flex items-center">
 <input 
 type="text"
 value={input}
 onChange={(e) => setInput(e.target.value)}
 onKeyDown={(e) => e.key === 'Enter' && handleSend()}
 placeholder="Command the AI Agent (e.g. 'Optimize all low-quality images...')"
 className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-2xl px-5 py-4 pr-16 text-sm font-medium focus:outline-none focus:border-indigo-500/50 transition-all text-slate-900 placeholder-slate-500 shadow-inner"
 />
 <button 
 onClick={handleSend}
 disabled={!input.trim() || isProcessing}
 className="absolute right-2 p-2.5 bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/30 disabled:opacity-50 text-indigo-400 rounded-xl transition-colors"
 >
 <Send className="w-5 h-5" />
 </button>
 </div>
 <div className="text-center mt-4 text-[10px] text-slate-500 uppercase tracking-widest font-bold flex justify-center items-center">
 <Sparkles className="w-3 h-3 mr-2 text-indigo-400" />
 Connected to /api/ml/analyze via MediaFlow AI Intelligence Layer
 </div>
 </div>
 </div>
 </div>
 );
}
