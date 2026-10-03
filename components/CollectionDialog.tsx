import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { X, FolderPlus, Folder } from 'lucide-react';
import { toast } from 'sonner';

interface CollectionDialogProps {
  onClose: () => void;
  publicIds: string[]; // Items to add
}

export default function CollectionDialog({ onClose, publicIds }: CollectionDialogProps) {
  const { collections, createCollection, addToCollection, clearSelection } = useAppStore();
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    
    // Create collection
    createCollection(newTitle, newDesc);
    
    // Find the newly created collection (it will be the last one since we just appended it, or we could just trust the state update will happen, but we need its ID now)
    // Actually, createCollection doesn't return the ID. Let's modify our logic or just show success and close.
    // Since we can't easily grab the ID right after dispatching without returning it, let's just let the user create it, then select it.
    setIsCreating(false);
    setNewTitle('');
    setNewDesc('');
    toast.success('Collection created');
  };

  const handleAddToCollection = (collectionId: string, name: string) => {
    addToCollection(collectionId, publicIds);
    toast.success(`Added ${publicIds.length} items to ${name}`);
    clearSelection();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
          <h2 className="font-semibold text-lg text-slate-900 dark:text-white flex items-center">
            <FolderPlus className="w-5 h-5 mr-2 text-indigo-500" /> 
            Add to Collection
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4">
          {!isCreating ? (
            <div className="space-y-4">
              <button 
                onClick={() => setIsCreating(true)}
                className="w-full flex items-center justify-center p-3 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-400 hover:border-indigo-500 hover:text-indigo-600 dark:hover:border-indigo-400 dark:hover:text-indigo-300 transition-colors font-medium"
              >
                <FolderPlus className="w-4 h-4 mr-2" /> Create New Collection
              </button>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                {collections.filter(c => !c.isSmart).map(c => (
                  <button
                    key={c.id}
                    onClick={() => handleAddToCollection(c.id, c.name)}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700 text-left"
                  >
                    <div className="flex items-center min-w-0">
                      <Folder className="w-5 h-5 mr-3 text-slate-400" />
                      <div className="truncate">
                        <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{c.name}</p>
                        {c.description && <p className="text-xs text-slate-500 truncate">{c.description}</p>}
                      </div>
                    </div>
                    <span className="text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-1 rounded-md ml-3">
                      {c.mediaIds.length}
                    </span>
                  </button>
                ))}
                
                {collections.filter(c => !c.isSmart).length === 0 && (
                  <p className="text-center text-sm text-slate-500 py-4">No custom collections yet.</p>
                )}
              </div>
            </div>
          ) : (
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Name</label>
                <input 
                  type="text"
                  required
                  autoFocus
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Hackathon 2026"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description (Optional)</label>
                <input 
                  type="text"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Project demonstration assets"
                />
              </div>
              
              <div className="flex items-center gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setIsCreating(false)}
                  className="flex-1 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={!newTitle.trim()}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                  Create
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
