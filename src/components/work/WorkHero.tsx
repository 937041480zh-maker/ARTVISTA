'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { Work } from '@/lib/types';

interface WorkHeroProps {
  work: Work;
}

export function WorkHero({ work }: WorkHeroProps) {
  const [isPlaying, setIsPlaying] = useState(true);

  return (
    <section className="relative">
      {/* Hero Image/Video */}
      <div className="relative aspect-[21/9] max-h-[65vh] bg-background-surface overflow-hidden">
        <Image
          src={work.mediaUrl}
          alt={work.title}
          fill
          className="object-cover"
          priority
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background-primary via-transparent to-transparent opacity-80" />
        
        {/* Play button for video */}
        {work.mediaType === 'video' && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: isPlaying ? 0 : 1, scale: isPlaying ? 0.9 : 1 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => setIsPlaying(!isPlaying)}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center"
          >
            <Play className="w-6 h-6 text-white ml-0.5" fill="white" />
          </motion.button>
        )}

        {/* Category badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-6 left-6"
        >
          <span
            className="px-3.5 py-1.5 rounded-full text-xs font-medium backdrop-blur-md"
            style={{ 
              backgroundColor: `${work.category.color}25`, 
              color: work.category.color,
              border: `1px solid ${work.category.color}40`
            }}
          >
            {work.category.name}
          </span>
        </motion.div>
      </div>
    </section>
  );
}
