import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useEffect, useState } from 'react';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

/**
 * Checks if the user has requested reduced motion at the system level.
 */
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * React hook to observe system reduced motion preference.
 */
export function usePrefersReducedMotion(): boolean {
  const [reducedMotion, setReducedMotion] = useState<boolean>(() => prefersReducedMotion());

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (event: MediaQueryListEvent) => {
      setReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return reducedMotion;
}

/**
 * Helper to build animations that cleanly adapt to reduced motion preferences.
 */
export function createMotionTimeline(
  scope?: Element | React.RefObject<Element | null> | string,
  callbacks?: {
    animate?: (context: gsap.Context) => void;
    reduced?: (context: gsap.Context) => void;
  },
) {
  const targetScope =
    scope && typeof scope === 'object' && 'current' in scope
      ? (scope.current ?? undefined)
      : scope;
  const mm = gsap.matchMedia(targetScope as Element | string | undefined);

  if (callbacks?.animate) {
    mm.add('(prefers-reduced-motion: no-preference)', callbacks.animate);
  }
  if (callbacks?.reduced) {
    mm.add('(prefers-reduced-motion: reduce)', callbacks.reduced);
  }

  return mm;
}

export interface HeadingRevealOptions {
  y?: number;
  duration?: number;
  stagger?: number;
  start?: string;
}

/**
 * Reusable GSAP ScrollTrigger reveal for section headings.
 */
export function createHeadingReveal(
  heading: HTMLElement,
  options?: HeadingRevealOptions
): gsap.core.Timeline | null {
  if (prefersReducedMotion()) return null;

  const yOffset = options?.y ?? 36;
  const duration = options?.duration ?? 0.85;
  const stagger = options?.stagger ?? 0.12;
  const start = options?.start ?? 'top 88%';

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: heading,
      start,
      once: true,
    },
  });

  const separateTextElements = heading.querySelectorAll<HTMLElement>('em, span');

  if (separateTextElements.length > 0) {
    tl.from(heading, {
      opacity: 0,
      y: yOffset,
      duration,
      ease: 'power3.out',
      clearProps: 'transform,opacity',
    }).from(
      separateTextElements,
      {
        opacity: 0,
        y: Math.round(yOffset * 0.35),
        duration: duration * 0.8,
        stagger,
        ease: 'power2.out',
        clearProps: 'transform,opacity',
      },
      `-=${duration * 0.6}`
    );
  } else {
    tl.from(heading, {
      opacity: 0,
      y: yOffset,
      duration,
      ease: 'power3.out',
      clearProps: 'transform,opacity',
    });
  }

  return tl;
}

export interface StatsRevealOptions {
  duration?: number;
  stagger?: number;
  start?: string;
}

/**
 * GSAP ScrollTrigger reveal and numeric tweening for the Stats section.
 * Animates numbers from 0 to targetValue using innerText tweening,
 * staggered by 0.15s each, with supporting text reveals.
 */
export function createStatsReveal(
  container: HTMLElement,
  options?: StatsRevealOptions
): gsap.core.Timeline | null {
  if (prefersReducedMotion()) return null;

  const duration = options?.duration ?? 1.5;
  const stagger = options?.stagger ?? 0.15;
  const start = options?.start ?? 'top 85%';

  const statBlocks = container.querySelectorAll<HTMLElement>('[data-proof-item]');
  if (statBlocks.length === 0) return null;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: container,
      start,
      once: true,
    },
  });

  // Stagger blocks entrance
  tl.from(statBlocks, {
    opacity: 0,
    y: 35,
    duration: 0.8,
    stagger,
    ease: 'power3.out',
    clearProps: 'opacity,transform',
  });

  // Animate each number with innerText tweening from 0 to target
  const numElements = container.querySelectorAll<HTMLElement>('[data-proof-number]');
  numElements.forEach((el, index) => {
    const targetValue = parseInt(el.getAttribute('data-target') || '0', 10);
    if (!isNaN(targetValue) && targetValue > 0) {
      tl.fromTo(
        el,
        { innerText: 0 },
        {
          innerText: targetValue,
          duration,
          ease: 'power1.out',
          snap: { innerText: 1 },
        },
        `<${index === 0 ? 0 : stagger}`
      );
    }
  });

  return tl;
}

export interface ActivitiesRevealOptions {
  y?: number;
  duration?: number;
  stagger?: number;
  start?: string;
}

/**
 * GSAP ScrollTrigger reveal and interactive hover feedback for practice cards.
 * Staggers cards in, and on hover lifts card by -6px, adds shadow, and slides arrow 4px.
 */
