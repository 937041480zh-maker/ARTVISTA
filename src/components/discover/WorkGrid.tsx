'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { WorkCard } from '@/components/ui/WorkCard';
import { Work } from '@/lib/types';

interface WorkGridProps {
  works: Work[];
}

export function WorkGrid({ works }: WorkGridProps) {
  return (
    <div className="max-w-6xl mx-auto px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {works.map((work, index) => (
          <motion.div
            key={work.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
          >
            <Link href={`/artwork/${work.id}`}>
              <WorkCard work={work} />
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {works.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-24"
        >
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-background-surface/50 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-text-muted"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-text-primary mb-2">暂无作品</h3>
          <p className="text-text-secondary text-sm">尝试其他筛选条件</p>
        </motion.div>
      )}
    </div>
  );
}
