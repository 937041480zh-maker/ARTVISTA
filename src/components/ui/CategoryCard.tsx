'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Category } from '@/lib/types';
import * as Icons from 'lucide-react';

interface CategoryCardProps {
  category: Category;
  onClick?: () => void;
  className?: string;
}

export function CategoryCard({ category, onClick, className }: CategoryCardProps) {
  const IconComponent = (Icons as any)[category.icon.charAt(0).toUpperCase() + category.icon.slice(1).replace(/-./g, x => x[1].toUpperCase())] || Icons.Circle;
  
  return (
    <motion.article
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      onClick={onClick}
      className={cn(
        'group cursor-pointer p-5 rounded-xl',
        'bg-background-surface/30 backdrop-blur-sm',
        'border border-transparent hover:border-border-hover',
        'transition-all duration-300',
        className
      )}
    >
      <div className="flex flex-col items-center text-center">
        {/* Icon */}
        <div 
          className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
          style={{ 
            backgroundColor: `${category.color}15`, 
            color: category.color 
          }}
        >
          <IconComponent className="w-5 h-5" />
        </div>
        
        {/* Name */}
        <h3 className="font-medium text-text-primary text-sm mb-1.5 group-hover:text-accent transition-colors">
          {category.name}
        </h3>
        
        {/* Count */}
        <p className="text-text-muted text-xs">
          {category.count} 件作品
        </p>
      </div>
    </motion.article>
  );
}
