'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import FileUpload from '@/components/admin/FileUpload';

interface Event {
  id: number;
  title: string;
  description: string;
  event_date: string | null;
  event_time: string | null;
  image_url: string | null;
  is_recurring: boolean;
  recurrence_pattern: string | null;
  is_active: boolean;
}

export default function EventsAdminPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [eventImageUrl, setEventImageUrl] = useState('');
  const { register, handleSubmit, reset, watch } = useForm<Omit<Event, 'id' | 'is_active'>>();
  const isRecurring = watch('is_recurring');

  useEffect(() => {
    fetch('/api/events').then(r => r.json()).then(setEvents).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const onAdd = async (data: Omit<Event, 'id' | 'is_active'>) => {
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, image_url: eventImageUrl || null }),
      });
      const event = await res.json();
      setEvents(prev => [...prev, event]);
      toast.success('Event added');
      reset();
      setEventImageUrl('');
      setShowAdd(false);
    } catch { toast.error('Failed'); }
  };

  const toggleActive = async (event: Event) => {
    try {
      await fetch(`/api/events/${event.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !event.is_active }),
      });
      setEvents(prev => prev.map(e => e.id === event.id ? { ...e, is_active: !e.is_active } : e));
    } catch { toast.error('Failed'); }
  };

  const deleteEvent = async (id: number) => {
    if (!confirm('Delete this event?')) return;
    try {
      await fetch(`/api/events/${id}`, { method: 'DELETE' });
      setEvents(prev => prev.filter(e => e.id !== id));
      toast.success('Deleted');
    } catch { toast.error('Failed'); }
  };

  const EventForm = ({ onSubmit, defaultValues }: { onSubmit: (d: Omit<Event, 'id' | 'is_active'>) => void; defaultValues?: Partial<Event> }) => (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="text-white/60 text-xs mb-1.5 block">Event Title *</label>
        <input {...register('title', { required: true })} defaultValue={defaultValues?.title} className="w-full bg-[#252525] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C9A84C]/50" />
      </div>
      <div>
        <label className="text-white/60 text-xs mb-1.5 block">Description</label>
        <textarea {...register('description')} defaultValue={defaultValues?.description} rows={3} className="w-full bg-[#252525] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C9A84C]/50 resize-none" />
      </div>
      <div className="flex gap-4">
        <label className="flex items-center gap-2 text-white/70 text-sm cursor-pointer">
          <input {...register('is_recurring')} type="checkbox" defaultChecked={defaultValues?.is_recurring} className="accent-[#C9A84C]" />
          Recurring Event
        </label>
      </div>
      {isRecurring ? (
        <div>
          <label className="text-white/60 text-xs mb-1.5 block">Recurrence Pattern</label>
          <input {...register('recurrence_pattern')} defaultValue={defaultValues?.recurrence_pattern || ''} className="w-full bg-[#252525] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C9A84C]/50" placeholder="Every Friday & Saturday" />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-white/60 text-xs mb-1.5 block">Date</label>
            <input {...register('event_date')} type="date" defaultValue={defaultValues?.event_date || ''} className="w-full bg-[#252525] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C9A84C]/50" />
          </div>
          <div>
            <label className="text-white/60 text-xs mb-1.5 block">Time</label>
            <input {...register('event_time')} type="time" defaultValue={defaultValues?.event_time || ''} className="w-full bg-[#252525] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C9A84C]/50" />
          </div>
        </div>
      )}
      <div>
        <input {...register('image_url')} type="hidden" />
        <FileUpload
          label="Event Image"
          mediaType="image"
          category="events"
          currentUrl={eventImageUrl || defaultValues?.image_url || null}
          onUpload={url => setEventImageUrl(url)}
        />
      </div>
      <div className="flex gap-3 pt-2">
        <button type="submit" className="btn-gold flex-1 py-3 rounded-xl text-sm font-semibold">Save Event</button>
        <button type="button" onClick={() => { setShowAdd(false); setEditingEvent(null); reset(); setEventImageUrl(''); }} className="border border-white/20 px-5 py-3 rounded-xl text-white/60 text-sm">Cancel</button>
      </div>
    </form>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-white mb-1">Events</h1>
          <p className="text-white/40 text-sm">Manage events and activities</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="btn-gold px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2">
          <Plus size={16} /> Add Event
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-24 glass-card rounded-xl shimmer" />)}</div>
      ) : events.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center text-white/30">No events yet</div>
      ) : (
        <div className="space-y-4">
          {events.map(event => (
            <div key={event.id} className={`glass-card rounded-2xl p-6 flex items-start justify-between gap-4 ${!event.is_active ? 'opacity-60' : ''}`}>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-white font-semibold">{event.title}</h3>
                  {event.is_recurring && <span className="text-[#C9A84C] text-xs bg-[#C9A84C]/10 px-2 py-0.5 rounded-full">{event.recurrence_pattern || 'Recurring'}</span>}
                  {event.event_date && <span className="text-white/40 text-xs">{new Date(event.event_date).toLocaleDateString()}</span>}
                </div>
                {event.description && <p className="text-white/50 text-sm line-clamp-2">{event.description}</p>}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => toggleActive(event)} className={`px-3 py-1.5 rounded-xl text-xs border transition-all ${event.is_active ? 'border-white/20 text-white/40 hover:border-red-400/40' : 'border-green-400/30 text-green-400 hover:bg-green-400/10'}`}>
                  {event.is_active ? 'Hide' : 'Show'}
                </button>
                <button onClick={() => deleteEvent(event.id)} className="text-white/30 hover:text-red-400 p-1">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {(showAdd || editingEvent) && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#1A1A1A] border border-[#C9A84C]/20 rounded-2xl w-full max-w-md p-8 my-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-bold text-lg">{editingEvent ? 'Edit Event' : 'Add Event'}</h3>
              <button onClick={() => { setShowAdd(false); setEditingEvent(null); reset(); setEventImageUrl(''); }} className="text-white/40 hover:text-white"><X size={20} /></button>
            </div>
            <EventForm onSubmit={onAdd} defaultValues={editingEvent || undefined} />
          </div>
        </div>
      )}
    </div>
  );
}
