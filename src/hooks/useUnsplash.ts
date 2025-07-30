import { useState, useEffect } from 'react';

export interface UnsplashImage {
  id: string;
  urls: {
    small: string;
    regular: string;
    full: string;
  };
  alt_description?: string;
}

const UNSPLASH_ACCESS_KEY = 'YOUR_UNSPLASH_ACCESS_KEY'; // Replace with your actual key

export function useUnsplash() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchImages = async (query: string): Promise<UnsplashImage[]> => {
    if (!UNSPLASH_ACCESS_KEY || UNSPLASH_ACCESS_KEY === 'YOUR_UNSPLASH_ACCESS_KEY') {
      // Return mock data when no API key is provided
      return [
        {
          id: '1',
          urls: {
            small: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
            regular: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
            full: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4'
          },
          alt_description: 'Beautiful landscape'
        }
      ];
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=5`,
        {
          headers: {
            Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch images');
      }

      const data = await response.json();
      return data.results;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return { searchImages, isLoading, error };
}
