'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { mockArtists } from '@/lib/data/artists';
import { ArtistCard } from '@/components/ui/ArtistCard';

export function FeaturedArtists() {
  return (
    <section className="py-24 bg-background-secondary/30">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-semibold text-text-primary tracking-tight mb-3">
            精选艺术家
          </h2>
          <p className="text-text-secondary text-sm max-w-md mx-auto">
            遇见专注于交互艺术领域的创意先驱
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {mockArtists.slice(0, 4).map((artist, index) => (
            <motion.div
              key={artist.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
            >
              <ArtistCard artist={artist} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
