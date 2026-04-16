import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';
import { getAdminUser } from '@/lib/auth';

export async function GET() {
  const categories = await sql`
    SELECT mc.*, json_agg(
      json_build_object(
        'id', mi.id, 'name', mi.name, 'description', mi.description,
        'price', mi.price, 'image_url', mi.image_url, 'is_vegetarian', mi.is_vegetarian,
        'is_available', mi.is_available, 'display_order', mi.display_order
      ) ORDER BY mi.display_order
    ) FILTER (WHERE mi.id IS NOT NULL) as items
    FROM menu_categories mc
    LEFT JOIN menu_items mi ON mi.category_id = mc.id AND mi.is_available = true
    WHERE mc.is_active = true
    GROUP BY mc.id
    ORDER BY mc.display_order
  `;
  return NextResponse.json(categories);
}

export async function POST(request: NextRequest) {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { type, ...data } = body;

  if (type === 'category') {
    const result = await sql`
      INSERT INTO menu_categories (name, description, display_order)
      VALUES (${data.name}, ${data.description}, ${data.display_order || 0})
      RETURNING *
    `;
    return NextResponse.json(result[0], { status: 201 });
  }

  if (type === 'item') {
    const result = await sql`
      INSERT INTO menu_items (category_id, name, description, price, image_url, is_vegetarian, display_order)
      VALUES (${data.category_id}, ${data.name}, ${data.description}, ${data.price}, ${data.image_url}, ${data.is_vegetarian || false}, ${data.display_order || 0})
      RETURNING *
    `;
    return NextResponse.json(result[0], { status: 201 });
  }

  return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
}
