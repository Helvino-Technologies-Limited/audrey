import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const rows = await sql`SELECT url, type FROM media WHERE id = ${id}`;
    if (!rows[0]) return new NextResponse('Not found', { status: 404 });

    const { url, type } = rows[0] as { url: string; type: string };

    // Parse data URL: "data:<mime>;base64,<data>"
    const commaIdx = url.indexOf(',');
    if (commaIdx === -1) return new NextResponse('Invalid media', { status: 500 });

    const header = url.slice(0, commaIdx);           // "data:video/mp4;base64"
    const mimeType = header.split(':')[1]?.split(';')[0] ?? (type === 'video' ? 'video/mp4' : 'image/jpeg');
    const buffer = Buffer.from(url.slice(commaIdx + 1), 'base64');

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': mimeType,
        'Content-Length': buffer.length.toString(),
        'Cache-Control': 'public, max-age=86400',
        'Accept-Ranges': 'bytes',
      },
    });
  } catch (err) {
    console.error('Media serve error:', err);
    return new NextResponse('Server error', { status: 500 });
  }
}
