'use client';

import { useEffect, useState } from 'react';
import { Mail, MailOpen, Phone, Clock } from 'lucide-react';

interface Message {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

const SUBJECT_LABELS: Record<string, string> = {
  general: 'General Enquiry',
  reservation: 'Table Reservation',
  accommodation: 'Accommodation',
  events: 'Events & Weddings',
  golf: 'Golf Booking',
  conference: 'Conference Hall',
  other: 'Other',
};

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Message | null>(null);

  useEffect(() => {
    fetch('/api/contact')
      .then(r => r.json())
      .then(setMessages)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const markRead = async (msg: Message) => {
    setSelected(msg);
    if (!msg.is_read) {
      await fetch('/api/contact', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: msg.id }),
      }).catch(() => {});
      setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, is_read: true } : m));
      setSelected({ ...msg, is_read: true });
    }
  };

  const unread = messages.filter(m => !m.is_read).length;

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <h1 className="font-display" style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            Messages
          </h1>
          {unread > 0 && (
            <span style={{ background: 'rgba(var(--gold-rgb),0.15)', border: '1px solid rgba(var(--gold-rgb),0.4)', color: 'var(--gold)', borderRadius: '9999px', padding: '0.2rem 0.75rem', fontSize: '0.8rem', fontWeight: 600 }}>
              {unread} unread
            </span>
          )}
        </div>
        <p style={{ color: 'rgba(240,235,225,0.40)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
          Messages sent via the website contact form
        </p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[1,2,3].map(i => <div key={i} className="card shimmer" style={{ height: '80px' }} />)}
        </div>
      ) : messages.length === 0 ? (
        <div className="card" style={{ padding: '4rem', textAlign: 'center', color: 'rgba(240,235,225,0.30)' }}>
          <Mail size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
          <p>No messages yet</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
          {messages.map(msg => (
            <div
              key={msg.id}
              onClick={() => markRead(msg)}
              className="card"
              style={{
                padding: '1.25rem 1.5rem',
                cursor: 'pointer',
                borderColor: !msg.is_read ? 'rgba(var(--gold-rgb),0.35)' : undefined,
                background: !msg.is_read ? 'rgba(var(--gold-rgb),0.04)' : undefined,
                transition: 'border-color 0.2s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ paddingTop: '2px' }}>
                  {msg.is_read
                    ? <MailOpen size={18} style={{ color: 'rgba(240,235,225,0.30)' }} />
                    : <Mail size={18} style={{ color: 'var(--gold)' }} />
                  }
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: msg.is_read ? 500 : 700, color: 'var(--text-primary)', fontSize: '0.9375rem' }}>{msg.name}</span>
                    <span style={{ fontSize: '0.75rem', color: 'rgba(var(--gold-rgb),0.75)', background: 'rgba(var(--gold-rgb),0.10)', borderRadius: '9999px', padding: '0.1rem 0.6rem' }}>
                      {SUBJECT_LABELS[msg.subject] || msg.subject}
                    </span>
                  </div>
                  <p style={{ color: 'rgba(240,235,225,0.55)', fontSize: '0.8125rem', margin: '0 0 0.25rem', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                    {msg.message}
                  </p>
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.75rem', color: 'rgba(240,235,225,0.35)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={11} /> {new Date(msg.created_at).toLocaleString('en-KE', { dateStyle: 'medium', timeStyle: 'short' })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Message detail modal */}
      {selected && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
          onClick={() => setSelected(null)}
        >
          <div
            className="card"
            style={{ maxWidth: '600px', width: '100%', padding: '2rem', maxHeight: '85vh', overflowY: 'auto', borderRadius: '1.25rem' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3 className="font-display" style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '1.2rem', margin: 0 }}>
                {SUBJECT_LABELS[selected.subject] || selected.subject}
              </h3>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: 'rgba(240,235,225,0.40)', cursor: 'pointer', fontSize: '1.25rem' }}>✕</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <Mail size={14} style={{ color: 'var(--gold)', flexShrink: 0 }} />
                <div>
                  <p style={{ color: 'var(--text-primary)', fontWeight: 600, margin: 0 }}>{selected.name}</p>
                  <a href={`mailto:${selected.email}`} style={{ color: 'var(--gold)', fontSize: '0.875rem', textDecoration: 'none' }}>{selected.email}</a>
                </div>
              </div>
              {selected.phone && (
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <Phone size={14} style={{ color: 'var(--gold)', flexShrink: 0 }} />
                  <a href={`tel:${selected.phone}`} style={{ color: 'rgba(240,235,225,0.65)', fontSize: '0.875rem', textDecoration: 'none' }}>{selected.phone}</a>
                </div>
              )}
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <Clock size={14} style={{ color: 'rgba(240,235,225,0.35)', flexShrink: 0 }} />
                <span style={{ color: 'rgba(240,235,225,0.45)', fontSize: '0.8125rem' }}>
                  {new Date(selected.created_at).toLocaleString('en-KE', { dateStyle: 'full', timeStyle: 'short' })}
                </span>
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '0.75rem', padding: '1.25rem', borderLeft: '3px solid var(--gold)' }}>
              <p style={{ color: 'rgba(240,235,225,0.80)', fontSize: '0.9375rem', lineHeight: 1.7, margin: 0, whiteSpace: 'pre-wrap' }}>
                {selected.message}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
              <a
                href={`mailto:${selected.email}?subject=Re: ${SUBJECT_LABELS[selected.subject] || selected.subject}`}
                className="btn-gold"
                style={{ padding: '0.75rem 1.5rem', borderRadius: '9999px', fontSize: '0.8rem' }}
              >
                Reply via Email
              </a>
              {selected.phone && (
                <a
                  href={`tel:${selected.phone}`}
                  className="btn-outline"
                  style={{ padding: '0.75rem 1.5rem', borderRadius: '9999px', fontSize: '0.8rem' }}
                >
                  Call Customer
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
