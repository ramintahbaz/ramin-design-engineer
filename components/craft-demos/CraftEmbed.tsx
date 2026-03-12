'use client';
import Image from 'next/image';

export default function CraftEmbed() {
  return (
    <div className="w-full">
      <Image
        src="/images/craft/Craft_new.png"
        alt="Craft"
        width={1200}
        height={1600}
        className="w-full h-auto rounded-xl"
        style={{ display: 'block' }}
      />
    </div>
  );
}
