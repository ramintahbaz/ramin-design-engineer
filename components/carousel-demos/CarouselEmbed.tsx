'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const carouselImages = [
  { id: '1', src: '/images/carousel/dark_knight.jpg', alt: 'The Dark Knight' },
  { id: '2', src: '/images/carousel/interstellar.jpg', alt: 'Interstellar' },
  { id: '3', src: '/images/carousel/stranger_things.jpg', alt: 'Stranger Things' },
  { id: '4', src: '/images/carousel/the_prestige.jpg', alt: 'The Prestige' },
];

const CARD_GAP = 12;
const PEEK_DESKTOP = 120;
const PEEK_MOBILE = 24;
/** Extra scroll range on mobile so the first card can be dragged further left (past flush). */
const MOBILE_OVERSCROLL_LEFT = 80;

export default function CarouselEmbed() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [cardWidth, setCardWidth] = useState(240);
  const [isMobile, setIsMobile] = useState(false);
  const [scrollLeft, setScrollLeft] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollWrapperRef = useRef<HTMLDivElement>(null);
  const scrollLeftRef = useRef(0);
  const cardWidthRef = useRef(240);
  const peekRef = useRef(PEEK_MOBILE);

  const peek = isMobile ? PEEK_MOBILE : PEEK_DESKTOP;
  peekRef.current = peek;

  scrollLeftRef.current = scrollLeft;
  cardWidthRef.current = cardWidth;

  // Match carousel page: responsive card sizing (640 breakpoint, 240/180)
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

  // Clamp scroll when container size or card width changes (e.g. resize / mobile)
  useEffect(() => {
    const containerWidth = scrollContainerRef.current?.scrollWidth ?? 0;
    const wrapperWidth = scrollWrapperRef.current?.clientWidth ?? 0;
    const overscrollLeft = isMobile ? MOBILE_OVERSCROLL_LEFT : 0;
    const maxScroll = Math.max(0, containerWidth - wrapperWidth + cardWidth + peek + overscrollLeft);
    setScrollLeft((prev) => Math.min(Math.max(0, prev), maxScroll));
  }, [cardWidth, isMobile, peek]);

  // Same getCardStyles logic as carousel page; only ONE card is "in focus" (closest to center)
  const getCardStyles = (index: number) => {
    const scrollWrapper = scrollWrapperRef.current;
    if (!scrollWrapper) return { scale: 1, x: 0, isInFocus: false };

    const transformOffset = peek;
    const viewportCenter = scrollWrapper.clientWidth / 2;

    // Single focused card: the one whose center is closest to viewport center
    let focusedIndex = 0;
    let minDist = Infinity;
    for (let i = 0; i < carouselImages.length; i++) {
      const cardLeft = i * (cardWidth + CARD_GAP) + transformOffset;
      const cardCenter = cardLeft - scrollLeft + cardWidth / 2;
      const dist = Math.abs(cardCenter - viewportCenter);
      if (dist < minDist) {
        minDist = dist;
        focusedIndex = i;
      }
    }
    const isInFocus = isMobile && index === focusedIndex;

    const cardLeft = index * (cardWidth + CARD_GAP) + transformOffset;
    const cardCenter = cardLeft - scrollLeft + cardWidth / 2;
    const distanceFromCenter = Math.abs(cardCenter - viewportCenter);

    const parallaxOffset = (cardCenter - viewportCenter) * 0.03;
    const focusZone = cardWidth * 0.8;
    const scaleProgress = isMobile
      ? Math.max(0, Math.min(1, 1 - distanceFromCenter / focusZone))
      : 0;
    const baseScale = isMobile
      ? isInFocus
        ? 1.1
        : 0.9 + scaleProgress * 0.2
      : 1;

    return { x: parallaxOffset, scale: baseScale, isInFocus };
  };

  // Wheel: capture phase so we get horizontal scroll before modal/document; only carousel scrolls
  useEffect(() => {
    const wrapper = scrollWrapperRef.current;
    if (!wrapper) return;

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY) || e.shiftKey) {
        e.preventDefault();
        e.stopPropagation();
        const containerWidth = scrollContainerRef.current?.scrollWidth ?? 0;
        const wrapperWidth = scrollWrapperRef.current?.clientWidth ?? 0;
        const cw = cardWidthRef.current;
        const pk = peekRef.current;
        const extraLeft = pk === PEEK_MOBILE ? MOBILE_OVERSCROLL_LEFT : 0;
        const maxScroll = Math.max(0, containerWidth - wrapperWidth + cw + pk + extraLeft);
        const newScroll = Math.max(
          0,
          Math.min(maxScroll, scrollLeftRef.current + (e.deltaX || e.deltaY))
        );
        setScrollLeft(newScroll);
      }
    };

    wrapper.addEventListener('wheel', onWheel, { capture: true, passive: false });
    return () => wrapper.removeEventListener('wheel', onWheel, { capture: true });
  }, []);

  // Touch: lock direction and update scroll; use wrapper + capture so we get events before modal
  useEffect(() => {
    const wrapper = scrollWrapperRef.current;
    if (!wrapper) return;
    let startX = 0;
    let startY = 0;
    let startScrollLeft = 0;
    let lockedDirection: 'horizontal' | 'vertical' | null = null;

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      startScrollLeft = scrollLeftRef.current;
      lockedDirection = null;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      const dx = e.touches[0].clientX - startX;
      const dy = e.touches[0].clientY - startY;
      if (
        lockedDirection === null &&
        (Math.abs(dx) > 10 || Math.abs(dy) > 10)
      ) {
        lockedDirection =
          Math.abs(dx) >= Math.abs(dy) ? 'horizontal' : 'vertical';
      }
      if (lockedDirection === 'horizontal') {
        e.preventDefault();
        e.stopPropagation();
        const containerWidth = scrollContainerRef.current?.scrollWidth ?? 0;
        const wrapperWidth = scrollWrapperRef.current?.clientWidth ?? 0;
        const cw = cardWidthRef.current;
        const pk = peekRef.current;
        const extraLeft = pk === PEEK_MOBILE ? MOBILE_OVERSCROLL_LEFT : 0;
        const maxScroll = Math.max(0, containerWidth - wrapperWidth + cw + pk + extraLeft);
        setScrollLeft(Math.max(0, Math.min(maxScroll, startScrollLeft - dx)));
      }
    };

    wrapper.addEventListener('touchstart', onTouchStart, { passive: true, capture: true });
    wrapper.addEventListener('touchmove', onTouchMove, { passive: false, capture: true });
    return () => {
      wrapper.removeEventListener('touchstart', onTouchStart, { capture: true });
      wrapper.removeEventListener('touchmove', onTouchMove, { capture: true });
    };
  }, []);

  return (
    <div
      className="w-full relative"
      style={{ overflow: 'visible' }}
    >
      <div
        ref={scrollWrapperRef}
        style={{
          width: '100%',
          overflow: 'visible',
          position: 'relative',
          paddingTop: 60,
          paddingBottom: 60,
          paddingLeft: peek,
          marginLeft: -peek,
          paddingRight: peek,
          marginRight: -peek,
          touchAction: 'pan-y',
        }}
      >
        <div
          ref={scrollContainerRef}
          className="flex relative"
          style={{
            width: `${carouselImages.length * (cardWidth + CARD_GAP)}px`,
            minWidth: '100%',
            transform: `translateX(${peek - scrollLeft}px)`,
            transition: 'transform 0.1s ease-out',
            touchAction: 'pan-y',
          }}
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
                  marginRight: `${CARD_GAP}px`,
                  position: 'relative',
                  zIndex: isHovered ? 50 : isInFocus ? 10 : 1,
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                animate={{
                  scale: isHovered ? 1.15 : scrollStyles.scale,
                  y: isHovered ? -20 : isInFocus && isMobile ? -15 : 0,
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
                      : isInFocus && isMobile
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
  );
}
