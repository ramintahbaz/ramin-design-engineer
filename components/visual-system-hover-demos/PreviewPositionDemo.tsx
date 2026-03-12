'use client';
import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

const cards = [
  {
    id: 'left',
    title: 'Left column',
    year: '1987',
    color: 'rgba(42,42,42,0.8)',
    isLeft: true,
    previewColor: '#16213e',
  },
  {
    id: 'right',
    title: 'Right column',
    year: '2007',
    color: 'rgba(58,42,26,0.8)',
    isLeft: false,
    previewColor: '#16213e',
  },
];

const POPOVER_SIZE = 64;
const GAP = 8;

export default function PreviewPositionDemo() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [popoverRect, setPopoverRect] = useState<{ left: number; top: number } | null>(null);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const lastHoveredIdRef = useRef<string | null>(null);
  if (hoveredId) lastHoveredIdRef.current = hoveredId;
  const popoverCardId = hoveredId ?? lastHoveredIdRef.current;

  useEffect(() => {
    if (hoveredId === null) {
      const t = setTimeout(() => {
        setPopoverRect(null);
        lastHoveredIdRef.current = null;
      }, 250);
      return () => clearTimeout(t);
    }
    const card = cards.find((c) => c.id === hoveredId);
    const el = card ? cardRefs.current[card.id] : null;
    if (!el || !card) return;
    const rect = el.getBoundingClientRect();
    const left = card.isLeft ? rect.right + GAP : rect.left - POPOVER_SIZE - GAP;
    const top = rect.top + rect.height / 2 - POPOVER_SIZE / 2;
    setPopoverRect({ left, top });
  }, [hoveredId]);

  return (
    <div className="w-full flex flex-col items-center gap-6 py-10 px-6 rounded-xl bg-neutral-900 overflow-visible">
      <div
        className="grid grid-cols-2 gap-1 overflow-visible"
        style={{ width: 280 }}
      >
        {cards.map((card) => {
          const isHovered = hoveredId === card.id;
          return (
            <motion.div
              key={card.id}
              ref={(el) => { cardRefs.current[card.id] = el; }}
              className="relative rounded-lg p-3 cursor-pointer overflow-visible"
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
                }}
                transition={{ duration: 0.2 }}
              />
              {/* Outer-edge stroke: left card = left edge, right card = right edge */}
              <motion.div
                className={`absolute top-0 bottom-0 w-px bg-white ${card.isLeft ? 'left-0 rounded-l-lg' : 'right-0 rounded-r-lg'}`}
                animate={{ opacity: isHovered ? 0.6 : 0 }}
                transition={{ duration: 0.2 }}
              />
              {/* Content */}
              <div
                className="relative z-10 h-full flex flex-col justify-between"
                style={{ fontFamily: 'var(--font-ibm-plex-mono), monospace' }}
              >
                <span className="text-white text-[10px] font-medium">{card.title}</span>
                <span className="text-white/60 text-[9px]">{card.year}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Preview popover in portal so it's not clipped by modal overflow-x */}
      {typeof document !== 'undefined' && popoverCardId && popoverRect && (() => {
        const card = cards.find((c) => c.id === popoverCardId)!;
        return createPortal(
          <AnimatePresence>
            <motion.div
              key={popoverCardId}
              initial={{ opacity: 0, scale: 0.8, x: card.isLeft ? 20 : -20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8, x: card.isLeft ? 20 : -20 }}
              transition={{ duration: 0.2 }}
              className="fixed z-[9999]"
              style={{
                left: popoverRect.left,
                top: popoverRect.top,
                width: POPOVER_SIZE,
                height: POPOVER_SIZE,
              }}
            >
              <div
                className="w-full h-full rounded-lg flex items-center justify-center"
                style={{
                  background: card.previewColor,
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <span
                  className="text-[8px] text-center leading-tight px-1"
                  style={{ fontFamily: 'var(--font-ibm-plex-mono), monospace', color: 'rgba(255,255,255,0.9)' }}
                >
                  {card.isLeft ? 'right →' : '← left'}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>,
          document.body
        );
      })()}
      <p
        className="text-neutral-600 text-[10px] text-center"
        style={{ fontFamily: 'var(--font-ibm-plex-mono), monospace' }}
      >
        Preview appears on the outside of each column
      </p>
    </div>
  );
}
