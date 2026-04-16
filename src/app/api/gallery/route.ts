import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';
import { getAdminUser } from '@/lib/auth';

export async function GET() {
  const items = await sql`
    SELECT * FROM gallery_items WHERE is_active = true ORDER BY display_order ASC, created_at DESC
  `;
  return NextResponse.json(items);
}

export async function POST(request: NextRequest) {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { title, image_url, category, display_order } = await request.json();

  const result = await sql`
    INSERT INTO gallery_items (title, image_url, category, display_order)
    VALUES (${title}, ${image_url}, ${category}, ${display_order || 0})
    RETURNING *
  `;
  return NextResponse.json(result[0], { status: 201 });
}
