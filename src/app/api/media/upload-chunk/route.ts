import { NextRequest, NextResponse } from 'next/server';
import { getAdminUser } from '@/lib/auth';
import sql from '@/lib/db';

// Each chunk must be < 3.5 MB (base64 inflates ~33%, stays under Vercel's 4.5 MB limit)
const MAX_CHUNK = 3.5 * 1024 * 1024;

async function ensureChunksTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS media_chunks (
      id          SERIAL PRIMARY KEY,
      upload_id   TEXT NOT NULL,
      chunk_index INTEGER NOT NULL,
      total_chunks INTEGER NOT NULL,
      data        TEXT NOT NULL,
      filename    TEXT,
      mime_type   TEXT,
      created_at  TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE (upload_id, chunk_index)
    )
  `;
}

export async function POST(request: NextRequest) {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await ensureChunksTable();

    const formData   = await request.formData();
    const chunk      = formData.get('chunk') as File;
    const uploadId   = formData.get('uploadId') as string;
    const chunkIndex = parseInt(formData.get('chunkIndex') as string, 10);
    const totalChunks = parseInt(formData.get('totalChunks') as string, 10);
    const filename   = (formData.get('filename') as string) || 'video.mp4';
    const mimeType   = (formData.get('mimeType') as string) || 'video/mp4';
    const category   = (formData.get('category') as string) || 'general';

    if (!chunk || !uploadId || isNaN(chunkIndex) || isNaN(totalChunks)) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    if (chunk.size > MAX_CHUNK) {
      return NextResponse.json({ error: `Chunk too large (max ${MAX_CHUNK / 1024 / 1024} MB)` }, { status: 400 });
    }

    // Store this chunk
    const bytes  = await chunk.arrayBuffer();
    const base64 = Buffer.from(bytes).toString('base64');

    await sql`
      INSERT INTO media_chunks (upload_id, chunk_index, total_chunks, data, filename, mime_type)
      VALUES (${uploadId}, ${chunkIndex}, ${totalChunks}, ${base64}, ${filename}, ${mimeType})
      ON CONFLICT (upload_id, chunk_index) DO UPDATE SET data = EXCLUDED.data
    `;

    // Check how many chunks we have for this upload
    const rows = await sql`
      SELECT chunk_index FROM media_chunks
      WHERE upload_id = ${uploadId}
      ORDER BY chunk_index
    `;

    if (rows.length < totalChunks) {
      // Not done yet
      return NextResponse.json({ status: 'pending', received: rows.length, total: totalChunks });
    }

    // All chunks received — fetch them in order and assemble
    const allChunks = await sql`
      SELECT data FROM media_chunks
      WHERE upload_id = ${uploadId}
      ORDER BY chunk_index
    `;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const combined = Buffer.concat(
      (allChunks as any[]).map((r: { data: string }) => Buffer.from(r.data, 'base64'))
    );
    const dataUrl = `data:${mimeType};base64,${combined.toString('base64')}`;

    // Insert into media table
    const media = await sql`
      INSERT INTO media (filename, url, type, category, alt_text)
      VALUES (${filename}, ${dataUrl}, 'video', ${category}, '')
      RETURNING id, filename, type, category, created_at
    `;

    // Clean up chunks
    await sql`DELETE FROM media_chunks WHERE upload_id = ${uploadId}`;

    const streamUrl = `/api/media/${media[0].id}`;
    return NextResponse.json({ status: 'complete', streamUrl, mediaId: media[0].id });

  } catch (err) {
    console.error('Chunk upload error:', err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
