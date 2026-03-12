'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const fields = [
  { id: 'name', label: 'Full name', extracted: 'Maria Gonzalez', status: 'confirmed' as const },
  { id: 'address', label: 'Service address', extracted: '4821 Elm Street, Detroit, MI', status: 'flagged' as const, reason: 'Does not match case record address' },
  { id: 'date', label: 'Document date', extracted: 'November 2025', status: 'confirmed' as const },
  { id: 'type', label: 'Document type', extracted: 'Utility bill', status: 'confirmed' as const },
  { id: 'amount', label: 'Amount due', extracted: '$142.00', status: 'confirmed' as const },
];

type FieldStatus = 'confirmed' | 'flagged' | 'accepted' | 'correcting' | 'insufficient';

export default function ReviewQueueDemo() {
  const [fieldStates, setFieldStates] = useState<Record<string, FieldStatus>>(
    Object.fromEntries(fields.map(f => [f.id, f.status]))
  );
  const [correctionValue, setCorrectionValue] = useState('4821 Elm Street, Detroit, MI 48201');
  const [resolved, setResolved] = useState(false);

  const update = (id: string, status: FieldStatus) => {
    setFieldStates(prev => ({ ...prev, [id]: status }));
  };

  const handleAccept = (id: string) => update(id, 'accepted');
  const handleCorrect = (id: string) => update(id, 'correcting');
  const handleInsufficient = () => update('address', 'insufficient');
  const handleSaveCorrection = () => {
    update('address', 'accepted');
  };

  const allResolved = Object.values(fieldStates).every(
    s => s === 'confirmed' || s === 'accepted'
  );

  const handleSubmit = () => setResolved(true);
  const handleReset = () => {
    setFieldStates(Object.fromEntries(fields.map(f => [f.id, f.status])));
    setResolved(false);
  };

  return (
    <div className="w-full rounded-xl bg-neutral-900 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-yellow-400" />
          <span className="text-neutral-400 text-[11px] font-medium">
            Needs review — 1 flag
          </span>
        </div>
        <span className="text-neutral-600 text-[10px]">Case #00847</span>
      </div>

      <AnimatePresence mode="wait">
        {resolved ? (
          <motion.div
            key="resolved"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center gap-3 py-16 px-6"
          >
            <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <span className="text-neutral-300 text-sm font-medium">Case approved</span>
            <span className="text-neutral-600 text-[11px] text-center">
              Correction saved as training data
            </span>
            <button
              onClick={handleReset}
              className="mt-2 px-4 py-1.5 rounded-full text-[11px] font-medium bg-white/8 text-neutral-400 hover:bg-white/12 transition-colors cursor-pointer"
            >
              Reset
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="review"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col sm:flex-row"
          >
            {/* Document preview */}
            <div
              className="sm:w-[50%] flex-shrink-0 flex flex-col items-center gap-2 p-5 border-b sm:border-b-0 sm:border-r border-white/5"
              style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}
            >
              <div
                className="w-full flex-1 rounded-lg flex flex-col gap-2 p-4"
                style={{
                  background: '#E8E4E0',
                  border: '1px solid rgba(0,0,0,0.08)',
                  fontFamily: 'var(--font-ibm-plex-mono), monospace',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
                }}
              >
                {/* Mock document */}
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="text-[11px] font-semibold" style={{ color: '#2a2a2a' }}>Detroit Edison</div>
                    <div className="text-[10px]" style={{ color: '#777' }}>Monthly Statement</div>
                  </div>
                  <div className="text-[10px]" style={{ color: '#777' }}>Nov 2025</div>
                </div>
                {[
                  ['Account holder', 'Maria Gonzalez'],
                  ['Service address', '4821 Elm Street'],
                  ['', 'Detroit, MI'],
                  ['Amount due', '$142.00'],
                  ['Due date', 'Dec 15, 2025'],
                ].map(([label, value], i) => (
                  <div key={i} className="flex justify-between gap-2 py-0.5">
                    <span className="text-[10px]" style={{ color: '#999' }}>{label}</span>
                    <span className="text-[10px] text-right font-medium" style={{ color: '#333' }}>{value}</span>
                  </div>
                ))}
                <div className="flex-1" />
                <div
                  className="pt-2 flex justify-between"
                  style={{ borderTop: '1px solid rgba(0,0,0,0.08)' }}
                >
                  <span className="text-[9px]" style={{ color: '#aaa' }}>Account #DTE-88821</span>
                  <span className="text-[9px]" style={{ color: '#aaa' }}>Page 1 of 1</span>
                </div>
              </div>
              <span className="text-neutral-500 text-[10px]">utility_bill_nov2025.pdf</span>
            </div>

            {/* Extracted fields */}
            <div className="flex-1 flex flex-col">
              <div className="flex-1 divide-y divide-white/5">
                {fields.map((field) => {
                  const state = fieldStates[field.id];
                  const isFlagged = state === 'flagged';
                  const isAccepted = state === 'accepted';
                  const isConfirmed = state === 'confirmed';
                  const isCorrecting = state === 'correcting';
                  const isInsufficient = state === 'insufficient';

                  return (
                    <div key={field.id} className="px-4 py-3">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-1.5">
                          <span className="text-neutral-500 text-[9px] uppercase tracking-wider">
                            {field.label}
                          </span>
                          {(isAccepted || isConfirmed) && (
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                          {isInsufficient && (
                            <span className="text-[9px] text-red-400">insufficient</span>
                          )}
                        </div>

                        {isCorrecting ? (
                          <input
                            className="w-full text-[11px] text-white bg-white/5 border border-white/20 rounded px-2 py-1 outline-none focus:border-white/40"
                            value={correctionValue}
                            onChange={e => setCorrectionValue(e.target.value)}
                            style={{ fontFamily: 'var(--font-ibm-plex-mono), monospace' }}
                            autoFocus
                          />
                        ) : (
                          <span
                            className="text-[12px] block"
                            style={{
                              color: isFlagged ? '#f87171' : isInsufficient ? '#6b7280' : 'rgba(255,255,255,0.8)',
                              fontFamily: 'var(--font-ibm-plex-mono), monospace',
                              textDecoration: isInsufficient ? 'line-through' : 'none',
                            }}
                          >
                            {field.extracted}
                          </span>
                        )}

                        {isFlagged && (
                          <span className="text-[9px] text-red-400/70 block">
                            {field.reason}
                          </span>
                        )}

                        {(isFlagged || isCorrecting) && (
                          <div className="flex flex-wrap gap-1.5 mt-1">
                            {isCorrecting ? (
                              <button
                                onClick={handleSaveCorrection}
                                className="px-2 py-1 rounded text-[10px] font-medium bg-white text-neutral-900 hover:bg-neutral-200 transition-colors cursor-pointer"
                              >
                                Save
                              </button>
                            ) : (
                              <>
                                <button
                                  onClick={() => handleAccept(field.id)}
                                  className="px-2 py-1 rounded text-[10px] font-medium transition-colors cursor-pointer"
                                  style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)' }}
                                >
                                  Accept
                                </button>
                                <button
                                  onClick={() => handleCorrect(field.id)}
                                  className="px-2 py-1 rounded text-[10px] font-medium transition-colors cursor-pointer"
                                  style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)' }}
                                >
                                  Revise
                                </button>
                                <button
                                  onClick={handleInsufficient}
                                  className="px-2 py-1 rounded text-[10px] font-medium transition-colors cursor-pointer"
                                  style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)' }}
                                >
                                  Insufficient
                                </button>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Submit */}
              <div className="px-4 py-3 border-t border-white/5">
                <button
                  onClick={handleSubmit}
                  disabled={!allResolved}
                  className="w-full py-2 rounded-lg text-[12px] font-medium transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                  style={{
                    background: allResolved ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.08)',
                    color: allResolved ? '#0a0a0a' : 'rgba(255,255,255,0.4)',
                  }}
                >
                  {allResolved ? 'Approve case' : 'Resolve all flags to continue'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