export function createActivitiesReveal(
  container: HTMLElement | string,
  options?: ActivitiesRevealOptions
): { timeline: gsap.core.Timeline | null; cleanup: () => void } {
  if (prefersReducedMotion()) return { timeline: null, cleanup: () => {} };

  const containerEl = typeof container === 'string'
    ? document.querySelector<HTMLElement>(container)
    : container;

  if (!containerEl) return { timeline: null, cleanup: () => {} };

  const yOffset = options?.y ?? 30;
  const duration = options?.duration ?? 0.8;
  const stagger = options?.stagger ?? 0.12;
  const start = options?.start ?? 'top 80%';

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: containerEl,
      start,
      once: true,
    },
  });

  const eyebrow = containerEl.querySelector<HTMLElement>('.eyebrow');
  const heading = containerEl.querySelector<HTMLElement>('h2');
  const leadCopy = containerEl.querySelector<HTMLElement>('.section-wrap > div > div:first-child p:last-of-type');
  const ctaBtn = containerEl.querySelector<HTMLElement>('button[data-testid="button-activities-join"]');
  const waveformBox = containerEl.querySelector<HTMLElement>('[data-activities-waveform]');
  const sparklesBar = containerEl.querySelector<HTMLElement>('.section-wrap > div:last-child');
  const practiceRows = containerEl.querySelectorAll<HTMLElement>('.practice-item, .activity-card');
  const previewPanel = containerEl.querySelector<HTMLElement>('.preview-stage');

  if (eyebrow) {
    tl.from(eyebrow, {
      opacity: 0,
      y: 18,
      duration: 0.7,
      ease: 'power2.out',
      clearProps: 'opacity,transform',
    });
  }

  if (heading) {
    tl.from(
      heading,
      {
        opacity: 0,
        y: yOffset,
        duration,
        ease: 'power3.out',
        clearProps: 'opacity,transform',
      },
      eyebrow ? '-=0.5' : 0
    );
  }

  if (leadCopy) {
    tl.from(
      leadCopy,
      {
        opacity: 0,
        y: 20,
        duration: 0.75,
        ease: 'power2.out',
        clearProps: 'opacity,transform',
      },
      '-=0.55'
    );
  }

  if (ctaBtn) {
    tl.from(
      ctaBtn,
      {
        opacity: 0,
        y: 16,
        duration: 0.65,
        ease: 'power2.out',
        clearProps: 'opacity,transform',
      },
      '-=0.45'
    );
  }

  if (waveformBox) {
    tl.from(
      waveformBox,
      {
        opacity: 0,
        y: 20,
        scale: 0.98,
        duration: 0.75,
        ease: 'power2.out',
        clearProps: 'opacity,transform',
      },
      '-=0.4'
    );
  }

  if (practiceRows.length > 0) {
    tl.from(
      practiceRows,
      {
        opacity: 0,
        y: yOffset,
        duration,
        stagger,
        ease: 'power3.out',
        clearProps: 'opacity',
      },
      '-=0.5'
    );
  }

  if (previewPanel) {
    tl.from(
      previewPanel,
      {
        opacity: 0,
        scale: 0.97,
        y: 25,
        duration: 0.85,
        ease: 'power3.out',
        clearProps: 'opacity,transform',
      },
      '-=0.6'
    );
  }

  if (sparklesBar) {
    tl.from(
      sparklesBar,
      {
        opacity: 0,
        y: 16,
        duration: 0.65,
        ease: 'power2.out',
        clearProps: 'opacity,transform',
      },
      '-=0.35'
    );
  }

  // Hover micro-interactions: slide arrow icon 4px, lift slightly
  const cleanups: (() => void)[] = [];
  const isTouch = typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches;

  if (!isTouch) {
    practiceRows.forEach((row) => {
      const arrowIcon = row.querySelector<HTMLElement>('.practice-arrow, .activity-card-arrow');

      const onEnter = () => {
        if (arrowIcon) {
          gsap.to(arrowIcon, {
            x: 4,
            duration: 0.25,
            ease: 'power2.out',
            overwrite: 'auto',
          });
        }
      };

      const onLeave = () => {
        if (arrowIcon) {
          gsap.to(arrowIcon, {
            x: 0,
            duration: 0.25,
            ease: 'power2.out',
            overwrite: 'auto',
            onComplete: () => {
              gsap.set(arrowIcon, { clearProps: 'transform' });
            },
          });
        }
      };

      row.addEventListener('mouseenter', onEnter);
      row.addEventListener('mouseleave', onLeave);

      cleanups.push(() => {
        row.removeEventListener('mouseenter', onEnter);
        row.removeEventListener('mouseleave', onLeave);
      });
    });
  }

  return {
    timeline: tl,
    cleanup: () => {
      cleanups.forEach((fn) => fn());
    },
  };
}

/**
 * Crossfade large preview panel content when active practice format changes.
 */
export function animatePracticePanelTransition(
  container: HTMLElement,
  onSwap?: () => void
): gsap.core.Timeline | null {
  if (prefersReducedMotion()) {
    onSwap?.();
    return null;
  }
  const content = container.querySelector<HTMLElement>('[data-preview-content]') || container;
  const tl = gsap.timeline();
  tl.to(content, {
    opacity: 0,
    y: -6,
    duration: 0.22,
    ease: 'power2.in',
    onComplete: () => {
      onSwap?.();
    },
  }).to(content, {
    opacity: 1,
    y: 0,
    duration: 0.26,
    ease: 'power2.out',
    clearProps: 'transform,opacity',
  });
  return tl;
}

export interface ResourcesRevealOptions {
  y?: number;
  duration?: number;
  stagger?: number;
  start?: string;
  imageScale?: number;
}

/**
 * GSAP ScrollTrigger reveal for the Toolkit Resources section.
 */
