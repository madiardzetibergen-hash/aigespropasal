'use client';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import s from './deck.module.css';

export function Arrow({ direction = 'diagonal' }: { direction?: 'diagonal' | 'left' | 'right' | 'down' }) {
  const paths = { diagonal: 'M5 19 19 5M5 5h14v14', right: 'M4 12h16m-7-7 7 7-7 7', left: 'M20 12H4m7-7-7 7 7 7', down: 'M12 4v16m-7-7 7 7 7-7' };
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true"><path d={paths[direction]} /></svg>;
}
export function Logo({ className = '' }: { className?: string }) {
  return <Image className={className} src="/assets/logo.svg" width={130} height={53} alt="AIGES Studio" />;
}
export function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduced = useReducedMotion();
  return <motion.div className={className} initial={false} whileInView={reduced ? {} : { opacity: [0.4, 1], y: [24, 0] }} viewport={{ once: true, amount: .15 }} transition={{ duration: .7, delay, ease: [.22, 1, .36, 1] }}>{children}</motion.div>;
}
export function Cube() {
  return <svg className={s.cube} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" aria-hidden="true"><path d="m12 2 9 5v10l-9 5-9-5V7Z" /><path d="m3 7 9 5 9-5M12 12v10" /></svg>;
}
export function SectionFooter() {
  return <footer className={s.sectionFooter}><Logo /></footer>;
}
export function SectionHeading({ children }: { children: ReactNode }) {
  return <Reveal><h2 className={s.heading}>{children}</h2></Reveal>;
}
