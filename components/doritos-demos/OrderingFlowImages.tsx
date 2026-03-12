'use client';

export default function OrderingFlowImages() {
  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-3">
      {[
        { src: '/images/doritos/Menu.jpg', alt: 'Doritos Loaded menu screen' },
        { src: '/images/doritos/Type=Base.png', alt: 'Doritos Loaded Base' },
        { src: '/images/doritos/Type=Protein.png', alt: 'Doritos Loaded Protein' },
      ].map(({ src, alt }) => (
        <div
          key={src}
          className="overflow-hidden rounded-xl"
        >
          <img
            src={src}
            alt={alt}
            className="w-full h-auto"
            style={{ display: 'block' }}
          />
        </div>
      ))}
    </div>
  );
}
