import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';
import { Toaster } from 'react-hot-toast';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'API Probe - Simple API Testing Tool',
  description: 'A simple and clean API testing tool built with Next.js',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' className={`${inter.variable} ${jetBrainsMono.variable}`}>
      <body className='antialiased bg-canvas text-fg'>
        {children}
        <Toaster
          position='bottom-right'
          toastOptions={{
            style: {
              background: '#1c1c20',
              color: '#ededed',
              border: '1px solid #2e2e34',
              borderRadius: '6px',
              fontSize: '0.875rem',
            },
            success: {
              iconTheme: { primary: '#34d399', secondary: '#0b0b0c' },
            },
            error: {
              iconTheme: { primary: '#f87171', secondary: '#0b0b0c' },
            },
          }}
        />
        <Analytics />
      </body>
    </html>
  );
}
