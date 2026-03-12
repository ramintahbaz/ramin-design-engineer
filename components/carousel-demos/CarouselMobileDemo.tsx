'use client';
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';

const cards = [
  { id: '1', color: '#1a1a2e' },
  { id: '2', color: '#16213e' },
  { id: '3', color: '#0f3460' },
];

const W = 72;
const H = 100;
const GAP = 8;

function Row({ focusIndex, animated, label }: {
  focusIndex: number;
  animated: boolean;
  label: string;
}) {
  const containerWidth = cards.length * (W + GAP) - GAP;
  const centerX = containerWidth / 2;

  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-xs text-neutral-500 font-medium">{label}</span>
      <div className="flex" style={{ gap: GAP }}>
        {cards.map((card, index) => {
          const cardCenter = index * (W + GAP) + W / 2;
          const distanceFromCenter = Math.abs(cardCenter - centerX);
          const focusZone = W * 0.6;
          const scaleProgress = Math.max(0, Math.min(1, 1 - (distanceFromCenter / focusZone)));
          const isInFocus = index === focusIndex;

          const scale = animated
            ? (isInFocus ? 1.1 : 0.9 + scaleProgress * 0.2)
            : 1;
          const y = animated && isInFocus ? -8 : 0;
          const shadow = animated && isInFocus
            ? '0 12px 24px rgba(0,0,0,0.5)'
            : '0 2px 6px rgba(0,0,0,0.2)';

          return (
            <motion.div
              key={card.id}
              animate={{ scale, y, boxShadow: shadow }}
              transition={{
                type: 'tween',
                duration: 0.4,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              style={{
                width: W,
                height: H,
                borderRadius: 6,
                background: card.color,
                flexShrink: 0,
                position: 'relative',
                zIndex: isInFocus ? 10 : 1,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

export default function CarouselMobileDemo() {
  const [focusIndex, setFocusIndex] = useState(1);

  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(dx) < 20 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    if (dx < 0) next();
    else prev();
    touchStartX.current = null;
    touchStartY.current = null;
  };

  const prev = () => setFocusIndex(i => Math.max(0, i - 1));
  const next = () => setFocusIndex(i => Math.min(cards.length - 1, i + 1));

  return (
    <div
      className="w-full flex flex-col items-center gap-8 py-10 px-6 rounded-xl bg-neutral-900"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="flex flex-col items-center gap-12 w-full">
        <Row focusIndex={focusIndex} animated={true} label="Focus scaling on" />
        <div style={{ height: 1, width: 120, background: 'rgba(255,255,255,0.06)' }} />
        <Row focusIndex={focusIndex} animated={false} label="Focus scaling off" />
      </div>
      <p style={{
        fontSize: 11,
        color: 'rgba(255,255,255,0.25)',
        fontFamily: 'var(--font-geist-mono), monospace',
        letterSpacing: '0.04em',
        margin: 0,
        textAlign: 'center',
      }}>
        swipe to scroll · click arrows to focus
      </p>
      <div className="flex gap-3">
        <button
          onClick={prev}
          disabled={focusIndex === 0}
          className="px-5 py-2 rounded-full text-sm font-medium bg-white text-neutral-900 hover:bg-neutral-200 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
        >
          ←
        </button>
        <button
          onClick={next}
          disabled={focusIndex === cards.length - 1}
          className="px-5 py-2 rounded-full text-sm font-medium bg-white text-neutral-900 hover:bg-neutral-200 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
        >
          →
        </button>
      </div>
    </div>
  );
}
