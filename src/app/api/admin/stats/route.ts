import { NextResponse } from 'next/server';
import sql from '@/lib/db';
import { getAdminUser } from '@/lib/auth';

export async function GET() {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const [bookings, orders, reviews, pendingReviews, unreadMessages] = await Promise.all([
    sql`SELECT COUNT(*) as count, status FROM bookings GROUP BY status`,
    sql`SELECT COUNT(*) as count, status FROM food_orders GROUP BY status`,
    sql`SELECT COUNT(*) as count FROM reviews WHERE is_approved = true`,
    sql`SELECT COUNT(*) as count FROM reviews WHERE is_approved = false`,
    sql`SELECT COUNT(*) as count FROM contact_messages WHERE is_read = false`,
  ]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const totalBookings = (bookings as any[]).reduce((sum: number, b) => sum + Number(b.count), 0);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const totalOrders = (orders as any[]).reduce((sum: number, o) => sum + Number(o.count), 0);

  return NextResponse.json({
    bookings: { total: totalBookings, byStatus: bookings },
    orders: { total: totalOrders, byStatus: orders },
    reviews: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      approved: Number((reviews as any[])[0]?.count || 0),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      pending: Number((pendingReviews as any[])[0]?.count || 0),
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    messages: { unread: Number((unreadMessages as any[])[0]?.count || 0) },
  });
}
