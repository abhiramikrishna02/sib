import { memo, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  GraduationCap, BookOpen, School, Library, Globe, Clock, Briefcase,
  Calendar, Users, BadgeCheck, MessageCircle, UserCheck,
  Sparkles, ShieldCheck, ArrowUpRight,
} from 'lucide-react'
import CircularGallery from '../Components/CircularGallery'
import DotField from '../Components/DotField'
import PixelCard from '../Components/PixelCard'
import FlowArt, { FlowSection } from '../Components/StoryScroll'
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
  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-[#120B21] via-[#0B0714] to-[#05030A] text-white">
      <DotField
        className="absolute inset-0 z-0"
        dotRadius={1.5}
        dotSpacing={14}
        bulgeStrength={67}
        glowRadius={160}
        sparkle={false}
        waveAmplitude={0}
        gradientFrom="rgba(168, 85, 247, 0.28)"
        gradientTo="rgba(34, 211, 238, 0.14)"
        glowColor="#8b5cf6"
      />
      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-24 text-center">
        <h1 className="text-[clamp(3.2rem,10vw,9rem)] font-black uppercase leading-[0.9] tracking-tighter">
          Study in Bengaluru
        </h1>
      </div>
    </section>
  )
}

/* ==========================================================================
   Section: Hero (Redesigned: Quantum Aperture Overdrive)
   ========================================================================= */

const CountUp = memo(function CountUp({ start, value, suffix }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!start) return
    let frameId
    const begin = performance.now()
    const animate = (now) => {
      const progress = Math.min((now - begin) / 1400, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(value * eased))
      if (progress < 1) frameId = requestAnimationFrame(animate)
      else setCount(value)
    }
    frameId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frameId)
  }, [start, value])
  return <span>{count}{suffix}</span>
})

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
  { value: 100, suffix: '+', label: 'Partner Colleges', note: 'A wide academic network with strong institutional reach.', icon: GraduationCap, accent: 'from-violet-500/35 via-violet-500/15 to-transparent' },
  { value: 1000, suffix: '+', label: 'Students Enrolled', note: 'A growing student base with real admissions momentum.', icon: Users, accent: 'from-violet-500/35 via-violet-500/15 to-transparent' },
  { value: 95, suffix: '%', label: 'Admission Success', note: 'Guidance that improves clarity, confidence, and outcomes.', icon: BadgeCheck, accent: 'from-violet-500/35 via-violet-500/15 to-transparent' },
  { value: 50, suffix: '+', label: 'Franchises', note: 'A strong expansion footprint across key locations.', icon: Sparkles, accent: 'from-violet-500/35 via-violet-500/15 to-transparent' },
  { value: 24, suffix: '/7', label: 'Student Support', note: 'Always-on support for parents and students at every step.', icon: ShieldCheck, accent: 'from-violet-500/35 via-violet-500/15 to-transparent' },
]

const StatCard = memo(function StatCard({ stat, index, start }) {
  const Icon = stat.icon
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.7, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -12, scale: 1.035, zIndex: 20, transition: { type: 'spring', stiffness: 240, damping: 18 } }}
      className="group relative w-full"
      style={{ willChange: 'transform, opacity' }}
    >
      <PixelCard
        variant="violet"
        gap={9}
        speed={38}
        colors="#c4b5fd,#8b5cf6,#5b21b6"
        className="h-[270px] w-full rounded-[2rem] border-white/12 bg-white/[0.045] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_18px_55px_rgba(0,0,0,0.32)] backdrop-blur-xl transition-colors duration-300 group-hover:border-violet-200/24 group-hover:bg-violet-400/14 group-hover:shadow-[0_0_0_1px_rgba(221,214,254,0.12),0_24px_80px_rgba(124,58,237,0.26)] sm:h-[290px] xl:h-[300px]"
      >
        <div aria-hidden="true" className={`absolute inset-0 z-[1] bg-gradient-to-br ${stat.accent} opacity-40 transition-opacity duration-500 group-hover:opacity-75`} />
        <div aria-hidden="true" className="absolute inset-0 z-[1] opacity-70" style={{ background: 'radial-gradient(circle at 24% 18%, rgba(255,255,255,0.13), transparent 28%), radial-gradient(circle at 82% 82%, rgba(167,139,250,0.18), transparent 36%)' }} />
        <div aria-hidden="true" className="absolute inset-x-10 top-8 z-[2] h-px bg-gradient-to-r from-transparent via-violet-200/45 to-transparent" />
        <div className="relative z-10 flex h-full flex-col p-5 sm:p-7">
          <div className="flex items-start justify-between">
            <div className="grid h-14 w-14 place-items-center rounded-2xl border border-white/14 bg-white/10 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_0_28px_rgba(168,85,247,0.18)] backdrop-blur-md">
              <Icon className="h-7 w-7 text-violet-100" />
            </div>
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/18 px-4 py-2 text-[0.62rem] font-black uppercase tracking-[0.34em] text-white/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
              <span>Live</span>
              <span className="h-1.5 w-1.5 rounded-full bg-violet-200 shadow-[0_0_14px_rgba(196,181,253,0.95)]" />
            </div>
          </div>

          <div className="mt-auto text-center">
            <div className="text-[clamp(3.2rem,4.8vw,4.9rem)] font-black leading-none tracking-[-0.07em] text-white">
              {start ? <CountUp start={start} value={stat.value} suffix={stat.suffix} /> : <span>0{stat.suffix}</span>}
            </div>
            <h3 className="mt-5 text-[0.78rem] font-black uppercase tracking-[0.32em] text-white/86 sm:text-[0.84rem]">{stat.label}</h3>
            <p className="mx-auto mt-4 max-w-[14rem] text-xs font-medium leading-6 text-white/58 sm:text-sm">{stat.note}</p>
          </div>

          <div className="mt-7 h-px w-full bg-gradient-to-r from-transparent via-white/12 to-transparent" />
        </div>
      </PixelCard>
    </motion.div>
  )
})

