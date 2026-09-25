import { HeroSection, BrandFilmSection } from '@/components/hero-film';
import { CapabilitiesSection, MissionSection, IndustriesSection, SolutionsSection, GeographySection, ProcessSection, TechnologySection, PricingSection, ContactSection } from '@/components/sections';
import { ProjectsSection } from '@/components/projects';
import { SectionNavigation } from '@/components/navigation';
import s from '@/components/deck.module.css';

export default function Home() {
  return <><a className={s.skipLink} href="#capabilities">Перейти к содержанию</a><main><HeroSection /><BrandFilmSection /><CapabilitiesSection /><MissionSection /><IndustriesSection /><SolutionsSection /><GeographySection /><ProcessSection /><TechnologySection /><ProjectsSection /><PricingSection /><ContactSection /></main><SectionNavigation /></>;
}
