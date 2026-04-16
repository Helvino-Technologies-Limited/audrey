import { NextResponse } from 'next/server';
import sql from '@/lib/db';
import { getAdminUser } from '@/lib/auth';

export async function GET() {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const [bookings, orders, reviews, pendingReviews] = await Promise.all([
    sql`SELECT COUNT(*) as count, status FROM bookings GROUP BY status`,
    sql`SELECT COUNT(*) as count, status FROM food_orders GROUP BY status`,
    sql`SELECT COUNT(*) as count FROM reviews WHERE is_approved = true`,
    sql`SELECT COUNT(*) as count FROM reviews WHERE is_approved = false`,
  ]);

  const totalBookings = bookings.reduce((sum: number, b: { count: string }) => sum + Number(b.count), 0);
  const totalOrders = orders.reduce((sum: number, o: { count: string }) => sum + Number(o.count), 0);

  return NextResponse.json({
    bookings: { total: totalBookings, byStatus: bookings },
    orders: { total: totalOrders, byStatus: orders },
    reviews: { approved: Number(reviews[0]?.count || 0), pending: Number(pendingReviews[0]?.count || 0) },
  });
}
