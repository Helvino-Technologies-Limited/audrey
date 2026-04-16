import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';
import { getAdminUser } from '@/lib/auth';

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  await sql`DELETE FROM gallery_items WHERE id = ${Number(id)}`;
  return NextResponse.json({ success: true });
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const { title, category, display_order, is_active } = await request.json();

  const result = await sql`
    UPDATE gallery_items SET
      title = COALESCE(${title}, title),
      category = COALESCE(${category}, category),
      display_order = COALESCE(${display_order}, display_order),
      is_active = COALESCE(${is_active}, is_active)
    WHERE id = ${Number(id)} RETURNING *
  `;
  return NextResponse.json(result[0]);
}
