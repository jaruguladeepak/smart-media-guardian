import { Preset } from './types';

export const DEFAULT_PRESETS: Preset[] = [
 // Professional
 {
 id: 'prof-website-hero',
 name: 'Website Hero',
 category: 'professional',
 description: '1920 × 800',
 icon: '💻',
 options: { width: 1920, height: 800, crop: 'fill', gravity: 'auto', format: 'auto', quality: 'auto' }
 },
 {
 id: 'prof-profile-photo',
 name: 'Profile Photo',
 category: 'professional',
 description: '512 × 512',
 icon: '👤',
 options: { width: 512, height: 512, crop: 'fill', gravity: 'face', format: 'auto', quality: 'auto' }
 },
 {
 id: 'prof-card-thumb',
 name: 'Card Thumbnail',
 category: 'professional',
 description: '640 × 480',
 icon: '🖼️',
 options: { width: 640, height: 480, crop: 'fill', gravity: 'auto', format: 'auto', quality: 'auto' }
 },
 {
 id: 'prof-blog-featured',
 name: 'Blog Featured Image',
 category: 'professional',
 description: '1600 × 900',
 icon: '📝',
 options: { width: 1600, height: 900, crop: 'fill', gravity: 'auto', format: 'auto', quality: 'auto' }
 },

 // Social
 {
 id: 'social-ig-post',
 name: 'Instagram Post',
 category: 'social',
 description: '1080 × 1080',
 icon: '📱',
 options: { width: 1080, height: 1080, crop: 'fill', gravity: 'auto', format: 'auto', quality: 'auto' }
 },
 {
 id: 'social-ig-portrait',
 name: 'Instagram Portrait',
 category: 'social',
 description: '1080 × 1350',
 icon: '📱',
 options: { width: 1080, height: 1350, crop: 'fill', gravity: 'auto', format: 'auto', quality: 'auto' }
 },
 {
 id: 'social-ig-story',
 name: 'Instagram Story',
 category: 'social',
 description: '1080 × 1920',
 icon: '📱',
 options: { width: 1080, height: 1920, crop: 'fill', gravity: 'auto', format: 'auto', quality: 'auto' }
 },
 {
 id: 'social-yt-thumb',
 name: 'YouTube Thumbnail',
 category: 'social',
 description: '1280 × 720',
 icon: '▶️',
 options: { width: 1280, height: 720, crop: 'fill', gravity: 'auto', format: 'auto', quality: 'auto' }
 },
 {
 id: 'social-li-post',
 name: 'LinkedIn Post',
 category: 'social',
 description: '1200 × 627',
 icon: '💼',
 options: { width: 1200, height: 627, crop: 'fill', gravity: 'auto', format: 'auto', quality: 'auto' }
 },
 {
 id: 'social-x-post',
 name: 'X Post',
 category: 'social',
 description: '1600 × 900',
 icon: '🐦',
 options: { width: 1600, height: 900, crop: 'fill', gravity: 'auto', format: 'auto', quality: 'auto' }
 }
];