export function createResourcesReveal(
  container: HTMLElement | string,
  options?: ResourcesRevealOptions
): { timeline: gsap.core.Timeline | null; cleanup: () => void } {
  if (prefersReducedMotion()) return { timeline: null, cleanup: () => {} };

  const containerEl = typeof container === 'string'
    ? document.querySelector<HTMLElement>(container)
    : container;

  if (!containerEl) return { timeline: null, cleanup: () => {} };

  const yOffset = options?.y ?? 36;
  const duration = options?.duration ?? 0.9;
  const stagger = options?.stagger ?? 0.14;
  const start = options?.start ?? 'top 82%';

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: containerEl,
      start,
      once: true,
    },
  });

  const eyebrow = containerEl.querySelector<HTMLElement>('.eyebrow');
  const heading = containerEl.querySelector<HTMLElement>('h2');
  const leadCopy = containerEl.querySelector<HTMLElement>('.section-wrap > div:first-child p:last-of-type');
  const cards = containerEl.querySelectorAll<HTMLElement>('[data-toolkit-card], article');

  if (eyebrow) {
    tl.from(eyebrow, {
      opacity: 0,
      y: 18,
      duration: 0.7,
      ease: 'power2.out',
      clearProps: 'opacity,transform',
    });
  }

  if (heading) {
    tl.from(
      heading,
      {
        opacity: 0,
        y: yOffset,
        duration,
        ease: 'power3.out',
        clearProps: 'opacity,transform',
      },
      eyebrow ? '-=0.5' : 0
    );
  }

  if (leadCopy) {
    tl.from(
      leadCopy,
      {
        opacity: 0,
        y: 20,
        duration: 0.75,
        ease: 'power2.out',
        clearProps: 'opacity,transform',
      },
      '-=0.55'
    );
  }

  if (cards.length > 0) {
    tl.from(
      cards,
      {
        opacity: 0,
        y: yOffset,
        duration,
        stagger,
        ease: 'power3.out',
        clearProps: 'opacity,transform',
      },
      '-=0.5'
    );

    const numbers = containerEl.querySelectorAll<HTMLElement>('[data-toolkit-card] span.font-mono');
    const badges = containerEl.querySelectorAll<HTMLElement>('[data-toolkit-card] span.inline-block');
    const arrows = containerEl.querySelectorAll<HTMLElement>('[data-toolkit-card] span.grid');

    if (numbers.length > 0) {
      tl.from(numbers, { scale: 0.9, opacity: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out', clearProps: 'transform,opacity' }, '<0.2');
    }
    if (badges.length > 0) {
      tl.from(badges, { scale: 0.92, opacity: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out', clearProps: 'transform,opacity' }, '<0.1');
    }
    if (arrows.length > 0) {
      tl.from(arrows, { scale: 0.88, opacity: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out', clearProps: 'transform,opacity' }, '<0.1');
    }
  }

  // Hover interaction
  const cleanups: (() => void)[] = [];
  const isTouch = typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches;

  if (!isTouch) {
    cards.forEach((card) => {
      const onEnter = () => {
        gsap.to(card, {
          y: -5,
          scale: 1.015,
          duration: 0.35,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      };

      const onLeave = () => {
        gsap.to(card, {
          y: 0,
          scale: 1,
          duration: 0.35,
          ease: 'power2.out',
          overwrite: 'auto',
          onComplete: () => {
            gsap.set(card, { clearProps: 'transform' });
          },
        });
      };

      card.addEventListener('mouseenter', onEnter);
      card.addEventListener('mouseleave', onLeave);

      cleanups.push(() => {
        card.removeEventListener('mouseenter', onEnter);
        card.removeEventListener('mouseleave', onLeave);
      });
    });
  }

  return {
    timeline: tl,
    cleanup: () => {
      cleanups.forEach((fn) => fn());
    },
  };
}

export interface MentorshipRevealOptions {
  y?: number;
  duration?: number;
  stagger?: number;
  start?: string;
}

/**
 * GSAP ScrollTrigger reveal for the Mentorship section.
 * Animates heading, waveform box, 4 cards staggered (stagger: 0.12s),
 * checkmarks with SVG stroke draw-in, and card hover lift.
 */
export function createMentorshipReveal(
  container: HTMLElement | string,
  options?: MentorshipRevealOptions
): { timeline: gsap.core.Timeline | null; cleanup: () => void } {
  if (prefersReducedMotion()) return { timeline: null, cleanup: () => {} };

  const containerEl = typeof container === 'string'
    ? document.querySelector<HTMLElement>(container)
    : container;

  if (!containerEl) return { timeline: null, cleanup: () => {} };

  const yOffset = options?.y ?? 30;
  const duration = options?.duration ?? 0.8;
  const stagger = options?.stagger ?? 0.12;
  const start = options?.start ?? 'top 80%';

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: containerEl,
      start,
      once: true,
    },
  });

  const eyebrow = containerEl.querySelector<HTMLElement>('.eyebrow');
  const heading = containerEl.querySelector<HTMLElement>('h2');
  const leadCopy = containerEl.querySelector<HTMLElement>('.section-wrap > div:first-child p:last-of-type');
  const waveformBox = containerEl.querySelector<HTMLElement>('[data-mentorship-waveform]');

  if (eyebrow) {
    tl.from(eyebrow, {
      opacity: 0,
      y: 18,
      duration: 0.7,
      ease: 'power2.out',
      clearProps: 'opacity,transform',
    });
  }

  if (heading) {
    tl.from(
      heading,
      {
        opacity: 0,
        y: yOffset,
        duration,
        ease: 'power3.out',
        clearProps: 'opacity,transform',
      },
      eyebrow ? '-=0.5' : 0
    );
  }

  if (leadCopy) {
    tl.from(
      leadCopy,
      {
        opacity: 0,
        y: 20,
        duration: 0.75,
        ease: 'power2.out',
        clearProps: 'opacity,transform',
      },
      '-=0.5'
    );
  }

  if (waveformBox) {
    tl.from(
      waveformBox,
      {
        opacity: 0,
        y: 20,
        scale: 0.98,
        duration: 0.75,
        ease: 'power2.out',
        clearProps: 'opacity,transform',
      },
      '-=0.45'
    );
  }

  const cards = containerEl.querySelectorAll<HTMLElement>('article');
  if (cards.length > 0) {
    tl.from(
      cards,
      {
        opacity: 0,
        y: yOffset,
        duration,
        stagger,
        ease: 'power3.out',
        clearProps: 'opacity,transform',
      },
      '-=0.45'
    );

    // SVG checkmark stroke draw-in effect
    const checkIcons = containerEl.querySelectorAll<SVGElement>('article svg');
    if (checkIcons.length > 0) {
      checkIcons.forEach((svg) => {
        const path = svg.querySelector('polyline, path') || svg;
        gsap.set(path, { strokeDasharray: 24, strokeDashoffset: 24 });
      });

      tl.to(
        containerEl.querySelectorAll('article svg polyline, article svg path'),
        {
          strokeDashoffset: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power2.out',
        },
        '-=0.4'
      );
    }
  }

  const bottomBar = containerEl.querySelector<HTMLElement>('.section-wrap > div:last-child');
  if (bottomBar) {
    tl.from(
      bottomBar,
      {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: 'power2.out',
        clearProps: 'opacity,transform',
      },
      '-=0.4'
    );
  }

  // Hover lift
  const cleanups: (() => void)[] = [];
  const isTouch = typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches;

  if (!isTouch) {
    cards.forEach((card) => {
      const onEnter = () => {
        gsap.to(card, {
          y: -4,
          duration: 0.3,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      };

      const onLeave = () => {
        gsap.to(card, {
          y: 0,
          duration: 0.3,
          ease: 'power2.out',
          overwrite: 'auto',
          onComplete: () => {
            gsap.set(card, { clearProps: 'transform' });
          },
        });
      };

      card.addEventListener('mouseenter', onEnter);
      card.addEventListener('mouseleave', onLeave);

      cleanups.push(() => {
        card.removeEventListener('mouseenter', onEnter);
        card.removeEventListener('mouseleave', onLeave);
      });
    });
  }

  return {
    timeline: tl,
    cleanup: () => {
      cleanups.forEach((fn) => fn());
    },
  };
}

/**
 * GSAP ScrollTrigger reveal for the Stories section.
 */
export function createStoriesReveal(
  container: HTMLElement | string
): gsap.core.Timeline | null {
  if (prefersReducedMotion()) return null;

  const containerEl = typeof container === 'string'
    ? document.querySelector<HTMLElement>(container)
    : container;

  if (!containerEl) return null;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: containerEl,
      start: 'top 80%',
      once: true,
    },
  });

  const eyebrow = containerEl.querySelector<HTMLElement>('.eyebrow');
  const heading = containerEl.querySelector<HTMLElement>('h2');
  const leadCopy = containerEl.querySelector<HTMLElement>('.section-wrap > div:first-child p:last-of-type');
  const portrait = containerEl.querySelector<HTMLElement>('.portrait');
  const quoteCard = containerEl.querySelector<HTMLElement>('.section-wrap > div:nth-child(2) > div:last-child');
  const dots = containerEl.querySelector<HTMLElement>('.section-wrap > div:last-child');

  if (eyebrow) {
    tl.from(eyebrow, {
      opacity: 0,
      y: 18,
      duration: 0.7,
      ease: 'power2.out',
      clearProps: 'opacity,transform',
    });
  }

  if (heading) {
    tl.from(
      heading,
      {
        opacity: 0,
        y: 36,
        duration: 0.85,
        ease: 'power3.out',
        clearProps: 'opacity,transform',
      },
      eyebrow ? '-=0.5' : 0
    );
  }

  if (leadCopy) {
    tl.from(
      leadCopy,
      {
        opacity: 0,
        y: 20,
        duration: 0.75,
        ease: 'power2.out',
        clearProps: 'opacity,transform',
      },
      '-=0.55'
    );
  }

  if (portrait) {
    tl.from(
      portrait,
      {
        opacity: 0,
        y: 36,
        scale: 0.98,
        duration: 0.85,
        ease: 'power3.out',
        clearProps: 'opacity,transform',
      },
      '-=0.5'
    );
  }

  if (quoteCard) {
    tl.from(
      quoteCard,
      {
        opacity: 0,
        y: 36,
        duration: 0.85,
        ease: 'power3.out',
        clearProps: 'opacity,transform',
      },
      '-=0.65'
    );
  }

  if (dots) {
    tl.from(
      dots,
      {
        opacity: 0,
        y: 12,
        duration: 0.55,
        ease: 'power2.out',
        clearProps: 'opacity,transform',
      },
      '-=0.35'
    );
  }

  return tl;
}

/**
 * GSAP crossfade timeline for switching carousel slides smoothly.
 * Fade out current slide, fade in next slide with slight overlap.
 */
export function animateStoryTransition(
  container: HTMLElement | string,
  onMidpoint?: () => void
): gsap.core.Timeline | null {
  if (prefersReducedMotion()) {
    if (onMidpoint) onMidpoint();
    return null;
  }

  const containerEl = typeof container === 'string'
    ? document.querySelector<HTMLElement>(container)
    : container;

  if (!containerEl) return null;

  const targets = containerEl.querySelectorAll<HTMLElement>('[data-story-content]');
  if (targets.length === 0) return null;

  const tl = gsap.timeline();

  tl.to(targets, {
    opacity: 0,
    y: -6,
    duration: 0.25,
    ease: 'power2.in',
    onComplete: () => {
      if (onMidpoint) onMidpoint();
    },
  }).fromTo(
    targets,
    { opacity: 0, y: 8 },
    {
      opacity: 1,
      y: 0,
      duration: 0.35,
      stagger: 0.03,
      ease: 'power2.out',
      clearProps: 'transform,opacity',
    }
  );

  return tl;
}

/**
 * GSAP ScrollTrigger reveal for the Founders section.
 * Hover scales the photo slightly (1.05) with overflow: hidden on container,
 * and lifts the quote line with a subtle slide.
 */
export function createFoundersReveal(
  container: HTMLElement | string
): { timeline: gsap.core.Timeline | null; cleanup: () => void } {
  if (prefersReducedMotion()) return { timeline: null, cleanup: () => {} };

  const containerEl = typeof container === 'string'
    ? document.querySelector<HTMLElement>(container)
    : container;

  if (!containerEl) return { timeline: null, cleanup: () => {} };

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: containerEl,
      start: 'top 80%',
      once: true,
    },
  });

  const eyebrow = containerEl.querySelector<HTMLElement>('.eyebrow');
  const heading = containerEl.querySelector<HTMLElement>('h2');
  const leadCopy = containerEl.querySelector<HTMLElement>('.section-wrap > div > div:first-child p:last-of-type');
  const cards = containerEl.querySelectorAll<HTMLElement>('article');

  if (eyebrow) {
    tl.from(eyebrow, {
      opacity: 0,
      y: 18,
      duration: 0.7,
      ease: 'power2.out',
      clearProps: 'opacity,transform',
    });
  }

  if (heading) {
    tl.from(
      heading,
      {
        opacity: 0,
        y: 32,
        duration: 0.85,
        ease: 'power3.out',
        clearProps: 'opacity,transform',
      },
      eyebrow ? '-=0.5' : 0
    );
  }

  if (leadCopy) {
    tl.from(
      leadCopy,
      {
        opacity: 0,
        y: 20,
        duration: 0.75,
        ease: 'power2.out',
        clearProps: 'opacity,transform',
      },
      '-=0.55'
    );
  }

  if (cards.length > 0) {
    tl.from(
      cards,
      {
        opacity: 0,
        y: 36,
        duration: 0.9,
        stagger: 0.16,
        ease: 'power3.out',
        clearProps: 'opacity,transform',
      },
      '-=0.5'
    );
  }

  // Hover micro-interaction: scale photo slightly (1.05) and lift quote line
  const cleanups: (() => void)[] = [];
  const isTouch = typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches;

  if (!isTouch) {
    cards.forEach((card) => {
      const portrait = card.querySelector<HTMLElement>('.founder-portrait');
      const quoteLine = card.querySelector<HTMLElement>('.founder-quote-line');

      const onEnter = () => {
        if (portrait) {
          gsap.to(portrait, {
            scale: 1.05,
            duration: 0.4,
            ease: 'power2.out',
            overwrite: 'auto',
          });
        }
        if (quoteLine) {
          gsap.to(quoteLine, {
            y: -2,
            duration: 0.3,
            ease: 'power2.out',
            overwrite: 'auto',
          });
        }
      };

      const onLeave = () => {
        if (portrait) {
          gsap.to(portrait, {
            scale: 1,
            duration: 0.4,
            ease: 'power2.out',
            overwrite: 'auto',
            onComplete: () => {
              gsap.set(portrait, { clearProps: 'transform' });
            },
          });
        }
        if (quoteLine) {
          gsap.to(quoteLine, {
            y: 0,
            duration: 0.3,
            ease: 'power2.out',
            overwrite: 'auto',
            onComplete: () => {
              gsap.set(quoteLine, { clearProps: 'transform' });
            },
          });
        }
      };

      card.addEventListener('mouseenter', onEnter);
      card.addEventListener('mouseleave', onLeave);

      cleanups.push(() => {
        card.removeEventListener('mouseenter', onEnter);
        card.removeEventListener('mouseleave', onLeave);
      });
    });
  }

  return {
    timeline: tl,
    cleanup: () => {
      cleanups.forEach((fn) => fn());
    },
  };
}

