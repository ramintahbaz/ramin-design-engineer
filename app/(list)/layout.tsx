'use client';

import { usePathname } from 'next/navigation';
import { useSplash } from '@/contexts/SplashContext';
import CraftPage from '@/app/craft/page';

/**
 * Keeps the craft list (CraftPage) mounted when navigating to /work/[id],
 * so when the user goes back the list and its cards/videos don't remount.
 * Visibility: show list when on / (or /craft) and splash is done; show children otherwise.
 */
export default function ListLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { splashDone } = useSplash();

  const showList = !pathname?.startsWith('/work') && splashDone;

  return (
    <>
      <div style={{ display: showList ? 'block' : 'none' }}>
        <CraftPage />
      </div>
      <div style={{ display: showList ? 'none' : 'block' }}>
        {children}
      </div>
    </>
  );
}
