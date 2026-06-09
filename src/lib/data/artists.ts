import { Artist } from '@/lib/types';

export const mockArtists: Artist[] = [];

export function getArtistById(id: string): Artist | undefined {
  return mockArtists.find((artist) => artist.id === id);
}

export function getArtistByUsername(username: string): Artist | undefined {
  return mockArtists.find((artist) => artist.username === username);
}

export function getAllArtists(): Artist[] {
  return mockArtists;
}
