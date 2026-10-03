import { getCldImageUrl, getCldVideoUrl } from 'next-cloudinary';

export interface TransformOptions {
 width?: number;
 height?: number;
 crop?: string;
 gravity?: string;
 backgroundRemoval?: boolean;
 format?: string;
 quality?: string;
}

export function generateTransformedUrl(publicId: string, resourceType: 'image' | 'video', options: TransformOptions) {
 const config: any = {
 src: publicId,
 format: options.format === 'auto' ? 'auto' : options.format,
 quality: options.quality === 'auto' ? 'auto' : options.quality,
 };

 if (options.width) config.width = options.width;
 if (options.height) config.height = options.height;
 if (options.crop) config.crop = options.crop;
 if (options.gravity) config.gravity = options.gravity;

 if (resourceType === 'video') {
 return getCldVideoUrl(config);
 }

 // Only images support background removal
 if (options.backgroundRemoval) {
 config.removeBackground = true;
 }

 return getCldImageUrl(config);
}
