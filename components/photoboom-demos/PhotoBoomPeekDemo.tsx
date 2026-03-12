'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const images = [
  { id: '1', src: '/images/image1.jpeg', alt: 'Photo 1' },
  { id: '2', src: '/images/image2.jpeg', alt: 'Photo 2' },
  { id: '3', src: '/images/image3.jpeg', alt: 'Photo 3' },
  { id: '4', src: '/images/image4.jpeg', alt: 'Photo 4' },
];

const directions = [
  { x: 1, y: 0 },
  { x: -1, y: 0 },
  { x: 0.7, y: -0.7 },
  { x: -0.7, y: 0.7 },
];

const peekAmount = 10;

export default function PhotoBoomPeekDemo() {
  const [isHovering, setIsHovering] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(typeof window !== 'undefined' && (window.innerWidth < 768 || 'ontouchstart' in window));
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <div className="w-full flex flex-col items-center gap-6 py-12 px-6 rounded-xl bg-neutral-900">
      <div
        className="relative cursor-pointer"
        style={{ width: 200, height: 250 }}
        onMouseEnter={() => !isMobile && setIsHovering(true)}
        onMouseLeave={() => !isMobile && setIsHovering(false)}
        onClick={() => isMobile && setIsHovering((h) => !h)}
      >
        {images.map((image, index) => {
          const dir = directions[index];
          const peek = isHovering
            ? { x: dir.x * peekAmount, y: dir.y * peekAmount }
            : { x: 0, y: 0 };

          return (
            <motion.div
              key={image.id}
              className="absolute rounded-xl overflow-hidden shadow-xl border-[6px] border-white ring-1 ring-[#D0CECA]"
              style={{
                width: 200,
                height: 250,
                left: '50%',
                top: '50%',
                zIndex: images.length - index,
              }}
              initial={false}
              animate={{
                x: -100 + (index * -3) + peek.x,
                y: -125 + (index * -3) + peek.y,
                rotate: index * 1.5 + (isHovering ? (index < 2 ? -8 : 8) : 0),
                scale: index === 0 && isHovering ? 1.03 : 1,
              }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 20,
              }}
            >
              <Image src={image.src} alt={image.alt} fill className="object-cover" sizes="200px" />
            </motion.div>
          );
        })}
      </div>
      <p className="text-xs text-neutral-500 text-center">
        {isMobile ? 'Tap the stack to see the peek' : 'Hover the stack to see the peek'}
      </p>
    </div>
  );
}
