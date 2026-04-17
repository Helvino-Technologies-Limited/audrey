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
        const gold = settings.primary_color || '#38BDF8';
        const bg = settings.bg_color || '#0A1525';

        const { r: gr, g: gg, b: gb } = hexToRgb(gold);
        const { r, g, b } = hexToRgb(bg);

        root.style.setProperty('--gold', gold);
        root.style.setProperty('--gold-light', lighten(gold, 0.25));
        root.style.setProperty('--gold-dark', darken(gold, 0.18));
        root.style.setProperty('--gold-rgb', `${gr}, ${gg}, ${gb}`);

        root.style.setProperty('--bg-base', bg);
        root.style.setProperty('--bg-rgb', `${r}, ${g}, ${b}`);
        root.style.setProperty('--bg-warm-rgb', `${r}, ${g}, ${b}`);

        const card = `rgb(${Math.min(255,r+9)}, ${Math.min(255,g+13)}, ${Math.min(255,b+11)})`;
        const card2 = `rgb(${Math.min(255,r+14)}, ${Math.min(255,g+21)}, ${Math.min(255,b+19)})`;
        root.style.setProperty('--bg-card', card);
        root.style.setProperty('--bg-card-2', card2);
        root.style.setProperty('--border', `rgba(${gr}, ${gg}, ${gb}, 0.18)`);
        document.body.style.backgroundColor = bg;
      })
      .catch(() => {});
  }, []);

  return null;
}
