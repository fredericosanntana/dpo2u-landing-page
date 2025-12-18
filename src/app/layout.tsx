import type { Metadata, Viewport } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import ConsentProvider from '@/components/consent/ConsentProvider';
import CookieBanner from '@/components/consent/CookieBanner';
import MarketingScripts from '@/components/MarketingScripts';
import { ThemeProvider } from '@/hooks/use-theme';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL('https://www.dpo2u.com'),
  title: {
    default: 'DPO2U | Stack de IA Segura em VPS - Transformação Digital com Privacidade',
    template: '%s | DPO2U'
  },
  description: 'Implemente sua própria Stack de IA (Docker, Gitea, Next.js, Python) em VPS dedicada. Zero Lock-in, 100% Privacidade. Transformação digital acelerada em 72h.',
  keywords: [
    'VPS IA',
    'Stack IA Privada',
    'Docker Swarm',
    'Gitea Private Repo',
    'Traefik Proxy',
    'Soberania de Dados',
    'LGPD compliance',
    'DPO as a service',
    'legal tech Brasil',
    'automação compliance',
    'proteção de dados',
    'transformação digital',
    'DPO2U'
  ],
  authors: [{ name: 'DPO2U', url: 'https://dpo2u.com.br' }],
  creator: 'DPO2U',
  publisher: 'DPO2U',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://dpo2u.com.br',
    siteName: 'DPO2U',
    title: 'Transformação Digital com Stack de IA Privada',
    description: 'Soberania de dados e IA em sua própria VPS. Deploy em 72h.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'DPO2U - Stack IA Segura e Privada',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DPO2U - Stack de IA Privada',
    description: 'Implemente sua infraestrutura de IA em 72h com total privacidade.',
    images: ['/og-image.jpg'],
    creator: '@dpo2u',
  },
  verification: {
    google: 'google-site-verification-code', // TODO: Add real verification code
  },
  category: 'Technology',
  classification: 'Business',
  referrer: 'origin-when-cross-origin',
  formatDetection: {
    telephone: false,
    date: false,
    address: false,
    email: false,
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
        color: '#64748b',
      },
    ],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'DPO2U',
  url: 'https://dpo2u.com.br',
  logo: 'https://dpo2u.com.br/logo.png',
  description: 'Provedora de Infraestrutura e Stack de IA Privada para transformação digital segura de empresas.',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'BR',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+55-11-99999-9999',
    contactType: 'sales',
    availableLanguage: ['Portuguese', 'English'],
  },
  sameAs: [
    'https://linkedin.com/company/dpo2u',
    'https://twitter.com/dpo2u',
  ],
  founder: {
    '@type': 'Person',
    name: 'DPO2U Founder',
  },
  foundingDate: '2023',
  industry: 'Cloud & AI Infrastructure',
  numberOfEmployees: '10-50',
  areaServed: {
    '@type': 'Country',
    name: 'Brazil',
  },
  service: [
    {
      '@type': 'Service',
      name: 'VPS AI Stack Deployment',
      description: 'Implementação de stack completa de IA (Docker, Gitea, Traefik) em infraestrutura privada.',
    },
    {
      '@type': 'Service',
      name: 'Secure Digital Transformation',
      description: 'Consultoria e implementação técnica para digitalização com soberania de dados.',
    },
    {
      '@type': 'Service',
      name: 'Private AI Agents',
      description: 'Desenvolvimento e hospedagem de agentes de IA em ambiente seguro.',
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${playfair.variable}`} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased bg-background text-foreground min-h-screen">
        <ConsentProvider>
          <ThemeProvider defaultTheme="system" enableSystem disableTransitionOnChange>
            <MarketingScripts />
            <div className="flex flex-col min-h-screen">
              {children}
            </div>
            <Toaster />
            <Analytics />
          </ThemeProvider>
          <CookieBanner />
        </ConsentProvider>
      </body>
    </html>
  );
}
