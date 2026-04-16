import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';
import { getAdminUser } from '@/lib/auth';

export async function GET() {
  const events = await sql`
    SELECT * FROM events WHERE is_active = true ORDER BY event_date ASC NULLS LAST
  `;
  return NextResponse.json(events);
}

export async function POST(request: NextRequest) {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { title, description, event_date, event_time, image_url, is_recurring, recurrence_pattern } = await request.json();

  const result = await sql`
    INSERT INTO events (title, description, event_date, event_time, image_url, is_recurring, recurrence_pattern)
    VALUES (${title}, ${description}, ${event_date}, ${event_time}, ${image_url}, ${is_recurring || false}, ${recurrence_pattern})
    RETURNING *
  `;
  return NextResponse.json(result[0], { status: 201 });
}
