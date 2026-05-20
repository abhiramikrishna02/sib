import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  GraduationCap, BookOpen, School, Library, Globe, Clock, Briefcase,
  Calendar, MessageCircle, UserCheck,
  Sparkles, ArrowUpRight,
} from 'lucide-react'
import CircularGallery from '../Components/CircularGallery'
import FlowArt, { FlowSection } from '../Components/StoryScroll'
import FallingText from '../Components/FallingText'
import { CanvasRevealEffect } from '../Components/CanvasRevealEffect'
import graduateVideo from '../assets/graduate.mp4'

gsap.registerPlugin(ScrollTrigger)
ScrollTrigger.config({ ignoreMobileResize: true, autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load' })

const HomeGridOverlay = ({ opacity = 'opacity-[0.14]' }) => (
  <div
    aria-hidden="true"
    className={`pointer-events-none absolute inset-0 z-0 ${opacity}`}
    style={{
      backgroundImage: 'linear-gradient(rgba(255,255,255,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.18) 1px, transparent 1px)',
      backgroundSize: '72px 72px',
      maskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)',
      WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)',
    }}
  />
)

function HeroSection() {
  const videoRef = useRef(null)

  useEffect(() => {
    if (!videoRef.current) return
    videoRef.current.playbackRate = 0.65
  }, [])

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-black text-white">
      <video
        ref={videoRef}
        className="absolute inset-0 z-0 h-full w-full object-cover"
        style={{ transform: 'scale(1.15)' }}
        src="/hero.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />
      <div className="absolute inset-0 z-10 bg-black/30" />
      <div className="relative z-20 flex min-h-screen items-center justify-center px-6 py-24 text-center">
        <h1 className="text-[clamp(3.2rem,10vw,9rem)] font-black uppercase leading-[0.9] tracking-tighter">
          Study in Bengaluru
        </h1>
      </div>
    </section>
  )
}

/* ==========================================================================
   Section: Opportunities (Circular Card Gallery)
   ========================================================================== */

const cardData = [
  { title: 'Universities', subtitle: 'GLOBAL ACCESS', icon: GraduationCap, code: 'UN', accent: '#8b5cf6', accentSoft: 'rgba(139, 92, 246, 0.32)', note: 'Compare top institutions and start with clearer admissions guidance.', path: '/services#universities' },
  { title: 'Colleges', subtitle: 'CITY NETWORK', icon: School, code: 'CL', accent: '#22d3ee', accentSoft: 'rgba(34, 211, 238, 0.26)', note: 'Find trusted colleges across Bengaluru with practical support.', path: '/services#colleges' },
  { title: 'Courses', subtitle: 'FUTURE TRACKS', icon: BookOpen, code: 'CR', accent: '#34d399', accentSoft: 'rgba(52, 211, 153, 0.24)', note: 'Match your goals with programs that fit your next move.', path: '/services#courses' },
  { title: 'Online Courses', subtitle: 'REMOTE READY', icon: Globe, code: 'OC', accent: '#fb7185', accentSoft: 'rgba(251, 113, 133, 0.25)', note: 'Add flexible learning paths alongside your academic plan.' },
  { title: 'Short-term Programs', subtitle: 'FAST SKILLS', icon: Clock, code: 'SP', accent: '#60a5fa', accentSoft: 'rgba(96, 165, 250, 0.24)', note: 'Build employable skills through focused, practical programs.' },
  { title: 'Part-time Jobs', subtitle: 'WORK ACCESS', icon: Briefcase, code: 'PJ', accent: '#c084fc', accentSoft: 'rgba(192, 132, 252, 0.28)', note: 'Discover student-friendly work options around your schedule.' },
  { title: 'Accommodation', subtitle: 'NEAR ME', icon: Library, code: 'AC', accent: '#f59e0b', accentSoft: 'rgba(245, 158, 11, 0.26)', note: 'Explore convenient stays close to your campus and city life.' },
  { title: 'Events', subtitle: 'CAMPUS LIFE', icon: Calendar, code: 'EV', accent: '#2dd4bf', accentSoft: 'rgba(45, 212, 191, 0.24)', note: 'Stay close to student events, meetups, and opportunity days.' },
  { title: '1-on-1 Counselling', subtitle: 'FREE SESSION', icon: MessageCircle, code: '1:1', accent: '#38bdf8', accentSoft: 'rgba(56, 189, 248, 0.25)', note: 'Talk through choices with personal guidance before you apply.' },
  { title: 'Internships', subtitle: 'CAREER SIGNAL', icon: UserCheck, code: 'IN', accent: '#e879f9', accentSoft: 'rgba(232, 121, 249, 0.26)', note: 'Connect academic decisions with early career experience.' },
]

