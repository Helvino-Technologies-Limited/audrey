import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';
import { getAdminUser } from '@/lib/auth';
import { sendAdminEmail, contactEmailHtml } from '@/lib/email';

export async function GET() {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const messages = await sql`
    SELECT * FROM contact_messages ORDER BY created_at DESC
  `;
  return NextResponse.json(messages);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email and message are required' }, { status: 400 });
    }

    const result = await sql`
      INSERT INTO contact_messages (name, email, phone, subject, message)
      VALUES (${name}, ${email}, ${phone || null}, ${subject || 'General Enquiry'}, ${message})
      RETURNING *
    `;

    // Send email notification (non-blocking)
    sendAdminEmail({
      subject: `New Message from ${name} — ${subject || 'General Enquiry'}`,
      html: contactEmailHtml({ name, email, phone, subject: subject || 'General Enquiry', message }),
    }).catch(() => {});

    return NextResponse.json({ success: true, message: result[0] }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to save message' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await request.json();
  await sql`UPDATE contact_messages SET is_read = true WHERE id = ${id}`;
  return NextResponse.json({ success: true });
}
