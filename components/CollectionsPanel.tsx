import { useAppStore } from '@/lib/store';
import { MediaData } from '@/lib/types';
import { generateSmartCollections } from '@/lib/collections';
import { Layers, Folder, Plus } from 'lucide-react';
import { useState } from 'react';
import CollectionDialog from './CollectionDialog';

interface CollectionsPanelProps {
 mediaList: MediaData[];
 onSelectCollection: (mediaIds: string[] | null, collectionId?: string | null) => void;
 activeCollectionId: string | null;
}

export default function CollectionsPanel({ mediaList, onSelectCollection, activeCollectionId }: CollectionsPanelProps) {
 const { collections: userCollections, mediaMetadata } = useAppStore();
 const [showCreateDialog, setShowCreateDialog] = useState(false);

 const smartCollections = generateSmartCollections(mediaList, mediaMetadata);
 
 return (
 <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm h-full flex flex-col">
 <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50 ">
 <h3 className="font-semibold flex items-center text-slate-900 ">
 <Layers className="w-5 h-5 mr-2 text-indigo-500" />
 Collections
 </h3>
 <button 
 onClick={() => setShowCreateDialog(true)}
 className="p-1.5 text-slate-500 hover:text-indigo-600 :text-indigo-400 hover:bg-indigo-50 :bg-indigo-900/30 rounded-lg transition-colors"
 title="Create Collection"
 >
 <Plus className="w-5 h-5" />
 </button>
 </div>

 <div className="p-3 overflow-y-auto flex-1 space-y-6">
 <div>
 <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-2">Smart Collections</h4>
 <div className="space-y-0.5">
 {smartCollections.map(c => (
 <button
 key={c.id}
 onClick={() => onSelectCollection(c.id === 'smart-all' ? null : c.mediaIds, c.id)}
 className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${activeCollectionId === c.id || (c.id === 'smart-all' && !activeCollectionId) ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-slate-700 hover:bg-slate-50 :bg-slate-100'}`}
 >
 <span className="flex items-center">
 <span className="w-5 mr-2 text-center">{c.icon}</span> {c.name}
 </span>
 <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${activeCollectionId === c.id || (c.id === 'smart-all' && !activeCollectionId) ? 'bg-indigo-100 text-indigo-700 ' : 'bg-slate-100 text-slate-500'}`}>
 {c.mediaIds.length}
 </span>
 </button>
 ))}
 </div>
 </div>

 <div>
 <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-2">My Collections</h4>
 {userCollections.length > 0 ? (
 <div className="space-y-0.5">
 {userCollections.map(c => (
 <button
 key={c.id}
 onClick={() => onSelectCollection(c.mediaIds, c.id)}
 className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${activeCollectionId === c.id ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-slate-700 hover:bg-slate-50 :bg-slate-100'}`}
 >
 <span className="flex items-center truncate">
 <Folder className={`w-4 h-4 mr-3 flex-shrink-0 ${activeCollectionId === c.id ? 'text-indigo-500' : 'text-slate-500'}`} />
 <span className="truncate">{c.name}</span>
 </span>
 <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ml-2 ${activeCollectionId === c.id ? 'bg-indigo-100 text-indigo-700 ' : 'bg-slate-100 text-slate-500'}`}>
 {c.mediaIds.length}
 </span>
 </button>
 ))}
 </div>
 ) : (
 <div className="px-3 py-4 text-center">
 <p className="text-xs text-slate-500 mb-2">Create custom collections to organize your media.</p>
 <button 
 onClick={() => setShowCreateDialog(true)}
 className="text-xs font-medium text-indigo-600 hover:text-indigo-700 :text-indigo-300"
 >
 + Create Collection
 </button>
 </div>
 )}
 </div>
 </div>

 {showCreateDialog && (
 <CollectionDialog onClose={() => setShowCreateDialog(false)} publicIds={[]} />
 )}
 </div>
 );
}
