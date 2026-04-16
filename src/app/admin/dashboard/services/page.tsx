'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

interface Service {
  id: number;
  slug: string;
  title: string;
  short_description: string;
  full_description: string;
  features: string[];
  price_from: number | null;
  price_info: string;
  image_url: string | null;
  icon: string;
  is_active: boolean;
  display_order: number;
}

export default function ServicesAdminPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [featuresText, setFeaturesText] = useState('');

  const { register, handleSubmit, reset, setValue } = useForm<Omit<Service, 'id'>>();

  useEffect(() => {
    fetch('/api/services').then(r => r.json()).then(setServices).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const openEdit = (service: Service) => {
    setEditingService(service);
    setValue('title', service.title);
    setValue('short_description', service.short_description);
    setValue('full_description', service.full_description);
    setValue('price_from', service.price_from);
    setValue('price_info', service.price_info);
    setValue('image_url', service.image_url || '');
    setValue('icon', service.icon);
    setValue('is_active', service.is_active);
    setValue('display_order', service.display_order);
    setFeaturesText(service.features?.join('\n') || '');
  };

  const closeEdit = () => { setEditingService(null); reset(); setFeaturesText(''); };

  const onSave = async (data: Omit<Service, 'id'>) => {
    if (!editingService) return;
    try {
      const features = featuresText.split('\n').filter(f => f.trim());
      const res = await fetch(`/api/services/${editingService.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, features }),
      });
      const updated = await res.json();
      setServices(prev => prev.map(s => s.id === editingService.id ? updated : s));
      toast.success('Service updated');
      closeEdit();
    } catch {
      toast.error('Failed to update');
    }
  };

  const toggleActive = async (service: Service) => {
    try {
      await fetch(`/api/services/${service.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !service.is_active }),
      });
      setServices(prev => prev.map(s => s.id === service.id ? { ...s, is_active: !s.is_active } : s));
      toast.success(`Service ${!service.is_active ? 'activated' : 'deactivated'}`);
    } catch {
      toast.error('Failed to update');
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-[var(--font-playfair)] text-3xl font-bold text-white mb-1">Services</h1>
        <p className="text-white/40 text-sm">Manage and edit hotel services content</p>
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-20 glass-card rounded-xl shimmer" />)}</div>
      ) : (
        <div className="space-y-4">
          {services.map(service => (
            <div key={service.id} className="glass-card rounded-2xl p-6 flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-white font-semibold">{service.title}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${service.is_active ? 'text-green-400 bg-green-400/10' : 'text-white/30 bg-white/5'}`}>
                    {service.is_active ? 'Active' : 'Hidden'}
                  </span>
                </div>
                <p className="text-white/50 text-sm truncate">{service.short_description}</p>
                <p className="text-[#C9A84C] text-xs mt-1">{service.price_info}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => toggleActive(service)} className={`px-3 py-1.5 rounded-xl text-xs border transition-all ${service.is_active ? 'border-white/20 text-white/40 hover:border-red-400/40 hover:text-red-400' : 'border-green-400/30 text-green-400 hover:bg-green-400/10'}`}>
                  {service.is_active ? 'Hide' : 'Show'}
                </button>
                <button onClick={() => openEdit(service)} className="flex items-center gap-1.5 btn-gold px-3 py-1.5 rounded-xl text-xs">
                  <Edit2 size={12} /> Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingService && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#1A1A1A] border border-[#C9A84C]/20 rounded-2xl w-full max-w-2xl my-4">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-[var(--font-playfair)] text-xl font-bold text-white">Edit: {editingService.title}</h3>
                <button onClick={closeEdit} className="text-white/40 hover:text-white"><X size={20} /></button>
              </div>

              <form onSubmit={handleSubmit(onSave)} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-white/60 text-xs mb-1.5 block">Title</label>
                    <input {...register('title')} className="w-full bg-[#252525] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C9A84C]/50" />
                  </div>
                  <div>
                    <label className="text-white/60 text-xs mb-1.5 block">Price Info</label>
                    <input {...register('price_info')} className="w-full bg-[#252525] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C9A84C]/50" placeholder="From KES X/night" />
                  </div>
                </div>

                <div>
                  <label className="text-white/60 text-xs mb-1.5 block">Short Description</label>
                  <input {...register('short_description')} className="w-full bg-[#252525] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C9A84C]/50" />
                </div>

                <div>
                  <label className="text-white/60 text-xs mb-1.5 block">Full Description</label>
                  <textarea {...register('full_description')} rows={4} className="w-full bg-[#252525] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C9A84C]/50 resize-none" />
                </div>

                <div>
                  <label className="text-white/60 text-xs mb-1.5 block">Features (one per line)</label>
                  <textarea value={featuresText} onChange={e => setFeaturesText(e.target.value)} rows={5} className="w-full bg-[#252525] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C9A84C]/50 resize-none font-mono" placeholder="Feature 1&#10;Feature 2&#10;Feature 3" />
                </div>

                <div>
                  <label className="text-white/60 text-xs mb-1.5 block">Image URL</label>
                  <input {...register('image_url')} className="w-full bg-[#252525] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C9A84C]/50 placeholder-white/20" placeholder="https://..." />
                  <p className="text-white/30 text-xs mt-1">Paste a Cloudinary URL or upload via Media Library</p>
                </div>

                <div className="flex gap-4 pt-2">
                  <button type="submit" className="btn-gold px-6 py-3 rounded-xl text-sm font-semibold">Save Changes</button>
                  <button type="button" onClick={closeEdit} className="border border-white/20 px-6 py-3 rounded-xl text-white/60 text-sm hover:bg-white/5">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
