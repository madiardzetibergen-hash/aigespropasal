'use client';
import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { capabilities, mission, industries, solutions, geography, process, technologies, technologyIntro, pricing, terms, contacts } from '@/content/content';
import { Arrow, Logo, Reveal, SectionFooter, SectionHeading, Cube } from './primitives';
import s from './deck.module.css';

export function CapabilitiesSection() {
  return <section id="capabilities" className={`${s.section} ${s.capabilities}`} aria-labelledby="capabilities-title"><div className={s.container}>
    <SectionHeading><span id="capabilities-title">НАПРАВЛЕНИЯ</span></SectionHeading>
    <div className={s.capabilityGrid}>{capabilities.map((item, i) => <Reveal key={item.title} delay={i * .07} className={s.capability}>
      <Cube /><div className={s.capabilityLine} /><h3>{item.title}</h3><p>{item.text}</p><a href="#contact" aria-label={`Обсудить ${item.title}`}><Arrow /></a>
    </Reveal>)}</div>
    <SectionFooter />
  </div></section>;
}

export function MissionSection() {
  return <section id="mission" className={`${s.section} ${s.mission}`} aria-labelledby="mission-title"><div className={s.container}>
    <div className={s.missionGrid}>
      <div className={s.missionIntro}><SectionHeading><span id="mission-title">НАША <br />МИССИЯ</span></SectionHeading><Reveal><p>{mission.text}</p></Reveal></div>
      <div className={s.hands}><Image src="/assets/hands.webp" fill sizes="(max-width: 700px) 50vw, 28vw" alt="Две руки, соединённые в крепком рукопожатии" /></div>
      <div className={s.missionItems}>{mission.items.map((item, i) => <Reveal key={item.title} delay={i * .15}><div className={s.dividerLine} aria-hidden="true"><i /></div><h3>{item.title}</h3><p>{item.text}</p></Reveal>)}</div>
    </div><SectionFooter />
  </div></section>;
}

export function IndustriesSection() {
  return <section id="expertise" className={`${s.section} ${s.expertise}`} aria-labelledby="expertise-title"><div className={s.container}>
    <div className={s.editorialGrid}><div><SectionHeading><span id="expertise-title">ОТРАСЛЕВАЯ<br />ЭКСПЕРТИЗА</span></SectionHeading><p className={s.introText}>Работаем с компаниями из разных отраслей и глубоко понимаем их бизнес-задачи и процессы.</p></div>
      <div className={s.industryList}>{industries.map(item => <details className={s.industry} key={item.title}><summary><h3>{item.title}</h3><span className={s.plus} aria-hidden="true">+</span></summary><ul>{item.items.map(text => <li key={text}>{text}</li>)}</ul></details>)}</div>
    </div><SectionFooter />
  </div></section>;
}

export function SolutionsSection() {
  const list = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const nodes = list.current?.querySelectorAll('article');
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) entry.target.classList.toggle(s.solutionActive, entry.isIntersecting);
    }, { rootMargin: '-15% 0px -30% 0px', threshold: .2 });
    nodes?.forEach(node => observer.observe(node));
    return () => observer.disconnect();
  }, []);
  return <section id="solutions" className={`${s.section} ${s.solutions}`} aria-labelledby="solutions-title"><div className={s.container}>
    <div className={s.editorialGrid}><div className={s.stickyHeading}><SectionHeading><span id="solutions-title">РЕШЕНИЯ<br />ДЛЯ БИЗНЕСА</span></SectionHeading><div className={s.blueRule} /><span className={s.solutionCaption}>БИЗНЕС-ЗАДАЧА → ЦИФРОВОЕ РЕШЕНИЕ</span></div>
      <div ref={list} className={s.solutionList}>{solutions.map(item => <article key={item.title} className={s.solution}><div><h3>{item.title}</h3><ul>{item.items.map(text => <li key={text}>{text}</li>)}</ul></div><Arrow /></article>)}</div>
    </div><SectionFooter />
  </div></section>;
}

export function GeographySection() {
  return <section id="geography" className={`${s.section} ${s.geography}`} aria-labelledby="geography-title"><div className={s.container}>
    <SectionHeading><span id="geography-title">ГЕОГРАФИЯ РАБОТЫ</span></SectionHeading>
    <div className={s.geographyGrid}><div className={s.geographyCopy}><p className={s.introText}>{geography.text}</p><ul>{geography.regions.map(region => <li key={region}>{region}</li>)}</ul></div><Reveal className={s.map}><Image src="/assets/world.svg" width={1000} height={510} sizes="(max-width: 700px) 100vw, 65vw" alt="Карта мира: AIGES базируется в Алматы и работает с Казахстаном, Центральной Азией, СНГ, Европой, Северной Америкой и Ближним Востоком" /><div className={s.mapCaption}><span><i className={s.blueDot} /> BASED IN ALMATY</span><span>WORKING WITHOUT BORDERS</span></div></Reveal></div>
    <SectionFooter />
  </div></section>;
}

