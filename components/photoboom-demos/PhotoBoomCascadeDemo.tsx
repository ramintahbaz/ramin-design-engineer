'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const images = [
  { id: '1', src: '/images/image1.jpeg', alt: 'Photo 1' },
  { id: '2', src: '/images/image2.jpeg', alt: 'Photo 2' },
];

const W = 100;
const H = 125;

const explodedPositions = [
  { x: -70, y: 0, rotation: -8 },
  { x: 70, y: 0, rotation: 8 },
];

function Stack({ exploded, cascadeDelay, label }: {
  exploded: boolean; cascadeDelay: number; label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-xs text-neutral-500 font-medium">{label}</span>
      <div className="relative" style={{ width: W, height: H }}>
        {images.map((image, index) => (
          <motion.div
            key={image.id}
            className="absolute rounded-lg overflow-hidden shadow-lg border-[3px] border-white ring-1 ring-[#D0CECA]"
            style={{
              width: W, height: H,
              left: '50%', top: '50%',
              zIndex: exploded ? index : images.length - index,
            }}
            animate={{
              x: exploded ? explodedPositions[index].x - W / 2 : -W / 2 + index * -2,
              y: exploded ? -H / 2 : -H / 2 + index * -2,
              rotate: exploded ? explodedPositions[index].rotation : index * 2,
              scale: exploded ? 1.05 : 1,
            }}
            transition={{
              x: { type: 'spring', stiffness: 180, damping: 12, mass: 0.6 },
              y: { type: 'spring', stiffness: 180, damping: 12, mass: 0.6 },
              scale: { type: 'spring', stiffness: 260, damping: 18 },
              rotate: { type: 'spring', stiffness: 150, damping: 10 },
              delay: index * cascadeDelay,
            }}
          >
            <Image src={image.src} alt={image.alt} fill className="object-cover" sizes="100px" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function PhotoBoomCascadeDemo() {
  const [exploded, setExploded] = useState(false);

  return (
    <div className="w-full flex flex-col items-center gap-8 py-10 px-6 rounded-xl bg-neutral-900">
      <div className="flex flex-col items-center gap-12 w-full">
        <Stack exploded={exploded} cascadeDelay={0} label="No delay" />
        <div style={{ height: 1, width: 120, background: 'rgba(0,0,0,0.08)' }} />
        <Stack exploded={exploded} cascadeDelay={0.04} label="0.04s stagger" />
        <div style={{ height: 1, width: 120, background: 'rgba(0,0,0,0.08)' }} />
        <Stack exploded={exploded} cascadeDelay={0.12} label="0.12s stagger" />
      </div>
      <button
        onClick={() => setExploded(!exploded)}
        className="cursor-pointer px-5 py-2 rounded-full text-sm font-medium bg-white text-neutral-900 hover:bg-neutral-200 transition-colors"
      >
        {exploded ? 'Collapse' : 'Explode'}
      </button>
    </div>
  );
}
