'use client';
import { useState } from 'react';

const PRESETS = {
  earthy: {
    label: 'Earthy / Organic',
    palette: { primary: '#8B6F4E', accent: '#C4956A', neutral: '#F5F0E8' },
    typography: { fontFamily: 'Lora', category: 'serif', weight: 'regular' },
    radius: 'subtle',
    spacing: 'airy',
    materialStyle: 'flat',
    material: { translucency: 0, blur: 0, gloss: 0.1, texture: 0.6, softness: 0.7, elevation: 0.2, contrast: 0.4, edgeHighlight: 0 },
  },
  glass: {
    label: 'Glassmorphic',
    palette: { primary: '#6C8EBF', accent: '#A8C5E8', neutral: '#1A2332' },
    typography: { fontFamily: 'Inter', category: 'sans-serif', weight: 'light' },
    radius: 'rounded',
    spacing: 'medium',
    materialStyle: 'glass',
    material: { translucency: 0.8, blur: 0.9, gloss: 0.6, texture: 0, softness: 0.8, elevation: 0.3, contrast: 0.3, edgeHighlight: 0.7 },
  },
  luxury: {
    label: 'Luxury / Editorial',
    palette: { primary: '#1A1A1A', accent: '#C9A84C', neutral: '#F8F5F0' },
    typography: { fontFamily: 'Playfair Display', category: 'serif', weight: 'regular' },
    radius: 'sharp',
    spacing: 'airy',
    materialStyle: 'solid',
    material: { translucency: 0, blur: 0, gloss: 0.3, texture: 0.1, softness: 0.4, elevation: 0.5, contrast: 0.9, edgeHighlight: 0.2 },
  },
  tech: {
    label: 'Tech / Futuristic',
    palette: { primary: '#00FF94', accent: '#0A0A0A', neutral: '#111111' },
    typography: { fontFamily: 'JetBrains Mono', category: 'mono', weight: 'medium' },
    radius: 'sharp',
    spacing: 'tight',
    materialStyle: 'solid',
    material: { translucency: 0, blur: 0, gloss: 0.8, texture: 0, softness: 0.2, elevation: 0.7, contrast: 1, edgeHighlight: 0.9 },
  },
} as const;

type PresetKey = keyof typeof PRESETS;

const radiusMap = { sharp: '0px', subtle: '4px', rounded: '12px', pill: '999px' };
const spacingMap = { tight: '8px', medium: '16px', airy: '28px' };

function MaterialBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-neutral-500 text-[9px] w-20 shrink-0 uppercase tracking-wider">{label}</span>
      <div className="flex-1 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
        <div
          className="h-full rounded-full"
          style={{ width: `${value * 100}%`, background: 'rgba(255,255,255,0.35)', transition: 'width 0.4s ease' }}
        />
      </div>
      <span className="text-neutral-600 text-[9px] w-6 text-right">{Math.round(value * 100)}</span>
    </div>
  );
}