function Opportunities({ onNavigate }) {
  const containerRef = useRef(null)
  const galleryRef = useRef(null)
  const galleryItems = useMemo(() => cardData.map((item) => ({
    text: item.title,
    subtitle: item.subtitle,
    note: item.note,
    code: item.code,
    accent: item.accent,
    accentSoft: item.accentSoft,
    path: item.path,
  })), [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: () => `+=${Math.max(window.innerHeight * 2.4, galleryItems.length * 260)}`,
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          galleryRef.current?.setScrollProgress(self.progress)
        },
        onLeaveBack: () => {
          galleryRef.current?.setScrollProgress(0)
        },
      })
      gsap.fromTo('.opportunity-heading', { opacity: 0, y: 34, filter: 'blur(12px)' }, {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 76%',
          toggleActions: 'play none none reverse'
        }
      })
      gsap.fromTo('.opportunity-gallery-shell', { opacity: 0, scale: 0.94, y: 42 }, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 1,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 62%',
          toggleActions: 'play none none reverse'
        }
      })
    }, containerRef)
    return () => ctx.revert()
  }, [])

  const handleSelect = (item) => {
    if (item.path) onNavigate?.(item.path)
  }

  return (
    <div 
      ref={containerRef} 
      className="relative flex min-h-[100svh] w-full items-center overflow-hidden border-y border-white/6 bg-[#0f0816] py-10 sm:py-12 lg:py-14"
      style={{ 
        background: 'radial-gradient(circle at 14% 20%, rgba(34, 211, 238, 0.13) 0%, transparent 26%), radial-gradient(circle at 84% 18%, rgba(232, 121, 249, 0.14) 0%, transparent 28%), radial-gradient(circle at 50% 100%, rgba(245, 158, 11, 0.08) 0%, transparent 34%), linear-gradient(180deg, #08040f 0%, #14091d 48%, #0c0614 100%)' 
      }}
    >
      <HomeGridOverlay opacity="opacity-[0.16]" />
      <div className="absolute left-1/2 top-1/2 z-0 h-[620px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/10 blur-[120px]" />
      <div className="relative z-10 mx-auto w-full max-w-[1620px] px-4 sm:px-6 lg:px-8">
        <div className="opportunity-heading mb-4 flex flex-col items-center justify-between gap-5 md:mb-0 md:flex-row md:items-end">
          <div className="text-center md:text-left">
            <h2 className="text-[clamp(2.4rem,4.6vw,4.7rem)] font-black uppercase leading-none tracking-tight text-white">
              <span className="bg-gradient-to-r from-white via-violet-100 to-cyan-200 bg-clip-text text-transparent drop-shadow-[0_0_32px_rgba(168,85,247,0.28)]">Our</span>{' '}
              <span className="relative inline-block text-violet-200">
                Ecosystem
                <span className="absolute -bottom-2 left-0 h-1 w-full rounded-full bg-gradient-to-r from-violet-400 via-cyan-300 to-transparent shadow-[0_0_20px_rgba(34,211,238,0.45)]" />
              </span>
            </h2>
            <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.46em] text-violet-200/58">Drag the arc. Tap a card to open.</p>
          </div>
          <div className="hidden h-px flex-grow bg-gradient-to-r from-violet-400/50 via-cyan-300/30 to-transparent md:block" />
        </div>

        <div className="opportunity-gallery-shell relative mx-auto h-[clamp(430px,58svh,620px)] w-full">
          <CircularGallery
            ref={galleryRef}
            items={galleryItems}
            bend={2.8}
            borderRadius={0.07}
            scrollSpeed={2.2}
            scrollEase={0.045}
            onSelect={handleSelect}
          />
          <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#090411] to-transparent sm:w-40" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#090411] to-transparent sm:w-40" />
        </div>

        <div className="-mt-2 flex items-center justify-center gap-4 opacity-25 sm:-mt-4">
            <div className="h-px w-12 bg-white" />
            <span className="text-[9px] font-bold uppercase tracking-[1em]">Opportunities 2026</span>
            <div className="h-px w-12 bg-white" />
        </div>
      </div>
    </div>
  )
}
const stats = [
  { value: 100, suffix: '+', label: 'Partner Colleges' },
  { value: 1000, suffix: '+', label: 'Students Enrolled' },
  { value: 95, suffix: '%', label: 'Admission Success' },
  { value: 50, suffix: '+', label: 'Franchises' },
  { value: 24, suffix: '/7', label: 'Student Support' },
]

