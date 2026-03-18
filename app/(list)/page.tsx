'use client';

import { use } from 'react';
import { useState, useEffect, useCallback } from 'react';
import SplashScreen from '@/components/SplashScreen';
import { useSplash } from '@/contexts/SplashContext';

const EMPTY_SEARCH_PARAMS = Promise.resolve({} as { [key: string]: string | string[] | undefined });

export const photoboomMetadata = {
  id: 'photoboom',
  title: 'Photo boom',
  date: 'March 23, 2025',
  cardDate: 'Mar 2025',
  cardDescription: 'An exploding image gallery interaction.',
  href: '/photoboom',
  shareTitle: 'Photo boom — Ramin — Designer',
  shareText: 'An exploding image gallery interaction exploring motion as feedback.',
};

type PageProps = {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default function Home({ searchParams }: PageProps) {
  // Unwrap per Next.js 16: searchParams is a Promise and must not be enumerated or accessed directly
  use(searchParams ?? EMPTY_SEARCH_PARAMS);

  const [splashDone, setSplashDone] = useState(false);
  const { setSplashDone: setSplashDoneContext } = useSplash();

  useEffect(() => {
    (document.activeElement as HTMLElement)?.blur();
  }, []);

  useEffect(() => {
    if (localStorage.getItem('leftForWork') === 'true') {
      localStorage.removeItem('leftForWork');
      setSplashDone(true);
      setSplashDoneContext(true);
    }
  }, [setSplashDoneContext]);

  const handleComplete = useCallback(() => {
    setSplashDone(true);
    setSplashDoneContext(true);
    if (typeof sessionStorage !== 'undefined') sessionStorage.setItem('splashDone', 'true');
  }, [setSplashDoneContext]);

  // List (CraftPage) is rendered by (list)/layout when splashDone; we only render splash here
  return (
    <>
      {!splashDone && <SplashScreen onComplete={handleComplete} />}
      <div className={!splashDone ? 'splash-hidden' : ''} />
    </>
  );
}
