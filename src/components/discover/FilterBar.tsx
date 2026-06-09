'use client';

import Link from 'next/link';
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Menu, X, ChevronDown, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { categories } from '@/lib/data/categories';
import { Logo } from '@/components/ui/Logo';

const navLinks = [
  { href: '/', label: '首页' },
  { href: '/discover', label: '发现', hasDropdown: true },
  { href: '/upload', label: '上传' },
  { href: '/about', label: '关于' },
];

interface FilterBarProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function FilterBar({
  selectedCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
}: FilterBarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDiscoverOpen, setIsDiscoverOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsDiscoverOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsDiscoverOpen(false);
    }, 150);
  };

  return (
    <div className="sticky top-0 z-40 bg-black/90 backdrop-blur-xl border-b border-white/5">
      {/* 顶部导航栏 */}
      <div className="px-6 md:px-10 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Logo size={28} className="transition-transform duration-300 group-hover:scale-110" />
            <span className="text-white font-light tracking-[0.15em] text-sm">ARTVISTA</span>
          </Link>

          {/* 桌面端导航 */}
          <nav className="hidden md:flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link) => (
              <div key={link.href} className="relative">
                {link.hasDropdown ? (
                  <div
                    className="relative"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <button className={cn(
                      'flex items-center gap-1 text-xs transition-colors duration-200',
                      'text-white'
                    )}>
                      {link.label}
                      <ChevronDown className={cn(
                        'w-3 h-3 transition-transform duration-200',
                        isDiscoverOpen && 'rotate-180'
                      )} />
                    </button>

                    {/* 下拉菜单 */}
                    <AnimatePresence>
                      {isDiscoverOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.15 }}
                          className="absolute top-full left-1/2 -translate-x-1/2 mt-3 px-3 py-2 rounded-2xl backdrop-blur-xl bg-black/80 border border-white/10 min-w-[180px]"
                          onMouseEnter={handleMouseEnter}
                          onMouseLeave={handleMouseLeave}
                        >
                          {/* 全部 */}
                          <motion.button
                            onClick={() => {
                              onCategoryChange('all');
                              setIsDiscoverOpen(false);
                            }}
                            whileHover={{ scale: 1.02 }}
                            className={cn(
                              'group relative w-full text-left px-3 py-2.5 rounded-xl text-xs transition-all duration-200 overflow-hidden',
                              selectedCategory === 'all'
                                ? 'text-white'
                                : 'text-white/60 hover:text-white'
                            )}
                          >
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-[#7c3aed]/60 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                              initial={{ scale: 0.8 }}
                              whileHover={{ scale: 1 }}
                            />
                            <span className="relative z-10 flex justify-center">全部</span>
                          </motion.button>

                          {/* 分类选项 */}
                          {categories.map((category) => (
                            <Link
                              key={category.id}
                              href={`/categories/${category.slug}`}
                            >
                              <motion.span
                                whileHover={{ scale: 1.02 }}
                                className={cn(
                                  'group relative w-full text-left px-3 py-2.5 rounded-xl text-xs transition-all duration-200 overflow-hidden block',
                                  selectedCategory === category.slug
                                    ? 'text-white'
                                    : 'text-white/60 hover:text-white'
                                )}
                              >
                                <motion.div
                                  className="absolute inset-0 bg-gradient-to-r from-[#7c3aed]/60 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                  initial={{ scale: 0.8 }}
                                  whileHover={{ scale: 1 }}
                                />
                                <span className="relative z-10 flex justify-center">{category.name}</span>
                              </motion.span>
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    href={link.href}
                    className={cn(
                      'text-xs transition-colors duration-200',
                      link.href === '/discover'
                        ? 'text-white'
                        : 'text-white/50 hover:text-white'
                    )}
                  >
                    {link.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* 桌面端右侧图标 */}
          <div className="hidden md:flex items-center gap-3">
            {/* 搜索按钮 */}
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
                      value={searchQuery}
                      onChange={(e) => onSearchChange(e.target.value)}
                      className="w-full h-8 pl-3 pr-4 bg-white/10 border border-white/20 rounded-full text-xs text-white placeholder:text-white/40 focus:outline-none"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <Link href="/profile" className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/15 transition-colors">
              <User className="w-4 h-4" />
            </Link>
          </div>

          {/* 移动端菜单按钮 */}
          <button
            className="md:hidden p-2 text-white/70 hover:text-white transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* 移动端菜单 */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden border-t border-white/5 bg-black/95"
        >
          <nav className="px-6 py-4 flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm py-2 transition-colors',
                  link.href === '/discover'
                    ? 'text-white'
                    : 'text-white/50 hover:text-white'
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            
            {/* 移动端分类 */}
            <div className="pt-2 border-t border-white/5">
              <p className="text-white/30 text-xs mb-2">分类</p>
              <Link
                href="/discover"
                className={cn(
                  'block px-3 py-2 rounded-lg text-xs',
                  selectedCategory === 'all'
                    ? 'bg-[#7c3aed] text-white'
                    : 'text-white/50'
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                全部
              </Link>
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/categories/${category.slug}`}
                  className={cn(
                    'block px-3 py-2 rounded-lg text-xs',
                    selectedCategory === category.slug
                      ? 'text-white'
                      : 'text-white/50'
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </nav>
        </motion.div>
      )}
    </div>
  );
}
