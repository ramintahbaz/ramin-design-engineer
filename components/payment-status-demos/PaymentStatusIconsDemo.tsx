'use client';
import { motion } from 'framer-motion';

function ProcessingIcon() {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
      fill="none" width="24" height="24">
      <circle cx="12" cy="12" r="10" opacity="0.2"
        stroke="currentColor" strokeWidth="1" />
      <g>
        <animateTransform attributeName="transform" type="rotate"
          dur="1.5s" values="0 12 12;360 12 12" repeatCount="indefinite" />
        <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor"
          strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.9" />
      </g>
    </svg>
  );
}

function FailedIcon() {
  return (
    <motion.svg viewBox="0 0 24 24" fill="none"
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

function CompleteIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none"
      xmlns="http://www.w3.org/2000/svg" width="24" height="24">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
      <path d="M7 12l3 3 7-7" stroke="currentColor"
        strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        strokeDasharray="15" strokeDashoffset="15">
        <animate attributeName="stroke-dashoffset"
          values="15;0" dur="0.6s" fill="freeze" />
      </path>
    </svg>
  );
}

const states = [
  {
    label: 'Processing',
    color: '#007AFF',
    bg: 'rgba(0,122,255,0.1)',
    icon: <ProcessingIcon />,
    text: 'Processing Payment',
  },
  {
    label: 'Failed',
    color: '#FF3B30',
    bg: 'rgba(255,59,48,0.1)',
    icon: <FailedIcon />,
    text: 'Payment Failed',
  },
  {
    label: 'Complete',
    color: '#00A020',
    bg: 'rgba(0,214,50,0.12)',
    icon: <CompleteIcon />,
    text: 'Payment Complete',
  },
];

export default function PaymentStatusIconsDemo() {
  return (
    <div className="w-full flex flex-col items-center gap-3 py-10 px-6 rounded-xl bg-neutral-900">
      {states.map((s) => (
        <div
          key={s.label}
          style={{
            color: s.color,
            background: s.bg,
            borderRadius: 12,
            padding: '12px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontSize: 16,
            fontWeight: 600,
            letterSpacing: '-0.4px',
            width: '100%',
            maxWidth: 280,
          }}
        >
          <div style={{ width: 24, height: 24, flexShrink: 0 }}>
            {s.icon}
          </div>
          <span>{s.text}</span>
        </div>
      ))}
    </div>
  );
}
