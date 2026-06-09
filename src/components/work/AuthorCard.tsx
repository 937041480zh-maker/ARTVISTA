'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Artist } from '@/lib/types';
import { formatNumber } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { MapPin, ExternalLink } from 'lucide-react';

interface AuthorCardProps {
  author: Artist;
}

export function AuthorCard({ author }: AuthorCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-5 rounded-2xl backdrop-blur-xl bg-white/[0.03] border border-white/[0.08]"
    >
      {/* Author Info */}
      <div className="flex items-start gap-4 mb-4">
        <div className="relative">
          <Image
            src={author.avatar}
            alt={author.name}
            width={56}
            height={56}
            className="w-14 h-14 rounded-full object-cover border border-white/20"
          />
          <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-success rounded-full border-2 border-black" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-white text-sm mb-0.5">
            {author.name}
          </h3>
          <p className="text-white/40 text-xs truncate">
            {author.username}
          </p>
          {author.location && (
            <div className="flex items-center gap-1 text-white/40 text-xs mt-1">
              <MapPin className="w-3 h-3" />
              {author.location}
            </div>
          )}
        </div>
      </div>

      {/* Bio */}
      <p className="text-white/50 text-xs mb-4 line-clamp-2 leading-relaxed">
        {author.bio}
      </p>

      {/* Skills */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {author.skills.slice(0, 3).map((skill) => (
          <Badge key={skill} variant="tech">
            {skill}
          </Badge>
        ))}
      </div>

      {/* Stats */}
      <div className="flex items-center gap-5 text-xs text-white/40 mb-4 pt-4 border-t border-white/5">
        <div>
          <span className="font-medium text-white">{author.stats.worksCount}</span> 作品
        </div>
        <div>
          <span className="font-medium text-white">{formatNumber(author.stats.views)}</span> 浏览
        </div>
      </div>

      {/* Action */}
      <Link href={`/profile?artist=${author.id}`}>
        <Button variant="secondary" size="sm" className="w-full" icon={<ExternalLink className="w-3.5 h-3.5" />}>
          查看主页
        </Button>
      </Link>
    </motion.div>
  );
}