function ImpactNumbersSection() {
  const loopStats = [...stats, ...stats]

  return (
    <section className="relative overflow-hidden border-y border-white/8 bg-[#090909] px-0 py-14 text-white sm:py-16 lg:py-20">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_42%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/18 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/18 to-transparent" />
      <div className="relative mx-auto w-full overflow-hidden py-8 sm:py-10">
        <div className="impact-stat-loop flex w-max items-center gap-14 px-8 sm:gap-22 sm:px-12 lg:gap-28">
          {loopStats.map((stat, index) => (
            <div
              key={`${stat.label}-${index}`}
              className="impact-stat-item min-w-[12rem] text-center sm:min-w-[15rem] lg:min-w-[18rem]"
              style={{ '--curve-y': `${Math.sin(index * 0.9) * 22}px`, '--curve-rotate': `${Math.sin(index * 0.9) * -2.2}deg` }}
            >
              <div className="text-[clamp(2.8rem,5.4vw,5.2rem)] font-bold leading-none tracking-[-0.045em] text-white">
                {stat.value}{stat.suffix}
              </div>
              <h3 className="mt-4 text-[clamp(0.86rem,1.25vw,1.2rem)] font-semibold uppercase leading-tight tracking-[0.12em] text-white/58">
                {stat.label}
              </h3>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        .impact-stat-loop {
          animation: impactStatLoop 28s linear infinite;
        }

        .impact-stat-loop:hover {
          animation-play-state: paused;
        }

        .impact-stat-item {
          transform: translateY(var(--curve-y)) rotate(var(--curve-rotate));
        }

        @keyframes impactStatLoop {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  )
}

function VisionVideoSection() {
  const outerRef = useRef(null)
  const videoFrameRef = useRef(null)
  const videoRef = useRef(null)
  const textContentRef = useRef(null)
  const headerRef = useRef(null)
  const overlayRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: outerRef.current, start: 'top top', end: '+=300%', scrub: 1, pin: true, anticipatePin: 1, invalidateOnRefresh: true } })
      tl.to(headerRef.current, { opacity: 0, scale: 0.8, filter: 'blur(20px)', y: -100, duration: 1 }, 0)
        .to(videoFrameRef.current, { scale: 1, width: '100vw', height: '100vh', maxWidth: '100%', maxHeight: '100%', borderRadius: '0px', ease: 'power2.inOut', duration: 2 }, 0.2)
        .to(videoRef.current, { scale: 1.4, duration: 3, ease: 'none' }, 0.2)
        .to(overlayRef.current, { backgroundColor: 'rgba(0,0,0,0.6)', duration: 1 }, 1)
        .fromTo(textContentRef.current, { y: 100, opacity: 0, scale: 0.9, filter: 'blur(15px)' }, { y: 0, opacity: 1, scale: 1, filter: 'blur(0px)', duration: 1.5, ease: 'expo.out' }, 1.5)
    }, outerRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={outerRef} className="relative min-h-[100svh] h-screen w-full overflow-hidden border-y border-white/10 bg-black">
      <div className="pointer-events-none absolute inset-0 z-0">
        <CanvasRevealEffect
          containerClassName="bg-black"
          colors={[
            [255, 255, 255],
            [168, 85, 247],
            [34, 211, 238],
          ]}
          dotSize={5}
          opacities={[0.14, 0.16, 0.2, 0.24, 0.3, 0.38, 0.48, 0.6, 0.74, 0.9]}
          showGradient={false}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.06)_0%,rgba(0,0,0,0.34)_64%,rgba(0,0,0,0.82)_100%)]" />
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/85 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/85 to-transparent" />
      </div>
      <div ref={headerRef} className="absolute inset-0 z-20 flex flex-col items-center justify-center px-4 text-center">
        <div className="mb-4 flex items-center gap-2 text-violet-500">
          <Sparkles size={16} className="animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.8em]">The Vision</span>
        </div>
      </div>
      <div className="flex h-full w-full items-center justify-center px-3 sm:px-4">
        <div ref={videoFrameRef} className="relative h-[50vh] w-[92vw] max-w-[420px] overflow-hidden rounded-[2rem] border border-white/10 shadow-[0_0_100px_rgba(168,85,247,0.2)] sm:w-[85vw] md:h-[300px] md:w-[500px] md:max-w-none">
          <video ref={videoRef} src={graduateVideo} autoPlay muted loop playsInline className="h-full w-full object-cover" />
          <div ref={overlayRef} className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80" />
          <div ref={textContentRef} className="absolute inset-0 z-30 flex items-center justify-center p-4 sm:p-6 md:p-12">
            <div className="w-full max-w-4xl px-2 text-center text-white">
              <p className="mx-auto mb-5 inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[9px] font-black uppercase tracking-[0.45em] text-white/70 backdrop-blur-md shadow-[0_0_30px_rgba(168,85,247,0.14)]">Our Vision</p>
              <p className="mx-auto max-w-3xl text-[0.98rem] font-semibold leading-relaxed text-white drop-shadow-[0_4px_18px_rgba(0,0,0,0.65)] sm:text-[1.06rem] md:text-[1.38rem] md:leading-[1.85]" style={{ textShadow: '0 3px 14px rgba(0,0,0,0.68), 0 0 28px rgba(213, 161, 255, 0.16)' }}>
                <span className="font-black text-white">StudyInBengaluru.com</span> is Bengaluru&apos;s premier admissions platform, connecting ambitious students with <span className="text-violet-300">trusted institutions</span>, future-ready courses, and meaningful opportunities. We&apos;re shaping the city into a leading education destination while strengthening credibility, partnerships, and student engagement across India and beyond.
              </p>
              <p className="mx-auto mt-6 max-w-2xl rounded-2xl border border-fuchsia-400/15 bg-black/20 px-4 py-3 text-[0.88rem] leading-relaxed text-[#ffd8e6] shadow-[0_0_40px_rgba(214,90,138,0.12)] sm:mt-8 sm:text-[0.98rem] md:text-[1.18rem]" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.62), 0 0 20px rgba(214, 90, 138, 0.2)' }}>
                &quot;Education opens the door. StudyInBengaluru helps you walk through it with confidence.&quot;
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute -bottom-20 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-violet-600/10 blur-[120px]" />
    </section>
  )
}

