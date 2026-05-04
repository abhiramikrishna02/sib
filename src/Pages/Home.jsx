import { memo, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  GraduationCap,
  Landmark,
  BookOpen,
  School,
  Library,
  Globe,
  Clock,
  Briefcase,
  Laptop,
  TimerReset,
  BriefcaseBusiness,
  Home as HomeIcon,
  CalendarDays,
  Calendar,
  Users,
  BadgeCheck,
  MessageCircle,
  UserCheck,
  Sparkles,
  ShieldCheck,
  ArrowUpRight,
  ArrowDown,
  ArrowRight,
  Target,
  Rocket,
  MoveRight,
  BookMarked,
} from 'lucide-react'

import bangaloreVideo from '../assets/Bangalore.mp4'
import graduateVideo from '../assets/graduate.mp4'

gsap.registerPlugin(ScrollTrigger)
ScrollTrigger.config({
  ignoreMobileResize: true,
  autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load',
})

const MOBILE_QUERY = '(max-width: 767px)'

function isMobileViewport() {
  return typeof window !== 'undefined' && window.matchMedia(MOBILE_QUERY).matches
}


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
        <meshStandardMaterial
          color="#7c5cff"
          emissive="#2d164f"
          emissiveIntensity={0.6}
          metalness={0.75}
          roughness={0.25}
        />
      </mesh>
      <mesh position={[0, 0, -0.25]} scale={1.12}>
        <icosahedronGeometry args={[0.78, 1]} />
        <meshStandardMaterial
          color="#120a1f"
          emissive="#0f1733"
          emissiveIntensity={0.4}
          metalness={0.45}
          roughness={0.3}
          transparent
          opacity={0.4}
        />
      </mesh>
    </group>
  )
}


const items = [
  {
    title: 'Universities',
    icon: GraduationCap,
    accent: 'from-violet-500/35 via-violet-500/20 to-transparent',
    glow: 'rgba(196, 181, 253, 0.28)',
    detail: 'Explore top-ranked universities with modern campus life, global exposure, and future-focused programs.',
  },
  {
    title: 'Colleges',
    icon: Landmark,
    accent: 'from-violet-500/35 via-violet-500/20 to-transparent',
    glow: 'rgba(125, 211, 252, 0.26)',
    detail: 'Find the right college path with strong academics, career support, and student-friendly guidance.',
  },
  {
    title: 'Courses',
    icon: BookOpen,
    accent: 'from-violet-500/35 via-violet-500/20 to-transparent',
    glow: 'rgba(103, 232, 249, 0.24)',
    detail: 'Browse courses that match your goals, from skill-building programs to career-oriented study tracks.',
  },
  {
    title: 'Online Courses',
    icon: Laptop,
    accent: 'from-violet-500/35 via-violet-500/20 to-transparent',
    glow: 'rgba(96, 165, 250, 0.24)',
    detail: 'Learn from anywhere with flexible online programs built for modern learners and busy families.',
  },
  {
    title: 'Short-Term Programs',
    icon: TimerReset,
    accent: 'from-violet-500/35 via-orange-500/20 to-transparent',
    glow: 'rgba(251, 191, 36, 0.24)',
    detail: 'Quick, practical programs for immediate growth, upskilling, and focused career upgrades.',
  },
  {
    title: 'Part-Time Jobs',
    icon: BriefcaseBusiness,
    accent: 'from-violet-500/35 via-green-500/20 to-transparent',
    glow: 'rgba(74, 222, 128, 0.24)',
    detail: 'Discover student-friendly work options that help with experience, confidence, and finances.',
  },
  {
    title: 'Accommodation',
    icon: HomeIcon,
    accent: 'from-violet-500/35 via-violet-500/20 to-transparent',
    glow: 'rgba(244, 114, 182, 0.22)',
    detail: 'Find safe and comfortable places to stay with easy access, convenience, and peace of mind.',
  },
  {
    title: 'Events',
    icon: CalendarDays,
    accent: 'from-violet-500/35 via-violet-500/20 to-transparent',
    glow: 'rgba(168, 85, 247, 0.24)',
    detail: 'Attend events, webinars, and campus activities that make the journey more engaging and useful.',
  },
  {
    title: '1-on-1 Counselling',
    icon: Users,
    accent: 'from-violet-500/35 via-violet-500/20 to-transparent',
    glow: 'rgba(236, 72, 153, 0.24)',
    detail: 'Get personal guidance for choosing the right path without the confusion and random internet chaos.',
  },
  {
    title: 'Internships',
    icon: BadgeCheck,
    accent: 'from-violet-500/35 via-violet-500/20 to-transparent',
    glow: 'rgba(163, 230, 53, 0.22)',
    detail: 'Explore internship opportunities that build real experience and help careers start stronger.',
  },
]

