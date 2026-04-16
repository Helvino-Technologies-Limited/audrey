import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';
import { getAdminUser } from '@/lib/auth';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const { type, ...data } = body;

  if (type === 'category') {
    const result = await sql`
      UPDATE menu_categories SET
        name = COALESCE(${data.name}, name),
        description = COALESCE(${data.description}, description),
        display_order = COALESCE(${data.display_order}, display_order),
        is_active = COALESCE(${data.is_active}, is_active)
      WHERE id = ${Number(id)} RETURNING *
    `;
    return NextResponse.json(result[0]);
  }

  const result = await sql`
    UPDATE menu_items SET
      name = COALESCE(${data.name}, name),
      description = COALESCE(${data.description}, description),
      price = COALESCE(${data.price}, price),
      image_url = COALESCE(${data.image_url}, image_url),
      is_vegetarian = COALESCE(${data.is_vegetarian}, is_vegetarian),
      is_available = COALESCE(${data.is_available}, is_available),
      display_order = COALESCE(${data.display_order}, display_order),
      updated_at = NOW()
    WHERE id = ${Number(id)} RETURNING *
  `;
  return NextResponse.json(result[0]);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const { type } = await request.json().catch(() => ({ type: 'item' }));

  if (type === 'category') {
    await sql`DELETE FROM menu_categories WHERE id = ${Number(id)}`;
  } else {
    await sql`DELETE FROM menu_items WHERE id = ${Number(id)}`;
  }
  return NextResponse.json({ success: true });
}
