'use client';
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

const cards = [
  { id: '1', color: '#1a1a2e' },
  { id: '2', color: '#16213e' },
  { id: '3', color: '#0f3460' },
  { id: '4', color: '#533483' },
];

const W = 72;
const GAP = 8;
const STEP = W + GAP;

function Row({ controlled, label, scrollLeft }: {
  controlled: boolean;
  label: string;
  scrollLeft: number;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-xs text-neutral-500 font-medium">{label}</span>
      <div className="overflow-hidden rounded-md" style={{ width: W * 3 + GAP * 2 }}>
        <motion.div
          className="flex"
          style={{ gap: GAP }}
          animate={controlled
            ? { x: -scrollLeft }
            : { x: -scrollLeft }
          }
          transition={controlled
            ? { type: 'tween', duration: 0.1, ease: 'linear' }
            : { type: 'spring', stiffness: 300, damping: 30 }
          }
        >
          {cards.map((card) => (
            <div
              key={card.id}
              style={{
                width: W,
                height: 100,
                borderRadius: 6,
                background: card.color,
                flexShrink: 0,
              }}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}

export default function CarouselScrollDemo() {
  const [scrollLeft, setScrollLeft] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
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
    if (dx < 0) nudgeRight();
    else nudgeLeft();
    touchStartX.current = null;
    touchStartY.current = null;
  };

  const maxScroll = STEP * 2;

  const nudgeLeft = () => setScrollLeft(s => Math.max(0, s - STEP));
  const nudgeRight = () => setScrollLeft(s => Math.min(maxScroll, s + STEP));

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let startX = 0;
    let startY = 0;

    const onTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
      const dx = e.touches[0].clientX - startX;
      const dy = e.touches[0].clientY - startY;
      // if horizontal swipe dominates, block page scroll
      if (Math.abs(dx) > Math.abs(dy)) {
        e.preventDefault();
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - startX;
      const dy = e.changedTouches[0].clientY - startY;
      if (Math.abs(dx) < 20 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
      if (dx < 0) setScrollLeft(s => Math.min(maxScroll, s + STEP));
      else setScrollLeft(s => Math.max(0, s - STEP));
    };

    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    el.addEventListener('touchend', onTouchEnd, { passive: true });
    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
    };
  }, [maxScroll]);

  return (
    <div
      ref={containerRef}
      className="w-full flex flex-col items-center gap-8 py-10 px-6 rounded-xl bg-neutral-900"
    >
      <div className="flex flex-col items-center gap-12 w-full">
        <Row controlled={true} label="State-driven transform" scrollLeft={scrollLeft} />
        <div style={{ height: 1, width: 120, background: 'rgba(255,255,255,0.06)' }} />
        <Row controlled={false} label="Spring follow" scrollLeft={scrollLeft} />
      </div>
      <p style={{
        fontSize: 11,
        color: 'rgba(255,255,255,0.25)',
        fontFamily: 'var(--font-geist-mono), monospace',
        letterSpacing: '0.04em',
        margin: 0,
        textAlign: 'center',
      }}>
        swipe to scroll · click arrows to nudge
        <br />
        Tap or click to spring lift
      </p>
      <div className="flex gap-3">
        <button
          onClick={nudgeLeft}
          disabled={scrollLeft === 0}
          className="px-5 py-2 rounded-full text-sm font-medium bg-white text-neutral-900 hover:bg-neutral-200 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
        >
          ←
        </button>
        <button
          onClick={nudgeRight}
          disabled={scrollLeft >= maxScroll}
          className="px-5 py-2 rounded-full text-sm font-medium bg-white text-neutral-900 hover:bg-neutral-200 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
        >
          →
        </button>
      </div>
    </div>
  );
}
