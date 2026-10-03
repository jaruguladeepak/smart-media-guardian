import { useState, useMemo } from 'react';
import { MediaData } from '@/lib/types';
import { ShieldAlert, ShieldCheck, AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react';
import MediaCard from './MediaCard';

interface ModerationCenterProps {
  mediaList: MediaData[];
  onSelectMedia: (media: MediaData) => void;
  onUpdateMedia: (media: MediaData) => void;
}

export default function ModerationCenter({ mediaList, onSelectMedia, onUpdateMedia }: ModerationCenterProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'safe' | 'review' | 'flagged'>('review');

  const stats = useMemo(() => {
    return {
      safe: mediaList.filter(m => m.moderation?.status === 'safe').length,
      review: mediaList.filter(m => m.moderation?.status === 'review').length,
      flagged: mediaList.filter(m => m.moderation?.status === 'flagged').length,
    };
  }, [mediaList]);

  // Generate some fake "needs review" items if none exist for demo purposes, 
  // or just rely on the real items. Let's just use the real items.
  const displayMedia = useMemo(() => {
    if (activeTab === 'all') return mediaList;
    return mediaList.filter(m => m.moderation?.status === activeTab);
  }, [mediaList, activeTab]);

  const handleMarkSafe = (media: MediaData) => {
    onUpdateMedia({
      ...media,
      moderation: { ...media.moderation, status: 'safe' }
    });
  };

  const handleFlag = (media: MediaData) => {
    onUpdateMedia({
      ...media,
      moderation: { ...media.moderation, status: 'flagged' }
    });
  };

  return (
    <div className="animate-in fade-in duration-300">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-2 flex items-center gap-2">
          <ShieldAlert className="w-6 h-6 text-indigo-500" />
          Moderation Center
        </h1>
        <p className="text-slate-500">Review and manage the safety status of your media assets.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div 
          onClick={() => setActiveTab('safe')}
          className={`bg-white dark:bg-slate-900 p-6 rounded-2xl border ${activeTab === 'safe' ? 'border-emerald-500 ring-1 ring-emerald-500' : 'border-slate-200 dark:border-slate-800'} shadow-sm cursor-pointer hover:shadow-md transition-all`}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Safe</p>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{stats.safe}</h3>
            </div>
            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
              <ShieldCheck className="w-6 h-6 text-emerald-500" />
            </div>
          </div>
        </div>
        
        <div 
          onClick={() => setActiveTab('review')}
          className={`bg-white dark:bg-slate-900 p-6 rounded-2xl border ${activeTab === 'review' ? 'border-amber-500 ring-1 ring-amber-500' : 'border-slate-200 dark:border-slate-800'} shadow-sm cursor-pointer hover:shadow-md transition-all`}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Needs Review</p>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{stats.review}</h3>
            </div>
            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
              <AlertCircle className="w-6 h-6 text-amber-500" />
            </div>
          </div>
        </div>
        
        <div 
          onClick={() => setActiveTab('flagged')}
          className={`bg-white dark:bg-slate-900 p-6 rounded-2xl border ${activeTab === 'flagged' ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-200 dark:border-slate-800'} shadow-sm cursor-pointer hover:shadow-md transition-all`}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Flagged</p>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{stats.flagged}</h3>
            </div>
            <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 capitalize">
          {activeTab === 'all' ? 'All Media' : activeTab === 'review' ? 'Needs Review' : activeTab}
        </h2>
        
        {displayMedia.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayMedia.map((media) => (
              <div key={media.publicId} className="group relative">
                <MediaCard 
                  media={media} 
                  onClick={() => onSelectMedia(media)}
                  isSelected={false}
                />
                
                {/* Overlay actions specific to moderation */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-2">
                  {media.moderation?.status !== 'safe' && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleMarkSafe(media); }}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white p-2 rounded-lg shadow-sm"
                      title="Mark as Safe"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                  )}
                  {media.moderation?.status !== 'flagged' && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleFlag(media); }}
                      className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg shadow-sm"
                      title="Flag Media"
                    >
                      <AlertTriangle className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-xl p-12 text-center text-slate-500 border border-slate-200 dark:border-slate-800 border-dashed">
            <ShieldCheck className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-700 mb-4" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">All clear!</h3>
            <p>No media found in this moderation category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
