'use client';
import { useState, useEffect } from 'react';
import { motion, useMotionValue } from 'framer-motion';

export default function WindowDemo() {
  const [isMobile, setIsMobile] = useState(false);
  const [open, setOpen] = useState(true);
  useEffect(() => {
    const check = () => setIsMobile(typeof window !== 'undefined' && window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  const [isMuted, setIsMuted] = useState(true);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const width = useMotionValue(320);
  const height = useMotionValue(220);

  const handleClose = () => {
    setOpen(false);
    x.set(0);
    y.set(0);
    width.set(320);
    height.set(220);
  };

  return (
    <div className="w-full flex flex-col items-center gap-6 py-10 px-6 rounded-xl bg-neutral-900 min-h-[320px] relative">
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="px-5 py-2 rounded-full text-sm font-medium bg-white text-neutral-900 hover:bg-neutral-200 transition-colors cursor-pointer"
        >
          Open window
        </button>
      )}

      {open && (
        <motion.div
          className={isMobile ? 'relative mx-auto' : 'relative'}
          style={isMobile ? {
            width: 'min(100%, 320px)',
            height: 220,
          } : { width, height, x, y, minWidth: 260, minHeight: 180 }}
        >
          <div
            className="w-full h-full flex flex-col"
            style={{
              border: '6px solid #1A1A1A',
              borderRadius: 8,
              overflow: 'hidden',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.15)',
            }}
          >
            {/* Title bar */}
            <div
              className="h-10 flex items-center justify-between flex-shrink-0 relative cursor-grab active:cursor-grabbing select-none"
              style={{
                backgroundColor: '#1A1A1A',
                marginTop: -6,
                marginLeft: -6,
                marginRight: -6,
                paddingTop: 6,
                paddingLeft: 12,
                paddingRight: 12,
                fontFamily: 'var(--font-ibm-plex-mono), monospace',
              }}
              onMouseDown={isMobile ? undefined : (e) => {
                const target = e.target as HTMLElement;
                if (target.closest('button')) return;
                e.preventDefault();
                const startX = e.clientX;
                const startY = e.clientY;
                const startMX = x.get();
                const startMY = y.get();
                const onMove = (ev: MouseEvent) => {
                  x.set(startMX + ev.clientX - startX);
                  y.set(startMY + ev.clientY - startY);
                };
                const onUp = () => {
                  document.removeEventListener('mousemove', onMove);
                  document.removeEventListener('mouseup', onUp);
                };
                document.addEventListener('mousemove', onMove);
                document.addEventListener('mouseup', onUp);
              }}
            >
              {/* Drag dots */}
              <div className="grid grid-cols-2 absolute left-3 top-1/2 -translate-y-1/2" style={{ gap: 3 }}>
                {[0,1,2,3,4,5].map(i => (
                  <div key={i} className="w-0.5 h-0.5 rounded-full" style={{ backgroundColor: '#8D8D8D' }} />
                ))}
              </div>
              {/* Title */}
              <span className="text-gray-300 text-[11px] font-medium absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                Michael Jordan Dunk Contest
              </span>
              {/* Close */}
              <button
                onClick={handleClose}
                onMouseDown={e => e.stopPropagation()}
                className="text-gray-300 hover:text-white text-[11px] font-medium absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer transition-colors"
                style={{ fontFamily: 'var(--font-ibm-plex-mono), monospace' }}
              >
                [CLOSE]
              </button>
            </div>

            {/* Content */}
            <div
              className="flex-1 relative flex items-center justify-center"
              style={{ backgroundColor: '#292929' }}
            >
              <span
                className="text-white/20 text-[10px]"
                style={{ fontFamily: 'var(--font-ibm-plex-mono), monospace' }}
              >
                video content
              </span>

              {/* Mute toggle */}
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="absolute bottom-2 left-2 w-7 h-7 rounded-full flex items-center justify-center transition-colors cursor-pointer"
                style={{ background: 'rgba(41,41,41,0.8)', border: '1px solid rgba(255,255,255,0.1)' }}
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 5L6 9H2v6h4l5 4V5z" />
                    <line x1="23" y1="9" x2="17" y2="15" />
                    <line x1="17" y1="9" x2="23" y2="15" />
                  </svg>
                ) : (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 5L6 9H2v6h4l5 4V5z" />
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                  </svg>
                )}
              </button>
            </div>

            {/* Resize handle */}
            <div
              className="absolute bottom-0 right-0 w-8 h-8 cursor-nwse-resize z-20 flex items-end justify-end"
              style={{ marginBottom: -6, marginRight: -6, paddingBottom: 6, paddingRight: 6 }}
              onMouseDown={isMobile ? undefined : (e) => {
                e.preventDefault();
                const startX = e.clientX;
                const startY = e.clientY;
                const startW = width.get();
                const startH = height.get();
                const onMove = (ev: MouseEvent) => {
                  width.set(Math.max(260, startW + ev.clientX - startX));
                  height.set(Math.max(180, startH + ev.clientY - startY));
                };
                const onUp = () => {
                  window.removeEventListener('mousemove', onMove);
                  window.removeEventListener('mouseup', onUp);
                };
                window.addEventListener('mousemove', onMove);
                window.addEventListener('mouseup', onUp);
              }}
            >
              <div className="flex flex-col items-end relative" style={{ gap: 3 }}>
                {[[1],[1,1],[1,1,1]].map((row, ri) => (
                  <div key={ri} className="flex relative z-10" style={{ gap: 3 }}>
                    {row.map((_, ci) => (
                      <div key={ci} className="w-0.5 h-0.5 rounded-full" style={{ backgroundColor: '#8D8D8D' }} />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
