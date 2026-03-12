'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const cards = [
  { id: '1', color: '#1a1a2e' },
  { id: '2', color: '#16213e' },
  { id: '3', color: '#0f3460' },
];

const W = 72;
const H = 100;
const GAP = 8;

function Row({ animated, label }: {
  animated: boolean;
  label: string;
}) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-xs text-neutral-500 font-medium">{label}</span>
      <div className="flex" style={{ gap: GAP }}>
        {cards.map((card, index) => {
          const isHovered = hoveredIndex === index;
          return (
            <motion.div
              key={card.id}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              animate={{
                scale: animated && isHovered ? 1.15 : 1,
                y: animated && isHovered ? -10 : 0,
                boxShadow: animated && isHovered
                  ? '0 12px 28px rgba(0,0,0,0.5)'
                  : '0 2px 6px rgba(0,0,0,0.2)',
              }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 30,
                mass: 0.8,
              }}
              style={{
                width: W,
                height: H,
                borderRadius: 6,
                background: card.color,
                flexShrink: 0,
                cursor: 'pointer',
                position: 'relative',
                zIndex: isHovered ? 10 : 1,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

export default function CarouselHoverDemo() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(typeof window !== 'undefined' && window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <div className="w-full flex flex-col items-center gap-8 py-10 px-6 rounded-xl bg-neutral-900">
      <div className="flex flex-col items-center gap-12 w-full">
        <Row animated={true} label="Spring lift" />
        <div style={{ height: 1, width: 120, background: 'rgba(255,255,255,0.06)' }} />
        <Row animated={false} label="No lift" />
      </div>
      <p style={{
        fontSize: 11,
        color: 'rgba(255,255,255,0.25)',
        fontFamily: 'var(--font-geist-mono), monospace',
        letterSpacing: '0.04em',
        margin: 0,
        textAlign: 'center',
      }}>
        {isMobile ? 'tap' : 'hover'} to compare spring lift vs no lift
      </p>
    </div>
  );
}