function ImpactNumbersSection() {
  const sectionRef = useRef(null)
  const [start, setStart] = useState(false)
  useEffect(() => {
    const node = sectionRef.current
    if (!node) return
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setStart(true); observer.disconnect() } }, { threshold: 0.25 })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="relative overflow-hidden border-y border-white/6 px-4 py-6 text-white sm:px-6 lg:px-8 sm:py-10" style={{ background: 'radial-gradient(circle at top right, rgba(213, 161, 255, 0.14), transparent 32%), linear-gradient(180deg, #1B0A21 0%, #220A36 100%)' }}>
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_left,rgba(168,85,247,0.28),transparent_26%),radial-gradient(circle_at_right,rgba(59,130,246,0.16),transparent_30%),radial-gradient(circle_at_top,rgba(236,72,153,0.12),transparent_28%)]" />
        <div className="absolute left-[-8rem] top-[-6rem] h-72 w-72 rounded-full bg-violet-500/20 blur-3xl" style={{ animation: 'blobA 10s ease-in-out infinite' }} />
        <div className="absolute bottom-[-7rem] right-[-6rem] h-80 w-80 rounded-full bg-violet-500/15 blur-3xl" style={{ animation: 'blobB 12s ease-in-out infinite' }} />
      </div>
      <HomeGridOverlay />
      <style>{`
        @keyframes blobA { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(40px,30px) scale(1.08)} }
        @keyframes blobB { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-35px,-20px) scale(1.1)} }
        @keyframes ticker { from{transform:translateX(0)} to{transform:translateX(-50%)} }
      `}</style>
      <div className="relative mx-auto max-w-[1800px]">
        <motion.div initial={{ opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.75, ease: 'easeOut' }} className="relative overflow-hidden rounded-[3.5rem] border border-white/10 bg-white/[0.035] shadow-[0_24px_90px_rgba(0,0,0,0.45)] backdrop-blur-sm" style={{ willChange: 'transform, opacity' }}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.18),transparent_55%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:72px_72px] opacity-70" />
          <div className="relative z-10 px-5 py-10 sm:px-10 sm:py-14 lg:px-16 lg:py-20">
            <div className="overflow-hidden rounded-full border border-white/10 bg-white/[0.055] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
              <div className="flex items-center gap-8 py-3 text-[0.7rem] font-semibold uppercase tracking-[0.5em] text-white/55 sm:text-xs" style={{ width: 'max-content', animation: 'ticker 18s linear infinite' }}>
                {[...stats, ...stats].map((item, index) => (
                  <span key={`${item.label}-${index}`} className="flex items-center gap-3 whitespace-nowrap">
                    <span className="h-1.5 w-1.5 rounded-full bg-violet-300 shadow-[0_0_18px_rgba(168,85,247,0.9)]" />
                    {item.label}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-10 grid items-center gap-5 md:grid-cols-2 xl:grid-cols-5 xl:gap-6">
              {stats.map((stat, index) => <StatCard key={stat.label} stat={stat} index={index} start={start} />)}
            </div>
          </div>
        </motion.div>
      </div>
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
    <section ref={outerRef} className="relative min-h-[100svh] h-screen w-full overflow-hidden border-y border-white/6" style={{ background: 'radial-gradient(circle at center, rgba(123, 44, 191, 0.16), transparent 44%), linear-gradient(180deg, #220A36 0%, #1B0A21 100%)' }}>
      <HomeGridOverlay opacity="opacity-[0.13]" />
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
  const marqueeRef = useRef(null)
  const bgShapeRef = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(marqueeRef.current, { xPercent: -20, ease: 'none', scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: 0.5 } })
      gsap.to('.floating-shape', { y: -100, rotation: 360, ease: 'none', scrollTrigger: { trigger: sectionRef.current, scrub: 1 } })
      gsap.timeline({ scrollTrigger: { trigger: contentRef.current, start: 'top 80%' } })
        .from(titleRef.current, { y: 100, opacity: 0, skewY: 7, duration: 1.2, ease: 'power4.out' })
        .from('.cta-description', { opacity: 0, y: 20, duration: 0.8 }, '-=0.8')
        .from('.interactive-portal', { scale: 0, opacity: 0, rotate: -20, duration: 1, ease: 'back.out(1.7)' }, '-=0.5')
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="relative overflow-hidden border-t border-white/6 py-20 sm:py-24 lg:py-48" style={{ background: 'radial-gradient(circle at 50% 0%, rgba(213, 161, 255, 0.1), transparent 30%), linear-gradient(180deg, #170F1F 0%, #220A36 100%)' }}>
      <HomeGridOverlay opacity="opacity-[0.14]" />
      <div className="pointer-events-none absolute top-1/2 left-0 z-0 -translate-y-1/2 select-none opacity-10">
        <div ref={marqueeRef} className="flex whitespace-nowrap text-[5rem] font-black uppercase tracking-tighter text-violet-500 sm:text-[8rem] lg:text-[15rem]">
          <span className="mx-10">Your Future Awaits</span>
          <span className="mx-10 text-transparent outline-text">Your Future Awaits</span>
          <span className="mx-10">Your Future Awaits</span>
        </div>
      </div>
      <div ref={bgShapeRef} className="pointer-events-none absolute inset-0 z-0">
        <div className="floating-shape absolute top-20 left-[10%] h-10 w-10 rounded-xl border border-violet-500/30 bg-violet-500/5 backdrop-blur-sm" />
        <div className="floating-shape absolute bottom-20 right-[15%] h-14 w-14 rounded-full border border-violet-500/20 bg-violet-500/5 backdrop-blur-sm" />
        <div className="absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/10 blur-[140px]" />
      </div>
      <div ref={contentRef} className="relative z-10 mx-auto max-w-5xl px-4 text-center sm:px-6">
        <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-2 backdrop-blur-md sm:mb-10 sm:px-6">
          <Sparkles className="h-4 w-4 text-violet-400 animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/70">The Final Chapter</span>
        </div>
        <h2 ref={titleRef} className="mb-6 text-[clamp(1.8rem,7vw,4.5rem)] font-black leading-[0.95] tracking-tighter text-white sm:text-[clamp(2rem,6vw,4.5rem)]">
          Start Your Educational Journey Today!
        </h2>
        <p className="cta-description mx-auto mb-12 max-w-2xl text-sm font-light text-white/70 sm:mb-16 sm:text-lg md:text-2xl">
          Get personalized guidance from our admission experts.
        </p>
        <div className="interactive-portal flex justify-center">
          <button type="button" onClick={() => onNavigate?.('/contact')} className="group relative flex h-32 w-32 items-center justify-center transition-transform duration-500 hover:scale-110 sm:h-48 sm:w-48 md:h-64 md:w-64">
            <div className="absolute inset-0 rounded-full border border-dashed border-white/20 animate-[spin_10s_linear_infinite]" />
            <div className="absolute inset-4 rounded-full border border-violet-500/30 animate-[spin_6s_linear_infinite_reverse]" />
            <div className="relative flex h-full w-full flex-col items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-violet-700 p-2 text-white shadow-[0_0_50px_rgba(168,85,247,0.4)] transition-all group-hover:shadow-[0_0_80px_rgba(168,85,247,0.7)]">
              <span className="text-[0.65rem] font-bold uppercase tracking-widest opacity-70">Start Now</span>
              <span className="text-lg font-black uppercase md:text-2xl">Connect</span>
              <ArrowUpRight className="mt-2 h-6 w-6 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </div>
          </button>
        </div>
        <div className="mt-12 flex justify-center opacity-20 sm:mt-24">
          <div className="flex flex-col items-center gap-4">
            <div className="h-16 w-px bg-gradient-to-b from-white to-transparent" />
            <span className="text-[10px] font-bold uppercase tracking-[1em]">Scroll Up to Revisit</span>
          </div>
        </div>
      </div>
      <style>{`.outline-text { -webkit-text-stroke: 1px rgba(255, 255, 255, 0.2); }`}</style>
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
