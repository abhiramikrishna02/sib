import { memo, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  GraduationCap, Landmark, BookOpen, School, Library, Globe, Clock, Briefcase,
  Laptop, TimerReset, BriefcaseBusiness, Home as HomeIcon, CalendarDays, Calendar,
  Users, BadgeCheck, MessageCircle, UserCheck, Sparkles, ShieldCheck,
  ArrowUpRight, ArrowDown, ArrowRight, Target, Rocket, MoveRight,
} from 'lucide-react'
import bangaloreVideo from '../assets/Bangalore.mp4'
import graduateVideo from '../assets/graduate.mp4'

gsap.registerPlugin(ScrollTrigger)
ScrollTrigger.config({ ignoreMobileResize: true, autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load' })

const MOBILE_QUERY = '(max-width: 767px)'
function isMobileViewport() {
  return typeof window !== 'undefined' && window.matchMedia(MOBILE_QUERY).matches
}

/* ==========================================================================
   Section: Hero (Redesigned: Quantum Aperture Overdrive)
   ========================================================================== */

function MissionBackdropModel() {
  const groupRef = useRef(null)
  useFrame((_, delta) => {
    if (!groupRef.current) return
    groupRef.current.rotation.x += delta * 0.18
    groupRef.current.rotation.y += delta * 0.28
    groupRef.current.rotation.z += delta * 0.08
  })
  return (
    <group ref={groupRef} scale={1.8} position={[0, 0, 0]}>
      <mesh rotation={[0.4, 0.2, 0]}>
        <torusKnotGeometry args={[0.85, 0.28, 128, 16]} />
        <meshStandardMaterial color="#7c5cff" emissive="#2d164f" emissiveIntensity={0.6} metalness={0.75} roughness={0.25} />
      </mesh>
      <mesh position={[0, 0, -0.25]} scale={1.12}>
        <icosahedronGeometry args={[0.78, 1]} />
        <meshStandardMaterial color="#120a1f" emissive="#0f1733" emissiveIntensity={0.4} metalness={0.45} roughness={0.3} transparent opacity={0.4} />
      </mesh>
    </group>
  )
}

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

function CyberGridTexture() {
  const particles = useMemo(() => {
    const colors = ['#f0abfc', '#22d3ee', '#c084fc']
    return Array.from({ length: 60 }, () => ({
      x: Math.random() * 100, y: Math.random() * 100,
      size: Math.random() * 0.4 + 0.1,
      color: colors[Math.floor(Math.random() * colors.length)],
    }))
  }, [])
  return (
    <pattern id="cyberGridPattern" width="100" height="100" patternUnits="userSpaceOnUse">
      <rect width="100" height="100" fill="transparent" />
      <path d="M 10 0 L 10 100 M 0 10 L 100 10" stroke="#9d4edd" strokeWidth="0.05" opacity="0.4" />
      <path d="M 50 0 L 50 100 M 0 50 L 100 50" stroke="#9d4edd" strokeWidth="0.1" opacity="0.6" />
      {particles.map((p, i) => (
        <circle key={i} className="cyber-node" cx={p.x} cy={p.y} r={p.size} fill={p.color} opacity={0.8} />
      ))}
    </pattern>
  )
}

function HeroSection() {
  const containerRef = useRef(null)
  const videoRef = useRef(null)
  const contentRevealRef = useRef(null)
  const apertureContainerRef = useRef(null)
  
  // Aperture Rings
  const ring1Ref = useRef(null)
  const ring2Ref = useRef(null)
  const ring3Ref = useRef(null)
  
  const brokenThroughRef = useRef(false)
  const [isBrokenThrough, setIsBrokenThrough] = useState(false)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Initial Setup
      gsap.set(contentRevealRef.current, { opacity: 0, scale: 2, filter: 'blur(20px)' })
      gsap.set(videoRef.current, { scale: 1.5, filter: 'brightness(0) saturate(0) blur(10px)' })

      const tl = gsap.timeline({
        onComplete: () => {
          brokenThroughRef.current = true
          setIsBrokenThrough(true)
          gsap.set(apertureContainerRef.current, { display: 'none' })
          ScrollTrigger.refresh()
        },
        scrollTrigger: { 
          trigger: containerRef.current, 
          start: 'top top', 
          end: '+=1500', 
          pin: true, 
          pinSpacing: true, 
          scrub: 1 
        },
      })

      // 1. High-Energy Aperture Expansion (Rings spin opposite ways and scale massive)
      tl.to(ring1Ref.current, { rotation: 180, scale: 80, duration: 2, ease: 'power3.inOut' }, 0)
        .to(ring2Ref.current, { rotation: -270, scale: 80, duration: 2, ease: 'power3.inOut' }, 0.1)
        .to(ring3Ref.current, { rotation: 360, scale: 80, duration: 2, ease: 'power3.inOut' }, 0.2)
        .to(apertureContainerRef.current, { opacity: 0, duration: 0.5 }, 1.5)

      // 2. Video Snaps into Reality
      tl.to(videoRef.current, { 
        scale: 1, 
        filter: 'brightness(0.4) saturate(1.2) blur(0px)', 
        duration: 1.5, 
        ease: 'power4.out' 
      }, 0.8)

      // 3. Final Typography Slams In
      tl.to(contentRevealRef.current, { 
        opacity: 1, 
        scale: 1, 
        filter: 'blur(0px)',
        duration: 1.2, 
        ease: 'back.out(1.5)' 
      }, 1)

      // Idle Cyber-Node Pulsing
      gsap.to('.cyber-node', { opacity: 0.2, stagger: { each: 0.05, repeat: -1, yoyo: true }, duration: 1.5, ease: 'power1.inOut' })

      // Post-reveal Parallax
      const moveHandler = (e) => {
        if (!brokenThroughRef.current) return
        const x = (e.clientX / window.innerWidth - 0.5) * 30
        const y = (e.clientY / window.innerHeight - 0.5) * 30
        gsap.to('.revealed-content', {
          x: x, y: y, rotationY: x * 0.4, rotationX: -y * 0.4, duration: 1, ease: 'power2.out',
        })
      }
      window.addEventListener('mousemove', moveHandler)
      return () => window.removeEventListener('mousemove', moveHandler)
    }, containerRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={containerRef}
      className="relative h-[100svh] w-full overflow-hidden bg-[#05010a] perspective-[1000px]"
    >
      {/* --- BACKGROUND LAYER: The Destination (Video) --- */}
      <video 
        ref={videoRef} 
        src={bangaloreVideo} 
        autoPlay 
        muted 
        loop 
        playsInline 
        className="absolute inset-0 z-0 h-full w-full object-cover transform-gpu" 
      />

      {/* --- MID LAYER: The Final Text (Revealed later) --- */}
      <div ref={contentRevealRef} className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none px-4">
        <div className="revealed-content text-center flex flex-col items-center transform-gpu">
          <div className="mb-6 rounded-full border border-fuchsia-500/30 bg-fuchsia-500/10 px-6 py-2 backdrop-blur-md">
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.5em] text-fuchsia-300">
              Access Granted
            </span>
          </div>
          <h2 className="text-[clamp(2.5rem,8vw,7rem)] font-black uppercase leading-[0.9] tracking-tighter text-white drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)]">
            Study In India's <br />
            <span className="bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-violet-500 bg-clip-text font-serif font-light italic text-transparent">
              Silicon Valley
            </span>
          </h2>
        </div>
      </div>

      {/* --- FOREGROUND LAYER: The Quantum Aperture Lock --- */}
      <div ref={apertureContainerRef} className="absolute inset-0 z-20 flex items-center justify-center bg-[#0d0417]">
        
        {/* Background Grid for the Lock screen */}
        <svg className="absolute inset-0 h-full w-full opacity-60">
          <defs><CyberGridTexture /></defs>
          <rect width="100%" height="100%" fill="url(#cyberGridPattern)" />
        </svg>

        {/* Ambient Center Glow */}
        <div className="absolute h-[60vw] w-[60vw] rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.15),transparent_60%)] blur-2xl" />

        {/* RING 1: Outer Hexagon */}
        <div 
          ref={ring1Ref}
          className="absolute flex h-[45vw] w-[45vw] min-h-[300px] min-w-[300px] items-center justify-center border-[1px] border-violet-500/30 bg-[#0d0417]/80 backdrop-blur-sm shadow-[0_0_60px_rgba(139,92,246,0.3)] transform-gpu"
          style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
        >
          {/* RING 2: Middle Octagon */}
          <div 
            ref={ring2Ref}
            className="absolute flex h-[80%] w-[80%] items-center justify-center border-[2px] border-cyan-400/50 bg-[#160726]/90 shadow-[inset_0_0_40px_rgba(34,211,238,0.2)] transform-gpu"
            style={{ clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)' }}
          >
            {/* RING 3: Inner Diamond */}
            <div 
              ref={ring3Ref}
              className="absolute flex h-[70%] w-[70%] flex-col items-center justify-center bg-gradient-to-br from-violet-900 to-[#0d0417] border border-fuchsia-500 shadow-[0_0_50px_rgba(217,70,239,0.5)] transform-gpu"
              style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}
            >
              {/* Inner Lock Text */}
              <div className="flex flex-col items-center justify-center -rotate-0 text-center scale-75 sm:scale-100">
                <span className="mb-2 text-[8px] font-black uppercase tracking-[0.8em] text-cyan-300 animate-pulse">
                  System Locked
                </span>
                <span className="text-3xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50">
                  BENGALURU
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Prompt */}
        <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3">
          <span className="text-[0.65rem] font-bold uppercase tracking-[0.6em] text-white/50">Initiate Sequence</span>
          <div className="flex h-12 w-7 items-center justify-center rounded-full border border-violet-500/40 bg-violet-950/30 backdrop-blur-md">
            <ArrowDown className="h-4 w-4 animate-bounce text-violet-400" />
          </div>
        </div>
        
      </div>
    </section>
  )
}