const stats = [
  {
    value: 100, suffix: '+', label: 'Partner Colleges',
    note: 'A wide academic network with strong institutional reach.',
    icon: GraduationCap, accent: 'from-violet-500/35 via-violet-500/15 to-transparent',
  },
  {
    value: 1000, suffix: '+', label: 'Students Enrolled',
    note: 'A growing student base with real admissions momentum.',
    icon: Users, accent: 'from-violet-500/35 via-violet-500/15 to-transparent',
  },
  {
    value: 95, suffix: '%', label: 'Admission Success',
    note: 'Guidance that improves clarity, confidence, and outcomes.',
    icon: BadgeCheck, accent: 'from-violet-500/35 via-violet-500/15 to-transparent',
  },
  {
    value: 50, suffix: '+', label: 'Franchises',
    note: 'A strong expansion footprint across key locations.',
    icon: Sparkles, accent: 'from-violet-500/35 via-violet-500/15 to-transparent',
  },
  {
    value: 24, suffix: '/7', label: 'Student Support',
    note: 'Always-on support for parents and students at every step.',
    icon: ShieldCheck, accent: 'from-violet-500/35 via-violet-500/15 to-transparent',
  },
]


const CountUp = memo(function CountUp({ start, value, suffix }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!start) return
    let frameId
    const duration = 1400
    const begin = performance.now()
    const animate = (now) => {
      const progress = Math.min((now - begin) / duration, 1)
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
    const temp = []
    const colors = ['#f0abfc', '#22d3ee', '#c084fc']

    for (let i = 0; i < 60; i += 1) {
      const x = Math.random() * 100
      const y = Math.random() * 100
      const size = Math.random() * 0.4 + 0.1
      const color = colors[Math.floor(Math.random() * colors.length)]
      temp.push({ x, y, size, color })
    }

    return temp
  }, [])

  return (
    <pattern id="cyberGridPattern" width="100" height="100" patternUnits="userSpaceOnUse">
      <rect width="100" height="100" fill="transparent" />
      <path d="M 10 0 L 10 100 M 0 10 L 100 10" stroke="#7b2cbf" strokeWidth="0.05" opacity="0.3" />
      <path d="M 50 0 L 50 100 M 0 50 L 100 50" stroke="#7b2cbf" strokeWidth="0.1" opacity="0.5" />
      {particles.map((p, i) => (
        <circle
          key={i}
          className="cyber-node"
          cx={p.x}
          cy={p.y}
          r={p.size}
          fill={p.color}
          opacity={0.6}
        />
      ))}
    </pattern>
  )
}

