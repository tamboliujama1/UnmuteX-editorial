import { type FormEvent, type ReactNode, useEffect, useRef, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { ArrowDown, ArrowRight, Check, ChevronLeft, ChevronRight, Menu, Mic2, Play, Plus, Quote, Sparkles, X } from 'lucide-react';
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';
import {
  gsap,
  useGSAP,
  prefersReducedMotion,
  createStatsReveal,
  createActivitiesReveal,
  animatePracticePanelTransition,
  createResourcesReveal,
  createMentorshipReveal,
  createStoriesReveal,
  animateStoryTransition,
  createFoundersReveal,
  createVoicesReveal,
  createTimelineReveal,
  createJourneyReveal,
  createFeedbackReveal,
  createFAQReveal,
  toggleAccordionItem,
  createFooterReveal,
  createMarqueeAnimation,
  createNavScrollTransition,
} from '@/lib/gsap';
import { Waveform } from '@/components/waveform';

const queryClient = new QueryClient();

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeActivity, setActiveActivity] = useState(0);
  const [openFAQIndex, setOpenFAQIndex] = useState<number | null>(null);
  const [storyIndex, setStoryIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [isCarouselHovered, setIsCarouselHovered] = useState(false);

  const mainRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const proofRef = useRef<HTMLElement>(null);
  const activitiesRef = useRef<HTMLElement>(null);
  const previewPanelRef = useRef<HTMLDivElement>(null);
  const resourcesRef = useRef<HTMLElement>(null);
  const mentorshipRef = useRef<HTMLElement>(null);
  const storiesRef = useRef<HTMLElement>(null);
  const foundersRef = useRef<HTMLElement>(null);
  const voicesRef = useRef<HTMLElement>(null);
  const howItWorksRef = useRef<HTMLElement>(null);
  const communityMarqueeRef = useRef<HTMLDivElement>(null);
  const journeyRef = useRef<HTMLElement>(null);
  const faqRef = useRef<HTMLElement>(null);
  const feedbackRef = useRef<HTMLElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const isFirstStoryRender = useRef(true);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  const stories = ['Neha', 'Lavina', 'Saurav', 'Sanskriti', 'Gaurangi', 'Pushkar', 'Shanvi', 'Sonia', 'Dolly'];

  // Stories Carousel Autoplay every 5s with pause on hover
  useEffect(() => {
    if (isCarouselHovered) return;
    const timer = setInterval(() => {
      setStoryIndex((prev) => (prev + 1) % stories.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isCarouselHovered, stories.length]);

  // Lightweight native Intersection Observer for scroll-triggered section reveals (~400-600ms ease-out)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('.io-reveal').forEach((el) => el.classList.add('is-revealed'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    document.querySelectorAll('.io-reveal').forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      // 1. Initial Page-Load Hero Entrance Timeline
      const heroTl = gsap.timeline({
        defaults: { ease: 'power3.out' },
      });

      heroTl
        .from('[data-hero-eyebrow]', {
          opacity: 0,
          y: 18,
          duration: 0.8,
          ease: 'power2.out',
        })
        .from(
          '[data-hero-line]',
          {
            scaleX: 0,
            transformOrigin: 'left center',
            duration: 0.75,
            ease: 'power2.inOut',
          },
          '<0.15'
        )
        // Staggered words for "Speak Without Fear."
        .from(
          '[data-hero-word]',
          {
            y: 40,
            opacity: 0,
            duration: 0.85,
            stagger: 0.1,
            ease: 'power3.out',
            clearProps: 'transform,opacity',
          },
          '-=0.45'
        )
        // Lead paragraph
        .from(
          '[data-hero-lead]',
          {
            opacity: 0,
            y: 20,
            duration: 0.8,
            ease: 'power2.out',
            clearProps: 'transform,opacity',
          },
          '-=0.55'
        )
        // Action buttons staggered
        .from(
          '[data-hero-action]',
          {
            opacity: 0,
            y: 16,
            duration: 0.75,
            stagger: 0.12,
            ease: 'power2.out',
            clearProps: 'transform,opacity',
          },
          '-=0.45'
        )
        // Social proof avatars
        .from(
          '[data-hero-avatars]',
          {
            opacity: 0,
            y: 12,
            duration: 0.7,
            ease: 'power2.out',
            clearProps: 'transform,opacity',
          },
          '-=0.4'
        )
        .from(
          '[data-hero-avatar-item]',
          {
            scale: 0.85,
            opacity: 0,
            duration: 0.55,
            stagger: 0.08,
            ease: 'power2.out',
            clearProps: 'transform,opacity',
          },
          '-=0.4'
        )
        // Hero graphic disc & orbits entrance
        .from(
          '.hero-disc',
          {
            scale: 0.88,
            opacity: 0,
            duration: 1.2,
            ease: 'power3.out',
            clearProps: 'opacity',
          },
          0.3
        )
        .from(
          ['.hero-orbit-a', '.hero-orbit-b', '.hero-orbit-c'],
          {
            scale: 0.9,
            opacity: 0,
            duration: 1.3,
            stagger: 0.12,
            ease: 'power2.out',
            clearProps: 'opacity',
          },
          0.4
        )
        .from(
          '.hero-line',
          {
            scaleX: 0,
            opacity: 0,
            duration: 0.8,
            transformOrigin: 'right center',
            ease: 'power2.out',
            clearProps: 'opacity',
          },
          '-=0.8'
        )
        .from(
          '.stamp',
          {
            scale: 0.85,
            opacity: 0,
            duration: 1.0,
            ease: 'power2.out',
            clearProps: 'opacity',
          },
          '-=0.7'
        )
        .from(
          '.hero-word',
          {
            opacity: 0,
            x: -25,
            duration: 1.4,
            ease: 'power2.out',
            clearProps: 'opacity',
          },
          '-=0.9'
        )
        .from(
          '[data-hero-scroll]',
          {
            opacity: 0,
            y: 10,
            duration: 0.7,
            ease: 'power2.out',
            clearProps: 'transform,opacity',
          },
          '-=0.4'
        );

      // Continuous slow rotation on concentric decorative orbits
      gsap.to('.hero-orbit-a', {
        rotation: '+=360',
        duration: 60,
        repeat: -1,
        ease: 'none',
      });
      gsap.to('.hero-orbit-b', {
        rotation: '-=360',
        duration: 75,
        repeat: -1,
        ease: 'none',
      });
      gsap.to('.hero-orbit-c', {
        rotation: '+=360',
        duration: 50,
        repeat: -1,
        ease: 'none',
      });

      // Ambient gentle floating for disc & stamp
      gsap.to('.hero-disc', {
        y: -7,
        duration: 6.2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
      gsap.to('.stamp', {
        y: -5,
        rotation: '+=1.5',
        duration: 5.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
      gsap.to('[data-hero-scroll-icon]', {
        y: 4,
        duration: 1.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      // 2. Smooth GSAP scroll transition between Hero and next section
      if (heroRef.current) {
        gsap.timeline({
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1.2,
          },
        })
          .to(
            '[data-hero-text-col]',
            {
              yPercent: -12,
              opacity: 0.3,
              scale: 0.96,
              transformOrigin: 'center top',
              ease: 'none',
            },
            0
          )
          .to(
            '.hero-art',
            {
              yPercent: -8,
              opacity: 0.35,
              scale: 0.95,
              transformOrigin: 'center center',
              ease: 'none',
            },
            0
          )
          .to('.hero-disc', { yPercent: 12, scale: 0.92, opacity: 0.45, ease: 'none' }, 0)
          .to('.stamp', { yPercent: -18, rotation: 20, ease: 'none' }, 0)
          .to('.hero-word', { yPercent: 26, opacity: 0.01, ease: 'none' }, 0)
          .to('[data-hero-scroll]', { y: -20, opacity: 0, ease: 'none' }, 0);
      }

      // 3. Navigation Bar Scroll Transition
      const navAnim = headerRef.current ? createNavScrollTransition(headerRef.current) : null;

      // 4. Stats Section Reveal & Numeric Count-up
      if (proofRef.current) {
        createStatsReveal(proofRef.current);
      }

      // 5. Marquee Repeated Text Seamless Horizontal Motion with Pause on Hover
      const marqueeAnim = proofRef.current ? createMarqueeAnimation(proofRef.current) : null;

      // 6. Activities / Practice Section Reveal & Card Hover (Arrow Slide)
      const activitiesAnim = activitiesRef.current ? createActivitiesReveal(activitiesRef.current) : null;

      // 7. Resources Section Reveal
      const resourcesAnim = resourcesRef.current ? createResourcesReveal(resourcesRef.current) : null;

      // 8. Mentorship Section Reveal & Checkmark Draw-in
      const mentorshipAnim = mentorshipRef.current ? createMentorshipReveal(mentorshipRef.current) : null;

      // 9. Stories Section Reveal
      if (storiesRef.current) {
        createStoriesReveal(storiesRef.current);
      }

      // 10. Founders Section Reveal & Card Photo Zoom on Hover
      const foundersAnim = foundersRef.current ? createFoundersReveal(foundersRef.current) : null;

      // 11. Community Voices Section Reveal
      const voicesAnim = voicesRef.current ? createVoicesReveal(voicesRef.current) : null;

      // 12. Roadmap Steps (Scroll-Scrubbed Line Fill & Step Circle Pulses)
      const timelineAnim = howItWorksRef.current ? createTimelineReveal(howItWorksRef.current) : null;

      // 13. Community Network Marquee Strip
      const communityMarqueeAnim = communityMarqueeRef.current ? createMarqueeAnimation(communityMarqueeRef.current, { duration: 24 }) : null;

      // 14. Journey Storytelling & Subtle Parallax Scrub
      const journeyAnim = journeyRef.current ? createJourneyReveal(journeyRef.current) : null;

      // 15. FAQ / What to Expect Accordion Reveal
      const faqAnim = faqRef.current ? createFAQReveal(faqRef.current) : null;

      // 16. Feedback Section Reveal
      const feedbackAnim = feedbackRef.current ? createFeedbackReveal(feedbackRef.current) : null;

      // 17. Footer Section Reveal & Big Headline Treatment
      const footerAnim = footerRef.current ? createFooterReveal(footerRef.current) : null;

      return () => {
        navAnim?.cleanup();
        marqueeAnim?.cleanup();
        activitiesAnim?.cleanup();
        resourcesAnim?.cleanup();
        mentorshipAnim?.cleanup();
        foundersAnim?.cleanup();
        voicesAnim?.cleanup();
        timelineAnim?.cleanup();
        communityMarqueeAnim?.cleanup();
        journeyAnim?.cleanup();
        faqAnim?.cleanup();
        feedbackAnim?.cleanup();
        footerAnim?.cleanup();
      };
    },
    { scope: mainRef }
  );

  // Smooth editorial GSAP slide crossfade transition when carousel story changes
  useGSAP(
    () => {
      if (isFirstStoryRender.current) {
        isFirstStoryRender.current = false;
        return;
      }
      if (storiesRef.current) {
        animateStoryTransition(storiesRef.current);
      }
    },
    { dependencies: [storyIndex], scope: storiesRef }
  );

  const stats = [
    { target: 500, suffix: '+', title: 'Active Members', caption: 'A room that keeps growing' },
    { target: 7, suffix: ' PM', title: 'Daily Live Sessions', caption: 'Every Monday to Friday' },
    { target: 100, suffix: '%', title: 'Judgment Free', caption: 'Come as you are' },
    { target: 21, suffix: ' Days', title: 'To Real Change', caption: 'Show up, speak up' },
  ];

  const activitiesData = [
    {
      id: '01',
      title: 'Group Discussion',
      kicker: '4–8 speakers',
      duration: '20 min live',
      level: 'All Levels',
      summary: 'Jump into a live group and work through a topic together, out loud.',
      deepDive: 'Learn to jump in without cutting others off, build on counter-arguments with respect, and guide group consensus without aggression.',
      skillPill: 'Conversational Agility',
      sampleTopic: '“Is remote work quietly degrading junior career growth?”',
      statusText: '6 speakers online · Session in progress',
      color: '#D65A2A',
    },
    {
      id: '02',
      title: 'Debate & Rebuttal',
      kicker: 'Two sides, one topic',
      duration: '15 min rounds',
      level: 'Intermediate',
      summary: 'Pick a stance, build your case, defend it against pushback.',
      deepDive: 'Master point-counterpoint structure, spot flawed arguments with poise, and stay composed under sharp rebuttal without getting emotional.',
      skillPill: 'Structured Reasoning',
      sampleTopic: '“Should AI-generated media require mandatory digital watermarking?”',
      statusText: '2 debate tables forming',
      color: '#C74634',
    },
    {
      id: '03',
      title: 'Extempore',
      kicker: '60s to prepare',
      duration: '3 min speaking',
      level: 'Challenging',
      summary: 'One minute to think. Then you’re speaking, no notes.',
      deepDive: 'Conquer the panic of sudden questions in standups and client calls. Uses PREP (Point, Reason, Example, Point) to deliver crisp impromptu ideas.',
      skillPill: 'Impromptu Delivery',
      sampleTopic: '“The one human skill that technology will never replace.”',
      statusText: 'Next prompt drops in 4m',
      color: '#D65A2A',
    },
    {
      id: '04',
      title: 'Devil’s Advocate',
      kicker: 'Argue the unpopular side',
      duration: '15 min exercise',
      level: 'Advanced',
      summary: 'Take the position nobody wants to defend, on purpose, and make it hold.',
      deepDive: 'Detach personal ego from intellectual challenge. Forces cognitive empathy, sharpens negotiation muscles, and trains mental stamina.',
      skillPill: 'Cognitive Agility',
      sampleTopic: '“Why high onboarding friction can create better customer retention.”',
      statusText: 'Cohort batch active',
      color: '#C74634',
    },
    {
      id: '05',
      title: 'Solo, unscripted',
      kicker: 'One voice, no notes',
      duration: '5 min spotlight',
      level: 'Beginner Friendly',
      summary: 'Describe what you see and think out loud as it comes to you.',
      deepDive: 'Eliminates filler words ("um", "like", "actually") by teaching you to welcome pauses and align speech velocity with real-time thought formulation.',
      skillPill: 'Pacing & Tone',
      sampleTopic: '“Walk us through a critical decision you made this week that surprised you.”',
      statusText: 'Audio sandbox open',
      color: '#D65A2A',
    },
  ];

  const faqItems = [
    {
      q: 'What if I freeze or don’t know what to say?',
      a: 'That is exactly why UnmuteX exists. Nobody is judging you. Every session is led by a peer facilitator who provides scaffolded prompts, gentle guidance, and thinking pauses so you never feel isolated or pressured.',
      tip: 'You are always welcome to take a 5-second breath before speaking.',
    },
    {
      q: 'How do the 7 PM live practice rooms work?',
      a: 'Every weekday at 7:00 PM IST, members join our live room. We break out into small cohorts (4–6 people). A facilitator introduces the exercise format (Extempore, Debate, or Solo), everyone speaks in turn, and you receive gentle, actionable notes immediately after.',
      tip: 'Sessions run 45–60 minutes and begin promptly.',
    },
    {
      q: 'Do I need to turn my camera on?',
      a: 'We encourage video because facial cues and body language build real-world executive presence. However, if you are feeling anxious on your first day, you are completely free to start audio-only until you feel ready.',
      tip: 'Over 85% of members switch on video within their first three sessions.',
    },
    {
      q: 'How is this different from Toastmasters or public speaking courses?',
      a: 'Traditional courses focus on memorizing pre-written speeches and lectures. UnmuteX trains real-time conversational agility — the spontaneous, unscripted moments that make or break your day-to-day meetings, interviews, and social interactions.',
      tip: 'Zero lectures. 100% active, out-loud speaking practice.',
    },
    {
      q: 'Is there any preparation required before joining?',
      a: 'None at all. In fact, we prefer you come unprepared! Spontaneity is the core muscle we are building together. Just bring your headphones, a quiet corner, and an open mind.',
      tip: 'Just show up at 7 PM and unmute when it is your turn.',
    },
  ];

  const handleActivitySelect = (index: number) => {
    if (index === activeActivity) return;
    if (previewPanelRef.current) {
      animatePracticePanelTransition(previewPanelRef.current, () => {
        setActiveActivity(index);
      });
    } else {
      setActiveActivity(index);
    }
  };

  const handleToggleFAQ = (idx: number, e: React.MouseEvent<HTMLButtonElement>) => {
    const row = (e.currentTarget as HTMLElement).closest<HTMLElement>('.accordion-row');
    const willOpen = openFAQIndex !== idx;
    setOpenFAQIndex(willOpen ? idx : null);
    if (row) {
      toggleAccordionItem(row, willOpen);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="site-shell bg-background text-foreground">
      <header ref={headerRef} className="nav-blur fixed inset-x-0 top-0 z-40 border-b border-[#E0D7CB]">
        <div className="mx-auto flex max-w-[1240px] items-center justify-between px-5 py-4">
          <button data-testid="button-logo" onClick={() => scrollTo('top')} className="flex items-center gap-2 text-left" aria-label="Back to top">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-primary text-primary-foreground"><Mic2 size={16} /></span>
            <span className="text-lg font-bold tracking-[-.05em] text-foreground">Unmute<span className="text-primary">X</span></span>
          </button>
          <nav className="hidden items-center gap-7 text-sm font-semibold md:flex" aria-label="Main navigation">
            {['Practice', 'Resources', 'Mentorship', 'Stories', 'FAQ'].map((item) => (
              <button data-testid={`link-nav-${item.toLowerCase()}`} key={item} className="text-foreground/90 transition-colors hover:text-primary" onClick={() => scrollTo(item === 'Practice' ? 'activities' : item.toLowerCase())}>{item}</button>
            ))}
            <button data-testid="button-nav-join" onClick={() => scrollTo('how-it-works')} className="rounded-full bg-[#D65A2A] px-5 py-2.5 text-sm font-bold text-[#FFFFFF] transition-all hover:bg-[#C74634] hover:-translate-y-0.5 shadow-sm hover:shadow">Join the community <ArrowRight className="ml-1 inline" size={15} /></button>
          </nav>
          <button data-testid="button-mobile-menu" className="rounded-full border border-border p-2 md:hidden" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        {menuOpen && <nav className="border-t border-border px-5 pb-5 pt-3 md:hidden" aria-label="Mobile navigation">
          {['Practice', 'Resources', 'Mentorship', 'Stories', 'FAQ'].map((item) => <button data-testid={`link-mobile-${item.toLowerCase()}`} key={item} className="block w-full border-b border-border py-3 text-left font-semibold" onClick={() => scrollTo(item === 'Practice' ? 'activities' : item.toLowerCase())}>{item}</button>)}
          <button data-testid="button-mobile-join" onClick={() => scrollTo('how-it-works')} className="mt-4 w-full rounded-full bg-[#D65A2A] px-5 py-3 text-center font-bold text-[#FFFFFF] transition-colors hover:bg-[#C74634]">Join the community</button>
        </nav>}
      </header>

      <main id="top" ref={mainRef}>
        <section ref={heroRef} className="hero-grid overflow-hidden bg-[#FAF8F4] px-5 pb-10 pt-32 md:pt-40">
          <div className="mx-auto grid max-w-[1240px] items-center gap-10 lg:grid-cols-[1.05fr_.95fr]">
            <div data-hero-text-col className="relative z-10">
              <div data-hero-eyebrow className="mb-7 flex items-center gap-3">
                <span className="eyebrow">Live practice community · Est. now</span>
                <span data-hero-line className="h-px w-10 bg-primary" />
              </div>
              <h1 data-hero-title className="display-xl max-w-4xl font-display text-[#242424]">
                <span className="inline-block overflow-hidden align-top mr-3">
                  <span className="inline-block" data-hero-word>Unmute</span>
                </span>
                <span className="inline-block overflow-hidden align-top mr-3">
                  <span className="inline-block" data-hero-word>Your</span>
                </span>
                <span className="inline-block overflow-hidden align-top mr-4">
                  <span className="inline-block" data-hero-word>Voice.</span>
                </span>
                <br className="hidden sm:inline" />
                <span className="inline-block overflow-hidden align-top mr-3">
                  <span className="inline-block text-primary italic" data-hero-word>Speak</span>
                </span>
                <span className="inline-block overflow-hidden align-top mr-3">
                  <span className="inline-block" data-hero-word>Without</span>
                </span>
                <span className="inline-block overflow-hidden align-top">
                  <span className="inline-block" data-hero-word>Fear.</span>
                </span>
              </h1>
              <p data-hero-lead className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground">
                A live practice community where professionals, students, and founders build confidence speaking in meetings, interviews, presentations, and everyday conversations.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-5">
                <button data-hero-action data-testid="button-hero-start" onClick={() => scrollTo('how-it-works')} className="group rounded-full bg-[#D65A2A] px-6 py-3.5 font-bold text-[#FFFFFF] shadow-[4px_4px_0_#242424] transition-all hover:bg-[#C74634] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0_#242424]">
                  Find your voice <ArrowRight className="ml-2 inline transition-transform group-hover:translate-x-1" size={17} />
                </button>
                <button data-hero-action data-testid="button-hero-watch" onClick={() => scrollTo('journey')} className="link-arrow text-[#242424] hover:text-[#D65A2A] transition-colors">
                  <span className="grid h-9 w-9 place-items-center rounded-full border border-[#242424]"><Play size={13} fill="currentColor" /></span>
                  See how it feels
                </button>
              </div>
              <div data-hero-avatars className="mt-14 flex items-center gap-5 text-sm text-muted-foreground">
                <div className="flex -space-x-2">
                  <span data-hero-avatar-item className="grid h-8 w-8 place-items-center rounded-full border-2 border-[#FAF8F4] bg-[#242424] text-xs font-semibold text-[#FFFFFF]">N</span>
                  <span data-hero-avatar-item className="grid h-8 w-8 place-items-center rounded-full border-2 border-[#FAF8F4] bg-[#F1C7B5] text-xs font-bold text-[#242424]">L</span>
                  <span data-hero-avatar-item className="grid h-8 w-8 place-items-center rounded-full border-2 border-[#FAF8F4] bg-[#D65A2A] text-xs font-bold text-[#FFFFFF]">S</span>
                </div>
                <span>People practicing out loud, together.</span>
              </div>
            </div>
            <div className="hero-art relative flex items-center justify-center min-h-[440px]" aria-label="Animated illustration of voice orbits and vocal resonance">
              {/* Subtle Animated Looping SVG Graphic echoing the circular & orbital motif */}
              <svg viewBox="0 0 500 500" className="w-full h-full max-w-[460px] mx-auto overflow-visible select-none pointer-events-none" aria-hidden="true">
                <defs>
                  {/* Radial gradient for glowing central voice orb */}
                  <radialGradient id="heroVoiceCore" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#D65A2A" stopOpacity="0.95" />
                    <stop offset="55%" stopColor="#C74634" stopOpacity="0.8" />
                    <stop offset="85%" stopColor="#F1C7B5" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#FAF8F4" stopOpacity="0" />
                  </radialGradient>
                  <filter id="heroCoreGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="7" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Outer concentric soundwave rings (pulse breathing) */}
                <circle cx="250" cy="250" r="230" fill="none" stroke="#D65A2A" strokeWidth="1" strokeOpacity="0.12" strokeDasharray="6 8" className="hero-ring-pulse" />
                <circle cx="250" cy="250" r="195" fill="none" stroke="#716D68" strokeWidth="1" strokeOpacity="0.18" strokeDasharray="4 6" />
                <circle cx="250" cy="250" r="160" fill="none" stroke="#D65A2A" strokeWidth="1.2" strokeOpacity="0.22" className="hero-ring-pulse" />

                {/* Slow rotating orbital ellipses with nodes */}
                <g className="hero-spin-cw">
                  <ellipse cx="250" cy="250" rx="215" ry="145" fill="none" stroke="#D65A2A" strokeWidth="1.2" strokeOpacity="0.32" transform="rotate(-28 250 250)" />
                  <circle cx="435" cy="180" r="4.5" fill="#D65A2A" opacity="0.8" />
                  <circle cx="65" cy="320" r="3" fill="#F1C7B5" opacity="0.6" />
                </g>

                <g className="hero-spin-ccw">
                  <ellipse cx="250" cy="250" rx="175" ry="225" fill="none" stroke="#F1C7B5" strokeWidth="1.2" strokeOpacity="0.55" transform="rotate(32 250 250)" />
                  <circle cx="250" cy="25" r="4.5" fill="#D65A2A" opacity="0.85" />
                  <circle cx="250" cy="475" r="3" fill="#242424" opacity="0.35" />
                </g>

                {/* Inner resonance disc & voice core */}
                <circle cx="250" cy="250" r="110" fill="url(#heroVoiceCore)" filter="url(#heroCoreGlow)" className="hero-orb-breathe" />
                <circle cx="250" cy="250" r="75" fill="none" stroke="#FAF8F4" strokeWidth="1.5" strokeOpacity="0.45" strokeDasharray="4 4" className="hero-spin-cw" />
                <circle cx="250" cy="250" r="42" fill="#F1C7B5" opacity="0.85" className="hero-orb-breathe" />

                {/* Angled dynamic voice trajectory line */}
                <line x1="160" y1="290" x2="340" y2="210" stroke="#FAF8F4" strokeWidth="1.5" strokeOpacity="0.75" strokeDasharray="4 6" />
              </svg>

              {/* Floating Stamp Badge */}
              <div className="absolute right-[4%] top-[2%] z-10 pointer-events-auto">
                <div className="stamp border-[#242424] text-[#242424] bg-[#FAF8F4]/80 backdrop-blur-xs">
                  <span>MAKE<br />ROOM<br /><b>FOR<br />YOUR<br />VOICE</b></span>
                </div>
              </div>
              <span className="hero-word">speak</span>
            </div>
          </div>
          <div data-hero-scroll className="mx-auto mt-12 max-w-[1240px]">
            <button data-testid="button-scroll-stats" onClick={() => scrollTo('proof')} className="flex items-center gap-3 text-xs font-bold uppercase tracking-[.17em] text-muted-foreground transition-colors hover:text-foreground">
              <span data-hero-scroll-icon className="grid h-9 w-9 place-items-center rounded-full border border-[#E0D7CB]"><ArrowDown size={15} /></span>
              Scroll to find your rhythm
            </button>
          </div>
        </section>

        {/* Curved section transition: Hero -> Stats */}
        <div className="section-curve-divider bg-[#FAF8F4]">
          <svg viewBox="0 0 1440 48" fill="none" preserveAspectRatio="none">
            <path d="M0 48C480 16 960 16 1440 48V48H0Z" fill="#242424" />
          </svg>
        </div>

        <section id="proof" ref={proofRef} className="io-reveal bg-[#242424] text-[#FFFFFF]">
          <div className="stat-row mx-auto grid max-w-[1240px] grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div data-proof-item key={stat.title} className="p-6 py-9 md:p-9">
                <p className="font-display text-4xl text-[#FFFFFF] md:text-5xl">
                  <span data-proof-number data-target={stat.target}>0</span>
                  {stat.suffix}
                </p>
                <p className="mt-2 text-base font-semibold text-white/95">{stat.title}</p>
                <p className="mt-1 text-xs text-[#F1C7B5]">{stat.caption}</p>
              </div>
            ))}
          </div>
          <div className="ticker border-t border-white/15 py-4 text-sm font-medium">
            <div className="ticker-track">
              <span>Live sessions, Monday to Friday, 7 to 8 PM.</span>
              <span>Live sessions, Monday to Friday, 7 to 8 PM.</span>
              <span>Live sessions, Monday to Friday, 7 to 8 PM.</span>
              <span>Live sessions, Monday to Friday, 7 to 8 PM.</span>
            </div>
          </div>
        </section>

        {/* Curved section transition: Stats -> Activities */}
        <div className="section-curve-divider bg-[#242424]">
          <svg viewBox="0 0 1440 48" fill="none" preserveAspectRatio="none">
            <path d="M0 0C480 32 960 32 1440 0V48H0Z" fill="#FAF8F4" />
          </svg>
        </div>

        <section id="activities" ref={activitiesRef} className="section-pad io-reveal bg-[#FAF8F4]">
          <div className="section-wrap">
            <div className="grid gap-12 lg:grid-cols-[1.1fr_1.1fr] lg:items-start">
              {/* Left Column: Header + Interactive Format List Rows */}
              <div>
                <p className="eyebrow">The practice room</p>
                <h2 data-section-heading className="display-md mt-5 font-display text-[#242424]">Speak first.<br /><em className="text-primary">Polish later.</em></h2>
                <p className="mt-6 max-w-lg leading-relaxed text-muted-foreground">Practice out loud with interactive live formats. Hover or tap each format below to explore how sessions run in real time.</p>
                <div className="mt-6 flex items-center gap-4">
                  <button data-testid="button-activities-join" onClick={() => scrollTo('how-it-works')} className="link-arrow text-[#242424] hover:text-primary transition-colors">Start practicing <ArrowRight size={17} /></button>
                </div>

                {/* Interactive Format Rows (FOD-Style List) */}
                <div className="mt-10">
                  {activitiesData.map((act, index) => {
                    const isActive = activeActivity === index;
                    return (
                      <button
                        key={act.id}
                        data-testid={`button-activity-${index}`}
                        onClick={() => handleActivitySelect(index)}
                        onMouseEnter={() => handleActivitySelect(index)}
                        className={`practice-item flex items-center justify-between ${isActive ? 'is-active' : ''}`}
                      >
                        <div className="flex items-center gap-4">
                          <span className="font-mono text-xs font-semibold text-primary">{act.id}</span>
                          <div>
                            <p className="font-display text-2xl text-[#242424]">{act.title}</p>
                            <p className="text-xs text-muted-foreground">{act.kicker}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="hidden sm:inline-block rounded-full bg-[#EDE6DD] px-3 py-1 text-[0.7rem] font-mono font-semibold text-[#716D68]">{act.duration}</span>
                          <span className="practice-arrow text-muted-foreground"><ArrowRight size={16} /></span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Large Interactive Media Preview Stage */}
              <div ref={previewPanelRef} className="preview-stage p-7 md:p-10 sticky top-28">
                {(() => {
                  const active = activitiesData[activeActivity] || activitiesData[0];
                  return (
                    <div data-preview-content className="transition-opacity">
                      <div className="flex items-center justify-between border-b border-[#E0D7CB] pb-4">
                        <div className="flex items-center gap-2">
                          <span className="h-2.5 w-2.5 rounded-full bg-[#D65A2A] animate-pulse" />
                          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#242424]">{active.statusText}</span>
                        </div>
                        <span className="font-mono text-xs font-bold text-primary">{active.id} / 05</span>
                      </div>

                      <div className="mt-7">
                        <span className="eyebrow">{active.kicker}</span>
                        <h3 className="font-display text-3xl md:text-4xl text-[#242424] mt-2">{active.title}</h3>
                        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{active.deepDive}</p>
                      </div>

                      {/* Live Waveform Audio Dynamics Visualizer */}
                      <div className="mt-7 rounded-2xl border border-[#E0D7CB] bg-[#FAF8F4] p-5">
                        <div className="flex items-center justify-between text-xs font-mono mb-3">
                          <span className="font-bold text-[#242424]">Live Voice Dynamics</span>
                          <span className="text-primary font-semibold">{active.duration}</span>
                        </div>
                        <Waveform barsCount={26} color={active.color} height={38} />
                      </div>

                      {/* Sample Prompt Box */}
                      <div className="mt-7 border-l-2 border-primary bg-[#FAF8F4]/80 p-4 pl-5">
                        <p className="text-xs font-mono uppercase tracking-wider text-primary font-bold">Sample Prompt Tonight</p>
                        <p className="mt-1 font-display text-lg text-[#242424] italic">{active.sampleTopic}</p>
                      </div>

                      {/* Tags & Action CTA */}
                      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#E0D7CB]">
                        <div className="flex flex-wrap gap-2">
                          <span className="rounded-full border border-[#E0D7CB] bg-white px-3 py-1 text-xs font-medium text-[#242424]">{active.skillPill}</span>
                          <span className="rounded-full border border-[#E0D7CB] bg-white px-3 py-1 text-xs font-medium text-[#242424]">{active.level}</span>
                        </div>
                        <button
                          data-testid="button-practice-active-room"
                          onClick={() => scrollTo('how-it-works')}
                          className="rounded-full bg-[#D65A2A] px-5 py-2.5 text-xs font-bold text-[#FFFFFF] transition-all hover:bg-[#C74634] hover:-translate-y-0.5 shadow-sm"
                        >
                          Practice this format <ArrowRight size={13} className="ml-1 inline" />
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

            <div className="mt-14 flex flex-wrap items-center gap-3 border-t border-border pt-5 text-sm text-muted-foreground">
              <Sparkles size={16} className="text-primary" />
              <span>Plus role-plays, mock interviews and storytelling — new formats added every week.</span>
            </div>
          </div>
        </section>

        {/* Curved section transition: Activities (Cream) -> Cinematic Manifesto (Black) */}
        <div className="section-curve-divider bg-[#FAF8F4]">
          <svg viewBox="0 0 1440 48" fill="none" preserveAspectRatio="none">
            <path d="M0 48C480 16 960 16 1440 48V48H0Z" fill="#242424" />
          </svg>
        </div>

        {/* Full-Viewport Cinematic Statement (Title Card Moment) */}
        <section id="manifesto" className="cinematic-statement-section io-reveal px-6 py-28 md:py-36">
          {/* Subtle Ambient Background Orbits */}
          <div className="absolute inset-0 pointer-events-none opacity-25">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[720px] rounded-full border border-white/10" />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[460px] h-[460px] rounded-full border border-[#D65A2A]/30" />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[240px] h-[240px] rounded-full bg-[#D65A2A]/10 blur-3xl" />
          </div>

          <div className="relative z-10 mx-auto max-w-[1240px]">
            <p className="eyebrow mb-7 text-[#F1C7B5]">UnmuteX Manifesto</p>
            <h2 className="cinematic-headline font-display text-[#FFFFFF]">
              Speak first.<br />
              <em className="text-[#D65A2A]">Polish later.</em>
            </h2>
            <p className="mt-8 font-mono text-xs uppercase tracking-[0.25em] text-white/55">
              The live room is open · Every Monday to Friday at 7 PM IST
            </p>
            <div className="mt-10">
              <button
                data-testid="button-manifesto-join"
                onClick={() => scrollTo('how-it-works')}
                className="rounded-full border border-white/25 bg-white/5 px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-white transition-all hover:bg-white/15 hover:border-white/50 hover:scale-105"
              >
                Claim Your Seat In Tonight’s Circle <ArrowRight size={14} className="ml-2 inline" />
              </button>
            </div>
          </div>
        </section>

        {/* Curved section transition: Cinematic Manifesto (Black) -> Resources (Cream) */}
        <div className="section-curve-divider bg-[#242424]">
          <svg viewBox="0 0 1440 48" fill="none" preserveAspectRatio="none">
            <path d="M0 0C480 32 960 32 1440 0V48H0Z" fill="#FAF8F4" />
          </svg>
        </div>

        <section id="resources" ref={resourcesRef} className="section-pad io-reveal bg-[#FAF8F4]">
          <div className="section-wrap">
            <div className="flex flex-col justify-between gap-7 md:flex-row md:items-end">
              <div>
                <p className="eyebrow">Your speaking toolkit</p>
                <h2 data-section-heading className="display-md mt-4 max-w-3xl font-display text-[#242424]">The right words.<br /><em className="text-primary">When you need them.</em></h2>
              </div>
              <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">Resources you can reach for before, during, and after every conversation.</p>
            </div>
            <div className="mt-16 grid gap-px border border-[#E0D7CB] bg-[#E0D7CB] md:grid-cols-3">
              {[
                { number: '01', title: 'Communication Frameworks', label: 'Structure', copy: 'Structures like PREP and STAR to organize your thoughts before you speak.', badgeStyle: 'bg-[#F1C7B5] text-[#242424]' },
                { number: '02', title: 'Vocabulary', label: 'Word bank', copy: 'Words and phrases to reach for on any topic, from idioms to topic-specific terms.', badgeStyle: 'bg-[#EDE6DD] text-[#D65A2A]' },
                { number: '03', title: 'Practical advice', label: 'A little less noise', copy: 'How to build confidence, cut filler words, and pace yourself while speaking.', badgeStyle: 'bg-[#D65A2A]/15 text-[#D65A2A]' },
              ].map((card) => (
                <article data-toolkit-card key={card.title} className="bg-[#FFFFFF] p-7 md:p-10">
                  <span className="font-mono text-xs font-bold text-primary">{card.number}</span>
                  <div className="mt-16 flex items-center justify-between gap-4">
                    <h3 className="font-display text-3xl leading-none text-[#242424]">{card.title}</h3>
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[#242424]/25"><ArrowRight size={15} /></span>
                  </div>
                  <div className="mt-4">
                    <span className={`inline-block rounded px-2.5 py-1 text-xs font-bold uppercase tracking-[.14em] ${card.badgeStyle}`}>{card.label}</span>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{card.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="mentorship" ref={mentorshipRef} className="section-pad io-reveal bg-[#242424] text-[#FFFFFF]">
          <div className="section-wrap">
            <div className="grid gap-10 lg:grid-cols-[.75fr_1.25fr]">
              <div>
                <p className="eyebrow text-[#F1C7B5]">An eye on your next move</p>
                <h2 className="display-md mt-5 font-display">You don't have<br />to figure it out<br /><em className="text-[#D65A2A]">alone.</em></h2>
                <p className="mt-7 max-w-sm leading-relaxed text-white/75">A mentor reviews how you spoke, where you got stuck, and exactly what to work on next.</p>

                {/* Animated Voice Waveform Panel (Fills previously blank left column) */}
                <div data-mentorship-waveform className="mt-10 max-w-sm rounded-2xl border border-white/15 bg-white/5 p-5 backdrop-blur-sm">
                  <div className="flex items-center justify-between text-xs font-mono text-[#F1C7B5] uppercase tracking-wider mb-3">
                    <span className="font-bold">Speech Clarity Matrix</span>
                    <span className="text-[0.7rem] text-white/60">Mentor Verified</span>
                  </div>
                  <Waveform barsCount={22} color="#F1C7B5" height={32} />
                  <p className="mt-3 text-[0.75rem] text-white/60">Pacing, filler words, tone inflection, and conversation structure analysis.</p>
                </div>
              </div>
              <div className="grid gap-px bg-white/15 sm:grid-cols-2">
                {[
                  ['Personalized Feedback', 'After every session', 'A mentor reviews how you spoke and tells you exactly what to work on next.'],
                  ['Ongoing Support', 'Whenever you need it', 'Check in when you get stuck, not just during scheduled sessions.'],
                  ['1-on-1 Sessions', 'By appointment', 'Book dedicated time with a mentor to work through something specific.'],
                  ['Goal Tracking', 'Over weeks', 'See how your speaking has changed over time, not just after one session.'],
                ].map(([title, label, copy]) => (
                  <article key={title} className="bg-[#242424] p-7">
                    <span className="grid h-9 w-9 place-items-center rounded-full border border-[#F1C7B5] text-[#F1C7B5]"><Check size={16} /></span>
                    <h3 className="mt-10 font-display text-2xl">{title}</h3>
                    <p className="mt-2 text-xs font-bold uppercase tracking-[.13em] text-[#F1C7B5]">{label}</p>
                    <p className="mt-4 text-sm leading-relaxed text-white/75">{copy}</p>
                  </article>
                ))}
              </div>
            </div>
            <div className="mt-14 flex flex-col items-start justify-between gap-6 border-t border-white/20 pt-6 sm:flex-row sm:items-center">
              <p className="font-display text-2xl">Tonight's Group Discussion: <em className="text-[#D65A2A]">Work-Life Balance, starting at 7 PM</em></p>
              <button data-testid="button-live-prompt" onClick={() => scrollTo('how-it-works')} className="shrink-0 rounded-full bg-[#D65A2A] px-5 py-3 text-sm font-bold text-[#FFFFFF] transition-all hover:bg-[#C74634] hover:-translate-y-1 shadow-sm hover:shadow">Join the room <ArrowRight className="ml-2 inline" size={15} /></button>
            </div>
          </div>
        </section>

        {/* Curved section transition: Mentorship -> Stories */}
        <div className="section-curve-divider bg-[#242424]">
          <svg viewBox="0 0 1440 48" fill="none" preserveAspectRatio="none">
            <path d="M0 0C480 32 960 32 1440 0V48H0Z" fill="#FAF8F4" />
          </svg>
        </div>

        <section
          id="stories"
          ref={storiesRef}
          className="section-pad io-reveal bg-[#FAF8F4]"
          onMouseEnter={() => setIsCarouselHovered(true)}
          onMouseLeave={() => setIsCarouselHovered(false)}
        >
          <div className="section-wrap">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <p className="eyebrow">A little proof goes a long way</p>
                <h2 data-section-heading className="display-md mt-4 font-display text-[#242424]">Real People.<br /><em className="text-primary">Real Confidence.</em></h2>
              </div>
              <p className="max-w-sm leading-relaxed text-muted-foreground">Watch how our members transformed from hesitant speakers into highly confident, articulate communicators.</p>
            </div>
            <div className="mt-14 grid items-stretch gap-6 lg:grid-cols-[.85fr_1.15fr]">
              <div className="portrait flex items-end p-8 text-white">
                <div data-story-content className="relative z-10">
                  <span className="eyebrow text-[#F1C7B5]">Member story</span>
                  <p className="mt-3 font-display text-5xl">{stories[storyIndex]}</p>
                  <p className="mt-2 max-w-xs text-sm text-white/80">Real People. Real Confidence.</p>
                </div>
                <div data-story-content className="absolute right-7 top-7 font-mono text-xs text-white/60">{String(storyIndex + 1).padStart(2, '0')} / {String(stories.length).padStart(2, '0')}</div>
              </div>
              <div className="flex flex-col justify-between border border-[#E0D7CB] bg-[#FFFFFF] p-7 md:p-12">
                <Quote className="text-primary" size={35} fill="currentColor" />
                <p data-story-content data-testid="text-story-quote" className="mt-10 max-w-xl font-display text-4xl leading-[.98] text-[#242424] md:text-5xl">Watch how our members transformed from hesitant speakers into highly confident, articulate communicators.</p>
                <div className="mt-12 flex items-center justify-between border-t border-border pt-5">
                  <span data-story-content className="text-sm font-semibold text-muted-foreground">Member: {stories[storyIndex]}</span>
                  <div className="flex gap-2">
                    <button data-testid="button-story-previous" onClick={() => setStoryIndex((storyIndex - 1 + stories.length) % stories.length)} className="grid h-10 w-10 place-items-center rounded-full border border-border transition-colors hover:bg-muted" aria-label="Previous story"><ChevronLeft size={18} /></button>
                    <button data-testid="button-story-next" onClick={() => setStoryIndex((storyIndex + 1) % stories.length)} className="grid h-10 w-10 place-items-center rounded-full border border-border transition-colors hover:bg-muted" aria-label="Next story"><ChevronRight size={18} /></button>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {stories.map((name, index) => (
                <button data-testid={`button-story-dot-${index}`} key={name} onClick={() => setStoryIndex(index)} aria-label={`Read story from ${name}`} className={`h-1.5 rounded-full transition-all ${index === storyIndex ? 'w-10 bg-primary' : 'w-3 bg-border'}`} />
              ))}
            </div>
          </div>
        </section>

        {/* Curved section transition: Stories (Cream) -> Founders (Black) */}
        <div className="section-curve-divider bg-[#FAF8F4]">
          <svg viewBox="0 0 1440 48" fill="none" preserveAspectRatio="none">
            <path d="M0 48C480 16 960 16 1440 48V48H0Z" fill="#242424" />
          </svg>
        </div>

        <section id="founders" ref={foundersRef} className="section-pad io-reveal bg-[#242424] text-[#FFFFFF]">
          <div className="section-wrap">
            <div className="grid gap-10 lg:grid-cols-[.7fr_1.3fr]">
              <div>
                <p className="eyebrow text-[#F1C7B5]">The humans behind the room</p>
                <h2 data-section-heading className="display-md mt-4 font-display text-[#FFFFFF]">Meet The<br /><em className="text-[#D65A2A]">Founders.</em></h2>
                <p className="mt-6 max-w-sm leading-relaxed text-white/75">Two minds. One mission. Building a community where every voice finds its confidence.</p>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                {[
                  ['Shashwat Sharma', 'Founder & Lead Facilitator', 'SOIT, RGPV University', 'Speak to express, not to impress.', `There was a time when I knew exactly what I wanted to say, but couldn't express it confidently. Like many students, I struggled with hesitation, overthinking, and the fear of being judged. Even when I had ideas, I often stayed silent because I wasn't confident enough to speak up. Everything started changing when I stopped waiting to become perfect and simply started practicing. One conversation, one discussion, one opportunity at a time. Over time, I realized that confidence isn't something you're born with — it's something you build through consistency. That's why I started UnmuteX — a place where people can speak freely, participate in meaningful activities, overcome hesitation, and grow into confident communicators together.`],
                  ['Yash', 'Co-Founder & Coach', 'IIIT Bhubaneswar', 'Structure your thoughts, command the room.', `Great ideas are buried every day simply because someone lacked the guts to speak up. I’ve seen it happen, and I’ve hustled hard enough to ensure it never happens to me. Building UnmuteX wasn’t just a startup idea; it was a necessity. Combining a tech-driven mindset with the fire of a debater, my goal as Co-Founder is clear: We don’t just teach you how to talk. We train you to claim your space. Stop surviving the conversation. Start commanding it.`],
                ].map(([name, role, school, tagline, story]) => (
                  <article key={name} className="mentor-card-interactive overflow-hidden border border-white/15 bg-[#1C1C1C] text-white rounded-xl shadow-lg">
                    <div className="overflow-hidden">
                      <div className="founder-portrait portrait mentor-portrait-zoom transition-transform duration-500">
                        <span className="absolute bottom-5 left-6 z-10 font-display text-6xl text-white">{name[0]}</span>
                        <span className="absolute right-5 top-5 z-10 font-mono text-xs text-white/70">0{name.startsWith('S') ? 1 : 2}</span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="font-display text-3xl text-white">{name}</h3>
                      <p className="mt-1 text-xs font-bold uppercase tracking-[.12em] text-[#D65A2A]">{role}</p>
                      <p className="mt-1 text-xs text-white/60">{school}</p>
                      <p className="founder-quote-line mt-5 border-l-2 border-[#D65A2A] pl-3 font-display text-xl text-white transition-transform">“{tagline}”</p>
                      <details className="group mt-6 border-t border-white/15 pt-4">
                        <summary className="cursor-pointer list-none text-sm font-bold text-white/90 hover:text-[#D65A2A] transition-colors">Read {name.split(' ')[0]}’s story <ArrowRight className="ml-2 inline transition-transform group-open:rotate-90" size={14} /></summary>
                        <p className="mt-4 text-sm leading-relaxed text-white/75">{story}</p>
                      </details>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Curved section transition: Founders (Black) -> Voices (Cream) */}
        <div className="section-curve-divider bg-[#242424]">
          <svg viewBox="0 0 1440 48" fill="none" preserveAspectRatio="none">
            <path d="M0 0C480 32 960 32 1440 0V48H0Z" fill="#FAF8F4" />
          </svg>
        </div>

        <section ref={voicesRef} className="section-pad io-reveal bg-[#FAF8F4]">
          <div className="section-wrap">
            <div className="grid gap-8 lg:grid-cols-[1.1fr_.9fr]">
              <div>
                <p className="eyebrow">Voices that GREW WITH UNMUTEX</p>
                <h2 data-section-heading className="display-md mt-4 font-display text-[#242424]">The room changes<br />when <em className="text-primary">you do.</em></h2>
                <p className="mt-6 max-w-lg leading-relaxed text-muted-foreground">Meet members who stayed consistent, embraced every challenge, and transformed their communication skills through practice and persistence.</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3 lg:mt-12">
                {[
                  ['Nikhil Kumar', 'Head of Product & Tech', 'Code that empowers community voices.', 'bg-[#242424] text-[#FFFFFF]'],
                  ['Akriti', 'Creative & Brand Lead', 'Good design makes hard skills approachable.', 'bg-[#F1C7B5] text-[#242424]'],
                  ['Chhavi', 'Mentorship Coordinator', 'Constructive feedback heals stage anxiety.', 'bg-[#D65A2A] text-[#FFFFFF]'],
                ].map(([name, role, line, avatarStyle]) => (
                  <div key={name} className="border border-[#E0D7CB] bg-[#FFFFFF] p-5">
                    <span className={`grid h-11 w-11 place-items-center rounded-full font-display text-xl ${avatarStyle}`}>{name[0]}</span>
                    <p className="mt-8 font-display text-2xl text-[#242424]">{name}</p>
                    <p className="mt-1 text-[.65rem] font-bold uppercase tracking-[.1em] text-primary">{role}</p>
                    <p className="mt-5 text-sm leading-relaxed text-muted-foreground">“{line}”</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-10 grid gap-5 border-t border-border pt-8 lg:grid-cols-3">
              {[
                ['Nikhil Kumar', 'Joining UnmuteX has genuinely helped me grow as a communicator. Over time, I\'ve noticed a big improvement in my confidence, articulation, and the way I express my thoughts. Earlier, I used to hesitate while speaking, but this community gave me a comfortable space to practice and improve consistently.'],
                ['Akriti', 'Hello, I am Akriti. Being a part of the UnmuteX community has greatly improved my confidence and speaking skills. The environment here is so friendly and encouraging that I never felt judged while expressing my thoughts and opinions.'],
                ['Chhavi', 'UnmuteX has helped me improve my communication skills, self confidence and structuring my thoughts properly. The community sessions are amazing, people are really considerate and supportive.'],
              ].map(([name, copy]) => (
                <blockquote key={name} className="border-l-2 border-primary pl-5">
                  <p className="text-sm leading-relaxed text-muted-foreground">“{copy}”</p>
                  <footer className="mt-4 text-xs font-bold uppercase tracking-[.12em] text-[#242424]">{name}</footer>
                </blockquote>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" ref={howItWorksRef} className="section-pad io-reveal bg-[#FAF8F4] border-y border-[#E0D7CB]">
          <div className="section-wrap">
            <div className="flex flex-col justify-between gap-7 md:flex-row md:items-end">
              <div>
                <p className="eyebrow">No gatekeeping, just a first step</p>
                <h2 data-section-heading className="display-md mt-4 max-w-2xl font-display text-[#242424]">Your path to<br /><em className="text-primary">confident speaking.</em></h2>
              </div>
              <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">Come in curious. Leave with something you can feel.</p>
            </div>
            <div className="mt-20 relative">
              <div className="timeline-line absolute left-0 right-0 top-6" />
              <div className="grid gap-10 md:grid-cols-4 relative z-10">
                {[
                  ['01', 'Join the Community', 'Join a supportive community focused on improving public speaking and confidence.'],
                  ['02', 'Record & Send Video', 'Share a short introduction video to help us understand your speaking level.'],
                  ['03', 'Get Batched & Grouped', 'Get matched with 4 peers at a similar speaking level for focused practice.'],
                  ['04', 'Your Journey Starts', 'Practice in live sessions, receive feedback, and build lasting confidence.'],
                ].map(([number, title, copy]) => (
                  <article key={number} className="pt-0">
                    <span className="step-number border-2 border-primary bg-[#FFFFFF] font-bold text-primary shadow-sm transition-transform">{number}</span>
                    <h3 className="mt-7 font-display text-2xl text-[#242424]">{title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{copy}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Continuous Seamless Auto-Scrolling Text Ticker */}
        <div ref={communityMarqueeRef} className="overflow-hidden border-y border-[#E0D7CB] bg-[#EDE6DD]/50 py-3.5 text-xs font-mono uppercase tracking-widest text-[#716D68]">
          <div className="ticker-seamless">
            <span className="flex items-center gap-6 px-4 whitespace-nowrap">
              <span>STUDENT DEBATERS</span>
              <span className="text-[#D65A2A]">·</span>
              <span>ASPIRING FOUNDERS</span>
              <span className="text-[#D65A2A]">·</span>
              <span>SOIT RGPV</span>
              <span className="text-[#D65A2A]">·</span>
              <span>IIIT BHUBANESWAR</span>
              <span className="text-[#D65A2A]">·</span>
              <span>BITS PILANI</span>
              <span className="text-[#D65A2A]">·</span>
              <span>VIT VELLORE</span>
              <span className="text-[#D65A2A]">·</span>
              <span>IIT DELHI</span>
              <span className="text-[#D65A2A]">·</span>
              <span>TECH & PRODUCT TEAMS</span>
              <span className="text-[#D65A2A]">·</span>
            </span>
            <span className="flex items-center gap-6 px-4 whitespace-nowrap">
              <span>STUDENT DEBATERS</span>
              <span className="text-[#D65A2A]">·</span>
              <span>ASPIRING FOUNDERS</span>
              <span className="text-[#D65A2A]">·</span>
              <span>SOIT RGPV</span>
              <span className="text-[#D65A2A]">·</span>
              <span>IIIT BHUBANESWAR</span>
              <span className="text-[#D65A2A]">·</span>
              <span>BITS PILANI</span>
              <span className="text-[#D65A2A]">·</span>
              <span>VIT VELLORE</span>
              <span className="text-[#D65A2A]">·</span>
              <span>IIT DELHI</span>
              <span className="text-[#D65A2A]">·</span>
              <span>TECH & PRODUCT TEAMS</span>
              <span className="text-[#D65A2A]">·</span>
            </span>
          </div>
        </div>

        <section id="journey" ref={journeyRef} className="section-pad io-reveal bg-[#242424] text-[#FFFFFF]">
          <div className="section-wrap grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
            <div>
              <p className="eyebrow text-[#F1C7B5]">Our Journey So Far...</p>
              <h2 data-section-heading className="display-md mt-5 font-display">A room full of<br /><em className="text-[#D65A2A]">becoming.</em></h2>
              <p className="mt-7 max-w-lg leading-relaxed text-white/75">These are the glimpses of our meeting, where our community grows together through daily group discussions, improving speaking skills, confidence, ideas, and meaningful connections.</p>
              <button data-testid="button-journey-join" onClick={() => scrollTo('how-it-works')} className="link-arrow mt-9 text-[#D65A2A] hover:text-[#F1C7B5] transition-colors">Be part of the next glimpse <ArrowRight size={17} /></button>
            </div>
            <div className="journey-art">
              <div className="absolute left-10 top-10 z-10 font-mono text-xs text-[#F1C7B5] tracking-widest font-semibold">FIELD NOTE / 001</div>
              <div className="absolute bottom-9 right-8 z-10 max-w-[13rem] text-right font-display text-4xl leading-[.9] text-[#D65A2A]">Every day,<br />a little<br />less muted.</div>
              <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
                <div className="grid h-28 w-28 place-items-center rounded-full border border-[#D65A2A]/60 bg-[#242424]/60 backdrop-blur-sm">
                  <Mic2 className="text-[#D65A2A]" size={35} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Curved section transition: Journey -> FAQ */}
        <div className="section-curve-divider bg-[#242424]">
          <svg viewBox="0 0 1440 48" fill="none" preserveAspectRatio="none">
            <path d="M0 0C480 32 960 32 1440 0V48H0Z" fill="#FAF8F4" />
          </svg>
        </div>

        {/* FAQ / What to Expect Section (Accordion '+' Pattern) */}
        <section id="faq" ref={faqRef} className="section-pad io-reveal bg-[#FAF8F4]">
          <div className="section-wrap">
            <div className="grid gap-12 lg:grid-cols-[.85fr_1.15fr]">
              <div>
                <p className="eyebrow">Clear answers before you speak</p>
                <h2 data-section-heading className="display-md mt-4 font-display text-[#242424]">Everything You Need<br /><em className="text-primary">To Know.</em></h2>
                <p data-faq-lead className="mt-6 max-w-sm leading-relaxed text-muted-foreground">No gatekeeping. Here is exactly what happens when you step into the room for the first time.</p>
                <div className="mt-10 rounded-2xl border border-[#E0D7CB] bg-white/70 p-6 shadow-sm backdrop-blur-sm">
                  <p className="text-xs font-mono uppercase tracking-wider text-primary font-bold">First time attending?</p>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">You are welcome to observe your first 7 PM session with microphone muted before joining a circle. We move at your pace.</p>
                  <button
                    onClick={() => scrollTo('how-it-works')}
                    className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
                  >
                    View 4-step onboarding <ArrowRight size={13} />
                  </button>
                </div>
              </div>

              {/* Accordion Rows */}
              <div className="space-y-0">
                {faqItems.map((item, index) => {
                  const isOpen = openFAQIndex === index;
                  return (
                    <div key={item.q} className={`accordion-row ${isOpen ? 'is-open' : ''}`}>
                      <button
                        type="button"
                        className="accordion-toggle"
                        onClick={(e) => handleToggleFAQ(index, e)}
                        aria-expanded={isOpen}
                      >
                        <span className="font-display text-xl sm:text-2xl text-[#242424] pr-4 leading-tight">{item.q}</span>
                        <span className="accordion-icon-box shrink-0 text-[#242424]">
                          <Plus size={18} />
                        </span>
                      </button>
                      <div className="accordion-body" style={{ height: isOpen ? 'auto' : 0 }}>
                        <div className="px-4 pb-6 text-sm leading-relaxed text-muted-foreground">
                          <p>{item.a}</p>
                          {item.tip && (
                            <div className="mt-3 inline-flex items-center gap-2 rounded-md bg-[#FAF8F4] border border-[#E0D7CB] px-3 py-1.5 text-xs text-[#242424]">
                              <Sparkles size={13} className="text-primary" />
                              <span>{item.tip}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Curved section transition: FAQ (Cream) -> Feedback (Black) */}
        <div className="section-curve-divider bg-[#FAF8F4]">
          <svg viewBox="0 0 1440 48" fill="none" preserveAspectRatio="none">
            <path d="M0 48C480 16 960 16 1440 48V48H0Z" fill="#242424" />
          </svg>
        </div>

        <section id="feedback" ref={feedbackRef} className="section-pad io-reveal bg-[#242424] text-[#FFFFFF]">
          <div className="section-wrap grid gap-12 lg:grid-cols-[.9fr_1.1fr]">
            <div>
              <p className="eyebrow text-[#F1C7B5]">A note from the room</p>
              <h2 data-section-heading className="display-md mt-4 font-display text-[#FFFFFF]">What Members<br /><em className="text-[#D65A2A]">Are Saying.</em></h2>
              <p className="mt-6 max-w-sm leading-relaxed text-white/75">Real stories and direct ratings from people building real speaking confidence with UnmuteX.</p>
              <div className="mt-10 border-l-2 border-[#D65A2A] pl-5 text-sm text-white/60">
                <p>No feedback submitted yet. Be the first to share your experience below!</p>
              </div>
            </div>
            <div className="border border-white/15 bg-[#1C1C1C] text-white p-7 md:p-10 rounded-xl shadow-lg">
              <h3 className="font-display text-3xl text-white">Share Your Experience</h3>
              <p className="mt-2 text-sm text-white/60">Help others overcome hesitation by sharing your UnmuteX journey.</p>
              {submitted ? (
                <div data-testid="status-feedback-success" className="mt-10 border border-[#D65A2A]/40 bg-[#D65A2A]/10 p-6 rounded-lg">
                  <Check className="text-[#D65A2A]" />
                  <p className="mt-4 font-display text-2xl text-white">Thank you for adding your voice.</p>
                  <p className="mt-2 text-sm text-white/70">Your experience has been captured locally for this demo.</p>
                  <button data-testid="button-feedback-again" className="mt-5 text-sm font-bold text-[#D65A2A] underline underline-offset-4" onClick={() => setSubmitted(false)}>Share another experience</button>
                </div>
              ) : (
                <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                  <label className="block">
                    <span className="text-xs font-bold uppercase tracking-[.12em] text-white/60">Your name</span>
                    <input data-testid="input-feedback-name" required name="name" className="mt-2 w-full border-0 border-b border-white/20 bg-transparent px-0 py-3 text-white outline-none transition-colors placeholder:text-white/35 focus:border-[#D65A2A]" placeholder="What should we call you?" />
                  </label>
                  <label className="block">
                    <span className="text-xs font-bold uppercase tracking-[.12em] text-white/60">Your experience</span>
                    <textarea data-testid="input-feedback-message" required name="message" rows={4} className="mt-2 w-full resize-none border-0 border-b border-white/20 bg-transparent px-0 py-3 text-white outline-none transition-colors placeholder:text-white/35 focus:border-[#D65A2A]" placeholder="What changed when you started speaking up?" /></label>
                  <button data-testid="button-feedback-submit" type="submit" className="rounded-full bg-[#D65A2A] px-6 py-3 font-bold text-[#FFFFFF] transition-all hover:bg-[#C74634] hover:-translate-y-1 shadow-sm hover:shadow">
                    Add your voice <ArrowRight className="ml-2 inline" size={15} />
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* Curved section transition: Feedback (Black) -> Brand Marquee (Cream) */}
        <div className="section-curve-divider bg-[#242424]">
          <svg viewBox="0 0 1440 48" fill="none" preserveAspectRatio="none">
            <path d="M0 0C480 32 960 32 1440 0V48H0Z" fill="#FAF8F4" />
          </svg>
        </div>

        {/* Standalone Full-Width Scrolling Brand Statement Marquee */}
        <section
          id="brand-statement"
          aria-label="Brand statement"
          className="brand-statement-section io-reveal relative w-full overflow-hidden bg-[#FAF8F4] py-14 sm:py-20 md:py-24 min-h-[25vh] md:min-h-[32vh] flex items-center border-b border-[#E0D7CB] select-none"
        >
          <div className="sr-only">Practice Out Loud. Every Single Time.</div>
          <div className="w-full overflow-hidden">
            <div className="brand-statement-marquee" aria-hidden="true">
              <div className="brand-statement-track">
                {[1, 2, 3, 4].map((i) => (
                  <span key={`bs-a-${i}`} className="inline-flex items-center gap-8 sm:gap-12 md:gap-16">
                    <span className="brand-statement-text">
                      Practice Out Loud. <em className="italic">Every Single Time.</em>
                    </span>
                    <span className="text-[#D65A2A]/40 text-[0.55em]">✦</span>
                  </span>
                ))}
              </div>
              <div className="brand-statement-track" aria-hidden="true">
                {[1, 2, 3, 4].map((i) => (
                  <span key={`bs-b-${i}`} className="inline-flex items-center gap-8 sm:gap-12 md:gap-16">
                    <span className="brand-statement-text">
                      Practice Out Loud. <em className="italic">Every Single Time.</em>
                    </span>
                    <span className="text-[#D65A2A]/40 text-[0.55em]">✦</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer ref={footerRef} className="bg-[#FAF8F4] io-reveal px-5 pb-10 pt-20">
        <div className="mx-auto max-w-[1240px]">
          {/* Big Two-Tone Display Headline Moment (FOD Style) */}
          <div className="pb-16 border-b border-[#E0D7CB]">
            <div className="flex items-center gap-2 text-lg font-bold tracking-[-.05em] text-foreground mb-6">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-primary text-primary-foreground"><Mic2 size={16} /></span>
              Unmute<span className="text-primary">X</span>
            </div>
            <h2 className="footer-huge-display font-display text-[#242424] max-w-4xl tracking-tight">
              Your <span className="footer-accent-word text-[#D65A2A] inline-block font-serif italic">voice</span> is already in there.
            </h2>
            <p className="mt-6 max-w-xl text-base text-muted-foreground leading-relaxed">
              Show up once. Stumble if you have to. Speak until it feels like breathing. Every Monday to Friday at 7 PM IST.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                data-testid="button-footer-main-cta"
                onClick={() => scrollTo('how-it-works')}
                className="rounded-full bg-[#D65A2A] px-7 py-3.5 font-bold text-[#FFFFFF] transition-all hover:bg-[#C74634] hover:-translate-y-1 shadow-sm hover:shadow"
              >
                Join Tonight’s Room <ArrowRight className="ml-2 inline" size={16} />
              </button>
              <button
                onClick={() => scrollTo('activities')}
                className="rounded-full border border-[#242424]/20 px-6 py-3.5 text-sm font-bold text-[#242424] transition-all hover:bg-white hover:-translate-y-0.5"
              >
                Explore Practice Formats
              </button>
            </div>
          </div>

          <div className="grid gap-10 py-12 md:grid-cols-[1.4fr_.6fr_.6fr] border-b border-[#E0D7CB]">
            <div>
              <p className="font-display text-2xl text-[#242424]">UnmuteX Community</p>
              <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                A live speaking-practice environment where judgment is left at the door and confidence is built one conversation at a time.
              </p>
            </div>
            <div>
              <p className="eyebrow">Explore</p>
              <div className="mt-5 space-y-3 text-sm font-semibold">
                <button data-testid="link-footer-practice" className="block text-foreground/80 hover:text-primary transition-colors" onClick={() => scrollTo('activities')}>Practice Formats</button>
                <button data-testid="link-footer-resources" className="block text-foreground/80 hover:text-primary transition-colors" onClick={() => scrollTo('resources')}>Resources & Toolkit</button>
                <button data-testid="link-footer-mentorship" className="block text-foreground/80 hover:text-primary transition-colors" onClick={() => scrollTo('mentorship')}>Mentorship</button>
                <button data-testid="link-footer-faq" className="block text-foreground/80 hover:text-primary transition-colors" onClick={() => scrollTo('faq')}>FAQ</button>
              </div>
            </div>
            <div>
              <p className="eyebrow">Stay close</p>
              <button data-testid="button-footer-join" onClick={() => scrollTo('how-it-works')} className="mt-5 link-arrow text-[#242424] hover:text-primary transition-colors">Join the community <ArrowRight size={15} /></button>
              <p className="mt-4 text-xs text-muted-foreground">Sessions run daily 7:00 PM – 8:00 PM IST</p>
            </div>
          </div>

          <div className="flex flex-col justify-between gap-3 pt-6 text-xs text-muted-foreground sm:flex-row">
            <span>UnmuteX | Break Hesitation, Build Confidence</span>
            <span>Made for the moment before you speak.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
