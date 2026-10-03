import { MediaData, Collection } from './types';

// Map of common AI tags to pseudo-collection categories
const SMART_COLLECTIONS_MAP: Record<string, { name: string, icon: string, tags: string[] }> = {
  people: { name: 'People', icon: '👤', tags: ['person', 'people', 'man', 'woman', 'child', 'face', 'portrait'] },
  education: { name: 'Education', icon: '🎓', tags: ['student', 'classroom', 'school', 'university', 'college', 'book', 'learning'] },
  events: { name: 'Events', icon: '🎉', tags: ['event', 'party', 'concert', 'wedding', 'festival', 'crowd'] },
  objects: { name: 'Objects', icon: '🚗', tags: ['object', 'car', 'vehicle', 'furniture', 'device', 'tool'] },
};

export function generateSmartCollections(
  mediaList: MediaData[],
  mediaMetadata: Record<string, { customTags: string[]; isFavorite: boolean }>
): (Collection & { icon: string })[] {
  
  const allMediaIds = mediaList.map(m => m.publicId);
  const videoIds = mediaList.filter(m => m.resourceType === 'video').map(m => m.publicId);
  const favoriteIds = allMediaIds.filter(id => mediaMetadata[id]?.isFavorite);
  
  const smartCollections: (Collection & { icon: string })[] = [
    { id: 'smart-all', name: 'All Media', description: '', mediaIds: allMediaIds, isSmart: true, icon: '📁' },
    { id: 'smart-videos', name: 'Videos', description: '', mediaIds: videoIds, isSmart: true, icon: '🎬' },
    { id: 'smart-favorites', name: 'Favorites', description: '', mediaIds: favoriteIds, isSmart: true, icon: '⭐' },
  ];

  // Dynamic tag-based collections
  const tagCollections: Record<string, string[]> = {
    people: [],
    education: [],
    events: [],
    objects: [],
  };

  mediaList.forEach(media => {
    // Combine AI tags and Custom tags
    const allTags = [
      ...(media.tags || []),
      ...(mediaMetadata[media.publicId]?.customTags || [])
    ].map(t => t.toLowerCase());

    if (allTags.length === 0) return;

    Object.keys(SMART_COLLECTIONS_MAP).forEach(key => {
      const categoryTags = SMART_COLLECTIONS_MAP[key].tags;
      if (allTags.some(tag => categoryTags.includes(tag))) {
        tagCollections[key].push(media.publicId);
      }
    });
  });

  Object.keys(tagCollections).forEach(key => {
    if (tagCollections[key].length > 0) {
      smartCollections.push({
        id: `smart-${key}`,
        name: SMART_COLLECTIONS_MAP[key].name,
        description: '',
        mediaIds: tagCollections[key],
        isSmart: true,
        icon: SMART_COLLECTIONS_MAP[key].icon
      });
    }
  });

  return smartCollections;
}
