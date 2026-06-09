'use client';

import { useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useSpring, animated } from '@react-spring/web';
import { Logo } from '@/components/ui/Logo';

// 动态导入Three.js场景
const ThreeScene = dynamic(
    () => import('@/components/three/ThreeScene').then((mod) => mod.ThreeScene),
    { ssr: false, loading: () => <div className="w-full h-screen" /> }
);

export function HeroSection() {
    const router = useRouter();
    const containerRef = useRef<HTMLDivElement>(null);
    const [isHovering, setIsHovering] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    
    // Spring动画
    const [{ progress }, api] = useSpring(() => ({
        progress: 0,
        config: { tension: 120, friction: 14 },
    }));
    
    // 鼠标进入
    const handleMouseEnter = useCallback(() => {
        setIsHovering(true);
        api.start({ progress: 1 });
    }, [api]);
    
    // 鼠标离开
    const handleMouseLeave = useCallback(() => {
        setIsHovering(false);
        api.start({ progress: 0 });
    }, [api]);
    
    // 鼠标移动
    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (!containerRef.current) return;
        
        const rect = containerRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        const y = -((e.clientY - rect.top) / rect.height - 0.5) * 2;
        
        setMousePos({ x, y });
    }, []);
    
    // 点击跳转
    const handleClick = useCallback(() => {
        router.push('/discover');
    }, [router]);
    
    return (
        <section
            ref={containerRef}
            className="relative w-full h-screen overflow-hidden cursor-pointer select-none"
            style={{ background: '#000000' }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
            onClick={handleClick}
        >
            {/* Three.js 紫色霓虹流体背景 */}
            <div className="absolute inset-0">
                <ThreeScene progress={progress.get()} />
            </div>
            
            {/* 导航栏 */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="absolute top-0 left-0 right-0 z-40 px-6 md:px-10 py-5 md:py-6 flex items-center justify-between"
            >
                <Link href="/" className="flex items-center gap-2 group" onClick={(e) => e.stopPropagation()}>
                    {/* 艺术化A字logo */}
                    <Logo size={32} className="transition-transform duration-300 group-hover:scale-110" />
                    {/* 品牌名 */}
                    <span className="text-white font-light tracking-[0.2em] text-sm md:text-base">ARTVISTA</span>
                </Link>
                
                <nav className="flex items-center gap-6 md:gap-8">
                    {[
                        { href: '/discover', label: '发现' },
                        { href: '/categories', label: '分类' },
                        { href: '/about', label: '关于' },
                        { href: '/register', label: '注册' },
                    ].map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-white/50 hover:text-white text-xs md:text-sm transition-colors duration-300 hidden sm:block"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>
            </motion.div>
            
            {/* 中心文字 */}
            <div className="relative z-30 flex flex-col items-center justify-center px-4" style={{ height: 'calc(100vh - 80px)' }}>
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="relative text-center"
                >
                    <h1 className="uppercase">
                        <motion.span
                            className="block text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-widest leading-relaxed md:leading-[1.3] whitespace-nowrap"
                            style={{
                                background: 'linear-gradient(to bottom, #ffffff 0%, #d4d0e0 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}
                            animate={{
                                letterSpacing: isHovering ? '0.08em' : '0.04em',
                            }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                        >
                            Art Is Not Limited
                        </motion.span>
                        <motion.span
                            className="block text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-widest leading-relaxed md:leading-[1.3] mt-1 md:mt-2 whitespace-nowrap"
                            style={{
                                background: 'linear-gradient(to bottom, #FFFFFF 0%, #FFFFFF 50%, #F0D8F8 60%, #B878D8 80%, #9955BB 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}
                            animate={{
                                letterSpacing: isHovering ? '0.08em' : '0.04em',
                            }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                        >
                            To Mere Viewing
                        </motion.span>
                    </h1>
                    
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isHovering ? 0.6 : 0.25 }}
                        transition={{ duration: 0.5 }}
                        className="mt-12 md:mt-16 text-white/30 text-[9px] md:text-[10px] tracking-[0.3em] md:tracking-[0.4em] uppercase"
                    >
                        {isHovering ? 'Release to Separate' : 'Hover to Connect'}
                    </motion.p>
                </motion.div>
            </div>
        </section>
    );
}