function HeroSection() {
  const containerRef = useRef(null)
  const maskGroupRef = useRef(null)
  const videoRef = useRef(null)
  const portalVeilRef = useRef(null)
  const contentRevealRef = useRef(null)
  const [isBrokenThrough, setIsBrokenThrough] = useState(false)
  const brokenThroughRef = useRef(false)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(maskGroupRef.current, { transformOrigin: '50% 50%', scale: 1 })
      gsap.set(contentRevealRef.current, { opacity: 0, y: 50 })

      const breakthroughTl = gsap.timeline({
        onComplete: () => {
          brokenThroughRef.current = true
          setIsBrokenThrough(true)
          gsap.set(portalVeilRef.current, { display: 'none' })
          ScrollTrigger.refresh()
        },
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=1000',
          pin: true,
          pinSpacing: true,
          scrub: 1,
        },
      })

      breakthroughTl
        .to(maskGroupRef.current, {
          scale: 150,
          duration: 1.5,
          ease: 'expo.inOut',
        })
        .to(portalVeilRef.current, {
          opacity: 0,
          duration: 0.6,
        }, '-=0.8')
        .to(videoRef.current, { filter: 'brightness(1)', duration: 1 }, '-=0.3')
        .to(contentRevealRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.8,
        }, '-=0.2')

      gsap.to('.cyber-node', {
        opacity: 0.1,
        stagger: { each: 0.05, repeat: -1, yoyo: true },
        duration: 2,
        ease: 'sine.inOut',
      })

      const moveHandler = (e) => {
        if (!brokenThroughRef.current) return
        const xPos = (e.clientX / window.innerWidth - 0.5) * 20
        const yPos = (e.clientY / window.innerHeight - 0.5) * 20
        gsap.to('.revealed-content', {
          x: xPos,
          y: yPos,
          duration: 1.5,
          ease: 'power2.out',
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
      className="relative min-h-[88svh] w-full overflow-hidden border-b border-white/6 bg-[#220A36] px-4 py-6 md:h-screen md:px-0 md:py-0"
      style={{
        background:
          'radial-gradient(circle at top left, rgba(168, 85, 247, 0.18), transparent 34%), radial-gradient(circle at bottom right, rgba(213, 161, 255, 0.12), transparent 28%), linear-gradient(180deg, #220A36 0%, #1B0A21 100%)',
      }}
    >
      <div className="hidden">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-2xl backdrop-blur-xl">
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.45em] text-white/45">
            Study in Bengaluru
          </p>
          <h2 className="mt-3 text-[clamp(2rem,11vw,4rem)] font-black uppercase leading-[0.9] tracking-tight text-white">
             India&apos;s Silicon Valley
          </h2>
          <p className="mt-4 text-sm leading-6 text-white/62">
            A mobile-first intro to Bengaluru admissions, guidance, and student support.
          </p>
        </div>

        <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
          <video
            src={bangaloreVideo}
            autoPlay
            muted
            loop
            playsInline
            className="h-full w-full object-cover brightness-[0.65]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/45" />
          <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-white/70 backdrop-blur-sm">
            Scroll for the full experience
          </div>
        </div>
      </div>

      <div className="relative block h-full w-full overflow-hidden">
      <video
        ref={videoRef}
        src={bangaloreVideo}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 z-0 h-full w-full object-cover brightness-[0.5] transition-all"
      />

      <div ref={contentRevealRef} className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none px-4 sm:px-6">
        <div className="revealed-content text-center">
          
          <h2 className="text-[clamp(2rem,10vw,7rem)] font-black uppercase leading-[0.92] tracking-tight text-white sm:text-[clamp(3rem,8vw,7rem)]">
            Study In India's <br />
            <span className="bg-gradient-to-r from-violet-300 via-violet-200 to-violet-200 bg-clip-text font-serif font-light italic text-transparent drop-shadow-[0_10px_30px_rgba(123,44,191,0.5)]">
              Silicon Valley
            </span>
          </h2>
        </div>
      </div>

      <div ref={portalVeilRef} className="absolute inset-0 z-20 overflow-hidden pointer-events-none">
        <svg className="h-full w-full" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice">
          <defs>
            <CyberGridTexture />
            <mask id="breakthroughMask">
              <rect width="100%" height="100%" fill="white" />
              <g ref={maskGroupRef}>
                <text
                  x="500"
                  y="450"
                  textAnchor="middle"
                  fill="black"
                  className="font-black"
                  style={{ fontSize: '140px', fontFamily: 'Impact, sans-serif' }}
                >
                  STUDY
                </text>
                <text
                  x="500"
                  y="580"
                  textAnchor="middle"
                  fill="black"
                  className="font-black"
                  style={{ fontSize: '100px', fontFamily: 'Impact, sans-serif' }}
                >
                  IN BENGALURU
                </text>
              </g>
            </mask>
            <radialGradient id="portalGlow">
              <stop offset="0%" stopColor="#d946ef" stopOpacity="0.8" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>

          <g mask="url(#breakthroughMask)">
            <rect width="100%" height="100%" fill="#1B0A21" />
            <circle cx="10%" cy="10%" r="30%" fill="#5d3a80" filter="blur(120px)" opacity="0.6" />
            <circle cx="90%" cy="90%" r="30%" fill="#9d4edd" filter="blur(120px)" opacity="0.4" />
            <rect width="100%" height="100%" fill="url(#cyberGridPattern)" />
          </g>

          <g mask="url(#breakthroughMask)" opacity="0.5">
            <circle cx="50%" cy="50%" r="40%" fill="url(#portalGlow)" />
          </g>

          <g className="opacity-40">
            <text
              x="500"
              y="450"
              textAnchor="middle"
              stroke="white"
              strokeWidth="2"
              fill="none"
              className="font-black"
              style={{ fontSize: '140px', fontFamily: 'Impact, sans-serif' }}
            >
              STUDY
            </text>
            <text
              x="500"
              y="580"
              textAnchor="middle"
              stroke="white"
              strokeWidth="2"
              fill="none"
              className="font-black"
              style={{ fontSize: '100px', fontFamily: 'Impact, sans-serif' }}
            >
              IN BENGALURU
            </text>
          </g>
        </svg>

        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 md:bottom-10">
          <span className="text-[0.6rem] font-bold uppercase tracking-[0.7em] text-white/50">
            Initiate Breakthrough
          </span>
          <ArrowDown className="h-4 w-4 animate-bounce text-violet-400" />
        </div>
      </div>
      </div>
    </section>
  )
}