export function ProcessSection() {
  const reduced = useReducedMotion();
  return <section id="process" className={`${s.section} ${s.process}`} aria-labelledby="process-title"><div className={s.container}>
    <SectionHeading><span id="process-title">КАК МЫ РАБОТАЕМ</span></SectionHeading>
    <div className={s.processIntro}><h3>{process.subtitle}</h3><p>{process.text}</p></div>
    <div className={s.timeline}><motion.div className={s.timelineFill} initial={false} whileInView={reduced ? {} : { scaleX: [0, 1] }} viewport={{ once: true }} transition={{ duration: 1.2, ease: [.22, 1, .36, 1] }} />{process.items.map((item, i) => <Reveal key={item.title} className={s.processItem} delay={i * .12}><i className={s.timelineDot} /><h3>{item.title}</h3><p>{item.text}</p><p>{item.detail}</p></Reveal>)}</div>
    <SectionFooter />
  </div></section>;
}

export function TechnologySection() {
  return <section id="technology" className={`${s.section} ${s.technology}`} aria-labelledby="technology-title"><div className={s.container}>
    <SectionHeading><span id="technology-title">ТЕХНОЛОГИЧЕСКИЙ<br />СТЕК</span></SectionHeading>
    <p className={s.technologyIntro}>{technologyIntro}</p>
    <div className={s.technologyMatrix}>{technologies.map(item => <details className={s.techRow} key={item.title}><summary><span className={s.techTitle}>{item.title}</span><span className={s.techPreview}>{item.items.join(' / ')}</span><span className={s.plus} aria-hidden="true">+</span></summary><div className={s.techDetail}><p>{item.text}</p><ul>{item.items.map(text => <li key={text}>{text}</li>)}</ul></div></details>)}</div>
    <SectionFooter />
  </div></section>;
}

export function PricingSection() {
  return <section id="pricing" className={`${s.section} ${s.pricing}`} aria-labelledby="pricing-title"><div className={s.container}>
    <SectionHeading><span id="pricing-title">УСЛОВИЯ<br />СОТРУДНИЧЕСТВА</span></SectionHeading>
    <div className={s.pricingGrid}><div><div className={s.pricingCaption}>СТОИМОСТЬ <span>STARTING FROM</span></div><div className={s.priceList}>{pricing.map((item, i) => <Reveal key={item.title} delay={i * .06}><div className={s.priceRow}><div className={i === 3 ? s.customPrice : s.price}>{i < 3 && <span>от </span>}{item.price}</div><p>{item.title}</p></div></Reveal>)}</div></div>
      <div className={s.terms}>{terms.map((item, i) => <Reveal key={item.title} delay={i * .1}><div className={s.dividerLine} aria-hidden="true"><i /></div><h3>{item.title}</h3><p>{item.text}</p></Reveal>)}</div>
    </div><SectionFooter />
  </div></section>;
}

export function ContactSection() {
  return <section id="contact" className={`${s.section} ${s.contact}`} aria-labelledby="contact-title"><div className={s.container}>

    <Reveal><h2 id="contact-title" className={s.contactHeading}>ОБСУДИМ<br />ВАШ ПРОЕКТ<span>↗</span></h2></Reveal>
    <div className={s.contactGrid}><div><p className={s.contactText}>Есть задача или идея?<br />Давайте обсудим, как её реализовать.</p><p className={s.contactServices}>Разработка сайтов · UX/UI дизайн · Веб-сервисы · Автоматизация</p><a className={s.primaryCta} href={contacts[1].href} target="_blank" rel="noopener noreferrer">ОБСУДИТЬ ПРОЕКТ <Arrow /></a><div className={s.contactLinks}>{contacts.map(item => <a href={item.href} key={item.title} target="_blank" rel="noopener noreferrer">{item.title} <Arrow /></a>)}</div></div><div className={s.qr}><Image src="/assets/qr.png" width={174} height={170} alt="QR-код с переходом на сайт и контакты AIGES" /><p>QR-код с переходом на сайт<br />и контакты компании</p></div></div>
    <footer className={s.contactFooter}><a href="#intro" aria-label="Вернуться к началу"><Logo /></a><span>Almaty · Kazakhstan</span><a href="#intro" aria-label="Наверх"><Arrow direction="down" /></a></footer>
  </div></section>;
}
