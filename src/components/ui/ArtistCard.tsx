'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Artist } from '@/lib/types';
import { Badge } from './Badge';
import { formatNumber } from '@/lib/utils';

interface ArtistCardProps {
  artist: Artist;
  onClick?: () => void;
  className?: string;
}

export function ArtistCard({ artist, onClick, className }: ArtistCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      className={cn(
        'group cursor-pointer p-5 rounded-xl bg-background-surface/50 backdrop-blur-sm',
        'border border-transparent hover:border-border-hover',
        'transition-all duration-300',
        className
      )}
    >
      <Link href={`/artist?artist=${artist.id}`}>
        <div className="flex flex-col items-center text-center">
          {/* Avatar */}
          <div className="relative mb-4">
            <div className="w-18 h-18 rounded-full overflow-hidden border border-border group-hover:border-accent/30 transition-colors">
              <Image
                src={artist.avatar}
                alt={artist.name}
                width={72}
                height={72}
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-success rounded-full border-2 border-background-surface" />
          </div>
          
          {/* Name & Bio */}
          <h3 className="font-medium text-text-primary text-sm mb-1.5 group-hover:text-accent transition-colors">
            {artist.name}
          </h3>
          <p className="text-text-muted text-xs mb-4 line-clamp-2 leading-relaxed">
            {artist.bio}
          </p>
          
          {/* Skills */}
          <div className="flex flex-wrap justify-center gap-1.5 mb-4">
            {artist.skills.slice(0, 3).map((skill) => (
              <Badge key={skill} variant="tech">
                {skill}
              </Badge>
            ))}
          </div>
          
          {/* Stats */}
          <div className="flex items-center justify-center gap-5 text-text-muted text-xs pt-4 border-t border-border/50 w-full">
            <span>{artist.stats.worksCount} 作品</span>
            <span className="text-border">|</span>
            <span>{formatNumber(artist.stats.views)} 浏览</span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
