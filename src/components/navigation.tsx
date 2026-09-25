'use client';
import { useEffect, useState } from 'react';
import { sections } from '@/content/content';
import { MenuIcon, CloseIcon } from './primitives';
import s from './deck.module.css';

export function SectionNavigation() {
  const [active, setActive] = useState('intro');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
    }, { rootMargin: '-30% 0px -60% 0px', threshold: 0 });
    sections.forEach(([id]) => { const node = document.getElementById(id); if (node) observer.observe(node); });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    if (open) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [open]);

  const scrollToSection = (id: string) => {
    setOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <button
        className={`${s.bentoMenuBtn} ${open ? s.bentoMenuBtnOpen : ''}`}
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-label={open ? 'Закрыть меню' : 'Открыть меню разделов'}
        type="button"
      >
        <span className={s.bentoMenuLabel}>МЕНЮ</span>
        <span className={s.bentoMenuIcon}>{open ? <CloseIcon /> : <MenuIcon />}</span>
      </button>

      {open && (
        <>
          <div className={s.bentoBackdrop} onClick={() => setOpen(false)} aria-hidden="true" />
          <div className={s.bentoDropdown} role="dialog" aria-modal="true" aria-label="Разделы">
            <div className={s.bentoDropdownHeader}>
              <span className={s.bentoDropdownTitle}>РАЗДЕЛЫ</span>
              <button type="button" className={s.bentoCloseBtn} onClick={() => setOpen(false)} aria-label="Закрыть">
                <CloseIcon />
              </button>
            </div>
            <nav className={s.bentoList}>
              {sections.map(([id, , title], index) => {
                const num = String(index + 1).padStart(2, '0');
                const isCurrent = active === id;
                return (
                  <a
                    key={id}
                    href={`#${id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(id);
                    }}
                    className={`${s.bentoItem} ${isCurrent ? s.bentoItemActive : ''}`}
                  >
                    <span className={s.bentoItemNum}>{num}</span>
                    <span className={s.bentoItemText}>{title}</span>
                  </a>
                );
              })}
            </nav>
          </div>
        </>
      )}

      <nav className={`${s.sideNav} ${active === 'film' ? s.navDark : ''}`} aria-label="Разделы презентации">
        {sections.map(([id, , title]) => (
          <a
            key={id}
            href={`#${id}`}
            aria-label={title}
            aria-current={active === id ? 'location' : undefined}
            className={active === id ? s.navActive : ''}
          >
            <span className={s.navTooltip}>{title}</span>
            <i />
          </a>
        ))}
      </nav>
    </>
  );
}
