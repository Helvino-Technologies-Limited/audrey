import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';
import { getAdminUser } from '@/lib/auth';

// Public: get approved reviews
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const admin = await getAdminUser();

  if (admin) {
    // Admin gets all reviews
    const reviews = await sql`SELECT * FROM reviews ORDER BY created_at DESC`;
    return NextResponse.json(reviews);
  }

  // Public gets only approved
  const featured = searchParams.get('featured');
  if (featured) {
    const reviews = await sql`
      SELECT id, customer_name, rating, title, body, service, created_at
      FROM reviews WHERE is_approved = true AND is_featured = true
      ORDER BY created_at DESC LIMIT 6
    `;
    return NextResponse.json(reviews);
  }

  const reviews = await sql`
    SELECT id, customer_name, rating, title, body, service, created_at
    FROM reviews WHERE is_approved = true
    ORDER BY created_at DESC LIMIT 20
  `;
  return NextResponse.json(reviews);
}

// Public: submit a review
export async function POST(request: NextRequest) {
  try {
    const { customer_name, customer_email, rating, title, body, service } = await request.json();

    if (!customer_name || !rating || !body) {
      return NextResponse.json({ error: 'Name, rating and review are required' }, { status: 400 });
    }

    await sql`
      INSERT INTO reviews (customer_name, customer_email, rating, title, body, service, is_approved)
      VALUES (${customer_name}, ${customer_email}, ${rating}, ${title}, ${body}, ${service}, false)
    `;

    return NextResponse.json({ success: true, message: 'Review submitted and pending approval' }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 });
  }
}