const cardData = [
  { title: 'Universities', subtitle: 'GLOBAL ACCESS', icon: GraduationCap, color: 'from-violet-600 via-violet-400 to-violet-500', glow: 'rgba(59, 130, 246, 0.5)', path: '/services#universities' },
  { title: 'Colleges', subtitle: 'GLOBAL ACCESS', icon: School, color: 'from-violet-600 via-violet-400 to-violet-500', glow: 'rgba(168, 85, 247, 0.5)', path: '/services#colleges' },
  { title: 'Institutes', subtitle: 'GLOBAL ACCESS', icon: Library, color: 'from-orange-600 via-violet-400 to-orange-500', glow: 'rgba(249, 115, 22, 0.5)' },
  { title: 'Courses', subtitle: 'GLOBAL ACCESS', icon: BookOpen, color: 'from-violet-600 via-violet-400 to-violet-500', glow: 'rgba(16, 185, 129, 0.5)', path: '/services#courses' },
  { title: 'Online Courses', subtitle: 'GLOBAL ACCESS', icon: Globe, color: 'from-violet-600 via-violet-400 to-violet-500', glow: 'rgba(244, 63, 94, 0.5)' },
  { title: 'Short-term Programs', subtitle: 'GLOBAL ACCESS', icon: Clock, color: 'from-violet-700 via-violet-400 to-violet-600', glow: 'rgba(37, 99, 235, 0.5)' },
  { title: 'Part-time Jobs', subtitle: 'GLOBAL ACCESS', icon: Briefcase, color: 'from-violet-600 via-violet-400 to-violet-500', glow: 'rgba(139, 92, 246, 0.5)' },
  { title: 'Accommodation', subtitle: 'NEAR ME', icon: HomeIcon, color: 'from-violet-600 via-orange-400 to-violet-500', glow: 'rgba(245, 158, 11, 0.5)' },
  { title: 'Events', subtitle: 'GLOBAL ACCESS', icon: Calendar, color: 'from-violet-600 via-green-400 to-violet-500', glow: 'rgba(20, 184, 166, 0.5)' },
  { title: '1-on-1 Counselling', subtitle: 'FREE SESSION', icon: MessageCircle, color: 'from-violet-600 via-violet-400 to-violet-500', glow: 'rgba(6, 182, 212, 0.5)' },
  { title: 'Internships', subtitle: 'GLOBAL ACCESS', icon: UserCheck, color: 'from-violet-600 via-violet-400 to-violet-500', glow: 'rgba(217, 70, 239, 0.5)' },
  { title: 'Scholarships', subtitle: 'GLOBAL ACCESS', icon: Sparkles, color: 'from-violet-600 via-orange-400 to-violet-500', glow: 'rgba(234, 179, 8, 0.5)' },
];