/**
 * GSAP ScrollTrigger reveal for the Community Voices section.
 */
export function createVoicesReveal(
  container: HTMLElement | string
): { timeline: gsap.core.Timeline | null; cleanup: () => void } {
  if (prefersReducedMotion()) return { timeline: null, cleanup: () => {} };

  const containerEl = typeof container === 'string'
    ? document.querySelector<HTMLElement>(container)
    : container;

  if (!containerEl) return { timeline: null, cleanup: () => {} };

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: containerEl,
      start: 'top 80%',
      once: true,
    },
  });

  const eyebrow = containerEl.querySelector<HTMLElement>('.eyebrow');
  const heading = containerEl.querySelector<HTMLElement>('h2');
  const leadCopy = containerEl.querySelector<HTMLElement>('.section-wrap > div:first-child > div:first-child p:last-of-type');
  const memberCards = containerEl.querySelectorAll<HTMLElement>('.section-wrap > div:first-child > div:last-child > div');
  const quotes = containerEl.querySelectorAll<HTMLElement>('blockquote');

  if (eyebrow) {
    tl.from(eyebrow, {
      opacity: 0,
      y: 18,
      duration: 0.7,
      ease: 'power2.out',
      clearProps: 'opacity,transform',
    });
  }

  if (heading) {
    tl.from(
      heading,
      {
        opacity: 0,
        y: 32,
        duration: 0.85,
        ease: 'power3.out',
        clearProps: 'opacity,transform',
      },
      eyebrow ? '-=0.5' : 0
    );
  }

  if (leadCopy) {
    tl.from(
      leadCopy,
      {
        opacity: 0,
        y: 20,
        duration: 0.75,
        ease: 'power2.out',
        clearProps: 'opacity,transform',
      },
      '-=0.55'
    );
  }

  if (memberCards.length > 0) {
    tl.from(
      memberCards,
      {
        opacity: 0,
        y: 32,
        duration: 0.85,
        stagger: 0.12,
        ease: 'power3.out',
        clearProps: 'opacity,transform',
      },
      '-=0.5'
    );
  }

  if (quotes.length > 0) {
    tl.from(
      quotes,
      {
        opacity: 0,
        y: 24,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power3.out',
        clearProps: 'opacity,transform',
      },
      '-=0.4'
    );
  }

  return {
    timeline: tl,
    cleanup: () => {},
  };
}

