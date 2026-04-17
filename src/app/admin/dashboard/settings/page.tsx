'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Save, Lock, Globe, Phone, Video, Image as ImageIcon } from 'lucide-react';
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
}

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const { register: regSettings, handleSubmit: handleSettingsSubmit, reset: resetSettings, setValue: setSettingsValue, watch: watchSettings } = useForm<SiteSettings>();
  const logoUrl = watchSettings('logo_url');
  const heroVideoUrl = watchSettings('hero_video_url');
  const { register: regPass, handleSubmit: handlePassSubmit, reset: resetPass, watch } = useForm<PasswordForm>();
  const newPassword = watch('newPassword');

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(data => { resetSettings(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [resetSettings]);

  const onSaveSettings = async (data: SiteSettings) => {
    setSaving(true);
    try {
      await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      toast.success('Settings saved successfully!');
    } catch {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const onChangePassword = async (data: PasswordForm) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: data.currentPassword, newPassword: data.newPassword }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error);
      }
      toast.success('Password changed successfully!');
      resetPass();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to change password');
    }
  };

  if (loading) return <div className="text-white/40 p-8">Loading settings...</div>;

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-white mb-1">Settings</h1>
        <p className="text-white/40 text-sm">Manage site content, contact info, and account settings</p>
      </div>

      {/* Site Settings */}
      <form onSubmit={handleSettingsSubmit(onSaveSettings)} className="space-y-8 mb-12">
        {/* General */}
        <div className="glass-card rounded-2xl p-8">
          <h3 className="flex items-center gap-2 text-white font-semibold mb-6">
            <Globe size={18} className="text-[#C9A84C]" /> General
          </h3>
          <div className="space-y-5">
            <div>
              <label className="text-white/60 text-xs mb-1.5 block">Site Name</label>
              <input {...regSettings('site_name')} className="w-full bg-[#252525] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C9A84C]/50" />
            </div>
            <div>
              <label className="text-white/60 text-xs mb-1.5 block">Tagline / Subtitle</label>
              <input {...regSettings('site_tagline')} className="w-full bg-[#252525] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C9A84C]/50" />
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="glass-card rounded-2xl p-8">
          <h3 className="flex items-center gap-2 text-white font-semibold mb-6">
            <Phone size={18} className="text-[#C9A84C]" /> Contact Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="text-white/60 text-xs mb-1.5 block">Phone Number</label>
              <input {...regSettings('contact_phone')} className="w-full bg-[#252525] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C9A84C]/50" />
            </div>
            <div>
              <label className="text-white/60 text-xs mb-1.5 block">Email</label>
              <input {...regSettings('contact_email')} type="email" className="w-full bg-[#252525] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C9A84C]/50" />
            </div>
            <div>
              <label className="text-white/60 text-xs mb-1.5 block">M-PESA Till</label>
              <input {...regSettings('mpesa_till')} className="w-full bg-[#252525] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C9A84C]/50" />
            </div>
            <div>
              <label className="text-white/60 text-xs mb-1.5 block">Operating Hours</label>
              <input {...regSettings('operating_hours')} className="w-full bg-[#252525] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C9A84C]/50" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-white/60 text-xs mb-1.5 block">Address</label>
              <input {...regSettings('contact_address')} className="w-full bg-[#252525] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C9A84C]/50" />
            </div>
          </div>
        </div>

        {/* Media */}
        <div className="glass-card rounded-2xl p-8">
          <h3 className="flex items-center gap-2 text-white font-semibold mb-6">
            <Video size={18} className="text-[#C9A84C]" /> Media & Branding
          </h3>
          <div className="space-y-5">
            <div>
              <p className="text-white/60 text-xs mb-1.5 flex items-center gap-1.5"><ImageIcon size={12} /> Logo Image</p>
              <input {...regSettings('logo_url')} type="hidden" />
              <FileUpload
                mediaType="image"
                category="branding"
                currentUrl={logoUrl}
                onUpload={url => setSettingsValue('logo_url', url)}
              />
            </div>
            <div>
              <p className="text-white/60 text-xs mb-1.5 flex items-center gap-1.5"><Video size={12} /> Hero Background Video</p>
              <input {...regSettings('hero_video_url')} type="hidden" />
              <FileUpload
                mediaType="video"
                category="hero"
                currentUrl={heroVideoUrl}
                onUpload={url => setSettingsValue('hero_video_url', url)}
              />
              <p className="text-white/30 text-xs mt-1">This video will play on the homepage hero background.</p>
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="glass-card rounded-2xl p-8">
          <h3 className="flex items-center gap-2 text-white font-semibold mb-6">
            <Globe size={18} className="text-[#C9A84C]" /> Social Media
          </h3>
          <div className="space-y-4">
            {[
              { label: 'Facebook URL', field: 'facebook_url' as const, placeholder: 'https://facebook.com/...' },
              { label: 'Instagram URL', field: 'instagram_url' as const, placeholder: 'https://instagram.com/...' },
              { label: 'Twitter / X URL', field: 'twitter_url' as const, placeholder: 'https://twitter.com/...' },
            ].map(item => (
              <div key={item.field}>
                <label className="text-white/60 text-xs mb-1.5 block">{item.label}</label>
                <input {...regSettings(item.field)} className="w-full bg-[#252525] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C9A84C]/50 placeholder-white/20" placeholder={item.placeholder} />
              </div>
            ))}
          </div>
        </div>

        <button type="submit" disabled={saving} className="btn-gold px-8 py-4 rounded-xl font-semibold flex items-center gap-2 text-sm disabled:opacity-60">
          <Save size={16} />
          {saving ? 'Saving...' : 'Save All Settings'}
        </button>
      </form>

      {/* Change Password */}
      <div className="glass-card rounded-2xl p-8">
        <h3 className="flex items-center gap-2 text-white font-semibold mb-6">
          <Lock size={18} className="text-[#C9A84C]" /> Change Password
        </h3>
        <form onSubmit={handlePassSubmit(onChangePassword)} className="space-y-4">
          <div>
            <label className="text-white/60 text-xs mb-1.5 block">Current Password</label>
            <input {...regPass('currentPassword', { required: true })} type="password" className="w-full bg-[#252525] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C9A84C]/50" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-white/60 text-xs mb-1.5 block">New Password</label>
              <input {...regPass('newPassword', { required: true, minLength: 8 })} type="password" className="w-full bg-[#252525] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C9A84C]/50" placeholder="Min 8 characters" />
            </div>
            <div>
              <label className="text-white/60 text-xs mb-1.5 block">Confirm New Password</label>
              <input {...regPass('confirmPassword', { required: true, validate: v => v === newPassword || 'Passwords do not match' })} type="password" className="w-full bg-[#252525] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C9A84C]/50" />
            </div>
          </div>
          <button type="submit" className="btn-gold px-6 py-3 rounded-xl text-sm font-semibold flex items-center gap-2">
            <Lock size={14} /> Change Password
          </button>
        </form>
      </div>
    </div>
  );
}
