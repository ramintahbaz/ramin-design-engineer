'use client';
import Image from 'next/image';

const RETAILERS = [
  {
    name: 'Target',
    logo: '/images/keycadets/logos/407-4075173_target-logo-png-transparent-svg-vector-target-png.png',
    detail: '1,900+ stores nationwide',
    tag: 'Brick & mortar',
  },
  {
    name: 'Walmart',
    logo: '/images/keycadets/logos/Walmart_logo_(2008).svg',
    detail: 'Largest US retailer',
    tag: 'Brick & mortar',
  },
  {
    name: 'Best Buy',
    logo: '/images/keycadets/logos/Best_Buy_Logo.svg.png',
    detail: '1,000+ stores nationwide',
    tag: 'Brick & mortar',
  },
  {
    name: 'MicroCenter',
    logo: '/images/keycadets/logos/micro_center-logo_brandlogos.net_2epza-512x512.png',
    detail: 'Enthusiast destination',
    tag: 'Brick & mortar',
  },
  {
    name: 'Drop.com',
    logo: '/images/keycadets/logos/drop-logo-vector.png',
    detail: 'Mechanical keyboard audience',
    tag: 'E-commerce',
  },
];

export default function RetailMapDemo() {
  return (
    <div className="w-full rounded-xl bg-neutral-900 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
        <span className="text-neutral-500 text-[9px] uppercase tracking-wider">Retail Partners</span>
        <span className="text-neutral-600 text-[9px]">5 retailers · national</span>
      </div>

      {/* Retailer list */}
      <div className="divide-y divide-white/[0.04]">
        {RETAILERS.map((r) => (
          <div key={r.name} className="flex items-center gap-4 px-4 py-3.5">
            {/* Logo */}
            <div
              className="w-24 h-8 relative flex-shrink-0 rounded overflow-hidden"
              style={{ background: r.name === 'MicroCenter' ? 'white' : 'transparent' }}
            >
              <Image
                src={r.logo}
                alt={r.name}
                fill
                className="object-contain object-center"
                style={r.name === 'MicroCenter' ? { transform: 'scale(1.8)' } : undefined}
              />
            </div>

            {/* Detail */}
            <div className="flex-1 min-w-0">
              <div className="text-neutral-500 text-[11px]">{r.detail}</div>
            </div>

            {/* Tag */}
            <span
              className="text-[9px] px-2 py-0.5 rounded-full font-medium flex-shrink-0"
              style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.35)' }}
            >
              {r.tag}
            </span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div
        className="px-4 py-3 flex items-center justify-between"
        style={{ borderTop: '1px solid rgba(255,255,255,0.04)', background: 'rgba(255,255,255,0.02)' }}
      >
        <span className="text-neutral-600 text-[9px]">20+ SKUs across all channels</span>
        <span
          className="text-[9px] px-2 py-0.5 rounded-full font-medium"
          style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.3)' }}
        >
          Acquired 2024
        </span>
      </div>
    </div>
  );
}