/**
 * Scroll-scrubbed GSAP animation for Roadmap Steps (01 Join → 04 Starts).
 * Progressively fills the horizontal connector line with scroll scrub,
 * pulsing each numbered circle (01-04) briefly as the fill line reaches it.
 */
export function createTimelineReveal(
  container: HTMLElement | string
): { scrubTimeline: gsap.core.Timeline | null; cleanup: () => void } {
  if (prefersReducedMotion()) {
    return { scrubTimeline: null, cleanup: () => {} };
  }

  const containerEl = typeof container === 'string'
    ? document.querySelector<HTMLElement>(container)
    : container;

  if (!containerEl) return { scrubTimeline: null, cleanup: () => {} };

  const line = containerEl.querySelector<HTMLElement>('.timeline-line');
  const stepNumbers = containerEl.querySelectorAll<HTMLElement>('.step-number');
  const steps = containerEl.querySelectorAll<HTMLElement>('article');

  // 1. Entrance reveal for headings and step cards
  const entranceTl = gsap.timeline({
    scrollTrigger: {
      trigger: containerEl,
      start: 'top 85%',
      once: true,
    },
  });

  const eyebrow = containerEl.querySelector<HTMLElement>('.eyebrow');
  const heading = containerEl.querySelector<HTMLElement>('h2');
  const leadCopy = containerEl.querySelector<HTMLElement>('.section-wrap > div:first-child p:last-of-type');

  if (eyebrow) entranceTl.from(eyebrow, { opacity: 0, y: 18, duration: 0.7, ease: 'power2.out', clearProps: 'opacity,transform' });
  if (heading) entranceTl.from(heading, { opacity: 0, y: 32, duration: 0.85, ease: 'power3.out', clearProps: 'opacity,transform' }, '-=0.5');
  if (leadCopy) entranceTl.from(leadCopy, { opacity: 0, y: 20, duration: 0.75, ease: 'power2.out', clearProps: 'opacity,transform' }, '-=0.5');

  if (steps.length > 0) {
    entranceTl.from(steps, { opacity: 0, y: 30, duration: 0.8, stagger: 0.12, ease: 'power3.out', clearProps: 'opacity,transform' }, '-=0.4');
  }

  // 2. Scroll-scrubbed connector line fill & circle pulse
  let scrubTl: gsap.core.Timeline | null = null;
  if (line) {
    scrubTl = gsap.timeline({
      scrollTrigger: {
        trigger: containerEl,
        start: 'top 70%',
        end: 'bottom 60%',
        scrub: 1,
      },
    });

    // Fills horizontal line left to right
    scrubTl.fromTo(
      line,
      { scaleX: 0, transformOrigin: 'left center' },
      { scaleX: 1, ease: 'none', duration: 1 }
    );

    // Pulse step circles as line arrives at their positions (approx. 0.05, 0.35, 0.65, 0.95)
    if (stepNumbers.length >= 4) {
      scrubTl.to(stepNumbers[0], { scale: 1.18, duration: 0.08, yoyo: true, repeat: 1, ease: 'power2.out' }, 0.05);
      scrubTl.to(stepNumbers[1], { scale: 1.18, duration: 0.08, yoyo: true, repeat: 1, ease: 'power2.out' }, 0.35);
      scrubTl.to(stepNumbers[2], { scale: 1.18, duration: 0.08, yoyo: true, repeat: 1, ease: 'power2.out' }, 0.65);
      scrubTl.to(stepNumbers[3], { scale: 1.18, duration: 0.08, yoyo: true, repeat: 1, ease: 'power2.out' }, 0.92);
    }
  }

  // Hover micro-feedback
  const cleanups: (() => void)[] = [];
  const isTouch = typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches;

  if (!isTouch) {
    steps.forEach((step) => {
      const onEnter = () => {
        gsap.to(step, { y: -4, duration: 0.3, ease: 'power2.out', overwrite: 'auto' });
      };
      const onLeave = () => {
        gsap.to(step, {
          y: 0,
          duration: 0.3,
          ease: 'power2.out',
          overwrite: 'auto',
          onComplete: () => {
            gsap.set(step, { clearProps: 'transform' });
          },
        });
      };

      step.addEventListener('mouseenter', onEnter);
      step.addEventListener('mouseleave', onLeave);

      cleanups.push(() => {
        step.removeEventListener('mouseenter', onEnter);
        step.removeEventListener('mouseleave', onLeave);
      });
    });
  }

  return {
    scrubTimeline: scrubTl,
    cleanup: () => {
      entranceTl.kill();
      scrubTl?.kill();
      cleanups.forEach((fn) => fn());
    },
  };
}

