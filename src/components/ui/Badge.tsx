'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { BadgeVariant } from '@/lib/types';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
  style?: React.CSSProperties;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-accent/15 text-accent border border-accent/20',
  outline: 'bg-transparent text-text-muted border border-border/50',
  tech: 'bg-background-surface/50 text-text-secondary border border-border/50 font-mono',
};

export function Badge({ children, variant = 'default', className, style }: BadgeProps) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        'inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium backdrop-blur-sm transition-colors duration-200',
        variantStyles[variant],
        className
      )}
      style={style}
    >
      {children}
    </motion.span>
  );
}
