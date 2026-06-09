import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '登录 - Artvista',
  description: '登录 Artvista，探索数字艺术的无限可能。',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
