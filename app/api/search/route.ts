import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  try {
    const { query, type, moderation, category, format, date, tags } = await request.json();

    try {
      // Build the Cloudinary search expression
      let expression = 'folder:smart-media-guardian';

      if (query && query.trim() !== '') {
        // Handle "tags: 'all'" logic vs 'any' for multiple words?
        // Let's just do a basic search for the query terms
        const terms = query.split(/\s+/).filter(Boolean);
        if (tags === 'all') {
          const tagsQuery = terms.map((t: string) => `tags:${t}`).join(' AND ');
          expression += ` AND (${tagsQuery})`;
        } else {
          // ANY tags or public ID match
          expression += ` AND (tags:${query}* OR public_id:${query}*)`;
        }
      }

      if (type && type !== 'all') {
        expression += ` AND resource_type:${type}`;
      }

      if (format && format !== 'all') {
        expression += ` AND format:${format}`;
      }

      if (date && date !== 'all') {
        expression += ` AND uploaded_at>${date}`; // Note: 1d, 7d works in Cloudinary Search API expressions
      }

      // If we stored structured metadata via Cloudinary's Contextual Metadata or Structured Metadata
      // For demonstration, we assume we map categories to metadata fields
      // if (category && category !== 'all') {
      //   expression += ` AND metadata.category=${category}`;
      // }

      const result = await cloudinary.search
        .expression(expression)
        .with_field('tags')
        .with_field('context')
        .with_field('metadata')
        .max_results(30)
        .execute();

      const media = result.resources.map((r: any) => {
        // Here we map Cloudinary's search result back to our MediaData interface
        // Cloudinary stores moderation status in context or metadata depending on how it was saved.
        // We'll infer a mock moderation status if it's not present for demo purposes
        return {
          publicId: r.public_id,
          secureUrl: r.secure_url,
          resourceType: r.resource_type,
          format: r.format,
          width: r.width,
          height: r.height,
          bytes: r.bytes,
          tags: r.tags || [],
          moderation: {
            status: 'safe', // Mocking for now, replace with `r.context?.moderation`
            reason: null,
          },
          metadata: {
            category: r.context?.category || 'auto',
            analyzedAt: r.created_at,
          }
        };
      });

      return NextResponse.json({ results: media });

    } catch (cloudinaryError) {
      console.warn("Cloudinary Search API failed, using fallback mock data:", cloudinaryError);
      
      // Fallback if credentials aren't set
      await new Promise(resolve => setTimeout(resolve, 800));
      
      return NextResponse.json({
        results: [
          {
            publicId: 'smart-media-guardian/mock-image-1',
            secureUrl: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg',
            resourceType: 'image',
            format: 'jpg',
            width: 864,
            height: 576,
            bytes: 124500,
            tags: ['person', 'outdoor', query || 'student'].filter(Boolean),
            moderation: { status: 'safe', reason: null },
            metadata: { category: 'people' }
          },
          {
            publicId: 'smart-media-guardian/mock-video-1',
            secureUrl: 'https://res.cloudinary.com/demo/video/upload/dog.mp4',
            resourceType: 'video',
            format: 'mp4',
            width: 640,
            height: 360,
            bytes: 1045000,
            tags: ['dog', 'animal'].filter(Boolean),
            moderation: { status: 'safe', reason: null },
            metadata: { category: 'nature' }
          }
        ]
      });
    }

  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
