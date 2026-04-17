'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Plus, Trash2, X } from 'lucide-react';
import FileUpload from '@/components/admin/FileUpload';

interface GalleryItem {
  id: number;
  title: string;
  image_url: string;
  category: string;
  display_order: number;
  is_active: boolean;
}

export default function GalleryAdminPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');
  const { register, handleSubmit, reset } = useForm<Omit<GalleryItem, 'id' | 'is_active'>>();

  useEffect(() => {
    fetch('/api/gallery').then(r => r.json()).then(setItems).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const onAdd = async (data: Omit<GalleryItem, 'id' | 'is_active'>) => {
    if (!newImageUrl) { toast.error('Please upload an image'); return; }
    try {
      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, image_url: newImageUrl }),
      });
      const item = await res.json();
      setItems(prev => [item, ...prev]);
      toast.success('Gallery item added');
      reset();
      setNewImageUrl('');
      setShowAdd(false);
    } catch {
      toast.error('Failed to add item');
    }
  };

  const deleteItem = async (id: number) => {
    if (!confirm('Delete this gallery item?')) return;
    try {
      await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
      setItems(prev => prev.filter(i => i.id !== id));
      toast.success('Deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const toggleActive = async (item: GalleryItem) => {
    try {
      await fetch(`/api/gallery/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !item.is_active }),
      });
      setItems(prev => prev.map(i => i.id === item.id ? { ...i, is_active: !i.is_active } : i));
    } catch {
      toast.error('Failed to update');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-white mb-1">Gallery</h1>
          <p className="text-white/40 text-sm">Manage gallery photos</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="btn-gold px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2">
          <Plus size={16} /> Add Photo
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="aspect-square glass-card rounded-xl shimmer" />)}
        </div>
      ) : items.length === 0 ? (
        <div className="glass-card rounded-2xl p-16 text-center text-white/30">
          No gallery items yet. Add your first photo.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map(item => (
            <div key={item.id} className="group relative">
              <div className={`aspect-square rounded-xl overflow-hidden glass-card ${!item.is_active ? 'opacity-50' : ''}`}>
                <Image src={item.image_url} alt={item.title || ''} fill className="object-cover" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <button onClick={() => toggleActive(item)} className="px-3 py-1.5 rounded-lg bg-white/20 text-white text-xs">
                    {item.is_active ? 'Hide' : 'Show'}
                  </button>
                  <button onClick={() => deleteItem(item.id)} className="p-1.5 rounded-lg bg-red-400/30 text-red-400">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              {item.title && <p className="text-white/50 text-xs mt-1 truncate">{item.title}</p>}
              {item.category && <p className="text-[#C9A84C]/50 text-xs capitalize">{item.category}</p>}
            </div>
          ))}
        </div>
      )}

      {showAdd && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1A1A1A] border border-[#C9A84C]/20 rounded-2xl w-full max-w-md p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-bold text-lg">Add Gallery Photo</h3>
              <button onClick={() => { setShowAdd(false); reset(); setNewImageUrl(''); }} className="text-white/40 hover:text-white"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit(onAdd)} className="space-y-4">
              <div>
                <FileUpload
                  label="Photo *"
                  mediaType="image"
                  category="gallery"
                  currentUrl={newImageUrl || null}
                  onUpload={setNewImageUrl}
                />
              </div>
              <div>
                <label className="text-white/60 text-xs mb-1.5 block">Title / Caption</label>
                <input {...register('title')} className="w-full bg-[#252525] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C9A84C]/50" />
              </div>
              <div>
                <label className="text-white/60 text-xs mb-1.5 block">Category</label>
                <select {...register('category')} className="w-full bg-[#252525] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C9A84C]/50">
                  <option value="general">General</option>
                  <option value="accommodation">Accommodation</option>
                  <option value="restaurant">Restaurant</option>
                  <option value="golf">Golf</option>
                  <option value="pool">Pool</option>
                  <option value="events">Events</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn-gold flex-1 py-3 rounded-xl text-sm font-semibold">Add Photo</button>
                <button type="button" onClick={() => { setShowAdd(false); reset(); setNewImageUrl(''); }} className="border border-white/20 px-5 py-3 rounded-xl text-white/60 text-sm">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
