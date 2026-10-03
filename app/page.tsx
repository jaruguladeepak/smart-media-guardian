'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle2, Circle, CircleDot, Globe, Share2, Copy } from 'lucide-react';
import { toast } from 'sonner';
import UploadBox from '@/components/UploadBox';
import MediaLibrary from '@/components/MediaLibrary';
import MediaAnalysis from '@/components/MediaAnalysis';
import TransformStudio from '@/components/TransformStudio';
import ExportCenter from '@/components/ExportCenter';
import CollectionsPanel from '@/components/CollectionsPanel';
import BulkActionBar from '@/components/BulkActionBar';
import BulkProcessor from '@/components/BulkProcessor';
import CollectionDialog from '@/components/CollectionDialog';
import Sidebar, { ViewType } from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import MediaDetail from '@/components/MediaDetail';
import ModerationCenter from '@/components/ModerationCenter';
import CleanupCenter from '@/components/CleanupCenter';
import AnalyticsDashboard from '@/components/AnalyticsDashboard';
import DemoCommandCenter from '@/components/DemoCommandCenter';
import ProcessingQueue from '@/components/ProcessingQueue';
import MlDashboard from '@/components/MlDashboard';
import SimilarityPage from '@/components/SimilarityPage';
import ClusteringPage from '@/components/ClusteringPage';
import AnomalyPage from '@/components/AnomalyPage';
import VisionLabPage from '@/components/VisionLabPage';
import DatasetExplorerPage from '@/components/DatasetExplorerPage';
import ModelLabPage from '@/components/ModelLabPage';
import DecisionEnginePage from '@/components/DecisionEnginePage';
import VisualSearchPage from '@/components/VisualSearchPage';
import EmbeddingExplorerPage from '@/components/EmbeddingExplorerPage';
import KnowledgeGraphPage from '@/components/KnowledgeGraphPage';
import DatasetStudioPage from '@/components/DatasetStudioPage';
import BatchIntelligencePage from '@/components/BatchIntelligencePage';
import PipelineMonitorPage from '@/components/PipelineMonitorPage';
import AIAgentPage from '@/components/AIAgentPage';
import ExplainableAIPage from '@/components/ExplainableAIPage';
import ExecutiveDashboardPage from '@/components/ExecutiveDashboardPage';
import MlOpsCenterPage from '@/components/MlOpsCenterPage';
import AutonomousWorkflowsPage from '@/components/AutonomousWorkflowsPage';
import AnalyzeAssetPage from '@/components/AnalyzeAssetPage';

import GlobalStatusBar from '@/components/GlobalStatusBar';
import CommandPalette from '@/components/CommandPalette';
import CommandCenter from '@/components/CommandCenter';

import { MediaData } from '@/lib/types';
import { useAppStore } from '@/lib/store';

