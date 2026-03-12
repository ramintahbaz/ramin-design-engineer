'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';

function FailedIcon({ iteration }: { iteration: number }) {
  return (
    <motion.svg key={iteration} viewBox="0 0 24 24" fill="none"
      xmlns="http://www.w3.org/2000/svg" width="24" height="24"
      initial={{ scale: 1, x: 0 }}
      animate={{ scale: 1.15, x: [0, -3, 3, -3, 0] }}
      transition={{
        scale: { type: 'spring', stiffness: 300, damping: 15, delay: 0.2 },
        x: { duration: 0.4, delay: 0.2, type: 'tween' },
      }}
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
      <path d="M8 8l8 8M16 8l-8 8" stroke="currentColor"
        strokeWidth="2.5" strokeLinecap="round" />
    </motion.svg>
  );
}

export default function PaymentStatusShakeDemo() {
  const [iteration, setIteration] = useState(0);

  return (
    <div className="w-full flex flex-col items-center gap-8 py-10 px-6 rounded-xl bg-neutral-900">
      <div style={{
        color: '#FF3B30',
        background: 'rgba(255,59,48,0.1)',
        borderRadius: 12,
        padding: '12px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        fontSize: 16,
        fontWeight: 600,
        letterSpacing: '-0.4px',
        minWidth: 240,
      }}>
        <div style={{ width: 24, height: 24, flexShrink: 0 }}>
          <FailedIcon iteration={iteration} />
        </div>
        <span>Payment Failed</span>
      </div>
      <button
        onClick={() => setIteration(i => i + 1)}
        className="px-5 py-2 rounded-full text-sm font-medium bg-white text-neutral-900 hover:bg-neutral-200 transition-colors cursor-pointer"
      >
        Replay
      </button>
    </div>
  );
}