function VisionMissionSection() {
  return (
    <FlowArt aria-label="Vision and Mission story scroll" className="relative border-y border-white/6 bg-[#100718]">
      <FlowSection
        aria-label="Our Vision"
        className="text-white"
        style={{
          background:
            'radial-gradient(circle at 18% 18%, rgba(56, 189, 248, 0.18), transparent 30%), radial-gradient(circle at 82% 78%, rgba(168, 85, 247, 0.18), transparent 34%), linear-gradient(135deg, #071421 0%, #17244c 44%, #24113a 100%)',
        }}
      >
        <HomeGridOverlay opacity="opacity-[0.16]" />
        <div className="relative z-10">
          <p className="text-xs font-black uppercase tracking-[0.32em] text-cyan-100/80">01 - Our Vision</p>
          <hr className="my-[2vw] border-none border-t border-white/45" />
          <h2 className="text-[clamp(4rem,13vw,13rem)] font-black uppercase leading-[0.82] tracking-tight text-white">
            Our
            <br />
            Vision
          </h2>
        </div>
        <div className="relative z-10 mt-auto">
          <hr className="my-[2vw] border-none border-t border-white/45" />
          <p className="max-w-[58ch] text-[clamp(1rem,2.2vw,1.85rem)] font-medium leading-relaxed text-white/82">
            To transform Bengaluru into Asia&apos;s premier educational destination by revolutionizing admission processes, offering unparalleled career guidance, and fostering collaborative partnerships with top-tier institutions and industry leaders.
          </p>
          <hr className="my-[2vw] border-none border-t border-white/35" />
          <div className="flex items-center gap-4 text-xs font-black uppercase tracking-[0.34em] text-cyan-200">
            <span>View Roadmap</span>
            <ArrowUpRight size={18} />
          </div>
        </div>
      </FlowSection>

      <FlowSection
        aria-label="Our Mission"
        className="text-white"
        style={{
          background:
            'radial-gradient(circle at 24% 24%, rgba(251, 146, 60, 0.16), transparent 28%), radial-gradient(circle at 78% 28%, rgba(232, 121, 249, 0.2), transparent 32%), linear-gradient(135deg, #1b0913 0%, #261027 46%, #0d0714 100%)',
        }}
      >
        <HomeGridOverlay opacity="opacity-[0.14]" />
        <div className="relative z-10">
          <p className="text-xs font-black uppercase tracking-[0.32em] text-orange-100/80">02 - Our Mission</p>
          <hr className="my-[2vw] border-none border-t border-white/45" />
          <h2 className="text-[clamp(4rem,13vw,13rem)] font-black uppercase leading-[0.82] tracking-tight text-white">
            Our
            <br />
            Mission
          </h2>
        </div>
        <div className="relative z-10">
          <hr className="my-[2vw] border-none border-t border-white/45" />
          <p className="max-w-[58ch] text-[clamp(1rem,2.2vw,1.85rem)] font-medium leading-relaxed text-white/82">
            To attract and empower students worldwide by providing access to world-class education in India, nurturing global talent, and creating a network of future leaders who drive innovation and positive change.
          </p>
          <hr className="my-[2vw] border-none border-t border-white/35" />
          <div className="flex flex-wrap gap-4">
            {['Empower', 'Nurture', 'Lead'].map((tag) => (
              <span key={tag} className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-[10px] font-black uppercase tracking-[0.28em] text-orange-200/80">
                <Sparkles size={12} /> {tag}
              </span>
            ))}
          </div>
        </div>
      </FlowSection>
    </FlowArt>
  )
}

