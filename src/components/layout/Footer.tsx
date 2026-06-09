'use client';

import Link from 'next/link';
import { Github, Twitter, Instagram } from 'lucide-react';
import { motion } from 'framer-motion';
import { Logo } from '@/components/ui/Logo';

const footerLinks = {
  platform: [
    { label: '首页', href: '/' },
    { label: '发现作品', href: '/discover' },
    { label: '上传作品', href: '/upload' },
    { label: '关于平台', href: '/about' },
  ],
  resources: [
    { label: '平台故事', href: '/about' },
    { label: '联系我们', href: '/about' },
    { label: '常见问题', href: '/about' },
    { label: '用户协议', href: '/about' },
  ],
};

const socialLinks = [
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Github, href: '#', label: 'Github' },
];

export function Footer() {
  return (
    <footer className="border-t border-white/[0.08] bg-[#0a0a0a]/40 backdrop-blur-2xl">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6 group">
              <Logo size={36} className="transition-transform duration-300 group-hover:scale-110" />
              <span className="text-white font-light tracking-[0.15em] text-lg">artvista</span>
            </Link>
            <p className="text-white/50 text-sm leading-relaxed max-w-sm">
              专注于交互艺术、生成艺术和实时视觉作品的垂直展示与轻交易平台。
              在这里，代码化作艺术，创意无限延展。
            </p>
            <div className="flex gap-3 mt-6">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-9 h-9 rounded-full bg-white/[0.05] border border-white/[0.1] backdrop-blur-sm flex items-center justify-center text-white/50 hover:text-white hover:bg-white/[0.1] transition-colors"
                >
                  <social.icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-medium text-sm text-white/80 mb-5">导航</h4>
            <ul className="space-y-3.5">
              {footerLinks.platform.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/40 text-sm hover:text-white/70 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="font-medium text-sm text-white/80 mb-5">关于</h4>
            <ul className="space-y-3.5">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/40 text-sm hover:text-white/70 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-white/[0.05]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/30 text-xs">
              © 2026 Artvista. All rights reserved.
            </p>
            <p className="text-white/30 text-xs">
              用热爱与代码打造
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
