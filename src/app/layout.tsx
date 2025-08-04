import type { Metadata } from 'next';
import './globals.css';

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
    <html lang='en'>
      <body className='antialiased'>{children}</body>
    </html>
  );
}
