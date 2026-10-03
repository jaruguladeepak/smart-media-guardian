export interface MediaData {
 publicId: string;
 secureUrl: string;
 resourceType: 'image' | 'video';
 format: string;
 width: number;
 height: number;
 bytes: number;
 tags?: string[];
 moderation?: {
 status: 'safe' | 'flagged' | 'pending' | 'rejected' | 'unknown' | 'review';
 reason?: string | null;
 };
 metadata?: {
 category?: string;
 analyzedAt?: string;
 source?: string;
 };
 customTags?: string[];
 isFavorite?: boolean;
}

export interface ActivityEvent {
 id: string;
 publicId: string;
 type: 'UPLOAD' | 'ANALYSIS' | 'TRANSFORMATION' | 'FAVORITE' | 'TAG_ADDED' | 'TAG_REMOVED' | 'SEARCH' | 'EXPORT';
 description: string;
 timestamp: Date;
 isRead?: boolean;
}

export interface TransformHistoryEvent {
 id: string;
 publicId: string;
 name: string;
 description: string;
 options: any; // TransformOptions
 url: string;
 timestamp: Date;
}

export interface Collection {
 id: string;
 name: string;
 description: string;
 mediaIds: string[];
 isSmart?: boolean;
 isPublic?: boolean;
 shareLinkId?: string;
}

export interface ShareLink {
 id: string;
 targetId: string; // publicId or collectionId
 targetType: 'media' | 'collection';
 url: string;
 expiresAt: Date | null;
 permissions: 'view' | 'download';
 createdAt: Date;
}

export interface Preset {
 id: string;
 name: string;
 category: 'social' | 'professional' | 'custom';
 options: any; // TransformOptions
 icon?: string;
 description?: string;
}