/* ==========================================================================
   Section: Opportunities (Redesigned: Geometric Horizontal Tiles)
   ========================================================================== */

const cardData = [
  { title: 'Universities', subtitle: 'GLOBAL ACCESS', icon: GraduationCap, color: 'from-violet-600 via-violet-400 to-violet-500', glow: 'rgba(59, 130, 246, 0.5)', path: '/services#universities' },
  { title: 'Colleges', subtitle: 'GLOBAL ACCESS', icon: School, color: 'from-violet-600 via-violet-400 to-violet-500', glow: 'rgba(168, 85, 247, 0.5)', path: '/services#colleges' },
  { title: 'Courses', subtitle: 'GLOBAL ACCESS', icon: BookOpen, color: 'from-violet-600 via-violet-400 to-violet-500', glow: 'rgba(16, 185, 129, 0.5)', path: '/services#courses' },
  { title: 'Online Courses', subtitle: 'GLOBAL ACCESS', icon: Globe, color: 'from-violet-600 via-violet-400 to-violet-500', glow: 'rgba(244, 63, 94, 0.5)' },
  { title: 'Short-term Programs', subtitle: 'GLOBAL ACCESS', icon: Clock, color: 'from-violet-700 via-violet-400 to-violet-600', glow: 'rgba(37, 99, 235, 0.5)' },
  { title: 'Part-time Jobs', subtitle: 'GLOBAL ACCESS', icon: Briefcase, color: 'from-violet-600 via-violet-400 to-violet-500', glow: 'rgba(139, 92, 246, 0.5)' },
  { title: 'Accommodation', subtitle: 'NEAR ME', icon: HomeIcon, color: 'from-violet-600 via-orange-400 to-violet-500', glow: 'rgba(245, 158, 11, 0.5)' },
  { title: 'Events', subtitle: 'GLOBAL ACCESS', icon: Calendar, color: 'from-violet-600 via-green-400 to-violet-500', glow: 'rgba(20, 184, 166, 0.5)' },
  { title: '1-on-1 Counselling', subtitle: 'FREE SESSION', icon: MessageCircle, color: 'from-violet-600 via-violet-400 to-violet-500', glow: 'rgba(6, 182, 212, 0.5)' },
  { title: 'Internships', subtitle: 'GLOBAL ACCESS', icon: UserCheck, color: 'from-violet-600 via-violet-400 to-violet-500', glow: 'rgba(217, 70, 239, 0.5)' },
]

