import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import './globals.css';

export const metadata: Metadata = {
  title: 'Artvista - Interactive Art Platform',
  description: 'Explore the infinite possibilities of digital art. Where human creativity meets artificial intelligence.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-black antialiased">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
