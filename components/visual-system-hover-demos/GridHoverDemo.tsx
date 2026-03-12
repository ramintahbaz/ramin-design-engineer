'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';

const cards = [
  { id: '1', color: 'rgba(42,42,42,0.8)', title: 'Michael Jordan', year: '1987' },
  { id: '2', color: 'rgba(58,42,26,0.8)', title: 'Steve Jobs', year: '2007' },
  { id: '3', color: 'rgba(42,42,42,0.8)', title: 'Robin Williams', year: '2001' },
  { id: '4', color: 'rgba(42,42,42,0.8)', title: 'Mr. Rogers', year: '1997' },
];

export default function GridHoverDemo() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="w-full flex flex-col items-center gap-6 py-10 px-6 rounded-xl bg-neutral-900">
      <div
        className="grid grid-cols-2 gap-1 w-full"
        style={{ maxWidth: 320 }}
      >
        {cards.map((card) => {
          const isHovered = hoveredId === card.id;
          return (
            <motion.div
              key={card.id}
              className="relative rounded-lg p-3 cursor-pointer overflow-hidden"
              style={{ backgroundColor: card.color, height: 72 }}
              animate={{
                opacity: hoveredId === null ? 1 : isHovered ? 1 : 0.6,
                scale: isHovered ? 0.98 : 1,
              }}
              transition={{ type: 'tween', duration: 0.2, ease: 'easeOut' }}
              onMouseEnter={() => setHoveredId(card.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Border */}
              <motion.div
                className="absolute inset-0 rounded-lg border"
                animate={{
                  borderColor: isHovered
                    ? 'rgba(255,255,255,0.45)'
                    : 'rgba(255,255,255,0.1)',
                  boxShadow: isHovered
                    ? 'inset 0 2px 4px rgba(0,0,0,0.2)'
                    : 'none',
                }}
                transition={{ duration: 0.2 }}
              />
              {/* Left stroke */}
              <motion.div
                className="absolute left-0 top-0 bottom-0 w-px bg-white rounded-l-lg"
                animate={{ opacity: isHovered ? 0.6 : 0 }}
                transition={{ duration: 0.2 }}
              />
              {/* Content */}
              <div
                className="relative z-10 h-full flex flex-col justify-between"
                style={{ fontFamily: 'var(--font-ibm-plex-mono), monospace' }}
              >
                <span className="text-white text-[10px] font-medium leading-tight line-clamp-1">
                  {card.title}
                </span>
                <span className="text-white/60 text-[9px]">{card.year}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
