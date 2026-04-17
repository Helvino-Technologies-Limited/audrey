'use client';

import { useRef, useState } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';

interface FileUploadProps {
  onUpload: (url: string) => void;
  currentUrl?: string | null;
  accept?: string;
  label?: string;
  mediaType?: 'image' | 'video';
  category?: string;
}

export default function FileUpload({
  onUpload,
  currentUrl,
  accept,
  label,
  mediaType = 'image',
  category = 'general',
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentUrl || null);
  const [error, setError] = useState<string | null>(null);

  const acceptAttr = accept || (mediaType === 'video' ? 'video/*' : 'image/*');

  const handleFile = async (file: File) => {
    setError(null);
    setUploading(true);

    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);

    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('type', mediaType);
      fd.append('category', category);

      const res = await fetch('/api/media/upload', { method: 'POST', body: fd });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Upload failed');
        setPreview(currentUrl || null);
        return;
      }

      onUpload(data.url);
      setPreview(data.url);
    } catch {
      setError('Upload failed');
      setPreview(currentUrl || null);
    } finally {
      setUploading(false);
      URL.revokeObjectURL(localPreview);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const clear = () => {
    setPreview(null);
    onUpload('');
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="space-y-2">
      {label && <label className="text-white/60 text-xs mb-1.5 block">{label}</label>}

      {preview ? (
        <div className="relative inline-block">
          {mediaType === 'video' ? (
            <video src={preview} className="max-h-40 rounded-xl border border-white/10 object-cover" controls />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="Preview" className="max-h-40 rounded-xl border border-white/10 object-cover" />
          )}
          <button
            type="button"
            onClick={clear}
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
          >
            <X size={12} />
          </button>
          {uploading && (
            <div className="absolute inset-0 rounded-xl bg-black/60 flex items-center justify-center">
              <Loader2 size={24} className="text-[#C9A84C] animate-spin" />
            </div>
          )}
        </div>
      ) : (
        <div
          onClick={() => !uploading && inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
          className={`flex flex-col items-center justify-center gap-2 w-full h-32 rounded-xl border-2 border-dashed border-white/15 hover:border-[#C9A84C]/50 transition-colors cursor-pointer bg-[#252525] ${uploading ? 'opacity-60 cursor-not-allowed' : ''}`}
        >
          {uploading ? (
            <Loader2 size={24} className="text-[#C9A84C] animate-spin" />
          ) : (
            <>
              <Upload size={22} className="text-white/30" />
              <span className="text-white/40 text-xs">
                Click or drag to upload {mediaType === 'video' ? 'video' : 'image'}
              </span>
              <span className="text-white/20 text-xs">
                {mediaType === 'video' ? 'Max 50MB' : 'Max 5MB'}
              </span>
            </>
          )}
        </div>
      )}

      {!preview && !uploading && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex items-center gap-2 text-[#C9A84C] text-xs border border-[#C9A84C]/30 px-3 py-1.5 rounded-lg hover:bg-[#C9A84C]/10 transition-colors"
        >
          <Upload size={12} /> Choose file
        </button>
      )}

      {error && <p className="text-red-400 text-xs">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept={acceptAttr}
        onChange={handleChange}
        className="hidden"
      />
    </div>
  );
}