/**
 * GSAP ScrollTrigger reveal and parallax for the Journey section.
 */
export function createJourneyReveal(
  container: HTMLElement | string
): { entranceTimeline: gsap.core.Timeline | null; parallaxTimeline: gsap.core.Timeline | null; cleanup: () => void } {
  if (prefersReducedMotion()) {
    return { entranceTimeline: null, parallaxTimeline: null, cleanup: () => {} };
  }

  const containerEl = typeof container === 'string'
    ? document.querySelector<HTMLElement>(container)
    : container;

  if (!containerEl) {
    return { entranceTimeline: null, parallaxTimeline: null, cleanup: () => {} };
  }

  const entranceTl = gsap.timeline({
    scrollTrigger: {
      trigger: containerEl,
      start: 'top 80%',
      once: true,
    },
  });

  const leftCol = containerEl.querySelector<HTMLElement>('.section-wrap > div:first-child');
  const journeyArt = containerEl.querySelector<HTMLElement>('.journey-art');

  if (leftCol) {
    const eyebrow = leftCol.querySelector<HTMLElement>('.eyebrow');
    const heading = leftCol.querySelector<HTMLElement>('h2');
    const leadCopy = leftCol.querySelector<HTMLElement>('p:last-of-type');
    const ctaBtn = leftCol.querySelector<HTMLElement>('button');

    if (eyebrow) entranceTl.from(eyebrow, { opacity: 0, y: 18, duration: 0.7, ease: 'power2.out', clearProps: 'opacity,transform' });
    if (heading) entranceTl.from(heading, { opacity: 0, y: 32, duration: 0.85, ease: 'power3.out', clearProps: 'opacity,transform' }, '-=0.5');
    if (leadCopy) entranceTl.from(leadCopy, { opacity: 0, y: 20, duration: 0.75, ease: 'power2.out', clearProps: 'opacity,transform' }, '-=0.55');
    if (ctaBtn) entranceTl.from(ctaBtn, { opacity: 0, y: 16, duration: 0.65, ease: 'power2.out', clearProps: 'opacity,transform' }, '-=0.45');
  }

  if (journeyArt) {
    entranceTl.from(
      journeyArt,
      {
        opacity: 0,
        y: 32,
        scale: 0.98,
        duration: 0.9,
        ease: 'power3.out',
        clearProps: 'opacity,transform',
      },
      '-=0.65'
    );
  }

  let parallaxTl: gsap.core.Timeline | null = null;
  if (journeyArt) {
    parallaxTl = gsap.timeline({
      scrollTrigger: {
        trigger: containerEl,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.2,
      },
    });

    parallaxTl.to(journeyArt, { yPercent: -4, ease: 'none' });

    const micCircle = journeyArt.querySelector<HTMLElement>('.rounded-full');
    if (micCircle) {
      parallaxTl.to(micCircle, { yPercent: 8, scale: 1.04, ease: 'none' }, 0);
    }
  }

  return {
    entranceTimeline: entranceTl,
    parallaxTimeline: parallaxTl,
    cleanup: () => {
      entranceTl.kill();
      parallaxTl?.kill();
    },
  };
}