export default function Home() {
 const [activeView, setActiveView] = useState<ViewType>('dashboard');
 const [uploadedMedia, setUploadedMedia] = useState<MediaData[]>([]);
 const [selectedMedia, setSelectedMedia] = useState<MediaData | null>(null);
 
 // Collections & Bulk Processing
 const [activeCollectionId, setActiveCollectionId] = useState<string | null>(null);
 const [activeCollectionMediaIds, setActiveCollectionMediaIds] = useState<string[] | null>(null);
 const [bulkAction, setBulkAction] = useState<string | null>(null);
 const [showAddToCollection, setShowAddToCollection] = useState(false);
 const [showUploadModal, setShowUploadModal] = useState(false);
 
 // Command Palette
 const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

 const { addActivity, selectedItems, collections, toggleCollectionPublic, createShareLink } = useAppStore();

 useEffect(() => {
 const handleKeyDown = (e: KeyboardEvent) => {
 if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
 e.preventDefault();
 setIsCommandPaletteOpen(true);
 }
 };
 window.addEventListener('keydown', handleKeyDown);
 return () => window.removeEventListener('keydown', handleKeyDown);
 }, []);

 const handleUploadSuccess = (data: any) => {
 const newMedia: MediaData = {
 publicId: data.public_id,
 secureUrl: data.secure_url,
 resourceType: data.resource_type,
 format: data.format,
 width: data.width,
 height: data.height,
 bytes: data.bytes,
 };
 
 setUploadedMedia((prev) => [newMedia, ...prev]);
 addActivity({
 publicId: data.public_id,
 type: 'UPLOAD',
 description: `Uploaded "${data.public_id.split('/').pop()}"`,
 });
 
 setShowUploadModal(false);
 setSelectedMedia(null);
 setActiveView('dashboard');
 };

 const handleMediaUpdate = (updatedMedia: MediaData) => {
 setUploadedMedia((prev) => 
 prev.map(m => m.publicId === updatedMedia.publicId ? updatedMedia : m)
 );
 if (selectedMedia?.publicId === updatedMedia.publicId) {
 setSelectedMedia(updatedMedia);
 }
 };

 const handleSelectMedia = (media: MediaData | null) => {
 setSelectedMedia(media);
 if (media) {
 window.history.pushState(null, '', `/media/${encodeURIComponent(media.publicId)}`);
 } else {
 window.history.pushState(null, '', '/');
 }
 };

 const renderMainContent = () => {
 if (selectedMedia) {
 return (
 <MediaDetail 
 media={selectedMedia} 
 onBack={() => handleSelectMedia(null)} 
 onUpdate={handleMediaUpdate} 
 />
 );
 }

 switch (activeView) {
 case 'dashboard':
 return (
 <CommandCenter mediaList={uploadedMedia} onUploadClick={() => setShowUploadModal(true)} onNavigate={setActiveView} />
 );
 case 'library':
 return (
 <div className="animate-in fade-in duration-300">
 <div className="flex items-center justify-between mb-6">
 <div>
 <h1 className="text-2xl font-bold tracking-tight text-slate-900 ">Media Library</h1>
 <p className="text-sm text-slate-500">Browse and manage all uploaded assets.</p>
 </div>
 <button 
 onClick={() => setShowUploadModal(true)}
 className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-slate-900 font-medium rounded-lg text-sm transition-colors"
 >
 + Upload Media
 </button>
 </div>
 <MediaLibrary 
 localMedia={uploadedMedia} 
 selectedMedia={selectedMedia} 
 onSelectMedia={handleSelectMedia} 
 />
 </div>
 );
 case 'collections':
 return (
 <div className="animate-in fade-in duration-300 h-full flex flex-col">
 <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-6">Collections</h1>
 <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1">
 <div className="lg:col-span-1">
 <CollectionsPanel 
 mediaList={uploadedMedia} 
 activeCollectionId={activeCollectionId}
 onSelectCollection={(mediaIds, collectionId) => {
 if (!mediaIds) {
 setActiveCollectionId(null);
 setActiveCollectionMediaIds(null);
 } else {
 setActiveCollectionId(collectionId || Math.random().toString());
 setActiveCollectionMediaIds(mediaIds);
 }
 }} 
 />
 </div>
 <div className="lg:col-span-3 flex flex-col h-full">
 {activeCollectionId && !activeCollectionId.startsWith('smart-') && (() => {
 const activeCol = collections.find(c => c.id === activeCollectionId);
 if (!activeCol) return null;
 
 return (
 <div className="bg-white border border-slate-200 rounded-xl p-4 mb-4 shadow-sm flex items-center justify-between">
 <div>
 <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
 {activeCol.name}
 {activeCol.isPublic && (
 <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700 uppercase">Public Gallery</span>
 )}
 </h2>
 <p className="text-sm text-slate-500">{activeCol.description || 'No description'}</p>
 </div>
 <div className="flex items-center gap-3">
 <button
 onClick={() => toggleCollectionPublic(activeCol.id, !activeCol.isPublic)}
 className={`flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border ${activeCol.isPublic ? 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200 ' : 'bg-indigo-50 border-indigo-100 text-indigo-700 hover:bg-indigo-100 '}`}
 >
 <Globe className="w-4 h-4 mr-2" />
 {activeCol.isPublic ? 'Make Private' : 'Publish Gallery'}
 </button>
 
 {activeCol.isPublic && (
 <button
 onClick={() => {
 const url = createShareLink(activeCol.id, 'collection', 'view', null);
 navigator.clipboard.writeText(url);
 toast.success('Gallery link copied to clipboard!');
 }}
 className="flex items-center px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-slate-900 rounded-lg text-sm font-medium transition-colors shadow-sm"
 >
 <Share2 className="w-4 h-4 mr-2" />
 Share
 </button>
 )}
 </div>
 </div>
 );
 })()}
 
 <div className="flex-1 overflow-hidden min-h-[500px]">
 <MediaLibrary 
 localMedia={uploadedMedia} 
 selectedMedia={selectedMedia} 
 onSelectMedia={handleSelectMedia} 
 filterMediaIds={activeCollectionMediaIds}
 />
 </div>
 </div>
 </div>
 </div>
 );
 case 'favorites':
 // Reuse library but we will trigger the favorite filter programmatically, 
 // or actually MediaLibrary component has its own internal state. We can pass a prop, but for MVP:
 return (
 <div className="animate-in fade-in duration-300">
 <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-6">Favorites</h1>
 <p className="text-slate-500 mb-6">Toggle the Favorites filter in the search bar below.</p>
 <MediaLibrary 
 localMedia={uploadedMedia} 
 selectedMedia={selectedMedia} 
 onSelectMedia={handleSelectMedia} 
 />
 </div>
 );
 case 'moderation':
 return (
 <ModerationCenter
 mediaList={uploadedMedia}
 onSelectMedia={handleSelectMedia}
 onUpdateMedia={handleMediaUpdate}
 />
 );
 case 'cleanup':
 return <CleanupCenter />;
 case 'transform':
 return selectedMedia ? (
 <div className="animate-in fade-in duration-300">
 <button onClick={() => setActiveView('library')} className="mb-4 text-sm text-indigo-500 hover:text-indigo-600 font-medium">← Back to Library</button>
 <TransformStudio media={selectedMedia} />
 </div>
 ) : (
 <div className="py-20 text-center animate-in fade-in">
 <h2 className="text-xl font-semibold text-slate-900 mb-2">No Media Selected</h2>
 <p className="text-slate-500">Please select an asset from the Media Library first to use the Transform Studio.</p>
 <button onClick={() => setActiveView('library')} className="mt-6 px-4 py-2 bg-indigo-50 text-indigo-600 font-medium rounded-lg hover:bg-indigo-100 transition-colors">Go to Library</button>
 </div>
 );
 case 'export_center':
 return selectedMedia ? (
 <div className="animate-in fade-in duration-300">
 <button onClick={() => setActiveView('library')} className="mb-4 text-sm text-indigo-500 hover:text-indigo-600 font-medium">← Back to Library</button>
 <ExportCenter media={selectedMedia} />
 </div>
 ) : (
 <div className="py-20 text-center animate-in fade-in">
 <h2 className="text-xl font-semibold text-slate-900 mb-2">No Media Selected</h2>
 <p className="text-slate-500">Please select an asset from the Media Library first to use the Export Center.</p>
 <button onClick={() => setActiveView('library')} className="mt-6 px-4 py-2 bg-indigo-50 text-indigo-600 font-medium rounded-lg hover:bg-indigo-100 transition-colors">Go to Library</button>
 </div>
 );
 case 'workflows':
 return <AutonomousWorkflowsPage />;
 case 'queue':
 return <ProcessingQueue />;
 case 'decision_engine':
 return <DecisionEnginePage mediaList={uploadedMedia} />;
 case 'batch_intelligence':
 return <BatchIntelligencePage />;
 case 'ai_agent':
 return <AIAgentPage mediaList={uploadedMedia} />;
 case 'ml_dashboard':
 return (
 <MlDashboard 
 mediaList={uploadedMedia}
 selectedMedia={selectedMedia}
 onSelectMedia={setSelectedMedia}
 />
 );
 case 'pipeline_monitor':
 return <PipelineMonitorPage />;
 case 'mlops_center':
 return <MlOpsCenterPage />;
 case 'explainable_ai':
 return <ExplainableAIPage mediaList={uploadedMedia} onUploadClick={() => setShowUploadModal(true)} />;
 case 'similarity':
 return <SimilarityPage mediaList={uploadedMedia} onUploadClick={() => setShowUploadModal(true)} />;
 case 'clustering':
 return <ClusteringPage mediaList={uploadedMedia} />;
 case 'anomaly_detection':
 return <AnomalyPage mediaList={uploadedMedia} onUploadClick={() => setShowUploadModal(true)} />;
 case 'knowledge_graph':
 return <KnowledgeGraphPage mediaList={uploadedMedia} />;
 case 'vision_lab':
 return <VisionLabPage mediaList={uploadedMedia} onUploadClick={() => setShowUploadModal(true)} />;
 case 'visual_search':
 return <VisualSearchPage mediaList={uploadedMedia} />;
 case 'embedding_explorer':
 return <EmbeddingExplorerPage mediaList={uploadedMedia} />;
 case 'dataset_explorer':
 return <DatasetExplorerPage />;
 case 'dataset_studio':
 return <DatasetStudioPage />;
 case 'model_lab':
 return <ModelLabPage />;
 case 'analytics':
 return <AnalyticsDashboard />;
 case 'analyze_asset':
 return <AnalyzeAssetPage mediaList={uploadedMedia} onUploadClick={() => setShowUploadModal(true)} />;
 default:
 return (
 <div className="py-20 text-center animate-in fade-in">
 <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
 <span className="text-2xl">🚧</span>
 </div>
 <h2 className="text-xl font-semibold text-slate-900 mb-2">Coming Soon</h2>
 <p className="text-slate-500">The {activeView} view is under construction.</p>
 <button 
 onClick={() => setActiveView('dashboard')}
 className="mt-6 px-4 py-2 bg-emerald-50 text-emerald-600 font-medium rounded-lg hover:bg-emerald-100 transition-colors"
 >
 Return to Dashboard
 </button>
 </div>
 );
 }
 };

 return (
 <div className="min-h-screen bg-[#000000] font-[family-name:var(--font-geist-sans)] flex flex-col items-center justify-center p-0 sm:p-4">
 <div className="w-full max-w-[1800px] h-full sm:h-[96vh] bg-[#0a0a0f] rounded-none sm:rounded-2xl overflow-hidden shadow-2xl flex flex-col relative border-0 sm:border border-slate-200">
 
 <div className="flex-1 flex overflow-hidden relative">
 {/* Sidebar */}
 <Sidebar activeView={activeView} setActiveView={(v) => {
 setSelectedMedia(null);
 setActiveView(v);
 }} />

 {/* Main Content Area */}
 <div className="flex-1 flex flex-col h-full overflow-hidden w-full ml-0 sm:ml-64 bg-[#0a0a0f]">
 <Topbar onUploadClick={() => setShowUploadModal(true)} />
 
 <main className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar">
 <div className="max-w-7xl mx-auto h-full">
 {renderMainContent()}
 </div>
 </main>
 </div>
 </div>

 {/* Global Status Bar */}
 <GlobalStatusBar 
 isProcessing={activeView === 'dashboard' && uploadedMedia.length > 0} 
 />

 {/* Modals & Overlays */}
 {showUploadModal && (
 <div className="fixed inset-0 z-50 bg-slate-50/50 backdrop-blur-sm flex items-center justify-center p-4">
 <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl overflow-hidden animate-in zoom-in-95">
 <div className="flex justify-between items-center p-4 border-b border-slate-100 ">
 <h3 className="font-semibold text-slate-900 ">Upload Media</h3>
 <button onClick={() => setShowUploadModal(false)} className="text-slate-600 hover:text-slate-600">✕</button>
 </div>
 <div className="p-6">
 <UploadBox onUploadSuccess={handleUploadSuccess} />
 </div>
 </div>
 </div>
 )}

 {/* Bulk Action Bar */}
 {!selectedMedia && selectedItems.length > 0 && (
 <BulkActionBar 
 onProcess={(action) => setBulkAction(action)} 
 onAddToCollection={() => setShowAddToCollection(true)} 
 />
 )}

 {bulkAction && (
 <BulkProcessor 
 action={bulkAction} 
 onClose={() => setBulkAction(null)} 
 mediaList={uploadedMedia} 
 />
 )}

 {showAddToCollection && (
 <CollectionDialog 
 onClose={() => setShowAddToCollection(false)} 
 publicIds={selectedItems} 
 />
 )}

 {/* Command Palette */}
 <CommandPalette 
 isOpen={isCommandPaletteOpen} 
 onClose={() => setIsCommandPaletteOpen(false)} 
 onNavigate={(v) => {
 setSelectedMedia(null);
 setActiveView(v);
 }}
 />
 </div>
 </div>
 );
}
