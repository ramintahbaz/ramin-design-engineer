'use client';
import Image from 'next/image';

export default function SunsetEmbed() {
  return (
    <div className="w-full">
      <Image
        src="/images/sunset_chaser.png"
        alt="Sunset Chaser"
        width={1200}
        height={1600}
        className="w-full h-auto"
        style={{ display: 'block' }}
      />
    </div>
  );
}
