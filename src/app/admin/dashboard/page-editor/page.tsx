'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Save, FileText } from 'lucide-react';

interface ContentEntry {
  page: string;
  section: string;
  key: string;
  value: string;
  type: string;
}

interface PageGroup {
  [section: string]: {
    [key: string]: string;
  };
}

interface AllContent {
  [page: string]: PageGroup;
}

const PAGE_LABELS: Record<string, string> = {
  home: 'Home Page',
  contact: 'Contact Page',
};

const SECTION_LABELS: Record<string, string> = {
  hero: 'Hero Section',
  about: 'About Section',
  cta: 'Call to Action',
  main: 'Main Content',
};

const KEY_LABELS: Record<string, string> = {
  title: 'Title',
  subtitle: 'Subtitle',
  body: 'Body Text',
  button_text: 'Button Text',
};

export default function PageEditorPage() {
  const [content, setContent] = useState<AllContent>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [edits, setEdits] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch('/api/page-content')
      .then(r => r.json())
      .then((rows: ContentEntry[]) => {
        const grouped: AllContent = {};
        rows.forEach(row => {
          if (!grouped[row.page]) grouped[row.page] = {};
          if (!grouped[row.page][row.section]) grouped[row.page][row.section] = {};
          grouped[row.page][row.section][row.key] = row.value || '';
        });
        setContent(grouped);
        const initialEdits: Record<string, string> = {};
        rows.forEach(row => {
          initialEdits[`${row.page}__${row.section}__${row.key}`] = row.value || '';
        });
        setEdits(initialEdits);
      })
      .catch(() => toast.error('Failed to load content'))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (page: string, section: string, key: string, value: string) => {
    setEdits(prev => ({ ...prev, [`${page}__${section}__${key}`]: value }));
  };

  const saveAll = async () => {
    setSaving(true);
    try {
      const updates = Object.entries(edits).map(([k, value]) => {
        const [page, section, key] = k.split('__');
        return { page, section, key, value, type: 'text' };
      });
      const res = await fetch('/api/page-content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error('Save failed');
      toast.success('Page content saved!');
    } catch {
      toast.error('Failed to save content');
    } finally {
      setSaving(false);
    }
  };

  const inputCls = 'w-full bg-[#252525] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C9A84C]/50 placeholder-white/20';

  if (loading) return <div className="text-white/40 p-8">Loading page content...</div>;

  return (
    <div className="max-w-3xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-white mb-1">Page Editor</h1>
          <p className="text-white/40 text-sm">Edit text content across all public pages</p>
        </div>
        <button
          onClick={saveAll}
          disabled={saving}
          className="btn-gold px-6 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 disabled:opacity-60"
        >
          <Save size={16} /> {saving ? 'Saving...' : 'Save All'}
        </button>
      </div>

      <div className="space-y-8">
        {Object.entries(content).map(([page, sections]) => (
          <div key={page} className="glass-card rounded-2xl p-8">
            <h2 className="flex items-center gap-2 text-white font-bold text-lg mb-6">
              <FileText size={18} className="text-[#C9A84C]" />
              {PAGE_LABELS[page] || page}
            </h2>
            <div className="space-y-6">
              {Object.entries(sections).map(([section, keys]) => (
                <div key={section}>
                  <h3 className="text-[#C9A84C] text-xs uppercase tracking-widest mb-3">
                    {SECTION_LABELS[section] || section}
                  </h3>
                  <div className="space-y-4 pl-4 border-l border-white/5">
                    {Object.entries(keys).map(([key]) => {
                      const editKey = `${page}__${section}__${key}`;
                      const val = edits[editKey] ?? '';
                      const isLong = val.length > 100 || key === 'body' || key === 'subtitle';
                      return (
                        <div key={key}>
                          <label className="text-white/50 text-xs mb-1.5 block capitalize">
                            {KEY_LABELS[key] || key}
                          </label>
                          {isLong ? (
                            <textarea
                              value={val}
                              onChange={e => handleChange(page, section, key, e.target.value)}
                              rows={3}
                              className={`${inputCls} resize-y`}
                            />
                          ) : (
                            <input
                              type="text"
                              value={val}
                              onChange={e => handleChange(page, section, key, e.target.value)}
                              className={inputCls}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {Object.keys(content).length === 0 && (
          <div className="glass-card rounded-2xl p-16 text-center text-white/30">
            No page content found. Initialize the database first.
          </div>
        )}
      </div>

      <div className="mt-8">
        <button
          onClick={saveAll}
          disabled={saving}
          className="btn-gold px-8 py-4 rounded-xl text-sm font-semibold flex items-center gap-2 disabled:opacity-60"
        >
          <Save size={16} /> {saving ? 'Saving...' : 'Save All Changes'}
        </button>
      </div>
    </div>
  );
}
