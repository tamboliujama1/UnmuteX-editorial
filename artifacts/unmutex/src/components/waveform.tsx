import { useRef } from 'react';
import { gsap, useGSAP, prefersReducedMotion } from '@/lib/gsap';

interface WaveformProps {
  barsCount?: number;
  color?: string;
  height?: number;
  className?: string;
}

export function Waveform({
  barsCount = 20,
  color = '#D65A2A',
  height = 36,
  className = '',
}: WaveformProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion() || !containerRef.current) return;

      const bars = containerRef.current.querySelectorAll<HTMLElement>('.waveform-bar');
      if (bars.length === 0) return;

      // Lazy animate with ScrollTrigger so it pauses offscreen and preserves CPU
      const tl = gsap.timeline({
        repeat: -1,
        yoyo: true,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 95%',
          end: 'bottom 5%',
          toggleActions: 'play pause play pause',
        },
      });

      bars.forEach((bar, i) => {
        // Organic pseudo-random scales to represent live voice frequencies
        const baseMin = 0.22 + (Math.sin(i * 0.7) * 0.12 + 0.12);
        const baseMax = 0.72 + (Math.cos(i * 0.5) * 0.22 + 0.16);

        gsap.to(bar, {
          scaleY: Math.min(Math.max(baseMax, 0.4), 1.0),
          duration: 0.32 + (i % 6) * 0.05,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: (i % 7) * 0.04,
        });
      });
    },
    { scope: containerRef }
  );

  // Default organic heights for static state / reduced motion
  const defaultHeights = [
    0.35, 0.55, 0.8, 0.6, 0.4, 0.7, 0.95, 0.85, 0.65, 0.9, 0.75, 0.5, 0.85, 1.0, 0.7, 0.45,
    0.6, 0.8, 0.5, 0.35, 0.6, 0.75, 0.4, 0.3,
  ];

  return (
    <div
      ref={containerRef}
      className={`flex items-center gap-1 sm:gap-1.5 ${className}`}
      style={{ height: `${height}px` }}
      aria-hidden="true"
    >
      {Array.from({ length: barsCount }).map((_, i) => {
        const initialScale = defaultHeights[i % defaultHeights.length];
        return (
          <span
            key={i}
            className="waveform-bar inline-block w-1 sm:w-1.5 rounded-full origin-bottom"
            style={{
              height: '100%',
              backgroundColor: color,
              transform: `scaleY(${initialScale})`,
              opacity: 0.85,
            }}
          />
        );
      })}
    </div>
  );
}
