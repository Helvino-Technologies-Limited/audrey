'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Save, Lock, Globe, Phone, Video, Image as ImageIcon, Palette, ExternalLink } from 'lucide-react';
import FileUpload from '@/components/admin/FileUpload';

interface SiteSettings {
  site_name: string;
  site_tagline: string;
  contact_phone: string;
  contact_email: string;
  contact_address: string;
  mpesa_till: string;
  operating_hours: string;
  hero_video_url: string;
  logo_url: string;
  facebook_url: string;
  instagram_url: string;
  twitter_url: string;
  tiktok_url: string;
  primary_color: string;
  bg_color: string;
}

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const inputCls = 'w-full bg-[#252525] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C9A84C]/50 placeholder-white/25';

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const {
    register: regSettings,
    handleSubmit: handleSettingsSubmit,
    reset: resetSettings,
    setValue: setSettingsValue,
    watch: watchSettings,
  } = useForm<SiteSettings>({ defaultValues: { primary_color: '#C9A84C', bg_color: '#0D0D0D' } });

  const logoUrl       = watchSettings('logo_url');
  const primaryColor  = watchSettings('primary_color') || '#C9A84C';
  const bgColor       = watchSettings('bg_color') || '#0D0D0D';

  const { register: regPass, handleSubmit: handlePassSubmit, reset: resetPass, watch } = useForm<PasswordForm>();
  const newPassword = watch('newPassword');

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(data => { resetSettings({ primary_color: '#C9A84C', bg_color: '#0D0D0D', ...data }); setLoading(false); })
      .catch(() => setLoading(false));
  }, [resetSettings]);

  const onSaveSettings = async (data: SiteSettings) => {
    setSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Save failed');
      toast.success('Settings saved! Reload the public site to see theme changes.');
    } catch {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const onChangePassword = async (data: PasswordForm) => {
    if (data.newPassword !== data.confirmPassword) { toast.error('Passwords do not match'); return; }
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: data.currentPassword, newPassword: data.newPassword }),
      });
      if (!res.ok) { const err = await res.json(); throw new Error(err.error); }
      toast.success('Password changed successfully!');
      resetPass();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to change password');
    }
  };

  if (loading) return <div style={{ color: 'rgba(240,235,225,0.4)', padding: '2rem' }}>Loading settings…</div>;

  return (
    <div style={{ maxWidth: '720px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="font-display" style={{ fontSize: '1.75rem', fontWeight: 700, color: '#F0EBE1', marginBottom: '0.25rem' }}>Settings</h1>
        <p style={{ color: 'rgba(240,235,225,0.40)', fontSize: '0.875rem' }}>Manage site content, contact info, and account settings</p>
      </div>

      <form onSubmit={handleSettingsSubmit(onSaveSettings)} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3rem' }}>

        {/* ── General ── */}
        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#F0EBE1', fontWeight: 600, marginBottom: '1.25rem', fontSize: '0.9375rem' }}>
            <Globe size={16} style={{ color: '#C9A84C' }} /> General
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ color: 'rgba(240,235,225,0.55)', fontSize: '0.75rem', display: 'block', marginBottom: '0.375rem' }}>Site Name</label>
              <input {...regSettings('site_name')} className={inputCls} />
            </div>
            <div>
              <label style={{ color: 'rgba(240,235,225,0.55)', fontSize: '0.75rem', display: 'block', marginBottom: '0.375rem' }}>Tagline / Subtitle</label>
              <input {...regSettings('site_tagline')} className={inputCls} />
            </div>
          </div>
        </div>

        {/* ── Contact ── */}
        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#F0EBE1', fontWeight: 600, marginBottom: '1.25rem', fontSize: '0.9375rem' }}>
            <Phone size={16} style={{ color: '#C9A84C' }} /> Contact Information
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '1rem' }}>
            <div>
              <label style={{ color: 'rgba(240,235,225,0.55)', fontSize: '0.75rem', display: 'block', marginBottom: '0.375rem' }}>Phone Number</label>
              <input {...regSettings('contact_phone')} className={inputCls} />
            </div>
            <div>
              <label style={{ color: 'rgba(240,235,225,0.55)', fontSize: '0.75rem', display: 'block', marginBottom: '0.375rem' }}>Email</label>
              <input {...regSettings('contact_email')} type="email" className={inputCls} />
            </div>
            <div>
              <label style={{ color: 'rgba(240,235,225,0.55)', fontSize: '0.75rem', display: 'block', marginBottom: '0.375rem' }}>M-PESA Till</label>
              <input {...regSettings('mpesa_till')} className={inputCls} />
            </div>
            <div>
              <label style={{ color: 'rgba(240,235,225,0.55)', fontSize: '0.75rem', display: 'block', marginBottom: '0.375rem' }}>Operating Hours</label>
              <input {...regSettings('operating_hours')} className={inputCls} />
            </div>
            <div style={{ gridColumn: '1/-1' }}>
              <label style={{ color: 'rgba(240,235,225,0.55)', fontSize: '0.75rem', display: 'block', marginBottom: '0.375rem' }}>Address</label>
              <input {...regSettings('contact_address')} className={inputCls} />
            </div>
          </div>
        </div>

        {/* ── Media & Branding ── */}
        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#F0EBE1', fontWeight: 600, marginBottom: '1.25rem', fontSize: '0.9375rem' }}>
            <ImageIcon size={16} style={{ color: '#C9A84C' }} /> Media &amp; Branding
          </h3>

          {/* Logo */}
          <div style={{ marginBottom: '1.75rem' }}>
            <label style={{ color: 'rgba(240,235,225,0.55)', fontSize: '0.75rem', display: 'block', marginBottom: '0.5rem' }}>
              Logo Image <span style={{ color: 'rgba(240,235,225,0.30)' }}>— appears in navbar &amp; footer</span>
            </label>
            <input {...regSettings('logo_url')} type="hidden" />
            <FileUpload
              mediaType="image"
              category="branding"
              currentUrl={logoUrl}
              onUpload={url => setSettingsValue('logo_url', url)}
            />
          </div>

          {/* Hero video — URL input, not file upload */}
          <div>
            <label style={{ color: 'rgba(240,235,225,0.55)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Video size={12} style={{ color: '#C9A84C' }} />
              Hero Background Video URL
            </label>
            <input
              {...regSettings('hero_video_url')}
              className={inputCls}
              placeholder="https://example.com/video.mp4  or  https://youtube.com/watch?v=..."
            />
            <div style={{ marginTop: '0.625rem', padding: '0.875rem 1rem', background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.15)', borderRadius: '0.75rem' }}>
              <p style={{ color: '#C9A84C', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.375rem' }}>Why a URL instead of file upload?</p>
              <p style={{ color: 'rgba(240,235,225,0.50)', fontSize: '0.75rem', lineHeight: 1.6 }}>
                Video files are too large to upload directly (server limit). Instead, host your video on one of these free services and paste the link:
              </p>
              <ul style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                {[
                  { label: 'YouTube', hint: 'Upload → Share → Copy link', url: 'https://youtube.com' },
                  { label: 'Google Drive', hint: 'Upload → Get shareable link (set "Anyone with link can view")', url: 'https://drive.google.com' },
                  { label: 'Vimeo', hint: 'Upload → Copy video link', url: 'https://vimeo.com' },
                ].map(s => (
                  <li key={s.label} style={{ display: 'flex', alignItems: 'baseline', gap: '0.375rem', fontSize: '0.75rem', color: 'rgba(240,235,225,0.50)' }}>
                    <a href={s.url} target="_blank" rel="noreferrer" style={{ color: '#C9A84C', textDecoration: 'none', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '2px', flexShrink: 0 }}>
                      {s.label} <ExternalLink size={10} />
                    </a>
                    — {s.hint}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* ── Theme Colors ── */}
        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#F0EBE1', fontWeight: 600, marginBottom: '0.375rem', fontSize: '0.9375rem' }}>
            <Palette size={16} style={{ color: '#C9A84C' }} /> Theme Colors
          </h3>
          <p style={{ color: 'rgba(240,235,225,0.35)', fontSize: '0.75rem', marginBottom: '1.25rem' }}>
            Changes the accent color and background across the whole website. Click <strong style={{ color: 'rgba(240,235,225,0.65)' }}>Save All Settings</strong> below to apply.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: '1.25rem' }}>
            {/* Accent color */}
            <div>
              <label style={{ color: 'rgba(240,235,225,0.55)', fontSize: '0.75rem', display: 'block', marginBottom: '0.625rem' }}>Accent / Primary Color</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {/* Color swatch — not registered, just calls setValue */}
                <input
                  type="color"
                  value={primaryColor}
                  onChange={e => setSettingsValue('primary_color', e.target.value)}
                  style={{ width: '48px', height: '48px', borderRadius: '0.625rem', border: '1px solid rgba(255,255,255,0.15)', cursor: 'pointer', background: 'transparent', padding: '3px' }}
                />
                {/* Text input IS registered */}
                <input
                  {...regSettings('primary_color')}
                  type="text"
                  maxLength={7}
                  className={inputCls}
                  style={{ flex: 1 }}
                  onChange={e => {
                    const v = e.target.value;
                    setSettingsValue('primary_color', v);
                  }}
                />
              </div>
              {/* Live preview swatch */}
              <div style={{ marginTop: '0.625rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: primaryColor, border: '2px solid rgba(255,255,255,0.15)' }} />
                <span style={{ color: 'rgba(240,235,225,0.40)', fontSize: '0.75rem' }}>Preview: {primaryColor}</span>
              </div>
              <p style={{ color: 'rgba(240,235,225,0.20)', fontSize: '0.7rem', marginTop: '0.25rem' }}>Default: #C9A84C (gold)</p>
            </div>

            {/* Background color */}
            <div>
              <label style={{ color: 'rgba(240,235,225,0.55)', fontSize: '0.75rem', display: 'block', marginBottom: '0.625rem' }}>Background Color</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <input
                  type="color"
                  value={bgColor}
                  onChange={e => setSettingsValue('bg_color', e.target.value)}
                  style={{ width: '48px', height: '48px', borderRadius: '0.625rem', border: '1px solid rgba(255,255,255,0.15)', cursor: 'pointer', background: 'transparent', padding: '3px' }}
                />
                <input
                  {...regSettings('bg_color')}
                  type="text"
                  maxLength={7}
                  className={inputCls}
                  style={{ flex: 1 }}
                  onChange={e => setSettingsValue('bg_color', e.target.value)}
                />
              </div>
              <div style={{ marginTop: '0.625rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: bgColor, border: '2px solid rgba(255,255,255,0.15)' }} />
                <span style={{ color: 'rgba(240,235,225,0.40)', fontSize: '0.75rem' }}>Preview: {bgColor}</span>
              </div>
              <p style={{ color: 'rgba(240,235,225,0.20)', fontSize: '0.7rem', marginTop: '0.25rem' }}>Default: #0D0D0D (near black)</p>
            </div>
          </div>
        </div>

        {/* ── Social Media ── */}
        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#F0EBE1', fontWeight: 600, marginBottom: '1.25rem', fontSize: '0.9375rem' }}>
            <Globe size={16} style={{ color: '#C9A84C' }} /> Social Media
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {([
              { label: 'Facebook URL',   field: 'facebook_url',  placeholder: 'https://facebook.com/...' },
              { label: 'Instagram URL',  field: 'instagram_url', placeholder: 'https://instagram.com/...' },
              { label: 'Twitter / X URL',field: 'twitter_url',   placeholder: 'https://twitter.com/...' },
              { label: 'TikTok URL',     field: 'tiktok_url',    placeholder: 'https://tiktok.com/@...' },
            ] as const).map(item => (
              <div key={item.field}>
                <label style={{ color: 'rgba(240,235,225,0.55)', fontSize: '0.75rem', display: 'block', marginBottom: '0.375rem' }}>{item.label}</label>
                <input {...regSettings(item.field)} className={inputCls} placeholder={item.placeholder} />
              </div>
            ))}
          </div>
        </div>

        <button type="submit" disabled={saving} className="btn-gold" style={{ padding: '0.875rem 2rem', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', alignSelf: 'flex-start', opacity: saving ? 0.6 : 1 }}>
          <Save size={16} />
          {saving ? 'Saving…' : 'Save All Settings'}
        </button>
      </form>

      {/* ── Change Password ── */}
      <div className="glass-card" style={{ padding: '1.75rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#F0EBE1', fontWeight: 600, marginBottom: '1.25rem', fontSize: '0.9375rem' }}>
          <Lock size={16} style={{ color: '#C9A84C' }} /> Change Password
        </h3>
        <form onSubmit={handlePassSubmit(onChangePassword)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ color: 'rgba(240,235,225,0.55)', fontSize: '0.75rem', display: 'block', marginBottom: '0.375rem' }}>Current Password</label>
            <input {...regPass('currentPassword', { required: true })} type="password" className={inputCls} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '1rem' }}>
            <div>
              <label style={{ color: 'rgba(240,235,225,0.55)', fontSize: '0.75rem', display: 'block', marginBottom: '0.375rem' }}>New Password</label>
              <input {...regPass('newPassword', { required: true, minLength: 8 })} type="password" className={inputCls} placeholder="Min 8 characters" />
            </div>
            <div>
              <label style={{ color: 'rgba(240,235,225,0.55)', fontSize: '0.75rem', display: 'block', marginBottom: '0.375rem' }}>Confirm New Password</label>
              <input {...regPass('confirmPassword', { required: true, validate: v => v === newPassword || 'Passwords do not match' })} type="password" className={inputCls} />
            </div>
          </div>
          <button type="submit" className="btn-gold" style={{ padding: '0.75rem 1.5rem', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', alignSelf: 'flex-start' }}>
            <Lock size={14} /> Change Password
          </button>
        </form>
      </div>
    </div>
  );
}