function GlassCard({ item, onNavigate }) {
  const Icon = item.icon
  const handleNavigate = () => item.path && onNavigate?.(item.path)
  
  return (
    <div
      onClick={handleNavigate}
      /* Unique Shape via Clip-Path + Reduced Height (h-32) */
      className={`group relative flex h-32 w-full items-center overflow-hidden border-l-4 bg-[#2b0d40]/40 p-5 backdrop-blur-xl transition-all duration-500 hover:bg-[#3d145a]/60 ${item.path ? 'cursor-pointer' : ''} glass-card-reveal`}
      style={{ 
        clipPath: 'polygon(0% 0%, 92% 0%, 100% 25%, 100% 100%, 8% 100%, 0% 75%)',
        borderColor: item.glow || '#a855f7'
      }}
      role={item.path ? 'button' : undefined}
      tabIndex={item.path ? 0 : undefined}
      onKeyDown={(e) => { if (item.path && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); handleNavigate() } }}
    >
      {/* Background Glow Overlay */}
      <div className="absolute inset-0 z-0 opacity-0 transition-opacity duration-500 group-hover:opacity-20" 
           style={{ background: `linear-gradient(90deg, ${item.glow} 0%, transparent 100%)` }} />

      <div className="relative z-10 flex w-full items-center gap-5">
        {/* Icon Section - Compact */}
        <div className="relative flex h-16 w-16 shrink-0 items-center justify-center">
          <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${item.color} opacity-20 blur-lg group-hover:opacity-50`} />
          <div className="relative flex h-full w-full items-center justify-center rounded-xl border border-white/10 bg-white/5 backdrop-blur-md transition-transform duration-500 group-hover:scale-110">
            <Icon className="text-white/80" size={28} strokeWidth={1.5} />
          </div>
        </div>

        {/* Text Content - Spaced to fill horizontally */}
        <div className="flex flex-col flex-grow min-w-0">
          <span className="text-[9px] font-black uppercase tracking-[0.25em] text-white/30 group-hover:text-violet-400 transition-colors">
            {item.subtitle}
          </span>
          <h3 className="truncate text-xl font-black uppercase italic tracking-tighter text-white/60 transition-all duration-500 group-hover:text-white sm:text-2xl">
            {item.title}
          </h3>
          <div className="mt-1 h-[1px] w-0 bg-white/40 transition-all duration-700 group-hover:w-full" />
        </div>

        {/* Action Arrow */}
        <div className="ml-2 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/5 bg-white/5 transition-all duration-500 group-hover:border-white/20 group-hover:bg-white/10">
          <ArrowRight size={16} className="text-white/20 transition-all group-hover:translate-x-1 group-hover:text-white" />
        </div>
      </div>

      {/* Modern Scanning Line Decoration */}
      <div className="absolute bottom-0 left-0 h-[2px] w-full scale-x-0 bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-1000 group-hover:scale-x-100" />
    </div>
  )
}

function Opportunities({ onNavigate }) {
  const containerRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray('.glass-card-reveal');
      
      gsap.set(cards, { opacity: 0, x: -30, skewX: 10 });

      gsap.to(cards, {
        opacity: 1,
        x: 0,
        skewX: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: "back.out(1.2)",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      });
    }, containerRef);
    
    return () => ctx.revert();
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="relative w-full overflow-hidden bg-[#0f0816] py-20"
      style={{ 
        background: 'radial-gradient(circle at 0% 0%, rgba(139, 92, 246, 0.08) 0%, transparent 40%), radial-gradient(circle at 100% 100%, rgba(139, 92, 246, 0.08) 0%, transparent 40%), #0f0816' 
      }}
    >
      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="mb-12 flex flex-col items-center justify-between gap-6 md:flex-row md:items-end">
          <div className="text-center md:text-left">
            <h2 className="text-4xl font-black uppercase italic tracking-tighter text-white md:text-6xl">
              Our <span className="text-transparent" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.4)' }}>Ecosystem</span>
            </h2>
            <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.6em] text-violet-400/60">Select your destination</p>
          </div>
          <div className="hidden h-px flex-grow bg-gradient-to-r from-violet-500/50 to-transparent md:block" />
        </div>

        {/* The Grid - Optimized for shorter cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cardData.map((item, index) => (
            <GlassCard key={`${item.title}-${index}`} item={item} onNavigate={onNavigate} />
          ))}
        </div>

        <div className="mt-16 flex items-center justify-center gap-4 opacity-20">
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
    <motion.article
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.7, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -12, scale: 1.02, transition: { type: 'spring', stiffness: 240, damping: 18 } }}
      className="group relative min-h-[260px] w-full max-w-none overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_20px_50px_rgba(0,0,0,0.35)] sm:max-w-[340px] md:min-w-[280px]"
      style={{ willChange: 'transform, opacity' }}
    >
      <div aria-hidden="true" className={`absolute inset-0 bg-gradient-to-br ${stat.accent} opacity-0 transition-opacity duration-500 group-hover:opacity-100`} />
      <div aria-hidden="true" className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ background: 'radial-gradient(circle at top left, rgba(255,255,255,0.12), transparent 35%), radial-gradient(circle at bottom right, rgba(255,255,255,0.08), transparent 40%)' }} />
      <div className="relative flex h-full flex-col">
        <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-violet-300/70 to-transparent" />
        <div className="mt-5 flex items-center justify-between">
          <div className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-white/8 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
            <Icon className="h-6 w-6 text-violet-100" />
          </div>
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/15 px-3 py-1 text-[0.62rem] font-bold uppercase tracking-[0.32em] text-white/40">
            <span>Live</span>
            <span className="h-1.5 w-1.5 rounded-full bg-violet-300 shadow-[0_0_14px_rgba(192,132,252,0.95)]" />
          </div>
        </div>
        <div className="mt-auto pt-8 text-center">
          <div className="text-[clamp(3rem,5vw,4.9rem)] font-black leading-none tracking-[-0.06em] text-white">
            {start ? <CountUp start={start} value={stat.value} suffix={stat.suffix} /> : <span>0{stat.suffix}</span>}
          </div>
          <h3 className="mt-4 text-[0.92rem] font-extrabold uppercase tracking-[0.28em] text-white/82">{stat.label}</h3>
          <p className="mx-auto mt-4 max-w-[14rem] text-sm leading-6 text-white/55">{stat.note}</p>
        </div>
        <div className="mt-6 h-px w-full bg-gradient-to-r from-transparent via-white/12 to-transparent" />
      </div>
    </motion.article>
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
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:72px_72px] opacity-18" />
        <div className="absolute left-[-8rem] top-[-6rem] h-72 w-72 rounded-full bg-violet-500/20 blur-3xl" style={{ animation: 'blobA 10s ease-in-out infinite' }} />
        <div className="absolute bottom-[-7rem] right-[-6rem] h-80 w-80 rounded-full bg-violet-500/15 blur-3xl" style={{ animation: 'blobB 12s ease-in-out infinite' }} />
      </div>
      <style>{`
        @keyframes blobA { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(40px,30px) scale(1.08)} }
        @keyframes blobB { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-35px,-20px) scale(1.1)} }
        @keyframes ticker { from{transform:translateX(0)} to{transform:translateX(-50%)} }
      `}</style>
      <div className="relative mx-auto max-w-[1600px]">
        <motion.div initial={{ opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.75, ease: 'easeOut' }} className="relative overflow-hidden rounded-[2.8rem] border border-white/10 bg-white/[0.03] shadow-[0_24px_90px_rgba(0,0,0,0.45)]" style={{ willChange: 'transform, opacity' }}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.14),transparent_55%)]" />
          <div className="relative z-10 px-5 py-10 sm:px-10 sm:py-14 lg:px-14 lg:py-16">
            <div className="mt-8 overflow-hidden rounded-full border border-white/10 bg-white/[0.04]">
              <div className="flex items-center gap-8 py-3 text-[0.7rem] font-semibold uppercase tracking-[0.5em] text-white/55 sm:text-xs" style={{ width: 'max-content', animation: 'ticker 18s linear infinite' }}>
                {[...stats, ...stats].map((item, index) => (
                  <span key={`${item.label}-${index}`} className="flex items-center gap-3 whitespace-nowrap">
                    <span className="h-1.5 w-1.5 rounded-full bg-violet-300 shadow-[0_0_18px_rgba(168,85,247,0.9)]" />
                    {item.label}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
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

function VisionMissionCard({ cardRef, wrapperClass = '', glowClass, bgClass, icon: Icon, iconClass, number, title, titleAccentClass, body, footer }) {
  return (
    <div ref={cardRef} className={`group relative ${wrapperClass}`}>
      <div className={`absolute -inset-1 rounded-[3rem] bg-gradient-to-r ${glowClass} opacity-20 blur-xl transition duration-1000 group-hover:opacity-45`} />
      <div className={`relative flex min-h-[360px] flex-col justify-between overflow-hidden rounded-[3rem] border border-white/8 ${bgClass} p-5 shadow-[0_20px_80px_rgba(8,15,31,0.45)] sm:min-h-[420px] sm:p-8 md:h-[500px] md:p-10`}>
        <div className="flex items-start justify-between">
          <div className={`rounded-2xl p-4 ${iconClass}`}><Icon className={`h-8 w-8 ${titleAccentClass}`} /></div>
          <span className="text-4xl font-black italic text-white/14 sm:text-6xl">{number}</span>
        </div>
        <div>
          <h2 className="mb-5 text-3xl font-black uppercase tracking-tighter text-white sm:mb-6 sm:text-5xl">Our <br /><span className={titleAccentClass}>{title}</span></h2>
          <p className="max-w-xl text-sm leading-relaxed text-white/68 sm:text-base sm:leading-relaxed md:text-lg">{body}</p>
        </div>
        {footer}
      </div>
    </div>
  )
}

function VisionMissionSection() {
  const containerRef = useRef(null)
  const visionCardRef = useRef(null)
  const missionCardRef = useRef(null)
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: containerRef.current, start: 'top top', end: '+=150%', scrub: 1, pin: true, invalidateOnRefresh: true } })
      tl.fromTo(visionCardRef.current, { x: '-100%', opacity: 0 }, { x: '0%', opacity: 1, ease: 'power3.out' }, 0)
        .fromTo(missionCardRef.current, { x: '100%', opacity: 0 }, { x: '0%', opacity: 1, ease: 'power3.out' }, 0)
    }, containerRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={containerRef} className="relative flex min-h-[88svh] w-full items-center justify-center overflow-hidden border-y border-white/6 py-12 md:h-screen md:py-0" style={{ background: 'radial-gradient(circle at 18% 18%, rgba(56, 189, 248, 0.12), transparent 26%), radial-gradient(circle at 82% 78%, rgba(251, 146, 60, 0.11), transparent 24%), radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.08), transparent 42%), linear-gradient(180deg, #120a1d 0%, #1a0b2e 55%, #0e0717 100%)' }}>
      <div className="absolute left-1/2 top-1/2 h-[860px] w-[860px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/10 blur-[160px] pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.16]" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.35) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
      <div className="container relative z-10 mx-auto grid grid-cols-1 gap-6 px-4 md:grid-cols-2 md:gap-8 md:px-6">
        <VisionMissionCard
          cardRef={visionCardRef}
          glowClass="from-cyan-400 via-blue-500 to-violet-500"
          bgClass="bg-[#17192b]/92 border-cyan-300/12"
          icon={Target} iconClass="border border-cyan-300/15 bg-cyan-400/10"
          number="01" title="Vision" titleAccentClass="text-cyan-300"
          body="To transform Bengaluru into Asia's premier educational destination by revolutionizing admission processes, offering unparalleled career guidance, and fostering collaborative partnerships with top-tier institutions and industry leaders."
          footer={<div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-cyan-300"><span>View Roadmap</span><MoveRight size={16} /></div>}
        />
        <VisionMissionCard
          cardRef={missionCardRef} wrapperClass="mt-4 md:mt-24"
          glowClass="from-orange-400 via-rose-500 to-fuchsia-500"
          bgClass="bg-[#201126]/92 border-orange-300/12"
          icon={Rocket} iconClass="border border-orange-300/15 bg-orange-400/10"
          number="02" title="Mission" titleAccentClass="text-orange-300"
          body="To attract and empower students worldwide by providing access to world-class education in India, nurturing global talent, and creating a network of future leaders who drive innovation and positive change."
          footer={
            <div className="flex items-center gap-6">
              {['Empower', 'Nurture', 'Lead'].map((tag) => (
                <span key={tag} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-tighter text-orange-300/70"><Sparkles size={10} /> {tag}</span>
              ))}
            </div>
          }
        />
      </div>
    </section>
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