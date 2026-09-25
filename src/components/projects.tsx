'use client';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { projects } from '@/content/content';
import { Arrow, SectionFooter, SectionHeading } from './primitives';
import s from './deck.module.css';

function ProjectSlide({ project, index }: { project: typeof projects[number]; index: number }) {
  return (
    <article className={s.projectSlide} aria-roledescription="слайд" aria-label={`${index + 1} из ${projects.length}: ${project.title}`}>
      <div className={s.projectVisual} style={{ background: project.background }}>
        <Image
          src={project.image}
          fill
          sizes="(max-width: 700px) 90vw, (max-width: 1200px) 85vw, 1400px"
          quality={95}
          priority={index < 2}
          draggable={false}
          alt={`Интерфейс проекта ${project.title}`}
        />
      </div>
      <div className={s.projectInfo}>
        <h3>{project.title}</h3>
        <p>{project.category}</p>
        <span className={s.projectMark} aria-hidden="true"><Arrow /></span>
      </div>
    </article>
  );
}
export function ProjectsSection() {
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  const dragging = useRef<{ x: number; scroll: number; moved: boolean } | null>(null);
  const navigate = useCallback((index: number) => {
    const node = track.current;
    const slide = node?.children[Math.max(0, Math.min(projects.length - 1, index))] as HTMLElement | undefined;
    if (node && slide) node.scrollTo({ left: slide.offsetLeft - (node.children[0] as HTMLElement).offsetLeft, behavior: reduced ? 'instant' : 'smooth' });
  }, [reduced]);
  useEffect(() => {
    const node = track.current;
    if (!node) return;
    let wheelTimer: ReturnType<typeof setTimeout> | undefined;
    let wheelStart = 0;
    const onWheel = (event: WheelEvent) => {
      // Preserve pinch zoom, native horizontal trackpads and vertical escape at either boundary.
      if (event.ctrlKey || event.shiftKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
      const rect = node.getBoundingClientRect();
      if (rect.top > window.innerHeight * .35 || rect.bottom < window.innerHeight * .55) return;
      const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? node.clientWidth : 1);
      const max = node.scrollWidth - node.clientWidth;
      if ((delta > 0 && node.scrollLeft >= max - 2) || (delta < 0 && node.scrollLeft <= 2)) return;
      event.preventDefault();
      if (!wheelTimer) wheelStart = node.scrollLeft;
      clearTimeout(wheelTimer);
      node.style.scrollSnapType = 'none';
      node.scrollLeft += delta;
      wheelTimer = setTimeout(() => {
        wheelTimer = undefined;
        const width = (node.children[1] as HTMLElement).offsetLeft - (node.children[0] as HTMLElement).offsetLeft;
        const distance = node.scrollLeft - wheelStart;
        const index = Math.abs(distance) > 40 ? (distance > 0 ? Math.ceil(node.scrollLeft / width) : Math.floor(node.scrollLeft / width)) : Math.round(node.scrollLeft / width);
        node.style.scrollSnapType = '';
        navigate(index);
      }, 160);
    };
    node.addEventListener('wheel', onWheel, { passive: false });
    const observer = new ResizeObserver(() => {
      const first = node.children[0] as HTMLElement;
      const width = (node.children[1] as HTMLElement).offsetLeft - first.offsetLeft;
      setActive(Math.min(projects.length - 1, Math.round(node.scrollLeft / width)));
    });
    observer.observe(node);
    return () => { clearTimeout(wheelTimer); node.style.scrollSnapType = ''; node.removeEventListener('wheel', onWheel); observer.disconnect(); };
  }, [navigate]);
  function updateActive() {
    const node = track.current;
    if (!node) return;
    const width = (node.children[1] as HTMLElement).offsetLeft - (node.children[0] as HTMLElement).offsetLeft;
    setActive(Math.min(projects.length - 1, Math.max(0, Math.round(node.scrollLeft / width))));
  }
  return <section id="projects" className={s.projects} aria-labelledby="projects-title">
    <div className={`${s.container} ${s.projectsHeading}`}><SectionHeading><span id="projects-title">НАШИ<br />ПРОЕКТЫ<span className={s.titleDot}>.</span></span></SectionHeading><div><p>Проекты, реализованные<br />командой AIGES</p><span className={s.mono}>DRAG TO EXPLORE <Arrow direction="right" /></span></div></div>
    <div ref={track} className={s.projectTrack} role="region" aria-roledescription="карусель" aria-label="Галерея проектов. Используйте стрелки влево и вправо" tabIndex={0} onScroll={updateActive}
      onKeyDown={event => { if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); navigate(active + (event.key === 'ArrowRight' ? 1 : -1)); } if (event.key === 'Home' || event.key === 'End') { event.preventDefault(); navigate(event.key === 'Home' ? 0 : projects.length - 1); } }}
      onPointerDown={event => { if (event.pointerType !== 'mouse' || event.button !== 0) return; const node = event.currentTarget; dragging.current = { x: event.clientX, scroll: node.scrollLeft, moved: false }; node.setPointerCapture(event.pointerId); node.dataset.dragging = 'true'; }}
      onPointerMove={event => { const state = dragging.current; if (!state) return; if (Math.abs(event.clientX - state.x) > 4) state.moved = true; event.currentTarget.scrollLeft = state.scroll - (event.clientX - state.x); }}
      onPointerUp={event => { const state = dragging.current; dragging.current = null; const node = event.currentTarget; const currentScroll = node.scrollLeft; delete node.dataset.dragging; if (node.hasPointerCapture(event.pointerId)) node.releasePointerCapture(event.pointerId); if (state?.moved) { const width = (node.children[1] as HTMLElement).offsetLeft - (node.children[0] as HTMLElement).offsetLeft; const distance = currentScroll - state.scroll; const index = Math.abs(distance) > 60 ? (distance > 0 ? Math.ceil(currentScroll / width) : Math.floor(currentScroll / width)) : Math.round(currentScroll / width); navigate(index); } }}
      onPointerCancel={event => { dragging.current = null; delete event.currentTarget.dataset.dragging; }}>
      {projects.map((project, i) => <ProjectSlide key={project.title} project={project} index={i} />)}
    </div>
    <div className={`${s.container} ${s.projectControls}`}><span className={s.srOnly} aria-live="polite" aria-atomic="true">{projects[active].title}</span><div className={s.progress} role="progressbar" aria-label="Текущий проект" aria-valuemin={1} aria-valuemax={projects.length} aria-valuenow={active + 1} aria-valuetext={projects[active].title}><span style={{ width: `${(active + 1) / projects.length * 100}%` }} /></div><div className={s.projectArrows}><button type="button" aria-label="Предыдущий проект" disabled={active === 0} onClick={() => navigate(active - 1)}><Arrow direction="left" /></button><button type="button" aria-label="Следующий проект" disabled={active === projects.length - 1} onClick={() => navigate(active + 1)}><Arrow direction="right" /></button></div></div>
    <div className={`${s.container} ${s.moreProjects}`}><span>Больше реализованных проектов и подробные кейсы</span><a href="https://aiges.kz/" target="_blank" rel="noopener noreferrer">aiges.kz <Arrow /></a></div>
    <div className={s.container}><SectionFooter /></div>
  </section>;
}
