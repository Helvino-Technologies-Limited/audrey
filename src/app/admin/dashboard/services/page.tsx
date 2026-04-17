'use client';

import { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Edit2, X, Upload, ImageIcon, LayoutGrid, Monitor, Eye } from 'lucide-react';
import FileUpload from '@/components/admin/FileUpload';

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

const APPEARANCE_LABELS: Record<string, string[]> = {
  accommodation: ['Homepage Services Carousel', 'Services Page → Accommodation card', 'Accommodation detail page hero'],
  restaurant: ['Homepage Services Carousel', 'Services Page → Fine Dining card', 'Fine Dining detail page hero'],
  golf: ['Homepage Services Carousel', 'Services Page → Golf Course card', 'Golf Course detail page hero'],
  'swimming-pool': ['Homepage Services Carousel', 'Services Page → Swimming Pool card', 'Pool detail page hero'],
  conference: ['Homepage Services Carousel', 'Services Page → Conference Hall card', 'Conference detail page hero'],
  'bar-entertainment': ['Homepage Services Carousel', 'Services Page → Bar & Entertainment card', 'Bar detail page hero'],
  events: ['Homepage Services Carousel', 'Services Page → Events card', 'Events detail page hero'],
};

export default function ServicesAdminPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [featuresText, setFeaturesText] = useState('');
  const [serviceImageUrl, setServiceImageUrl] = useState('');

  // Quick photo upload state
  const [selectedServiceId, setSelectedServiceId] = useState<number | ''>('');
  const [uploadImageUrl, setUploadImageUrl] = useState('');
  const [savingPhoto, setSavingPhoto] = useState(false);

  const { register, handleSubmit, reset, setValue } = useForm<Omit<Service, 'id'>>();

  useEffect(() => {
    fetch('/api/services')
      .then(r => r.json())
      .then((data: Service[]) => {
        setServices(data);
        if (data.length > 0) setSelectedServiceId(data[0].id);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const selectedService = services.find(s => s.id === Number(selectedServiceId));

  const savePhoto = async () => {
    if (!selectedServiceId || !uploadImageUrl) {
      toast.error('Please select a service and upload a photo');
      return;
    }
    setSavingPhoto(true);
    try {
      const res = await fetch(`/api/services/${selectedServiceId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_url: uploadImageUrl }),
      });
      const updated = await res.json();
      setServices(prev => prev.map(s => s.id === Number(selectedServiceId) ? { ...s, image_url: uploadImageUrl } : s));
      toast.success(`Photo saved for ${selectedService?.title}`);
      setUploadImageUrl('');
    } catch {
      toast.error('Failed to save photo');
    } finally {
      setSavingPhoto(false);
    }
  };

  const openEdit = (service: Service) => {
    setEditingService(service);
    setValue('title', service.title);
    setValue('short_description', service.short_description);
    setValue('full_description', service.full_description);
    setValue('price_from', service.price_from);
    setValue('price_info', service.price_info);
    setValue('image_url', service.image_url || '');
    setServiceImageUrl(service.image_url || '');
    setValue('icon', service.icon);
    setValue('is_active', service.is_active);
    setValue('display_order', service.display_order);
    setFeaturesText(service.features?.join('\n') || '');
  };

  const closeEdit = () => { setEditingService(null); reset(); setFeaturesText(''); setServiceImageUrl(''); };

  const onSave = async (data: Omit<Service, 'id'>) => {
    if (!editingService) return;
    try {
      const features = featuresText.split('\n').filter(f => f.trim());
      const res = await fetch(`/api/services/${editingService.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, features, image_url: serviceImageUrl }),
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

  const appearances = selectedService ? (APPEARANCE_LABELS[selectedService.slug] || [`Homepage Services Carousel`, `Services Page → ${selectedService.title} card`]) : [];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-white mb-1">Services</h1>
        <p className="text-white/40 text-sm">Upload service photos and manage content</p>
      </div>

      {/* ── Quick Photo Upload ── */}
      <div className="glass-card rounded-2xl p-8 mb-8 border border-[#C9A84C]/20">
        <div className="flex items-center gap-2 mb-2">
          <Upload size={18} className="text-[#C9A84C]" />
          <h2 className="text-white font-bold text-lg">Upload Service Photo</h2>
        </div>
        <p className="text-white/40 text-sm mb-6">Choose which service this photo belongs to — it will automatically appear on the public site.</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Dropdown + Upload */}
          <div className="space-y-5">
            {/* Service selector */}
            <div>
              <label className="text-white/60 text-xs mb-2 block flex items-center gap-1.5">
                <LayoutGrid size={12} /> Where should this photo appear?
              </label>
              <select
                value={selectedServiceId}
                onChange={e => { setSelectedServiceId(Number(e.target.value)); setUploadImageUrl(''); }}
                className="w-full bg-[#252525] border border-[#C9A84C]/30 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C9A84C]/60"
              >
                {services.map(s => (
                  <option key={s.id} value={s.id}>{s.title}</option>
                ))}
              </select>
            </div>

            {/* Appearance info */}
            {selectedService && (
              <div className="bg-[#C9A84C]/5 border border-[#C9A84C]/20 rounded-xl p-4">
                <p className="text-[#C9A84C] text-xs font-semibold uppercase tracking-wide mb-2 flex items-center gap-1.5">
                  <Eye size={12} /> This photo will appear in:
                </p>
                <ul className="space-y-1.5">
                  {appearances.map((place, i) => (
                    <li key={i} className="flex items-center gap-2 text-white/70 text-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] shrink-0" />
                      {place}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* File upload */}
            <FileUpload
              label="Upload Photo"
              mediaType="image"
              category="services"
              currentUrl={uploadImageUrl || null}
              onUpload={setUploadImageUrl}
            />

            <button
              onClick={savePhoto}
              disabled={!uploadImageUrl || !selectedServiceId || savingPhoto}
              className="w-full btn-gold py-3 rounded-xl text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {savingPhoto ? 'Saving...' : `Save Photo for ${selectedService?.title || 'Service'}`}
            </button>
          </div>

          {/* Right: Preview of selected service */}
          <div>
            <p className="text-white/40 text-xs uppercase tracking-wide mb-3 flex items-center gap-1.5">
              <Monitor size={12} /> Preview — how it looks on the homepage carousel
            </p>
            {selectedService && (
              <div className="glass-card rounded-2xl overflow-hidden">
                {/* Simulated carousel card */}
                <div className="relative h-40 bg-gradient-to-br from-[#1a0f00] to-[#0D0D0D] overflow-hidden">
                  {(uploadImageUrl || selectedService.image_url) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={uploadImageUrl || selectedService.image_url!}
                      alt={selectedService.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center">
                        <ImageIcon size={32} className="text-[#C9A84C]/30 mx-auto mb-2" />
                        <p className="text-white/20 text-xs">No photo yet</p>
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-transparent to-transparent" />
                  {uploadImageUrl && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                      New photo
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-white font-semibold text-sm">{selectedService.title}</p>
                  <p className="text-white/50 text-xs mt-1 line-clamp-2">{selectedService.short_description}</p>
                  <p className="text-[#C9A84C] text-xs font-semibold mt-2">{selectedService.price_info}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── All Services ── */}
      <div className="mb-6">
        <h2 className="text-white font-semibold text-base mb-1">All Services</h2>
        <p className="text-white/30 text-xs">Click Edit to update descriptions, features and other details.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="h-32 glass-card rounded-xl shimmer" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.map(service => (
            <div key={service.id} className="glass-card rounded-2xl overflow-hidden flex">
              {/* Thumbnail */}
              <div className="w-24 h-24 shrink-0 relative bg-gradient-to-br from-[#1a0f00] to-[#252525] self-stretch flex items-center justify-center">
                {service.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={service.image_url} alt={service.title} className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon size={24} className="text-[#C9A84C]/20" />
                )}
                {!service.image_url && (
                  <button
                    onClick={() => { setSelectedServiceId(service.id); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/60 opacity-0 hover:opacity-100 transition-opacity text-white"
                  >
                    <Upload size={16} className="text-[#C9A84C]" />
                    <span className="text-[10px] text-[#C9A84C] font-semibold">Add Photo</span>
                  </button>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 p-4 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-white font-semibold text-sm truncate">{service.title}</p>
                  <span className={`shrink-0 px-2 py-0.5 rounded-full text-xs ${service.is_active ? 'text-green-400 bg-green-400/10' : 'text-white/30 bg-white/5'}`}>
                    {service.is_active ? 'Active' : 'Hidden'}
                  </span>
                  {!service.image_url && (
                    <span className="shrink-0 px-2 py-0.5 rounded-full text-xs text-yellow-400 bg-yellow-400/10">No photo</span>
                  )}
                </div>
                <p className="text-white/40 text-xs truncate mb-3">{service.short_description}</p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { setSelectedServiceId(service.id); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="flex items-center gap-1 text-[#C9A84C] text-xs border border-[#C9A84C]/30 px-2.5 py-1.5 rounded-lg hover:bg-[#C9A84C]/10 transition-colors"
                  >
                    <Upload size={11} /> Upload Photo
                  </button>
                  <button onClick={() => openEdit(service)} className="flex items-center gap-1 btn-gold px-2.5 py-1.5 rounded-lg text-xs">
                    <Edit2 size={11} /> Edit Details
                  </button>
                  <button onClick={() => toggleActive(service)} className={`px-2.5 py-1.5 rounded-lg text-xs border transition-all ${service.is_active ? 'border-white/10 text-white/30 hover:text-red-400' : 'border-green-400/30 text-green-400'}`}>
                    {service.is_active ? 'Hide' : 'Show'}
                  </button>
                </div>
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
                <h3 className="font-display text-xl font-bold text-white">Edit: {editingService.title}</h3>
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
                  <input {...register('image_url')} type="hidden" />
                  <FileUpload
                    label="Service Photo"
                    mediaType="image"
                    category="services"
                    currentUrl={serviceImageUrl || null}
                    onUpload={url => { setServiceImageUrl(url); setValue('image_url', url); }}
                  />
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
