'use client';

import { useRef, useState } from 'react';
import { Upload, X, Loader2, CheckCircle2 } from 'lucide-react';

interface FileUploadProps {
  onUpload: (url: string) => void;
  currentUrl?: string | null;
  accept?: string;
  label?: string;
  mediaType?: 'image' | 'video';
  category?: string;
}

const CHUNK_SIZE = 3 * 1024 * 1024; // 3 MB per chunk — safely under Vercel's 4.5 MB limit

function randomId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
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
  const [progress, setProgress] = useState<{ current: number; total: number } | null>(null);
  const [preview, setPreview] = useState<string | null>(currentUrl || null);
  const [error, setError] = useState<string | null>(null);

  const acceptAttr = accept || (mediaType === 'video' ? 'video/*' : 'image/*');

  // ── Image upload (single request, base64) ──────────────────────────────────
  async function uploadImage(file: File) {
    const MAX = 3.5 * 1024 * 1024;
    if (file.size > MAX) {
      setError(`Image too large. Max ${MAX / 1024 / 1024} MB.`);
      return;
    }
    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);

    const fd = new FormData();
    fd.append('file', file);
    fd.append('type', 'image');
    fd.append('category', category);

    const res  = await fetch('/api/media/upload', { method: 'POST', body: fd });
    const data = await res.json();
    URL.revokeObjectURL(localPreview);

    if (!res.ok) throw new Error(data.error || 'Upload failed');
    onUpload(data.url);
    setPreview(data.url);
  }

  // ── Video upload (chunked) ─────────────────────────────────────────────────
  async function uploadVideo(file: File) {
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
    const uploadId    = randomId();
    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);
    setProgress({ current: 0, total: totalChunks });

    let streamUrl = '';

    for (let i = 0; i < totalChunks; i++) {
      const start = i * CHUNK_SIZE;
      const end   = Math.min(start + CHUNK_SIZE, file.size);
      const chunk = file.slice(start, end);

      const fd = new FormData();
      fd.append('chunk', chunk, file.name);
      fd.append('uploadId', uploadId);
      fd.append('chunkIndex', String(i));
      fd.append('totalChunks', String(totalChunks));
      fd.append('filename', file.name);
      fd.append('mimeType', file.type || 'video/mp4');
      fd.append('category', category);

      const res  = await fetch('/api/media/upload-chunk', { method: 'POST', body: fd });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || `Chunk ${i + 1} failed`);

      setProgress({ current: i + 1, total: totalChunks });

      if (data.status === 'complete') {
        streamUrl = data.streamUrl;
      }
    }

    URL.revokeObjectURL(localPreview);
    if (!streamUrl) throw new Error('Assembly failed');
    onUpload(streamUrl);
    setPreview(streamUrl);
  }

  // ── Main handler ───────────────────────────────────────────────────────────
  const handleFile = async (file: File) => {
    setError(null);
    setUploading(true);
    setProgress(null);
    try {
      if (mediaType === 'video') {
        await uploadVideo(file);
      } else {
        await uploadImage(file);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      setPreview(currentUrl || null);
    } finally {
      setUploading(false);
      setProgress(null);
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
    setError(null);
    onUpload('');
    if (inputRef.current) inputRef.current.value = '';
  };

  const pct = progress ? Math.round((progress.current / progress.total) * 100) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {label && <label style={{ color: 'rgba(240,235,225,0.55)', fontSize: '0.75rem' }}>{label}</label>}

      {/* Preview */}
      {preview && !uploading && (
        <div style={{ position: 'relative', display: 'inline-block' }}>
          {mediaType === 'video' ? (
            <video
              src={preview}
              controls
              style={{ maxHeight: '160px', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.10)', display: 'block' }}
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={preview}
              alt="Preview"
              style={{ maxHeight: '160px', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.10)', display: 'block', objectFit: 'cover' }}
            />
          )}
          <button
            type="button"
            onClick={clear}
            style={{
              position: 'absolute', top: '-8px', right: '-8px',
              width: '24px', height: '24px', borderRadius: '50%',
              background: '#ef4444', border: 'none', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <X size={12} />
          </button>
        </div>
      )}

      {/* Upload progress (video chunked) */}
      {uploading && progress && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ color: '#C9A84C', fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
              Uploading chunk {progress.current} / {progress.total}
            </span>
            <span style={{ color: '#C9A84C', fontSize: '0.8125rem', fontWeight: 600 }}>{pct}%</span>
          </div>
          {/* Progress bar */}
          <div style={{ height: '6px', borderRadius: '9999px', background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg,#C9A84C,#E8C96B)', borderRadius: '9999px', transition: 'width 0.3s ease' }} />
          </div>
          {progress.current === progress.total && (
            <span style={{ color: 'rgba(240,235,225,0.50)', fontSize: '0.75rem' }}>Assembling video…</span>
          )}
        </div>
      )}

      {/* Upload progress (image) */}
      {uploading && !progress && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#C9A84C', fontSize: '0.8125rem' }}>
          <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
          Uploading…
        </div>
      )}

      {/* Drop zone (shown when no preview and not uploading) */}
      {!preview && !uploading && (
        <div
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: '0.5rem', width: '100%', minHeight: '120px',
            borderRadius: '0.75rem', border: '2px dashed rgba(255,255,255,0.13)',
            background: '#1e1e1e', cursor: 'pointer', transition: 'border-color 0.2s',
            padding: '1.5rem',
          }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(201,168,76,0.45)')}
          onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.13)')}
        >
          <Upload size={22} style={{ color: 'rgba(240,235,225,0.30)' }} />
          <span style={{ color: 'rgba(240,235,225,0.40)', fontSize: '0.8125rem', textAlign: 'center' }}>
            Click or drag &amp; drop to upload {mediaType === 'video' ? 'video' : 'image'}
          </span>
          <span style={{ color: 'rgba(240,235,225,0.22)', fontSize: '0.75rem' }}>
            {mediaType === 'video' ? 'Any size — uploaded in chunks' : 'Max 3.5 MB'}
          </span>
        </div>
      )}

      {/* Success tick when preview exists and not uploading */}
      {preview && !uploading && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
          <CheckCircle2 size={14} style={{ color: '#4ade80' }} />
          <span style={{ color: 'rgba(240,235,225,0.45)', fontSize: '0.75rem' }}>
            Uploaded — click the × to remove
          </span>
        </div>
      )}

      {error && <p style={{ color: '#f87171', fontSize: '0.8125rem' }}>{error}</p>}

      <input ref={inputRef} type="file" accept={acceptAttr} onChange={handleChange} style={{ display: 'none' }} />

      {/* Spinner keyframe */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
