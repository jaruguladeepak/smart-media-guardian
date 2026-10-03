import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ActivityEvent, MediaData, TransformHistoryEvent, Collection, Preset, ShareLink } from './types';
import { DEFAULT_PRESETS } from './presets';

interface AppState {
  activities: ActivityEvent[];
  addActivity: (event: Omit<ActivityEvent, 'id' | 'timestamp'>) => void;
  markActivityRead: (id: string) => void;
  markAllActivitiesRead: () => void;
  
  transformHistory: TransformHistoryEvent[];
  addTransformHistory: (event: Omit<TransformHistoryEvent, 'id' | 'timestamp'>) => void;

  uploadedMedia: MediaData[];
  setUploadedMedia: (media: MediaData[] | ((prev: MediaData[]) => MediaData[])) => void;

  // A map of publicId to its custom tags and favorite status
  mediaMetadata: Record<string, { customTags: string[]; isFavorite: boolean }>;
  toggleFavorite: (publicId: string) => void;
  addCustomTag: (publicId: string, tag: string) => void;
  removeCustomTag: (publicId: string, tag: string) => void;

  collections: Collection[];
  createCollection: (name: string, description?: string) => void;
  deleteCollection: (id: string) => void;
  addToCollection: (collectionId: string, publicIds: string[]) => void;
  removeFromCollection: (collectionId: string, publicIds: string[]) => void;
  toggleCollectionPublic: (id: string, isPublic: boolean) => void;

  shareLinks: ShareLink[];
  createShareLink: (targetId: string, targetType: 'media' | 'collection', permissions: 'view' | 'download', expiresInHours: number | null) => string;
  revokeShareLink: (id: string) => void;

  selectedItems: string[];
  toggleSelection: (publicId: string) => void;
  selectAll: (publicIds: string[]) => void;
  clearSelection: () => void;

  presets: Preset[];
  createPreset: (preset: Omit<Preset, 'id' | 'category'>) => void;
  deletePreset: (id: string) => void;

