'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const mediaItems = [
  { id: '1', type: 'image' as const, src: '/images/thistrackiscrack/IMG_1522.JPG' },
  { id: '2', type: 'image' as const, src: '/images/thistrackiscrack/IMG_1509.JPG' },
  { id: '3', type: 'video' as const, src: '/images/thistrackiscrack/trackiscrack.MOV' },
];

const SWIPE_THRESHOLD = 15;
const HORIZONTAL_RATIO = 1.2;

export default function ThisTrackIsCrackEmbed() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hoverSide, setHoverSide] = useState<'left' | 'right' | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const goToPrev = () => setCurrentIndex(prev => prev > 0 ? prev - 1 : mediaItems.length - 1);
  const goToNext = () => setCurrentIndex(prev => prev < mediaItems.length - 1 ? prev + 1 : 0);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    const onTouchMove = (e: TouchEvent) => {
      if (touchStartX.current === null || touchStartY.current === null || e.touches.length === 0) return;
      const dx = e.touches[0].clientX - touchStartX.current;
      const dy = e.touches[0].clientY - touchStartY.current;
      if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy) * HORIZONTAL_RATIO) e.preventDefault();
    };
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    return () => el.removeEventListener('touchmove', onTouchMove);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null ||
        touchStartY.current === null) return;
    const dx = e.changedTouches[0].clientX -
               touchStartX.current;
    const dy = e.changedTouches[0].clientY -
               touchStartY.current;
    if (Math.abs(dx) < 20 ||
        Math.abs(dx) < Math.abs(dy) * 1.5) return;
    if (dx < 0) goToNext();   // swipe left = next
    else goToPrev();           // swipe right = prev
    touchStartX.current = null;
    touchStartY.current = null;
  };

  const safeIndex = currentIndex >= mediaItems.length ? 0 : currentIndex;
  const item = mediaItems[safeIndex];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setHoverSide(e.clientX - rect.left < rect.width / 2 ? 'left' : 'right');
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickedLeft = e.clientX - rect.left < rect.width / 2;
    setCurrentIndex(prev =>
      clickedLeft
        ? prev > 0 ? prev - 1 : mediaItems.length - 1
        : prev < mediaItems.length - 1 ? prev + 1 : 0
    );
  };

  const cursorStyle = hoverSide === 'left'
    ? { cursor: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23fff\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpath d=\'M15 18l-6-6 6-6\'/%3E%3C/svg%3E") 12 12, auto' }
    : hoverSide === 'right'
    ? { cursor: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23fff\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpath d=\'M9 18l6-6-6-6\'/%3E%3C/svg%3E") 12 12, auto' }
    : {};

  return (
    <div className="w-full">
      <div
        ref={carouselRef}
        className="relative w-full rounded-xl overflow-hidden"
        style={{ aspectRatio: '4/3', backgroundColor: '#1a1a1a', touchAction: 'pan-y', ...cursorStyle }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoverSide(null)}
        onClick={handleClick}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={safeIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="absolute inset-0"
          >
            {item.type === 'video' ? (
              <video
                src={item.src}
                className="w-full h-full object-contain"
                muted
                loop
                playsInline
                autoPlay
                preload="none"
              />
            ) : (
              <Image
                src={item.src}
                alt="This Track Is Crack"
                fill
                className="object-contain"
              />
            )}
          </motion.div>
        </AnimatePresence>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
          {mediaItems.map((_, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); setCurrentIndex(i); }}
              className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
                i === safeIndex ? 'bg-white' : 'bg-white/60 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
