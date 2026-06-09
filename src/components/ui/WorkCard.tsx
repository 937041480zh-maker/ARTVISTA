'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Work } from '@/lib/types';
import { Badge } from './Badge';
import { formatNumber } from '@/lib/utils';

interface WorkCardProps {
  work: Work;
  onClick?: () => void;
  className?: string;
}

export function WorkCard({ work, onClick, className }: WorkCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      onClick={onClick}
      className={cn(
        'group cursor-pointer rounded-xl overflow-hidden bg-background-surface/50',
        'border border-transparent hover:border-border-hover',
        'backdrop-blur-sm transition-all duration-300',
        className
      )}
    >
      {/* Image Area */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={work.coverImage}
          alt={work.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* View Details Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="px-4 py-2 rounded-full text-xs font-medium text-white bg-white/10 backdrop-blur-md border border-white/20">
            查看详情
          </span>
        </div>
        
        {/* Category Badge */}
        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Badge 
            variant="default" 
            style={{ 
              backgroundColor: `${work.category.color}20`, 
              color: work.category.color, 
              borderColor: `${work.category.color}30` 
            }}
          >
            {work.category.name}
          </Badge>
        </div>
      </div>
      
      {/* Info Area */}
      <div className="p-4">
        <h3 className="font-medium text-white text-base mb-3 group-hover:text-accent transition-colors tracking-tight">
          {work.title}
        </h3>
        {/* 作者头像 + 名字 */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-full overflow-hidden border border-white/20">
            <Image
              src={work.author.avatar}
              alt={work.author.name}
              width={24}
              height={24}
              className="object-cover"
            />
          </div>
          <span className="text-white/50 text-sm">
            {work.author.name}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {work.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="text-xs text-text-muted font-mono">
                {tag}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-4 text-text-muted text-xs">
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {formatNumber(work.views)}
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              {formatNumber(work.likes)}
            </span>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
