'use client';
import './ElectricBorderColorDemo.css';

const colors = [
  { label: 'Magenta', color: '#FF00FF', id: 'eb-color-magenta', rgb: '255,0,255' },
  { label: 'Cyan', color: '#00FFFF', id: 'eb-color-cyan', rgb: '0,255,255' },
  { label: 'Amber', color: '#FF8C00', id: 'eb-color-amber', rgb: '255,140,0' },
];

export default function ElectricBorderColorDemo() {
  return (
    <div className="eb-color-wrapper rounded-xl bg-neutral-900">
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          {colors.map(({ id }) => (
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
              <feDisplacementMap in="SourceGraphic" in2="combinedNoise" scale="30" xChannelSelector="R" yChannelSelector="B" />
            </filter>
          ))}
        </defs>
      </svg>
      <div className="eb-color-grid">
        {colors.map(({ label, color, id, rgb }) => (
          <div key={id} className="eb-color-item">
            <div className="eb-color-card-wrapper">
              <div
                className="eb-color-card"
                style={{ filter: `url(#${id})`, borderColor: color }}
              />
              <div className="eb-color-glow-1" style={{ borderColor: `rgba(${rgb},0.6)` }} />
              <div className="eb-color-glow-2" style={{ borderColor: color, filter: 'blur(4px)' }} />
            </div>
            <span className="eb-color-label">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
