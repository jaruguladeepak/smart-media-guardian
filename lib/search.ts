import { MediaData } from './types';

export interface SearchQuery {
 query: string;
 type: 'all' | 'image' | 'video';
 moderation: 'all' | 'safe' | 'flagged' | 'review';
 category: 'all' | string;
 collection: 'all' | string;
 tags: 'any' | 'all';
 date: 'all' | '7d' | '30d' | '90d';
 format: 'all' | 'jpg' | 'png' | 'webp' | 'mp4';
 optimized: 'all' | 'yes' | 'no';
}

export async function searchMedia(params: SearchQuery): Promise<MediaData[]> {
 try {
 const response = await fetch('/api/search', {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify(params),
 });
 
 if (!response.ok) {
 throw new Error('Search failed');
 }
 
 const data = await response.json();
 return data.results;
 } catch (error) {
 console.error('Search error:', error);
 return [];
 }
}