function GlassCard({ item, onNavigate }) {
  const Icon = item.icon;
  const handleNavigate = () => {
    if (item.path) {
      onNavigate?.(item.path);
    }
  };

  return (
    <div
      onClick={handleNavigate}
      className={`group relative flex shrink-0 h-[270px] min-w-[84vw] snap-start flex-col overflow-hidden rounded-[1.75rem] border border-white/16 bg-[#2f1047]/92 p-4 shadow-[0_30px_70px_rgba(0,0,0,0.48)] backdrop-blur-3xl transition-all duration-700 hover:-translate-y-3 hover:border-white/45 hover:shadow-[0_35px_90px_rgba(0,0,0,0.6)] sm:h-[420px] sm:min-w-[320px] sm:p-8 md:min-w-[350px] lg:min-w-[350px] ${item.path ? 'cursor-pointer' : ''}`}
      role={item.path ? 'button' : undefined}
      tabIndex={item.path ? 0 : undefined}
      onKeyDown={(e) => {
        if (!item.path) return;
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleNavigate();
        }
      }}
    >
      <div className="absolute inset-0 z-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100">
        <div
          className="absolute -inset-[100%] animate-[spin_8s_linear_infinite] opacity-55"
          style={{ background: `conic-gradient(from 0deg, transparent 0%, ${item.glow || 'rgba(255,255,255,0.5)'} 50%, transparent 100%)` }}
        />
        <div className="absolute inset-[1.5px] rounded-[2.5rem] bg-[#251034]/92 backdrop-blur-3xl transition-colors duration-500" />
      </div>

      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 opacity-90"
        style={{
          background:
            'radial-gradient(circle at top left, rgba(213, 161, 255, 0.22), transparent 34%), radial-gradient(circle at top right, rgba(168, 85, 247, 0.18), transparent 28%), linear-gradient(180deg, rgba(95, 69, 114, 0.16) 0%, rgba(23, 15, 31, 0.16) 100%)',
        }}
      />

      <div className="relative z-10 flex items-start justify-between">
        <div className="relative flex h-20 w-20 items-center justify-center">
          <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${item.color} blur-2xl opacity-45 transition-opacity duration-500 group-hover:opacity-95`} />
          <div className="relative flex h-full w-full items-center justify-center rounded-3xl border border-white/26 bg-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_0_24px_rgba(168,85,247,0.18)] backdrop-blur-md transition-all duration-500 group-hover:scale-110 group-hover:border-white/55 group-hover:bg-white/15">
            <Icon className="text-white drop-shadow-[0_0_18px_rgba(255,255,255,0.55)] transition-transform duration-500 group-hover:rotate-12" size={28} strokeWidth={1.6} />
          </div>
          <div className="absolute -right-2 -top-2 h-4 w-4 border-r-2 border-t-2 border-white/40 transition-all duration-500 group-hover:-right-3 group-hover:-top-3 group-hover:border-white/90" />
          <div className="absolute -bottom-2 -left-2 h-4 w-4 border-b-2 border-l-2 border-white/40 transition-all duration-500 group-hover:-bottom-3 group-hover:-left-3 group-hover:border-white/90" />
        </div>
        <div className="flex flex-col items-end gap-1.5 opacity-45 transition-opacity duration-500 group-hover:opacity-100">
          <div className="h-1 w-1 rounded-full bg-white" />
          <div className="h-1 w-1 rounded-full bg-white" />
          <div className="h-1 w-1 rounded-full bg-white" />
        </div>
      </div>

      <div className="relative z-10 mt-6 flex flex-col gap-2 sm:mt-10 sm:gap-3">
        <div className="flex items-center gap-3">
          <div className="h-[2px] w-6 rounded-full bg-gradient-to-r from-white/85 to-transparent shadow-[0_0_12px_rgba(255,255,255,0.35)] transition-all duration-500 group-hover:w-12" />
          <p className="text-[9px] font-black uppercase tracking-[0.32em] text-white/72 transition-colors duration-500 group-hover:text-white sm:text-[10px] sm:tracking-[0.4em]">
            {item.subtitle}
          </p>
        </div>
        <h3 className="max-w-[10ch] text-[1.9rem] font-black italic leading-[0.95] tracking-tighter text-white drop-shadow-[0_0_18px_rgba(213,161,255,0.35)] transition-all duration-500 group-hover:translate-x-2 group-hover:text-violet-100 sm:max-w-none sm:text-3xl md:text-4xl">
          {item.title}
        </h3>
      </div>

      <div className="relative z-10 mt-auto w-full pt-4 sm:pt-6">
        <div className="relative mb-4 h-[1px] w-full overflow-hidden bg-white/14 sm:mb-6">
          <div className="absolute inset-y-0 left-0 w-1/2 -translate-x-[150%] bg-gradient-to-r from-transparent via-white/90 to-transparent transition-all duration-1000 ease-in-out group-hover:translate-x-[200%]" />
        </div>
        
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleNavigate();
          }}
          className="group/btn relative flex w-full items-center justify-between overflow-hidden rounded-2xl border border-white/18 bg-white/08 px-4 py-3 transition-all duration-500 hover:border-white/55 hover:bg-white hover:shadow-[0_0_34px_rgba(213,161,255,0.28)] sm:px-5 sm:py-3.5"
        >
          <span className="relative z-10 text-[9px] font-black uppercase tracking-[0.18em] text-white/78 transition-colors group-hover/btn:text-black sm:text-[10px] sm:tracking-[0.2em]">
            Initiate Access
          </span>
          <div className="relative z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/14 transition-colors group-hover/btn:bg-black/10 sm:h-8 sm:w-8">
            <ArrowRight size={12} className="text-white transition-transform duration-300 group-hover/btn:translate-x-1 group-hover/btn:text-black sm:size-[14px]" />
          </div>
        </button>
      </div>

      <div className="absolute -bottom-10 -right-10 z-0 h-32 w-32 opacity-15 transition-all duration-700 group-hover:-translate-x-4 group-hover:-translate-y-4 group-hover:scale-110 group-hover:opacity-45 sm:-bottom-12 sm:-right-12 sm:h-40 sm:w-40 md:opacity-12">
        <div className="grid h-full w-full grid-cols-5 grid-rows-5 gap-2">
          {[...Array(25)].map((_, i) => (
            <div key={i} className="rounded-full bg-white/95" />
          ))}
        </div>
      </div>
    </div>
  );
}

function Opportunities({ onNavigate }) {
  const triggerRef = useRef(null);
  const bannerRef = useRef(null);
  const cardsRef = useRef(null);

  useEffect(() => {
    if (isMobileViewport()) return;

    const ctx = gsap.context(() => {
      const totalWidth = cardsRef.current.scrollWidth;
      const scrollDistance = totalWidth - window.innerWidth + (window.innerWidth * 0.1);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerRef.current,
          start: 'top top',
          end: `+=${totalWidth}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            const progress = Math.min(1, Math.max(0, 1 - self.progress * 4));
            gsap.to(bannerRef.current, {
              opacity: progress,
              scale: 1 + self.progress * 0.2,
              filter: `blur(${self.progress * 20}px)`,
              duration: 0.1,
            });
          },
        },
      });

      tl.fromTo(
        cardsRef.current,
        { x: '80vw', opacity: 0 },
        { x: `-${scrollDistance}px`, opacity: 1, ease: 'none' }
      );
    }, triggerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={triggerRef}
      className="overflow-hidden border-y border-white/6 bg-[#170F1F]"
      style={{
        background:
          'radial-gradient(circle at 50% 18%, rgba(213, 161, 255, 0.16), transparent 34%), linear-gradient(180deg, #170F1F 0%, #220A36 100%)',
      }}
    >
      <section
        className="relative flex min-h-[72svh] w-full items-start overflow-hidden border-b border-white/6 py-8 md:h-screen md:items-center md:py-0"
        style={{
          background:
            'radial-gradient(circle at 50% 22%, rgba(168, 85, 247, 0.22) 0%, rgba(34, 10, 54, 0.92) 45%, rgba(23, 15, 31, 1) 100%)',
        }}
      >
        <div className="relative z-10 w-full px-4 md:hidden">
          <div className="mb-5 flex flex-col items-center text-center">
            <p className="mb-2 text-[0.65rem] font-bold uppercase tracking-[0.45em] text-white/45">
              Explore
            </p>
            <h2 className="opportunities-shimmer text-[2.3rem] font-black uppercase italic tracking-tighter text-white">
              Opportunities
            </h2>
            <p className="mt-2 text-[0.65rem] font-bold uppercase tracking-[0.4em] text-violet-200/50">
              Unlocking Potential
            </p>
          </div>
        </div>

        <div ref={bannerRef} className="absolute inset-0 z-0 hidden flex-col items-center justify-center pointer-events-none md:flex">
          <div className="mb-6 flex gap-6 opacity-20">
            <GraduationCap className="h-10 w-10 animate-pulse text-white" />
            <Sparkles className="h-10 w-10 animate-bounce text-white" />
          </div>
          <p className="mb-4 text-[clamp(1rem,4vw,2.25rem)] font-bold uppercase tracking-[0.45em] text-white/45">
            Explore
          </p>
          <h2 className="opportunities-shimmer text-[clamp(2.4rem,15vw,12rem)] font-black uppercase italic tracking-tighter sm:text-[clamp(4rem,15vw,12rem)] md:text-[14rem]">
            OPPORTUNITIES
          </h2>
          <p className="mt-4 text-center text-sm font-bold uppercase tracking-[1em] text-violet-200/50">
            Unlocking Potential
          </p>
        </div>

        <div className="relative z-10 flex w-full items-center">
          <div ref={cardsRef} className="flex gap-4 overflow-x-auto px-4 pb-4 pt-1 snap-x snap-mandatory sm:gap-6 sm:px-8 sm:pb-0 md:gap-10 md:px-[10vw] md:overflow-visible md:snap-none">
            {cardData.map((item, index) => (
              <GlassCard key={`${item.title}-${index}`} item={item} onNavigate={onNavigate} />
            ))}
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2 md:bottom-10">
          <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/20 animate-pulse">
            Slide to Navigate
          </p>
        </div>
      </section>
    </div>
  );
}
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
      <div aria-hidden="true" className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: 'radial-gradient(circle at top left, rgba(255,255,255,0.12), transparent 35%), radial-gradient(circle at bottom right, rgba(255,255,255,0.08), transparent 40%)' }}
      />

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
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStart(true); observer.disconnect() } },
      { threshold: 0.25 }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden border-y border-white/6 px-4 py-6 text-white sm:px-6 lg:px-8 sm:py-10"
      style={{
        background:
          'radial-gradient(circle at top right, rgba(213, 161, 255, 0.14), transparent 32%), linear-gradient(180deg, #1B0A21 0%, #220A36 100%)',
      }}
    >
      
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
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.75, ease: 'easeOut' }}
          className="relative overflow-hidden rounded-[2.8rem] border border-white/10 bg-white/[0.03] shadow-[0_24px_90px_rgba(0,0,0,0.45)]"
          style={{ willChange: 'transform, opacity' }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.14),transparent_55%)]" />
          <div className="relative z-10 px-5 py-10 sm:px-10 sm:py-14 lg:px-14 lg:py-16">
            

            
            <div className="mt-8 overflow-hidden rounded-full border border-white/10 bg-white/[0.04]">
              <div
                className="flex items-center gap-8 py-3 text-[0.7rem] font-semibold uppercase tracking-[0.5em] text-white/55 sm:text-xs"
                style={{ width: 'max-content', animation: 'ticker 18s linear infinite' }}
              >
                {[...stats, ...stats].map((item, index) => (
                  <span key={`${item.label}-${index}`} className="flex items-center gap-3 whitespace-nowrap">
                    <span className="h-1.5 w-1.5 rounded-full bg-violet-300 shadow-[0_0_18px_rgba(168,85,247,0.9)]" />
                    {item.label}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
              {stats.map((stat, index) => (
                <StatCard key={stat.label} stat={stat} index={index} start={start} />
              ))}
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
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: outerRef.current,
          start: 'top top',
          end: '+=300%',
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })

      tl.to(headerRef.current, {
        opacity: 0,
        scale: 0.8,
        filter: 'blur(20px)',
        y: -100,
        duration: 1,
      }, 0)
        .to(
          videoFrameRef.current,
          {
            scale: 1,
            width: '100vw',
            height: '100vh',
            maxWidth: '100%',
            maxHeight: '100%',
            borderRadius: '0px',
            ease: 'power2.inOut',
            duration: 2,
          },
          0.2
        )
        .to(
          videoRef.current,
          {
            scale: 1.4,
            duration: 3,
            ease: 'none',
          },
          0.2
        )
        .to(
          overlayRef.current,
          {
            backgroundColor: 'rgba(0,0,0,0.6)',
            duration: 1,
          },
          1
        )
        .fromTo(
          textContentRef.current,
          {
            y: 100,
            opacity: 0,
            scale: 0.9,
            filter: 'blur(15px)',
          },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            filter: 'blur(0px)',
            duration: 1.5,
            ease: 'expo.out',
          },
          1.5
        )
    }, outerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={outerRef}
      className="relative min-h-[100svh] h-screen w-full overflow-hidden border-y border-white/6"
      style={{
        background:
          'radial-gradient(circle at center, rgba(123, 44, 191, 0.16), transparent 44%), linear-gradient(180deg, #220A36 0%, #1B0A21 100%)',
      }}
    >
      <div
        ref={headerRef}
        className="absolute inset-0 z-20 flex flex-col items-center justify-center px-4 text-center"
      >
        <div className="mb-4 flex items-center gap-2 text-violet-500">
          <Sparkles size={16} className="animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.8em]">The Vision</span>
        </div>
        
      </div>

      <div className="flex h-full w-full items-center justify-center px-3 sm:px-4">
        <div
          ref={videoFrameRef}
      className="relative h-[50vh] w-[92vw] max-w-[420px] overflow-hidden rounded-[2rem] border border-white/10 shadow-[0_0_100px_rgba(168,85,247,0.2)] sm:w-[85vw] md:h-[300px] md:w-[500px] md:max-w-none"
        >
          <video
            ref={videoRef}
            src={graduateVideo}
            autoPlay
            muted
            loop
            playsInline
            className="h-full w-full object-cover"
          />
          <div ref={overlayRef} className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80" />
          <div
            ref={textContentRef}
            className="absolute inset-0 z-30 flex items-center justify-center p-4 sm:p-6 md:p-12"
          >
            <div className="w-full max-w-4xl px-2 text-center text-white">
              <p
                className="mx-auto max-w-3xl text-[0.95rem] font-medium leading-relaxed text-white/92 drop-shadow-[0_4px_18px_rgba(0,0,0,0.65)] sm:text-[1rem] md:text-[1.35rem] md:leading-[1.8]"
                style={{
                  textShadow: '0 3px 14px rgba(0,0,0,0.65), 0 0 28px rgba(213, 161, 255, 0.12)',
                }}
              >
                StudyInBengaluru.com is Bengaluru&apos;s largest portal for admissions, with the vision of making the city the educational hub of Asia. The focus is on building trust and credibility, increasing brand awareness, and attracting students from across India and abroad, alongside strategic college tie-ups, franchise sales, and user engagement.
              </p>
              <p
                className="mx-auto mt-6 max-w-2xl text-[0.9rem] leading-relaxed text-[#f4d9e2] sm:mt-8 sm:text-[0.95rem] md:text-[1.15rem]"
                style={{
                  textShadow: '0 2px 10px rgba(0,0,0,0.6), 0 0 20px rgba(214, 90, 138, 0.18)',
                }}
              >
                &quot;Education is the passport to the future, and StudyInBengaluru is your first-class ticket.&quot;
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute -bottom-20 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-violet-600/10 blur-[120px]" />
    </section>
  )
}
function VisionMissionCard({
  cardRef,
  wrapperClass = '',
  glowClass,
  bgClass,
  icon: Icon,
  iconClass,
  number,
  title,
  titleAccentClass,
  body,
  footer,
}) {
  return (
    <div ref={cardRef} className={`group relative ${wrapperClass}`}>
      <div className={`absolute -inset-1 rounded-[3rem] bg-gradient-to-r ${glowClass} opacity-20 blur-xl transition duration-1000 group-hover:opacity-45`} />
      <div className={`relative flex min-h-[360px] flex-col justify-between overflow-hidden rounded-[3rem] border border-white/8 ${bgClass} p-5 shadow-[0_20px_80px_rgba(8,15,31,0.45)] sm:min-h-[420px] sm:p-8 md:h-[500px] md:p-10`}>
        <div className="flex items-start justify-between">
          <div className={`rounded-2xl p-4 ${iconClass}`}>
            <Icon className={`h-8 w-8 ${titleAccentClass}`} />
          </div>
          <span className="text-4xl font-black italic text-white/14 sm:text-6xl">{number}</span>
        </div>
        <div>
          <h2 className="mb-5 text-3xl font-black uppercase tracking-tighter text-white sm:mb-6 sm:text-5xl">
            Our <br />
            <span className={titleAccentClass}>{title}</span>
          </h2>
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
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=150%',
          scrub: 1,
          pin: true,
          invalidateOnRefresh: true,
        },
      })

      tl.fromTo(
        visionCardRef.current,
        { x: '-100%', opacity: 0 },
        { x: '0%', opacity: 1, ease: 'power3.out' },
        0
      ).fromTo(
        missionCardRef.current,
        { x: '100%', opacity: 0 },
        { x: '0%', opacity: 1, ease: 'power3.out' },
        0
      )
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={containerRef}
      className="relative flex min-h-[88svh] w-full items-center justify-center overflow-hidden border-y border-white/6 py-12 md:h-screen md:py-0"
      style={{
        background:
          'radial-gradient(circle at 18% 18%, rgba(56, 189, 248, 0.12), transparent 26%), radial-gradient(circle at 82% 78%, rgba(251, 146, 60, 0.11), transparent 24%), radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.08), transparent 42%), linear-gradient(180deg, #120a1d 0%, #1a0b2e 55%, #0e0717 100%)',
      }}
    >
      <div
        className="absolute left-1/2 top-1/2 h-[860px] w-[860px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/10 blur-[160px] pointer-events-none"
      />
      <div
        className="absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.35) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="container relative z-10 mx-auto grid grid-cols-1 gap-6 px-4 md:grid-cols-2 md:gap-8 md:px-6">
        <VisionMissionCard
          cardRef={visionCardRef}
          glowClass="from-cyan-400 via-blue-500 to-violet-500"
          bgClass="bg-[#17192b]/92 border-cyan-300/12"
          icon={Target}
          iconClass="border border-cyan-300/15 bg-cyan-400/10"
          number="01"
          title="Vision"
          titleAccentClass="text-cyan-300"
          body="To transform Bengaluru into Asia&apos;s premier educational destination by revolutionizing admission processes, offering unparalleled career guidance, and fostering collaborative partnerships with top-tier institutions and industry leaders."
          footer={
            <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-cyan-300">
              <span>View Roadmap</span>
              <MoveRight size={16} />
            </div>
          }
        />
        <VisionMissionCard
          cardRef={missionCardRef}
          wrapperClass="mt-4 md:mt-24"
          glowClass="from-orange-400 via-rose-500 to-fuchsia-500"
          bgClass="bg-[#201126]/92 border-orange-300/12"
          icon={Rocket}
          iconClass="border border-orange-300/15 bg-orange-400/10"
          number="02"
          title="Mission"
          titleAccentClass="text-orange-300"
          body="To attract and empower students worldwide by providing access to world-class education in India, nurturing global talent, and creating a network of future leaders who drive innovation and positive change."
          footer={
            <div className="flex items-center gap-6">
              {['Empower', 'Nurture', 'Lead'].map((tag) => (
                <span key={tag} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-tighter text-orange-300/70">
                  <Sparkles size={10} /> {tag}
                </span>
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
      gsap.to(marqueeRef.current, {
        xPercent: -20,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.5,
        }
      })
      gsap.to(".floating-shape", {
        y: -100,
        rotation: 360,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          scrub: 1,
        }
      })
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: contentRef.current,
          start: "top 80%",
        }
      })

      tl.from(titleRef.current, {
        y: 100,
        opacity: 0,
        skewY: 7,
        duration: 1.2,
        ease: "power4.out"
      })
      .from(".cta-description", {
        opacity: 0,
        y: 20,
        duration: 0.8
      }, "-=0.8")
      .from(".interactive-portal", {
        scale: 0,
        opacity: 0,
        rotate: -20,
        duration: 1,
        ease: "back.out(1.7)"
      }, "-=0.5")

    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden border-t border-white/6 py-20 sm:py-24 lg:py-48"
      style={{
        background:
          'radial-gradient(circle at 50% 0%, rgba(213, 161, 255, 0.1), transparent 30%), linear-gradient(180deg, #170F1F 0%, #220A36 100%)',
      }}
    >
      
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

        
        <h2 
          ref={titleRef}
          className="mb-6 text-[clamp(1.8rem,7vw,4.5rem)] font-black leading-[0.95] tracking-tighter text-white sm:text-[clamp(2rem,6vw,4.5rem)]"
        >
          Start Your Educational Journey Today!
        </h2>

        <p className="cta-description mx-auto mb-12 max-w-2xl text-sm font-light text-white/70 sm:mb-16 sm:text-lg md:text-2xl">
          Get personalized guidance from our admission experts.
        </p>

        
        <div className="interactive-portal flex justify-center">
          <button
            type="button"
            onClick={() => onNavigate?.('/contact')}
            className="group relative flex h-32 w-32 items-center justify-center transition-transform duration-500 hover:scale-110 sm:h-48 sm:w-48 md:h-64 md:w-64"
          >
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

      <style>{`
        .outline-text {
          -webkit-text-stroke: 1px rgba(255, 255, 255, 0.2);
        }
      `}</style>
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






