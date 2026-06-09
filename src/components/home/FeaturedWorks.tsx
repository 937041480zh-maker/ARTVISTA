'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { WorkCard } from '@/components/ui/WorkCard';
import { Button } from '@/components/ui/Button';
import { getFeaturedWorks } from '@/lib/data/works';

export function FeaturedWorks() {
  const featuredWorks = getFeaturedWorks();

  return (
    <section className="py-24 bg-background-secondary/30">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold text-text-primary tracking-tight mb-2">
              精选作品
            </h2>
            <p className="text-text-secondary text-sm">
              来自全球优秀艺术家的精选交互艺术作品
            </p>
          </div>
          <Link href="/discover" className="hidden md:block">
            <Button variant="ghost" size="sm" icon={<ArrowRight className="w-4 h-4" />} iconPosition="right">
              查看全部
            </Button>
          </Link>
        </motion.div>

        {/* Works Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {featuredWorks.slice(0, 6).map((work, index) => (
            <motion.div
              key={work.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
            >
              <Link href={`/artwork/${work.id}`}>
                <WorkCard work={work} />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Mobile CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-8 text-center md:hidden"
        >
          <Link href="/discover">
            <Button variant="secondary" size="sm">查看全部作品</Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
