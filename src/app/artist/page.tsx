'use client';

import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { MapPin, ExternalLink, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { WorkCard } from '@/components/ui/WorkCard';
import { getArtistById } from '@/lib/data/artists';
import { getWorksByAuthor } from '@/lib/data/works';
import { formatNumber } from '@/lib/utils';

export default function ArtistPage() {
  const searchParams = useSearchParams();
  const artistId = searchParams.get('artist') || 'artist-1';
  const artist = getArtistById(artistId);
  const works = artist ? getWorksByAuthor(artist.id) : [];

  if (!artist) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-medium text-text-primary mb-2">艺术家不存在</h1>
          <p className="text-text-secondary text-sm">该艺术家可能已被删除</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-primary">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 subtle-grid opacity-30" />
        <motion.div
          animate={{ opacity: [0.2, 0.3, 0.2] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-accent/8 rounded-full blur-[120px]"
        />

        <div className="relative max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row items-center md:items-start gap-8"
          >
            {/* Avatar */}
            <div className="relative">
              <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-border/50 shadow-lg">
                <Image
                  src={artist.avatar}
                  alt={artist.name}
                  width={112}
                  height={112}
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-success rounded-full border-2 border-background-primary" />
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-semibold text-text-primary tracking-tight mb-1">
                {artist.name}
              </h1>
              <p className="text-text-muted text-sm mb-4">{artist.username}</p>
              <p className="text-text-secondary text-sm max-w-lg mb-4 leading-relaxed">
                {artist.bio}
              </p>
              
              {/* Meta */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-text-muted text-xs mb-5">
                {artist.location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    {artist.location}
                  </span>
                )}
                {artist.website && (
                  <a
                    href={`https://${artist.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 hover:text-accent transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    {artist.website}
                  </a>
                )}
              </div>

              {/* Skills */}
              <div className="flex flex-wrap justify-center md:justify-start gap-2">
                {artist.skills.map((skill) => (
                  <Badge key={skill} variant="tech">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8 border-t border-b border-border/50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-center justify-center gap-16">
            {[
              { value: artist.stats.worksCount, label: '作品' },
              { value: formatNumber(artist.stats.followers), label: '关注者' },
              { value: formatNumber(artist.stats.views), label: '浏览' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl font-semibold text-text-primary tracking-tight mb-0.5">
                  {stat.value}
                </div>
                <div className="text-text-muted text-xs">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Works */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-medium text-text-primary">
              作品
            </h2>
            <span className="text-text-muted text-xs">{works.length} 个项目</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 bg-background-secondary/30 border-t border-border/50">
        <div className="max-w-md mx-auto px-6 text-center">
          <h2 className="text-lg font-medium text-text-primary mb-3">
            合作咨询
          </h2>
          <p className="text-text-secondary text-sm mb-6">
            对作品感兴趣？希望定制专属的交互视觉方案？
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button size="md" className="flex-1">
              <Link href="/contact" className="flex items-center justify-center gap-2 w-full">
                发送咨询
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button variant="secondary" size="md" className="flex-1">
              查看作品集
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
