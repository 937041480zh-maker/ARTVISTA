'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Search, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/ui/Logo';

const homeNavLinks = [
  { href: '/discover', label: '发现' },
  { href: '/categories', label: '分类' },
  { href: '/upload', label: '上传' },
  { href: '/register', label: '注册' },
];

const navLinks = [
  { href: '/', label: '首页' },
  { href: '/discover', label: '发现' },
  { href: '/categories', label: '分类' },
  { href: '/upload', label: '上传' },
  { href: '/about', label: '关于' },
];

export function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHomePage = pathname === '/';

  if (isHomePage) {
    return null;
  }

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled
            ? 'bg-black/90 backdrop-blur-xl border-b border-white/5'
            : 'bg-black/80 backdrop-blur-lg'
        )}
      >
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <Logo size={28} className="transition-transform duration-300 group-hover:scale-110" />
              <span className="text-white font-light tracking-[0.15em] text-sm">ARTVISTA</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'text-xs transition-colors duration-200',
                    pathname === link.href
                      ? 'text-white'
                      : 'text-white/50 hover:text-white'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Actions - 右侧图标 + 搜索框展开 */}
            <div className="hidden md:flex items-center gap-3">
              {/* 搜索按钮 + 展开搜索框 */}
              <div 
                className="relative flex items-center"
                onMouseEnter={() => setIsSearchOpen(true)}
                onMouseLeave={() => setIsSearchOpen(false)}
              >
                <motion.button 
                  className="p-2 text-white/50 hover:text-white transition-colors relative z-10"
                >
                  <Search className="w-4 h-4" />
                </motion.button>
                
                <AnimatePresence>
                  {isSearchOpen && (
                    <motion.div
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: 200, opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <input
                        type="text"
                        placeholder="搜索更多..."
                        className="w-full h-8 pl-3 pr-4 bg-white/10 border border-white/20 rounded-full text-xs text-white placeholder:text-white/40 focus:outline-none"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {/* 头像框 */}
              <Link href="/profile" className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/15 transition-colors">
                <User className="w-4 h-4" />
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-white/70 hover:text-white transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 md:hidden"
          >
            <div
              className="absolute inset-0 bg-black/90 backdrop-blur-xl"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-[280px] bg-black/95 backdrop-blur-xl border-l border-white/10 p-6"
            >
              <button
                className="absolute top-4 right-4 p-2 text-white/70 hover:text-white"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X className="w-5 h-5" />
              </button>

              <nav className="mt-16 flex flex-col gap-4">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        'text-base py-2 transition-colors',
                        pathname === link.href
                          ? 'text-white'
                          : 'text-white/50 hover:text-white'
                      )}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
