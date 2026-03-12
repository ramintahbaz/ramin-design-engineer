'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function ComponentPreviewDemo() {
  const [scale, setScale] = useState(1.10);
  const [speed, setSpeed] = useState(300);
  const [isHovered, setIsHovered] = useState(false);
  const [applied, setApplied] = useState(false);

  const handleApply = () => {
    setApplied(true);
    setTimeout(() => setApplied(false), 2000);
  };

  const step = (setter: (v: number) => void, current: number, delta: number, min: number, max: number, precision: number) => {
    const next = Math.round((current + delta) * 100) / 100;
    setter(Math.min(max, Math.max(min, next)));
  };

  return (
    <div className="w-full rounded-xl bg-white overflow-hidden" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-black/6">
        <span className="text-[13px] font-semibold text-black">Craft</span>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500" style={{ boxShadow: '0 0 4px #22c55e' }} />
          <span className="text-[11px] text-black/50">Live edit</span>
        </div>
      </div>

      {/* Component label */}
      <div className="px-4 pt-4 pb-2">
        <div className="text-[13px] font-semibold text-black">Button.tsx</div>
        <div className="text-[11px] text-black/40 mt-0.5">Framer Motion wrapper · scale on hover</div>
      </div>

      {/* Live preview */}
      <div className="px-4 py-4 flex justify-center">
        <motion.button
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          animate={{ scale: isHovered ? scale : 1 }}
          transition={{ duration: speed / 1000, ease: 'easeOut' }}
          className="w-1/2 py-3.5 rounded-xl text-white text-[14px] font-medium cursor-pointer"
          style={{ background: '#000', letterSpacing: '0.01em' }}
        >
          {isHovered ? 'Hovering' : 'Hover me'}
        </motion.button>
      </div>

      {/* Divider */}
      <div className="mx-4 h-px bg-black/6" />

      {/* Controls */}
      <div className="mx-4 my-3 rounded-xl bg-black/4 overflow-hidden" style={{ background: 'rgba(0,0,0,0.04)' }}>
        {/* Scale */}
        <div className="px-4 py-3">
          <div className="text-[11px] text-black/50 mb-2 flex items-center gap-1">
            Scale amount
            <span className="w-3.5 h-3.5 rounded-full border border-black/20 flex items-center justify-center text-[8px] text-black/30">i</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => step(setScale, scale, -0.05, 1, 2, 2)}
              className="w-8 h-8 rounded-full bg-white border border-black/10 flex items-center justify-center text-black/50 hover:text-black transition-colors cursor-pointer text-xl leading-none"
            >−</button>
            <div className="flex-1 bg-white rounded-lg border border-black/10 py-2 text-center text-[13px] font-medium text-black">
              {scale.toFixed(2)}
            </div>
            <button
              onClick={() => step(setScale, scale, 0.05, 1, 2, 2)}
              className="w-8 h-8 rounded-full bg-white border border-black/10 flex items-center justify-center text-black/50 hover:text-black transition-colors cursor-pointer text-lg leading-none"
            >+</button>
          </div>
        </div>

        <div className="mx-4 h-px bg-black/6" />

        {/* Speed */}
        <div className="px-4 py-3">
          <div className="text-[11px] text-black/50 mb-2 flex items-center gap-1">
            Animation speed
            <span className="w-3.5 h-3.5 rounded-full border border-black/20 flex items-center justify-center text-[8px] text-black/30">i</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => step(setSpeed, speed, -50, 50, 2000, 0)}
              className="w-8 h-8 rounded-full bg-white border border-black/10 flex items-center justify-center text-black/50 hover:text-black transition-colors cursor-pointer text-xl leading-none"
            >−</button>
            <div className="flex-1 bg-white rounded-lg border border-black/10 py-2 text-center text-[13px] font-medium text-black">
              {speed}ms
            </div>
            <button
              onClick={() => step(setSpeed, speed, 50, 50, 2000, 0)}
              className="w-8 h-8 rounded-full bg-white border border-black/10 flex items-center justify-center text-black/50 hover:text-black transition-colors cursor-pointer text-lg leading-none"
            >+</button>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 px-4 pt-8 pb-4">
        <motion.button
          onClick={handleApply}
          whileTap={{ scale: 0.97 }}
          className="flex-1 py-3 rounded-full text-white text-[13px] font-semibold cursor-pointer transition-colors"
          style={{ background: applied ? '#16a34a' : '#2563EB' }}
        >
          {applied ? 'Applied ✓' : 'Apply to code'}
        </motion.button>
        <button
          onClick={() => { setScale(1.10); setSpeed(300); }}
          className="flex-1 py-3 rounded-full bg-black/6 text-[13px] font-medium text-black/60 hover:text-black/80 transition-colors cursor-pointer"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
