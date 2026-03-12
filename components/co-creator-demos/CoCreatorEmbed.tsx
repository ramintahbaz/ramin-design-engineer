'use client';
import { useRef } from 'react';

const VIDEO_SRC = '/images/co-creator/taste%20%E2%86%92%20system%20demo.mp4';

export default function CoCreatorEmbed() {
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <div className="w-full rounded-xl overflow-hidden" style={{ background: '#111' }}>
      <video
        ref={videoRef}
        src={VIDEO_SRC}
        className="w-full h-auto block"
        muted
        loop
        playsInline
        autoPlay
        preload="metadata"
        disablePictureInPicture
        controlsList="nodownload nofullscreen noremoteplayback"
        style={{ pointerEvents: 'none', display: 'block', verticalAlign: 'middle' }}
      />
    </div>
  );
}