/**
 * GSAP ScrollTrigger reveal for the Feedback section.
 */
export function createFeedbackReveal(
  container: HTMLElement | string
): { timeline: gsap.core.Timeline | null; cleanup: () => void } {
  if (prefersReducedMotion()) return { timeline: null, cleanup: () => {} };

  const containerEl = typeof container === 'string'
    ? document.querySelector<HTMLElement>(container)
    : container;

  if (!containerEl) return { timeline: null, cleanup: () => {} };

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: containerEl,
      start: 'top 80%',
      once: true,
    },
  });

  const eyebrow = containerEl.querySelector<HTMLElement>('.eyebrow');
  const heading = containerEl.querySelector<HTMLElement>('h2');
  const leadCopy = containerEl.querySelector<HTMLElement>('.section-wrap > div > div:first-child p:nth-of-type(2)');
  const emptyNote = containerEl.querySelector<HTMLElement>('.section-wrap > div > div:first-child > div:last-child');
  const formCard = containerEl.querySelector<HTMLElement>('.section-wrap > div > div:last-child');

  if (eyebrow) tl.from(eyebrow, { opacity: 0, y: 18, duration: 0.7, ease: 'power2.out', clearProps: 'opacity,transform' });
  if (heading) tl.from(heading, { opacity: 0, y: 32, duration: 0.85, ease: 'power3.out', clearProps: 'opacity,transform' }, '-=0.5');
  if (leadCopy) tl.from(leadCopy, { opacity: 0, y: 20, duration: 0.75, ease: 'power2.out', clearProps: 'opacity,transform' }, '-=0.55');
  if (emptyNote) tl.from(emptyNote, { opacity: 0, y: 16, duration: 0.65, ease: 'power2.out', clearProps: 'opacity,transform' }, '-=0.45');
  if (formCard) tl.from(formCard, { opacity: 0, y: 34, scale: 0.99, duration: 0.85, ease: 'power3.out', clearProps: 'opacity,transform' }, '-=0.55');

  return {
    timeline: tl,
    cleanup: () => {},
  };
}

/**
 * GSAP ScrollTrigger reveal for FAQ / What to Expect section.
 */
export function createFAQReveal(
  container: HTMLElement | string
): { timeline: gsap.core.Timeline | null; cleanup: () => void } {
  if (prefersReducedMotion()) return { timeline: null, cleanup: () => {} };

  const containerEl = typeof container === 'string'
    ? document.querySelector<HTMLElement>(container)
    : container;

  if (!containerEl) return { timeline: null, cleanup: () => {} };

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: containerEl,
      start: 'top 80%',
      once: true,
    },
  });

  const eyebrow = containerEl.querySelector<HTMLElement>('.eyebrow');
  const heading = containerEl.querySelector<HTMLElement>('h2');
  const leadCopy = containerEl.querySelector<HTMLElement>('[data-faq-lead]');
  const rows = containerEl.querySelectorAll<HTMLElement>('.accordion-row');

  if (eyebrow) tl.from(eyebrow, { opacity: 0, y: 18, duration: 0.7, ease: 'power2.out', clearProps: 'opacity,transform' });
  if (heading) tl.from(heading, { opacity: 0, y: 32, duration: 0.85, ease: 'power3.out', clearProps: 'opacity,transform' }, '-=0.5');
  if (leadCopy) tl.from(leadCopy, { opacity: 0, y: 20, duration: 0.75, ease: 'power2.out', clearProps: 'opacity,transform' }, '-=0.55');

  if (rows.length > 0) {
    tl.from(
      rows,
      {
        opacity: 0,
        y: 24,
        duration: 0.7,
        stagger: 0.08,
        ease: 'power2.out',
        clearProps: 'opacity,transform',
      },
      '-=0.45'
    );
  }

  return {
    timeline: tl,
    cleanup: () => {
      tl.kill();
    },
  };
}

/**
 * Toggle an accordion row with GSAP height expansion and 45° icon rotation.
 */
export function toggleAccordionItem(
  rowEl: HTMLElement,
  isOpen: boolean
) {
  const icon = rowEl.querySelector<SVGElement>('.accordion-icon-box svg');
  const body = rowEl.querySelector<HTMLElement>('.accordion-body');
  if (!body) return;

  if (prefersReducedMotion()) {
    if (icon) gsap.set(icon, { rotate: isOpen ? 45 : 0 });
    body.style.height = isOpen ? 'auto' : '0px';
    return;
  }

  if (icon) {
    gsap.to(icon, {
      rotate: isOpen ? 45 : 0,
      duration: 0.3,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  }

  if (isOpen) {
    body.style.height = 'auto';
    const naturalHeight = body.scrollHeight;
    body.style.height = '0px';

    gsap.fromTo(
      body,
      { height: 0 },
      {
        height: naturalHeight,
        duration: 0.38,
        ease: 'power2.out',
        overwrite: 'auto',
        onComplete: () => {
          body.style.height = 'auto';
        },
      }
    );
  } else {
    const currentHeight = body.scrollHeight;
    gsap.fromTo(
      body,
      { height: currentHeight },
      {
        height: 0,
        duration: 0.28,
        ease: 'power2.inOut',
        overwrite: 'auto',
      }
    );
  }
}

/**
 * GSAP ScrollTrigger reveal for the Footer CTA and links.
 * Simple, confident fade/slide-up on scroll into view with zero bounce,
 * plus big two-tone headline treatment and ambient breathing on "voice".
 */
export function createFooterReveal(
  footer: HTMLElement | string
): { timeline: gsap.core.Timeline | null; cleanup: () => void } {
  if (prefersReducedMotion()) return { timeline: null, cleanup: () => {} };

  const footerEl = typeof footer === 'string'
    ? document.querySelector<HTMLElement>(footer)
    : footer;

  if (!footerEl) return { timeline: null, cleanup: () => {} };

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: footerEl,
      start: 'top 88%',
      once: true,
    },
  });

  const hugeHeadline = footerEl.querySelector<HTMLElement>('.footer-huge-display');
  const columns = footerEl.querySelectorAll<HTMLElement>('.grid > div');
  const bottomBar = footerEl.querySelector<HTMLElement>('.flex-col');
  const accentWord = footerEl.querySelector<HTMLElement>('.footer-accent-word');

  if (hugeHeadline) {
    tl.from(hugeHeadline, {
      opacity: 0,
      y: 40,
      duration: 0.85,
      ease: 'power3.out',
      clearProps: 'opacity,transform',
    });
  }

  if (columns.length > 0) {
    tl.from(
      columns,
      {
        opacity: 0,
        y: 22,
        duration: 0.75,
        stagger: 0.1,
        ease: 'power3.out',
        clearProps: 'opacity,transform',
      },
      hugeHeadline ? '-=0.55' : 0
    );
  }

  if (bottomBar) {
    tl.from(bottomBar, { opacity: 0, duration: 0.6, ease: 'power2.out', clearProps: 'opacity' }, '-=0.3');
  }

  // Slow ambient loop on accent word "voice"
  let ambientTween: gsap.core.Tween | null = null;
  if (accentWord) {
    ambientTween = gsap.to(accentWord, {
      scale: 1.05,
      duration: 3.2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });
  }

  return {
    timeline: tl,
    cleanup: () => {
      tl.kill();
      ambientTween?.kill();
    },
  };
}

