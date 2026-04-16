import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';
import { getAdminUser } from '@/lib/auth';

export async function GET() {
  const services = await sql`
    SELECT * FROM services ORDER BY display_order ASC
  `;
  return NextResponse.json(services);
}

export async function POST(request: NextRequest) {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { slug, title, short_description, full_description, features, price_from, price_info, image_url, icon, display_order } = body;

  const result = await sql`
    INSERT INTO services (slug, title, short_description, full_description, features, price_from, price_info, image_url, icon, display_order)
    VALUES (${slug}, ${title}, ${short_description}, ${full_description}, ${features}, ${price_from}, ${price_info}, ${image_url}, ${icon}, ${display_order || 0})
    RETURNING *
  `;

  return NextResponse.json(result[0], { status: 201 });
}
