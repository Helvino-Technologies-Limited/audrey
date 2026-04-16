import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';
import { getAdminUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get('page');

  if (page) {
    const content = await sql`
      SELECT * FROM page_content WHERE page = ${page}
    `;
    const result: Record<string, Record<string, string>> = {};
    content.forEach((c: { section: string; key: string; value: string }) => {
      if (!result[c.section]) result[c.section] = {};
      result[c.section][c.key] = c.value;
    });
    return NextResponse.json(result);
  }

  const content = await sql`SELECT * FROM page_content ORDER BY page, section, key`;
  return NextResponse.json(content);
}

export async function PUT(request: NextRequest) {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const updates = await request.json();
  // updates: [{ page, section, key, value, type }]

  for (const u of updates) {
    await sql`
      INSERT INTO page_content (page, section, key, value, type, updated_at)
      VALUES (${u.page}, ${u.section}, ${u.key}, ${u.value}, ${u.type || 'text'}, NOW())
      ON CONFLICT (page, section, key) DO UPDATE SET value = ${u.value}, updated_at = NOW()
    `;
  }

  return NextResponse.json({ success: true });
}
