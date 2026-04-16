import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';
import { getAdminUser } from '@/lib/auth';

export async function GET() {
  const settings = await sql`SELECT key, value FROM site_settings`;
  const result: Record<string, string | null> = {};
  settings.forEach((s: { key: string; value: string | null }) => {
    result[s.key] = s.value;
  });
  return NextResponse.json(result);
}

export async function PUT(request: NextRequest) {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const updates = await request.json();

  for (const [key, value] of Object.entries(updates)) {
    await sql`
      INSERT INTO site_settings (key, value, updated_at)
      VALUES (${key}, ${value as string}, NOW())
      ON CONFLICT (key) DO UPDATE SET value = ${value as string}, updated_at = NOW()
    `;
  }

  return NextResponse.json({ success: true });
}
