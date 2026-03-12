'use client';
import { useRef } from 'react';
import './ElectricBorderRawDemo.css';

export default function ElectricBorderRawDemo() {
  const filterRef = useRef<SVGFilterElement>(null);

  return (
    <div className="eb-raw-wrapper rounded-xl bg-neutral-900">
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <filter
            ref={filterRef}
            id="eb-raw-displace"
            colorInterpolationFilters="sRGB"
            x="-20%" y="-20%" width="140%" height="140%"
          >
            <feTurbulence type="turbulence" baseFrequency="0.018" numOctaves="8" result="noise1" seed="3" />
            <feOffset in="noise1" dx="0" dy="0" result="offsetNoise1">
              <animate attributeName="dy" values="325; 0; -325" dur="6s" repeatCount="indefinite" calcMode="linear" begin="-1.8s" />
            </feOffset>
            <feTurbulence type="turbulence" baseFrequency="0.018" numOctaves="8" result="noise2" seed="3" />
            <feOffset in="noise2" dx="0" dy="0" result="offsetNoise2">
              <animate attributeName="dy" values="-325; 0; 325" dur="6s" repeatCount="indefinite" calcMode="linear" begin="-4.2s" />
            </feOffset>
            <feTurbulence type="turbulence" baseFrequency="0.022" numOctaves="9" result="noise3" seed="5" />
            <feOffset in="noise3" dx="0" dy="0" result="offsetNoise3">
              <animate attributeName="dx" values="260; 0; -260" dur="6s" repeatCount="indefinite" calcMode="linear" begin="-3s" />
            </feOffset>
            <feTurbulence type="turbulence" baseFrequency="0.022" numOctaves="9" result="noise4" seed="5" />
            <feOffset in="noise4" dx="0" dy="0" result="offsetNoise4">
              <animate attributeName="dx" values="-260; 0; 260" dur="6s" repeatCount="indefinite" calcMode="linear" begin="-1.2s" />
            </feOffset>
            <feComposite in="offsetNoise1" in2="offsetNoise2" result="part1" />
            <feComposite in="offsetNoise3" in2="offsetNoise4" result="part2" />
            <feBlend in="part1" in2="part2" mode="color-dodge" result="combinedNoise" />
            <feDisplacementMap in="SourceGraphic" in2="combinedNoise" scale="30" xChannelSelector="R" yChannelSelector="B" />
          </filter>
        </defs>
      </svg>
      <div className="eb-raw-label">Raw displacement — no color, no glow</div>
      <div className="eb-raw-card" style={{ filter: 'url(#eb-raw-displace)' }} />
    </div>
  );
}
