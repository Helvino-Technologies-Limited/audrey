import { NextRequest, NextResponse } from 'next/server';
import { getAdminUser } from '@/lib/auth';
import sql from '@/lib/db';

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB

export async function POST(request: NextRequest) {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const category = (formData.get('category') as string) || 'general';
    const altText = (formData.get('alt_text') as string) || '';
    const mediaType = (formData.get('type') as string) || 'image';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const maxSize = mediaType === 'video' ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `File too large. Max size: ${maxSize / 1024 / 1024}MB` },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');
    const mimeType = file.type || (mediaType === 'video' ? 'video/mp4' : 'image/jpeg');
    const dataUrl = `data:${mimeType};base64,${base64}`;

    const media = await sql`
      INSERT INTO media (filename, url, type, category, alt_text)
      VALUES (${file.name}, ${dataUrl}, ${mediaType}, ${category}, ${altText})
      RETURNING id, filename, url, type, category, alt_text, created_at
    `;

    const streamUrl = `/api/media/${media[0].id}`;
    return NextResponse.json({ success: true, media: media[0], url: dataUrl, streamUrl });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