/**
 * Smooth marquee horizontal motion with pause-on-hover and offscreen pause.
 */
export function createMarqueeAnimation(
  container: HTMLElement | string,
  options?: { duration?: number }
): { tween: gsap.core.Tween | null; cleanup: () => void } {
  if (prefersReducedMotion()) {
    return { tween: null, cleanup: () => {} };
  }

  const containerEl = typeof container === 'string'
    ? document.querySelector<HTMLElement>(container)
    : container;

  if (!containerEl) return { tween: null, cleanup: () => {} };

  const track = containerEl.querySelector<HTMLElement>('.ticker-track, .marquee-track');
  if (!track) return { tween: null, cleanup: () => {} };

  gsap.set(track, { xPercent: 0 });

  const tween = gsap.to(track, {
    xPercent: -50,
    duration: options?.duration ?? 20,
    ease: 'none',
    repeat: -1,
  });

  // Lazy-pause when offscreen
  ScrollTrigger.create({
    trigger: containerEl,
    start: 'top bottom',
    end: 'bottom top',
    onLeave: () => tween.pause(),
    onEnterBack: () => tween.play(),
    onLeaveBack: () => tween.pause(),
    onEnter: () => tween.play(),
  });

  // Pause on hover, resume on leave
  const onEnter = () => tween.pause();
  const onLeave = () => tween.play();

  track.addEventListener('mouseenter', onEnter);
  track.addEventListener('mouseleave', onLeave);

  return {
    tween,
    cleanup: () => {
      track.removeEventListener('mouseenter', onEnter);
      track.removeEventListener('mouseleave', onLeave);
      tween.kill();
    },
  };
}

/**
 * Navigation transition on scroll and desktop hover feedback.
 */
export function createNavScrollTransition(
  header: HTMLElement | string
): { scrollTrigger: ScrollTrigger | null; cleanup: () => void } {
  const headerEl = typeof header === 'string'
    ? document.querySelector<HTMLElement>(header)
    : header;

  if (!headerEl) return { scrollTrigger: null, cleanup: () => {} };

  const innerBar = headerEl.querySelector<HTMLElement>('.mx-auto');
  const cleanups: (() => void)[] = [];

  const st = ScrollTrigger.create({
    start: 'top -30px',
    onUpdate: (self) => {
      if (prefersReducedMotion()) return;

      if (self.isActive) {
        gsap.to(headerEl, {
          backgroundColor: 'rgba(250, 248, 244, 0.96)',
          boxShadow: '0 4px 20px -2px rgba(36, 36, 36, 0.07)',
          borderColor: '#D8CEBF',
          duration: 0.35,
          ease: 'power2.out',
          overwrite: 'auto',
        });
        if (innerBar) {
          gsap.to(innerBar, {
            paddingTop: '0.65rem',
            paddingBottom: '0.65rem',
            duration: 0.35,
            ease: 'power2.out',
            overwrite: 'auto',
          });
        }
      } else {
        gsap.to(headerEl, {
          backgroundColor: 'rgba(250, 248, 244, 0.88)',
          boxShadow: 'none',
          borderColor: '#E0D7CB',
          duration: 0.35,
          ease: 'power2.out',
          overwrite: 'auto',
        });
        if (innerBar) {
          gsap.to(innerBar, {
            paddingTop: '1rem',
            paddingBottom: '1rem',
            duration: 0.35,
            ease: 'power2.out',
            overwrite: 'auto',
          });
        }
      }
    },
  });

  const isTouch = typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches;
  if (!isTouch && !prefersReducedMotion()) {
    const navLinks = headerEl.querySelectorAll<HTMLElement>('[data-testid^="link-nav-"]');
    navLinks.forEach((link) => {
      const onEnter = () => {
        gsap.to(link, { y: -1.5, duration: 0.22, ease: 'power2.out', overwrite: 'auto' });
      };
      const onLeave = () => {
        gsap.to(link, {
          y: 0,
          duration: 0.22,
          ease: 'power2.out',
          overwrite: 'auto',
          onComplete: () => {
            gsap.set(link, { clearProps: 'transform' });
          },
        });
      };

      link.addEventListener('mouseenter', onEnter);
      link.addEventListener('mouseleave', onLeave);

      cleanups.push(() => {
        link.removeEventListener('mouseenter', onEnter);
        link.removeEventListener('mouseleave', onLeave);
      });
    });
  }

  return {
    scrollTrigger: st,
    cleanup: () => {
      cleanups.forEach((fn) => fn());
      st.kill();
    },
  };
}

export {
  gsap,
  ScrollTrigger,
  useGSAP,
};
