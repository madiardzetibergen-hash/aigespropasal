'use client';
import { useEffect, useState } from 'react';
import { sections } from '@/content/content';
import s from './deck.module.css';

export function SectionNavigation() {
  const [active, setActive] = useState('intro');
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
    }, { rootMargin: '-30% 0px -60% 0px', threshold: 0 });
    sections.forEach(([id]) => { const node = document.getElementById(id); if (node) observer.observe(node); });
    return () => observer.disconnect();
  }, []);
  return <nav className={`${s.sideNav} ${active === 'film' ? s.navDark : ''}`} aria-label="Разделы презентации">
    {sections.map(([id, , title]) => <a key={id} href={`#${id}`} aria-label={title} aria-current={active === id ? 'location' : undefined} className={active === id ? s.navActive : ''}><span className={s.navTooltip}>{title}</span><i /></a>)}
  </nav>;
}
