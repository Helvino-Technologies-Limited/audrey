import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';
import { getAdminUser } from '@/lib/auth';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const body = await request.json();

  const result = await sql`
    UPDATE events SET
      title = COALESCE(${body.title}, title),
      description = COALESCE(${body.description}, description),
      event_date = COALESCE(${body.event_date}, event_date),
      event_time = COALESCE(${body.event_time}, event_time),
      image_url = COALESCE(${body.image_url}, image_url),
      is_active = COALESCE(${body.is_active}, is_active),
      updated_at = NOW()
    WHERE id = ${Number(id)} RETURNING *
  `;
  return NextResponse.json(result[0]);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  await sql`DELETE FROM events WHERE id = ${Number(id)}`;
  return NextResponse.json({ success: true });
}
