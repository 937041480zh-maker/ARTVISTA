import type { Metadata } from 'next';

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

export const metadata: Metadata = {
  title: '登录 - Artvista',
  description: '登录 Artvista，探索数字艺术的无限可能。',
  icons: {
    icon: '/favicon.ico',
  },
};
