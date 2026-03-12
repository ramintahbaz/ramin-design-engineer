'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const QUALITIES = {
  excellent: {
    label: 'Excellent',
    score: 83,
    time: '6:27 PM',
    goldenHour: '5:44 PM',
    dusk: '6:49 PM',
    cloudCover: 23,
    temp: 75,
    colors: 'Scarlet, Orange, Blue',
    bg: 'linear-gradient(180deg, #4A6FA5 0%, #C4721A 45%, #8B1A1A 100%)',
    barGradient: 'linear-gradient(90deg, #1A1A2E 0%, #8B1A1A 30%, #C4721A 60%, #F4A460 80%, #87CEEB 100%)',
    barWidth: '83%',
  },
  fair: {
    label: 'Fair',
    score: 51,
    time: '6:24 PM',
    goldenHour: '5:41 PM',
    dusk: '6:46 PM',
    cloudCover: 58,
    temp: 68,
    colors: 'Amber, Grey, Violet',
    bg: 'linear-gradient(180deg, #6B7B8D 0%, #9B7B4A 45%, #4A3728 100%)',
    barGradient: 'linear-gradient(90deg, #1A1A2E 0%, #4A3728 40%, #9B7B4A 70%, #B8A88A 100%)',
    barWidth: '51%',
  },
  poor: {
    label: 'Poor',
    score: 18,
    time: '6:21 PM',
    goldenHour: '5:38 PM',
    dusk: '6:43 PM',
    cloudCover: 89,
    temp: 61,
    colors: 'Grey, Blue, White',
    bg: 'linear-gradient(180deg, #4A5568 0%, #718096 45%, #2D3748 100%)',
    barGradient: 'linear-gradient(90deg, #1A1A2E 0%, #2D3748 50%, #718096 100%)',
    barWidth: '18%',
  },
} as const;

type QualityKey = keyof typeof QUALITIES;

export default function SunsetCardDemo() {
  const [active, setActive] = useState<QualityKey>('excellent');
  const q = QUALITIES[active];

  return (
    <div className="w-full rounded-xl overflow-hidden bg-neutral-900">
      {/* Quality toggle */}
      <div className="flex gap-1 p-3 border-b border-white/5">
        {(Object.keys(QUALITIES) as QualityKey[]).map(key => (
          <button
            key={key}
            onClick={() => setActive(key)}
            className="px-3 py-1.5 rounded-full text-[10px] font-medium capitalize transition-colors cursor-pointer"
            style={{
              background: active === key ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.06)',
              color: active === key ? '#0a0a0a' : 'rgba(255,255,255,0.5)',
            }}
          >
            {key}
          </button>
        ))}
      </div>

      {/* Card */}
      <motion.div
        className="relative overflow-hidden"
        animate={{ background: q.bg }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
        style={{ background: q.bg, minHeight: 340 }}
      >
        {/* Sun arc */}
        <div className="flex items-center justify-center pt-8 pb-4">
          <div className="relative" style={{ width: 160, height: 80 }}>
            <svg width="160" height="80" viewBox="0 0 160 80" fill="none">
              <path
                d="M 10 78 A 70 70 0 0 1 150 78"
                stroke="rgba(255,255,255,0.4)"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                fill="none"
              />
            </svg>
            <motion.div
              className="absolute rounded-full"
              style={{
                width: 14,
                height: 14,
                background: 'rgba(255,255,255,0.9)',
                boxShadow: '0 0 12px 4px rgba(255,200,100,0.6)',
                top: 8,
                left: active === 'excellent' ? 20 : active === 'fair' ? 72 : 124,
              }}
              animate={{
                left: active === 'excellent' ? 20 : active === 'fair' ? 72 : 124,
                top: active === 'excellent' ? 8 : active === 'fair' ? -4 : 36,
              }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
            />
          </div>
        </div>

        {/* Glass card */}
        <div
          className="mx-3 mb-3 rounded-2xl p-4 flex flex-col gap-4"
          style={{
            background: 'rgba(0,0,0,0.45)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.12)',
          }}
        >
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <div className="text-white font-semibold text-sm">Today&apos;s Sunset</div>
              <motion.div
                key={active + '-colors'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-white/50 text-[11px] mt-0.5"
              >
                {q.colors}
              </motion.div>
            </div>
            <div className="text-white/50 text-[11px]">June 20, 2025</div>
          </div>

          {/* Time */}
          <motion.div
            key={active + '-time'}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-baseline gap-1"
          >
            <span className="text-white font-light" style={{ fontSize: 42, letterSpacing: '-2px' }}>{q.time.split(' ')[0]}</span>
            <span className="text-white/50 text-sm mb-1">PM</span>
          </motion.div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-white/40 text-[10px] mb-0.5">Golden Hour</div>
              <div className="text-white text-sm font-medium">38 min</div>
            </div>
            <div>
              <div className="text-white/40 text-[10px] mb-0.5">Quality</div>
              <motion.div
                key={active + '-quality'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-white text-sm font-medium"
              >
                {q.label}
              </motion.div>
            </div>
            <div>
              <div className="text-white/40 text-[10px] mb-1">Cloud Cover</div>
              <div className="flex items-center gap-2">
                <motion.div
                  key={active + '-cloud'}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-white text-[11px]"
                >
                  {q.cloudCover}%
                </motion.div>
                <div className="flex-1 h-0.5 rounded-full bg-white/10">
                  <motion.div
                    className="h-full rounded-full bg-blue-400"
                    animate={{ width: `${q.cloudCover}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                  />
                </div>
              </div>
            </div>
            <div>
              <div className="text-white/40 text-[10px] mb-1">Temperature</div>
              <div className="flex items-center gap-2">
                <motion.div
                  key={active + '-temp'}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-white text-[11px]"
                >
                  {q.temp}°
                </motion.div>
                <div className="flex-1 h-0.5 rounded-full bg-white/10">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: 'linear-gradient(90deg, #60a5fa, #f97316)' }}
                    animate={{ width: `${((q.temp - 50) / 50) * 100}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Golden hour bar */}
          <div>
            <div className="text-white/40 text-[10px] mb-2">Golden Hour</div>
            <div className="relative h-8 rounded-xl overflow-hidden" style={{ background: 'rgba(0,0,0,0.3)' }}>
              <motion.div
                className="absolute inset-y-0 left-0 rounded-xl"
                animate={{ width: q.barWidth, background: q.barGradient }}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
                style={{ background: q.barGradient }}
              />
              <div className="absolute inset-0 flex items-center px-3">
                <motion.span
                  key={active + '-score'}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-white text-sm font-medium"
                >
                  {q.score}%
                </motion.span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div
          className="mx-3 mb-3 rounded-2xl px-4 py-3 grid grid-cols-3 text-center"
          style={{
            background: 'rgba(0,0,0,0.4)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          {[
            { label: 'Golden Hour', time: q.goldenHour, highlight: false },
            { label: 'Peak', time: q.time, highlight: true },
            { label: 'Dusk', time: q.dusk, highlight: false },
          ].map(({ label, time, highlight }) => (
            <div key={label}>
              <div className="text-white/40 text-[10px] mb-1">{label}</div>
              <motion.div
                key={active + label}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm font-semibold"
                style={{ color: highlight ? '#f97316' : 'white' }}
              >
                {time}
              </motion.div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
