'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DORITOS_RED = '#E3000B';

function SplashScreen({ onNext }: { onNext: () => void }) {
  return (
    <div
      className="flex flex-col items-center justify-between w-full h-full"
      style={{ background: DORITOS_RED, padding: '48px 24px 36px' }}
    >
      {/* Top label */}
      <div className="flex flex-col items-center gap-2 w-full">
        <span
          className="text-white/60 text-[10px] uppercase tracking-widest font-medium"
        >
          Coachella 2023
        </span>
        <div
          className="w-full rounded-2xl flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.15)', padding: '32px 24px' }}
        >
          {/* Wordmark */}
          <div className="flex flex-col items-center gap-1">
            <span
              className="text-white font-black uppercase leading-none"
              style={{ fontSize: 42, letterSpacing: '-1px' }}
            >
              DORITOS
            </span>
            <span
              className="text-white font-black uppercase leading-none"
              style={{ fontSize: 28, letterSpacing: '6px' }}
            >
              LOADED
            </span>
          </div>
        </div>
        <p
          className="text-white/70 text-[12px] text-center mt-2 leading-relaxed"
          style={{ maxWidth: 220 }}
        >
          Bold flavors. No waiting. Order now and pick up at the booth.
        </p>
      </div>

      {/* CTA */}
      <button
        onClick={onNext}
        className="w-full py-4 rounded-2xl font-bold text-[15px] uppercase tracking-wider cursor-pointer"
        style={{
          background: '#000',
          color: '#fff',
          letterSpacing: '2px',
        }}
      >
        Order Now
      </button>
    </div>
  );
}

function MenuScreen({ onNext }: { onNext: () => void }) {
  const [selected, setSelected] = useState<'base' | 'protein' | null>(null);

  return (
    <div
      className="flex flex-col w-full h-full"
      style={{ background: '#0a0a0a', padding: '32px 20px 28px' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-white font-black text-[18px] uppercase tracking-tight">Menu</div>
          <div className="text-white/30 text-[11px] mt-0.5">Select your load</div>
        </div>
        <div
          className="px-2.5 py-1 rounded-full text-[9px] font-semibold uppercase tracking-wider"
          style={{ background: DORITOS_RED, color: '#fff' }}
        >
          Live
        </div>
      </div>

      {/* Items */}
      <div className="flex flex-col gap-3 flex-1">
        {[
          {
            id: 'base' as const,
            name: 'Doritos Loaded',
            sub: 'Base',
            desc: 'Classic nacho cheese filling, crispy shell',
            price: '$6',
            accent: DORITOS_RED,
          },
          {
            id: 'protein' as const,
            name: 'Doritos Loaded',
            sub: 'Protein',
            desc: 'Seasoned beef, nacho cheese, jalapeño',
            price: '$8',
            accent: '#FF6B00',
          },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setSelected(item.id)}
            className="w-full text-left rounded-2xl overflow-hidden cursor-pointer transition-all"
            style={{
              background: selected === item.id ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)',
              border: selected === item.id ? `1.5px solid ${item.accent}` : '1.5px solid rgba(255,255,255,0.06)',
            }}
          >
            <div className="flex items-center justify-between p-4">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-white font-bold text-[14px]">{item.name}</span>
                  <span
                    className="text-[9px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider"
                    style={{ background: item.accent, color: '#fff' }}
                  >
                    {item.sub}
                  </span>
                </div>
                <span className="text-white/40 text-[11px]">{item.desc}</span>
              </div>
              <div className="flex flex-col items-end gap-2 ml-3 flex-shrink-0">
                <span className="text-white font-bold text-[16px]">{item.price}</span>
                <div
                  className="w-5 h-5 rounded-full border flex items-center justify-center"
                  style={{
                    borderColor: selected === item.id ? item.accent : 'rgba(255,255,255,0.2)',
                    background: selected === item.id ? item.accent : 'transparent',
                  }}
                >
                  {selected === item.id && (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Confirm */}
      <button
        onClick={selected ? onNext : undefined}
        className="w-full py-4 rounded-2xl font-bold text-[14px] uppercase tracking-widest mt-4 cursor-pointer transition-all"
        style={{
          background: selected ? DORITOS_RED : 'rgba(255,255,255,0.06)',
          color: selected ? '#fff' : 'rgba(255,255,255,0.2)',
          letterSpacing: '2px',
        }}
      >
        {selected ? 'Confirm Order' : 'Select an item'}
      </button>
    </div>
  );
}

function ConfirmScreen({ onReset }: { onReset: () => void }) {
  return (
    <div
      className="flex flex-col items-center justify-between w-full h-full"
      style={{ background: '#0a0a0a', padding: '48px 24px 36px' }}
    >
      <div className="flex flex-col items-center gap-4 flex-1 justify-center">
        {/* Check */}
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center"
          style={{ background: DORITOS_RED }}
        >
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path d="M6 14l5.5 5.5L22 9" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="text-center">
          <div className="text-white font-black text-[20px] uppercase tracking-tight">Order placed</div>
          <div className="text-white/40 text-[12px] mt-1">Head to the Doritos booth to pick up</div>
        </div>

        {/* Order number */}
        <div
          className="px-6 py-3 rounded-2xl mt-2"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <div className="text-white/30 text-[9px] uppercase tracking-widest text-center mb-1">Order</div>
          <div className="text-white font-black text-[22px] tracking-widest text-center">#247</div>
        </div>

        <div
          className="flex items-center gap-1.5 mt-1"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-green-500" style={{ boxShadow: '0 0 4px #22c55e' }} />
          <span className="text-white/30 text-[11px]">Est. wait: 3 min</span>
        </div>
      </div>

      <button
        onClick={onReset}
        className="w-full py-3.5 rounded-2xl font-semibold text-[13px] cursor-pointer"
        style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)' }}
      >
        Start over
      </button>
    </div>
  );
}

const SCREENS = ['splash', 'menu', 'confirm'] as const;
type Screen = typeof SCREENS[number];

const LABELS: Record<Screen, string> = {
  splash: 'Splash',
  menu: 'Menu',
  confirm: 'Confirm',
};

export default function OrderingFlowDemo() {
  const [screen, setScreen] = useState<Screen>('splash');

  const next = () => {
    const idx = SCREENS.indexOf(screen);
    if (idx < SCREENS.length - 1) setScreen(SCREENS[idx + 1]);
  };

  const reset = () => setScreen('splash');

  return (
    <div className="w-full rounded-xl bg-neutral-900 overflow-hidden">
      {/* Phone frame */}
      <div className="flex justify-center py-6 px-4">
        <div
          className="relative overflow-hidden"
          style={{
            width: 280,
            height: 500,
            borderRadius: 36,
            border: '6px solid rgba(255,255,255,0.08)',
            background: '#0a0a0a',
            boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
          }}
        >
          {/* Notch */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 z-10"
            style={{
              width: 80,
              height: 20,
              background: '#0a0a0a',
              borderBottomLeftRadius: 12,
              borderBottomRightRadius: 12,
            }}
          />

          {/* Screen content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={screen}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="w-full h-full pt-5"
            >
              {screen === 'splash' && <SplashScreen onNext={next} />}
              {screen === 'menu' && <MenuScreen onNext={next} />}
              {screen === 'confirm' && <ConfirmScreen onReset={reset} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
