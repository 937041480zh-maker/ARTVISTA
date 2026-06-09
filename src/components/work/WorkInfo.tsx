'use client';

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/Badge';
import { Work } from '@/lib/types';

interface WorkInfoProps {
  work: Work;
}

export function WorkInfo({ work }: WorkInfoProps) {
  return (
    <div className="space-y-8">
      {/* Title and category */}
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold text-white tracking-tight mb-3">
          {work.title}
        </h1>
        <div className="flex items-center gap-3 text-white/40 text-sm">
          <span style={{ color: work.category.color }}>{work.category.name}</span>
          <span className="text-white/20">·</span>
          <span>{work.createdAt}</span>
        </div>
      </div>

      {/* Description */}
      <div>
        <p className="text-white/60 leading-relaxed text-base">
          {work.description}
        </p>
      </div>

      {/* Use cases */}
      <div>
        <h3 className="font-medium text-sm text-white/80 mb-3">
          使用场景
        </h3>
        <div className="flex flex-wrap gap-2">
          {work.useCases.map((useCase) => (
            <Badge key={useCase} variant="outline">
              {useCase}
            </Badge>
          ))}
        </div>
      </div>

      {/* Technical tags */}
      <div>
        <h3 className="font-medium text-sm text-white/80 mb-3">
          技术标签
        </h3>
        <div className="flex flex-wrap gap-2">
          {work.tags.map((tag) => (
            <Badge key={tag} variant="tech">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-8 pt-5 border-t border-white/10">
        <div className="flex items-center gap-2 text-white/40 text-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <span>{work.views.toLocaleString()} 浏览</span>
        </div>
        <div className="flex items-center gap-2 text-white/40 text-sm">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
          <span>{work.likes.toLocaleString()} 喜欢</span>
        </div>
      </div>
    </div>
  );
}