export default function FingerprintDemo() {
  const [activePreset, setActivePreset] = useState<PresetKey>('earthy');
  const preset = PRESETS[activePreset];

  const isDark = preset.palette.neutral.startsWith('#1') || preset.palette.neutral.startsWith('#0');

  return (
    <div className="w-full rounded-xl bg-neutral-900 overflow-hidden">
      {/* Preset switcher */}
      <div className="flex gap-1 p-3 border-b border-white/5 overflow-x-auto">
        {(Object.keys(PRESETS) as PresetKey[]).map(key => (
          <button
            key={key}
            onClick={() => setActivePreset(key)}
            className="px-3 py-1.5 rounded-full text-[10px] font-medium whitespace-nowrap transition-colors cursor-pointer flex-shrink-0"
            style={{
              background: activePreset === key ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.06)',
              color: activePreset === key ? '#0a0a0a' : 'rgba(255,255,255,0.5)',
            }}
          >
            {PRESETS[key].label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-px" style={{ background: 'rgba(255,255,255,0.04)' }}>

        {/* Palette */}
        <div className="bg-neutral-900 p-4 flex flex-col gap-3">
          <span className="text-neutral-500 text-[9px] uppercase tracking-wider">Palette</span>
          <div className="flex flex-col gap-2">
            {[
              { label: 'Primary', color: preset.palette.primary },
              { label: 'Accent', color: preset.palette.accent },
              { label: 'Neutral', color: preset.palette.neutral },
            ].map(({ label, color }) => (
              <div key={label} className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded flex-shrink-0"
                  style={{ background: color, border: '1px solid rgba(255,255,255,0.08)' }}
                />
                <span className="text-neutral-400 text-[11px]">{color}</span>
                <span className="text-neutral-600 text-[9px] ml-auto">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Typography */}
        <div className="bg-neutral-900 p-4 flex flex-col gap-3">
          <span className="text-neutral-500 text-[9px] uppercase tracking-wider">Typography</span>
          <div className="flex flex-col gap-2">
            <div
              className="text-white/80 leading-tight"
              style={{
                fontFamily: preset.typography.fontFamily + ', serif',
                fontSize: 20,
                fontWeight: (() => { const w = preset.typography.weight as string; return w === 'light' ? 300 : w === 'medium' ? 500 : w === 'bold' ? 700 : 400; })(),
              }}
            >
              The quick brown fox
            </div>
            <div className="flex gap-3 mt-1">
              <span className="text-neutral-500 text-[9px]">{preset.typography.fontFamily}</span>
              <span className="text-neutral-600 text-[9px]">{preset.typography.category}</span>
              <span className="text-neutral-600 text-[9px]">{preset.typography.weight}</span>
            </div>
          </div>
        </div>

        {/* Tokens */}
        <div className="bg-neutral-900 p-4 flex flex-col gap-3">
          <span className="text-neutral-500 text-[9px] uppercase tracking-wider">Tokens</span>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <span className="text-neutral-600 text-[9px] w-16">Radius</span>
              <div
                className="w-10 h-10 border border-white/20"
                style={{ borderRadius: radiusMap[preset.radius], background: 'rgba(255,255,255,0.06)', transition: 'border-radius 0.3s ease' }}
              />
              <span className="text-neutral-400 text-[10px]">{preset.radius}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-neutral-600 text-[9px] w-16">Spacing</span>
              <div className="flex items-center" style={{ gap: spacingMap[preset.spacing], transition: 'gap 0.3s ease' }}>
                {[0,1,2].map(i => (
                  <div key={i} className="w-4 h-4 rounded-sm" style={{ background: 'rgba(255,255,255,0.15)' }} />
                ))}
              </div>
              <span className="text-neutral-400 text-[10px]">{preset.spacing}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-neutral-600 text-[9px] w-16">Material</span>
              <span className="text-neutral-400 text-[10px]">{preset.materialStyle}</span>
            </div>
          </div>
        </div>

        {/* Material */}
        <div className="bg-neutral-900 p-4 flex flex-col gap-3">
          <span className="text-neutral-500 text-[9px] uppercase tracking-wider">Material</span>
          <div className="flex flex-col gap-2">
            {(Object.entries(preset.material) as [string, number][]).map(([key, val]) => (
              <MaterialBar key={key} label={key} value={val} />
            ))}
          </div>
        </div>

      </div>

      {/* Preview card */}
      <div
        className="p-6 flex items-center justify-center"
        style={{ background: preset.palette.neutral, transition: 'background 0.4s ease', minHeight: 140 }}
      >
        <div
          style={{
            background: preset.material.translucency > 0.3
              ? `rgba(255,255,255,${preset.material.translucency * 0.15})`
              : preset.palette.primary,
            backdropFilter: preset.material.blur > 0.3 ? `blur(${preset.material.blur * 20}px)` : undefined,
            borderRadius: radiusMap[preset.radius],
            padding: `${parseInt(spacingMap[preset.spacing]) * 0.75}px ${parseInt(spacingMap[preset.spacing]) * 1.25}px`,
            border: preset.material.edgeHighlight > 0.4
              ? `1px solid rgba(255,255,255,${preset.material.edgeHighlight * 0.4})`
              : `1px solid rgba(0,0,0,0.1)`,
            boxShadow: preset.material.elevation > 0.3
              ? `0 ${preset.material.elevation * 24}px ${preset.material.elevation * 40}px rgba(0,0,0,${preset.material.contrast * 0.4})`
              : 'none',
            transition: 'all 0.4s ease',
          }}
        >
          <span
            style={{
              fontFamily: preset.typography.fontFamily + ', serif',
              fontSize: 13,
              fontWeight: (() => { const w = preset.typography.weight as string; return w === 'light' ? 300 : w === 'medium' ? 500 : w === 'bold' ? 700 : 400; })(),
              color: preset.material.translucency > 0.3 ? 'rgba(255,255,255,0.9)' : (isDark ? '#ffffff' : preset.palette.neutral),
            }}
          >
            {preset.materialStyle} · {preset.typography.category}
          </span>
        </div>
      </div>
    </div>
  );
}
