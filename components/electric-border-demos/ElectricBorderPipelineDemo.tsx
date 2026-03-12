'use client';
import React from 'react';
import './ElectricBorderPipelineDemo.css';

const stages = [
  {
    id: 'eb-pipe-1',
    label: 'Turbulence',
    description: 'Raw fractal noise',
    filter: (
      <filter id="eb-pipe-1" colorInterpolationFilters="sRGB" x="-20%" y="-20%" width="140%" height="140%">
        <feTurbulence type="turbulence" baseFrequency="0.018" numOctaves="8" seed="3" result="noise" />
        <feComposite in="noise" in2="SourceGraphic" operator="in" />
      </filter>
    ),
  },
  {
    id: 'eb-pipe-2',
    label: 'Offset + Animate',
    description: 'Noise scrolling over time',
    filter: (
      <filter id="eb-pipe-2" colorInterpolationFilters="sRGB" x="-20%" y="-20%" width="140%" height="140%">
        <feTurbulence type="turbulence" baseFrequency="0.018" numOctaves="8" seed="3" result="noise1" />
        <feOffset in="noise1" result="offsetNoise1">
          <animate attributeName="dy" values="325; 0; -325" dur="6s" repeatCount="indefinite" calcMode="linear" begin="-1.8s" />
        </feOffset>
        <feComposite in="offsetNoise1" in2="SourceGraphic" operator="in" />
      </filter>
    ),
  },
  {
    id: 'eb-pipe-3',
    label: 'Color Dodge Blend',
    description: 'Two noise fields combined',
    filter: (
      <filter id="eb-pipe-3" colorInterpolationFilters="sRGB" x="-20%" y="-20%" width="140%" height="140%">
        <feTurbulence type="turbulence" baseFrequency="0.018" numOctaves="8" result="noise1" seed="3" />
        <feOffset in="noise1" result="offsetNoise1">
          <animate attributeName="dy" values="325; 0; -325" dur="6s" repeatCount="indefinite" calcMode="linear" begin="-1.8s" />
        </feOffset>
        <feTurbulence type="turbulence" baseFrequency="0.022" numOctaves="9" result="noise3" seed="5" />
        <feOffset in="noise3" result="offsetNoise3">
          <animate attributeName="dx" values="260; 0; -260" dur="6s" repeatCount="indefinite" calcMode="linear" begin="-3s" />
        </feOffset>
        <feBlend in="offsetNoise1" in2="offsetNoise3" mode="color-dodge" result="combined" />
        <feComposite in="combined" in2="SourceGraphic" operator="in" />
      </filter>
    ),
  },
  {
    id: 'eb-pipe-4',
    label: 'Displacement',
    description: 'Noise warps the card edge',
    filter: (
      <filter id="eb-pipe-4" colorInterpolationFilters="sRGB" x="-20%" y="-20%" width="140%" height="140%">
        <feTurbulence type="turbulence" baseFrequency="0.018" numOctaves="8" result="noise1" seed="3" />
        <feOffset in="noise1" result="offsetNoise1">
          <animate attributeName="dy" values="325; 0; -325" dur="6s" repeatCount="indefinite" calcMode="linear" begin="-1.8s" />
        </feOffset>
        <feTurbulence type="turbulence" baseFrequency="0.018" numOctaves="8" result="noise2" seed="3" />
        <feOffset in="noise2" result="offsetNoise2">
          <animate attributeName="dy" values="-325; 0; 325" dur="6s" repeatCount="indefinite" calcMode="linear" begin="-4.2s" />
        </feOffset>
        <feTurbulence type="turbulence" baseFrequency="0.022" numOctaves="9" result="noise3" seed="5" />
        <feOffset in="noise3" result="offsetNoise3">
          <animate attributeName="dx" values="260; 0; -260" dur="6s" repeatCount="indefinite" calcMode="linear" begin="-3s" />
        </feOffset>
        <feTurbulence type="turbulence" baseFrequency="0.022" numOctaves="9" result="noise4" seed="5" />
        <feOffset in="noise4" result="offsetNoise4">
          <animate attributeName="dx" values="-260; 0; 260" dur="6s" repeatCount="indefinite" calcMode="linear" begin="-1.2s" />
        </feOffset>
        <feComposite in="offsetNoise1" in2="offsetNoise2" result="part1" />
        <feComposite in="offsetNoise3" in2="offsetNoise4" result="part2" />
        <feBlend in="part1" in2="part2" mode="color-dodge" result="combinedNoise" />
        <feDisplacementMap in="SourceGraphic" in2="combinedNoise" scale="30" xChannelSelector="R" yChannelSelector="B" />
      </filter>
    ),
  },
];

export default function ElectricBorderPipelineDemo() {
  return (
    <div className="eb-pipe-wrapper rounded-xl bg-neutral-900">
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          {stages.map((s) => React.cloneElement(s.filter, { key: s.id }))}
        </defs>
      </svg>
      <div className="eb-pipe-grid">
        {stages.map(({ id, label, description }) => (
          <div key={id} className="eb-pipe-item">
            <div className="eb-pipe-card" style={{ filter: `url(#${id})`, borderColor: '#FF00FF' }} />
            <span className="eb-pipe-label">{label}</span>
            <span className="eb-pipe-desc">{description}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
