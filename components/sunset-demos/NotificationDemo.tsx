'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const NOTIFICATIONS = {
  excellent: {
    quality: 'Excellent',
    score: 83,
    peak: '6:27 PM',
    goldenHour: '5:44 PM',
    message: "Tonight's sunset is shaping up to be exceptional. Peak at 6:27 PM.",
    gradient: 'linear-gradient(135deg, #C4721A, #8B1A1A)',
  },
  fair: {
    quality: 'Fair',
    score: 51,
    peak: '6:24 PM',
    goldenHour: '5:41 PM',
    message: "Decent sunset tonight — some cloud cover but worth a look. Peak at 6:24 PM.",
    gradient: 'linear-gradient(135deg, #9B7B4A, #6B5A3A)',
  },
  poor: {
    quality: 'Poor',
    score: 18,
    peak: '6:21 PM',
    goldenHour: '5:38 PM',
    message: "Heavy cloud cover tonight. Sunset quality is low.",
    gradient: 'linear-gradient(135deg, #4A5568, #2D3748)',
  },
} as const;

type QualityKey = keyof typeof NOTIFICATIONS;

export default function NotificationDemo() {
  const [active, setActive] = useState<QualityKey>('excellent');
  const [visible, setVisible] = useState(true);
  const n = NOTIFICATIONS[active];

  const handleSwitch = (key: QualityKey) => {
    setVisible(false);
    setTimeout(() => {
      setActive(key);
      setVisible(true);
    }, 200);
  };

  return (
    <div className="w-full rounded-xl bg-neutral-900 overflow-hidden">
      {/* Toggle */}
      <div className="flex gap-1 p-3 border-b border-white/5">
        {(Object.keys(NOTIFICATIONS) as QualityKey[]).map(key => (
          <button
            key={key}
            onClick={() => handleSwitch(key)}
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

      {/* Lock screen mockup */}
      <div
        className="flex flex-col items-center justify-start py-10 px-6"
        style={{
          background: 'linear-gradient(180deg, #1a1a2e 0%, #2d1b4e 100%)',
          minHeight: 280,
        }}
      >
        {/* Lock screen time */}
        <div className="text-center mb-8">
          <div className="text-white font-thin mb-1" style={{ fontSize: 52, letterSpacing: '-2px' }}>5:44</div>
          <div className="text-white/50 text-sm">Monday, June 20</div>
        </div>

        {/* Notification */}
        <AnimatePresence mode="wait">
          {visible && (
            <motion.div
              key={active}
              initial={{ opacity: 0, y: -12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="w-full max-w-sm rounded-2xl overflow-hidden"
              style={{
                background: 'rgba(30,30,40,0.85)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <div className="flex items-start gap-3 p-3">
                {/* App icon */}
                <div
                  className="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center"
                  style={{ background: n.gradient }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="5" fill="white" />
                    <line x1="12" y1="2" x2="12" y2="4" stroke="white" strokeWidth="2" strokeLinecap="round" />
                    <line x1="12" y1="20" x2="12" y2="22" stroke="white" strokeWidth="2" strokeLinecap="round" />
                    <line x1="2" y1="12" x2="4" y2="12" stroke="white" strokeWidth="2" strokeLinecap="round" />
                    <line x1="20" y1="12" x2="22" y2="12" stroke="white" strokeWidth="2" strokeLinecap="round" />
                    <line x1="4.93" y1="4.93" x2="6.34" y2="6.34" stroke="white" strokeWidth="2" strokeLinecap="round" />
                    <line x1="17.66" y1="17.66" x2="19.07" y2="19.07" stroke="white" strokeWidth="2" strokeLinecap="round" />
                    <line x1="4.93" y1="19.07" x2="6.34" y2="17.66" stroke="white" strokeWidth="2" strokeLinecap="round" />
                    <line x1="17.66" y1="6.34" x2="19.07" y2="4.93" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="text-white/60 text-[11px] font-medium uppercase tracking-wide">Sunset Chaser</span>
                    <span className="text-white/30 text-[10px]">now</span>
                  </div>
                  <div className="text-white text-[13px] font-medium mb-1 leading-snug">
                    Golden Hour — {n.quality} ({n.score}%)
                  </div>
                  <div className="text-white/50 text-[11px] leading-snug">
                    {n.message}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div
                className="grid grid-cols-2 divide-x divide-white/[0.08]"
                style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
              >
                <button
                  className="py-2.5 text-[12px] font-medium text-white/40 hover:text-white/60 transition-colors cursor-pointer"
                >
                  Dismiss
                </button>
                <button
                  className="py-2.5 text-[12px] font-semibold transition-colors cursor-pointer"
                  style={{ color: '#f97316' }}
                >
                  View Sunset
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
