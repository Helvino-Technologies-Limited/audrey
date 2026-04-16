import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';
import { getAdminUser } from '@/lib/auth';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const { is_approved, is_featured, admin_notes } = await request.json();

  const result = await sql`
    UPDATE reviews SET
      is_approved = COALESCE(${is_approved}, is_approved),
      is_featured = COALESCE(${is_featured}, is_featured),
      admin_notes = COALESCE(${admin_notes}, admin_notes),
      updated_at = NOW()
    WHERE id = ${Number(id)} RETURNING *
  `;
  return NextResponse.json(result[0]);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  await sql`DELETE FROM reviews WHERE id = ${Number(id)}`;
  return NextResponse.json({ success: true });
}
