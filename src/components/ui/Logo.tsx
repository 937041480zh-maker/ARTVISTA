'use client';

import Link from 'next/link';

// Logo SVG组件 - 艺术化A字logo
export function Logo({ className = '', size = 32 }: { className?: string; size?: number }) {
    return (
        <svg 
            width={size} 
            height={size} 
            viewBox="0 0 32 32" 
            fill="none" 
            className={className}
        >
            <defs>
                <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#9933B3" />
                    <stop offset="50%" stopColor="#B34DE6" />
                    <stop offset="100%" stopColor="#CC66FF" />
                </linearGradient>
                <filter id="logoGlow">
                    <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
                    <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>
            {/* A字主体 */}
            <path 
                d="M16 4L4 28h6l3-6h6l3 6h6L16 4zm0 10l3 6h-6l3-6z" 
                fill="url(#logoGradient)" 
                filter="url(#logoGlow)"
            />
            {/* 高光 */}
            <path 
                d="M16 4L14 8L16 7L18 8L16 4z" 
                fill="#FFFFFF" 
                fillOpacity="0.6"
            />
        </svg>
    );
}

// Logo完整组件 - 带链接
export function SiteLogo({ showText = true, size = 32 }: { showText?: boolean; size?: number }) {
    return (
        <Link href="/" className="flex items-center gap-2 group">
            <Logo size={size} className="transition-transform duration-300 group-hover:scale-110" />
            {showText && (
                <span className="text-white font-light tracking-[0.2em] text-sm md:text-base">ARTVISTA</span>
            )}
        </Link>
    );
}