function FinalCTASection({ onNavigate }) {
  const sectionRef = useRef(null)
  const contentRef = useRef(null)
  const titleRef = useRef(null)
  const lastScrollYRef = useRef(0)
  const readDelayRef = useRef(null)
  const [fallingTextActive, setFallingTextActive] = useState(false)

  useEffect(() => {
    const node = sectionRef.current
    if (!node || fallingTextActive) return undefined

    lastScrollYRef.current = window.scrollY

    const checkFullyVisible = () => {
      const currentScrollY = window.scrollY
      const isScrollingDown = currentScrollY > lastScrollYRef.current
      lastScrollYRef.current = currentScrollY

      if (!isScrollingDown || readDelayRef.current) return

      const rect = node.getBoundingClientRect()
      const fitsInViewport = rect.height <= window.innerHeight
      const fullyVisible = fitsInViewport
        ? rect.top >= 0 && rect.bottom <= window.innerHeight
        : rect.top <= 0 && rect.bottom >= window.innerHeight

      if (fullyVisible) {
        readDelayRef.current = window.setTimeout(() => {
          setFallingTextActive(true)
        }, 650)
      }
    }

    window.addEventListener('scroll', checkFullyVisible, { passive: true })
    window.addEventListener('resize', checkFullyVisible)
    checkFullyVisible()

    return () => {
      window.removeEventListener('scroll', checkFullyVisible)
      window.removeEventListener('resize', checkFullyVisible)
      if (readDelayRef.current) {
        window.clearTimeout(readDelayRef.current)
      }
    }
  }, [fallingTextActive])

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.timeline({ scrollTrigger: { trigger: contentRef.current, start: 'top 80%' } })
        .from(titleRef.current, { y: 100, opacity: 0, skewY: 7, duration: 1.2, ease: 'power4.out' })
        .from('.cta-description', { opacity: 0, y: 20, duration: 0.8 }, '-=0.8')
        .from('.interactive-portal', { scale: 0, opacity: 0, rotate: -20, duration: 1, ease: 'back.out(1.7)' }, '-=0.5')
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="relative overflow-hidden border-t border-white/10 bg-black py-12 sm:py-14 lg:py-20">
      <div className="pointer-events-none absolute inset-0 z-0">
        <CanvasRevealEffect
          containerClassName="bg-black"
          colors={[
            [255, 255, 255],
            [168, 85, 247],
            [34, 211, 238],
          ]}
          dotSize={5}
          opacities={[0.14, 0.16, 0.2, 0.24, 0.3, 0.38, 0.48, 0.6, 0.74, 0.9]}
          showGradient={false}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.06)_0%,rgba(0,0,0,0.34)_64%,rgba(0,0,0,0.82)_100%)]" />
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/85 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/85 to-transparent" />
      </div>
      <div ref={contentRef} className="relative z-10 mx-auto max-w-5xl px-4 text-center sm:px-6">
        <div className="mb-5 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-2 backdrop-blur-md sm:mb-6 sm:px-6">
          <Sparkles className="h-4 w-4 text-violet-400 animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/70">The Final Chapter</span>
        </div>
        <div ref={titleRef} className="mb-2">
          <FallingText
            text="Start Your Educational Journey Today!"
            trigger="manual"
            play={fallingTextActive}
            gravity={0.82}
            mouseConstraintStiffness={0.8}
            fontSize="clamp(1.8rem, 7vw, 4.5rem)"
            lineHeight={0.95}
            wordSpacing="6px"
            className="pointer-events-none mx-auto h-[22rem] -mb-[15rem] sm:h-[26rem] sm:-mb-[18rem] md:h-[31rem] md:-mb-[22rem]"
            textClassName="font-black tracking-tighter text-white"
            observerOptions={{ threshold: 0.35 }}
          />
        </div>
        <FallingText
          text="Get personalized guidance from our admission experts."
          trigger="manual"
          play={fallingTextActive}
          gravity={0.7}
          mouseConstraintStiffness={0.78}
          fontSize="clamp(0.875rem, 2.1vw, 1.5rem)"
          lineHeight={1.45}
          wordSpacing="4px"
          className="cta-description pointer-events-none mx-auto h-[18rem] -mb-[14.5rem] max-w-2xl sm:h-[22rem] sm:-mb-[17.5rem] md:h-[25rem] md:-mb-[19.5rem]"
          textClassName="font-light text-white/70"
          observerOptions={{ threshold: 0.65 }}
        />
        <div className="interactive-portal relative z-20 flex justify-center">
          <button type="button" onClick={() => onNavigate?.('/contact')} className="group relative flex h-32 w-32 items-center justify-center transition-transform duration-500 hover:scale-105 sm:h-48 sm:w-48 md:h-64 md:w-64">
            <div className="absolute -inset-3 rounded-full bg-white/30 opacity-40 blur-xl transition-all duration-500 group-hover:-inset-5 group-hover:opacity-65 group-hover:blur-2xl" />
            <div className="absolute inset-0 rounded-full border border-white/20 bg-white/[0.03] backdrop-blur-[2px] animate-[spin_12s_linear_infinite]" />
            <div className="absolute inset-4 rounded-full border border-white/10 bg-black/20 animate-[spin_8s_linear_infinite_reverse]" />
            <div className="relative flex h-full w-full flex-col items-center justify-center rounded-full border border-white/70 bg-gradient-to-br from-white via-gray-100 to-gray-400 p-2 text-black shadow-[0_0_70px_rgba(255,255,255,0.26)] transition-all duration-500 group-hover:from-white group-hover:via-white group-hover:to-gray-200 group-hover:shadow-[0_0_95px_rgba(255,255,255,0.45)]">
              <span className="text-[0.65rem] font-bold uppercase tracking-widest text-black/60">Start Now</span>
              <span className="text-lg font-black uppercase md:text-2xl">Connect</span>
              <ArrowUpRight className="mt-2 h-6 w-6 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
            </div>
          </button>
        </div>
        <div className="mt-6 flex justify-center opacity-20 sm:mt-8">
          <div className="flex flex-col items-center gap-4">
            <div className="h-8 w-px bg-gradient-to-b from-white to-transparent sm:h-10" />
            <FallingText
              text="Scroll Up to Revisit"
              trigger="manual"
              play={fallingTextActive}
              gravity={0.56}
              mouseConstraintStiffness={0.7}
              fontSize="0.625rem"
              lineHeight={1}
              wordSpacing="5px"
              className="min-h-5 w-[17rem]"
              textClassName="font-bold uppercase tracking-[1em]"
              observerOptions={{ threshold: 1 }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

function Home({ onNavigate }) {
  useEffect(() => {
    document.body.classList.add('home-transparent-bg')
    return () => document.body.classList.remove('home-transparent-bg')
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill())
      gsap.set(document.body, { clearProps: 'all' })
      gsap.set(document.documentElement, { clearProps: 'all' })
    }
  }, [])
  return (
    <>
      <HeroSection />
      <Opportunities onNavigate={onNavigate} />
      <ImpactNumbersSection />
      <VisionVideoSection />
      <VisionMissionSection />
      <FinalCTASection onNavigate={onNavigate} />
    </>
  )
}

export default Home
