import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const onest = localFont({ src: '../../public/fonts/Onest.ttf', display: 'swap', variable: '--font-onest', weight: '100 900' });
export const metadata: Metadata = {
  metadataBase: new URL('https://proposal.aiges.kz'),
  title: 'AIGES — Design & Development Studio',
  description: 'Создаём современные цифровые продукты для бизнеса. Разработка сайтов, UX/UI дизайн, веб-сервисы и автоматизация. Алматы · Казахстан.',
  robots: { index: false, follow: false },
  icons: { icon: '/assets/logo.svg' },
  openGraph: { title: 'AIGES — Design & Development Studio', description: 'Создаём современные цифровые продукты для бизнеса.', locale: 'ru_RU', type: 'website' },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ru" className={onest.variable}><body>{children}</body></html>;
}