  demoMode: boolean;
  setDemoMode: (enabled: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
  activities: [],
  transformHistory: [],
  uploadedMedia: [],
  mediaMetadata: {},
  collections: [],
  shareLinks: [],
  selectedItems: [],
  presets: [...DEFAULT_PRESETS],
  demoMode: false,
  
  setDemoMode: (enabled) => set({ demoMode: enabled }),
  
  setUploadedMedia: (media) => set((state) => ({
    uploadedMedia: typeof media === 'function' ? media(state.uploadedMedia) : media
  })),

  addActivity: (event) => set((state) => ({
    activities: [
      {
        ...event,
        id: Math.random().toString(36).substring(7),
        timestamp: new Date(),
        isRead: false,
      },
      ...state.activities,
    ].slice(0, 50), // Keep last 50 activities
  })),

  markActivityRead: (id) => set((state) => ({
    activities: state.activities.map(a => 
      a.id === id ? { ...a, isRead: true } : a
    )
  })),

  markAllActivitiesRead: () => set((state) => ({
    activities: state.activities.map(a => ({ ...a, isRead: true }))
  })),

  addTransformHistory: (event) => set((state) => {
    // Prevent duplicate adjacent history entries if they have the same options
    const isDuplicate = state.transformHistory.length > 0 && 
                        state.transformHistory[0].publicId === event.publicId && 
                        JSON.stringify(state.transformHistory[0].options) === JSON.stringify(event.options);
    
    if (isDuplicate) return state;

    return {
      transformHistory: [
        {
          ...event,
          id: Math.random().toString(36).substring(7),
          timestamp: new Date(),
        },
        ...state.transformHistory,
      ].slice(0, 30), // Keep last 30 transformations
    };
  }),

  toggleFavorite: (publicId) => set((state) => {
    const current = state.mediaMetadata[publicId] || { customTags: [], isFavorite: false };
    const newIsFavorite = !current.isFavorite;
    
    // We add an activity event when toggled
    const activity: ActivityEvent = {
      id: Math.random().toString(36).substring(7),
      publicId,
      type: 'FAVORITE',
      description: newIsFavorite ? 'Added to favorites' : 'Removed from favorites',
      timestamp: new Date(),
    };

    return {
      mediaMetadata: {
        ...state.mediaMetadata,
        [publicId]: { ...current, isFavorite: newIsFavorite },
      },
      activities: [activity, ...state.activities].slice(0, 50)
    };
  }),

  addCustomTag: (publicId, tag) => set((state) => {
    const current = state.mediaMetadata[publicId] || { customTags: [], isFavorite: false };
    if (current.customTags.includes(tag)) return state;

    const activity: ActivityEvent = {
      id: Math.random().toString(36).substring(7),
      publicId,
      type: 'TAG_ADDED',
      description: `Added custom tag "${tag}"`,
      timestamp: new Date(),
    };

    return {
      mediaMetadata: {
        ...state.mediaMetadata,
        [publicId]: { ...current, customTags: [...current.customTags, tag] },
      },
      activities: [activity, ...state.activities].slice(0, 50)
    };
  }),

  removeCustomTag: (publicId, tag) => set((state) => {
    const current = state.mediaMetadata[publicId] || { customTags: [], isFavorite: false };
    
    const activity: ActivityEvent = {
      id: Math.random().toString(36).substring(7),
      publicId,
      type: 'TAG_REMOVED',
      description: `Removed custom tag "${tag}"`,
      timestamp: new Date(),
    };

    return {
      mediaMetadata: {
        ...state.mediaMetadata,
        [publicId]: { ...current, customTags: current.customTags.filter(t => t !== tag) },
      },
      activities: [activity, ...state.activities].slice(0, 50)
    };
  }),

  createCollection: (name, description = '') => set((state) => ({
    collections: [
      ...state.collections,
      {
        id: Math.random().toString(36).substring(7),
        name,
        description,
        mediaIds: [],
      }
    ]
  })),

  deleteCollection: (id) => set((state) => ({
    collections: state.collections.filter(c => c.id !== id)
  })),

  addToCollection: (collectionId, publicIds) => set((state) => ({
    collections: state.collections.map(c => 
      c.id === collectionId 
        ? { ...c, mediaIds: Array.from(new Set([...c.mediaIds, ...publicIds])) }
        : c
    )
  })),

  removeFromCollection: (collectionId, publicIds) => set((state) => {
    const toRemove = new Set(publicIds);
    return {
      collections: state.collections.map(c => 
        c.id === collectionId 
          ? { ...c, mediaIds: c.mediaIds.filter(id => !toRemove.has(id)) }
          : c
      )
    };
  }),

  toggleCollectionPublic: (id, isPublic) => set((state) => ({
    collections: state.collections.map(c => c.id === id ? { ...c, isPublic } : c)
  })),

  createShareLink: (targetId, targetType, permissions, expiresInHours) => {
    const id = Math.random().toString(36).substring(7);
    const expiresAt = expiresInHours ? new Date(Date.now() + expiresInHours * 3600000) : null;
    const url = typeof window !== 'undefined' ? `${window.location.origin}/share/${id}` : `/share/${id}`;
    
    set((state) => ({
      shareLinks: [
        ...state.shareLinks,
        { id, targetId, targetType, url, expiresAt, permissions, createdAt: new Date() }
      ]
    }));
    return url;
  },

  revokeShareLink: (id) => set((state) => ({
    shareLinks: state.shareLinks.filter(link => link.id !== id)
  })),

  toggleSelection: (publicId) => set((state) => ({
    selectedItems: state.selectedItems.includes(publicId)
      ? state.selectedItems.filter(id => id !== publicId)
      : [...state.selectedItems, publicId]
  })),

  selectAll: (publicIds) => set({ selectedItems: publicIds }),
  
  clearSelection: () => set({ selectedItems: [] }),

  createPreset: (preset) => set((state) => ({
    presets: [
      ...state.presets,
      {
        ...preset,
        id: `custom-${Math.random().toString(36).substring(7)}`,
        category: 'custom',
      }
    ]
  })),

  deletePreset: (id) => set((state) => ({
    presets: state.presets.filter(p => p.id !== id)
  })),
}), {
  name: 'smart-media-guardian-storage',
}));
