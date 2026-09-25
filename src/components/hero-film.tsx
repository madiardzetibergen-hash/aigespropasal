'use client';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { Arrow, Logo } from './primitives';
import s from './deck.module.css';

export function HeroSection() {
  return <section id="intro" className={s.hero} aria-labelledby="hero-title">
    <Image className={s.heroArt} src="/assets/architecture.webp" fill priority sizes="(max-width: 700px) 100vw, 45vw" alt="" />
    <div className={s.heroInner}>
      <header className={s.header}>
        <a href="#intro" aria-label="AIGES — начало"><Logo /></a>
      </header>
      <div className={s.heroCopy}>
        <h1 id="hero-title"><span className={s.heroBrand}>AIGES<span>.</span></span><span className={s.heroTitle}>DESIGN &<br />DEVELOPMENT<br className={s.mobileBreak} /> STUDIO</span></h1>
        <div className={s.blueRule} />
        <p className={s.heroDescription}>Создаём современные цифровые<br className={s.desktopBreak} /> продукты для бизнеса</p>
      </div>
      <div className={s.heroBottom}><span>Almaty · Kazakhstan</span><a href="#film">SCROLL TO EXPLORE <Arrow direction="down" /></a></div>
    </div>
  </section>;
}

export function BrandFilmSection() {
  const section = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();
  const [fallback, setFallback] = useState(false);
  const [paused, setPaused] = useState(true);
  const [error, setError] = useState(false);
  const manuallyPaused = useRef(false);
  const { scrollYProgress } = useScroll({ target: section, offset: ['start end', 'start start'] });
  const opacity = useTransform(scrollYProgress, [0, .8], [.15, 1]);
  useEffect(() => {
    const element = video.current;
    const container = section.current;
    if (!element || !container) return;
    let visible = false;
    let disposed = false;
    const synchronize = () => {
      if (!visible || document.hidden || reduced || manuallyPaused.current) { element.pause(); return; }
      element.play().then(() => {
        if (disposed || !visible || document.hidden || manuallyPaused.current) element.pause();
        else setFallback(false);
      }).catch(() => { if (!disposed) setFallback(true); });
    };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; synchronize(); }, { threshold: .35 });
    observer.observe(container);
    document.addEventListener('visibilitychange', synchronize);
    return () => { disposed = true; observer.disconnect(); document.removeEventListener('visibilitychange', synchronize); element.pause(); };
  }, [reduced]);
  async function toggle() {
    const element = video.current;
    if (!element) return;
    if (element.paused) {
      manuallyPaused.current = false;
      try { await element.play(); setFallback(false); } catch { setFallback(true); }
    } else { manuallyPaused.current = true; element.pause(); }
  }
  return <section id="film" ref={section} className={s.film} aria-label="Бренд-фильм AIGES">
    <motion.div className={s.filmFrame} style={reduced ? {} : { opacity }}>
      <video ref={video} muted playsInline preload="metadata" poster="/assets/poster.jpg" aria-label="AIGES: сайты, автоматизация, интеграции и AI" onPlay={() => setPaused(false)} onPause={() => setPaused(true)} onError={() => setError(true)} onEnded={() => setPaused(true)}>
        <source src="/assets/intro.mp4" type="video/mp4" />
      </video>
    </motion.div>
    {error ? <a className={s.filmPlayback} href="/assets/intro.mp4" aria-label="Открыть видео"><Arrow /></a> : <button className={s.filmPlayback} type="button" onClick={toggle} aria-label={fallback || paused ? 'Смотреть фильм' : 'Приостановить фильм'}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">{fallback || paused ? <path d="m8 4 12 8-12 8Z" /> : <path d="M8 4v16M16 4v16" />}</svg></button>}
  </section>;
}
