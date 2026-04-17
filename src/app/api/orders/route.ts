import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';
import { getAdminUser, generateReference } from '@/lib/auth';
import { sendAdminEmail, orderEmailHtml } from '@/lib/email';

export async function GET() {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const orders = await sql`
    SELECT * FROM food_orders ORDER BY created_at DESC
  `;
  return NextResponse.json(orders);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customer_name, customer_email, customer_phone,
      arrival_date, arrival_time, guests, items, total_amount, special_requests
    } = body;

    if (!customer_name || !arrival_date || !arrival_time || !items || items.length === 0) {
      return NextResponse.json({ error: 'Required fields missing' }, { status: 400 });
    }

    const reference = generateReference('ORD');
    const result = await sql`
      INSERT INTO food_orders (reference, customer_name, customer_email, customer_phone, arrival_date, arrival_time, guests, items, total_amount, special_requests)
      VALUES (${reference}, ${customer_name}, ${customer_email}, ${customer_phone}, ${arrival_date}, ${arrival_time}, ${guests || 1}, ${JSON.stringify(items)}, ${total_amount}, ${special_requests})
      RETURNING *
    `;

    const order = result[0];

    // Send email notification (non-blocking)
    sendAdminEmail({
      subject: `New Food Order ${reference} — ${customer_name}`,
      html: orderEmailHtml({
        reference,
        customer_name,
        customer_email,
        customer_phone,
        arrival_date,
        arrival_time,
        guests: guests || 1,
        items,
        total_amount,
        special_requests,
      }),
    }).catch(() => {});

    return NextResponse.json({ success: true, order, reference }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
