'use client';

import { useEffect } from 'react';

function hexToRgb(hex: string) {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return { r, g, b };
}

function lighten(hex: string, amount: number) {
  const { r, g, b } = hexToRgb(hex);
  const l = (v: number) => Math.min(255, Math.round(v + (255 - v) * amount));
  return `#${[l(r), l(g), l(b)].map(v => v.toString(16).padStart(2, '0')).join('')}`;
}

function darken(hex: string, amount: number) {
  const { r, g, b } = hexToRgb(hex);
  const d = (v: number) => Math.max(0, Math.round(v * (1 - amount)));
  return `#${[d(r), d(g), d(b)].map(v => v.toString(16).padStart(2, '0')).join('')}`;
}

export default function ThemeProvider() {
  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(settings => {
        const root = document.documentElement;
        const gold = settings.primary_color || '#C9A84C';
        const bg = settings.bg_color || '#0D0D0D';

        root.style.setProperty('--gold', gold);
        root.style.setProperty('--gold-light', lighten(gold, 0.25));
        root.style.setProperty('--gold-dark', darken(gold, 0.18));
        root.style.setProperty('--bg-base', bg);

        // Derive card bg from base
        const { r, g, b } = hexToRgb(bg);
        const card = `rgb(${Math.min(255,r+10)}, ${Math.min(255,g+10)}, ${Math.min(255,b+10)})`;
        const card2 = `rgb(${Math.min(255,r+16)}, ${Math.min(255,g+16)}, ${Math.min(255,b+16)})`;
        root.style.setProperty('--bg-card', card);
        root.style.setProperty('--bg-card-2', card2);
        root.style.setProperty('--border', `rgba(${hexToRgb(gold).r}, ${hexToRgb(gold).g}, ${hexToRgb(gold).b}, 0.18)`);
        document.body.style.backgroundColor = bg;
      })
      .catch(() => {});
  }, []);

  return null;
}
