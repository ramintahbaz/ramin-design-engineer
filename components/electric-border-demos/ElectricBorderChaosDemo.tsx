'use client';
import './ElectricBorderChaosDemo.css';

const levels = [
  { label: 'Low', scale: 8, id: 'eb-chaos-low' },
  { label: 'Default', scale: 30, id: 'eb-chaos-mid' },
  { label: 'High', scale: 80, id: 'eb-chaos-high' },
];

export default function ElectricBorderChaosDemo() {
  return (
    <div className="eb-chaos-wrapper rounded-xl bg-neutral-900">
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          {levels.map(({ id, scale }) => (
            <filter key={id} id={id} colorInterpolationFilters="sRGB" x="-20%" y="-20%" width="140%" height="140%">
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
              <feDisplacementMap in="SourceGraphic" in2="combinedNoise" scale={String(scale)} xChannelSelector="R" yChannelSelector="B" />
            </filter>
          ))}
        </defs>
      </svg>
      <div className="eb-chaos-grid">
        {levels.map(({ label, id, scale }) => (
          <div key={id} className="eb-chaos-item">
            <div className="eb-chaos-card" style={{ filter: `url(#${id})`, borderColor: '#FF00FF' }} />
            <span className="eb-chaos-label">{label} — scale {scale}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
