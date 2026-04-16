'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { Upload, Copy, Film, Image as ImageIcon, Trash2, X } from 'lucide-react';

interface MediaItem {
  id: number;
  filename: string;
  url: string;
  type: string;
  category: string;
  alt_text: string;
  created_at: string;
}

export default function MediaPage() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadType, setUploadType] = useState<'image' | 'video'>('image');
  const [category, setCategory] = useState('general');
  const [altText, setAltText] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/api/media').then(r => r.json()).then(setMedia).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleUpload = async (file: File) => {
    if (!file) return;
    const maxSize = uploadType === 'video' ? 100 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error(`File too large. Max ${uploadType === 'video' ? '100MB' : '10MB'}`);
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', uploadType);
    formData.append('category', category);
    formData.append('alt_text', altText);

    try {
      const res = await fetch('/api/media/upload', { method: 'POST', body: formData });
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      setMedia(prev => [data.media, ...prev]);
      toast.success('File uploaded successfully!');
      setAltText('');
    } catch {
      toast.error('Upload failed. Please check your Cloudinary configuration.');
    } finally {
      setUploading(false);
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('URL copied!');
  };

  const images = media.filter(m => m.type === 'image');
  const videos = media.filter(m => m.type === 'video');

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-[var(--font-playfair)] text-3xl font-bold text-white mb-1">Media Library</h1>
        <p className="text-white/40 text-sm">Upload and manage photos, videos and files</p>
      </div>

      {/* Upload Card */}
      <div className="glass-card rounded-2xl p-8 mb-8">
        <h3 className="text-white font-semibold mb-5">Upload Files</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
          <div>
            <label className="text-white/60 text-xs mb-1.5 block">File Type</label>
            <div className="flex gap-2">
              <button
                onClick={() => setUploadType('image')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm border transition-all ${uploadType === 'image' ? 'border-[#C9A84C]/50 bg-[#C9A84C]/10 text-[#C9A84C]' : 'border-white/10 text-white/50'}`}
              >
                <ImageIcon size={16} /> Image
              </button>
              <button
                onClick={() => setUploadType('video')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm border transition-all ${uploadType === 'video' ? 'border-[#C9A84C]/50 bg-[#C9A84C]/10 text-[#C9A84C]' : 'border-white/10 text-white/50'}`}
              >
                <Film size={16} /> Video
              </button>
            </div>
          </div>
          <div>
            <label className="text-white/60 text-xs mb-1.5 block">Category</label>
            <select value={category} onChange={e => setCategory(e.target.value)}
              className="w-full bg-[#252525] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#C9A84C]/50">
              <option value="general">General</option>
              <option value="hero">Hero/Background</option>
              <option value="services">Services</option>
              <option value="gallery">Gallery</option>
              <option value="menu">Menu</option>
              <option value="events">Events</option>
              <option value="logo">Logo</option>
            </select>
          </div>
          <div>
            <label className="text-white/60 text-xs mb-1.5 block">Alt Text / Description</label>
            <input value={altText} onChange={e => setAltText(e.target.value)}
              className="w-full bg-[#252525] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#C9A84C]/50 placeholder-white/20"
              placeholder="Describe this media..." />
          </div>
        </div>

        {/* Drop zone */}
        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={e => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleUpload(f); }}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${
            dragOver ? 'border-[#C9A84C] bg-[#C9A84C]/5' : 'border-white/10 hover:border-[#C9A84C]/40 hover:bg-white/2'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={uploadType === 'video' ? 'video/*' : 'image/*'}
            className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) handleUpload(f); }}
          />
          {uploading ? (
            <div className="text-[#C9A84C] animate-pulse">
              <Upload size={32} className="mx-auto mb-3" />
              <p className="text-sm">Uploading...</p>
            </div>
          ) : (
            <div className="text-white/40">
              <Upload size={32} className="mx-auto mb-3" />
              <p className="text-sm">Drag & drop or <span className="text-[#C9A84C]">browse</span></p>
              <p className="text-xs mt-1">
                {uploadType === 'video' ? 'MP4, MOV up to 100MB' : 'JPG, PNG, WebP up to 10MB'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Videos Section */}
      {videos.length > 0 && (
        <div className="mb-8">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Film size={18} className="text-[#C9A84C]" /> Videos ({videos.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {videos.map(v => (
              <div key={v.id} className="glass-card rounded-xl overflow-hidden">
                <video src={v.url} controls className="w-full aspect-video" />
                <div className="p-4">
                  <p className="text-white text-sm truncate">{v.filename}</p>
                  <p className="text-white/40 text-xs capitalize mb-3">{v.category}</p>
                  <div className="flex gap-2">
                    <button onClick={() => copyUrl(v.url)} className="flex-1 flex items-center justify-center gap-1 border border-white/20 rounded-lg py-1.5 text-xs text-white/60 hover:border-[#C9A84C]/40">
                      <Copy size={12} /> Copy URL
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Images Section */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[1,2,3,4,5,6].map(i => <div key={i} className="aspect-square glass-card rounded-xl shimmer" />)}
        </div>
      ) : images.length > 0 && (
        <div>
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <ImageIcon size={18} className="text-[#C9A84C]" /> Images ({images.length})
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {images.map(img => (
              <div key={img.id} className="group relative">
                <div className="aspect-square rounded-xl overflow-hidden glass-card">
                  <Image src={img.url} alt={img.alt_text || img.filename} fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <button onClick={() => copyUrl(img.url)} className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white">
                      <Copy size={14} />
                    </button>
                  </div>
                </div>
                <p className="text-white/40 text-xs mt-1 truncate">{img.filename}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && media.length === 0 && (
        <div className="text-center py-20 text-white/30">
          <ImageIcon size={48} className="mx-auto mb-4 opacity-30" />
          <p>No media uploaded yet</p>
        </div>
      )}
    </div>
  );
}
