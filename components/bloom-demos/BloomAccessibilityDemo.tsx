'use client';
import { useState } from 'react';
import { Menu } from 'bloom-menu';

const itemStyles = "flex items-center gap-3 rounded-lg px-2 py-2 text-sm text-neutral-900 hover:bg-neutral-100";

export default function BloomAccessibilityDemo() {
  const [reducedMotion, setReducedMotion] = useState(false);

  return (
    <div className="w-full rounded-xl py-12 px-6 bg-neutral-900">
      <style>{reducedMotion ? `* { --bloom-reduced-motion: 1; } @media (prefers-reduced-motion: no-preference) { * { animation-duration: 0.001ms !important; transition-duration: 0.001ms !important; } }` : ''}</style>
      <div className="flex flex-col items-center gap-8">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setReducedMotion(!reducedMotion)}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors"
            style={{
              background: reducedMotion ? '#1a1a1a' : '#e8e8e8',
              color: reducedMotion ? '#fff' : '#666',
              cursor: 'pointer',
            }}
          >
            <span>{reducedMotion ? 'Reduced motion: on' : 'Reduced motion: off'}</span>
          </button>
        </div>
        <Menu.Root direction="bottom" anchor="center">
          <Menu.Container buttonSize={40} menuWidth={160} menuRadius={12} className="bg-white shadow-lg ring-1 ring-[#292929]/5">
            <Menu.Trigger>
              <div className="flex items-center justify-center w-10 h-10">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="4" r="1.5" fill="currentColor"/>
                  <circle cx="10" cy="10" r="1.5" fill="currentColor"/>
                  <circle cx="10" cy="16" r="1.5" fill="currentColor"/>
                </svg>
              </div>
            </Menu.Trigger>
            <Menu.Content className="p-2">
              <Menu.Item className={itemStyles} onSelect={() => {}}>Edit</Menu.Item>
              <Menu.Item className={itemStyles} onSelect={() => {}}>Copy</Menu.Item>
              <Menu.Item className={itemStyles} onSelect={() => {}}>Delete</Menu.Item>
            </Menu.Content>
          </Menu.Container>
        </Menu.Root>
        <p className="text-xs text-neutral-500 text-center max-w-xs">
          {reducedMotion
            ? 'Motion reduced — the spring is replaced with a near-instant transition.'
            : 'Toggle reduced motion to see how Bloom responds to the prefers-reduced-motion setting.'
          }
        </p>
      </div>
    </div>
  );
}
