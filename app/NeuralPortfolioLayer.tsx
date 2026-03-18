'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useSplash } from '@/contexts/SplashContext';
import NeuralPortfolio from '@/components/NeuralPortfolio';

export default function NeuralPortfolioLayer() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { splashDone } = useSplash();
  const showNeural = pathname === '/' && (searchParams.get('view') === 'neural' || !splashDone);
  const isExplicitNeuralView = searchParams.get('view') === 'neural';
  const splashMode = pathname === '/' && !splashDone;
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: showNeural && isExplicitNeuralView ? 2 : 0,
        display: showNeural ? 'block' : 'none',
      }}
    >
      <NeuralPortfolio isLayerVisible={showNeural} splashMode={splashMode} />
    </div>
  );
}
