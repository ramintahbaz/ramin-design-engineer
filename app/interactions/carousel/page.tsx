'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import AnimatedPage from '@/components/AnimatedPage';
import ProjectPageShell from '@/components/ProjectPageShell';

export const carouselMetadata = {
  id: 'carousel',
  title: 'Netflix film scroll',
  date: 'November 2024',
  cardDate: 'Nov 2024',
  cardDescription: 'Horizontal scroll animation.',
  href: '/interactions/carousel',
  shareTitle: 'Netflix film scroll — Ramin — Designer',
  shareText: 'A Netflix-style horizontal scroll animation featuring some of my favorite movies and shows.',
};

const carouselImages = [
  { id: '1', src: '/images/carousel/dark_knight.jpg', alt: 'The Dark Knight', label: 'The Dark Knight' },
  { id: '2', src: '/images/carousel/interstellar.jpg', alt: 'Interstellar', label: 'Interstellar' },
  { id: '3', src: '/images/carousel/stranger_things.jpg', alt: 'Stranger Things', label: 'Stranger Things' },
  { id: '4', src: '/images/carousel/the_prestige.jpg', alt: 'The Prestige', label: 'The Prestige' },
];

export default function CarouselPage() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [cardWidth, setCardWidth] = useState(240);
  const [isMobile, setIsMobile] = useState(false);
  const [scrollLeft, setScrollLeft] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollWrapperRef = useRef<HTMLDivElement>(null);

  // Responsive card sizing
  useEffect(() => {
    const updateCardWidth = () => {
      const width = window.innerWidth;
      setCardWidth(width >= 640 ? 240 : 180);
      setIsMobile(width < 640);
    };
    updateCardWidth();
    window.addEventListener('resize', updateCardWidth);
    return () => window.removeEventListener('resize', updateCardWidth);
  }, []);

  // On mobile, ensure first card is in focus on load
  useEffect(() => {
    if (isMobile && scrollLeft === 0) {
      // First card should be in focus position (centered)
      // No need to change scrollLeft, it's already at 0 which centers the first card
    }
  }, [isMobile, scrollLeft]);


  const cardGap = 12;

  // Calculate card styles; only ONE card is "in focus" (closest to center)
  const getCardStyles = (index: number) => {
    const scrollWrapper = scrollWrapperRef.current;
    if (!scrollWrapper) return { scale: 1, x: 0, isInFocus: false };

    const transformOffset = 120;
    const viewportCenter = scrollWrapper.clientWidth / 2;

    // Single focused card: the one whose center is closest to viewport center
    let focusedIndex = 0;
    let minDist = Infinity;
    for (let i = 0; i < carouselImages.length; i++) {
      const cardLeft = i * (cardWidth + cardGap) + transformOffset;
      const cardCenter = cardLeft - scrollLeft + cardWidth / 2;
      const dist = Math.abs(cardCenter - viewportCenter);
      if (dist < minDist) {
        minDist = dist;
        focusedIndex = i;
      }
    }
    const isInFocus = isMobile && index === focusedIndex;

    const cardLeft = index * (cardWidth + cardGap) + transformOffset;
    const cardCenter = cardLeft - scrollLeft + cardWidth / 2;
    const distanceFromCenter = Math.abs(cardCenter - viewportCenter);

    const parallaxOffset = (cardCenter - viewportCenter) * 0.03;
    const focusZone = cardWidth * 0.8;
    const scaleProgress = isMobile
      ? Math.max(0, Math.min(1, 1 - distanceFromCenter / focusZone))
      : 0;
    const baseScale = isMobile
      ? (isInFocus ? 1.1 : 0.9 + scaleProgress * 0.2)
      : 1;

    return { x: parallaxOffset, scale: baseScale, isInFocus };
  };

  const description = (
    <>
      <p className="mb-2 sm:mb-3">
        A Netflix-style horizontal scroll animation featuring some of my favorite movies and shows.
      </p>
      <p className="mb-2 sm:mb-3">
        Built using Next.js, Framer Motion, and Tailwind CSS.
      </p>
    </>
  );

  // Prevent horizontal page scrolling
  useEffect(() => {
    const preventHorizontalScroll = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        const target = e.target as HTMLElement;
        const scrollWrapper = scrollWrapperRef.current;
        
        if (scrollWrapper && scrollWrapper.contains(target)) {
          return;
        }
        
        e.preventDefault();
      }
    };

    window.addEventListener('wheel', preventHorizontalScroll, { passive: false });
    return () => window.removeEventListener('wheel', preventHorizontalScroll);
  }, []);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    let startX = 0;
    let startY = 0;
    let startScrollLeft = 0;
    let lockedDirection: 'horizontal' | 'vertical' | null = null;

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      startScrollLeft = scrollLeft;
      lockedDirection = null;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      const dx = e.touches[0].clientX - startX;
      const dy = e.touches[0].clientY - startY;
      if (lockedDirection === null && (Math.abs(dx) > 10 || Math.abs(dy) > 10)) {
        lockedDirection = Math.abs(dx) >= Math.abs(dy) ? 'horizontal' : 'vertical';
      }
      if (lockedDirection === 'horizontal') {
        e.preventDefault();
        const containerWidth = scrollContainerRef.current?.scrollWidth || 0;
        const wrapperWidth = scrollWrapperRef.current?.clientWidth || 0;
        const maxScroll = Math.max(0, containerWidth - wrapperWidth + 240);
        setScrollLeft(Math.max(0, Math.min(maxScroll, startScrollLeft - dx)));
      }
    };

    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
    };
  }, [scrollLeft]);

  return (
    <AnimatedPage variant="dramatic">
      <ProjectPageShell
        title={carouselMetadata.title}
        date={carouselMetadata.date}
        category="Interaction"
        description={description}
        backHref="/craft"
        backLabel="Craft"
        shareConfig={{
          title: carouselMetadata.shareTitle,
          text: carouselMetadata.shareText,
        }}
      >
        <div 
          className="w-full max-w-[680px] mx-auto relative px-4 sm:px-0"
          style={{ overflow: 'visible' }}
        >
          {/* Scroll wrapper - NO overflow constraints, allows cards to overflow */}
          <div
            ref={scrollWrapperRef}
            style={{
              width: '100%',
              overflow: 'visible',
              position: 'relative',
              paddingTop: '60px',
              paddingBottom: '60px',
              paddingLeft: '120px',
              marginLeft: '-120px',
              paddingRight: '120px',
              marginRight: '-120px',
              touchAction: 'pan-y',
            }}
            onWheel={(e) => {
              if (Math.abs(e.deltaX) > Math.abs(e.deltaY) || e.shiftKey) {
                e.preventDefault();
                const containerWidth = scrollContainerRef.current?.scrollWidth || 0;
                const wrapperWidth = scrollWrapperRef.current?.clientWidth || 0;
                const maxScroll = Math.max(0, containerWidth - wrapperWidth + 240);
                const newScroll = Math.max(0, Math.min(maxScroll, scrollLeft + (e.deltaX || e.deltaY)));
                setScrollLeft(newScroll);
              }
            }}
          >
            {/* Cards container - uses transform for scrolling, no overflow constraints */}
            <div
              ref={scrollContainerRef}
              className="flex relative"
              style={{
                width: `${carouselImages.length * (cardWidth + cardGap)}px`,
                minWidth: '100%',
                transform: `translateX(${120 - scrollLeft}px)`,
                transition: 'transform 0.1s ease-out',
                touchAction: 'pan-y',
              }}
              onTouchStart={(e) => e.stopPropagation()}
            >
              {carouselImages.map((card, index) => {
                const isHovered = hoveredIndex === index;
                const scrollStyles = getCardStyles(index);
                const isInFocus = scrollStyles.isInFocus;
                
                return (
                  <motion.div
                    key={card.id}
                    className="flex-shrink-0 cursor-pointer"
                    style={{
                      width: `${cardWidth}px`,
                      marginRight: `${cardGap}px`,
                      position: 'relative',
                      zIndex: isHovered ? 50 : isInFocus ? 10 : 1,
                    }}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    animate={{
                      scale: isHovered ? 1.15 : scrollStyles.scale,
                      y: isHovered ? -20 : (isInFocus && isMobile) ? -15 : 0,
                      x: isHovered ? 0 : scrollStyles.x,
                    }}
                    transition={{
                      type: isMobile ? 'tween' : 'spring',
                      duration: isMobile ? 0.4 : undefined,
                      ease: isMobile ? [0.25, 0.1, 0.25, 1] : undefined,
                      stiffness: isMobile ? undefined : 300,
                      damping: isMobile ? undefined : 30,
                      mass: isMobile ? undefined : 0.8,
                    }}
                  >
                    <motion.div 
                      className="w-full rounded-lg overflow-hidden bg-gray-200 shadow-lg" 
                      style={{ 
                        height: 'clamp(240px, 45vw, 360px)',
                        width: '100%',
                        transform: 'translateZ(0)',
                        backfaceVisibility: 'hidden',
                      }}
                      animate={{
                        boxShadow: isHovered 
                          ? '0 20px 40px rgba(0, 0, 0, 0.3)' 
                          : (isInFocus && isMobile)
                          ? '0 15px 30px rgba(0, 0, 0, 0.25)' 
                          : '0 4px 8px rgba(0, 0, 0, 0.1)',
                      }}
                      transition={{
                        duration: 0.2,
                        ease: 'easeOut',
                      }}
                    >
                      <img
                        src={card.src}
                        alt={card.alt}
                        className="w-full h-full object-cover"
                        draggable={false}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </ProjectPageShell>
    </AnimatedPage>
  );
}
