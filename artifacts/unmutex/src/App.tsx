import { type FormEvent, type ReactNode, useEffect, useRef, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { ArrowDown, ArrowRight, Check, ChevronLeft, ChevronRight, Menu, Mic2, Play, Quote, Sparkles, X } from 'lucide-react';
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

const queryClient = new QueryClient();

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeActivity, setActiveActivity] = useState(0);
  const [storyIndex, setStoryIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const revealRefs = useRef<(HTMLElement | null)[]>([]);
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('is-visible');
    }), { threshold: 0.12 });
    revealRefs.current.forEach((element) => element && observer.observe(element));
    return () => observer.disconnect();
  }, []);

  const addReveal = (element: HTMLElement | null) => {
    if (element && !revealRefs.current.includes(element)) revealRefs.current.push(element);
  };

  const activities = [
    ['Group Discussion', '4–8 speakers', 'Jump into a live group and work through a topic together, out loud.'],
    ['Debate', 'Two sides, one topic', 'Pick a stance, build your case, defend it against pushback.'],
    ['Extempore', '60s to prepare', 'One minute to think. Then you’re speaking, no notes.'],
    ['Devil’s Advocate', 'Argue the unpopular side', 'Take the position nobody wants to defend, on purpose, and make it hold.'],
    ['Solo, unscripted', 'One voice, no notes', 'Describe what you see and think out loud as it comes to you.'],
  ];
  const stories = ['Neha', 'Lavina', 'Saurav', 'Sanskriti', 'Gaurangi', 'Pushkar', 'Shanvi', 'Sonia', 'Dolly'];

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="site-shell bg-background">
      <header className="nav-blur fixed inset-x-0 top-0 z-40 border-b border-[hsl(var(--border)/.7)]">
        <div className="mx-auto flex max-w-[1240px] items-center justify-between px-5 py-4">
          <button data-testid="button-logo" onClick={() => scrollTo('top')} className="flex items-center gap-2 text-left" aria-label="Back to top">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-primary text-primary-foreground"><Mic2 size={16} /></span>
            <span className="text-lg font-bold tracking-[-.05em]">Unmute<span className="text-primary">X</span></span>
          </button>
          <nav className="hidden items-center gap-7 text-sm font-semibold md:flex" aria-label="Main navigation">
            {['Practice', 'Resources', 'Mentorship', 'Stories'].map((item) => (
              <button data-testid={`link-nav-${item.toLowerCase()}`} key={item} className="transition-colors hover:text-primary" onClick={() => scrollTo(item === 'Practice' ? 'activities' : item.toLowerCase())}>{item}</button>
            ))}
            <button data-testid="button-nav-join" onClick={() => scrollTo('how-it-works')} className="rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground transition-transform hover:-translate-y-0.5">Join the community <ArrowRight className="ml-1 inline" size={15} /></button>
          </nav>
          <button data-testid="button-mobile-menu" className="rounded-full border border-border p-2 md:hidden" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        {menuOpen && <nav className="border-t border-border px-5 pb-5 pt-3 md:hidden" aria-label="Mobile navigation">
          {['Practice', 'Resources', 'Mentorship', 'Stories'].map((item) => <button data-testid={`link-mobile-${item.toLowerCase()}`} key={item} className="block w-full border-b border-border py-3 text-left font-semibold" onClick={() => scrollTo(item === 'Practice' ? 'activities' : item.toLowerCase())}>{item}</button>)}
          <button data-testid="button-mobile-join" onClick={() => scrollTo('how-it-works')} className="mt-4 w-full rounded-full bg-primary px-5 py-3 text-center font-bold text-primary-foreground">Join the community</button>
        </nav>}
      </header>

      <main id="top">
        <section className="hero-grid overflow-hidden bg-[#f7f1e4] px-5 pb-10 pt-32 md:pt-40">
          <div className="mx-auto grid max-w-[1240px] items-center gap-10 lg:grid-cols-[1.05fr_.95fr]">
            <div className="relative z-10">
              <div ref={addReveal} className="reveal mb-7 flex items-center gap-3"><span className="eyebrow">Live practice community · Est. now</span><span className="h-px w-10 bg-primary" /></div>
              <h1 ref={addReveal} className="reveal reveal-delay-1 display-xl max-w-4xl font-display text-secondary">Unmute Your Voice. <em className="text-primary">Speak</em> Without Fear.</h1>
              <p ref={addReveal} className="reveal reveal-delay-2 mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground">A live practice community where professionals, students, and founders build confidence speaking in meetings, interviews, presentations, and everyday conversations.</p>
              <div ref={addReveal} className="reveal reveal-delay-3 mt-9 flex flex-wrap items-center gap-5">
                <button data-testid="button-hero-start" onClick={() => scrollTo('how-it-works')} className="group rounded-full bg-primary px-6 py-3.5 font-bold text-primary-foreground shadow-[4px_4px_0_hsl(var(--secondary))] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0_hsl(var(--secondary))]">Find your voice <ArrowRight className="ml-2 inline transition-transform group-hover:translate-x-1" size={17} /></button>
                <button data-testid="button-hero-watch" onClick={() => scrollTo('journey')} className="link-arrow text-secondary"><span className="grid h-9 w-9 place-items-center rounded-full border border-secondary"><Play size={13} fill="currentColor" /></span>See how it feels</button>
              </div>
              <div className="mt-14 flex items-center gap-5 text-sm text-muted-foreground"><div className="flex -space-x-2"><span className="grid h-8 w-8 place-items-center rounded-full border-2 border-[#f7f1e4] bg-secondary text-xs text-secondary-foreground">N</span><span className="grid h-8 w-8 place-items-center rounded-full border-2 border-[#f7f1e4] bg-primary text-xs text-primary-foreground">L</span><span className="grid h-8 w-8 place-items-center rounded-full border-2 border-[#f7f1e4] bg-accent text-xs">S</span></div><span>People practicing out loud, together.</span></div>
            </div>
            <div ref={addReveal} className="reveal reveal-delay-2 hero-art" aria-label="Abstract illustration of a voice becoming visible">
              <div className="hero-disc" />
              <div className="hero-orbit hero-orbit-a" />
              <div className="hero-orbit hero-orbit-b" />
              <div className="hero-orbit hero-orbit-c" />
              <div className="hero-line" />
              <div className="absolute right-[6%] top-[4%] z-10"><div className="stamp border-secondary text-secondary"><span>MAKE<br />ROOM<br /><b>FOR<br />YOUR<br />VOICE</b></span></div></div>
              <span className="hero-word">speak</span>
            </div>
          </div>
          <div className="mx-auto mt-12 max-w-[1240px]"><button data-testid="button-scroll-stats" onClick={() => scrollTo('proof')} className="flex items-center gap-3 text-xs font-bold uppercase tracking-[.17em] text-muted-foreground"><span className="grid h-9 w-9 place-items-center rounded-full border border-border"><ArrowDown size={15} /></span>Scroll to find your rhythm</button></div>
        </section>

        <section id="proof" className="bg-secondary text-secondary-foreground">
          <div className="stat-row mx-auto grid max-w-[1240px] grid-cols-2 lg:grid-cols-4">
            {[
              ['Active Members', 'A room that keeps growing'],
              ['7 PM', 'Daily Live Sessions'],
              ['Judgment Free', 'Come as you are'],
              ['Days To Real Change', 'Show up, speak up'],
            ].map(([title, caption], index) => <div key={title} className={`reveal p-6 py-9 md:p-9 ${index > 1 ? 'reveal-delay-2' : ''}`} ref={addReveal}><p className="font-display text-4xl text-accent md:text-5xl">{title}</p><p className="mt-2 text-sm text-secondary-foreground/65">{caption}</p></div>)}
          </div>
          <div className="ticker border-t border-secondary-foreground/15 py-4 text-sm font-medium"><div className="ticker-track"><span>Live sessions, Monday to Friday, 7 to 8 PM.</span><span>Live sessions, Monday to Friday, 7 to 8 PM.</span><span>Live sessions, Monday to Friday, 7 to 8 PM.</span><span>Live sessions, Monday to Friday, 7 to 8 PM.</span></div></div>
        </section>

        <section id="activities" className="section-pad bg-background">
          <div className="section-wrap">
            <div className="grid gap-8 lg:grid-cols-[.7fr_1.3fr]">
              <div><p ref={addReveal} className="reveal eyebrow">The practice room</p><h2 ref={addReveal} className="reveal reveal-delay-1 display-md mt-5 font-display text-secondary">Speak first.<br /><em className="text-primary">Polish later.</em></h2><p ref={addReveal} className="reveal reveal-delay-2 mt-6 max-w-sm leading-relaxed text-muted-foreground">Practice out loud with live activities, build your toolkit with resources, then get a mentor's eye on what to fix next.</p><button data-testid="button-activities-join" onClick={() => scrollTo('how-it-works')} className="link-arrow mt-8 text-secondary">Start practicing <ArrowRight size={17} /></button></div>
              <div className="grid gap-3 sm:grid-cols-2">
                {activities.map(([title, kicker, description], index) => <button data-testid={`button-activity-${index}`} key={title} onClick={() => setActiveActivity(index)} className={`activity-card border border-border p-6 text-left ${activeActivity === index ? 'active' : ''} ${index === 0 ? 'sm:col-span-2' : ''}`}><div className="flex items-start justify-between"><span className="eyebrow">{kicker}</span><span className="font-mono text-xs opacity-50">0{index + 1}</span></div><h3 className="mt-16 font-display text-3xl leading-none">{title}</h3><p className="mt-3 max-w-sm text-sm leading-relaxed opacity-70">{description}</p></button>)}
              </div>
            </div>
            <div ref={addReveal} className="reveal mt-12 flex flex-wrap items-center gap-3 border-t border-border pt-5 text-sm text-muted-foreground"><Sparkles size={16} className="text-primary" /><span>Plus role-plays, mock interviews and storytelling — new formats added every week.</span></div>
          </div>
        </section>

        <section id="resources" className="section-pad bg-[#e8dfcf]">
          <div className="section-wrap">
            <div className="flex flex-col justify-between gap-7 md:flex-row md:items-end"><div><p ref={addReveal} className="reveal eyebrow">Your speaking toolkit</p><h2 ref={addReveal} className="reveal reveal-delay-1 display-md mt-4 max-w-3xl font-display text-secondary">The right words.<br /><em className="text-primary">When you need them.</em></h2></div><p ref={addReveal} className="reveal reveal-delay-2 max-w-xs text-sm leading-relaxed text-muted-foreground">Resources you can reach for before, during, and after every conversation.</p></div>
            <div className="mt-16 grid gap-px overflow-hidden border border-secondary/20 bg-secondary/20 md:grid-cols-3">
              {[
                ['01', 'Communication Frameworks', 'Structure', 'Structures like PREP and STAR to organize your thoughts before you speak.'],
                ['02', 'Vocabulary', 'Word bank', 'Words and phrases to reach for on any topic, from idioms to topic-specific terms.'],
                ['03', 'Practical advice', 'A little less noise', 'How to build confidence, cut filler words, and pace yourself while speaking.'],
              ].map(([number, title, label, copy], index) => <article ref={addReveal} key={title} className={`reveal reveal-delay-${index + 1} bg-[#e8dfcf] p-7 md:p-10`}><span className="font-mono text-xs text-primary">{number}</span><div className="mt-16 flex items-center justify-between gap-4"><h3 className="font-display text-3xl leading-none text-secondary">{title}</h3><span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-secondary/30"><ArrowRight size={15} /></span></div><p className="mt-4 text-xs font-bold uppercase tracking-[.15em] text-primary">{label}</p><p className="mt-4 text-sm leading-relaxed text-muted-foreground">{copy}</p></article>)}
            </div>
          </div>
        </section>

        <section id="mentorship" className="section-pad bg-secondary text-secondary-foreground">
          <div className="section-wrap">
            <div className="grid gap-10 lg:grid-cols-[.75fr_1.25fr]"><div><p ref={addReveal} className="reveal eyebrow text-accent">An eye on your next move</p><h2 ref={addReveal} className="reveal reveal-delay-1 display-md mt-5 font-display">You don't have<br />to figure it out<br /><em className="text-accent">alone.</em></h2><p ref={addReveal} className="reveal reveal-delay-2 mt-7 max-w-sm leading-relaxed text-secondary-foreground/70">A mentor reviews how you spoke, where you got stuck, and exactly what to work on next.</p></div>
              <div className="grid gap-px bg-secondary-foreground/20 sm:grid-cols-2">{[
                ['Personalized Feedback', 'After every session', 'A mentor reviews how you spoke and tells you exactly what to work on next.'],
                ['Ongoing Support', 'Whenever you need it', 'Check in when you get stuck, not just during scheduled sessions.'],
                ['1-on-1 Sessions', 'By appointment', 'Book dedicated time with a mentor to work through something specific.'],
                ['Goal Tracking', 'Over weeks', 'See how your speaking has changed over time, not just after one session.'],
              ].map(([title, label, copy], index) => <article ref={addReveal} key={title} className={`reveal reveal-delay-${index % 3 + 1} bg-secondary p-7`}><span className="grid h-9 w-9 place-items-center rounded-full border border-accent/50 text-accent"><Check size={16} /></span><h3 className="mt-10 font-display text-2xl">{title}</h3><p className="mt-2 text-xs font-bold uppercase tracking-[.13em] text-accent">{label}</p><p className="mt-4 text-sm leading-relaxed text-secondary-foreground/65">{copy}</p></article>)}</div>
            </div>
            <div ref={addReveal} className="reveal mt-14 flex flex-col items-start justify-between gap-6 border-t border-secondary-foreground/20 pt-6 sm:flex-row sm:items-center"><p className="font-display text-2xl">Tonight's Group Discussion: <em className="text-accent">Work-Life Balance, starting at 7 PM</em></p><button data-testid="button-live-prompt" onClick={() => scrollTo('how-it-works')} className="shrink-0 rounded-full bg-accent px-5 py-3 text-sm font-bold text-accent-foreground transition-transform hover:-translate-y-1">Join the room <ArrowRight className="ml-2 inline" size={15} /></button></div>
          </div>
        </section>

        <section id="stories" className="section-pad bg-background">
          <div className="section-wrap">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end"><div><p ref={addReveal} className="reveal eyebrow">A little proof goes a long way</p><h2 ref={addReveal} className="reveal reveal-delay-1 display-md mt-4 font-display text-secondary">Real People.<br /><em className="text-primary">Real Confidence.</em></h2></div><p ref={addReveal} className="reveal reveal-delay-2 max-w-sm leading-relaxed text-muted-foreground">Watch how our members transformed from hesitant speakers into highly confident, articulate communicators.</p></div>
            <div className="mt-14 grid items-stretch gap-6 lg:grid-cols-[.85fr_1.15fr]"><div className="portrait flex items-end p-8 text-primary-foreground"><div className="relative z-10"><span className="eyebrow text-accent">Member story</span><p className="mt-3 font-display text-5xl">{stories[storyIndex]}</p><p className="mt-2 max-w-xs text-sm text-primary-foreground/70">Real People. Real Confidence.</p></div><div className="absolute right-7 top-7 font-mono text-xs text-primary-foreground/60">{String(storyIndex + 1).padStart(2, '0')} / {String(stories.length).padStart(2, '0')}</div></div>
              <div className="flex flex-col justify-between border border-border p-7 md:p-12"><Quote className="text-primary" size={35} fill="currentColor" /><p data-testid="text-story-quote" className="mt-10 max-w-xl font-display text-4xl leading-[.98] text-secondary md:text-5xl">Watch how our members transformed from hesitant speakers into highly confident, articulate communicators.</p><div className="mt-12 flex items-center justify-between border-t border-border pt-5"><span className="text-sm font-semibold text-muted-foreground">Member: {stories[storyIndex]}</span><div className="flex gap-2"><button data-testid="button-story-previous" onClick={() => setStoryIndex((storyIndex - 1 + stories.length) % stories.length)} className="grid h-10 w-10 place-items-center rounded-full border border-border transition-colors hover:bg-muted" aria-label="Previous story"><ChevronLeft size={18} /></button><button data-testid="button-story-next" onClick={() => setStoryIndex((storyIndex + 1) % stories.length)} className="grid h-10 w-10 place-items-center rounded-full border border-border transition-colors hover:bg-muted" aria-label="Next story"><ChevronRight size={18} /></button></div></div></div>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">{stories.map((name, index) => <button data-testid={`button-story-dot-${index}`} key={name} onClick={() => setStoryIndex(index)} aria-label={`Read story from ${name}`} className={`h-1.5 rounded-full transition-all ${index === storyIndex ? 'w-10 bg-primary' : 'w-3 bg-border'}`} />)}</div>
          </div>
        </section>

        <section id="founders" className="section-pad bg-[#e8dfcf]">
          <div className="section-wrap"><div className="grid gap-10 lg:grid-cols-[.7fr_1.3fr]"><div><p ref={addReveal} className="reveal eyebrow">The humans behind the room</p><h2 ref={addReveal} className="reveal reveal-delay-1 display-md mt-4 font-display text-secondary">Meet The<br /><em className="text-primary">Founders.</em></h2><p ref={addReveal} className="reveal reveal-delay-2 mt-6 max-w-sm leading-relaxed text-muted-foreground">Two minds. One mission. Building a community where every voice finds its confidence.</p></div><div className="grid gap-5 md:grid-cols-2">{[
            ['Shashwat Sharma', 'Founder & Lead Facilitator', 'SOIT, RGPV University', 'Speak to express, not to impress.', `There was a time when I knew exactly what I wanted to say, but couldn't express it confidently. Like many students, I struggled with hesitation, overthinking, and the fear of being judged. Even when I had ideas, I often stayed silent because I wasn't confident enough to speak up. Everything started changing when I stopped waiting to become perfect and simply started practicing. One conversation, one discussion, one opportunity at a time. Over time, I realized that confidence isn't something you're born with — it's something you build through consistency. That's why I started UnmuteX — a place where people can speak freely, participate in meaningful activities, overcome hesitation, and grow into confident communicators together.`],
            ['Yash', 'Co-Founder & Coach', 'IIIT Bhubaneswar', 'Structure your thoughts, command the room.', `Great ideas are buried every day simply because someone lacked the guts to speak up. I’ve seen it happen, and I’ve hustled hard enough to ensure it never happens to me. Building UnmuteX wasn’t just a startup idea; it was a necessity. Combining a tech-driven mindset with the fire of a debater, my goal as Co-Founder is clear: We don’t just teach you how to talk. We train you to claim your space. Stop surviving the conversation. Start commanding it.`],
          ].map(([name, role, school, tagline, story], index) => <article ref={addReveal} key={name} className={`reveal reveal-delay-${index + 1} overflow-hidden border border-secondary/20 bg-[#f7f1e4]`}><div className="founder-portrait portrait"><span className="absolute bottom-5 left-6 z-10 font-display text-6xl text-primary-foreground">{name[0]}</span><span className="absolute right-5 top-5 z-10 font-mono text-xs text-primary-foreground/60">0{index + 1}</span></div><div className="p-6"><h3 className="font-display text-3xl text-secondary">{name}</h3><p className="mt-1 text-xs font-bold uppercase tracking-[.12em] text-primary">{role}</p><p className="mt-1 text-xs text-muted-foreground">{school}</p><p className="mt-5 border-l-2 border-primary pl-3 font-display text-xl text-secondary">“{tagline}”</p><details className="group mt-6 border-t border-border pt-4"><summary className="cursor-pointer list-none text-sm font-bold">Read {name.split(' ')[0]}’s story <ArrowRight className="ml-2 inline transition-transform group-open:rotate-90" size={14} /></summary><p className="mt-4 text-sm leading-relaxed text-muted-foreground">{story}</p></details></div></article>)}</div></div></div>
        </section>

        <section className="section-pad bg-background">
          <div className="section-wrap"><div className="grid gap-8 lg:grid-cols-[1.1fr_.9fr]"><div><p ref={addReveal} className="reveal eyebrow">Voices that GREW WITH UNMUTEX</p><h2 ref={addReveal} className="reveal reveal-delay-1 display-md mt-4 font-display text-secondary">The room changes<br />when <em className="text-primary">you do.</em></h2><p ref={addReveal} className="reveal reveal-delay-2 mt-6 max-w-lg leading-relaxed text-muted-foreground">Meet members who stayed consistent, embraced every challenge, and transformed their communication skills through practice and persistence.</p></div><div className="grid gap-3 sm:grid-cols-3 lg:mt-12">{[['Nikhil Kumar', 'Head of Product & Tech', 'Code that empowers community voices.'], ['Akriti', 'Creative & Brand Lead', 'Good design makes hard skills approachable.'], ['Chhavi', 'Mentorship Coordinator', 'Constructive feedback heals stage anxiety.']].map(([name, role, line], index) => <div ref={addReveal} key={name} className={`reveal reveal-delay-${index + 1} border border-border p-5`}><span className="grid h-11 w-11 place-items-center rounded-full bg-accent font-display text-xl text-secondary">{name[0]}</span><p className="mt-8 font-display text-2xl text-secondary">{name}</p><p className="mt-1 text-[.65rem] font-bold uppercase tracking-[.1em] text-primary">{role}</p><p className="mt-5 text-sm leading-relaxed text-muted-foreground">“{line}”</p></div>)}</div></div><div className="mt-10 grid gap-5 border-t border-border pt-8 lg:grid-cols-3">{[
            ['Nikhil Kumar', 'Joining UnmuteX has genuinely helped me grow as a communicator. Over time, I\'ve noticed a big improvement in my confidence, articulation, and the way I express my thoughts. Earlier, I used to hesitate while speaking, but this community gave me a comfortable space to practice and improve consistently.'],
            ['Akriti', 'Hello, I am Akriti. Being a part of the UnmuteX community has greatly improved my confidence and speaking skills. The environment here is so friendly and encouraging that I never felt judged while expressing my thoughts and opinions.'],
            ['Chhavi', 'UnmuteX has helped me improve my communication skills, self confidence and structuring my thoughts properly. The community sessions are amazing, people are really considerate and supportive.'],
          ].map(([name, copy], index) => <blockquote ref={addReveal} key={name} className={`reveal reveal-delay-${index + 1} border-l border-primary pl-5`}><p className="text-sm leading-relaxed text-muted-foreground">“{copy}”</p><footer className="mt-4 text-xs font-bold uppercase tracking-[.12em] text-secondary">{name}</footer></blockquote>)}</div></div>
        </section>

        <section id="how-it-works" className="section-pad bg-primary text-primary-foreground">
          <div className="section-wrap"><div className="flex flex-col justify-between gap-7 md:flex-row md:items-end"><div><p ref={addReveal} className="reveal eyebrow text-primary-foreground/70">No gatekeeping, just a first step</p><h2 ref={addReveal} className="reveal reveal-delay-1 display-md mt-4 max-w-2xl font-display">Your path to<br /><em>confident speaking.</em></h2></div><p ref={addReveal} className="reveal reveal-delay-2 max-w-xs text-sm leading-relaxed text-primary-foreground/70">Come in curious. Leave with something you can feel.</p></div><div className="mt-20"><div className="timeline-line bg-primary-foreground/30" /><div className="grid gap-10 md:grid-cols-4">{[
            ['01', 'Join the Community', 'Join a supportive community focused on improving public speaking and confidence.'],
            ['02', 'Record & Send Video', 'Share a short introduction video to help us understand your speaking level.'],
            ['03', 'Get Batched & Grouped', 'Get matched with 4 peers at a similar speaking level for focused practice.'],
            ['04', 'Your Journey Starts', 'Practice in live sessions, receive feedback, and build lasting confidence.'],
          ].map(([number, title, copy], index) => <article ref={addReveal} key={number} className={`reveal reveal-delay-${index % 3 + 1} -mt-5`}><span className="step-number bg-primary text-primary-foreground">{number}</span><h3 className="mt-7 font-display text-2xl">{title}</h3><p className="mt-3 text-sm leading-relaxed text-primary-foreground/70">{copy}</p></article>)}</div></div></div>
        </section>

        <section id="journey" className="section-pad bg-secondary text-secondary-foreground">
          <div className="section-wrap grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center"><div><p ref={addReveal} className="reveal eyebrow text-accent">Our Journey So Far...</p><h2 ref={addReveal} className="reveal reveal-delay-1 display-md mt-5 font-display">A room full of<br /><em className="text-accent">becoming.</em></h2><p ref={addReveal} className="reveal reveal-delay-2 mt-7 max-w-lg leading-relaxed text-secondary-foreground/70">These are the glimpses of our meeting, where our community grows together through daily group discussions, improving speaking skills, confidence, ideas, and meaningful connections.</p><button data-testid="button-journey-join" onClick={() => scrollTo('how-it-works')} className="link-arrow mt-9 text-accent">Be part of the next glimpse <ArrowRight size={17} /></button></div><div ref={addReveal} className="reveal reveal-delay-2 journey-art"><div className="absolute left-10 top-10 z-10 font-mono text-xs text-secondary-foreground/60">FIELD NOTE / 001</div><div className="absolute bottom-9 right-8 z-10 max-w-[13rem] text-right font-display text-4xl leading-[.9] text-accent">Every day,<br />a little<br />less muted.</div><div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2"><div className="grid h-28 w-28 place-items-center rounded-full border border-accent/60"><Mic2 className="text-accent" size={35} /></div></div></div></div>
        </section>

        <section id="feedback" className="section-pad bg-[#e8dfcf]">
          <div className="section-wrap grid gap-12 lg:grid-cols-[.9fr_1.1fr]"><div><p ref={addReveal} className="reveal eyebrow">A note from the room</p><h2 ref={addReveal} className="reveal reveal-delay-1 display-md mt-4 font-display text-secondary">What Members<br /><em className="text-primary">Are Saying.</em></h2><p ref={addReveal} className="reveal reveal-delay-2 mt-6 max-w-sm leading-relaxed text-muted-foreground">Real stories and direct ratings from people building real speaking confidence with UnmuteX.</p><div className="mt-10 border-l-2 border-primary pl-5 text-sm text-muted-foreground"><p>No feedback submitted yet. Be the first to share your experience below!</p></div></div><div className="border border-secondary/20 bg-[#f7f1e4] p-7 md:p-10"><h3 className="font-display text-3xl text-secondary">Share Your Experience</h3><p className="mt-2 text-sm text-muted-foreground">Help others overcome hesitation by sharing your UnmuteX journey.</p>{submitted ? <div data-testid="status-feedback-success" className="mt-10 border border-primary/40 bg-primary/10 p-6"><Check className="text-primary" /><p className="mt-4 font-display text-2xl text-secondary">Thank you for adding your voice.</p><p className="mt-2 text-sm text-muted-foreground">Your experience has been captured locally for this demo.</p><button data-testid="button-feedback-again" className="mt-5 text-sm font-bold text-primary underline underline-offset-4" onClick={() => setSubmitted(false)}>Share another experience</button></div> : <form className="mt-8 space-y-5" onSubmit={handleSubmit}><label className="block"><span className="text-xs font-bold uppercase tracking-[.12em] text-muted-foreground">Your name</span><input data-testid="input-feedback-name" required name="name" className="mt-2 w-full border-0 border-b border-border bg-transparent px-0 py-3 outline-none transition-colors focus:border-primary" placeholder="What should we call you?" /></label><label className="block"><span className="text-xs font-bold uppercase tracking-[.12em] text-muted-foreground">Your experience</span><textarea data-testid="input-feedback-message" required name="message" rows={4} className="mt-2 w-full resize-none border-0 border-b border-border bg-transparent px-0 py-3 outline-none transition-colors focus:border-primary" placeholder="What changed when you started speaking up?" /></label><button data-testid="button-feedback-submit" type="submit" className="rounded-full bg-primary px-6 py-3 font-bold text-primary-foreground transition-transform hover:-translate-y-1">Add your voice <ArrowRight className="ml-2 inline" size={15} /></button></form>}</div></div>
        </section>
      </main>

      <footer className="bg-[#f7f1e4] px-5 pb-8 pt-16">
        <div className="mx-auto max-w-[1240px]"><div className="grid gap-10 border-b border-border pb-12 md:grid-cols-[1.4fr_.6fr_.6fr]"><div><div className="flex items-center gap-2 text-lg font-bold tracking-[-.05em]"><span className="grid h-8 w-8 place-items-center rounded-full bg-primary text-primary-foreground"><Mic2 size={16} /></span>Unmute<span className="text-primary">X</span></div><p className="mt-5 max-w-sm font-display text-3xl leading-none text-secondary">Your voice is already in there.</p></div><div><p className="eyebrow">Explore</p><div className="mt-5 space-y-3 text-sm font-semibold"><button data-testid="link-footer-practice" className="block" onClick={() => scrollTo('activities')}>Practice</button><button data-testid="link-footer-resources" className="block" onClick={() => scrollTo('resources')}>Resources</button><button data-testid="link-footer-mentorship" className="block" onClick={() => scrollTo('mentorship')}>Mentorship</button></div></div><div><p className="eyebrow">Stay close</p><button data-testid="button-footer-join" onClick={() => scrollTo('how-it-works')} className="mt-5 link-arrow text-secondary">Join the community <ArrowRight size={15} /></button></div></div><div className="flex flex-col justify-between gap-3 pt-6 text-xs text-muted-foreground sm:flex-row"><span>UnmuteX | Break Hesitation, Build Confidence</span><span>Made for the moment before you speak.</span></div></div>
      </footer>
    </div>
  );
}

function Router() {
  return (
    // Keep a shared shell (sidebar, navbar) outside the boundary so it
    // survives a page crash.
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
