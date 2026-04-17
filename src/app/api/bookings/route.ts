import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';
import { getAdminUser, generateReference } from '@/lib/auth';
import { sendAdminEmail, bookingEmailHtml } from '@/lib/email';

export async function GET() {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const bookings = await sql`
    SELECT * FROM bookings ORDER BY created_at DESC
  `;
  return NextResponse.json(bookings);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      service_id, service_name, customer_name, customer_email, customer_phone,
      booking_date, booking_time, end_date, guests, special_requests, total_amount
    } = body;

    if (!customer_name || !customer_email || !booking_date) {
      return NextResponse.json({ error: 'Name, email and date are required' }, { status: 400 });
    }

    const reference = generateReference('BK');
    const result = await sql`
      INSERT INTO bookings (reference, service_id, service_name, customer_name, customer_email, customer_phone, booking_date, booking_time, end_date, guests, special_requests, total_amount)
      VALUES (${reference}, ${service_id}, ${service_name}, ${customer_name}, ${customer_email}, ${customer_phone}, ${booking_date}, ${booking_time}, ${end_date}, ${guests || 1}, ${special_requests}, ${total_amount})
      RETURNING *
    `;

    const booking = result[0];

    // Send email notification (non-blocking)
    sendAdminEmail({
      subject: `New Booking ${reference} — ${service_name || 'General'} — ${customer_name}`,
      html: bookingEmailHtml({
        reference,
        service_name,
        customer_name,
        customer_email,
        customer_phone,
        booking_date,
        booking_time,
        guests: guests || 1,
        special_requests,
        total_amount,
      }),
    }).catch(() => {});

    return NextResponse.json({ success: true, booking, reference }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}
