import { NextResponse } from 'next/server';
import sql from '@/lib/db';
import { getAdminUser } from '@/lib/auth';

export async function GET() {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const media = await sql`SELECT * FROM media ORDER BY created_at DESC`;
  return NextResponse.json(media);
}
