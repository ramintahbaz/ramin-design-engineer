'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const RADIUS_OPTIONS = [
  { label: 'None', value: '0px', tw: 'rounded-none' },
  { label: 'SM', value: '4px', tw: 'rounded' },
  { label: 'MD', value: '8px', tw: 'rounded-lg' },
  { label: 'XL', value: '12px', tw: 'rounded-xl' },
  { label: 'Full', value: '999px', tw: 'rounded-full' },
];

const COLORS = [
  { label: 'Black', hex: '#000000' },
  { label: 'Blue', hex: '#2563EB' },
  { label: 'Violet', hex: '#7C3AED' },
  { label: 'Rose', hex: '#E11D48' },
];


export default function ControlsPanelDemo() {
  const [color, setColor] = useState(COLORS[0]);
  const [radius, setRadius] = useState(RADIUS_OPTIONS[3]);
  const [showCode, setShowCode] = useState(false);
  const [applied, setApplied] = useState(false);

  const handleApply = () => {
    setShowCode(true);
    setApplied(true);
    setTimeout(() => setApplied(false), 2000);
  };

  const codeString = `<motion.button
  whileHover={{ scale: 1.10 }}
  transition={{ duration: 0.3 }}
  className="px-6 py-3 ${radius.tw} text-white"
  style={{ background: '${color.hex}' }}
>
  Click me
</motion.button>`;

  return (
    <div className="w-full rounded-xl bg-white overflow-hidden" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-black/6">
        <span className="text-[13px] font-semibold text-black">Craft</span>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500" style={{ boxShadow: '0 0 4px #22c55e' }} />
          <span className="text-[11px] text-black/40">Live edit</span>
        </div>
      </div>

      {/* Live preview */}
      <div className="flex items-center justify-center px-8 py-4">
        <div
          className="text-white text-[13px] font-medium select-none"
          style={{
            background: color.hex,
            borderRadius: radius.value,
            padding: '12px 24px',
            transition: 'background 0.2s ease, border-radius 0.2s ease',
            pointerEvents: 'none',
          }}
        >
          Preview
        </div>
      </div>

      <div className="mx-4 h-px bg-black/6" />

      {/* Design System tokens */}
      <div className="px-4 pt-3 pb-1">
        <div className="text-[11px] font-semibold text-black/30 uppercase tracking-wider mb-2">Design System</div>
      </div>

      {/* Primary Color */}
      <div className="px-4 py-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[13px] text-black">Primary Color</span>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded-sm border border-black/10" style={{ background: color.hex }} />
            <span className="text-[12px] text-black/50">{color.label} {color.hex}</span>
          </div>
        </div>
        <div className="flex gap-1.5">
          {COLORS.map(c => (
            <button
              key={c.hex}
              onClick={() => setColor(c)}
              className="w-7 h-7 rounded-lg cursor-pointer transition-transform hover:scale-110"
              style={{
                background: c.hex,
                outline: color.hex === c.hex ? `2px solid ${c.hex}` : 'none',
                outlineOffset: 2,
              }}
            />
          ))}
        </div>
      </div>

      <div className="mx-4 h-px bg-black/6 my-1" />

      {/* Button Radius */}
      <div className="px-4 py-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[13px] text-black">Button Radius</span>
          <span className="text-[12px] text-black/50">{radius.label === 'XL' ? '↗' : '↗'} {radius.label} ({radius.value})</span>
        </div>
        <div className="flex gap-1.5">
          {RADIUS_OPTIONS.map(r => (
            <button
              key={r.value}
              onClick={() => setRadius(r)}
              className="flex-1 py-1.5 text-[10px] font-medium cursor-pointer transition-colors border"
              style={{
                borderRadius: Math.min(parseInt(r.value) || 0, 6),
                background: radius.value === r.value ? '#000' : 'transparent',
                color: radius.value === r.value ? '#fff' : 'rgba(0,0,0,0.4)',
                borderColor: radius.value === r.value ? '#000' : 'rgba(0,0,0,0.1)',
              }}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 px-4 pt-8 pb-4">
        <motion.button
          onClick={handleApply}
          whileTap={{ scale: 0.97 }}
          className="flex-1 py-3 rounded-full text-white text-[13px] font-semibold cursor-pointer"
          style={{ background: applied ? '#16a34a' : '#2563EB', transition: 'background 0.2s ease' }}
        >
          {applied ? 'Applied ✓' : 'Apply to code'}
        </motion.button>
        <button
          onClick={() => { setColor(COLORS[0]); setRadius(RADIUS_OPTIONS[3]); setShowCode(false); }}
          className="flex-1 py-3 rounded-full bg-black/6 text-[13px] font-medium text-black/60 hover:text-black/80 transition-colors cursor-pointer"
        >
          Reset
        </button>
      </div>

      {/* Code output */}
      <AnimatePresence>
        {showCode && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mx-4 mb-4 rounded-xl overflow-hidden border border-black/8">
              <div className="flex items-center justify-between px-3 py-2 bg-black/4">
                <span className="text-[10px] text-black/40 font-medium uppercase tracking-wider">Button.tsx</span>
                <span className="text-[10px] text-green-600 font-medium">● Updated</span>
              </div>
              <pre className="px-3 py-3 text-[10px] leading-relaxed overflow-x-auto" style={{ background: '#FAFAFA', color: '#333', margin: 0 }}>
                {codeString}
              </pre>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
