import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';
import { getAdminUser } from '@/lib/auth';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const isSlug = isNaN(Number(id));

  const services = isSlug
    ? await sql`SELECT * FROM services WHERE slug = ${id}`
    : await sql`SELECT * FROM services WHERE id = ${Number(id)}`;

  if (services.length === 0) {
    return NextResponse.json({ error: 'Service not found' }, { status: 404 });
  }
  return NextResponse.json(services[0]);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const { title, short_description, full_description, features, price_from, price_info, image_url, gallery_images, icon, is_active, display_order } = body;

  const result = await sql`
    UPDATE services SET
      title = COALESCE(${title}, title),
      short_description = COALESCE(${short_description}, short_description),
      full_description = COALESCE(${full_description}, full_description),
      features = COALESCE(${features}, features),
      price_from = COALESCE(${price_from}, price_from),
      price_info = COALESCE(${price_info}, price_info),
      image_url = COALESCE(${image_url}, image_url),
      gallery_images = COALESCE(${gallery_images}, gallery_images),
      icon = COALESCE(${icon}, icon),
      is_active = COALESCE(${is_active}, is_active),
      display_order = COALESCE(${display_order}, display_order),
      updated_at = NOW()
    WHERE id = ${Number(id)}
    RETURNING *
  `;

  if (result.length === 0) {
    return NextResponse.json({ error: 'Service not found' }, { status: 404 });
  }
  return NextResponse.json(result[0]);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  await sql`DELETE FROM services WHERE id = ${Number(id)}`;
  return NextResponse.json({ success: true });
}
