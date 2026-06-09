'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { WorkCard } from '@/components/ui/WorkCard';
import { Button } from '@/components/ui/Button';
import { Work } from '@/lib/types';

interface RelatedWorksProps {
  works: Work[];
}

export function RelatedWorks({ works }: RelatedWorksProps) {
  if (works.length === 0) return null;

  return (
    <section className="py-16 border-t border-border/50">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto px-6 lg:px-8"
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-lg font-medium text-text-primary">
            相关推荐
          </h2>
          <Link href="/discover">
            <Button variant="ghost" size="sm" icon={<ArrowRight className="w-4 h-4" />} iconPosition="right">
              查看全部
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {works.map((work, index) => (
            <motion.div
              key={work.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
            >
              <Link href={`/artwork/${work.id}`}>
                <WorkCard work={work} />
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
