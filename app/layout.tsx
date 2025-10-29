import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'BettaDayz PBBG - Enhanced Edition',
  description: 'Experience the ultimate virtual life simulation with exotic cars, luxury jewelry, and persistent browser-based gameplay',
  keywords: 'PBBG, browser game, virtual life, simulation, exotic cars, luxury jewelry, online game',
  authors: [{ name: 'BettaDayz Team' }],
  creator: 'BettaDayz',
  publisher: 'BettaDayz',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://bettadayz.shop'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'BettaDayz PBBG - Enhanced Edition',
    description: 'Experience the ultimate virtual life simulation with exotic cars, luxury jewelry, and persistent browser-based gameplay',
    url: 'https://bettadayz.shop',
    siteName: 'BettaDayz PBBG',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'BettaDayz PBBG Game Screenshot',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BettaDayz PBBG - Enhanced Edition',
    description: 'Experience the ultimate virtual life simulation with exotic cars, luxury jewelry, and persistent browser-based gameplay',
    images: ['/og-image.jpg'],
    creator: '@BettaDayzPBBG',
  },
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
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#8B5CF6" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </head>
      <body className={inter.className}>
        <div id="root">
          {children}
        </div>
        
        {/* Analytics (add your tracking code) */}
        {process.env.NODE_ENV === 'production' && (
          <>
            {/* Google Analytics */}
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.GOOGLE_ANALYTICS_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.GOOGLE_ANALYTICS_ID}');
                `,
              }}
            />
          </>
        )}
      </body>
    </html>
  )
}