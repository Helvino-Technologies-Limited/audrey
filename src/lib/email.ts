import nodemailer from 'nodemailer';
import sql from './db';

async function getAdminEmail(): Promise<string> {
  try {
    const rows = await sql`SELECT value FROM site_settings WHERE key = 'contact_email' LIMIT 1`;
    return rows[0]?.value || process.env.ADMIN_EMAIL || '';
  } catch {
    return process.env.ADMIN_EMAIL || '';
  }
}

function createTransporter() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return null;

  return nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_PORT === '465',
    auth: { user, pass },
  });
}

interface EmailOptions {
  subject: string;
  html: string;
}

export async function sendAdminEmail({ subject, html }: EmailOptions) {
  const transporter = createTransporter();
  if (!transporter) return; // SMTP not configured — silently skip

  const to = process.env.ADMIN_EMAIL || await getAdminEmail();
  if (!to) return;

  try {
    await transporter.sendMail({
      from: `"The Audrey Resort" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });
  } catch (err) {
    console.error('Email send failed:', err);
  }
}

export function orderEmailHtml(order: {
  reference: string;
  customer_name: string;
  customer_email?: string;
  customer_phone?: string;
  arrival_date: string;
  arrival_time: string;
  guests: number;
  items: Array<{ name: string; quantity: number; price: number }>;
  total_amount: number;
  special_requests?: string;
}) {
  const items = order.items.map(i =>
    `<tr><td style="padding:6px 0;border-bottom:1px solid #eee">${i.quantity}× ${i.name}</td><td style="padding:6px 0;border-bottom:1px solid #eee;text-align:right">KES ${(i.price * i.quantity).toLocaleString()}</td></tr>`
  ).join('');

  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;border:1px solid #ddd;border-radius:8px;overflow:hidden">
      <div style="background:#0A1525;padding:24px;text-align:center">
        <h2 style="color:#38BDF8;margin:0;font-size:20px">New Food Order Received</h2>
        <p style="color:#aaa;margin:6px 0 0;font-size:13px">Ref: <strong style="color:#fff">${order.reference}</strong></p>
      </div>
      <div style="padding:24px">
        <table style="width:100%;border-collapse:collapse;margin-bottom:20px">
          <tr><td style="padding:8px 0;color:#666;width:140px">Customer</td><td style="padding:8px 0;font-weight:600">${order.customer_name}</td></tr>
          ${order.customer_phone ? `<tr><td style="padding:8px 0;color:#666">Phone</td><td style="padding:8px 0">${order.customer_phone}</td></tr>` : ''}
          ${order.customer_email ? `<tr><td style="padding:8px 0;color:#666">Email</td><td style="padding:8px 0">${order.customer_email}</td></tr>` : ''}
          <tr><td style="padding:8px 0;color:#666">Arrival Date</td><td style="padding:8px 0">${new Date(order.arrival_date).toLocaleDateString('en-KE', { dateStyle: 'full' })}</td></tr>
          <tr><td style="padding:8px 0;color:#666">Arrival Time</td><td style="padding:8px 0">${order.arrival_time}</td></tr>
          <tr><td style="padding:8px 0;color:#666">Guests</td><td style="padding:8px 0">${order.guests}</td></tr>
          ${order.special_requests ? `<tr><td style="padding:8px 0;color:#666;vertical-align:top">Notes</td><td style="padding:8px 0">${order.special_requests}</td></tr>` : ''}
        </table>
        <h4 style="margin:0 0 12px;color:#333">Order Items</h4>
        <table style="width:100%;border-collapse:collapse">${items}
          <tr><td style="padding:10px 0;font-weight:700;font-size:16px">Total</td><td style="padding:10px 0;font-weight:700;font-size:16px;text-align:right;color:#0EA5E9">KES ${Number(order.total_amount).toLocaleString()}</td></tr>
        </table>
        <div style="margin-top:24px;padding:16px;background:#f5f5f5;border-radius:6px;text-align:center">
          <a href="${process.env.NEXT_PUBLIC_SITE_URL || ''}/admin/dashboard/orders" style="color:#0EA5E9;font-weight:600;text-decoration:none">View in Admin Dashboard →</a>
        </div>
      </div>
    </div>`;
}

export function bookingEmailHtml(booking: {
  reference: string;
  service_name?: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  booking_date: string;
  booking_time?: string;
  guests: number;
  special_requests?: string;
  total_amount?: number;
}) {
  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;border:1px solid #ddd;border-radius:8px;overflow:hidden">
      <div style="background:#0A1525;padding:24px;text-align:center">
        <h2 style="color:#38BDF8;margin:0;font-size:20px">New Booking Received</h2>
        <p style="color:#aaa;margin:6px 0 0;font-size:13px">Ref: <strong style="color:#fff">${booking.reference}</strong></p>
      </div>
      <div style="padding:24px">
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:8px 0;color:#666;width:140px">Service</td><td style="padding:8px 0;font-weight:600">${booking.service_name || 'General Booking'}</td></tr>
          <tr><td style="padding:8px 0;color:#666">Customer</td><td style="padding:8px 0;font-weight:600">${booking.customer_name}</td></tr>
          <tr><td style="padding:8px 0;color:#666">Email</td><td style="padding:8px 0">${booking.customer_email}</td></tr>
          ${booking.customer_phone ? `<tr><td style="padding:8px 0;color:#666">Phone</td><td style="padding:8px 0">${booking.customer_phone}</td></tr>` : ''}
          <tr><td style="padding:8px 0;color:#666">Date</td><td style="padding:8px 0">${new Date(booking.booking_date).toLocaleDateString('en-KE', { dateStyle: 'full' })}</td></tr>
          ${booking.booking_time ? `<tr><td style="padding:8px 0;color:#666">Time</td><td style="padding:8px 0">${booking.booking_time}</td></tr>` : ''}
          <tr><td style="padding:8px 0;color:#666">Guests</td><td style="padding:8px 0">${booking.guests}</td></tr>
          ${booking.total_amount ? `<tr><td style="padding:8px 0;color:#666">Amount</td><td style="padding:8px 0;font-weight:600;color:#0EA5E9">KES ${Number(booking.total_amount).toLocaleString()}</td></tr>` : ''}
          ${booking.special_requests ? `<tr><td style="padding:8px 0;color:#666;vertical-align:top">Notes</td><td style="padding:8px 0">${booking.special_requests}</td></tr>` : ''}
        </table>
        <div style="margin-top:24px;padding:16px;background:#f5f5f5;border-radius:6px;text-align:center">
          <a href="${process.env.NEXT_PUBLIC_SITE_URL || ''}/admin/dashboard/bookings" style="color:#0EA5E9;font-weight:600;text-decoration:none">View in Admin Dashboard →</a>
        </div>
      </div>
    </div>`;
}

export function contactEmailHtml(msg: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}) {
  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;border:1px solid #ddd;border-radius:8px;overflow:hidden">
      <div style="background:#0A1525;padding:24px;text-align:center">
        <h2 style="color:#38BDF8;margin:0;font-size:20px">New Contact Message</h2>
        <p style="color:#aaa;margin:6px 0 0;font-size:13px">Via the website contact form</p>
      </div>
      <div style="padding:24px">
        <table style="width:100%;border-collapse:collapse;margin-bottom:20px">
          <tr><td style="padding:8px 0;color:#666;width:100px">From</td><td style="padding:8px 0;font-weight:600">${msg.name}</td></tr>
          <tr><td style="padding:8px 0;color:#666">Email</td><td style="padding:8px 0"><a href="mailto:${msg.email}" style="color:#0EA5E9">${msg.email}</a></td></tr>
          ${msg.phone ? `<tr><td style="padding:8px 0;color:#666">Phone</td><td style="padding:8px 0">${msg.phone}</td></tr>` : ''}
          <tr><td style="padding:8px 0;color:#666">Subject</td><td style="padding:8px 0">${msg.subject}</td></tr>
        </table>
        <div style="background:#f9f9f9;border-left:4px solid #38BDF8;padding:16px;border-radius:4px;white-space:pre-wrap;font-size:14px;color:#333">${msg.message}</div>
        <div style="margin-top:24px;padding:16px;background:#f5f5f5;border-radius:6px;text-align:center">
          <a href="${process.env.NEXT_PUBLIC_SITE_URL || ''}/admin/dashboard/messages" style="color:#0EA5E9;font-weight:600;text-decoration:none">View in Admin Dashboard →</a>
        </div>
      </div>
    </div>`;
}
