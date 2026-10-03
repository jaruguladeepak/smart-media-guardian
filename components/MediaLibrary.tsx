import { useState, useEffect } from 'react';
import { MediaData } from '@/lib/types';
import MediaCard from './MediaCard';
import { SearchQuery, searchMedia } from '@/lib/search';
import { Search, Filter, Loader2, Star } from 'lucide-react';
import { useAppStore } from '@/lib/store';

interface MediaLibraryProps {
  localMedia: MediaData[]; // Media uploaded in this session before search
  selectedMedia: MediaData | null;
  onSelectMedia: (media: MediaData) => void;
  filterMediaIds?: string[] | null;
}

export default function MediaLibrary({ localMedia, selectedMedia, onSelectMedia, filterMediaIds }: MediaLibraryProps) {
  const [searchState, setSearchState] = useState<SearchQuery>({
    query: '',
    type: 'all',
    moderation: 'all',
    category: 'all',
    collection: 'all',
    tags: 'any',
    date: 'all',
    format: 'all',
    optimized: 'all',
  });
  
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<MediaData[] | null>(null);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  
  const { mediaMetadata } = useAppStore();

  // Trigger search when search state changes (debounced for text query)
  useEffect(() => {
    // If no query and filters are default, we just show local media
    if (!searchState.query && searchState.type === 'all' && searchState.moderation === 'all' && searchState.category === 'all') {
      setSearchResults(null);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      const results = await searchMedia(searchState);
      setSearchResults(results);
      setIsSearching(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchState]);

  let displayMedia = searchResults !== null ? [...searchResults] : [...localMedia];
  
  if (searchState.query) {
    const query = searchState.query.toLowerCase();
    
    // Find local media with matching custom tags that aren't already in displayMedia
    const existingIds = new Set(displayMedia.map(m => m.publicId));
    const localMatches = localMedia.filter(media => {
      if (existingIds.has(media.publicId)) return false;
      const customTags = mediaMetadata[media.publicId]?.customTags || [];
      return customTags.some(tag => tag.toLowerCase().includes(query));
    });

    displayMedia = [...displayMedia, ...localMatches];
  }
  
  if (showFavoritesOnly) {
    displayMedia = displayMedia.filter(media => mediaMetadata[media.publicId]?.isFavorite);
  }

  if (filterMediaIds) {
    const filterSet = new Set(filterMediaIds);
    displayMedia = displayMedia.filter(media => filterSet.has(media.publicId));
  }

  return (
    <section className="space-y-6 h-full flex flex-col">
      <div className="bg-[#111118] p-3 rounded-2xl border border-white/10 flex items-center gap-3">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-9 pr-4 py-2 bg-transparent border-none focus:ring-0 text-white placeholder-slate-500 text-sm"
            placeholder="Search anything..."
            value={searchState.query}
            onChange={(e) => setSearchState({ ...searchState, query: e.target.value })}
          />
          {isSearching && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <Loader2 className="h-4 w-4 text-indigo-500 animate-spin" />
            </div>
          )}
        </div>
        
        <div className="w-px h-6 bg-white/10"></div>

        <div className="flex items-center gap-2 pr-2">
          <button className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg flex items-center transition-colors">
            <Filter className="w-3.5 h-3.5 mr-1.5" /> Filters
          </button>
          <button className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
            Sort
          </button>
          <button className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
            View
          </button>
          <button className="px-3 py-1.5 text-xs font-medium text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 rounded-lg flex items-center transition-colors">
            <Star className="w-3.5 h-3.5 mr-1.5" /> AI Search
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-8">
        {displayMedia.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {displayMedia.map((media, index) => (
              <MediaCard 
                key={media.publicId + index} 
                media={media} 
                onClick={() => onSelectMedia(media)}
                isSelected={selectedMedia?.publicId === media.publicId}
              />
            ))}
          </div>
        ) : (
          <div className="bg-[#111118] rounded-2xl p-16 text-center text-slate-500 border border-white/5 flex flex-col items-center justify-center h-full">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
              <Search className="w-6 h-6 text-slate-400" />
            </div>
            <p className="text-lg text-slate-300 font-medium mb-1">
              {searchResults !== null ? 'No assets found' : 'No assets uploaded yet'}
            </p>
            <p className="text-sm">
              {searchResults !== null ? 'Try adjusting your search or filters.' : 'Upload media to get started.'}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
