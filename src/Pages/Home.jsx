import { memo, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  GraduationCap,
  Landmark,
  BookOpen,
  Laptop,
  TimerReset,
  BriefcaseBusiness,
  Home as HomeIcon,
  CalendarDays,
  Users,
  BadgeCheck,
  Sparkles,
  ShieldCheck,
  ArrowUpRight,
  ArrowDown,
  ArrowRight,
  Target,
  Rocket,
  School,
  BookMarked,
  Globe,
} from 'lucide-react'

import bangaloreVideo from '../assets/Bangalore.mp4'
import graduateVideo from '../assets/graduate.mp4'

gsap.registerPlugin(ScrollTrigger)
ScrollTrigger.config({
  ignoreMobileResize: true,
  autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load',
})


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
    accent: 'from-violet-500/35 via-fuchsia-500/20 to-transparent',
    glow: 'rgba(196, 181, 253, 0.28)',
    detail: 'Explore top-ranked universities with modern campus life, global exposure, and future-focused programs.',
  },
  {
    title: 'Colleges',
    icon: Landmark,
    accent: 'from-indigo-500/35 via-sky-500/20 to-transparent',
    glow: 'rgba(125, 211, 252, 0.26)',
    detail: 'Find the right college path with strong academics, career support, and student-friendly guidance.',
  },
  {
    title: 'Courses',
    icon: BookOpen,
    accent: 'from-cyan-500/35 via-teal-500/20 to-transparent',
    glow: 'rgba(103, 232, 249, 0.24)',
    detail: 'Browse courses that match your goals, from skill-building programs to career-oriented study tracks.',
  },
  {
    title: 'Online Courses',
    icon: Laptop,
    accent: 'from-sky-500/35 via-blue-500/20 to-transparent',
    glow: 'rgba(96, 165, 250, 0.24)',
    detail: 'Learn from anywhere with flexible online programs built for modern learners and busy families.',
  },
  {
    title: 'Short-Term Programs',
    icon: TimerReset,
    accent: 'from-amber-500/35 via-orange-500/20 to-transparent',
    glow: 'rgba(251, 191, 36, 0.24)',
    detail: 'Quick, practical programs for immediate growth, upskilling, and focused career upgrades.',
  },
  {
    title: 'Part-Time Jobs',
    icon: BriefcaseBusiness,
    accent: 'from-emerald-500/35 via-green-500/20 to-transparent',
    glow: 'rgba(74, 222, 128, 0.24)',
    detail: 'Discover student-friendly work options that help with experience, confidence, and finances.',
  },
  {
    title: 'Accommodation',
    icon: HomeIcon,
    accent: 'from-rose-500/35 via-pink-500/20 to-transparent',
    glow: 'rgba(244, 114, 182, 0.22)',
    detail: 'Find safe and comfortable places to stay with easy access, convenience, and peace of mind.',
  },
  {
    title: 'Events',
    icon: CalendarDays,
    accent: 'from-purple-500/35 via-violet-500/20 to-transparent',
    glow: 'rgba(168, 85, 247, 0.24)',
    detail: 'Attend events, webinars, and campus activities that make the journey more engaging and useful.',
  },
  {
    title: '1-on-1 Counselling',
    icon: Users,
    accent: 'from-fuchsia-500/35 via-pink-500/20 to-transparent',
    glow: 'rgba(236, 72, 153, 0.24)',
    detail: 'Get personal guidance for choosing the right path without the confusion and random internet chaos.',
  },
  {
    title: 'Internships',
    icon: BadgeCheck,
    accent: 'from-lime-500/35 via-emerald-500/20 to-transparent',
    glow: 'rgba(163, 230, 53, 0.22)',
    detail: 'Explore internship opportunities that build real experience and help careers start stronger.',
  },
]

const stats = [
  {
    value: 100, suffix: '+', label: 'Partner Colleges',
    note: 'A wide academic network with strong institutional reach.',
    icon: GraduationCap, accent: 'from-violet-500/35 via-fuchsia-500/15 to-transparent',
  },
  {
    value: 1000, suffix: '+', label: 'Students Enrolled',
    note: 'A growing student base with real admissions momentum.',
    icon: Users, accent: 'from-indigo-500/35 via-sky-500/15 to-transparent',
  },
  {
    value: 95, suffix: '%', label: 'Admission Success',
    note: 'Guidance that improves clarity, confidence, and outcomes.',
    icon: BadgeCheck, accent: 'from-cyan-500/35 via-teal-500/15 to-transparent',
  },
  {
    value: 50, suffix: '+', label: 'Franchises',
    note: 'A strong expansion footprint across key locations.',
    icon: Sparkles, accent: 'from-purple-500/35 via-violet-500/15 to-transparent',
  },
  {
    value: 24, suffix: '/7', label: 'Student Support',
    note: 'Always-on support for parents and students at every step.',
    icon: ShieldCheck, accent: 'from-rose-500/35 via-pink-500/15 to-transparent',
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
    <section ref={containerRef} className="relative h-screen w-full overflow-hidden bg-[#0a0510]">
      <video
        ref={videoRef}
        src={bangaloreVideo}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 z-0 h-full w-full object-cover brightness-[0.5] transition-all"
      />

      <div ref={contentRevealRef} className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
        <div className="revealed-content px-6 text-center">
          <p className="mb-6 font-mono text-sm uppercase tracking-[0.5em] text-white/70 drop-shadow-md">
            Welcome To
          </p>
          <h2 className="text-[clamp(3rem,8vw,7rem)] font-black uppercase leading-[0.85] tracking-tight text-white">
            Study India's <br />
            <span className="bg-gradient-to-r from-violet-300 via-fuchsia-200 to-cyan-200 bg-clip-text font-serif font-light italic text-transparent drop-shadow-[0_10px_30px_rgba(123,44,191,0.5)]">
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
            <rect width="100%" height="100%" fill="#1b0a21" />
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

        <div className="absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3">
          <span className="text-[0.6rem] font-bold uppercase tracking-[0.7em] text-white/50">
            Initiate Breakthrough
          </span>
          <ArrowDown className="h-4 w-4 animate-bounce text-fuchsia-400" />
        </div>
      </div>
    </section>
  )
}

const cardData = [
  { title: 'Colleges', icon: School, color: '#3b82f6', shadow: 'shadow-blue-500/20' },
  { title: 'Institutes', icon: BookMarked, color: '#a855f7', shadow: 'shadow-purple-500/20' },
  { title: 'Internships', icon: BriefcaseBusiness, color: '#f59e0b', shadow: 'shadow-orange-500/20' },
  { title: 'Courses', icon: Globe, color: '#10b981', shadow: 'shadow-emerald-500/20' },
  { title: 'Scholarships', icon: Sparkles, color: '#ec4899', shadow: 'shadow-pink-500/20' },
]

const GlassCard = memo(function GlassCard({ item, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -10, scale: 1.02 }}
      className="group relative min-w-[280px] h-[400px] rounded-[2.5rem] overflow-hidden p-[1px]"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent opacity-100 transition-all duration-500 group-hover:from-white/50" />

      <div className="relative flex h-full w-full flex-col justify-between rounded-[2.5rem] border border-white/5 bg-[#1a0b2e]/60 p-8 shadow-2xl backdrop-blur-2xl">
        <div
          className="absolute -top-20 -left-20 h-40 w-40 rounded-full opacity-0 blur-[50px] transition-opacity duration-500 group-hover:opacity-20"
          style={{ backgroundColor: item.color }}
        />

        <div
          className={`flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg transition-transform duration-500 group-hover:rotate-[10deg] group-hover:scale-110 ${item.shadow}`}
          style={{ background: `linear-gradient(135deg, ${item.color} 0%, #000 150%)` }}
        >
          <item.icon className="h-8 w-8 text-white" />
        </div>

        <div className="space-y-2">
          <h3 className="text-3xl font-bold tracking-tight text-white">{item.title}</h3>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">Global Access</p>
          <div
            className="h-[2px] w-12 bg-white/10 transition-all duration-700 group-hover:w-full"
            style={{ backgroundColor: `${item.color}44` }}
          />
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm font-semibold uppercase tracking-widest text-white/80">Explore</span>
          <motion.div
            whileTap={{ scale: 0.9 }}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-all duration-300 group-hover:bg-white group-hover:text-black"
          >
            <ArrowRight className="h-5 w-5" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
})

function Opportunities() {
  const containerRef = useRef(null)
  const triggerRef = useRef(null)
  const bannerRef = useRef(null)
  const cardsRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tween = gsap.fromTo(
        cardsRef.current,
        { x: '100vw', opacity: 0 },
        {
          x: '0vw',
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: triggerRef.current,
            start: 'top top',
            end: '+=2000',
            scrub: 0.6,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const progress = Math.min(1, Math.max(0, 1 - self.progress * 2))
              gsap.to(bannerRef.current, {
                opacity: progress,
                x: -self.progress * 100,
                filter: `blur(${self.progress * 10}px)`,
                duration: 0.1,
              })
            },
          },
        }
      )

      return () => tween.kill()
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={triggerRef} className="overflow-hidden bg-[#0f021a]">
      <section ref={containerRef} className="relative flex h-screen w-full items-center justify-center">
        <div ref={bannerRef} className="absolute inset-0 z-20 flex flex-col items-center justify-center px-4 text-center">
          <div className="mb-6 flex gap-4 opacity-50">
            <GraduationCap className="h-8 w-8 animate-bounce text-white" />
            <BookOpen className="h-8 w-8 animate-pulse text-white" />
          </div>
          <h2 className="text-7xl font-black uppercase italic tracking-tighter text-white md:text-9xl">
            Opportunities
          </h2>
          <p className="mt-4 text-xs font-bold uppercase tracking-[0.5em] text-purple-300">
            Scroll to Reveal Matrix
          </p>
        </div>

        <div ref={cardsRef} className="relative z-10 flex items-center gap-6 px-10">
          {cardData.map((item, index) => (
            <GlassCard key={item.title} item={item} index={index} />
          ))}
        </div>
      </section>
    </div>
  )
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
      className="group relative min-h-[260px] overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_20px_50px_rgba(0,0,0,0.35)]"
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
        <div className="mt-4 flex items-center justify-between text-[0.65rem] uppercase tracking-[0.34em] text-white/30">
          <span>Momentum</span>
          <ArrowUpRight className="h-4 w-4" />
        </div>
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
      className="relative overflow-hidden bg-[#1b0a21] px-4 py-6 text-white sm:px-6 lg:px-8 sm:py-10"
    >
      
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_left,rgba(168,85,247,0.28),transparent_26%),radial-gradient(circle_at_right,rgba(59,130,246,0.16),transparent_30%),radial-gradient(circle_at_top,rgba(236,72,153,0.12),transparent_28%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:72px_72px] opacity-18" />
        
        <div className="absolute left-[-8rem] top-[-6rem] h-72 w-72 rounded-full bg-violet-500/20 blur-3xl" style={{ animation: 'blobA 10s ease-in-out infinite' }} />
        <div className="absolute bottom-[-7rem] right-[-6rem] h-80 w-80 rounded-full bg-fuchsia-500/15 blur-3xl" style={{ animation: 'blobB 12s ease-in-out infinite' }} />
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
            <div className="mx-auto max-w-4xl text-center">
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5 }}
                className="text-[0.72rem] font-bold uppercase tracking-[0.55em] text-white/45"
              >
                Numbers that matter
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="mt-4 text-balance text-[clamp(2.2rem,5.5vw,5rem)] font-black uppercase leading-[0.9] tracking-[-0.05em]"
              >
                <span className="bg-gradient-to-r from-white via-violet-100 to-white bg-clip-text text-transparent">Built on</span>{' '}
                <span className="bg-gradient-to-r from-fuchsia-200 via-violet-300 to-sky-200 bg-clip-text text-transparent">Real Momentum</span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.65, delay: 0.08 }}
                className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/62 sm:text-base"
              >
                Every number here represents trust, scale, and a student journey that feels guided from first visit to final admission.
              </motion.p>
            </div>

            
            <div className="mt-8 overflow-hidden rounded-full border border-white/10 bg-white/[0.04]">
              <div
                className="flex items-center gap-8 py-3 text-[0.7rem] font-semibold uppercase tracking-[0.5em] text-white/55 sm:text-xs"
                style={{ width: 'max-content', animation: 'ticker 18s linear infinite' }}
              >
                {[...stats, ...stats].map((item, index) => (
                  <span key={`${item.label}-${index}`} className="flex items-center gap-3 whitespace-nowrap">
                    <span className="h-1.5 w-1.5 rounded-full bg-violet-300 shadow-[0_0_18px_rgba(192,132,252,0.9)]" />
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
  const outerRef   = useRef(null)
  const frameRef   = useRef(null)
  const contentRef = useRef(null)
  const titleRef   = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set([frameRef.current, contentRef.current, titleRef.current], { force3D: true, willChange: 'transform, opacity' })
      gsap.set(titleRef.current, { opacity: 0, y: 16 })
      gsap.set(frameRef.current, {
        scale: 0.22,
        borderRadius: '34px',
        transformOrigin: 'center center',
      })
      gsap.set(contentRef.current, { opacity: 0, y: 34, scale: 0.98 })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: outerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.0,
          invalidateOnRefresh: true,
        },
      })

      tl.to(titleRef.current, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }, 0)
      tl.to(frameRef.current, { scale: 0.34, duration: 0.45, ease: 'power2.inOut' }, 0.1)
      tl.to(frameRef.current, { scale: 0.52, duration: 0.55, ease: 'power2.inOut' }, 0.55)
      tl.to(frameRef.current, { scale: 0.72, duration: 0.65, ease: 'power2.inOut' }, 1.1)
      tl.to(frameRef.current, { scale: 0.90, duration: 0.65, ease: 'power2.inOut' }, 1.75)
      tl.to(frameRef.current, { scale: 1, borderRadius: '0px', duration: 0.7, ease: 'power2.inOut' }, 2.4)
      tl.to(contentRef.current, { opacity: 1, y: 0, scale: 1, duration: 0.65, ease: 'power3.out' }, 2.6)
    }, outerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={outerRef}
      className="relative bg-[#1b0a21] text-white"
      style={{ height: '190vh' }}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(244,114,182,0.16),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.12),transparent_30%)]" />
        
        <div className="absolute left-[-6rem] top-[-5rem] h-72 w-72 rounded-full bg-fuchsia-500/20 blur-3xl" style={{ animation: 'blobA 11s ease-in-out infinite' }} />
        <div className="absolute bottom-[-7rem] right-[-5rem] h-80 w-80 rounded-full bg-cyan-500/12 blur-3xl"  style={{ animation: 'blobB 13s ease-in-out infinite' }} />
      </div>

      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden px-4">
        <div className="relative z-20 mx-auto mb-10 max-w-4xl text-center">
          <p ref={titleRef} className="text-[0.72rem] font-bold uppercase tracking-[0.55em] text-white/40">Vision</p>
          <h2 className="mt-3 text-balance text-[clamp(2.3rem,5vw,4.8rem)] font-black uppercase leading-[0.92] tracking-[-0.05em]">
            <span className="bg-gradient-to-r from-white via-fuchsia-100 to-white bg-clip-text text-transparent">Study in Bengaluru</span>{' '}
            <span className="bg-gradient-to-r from-fuchsia-200 via-violet-300 to-cyan-200 bg-clip-text text-transparent">with Impact</span>
          </h2>
        </div>

        <div
          ref={frameRef}
          className="relative overflow-hidden bg-black shadow-[0_24px_90px_rgba(0,0,0,0.55)]"
          style={{ width: '100%', height: '100vh', transformOrigin: 'center center', willChange: 'transform, border-radius' }}
        >
          <video src={graduateVideo} autoPlay muted loop playsInline className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/12 via-black/18 to-black/32" />
          <div className="absolute left-5 top-5 rounded-full border border-white/15 bg-black/25 px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-white/70 backdrop-blur-sm">
            Vision reel
          </div>
          <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4">
            <div className="max-w-[18rem] rounded-2xl border border-white/12 bg-black/20 px-4 py-3 text-[0.62rem] font-semibold uppercase tracking-[0.35em] text-white/60 backdrop-blur-sm">
              Scroll to expand
            </div>
            <div className="h-2 w-2 rounded-full bg-yellow-200 shadow-[0_0_22px_rgba(250,204,21,0.95)]" />
          </div>

          <div
            ref={contentRef}
            className="absolute bottom-0 left-0 right-0 z-30 mx-auto max-w-[980px] px-4 pb-10"
            style={{ willChange: 'transform, opacity' }}
          >
            <div className="rounded-[1.8rem] bg-[#f9f9fb] px-6 py-7 text-[#1e0338] shadow-[0_20px_80px_rgba(0,0,0,0.35)] sm:px-8 sm:py-8">
              <p className="text-[0.95rem] leading-8 text-[#1e0338] sm:text-[1.02rem]">
                StudyInBengaluru.com is Bengaluru&apos;s largest portal for admissions, with the vision of
                making the city the educational hub of Asia. The focus is on building trust and credibility,
                increasing brand awareness, and attracting students from across India and abroad, alongside
                strategic college tie-ups, franchise sales, and user engagement.
              </p>
              <p className="mt-6 text-[0.92rem] leading-8 italic text-[#9b0f3d] sm:text-[1rem]">
                &quot;Education is the passport to the future, and StudyinBengaluru is your first-class ticket.&quot;
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}


function VisionMissionSection() {
  const sectionRef = useRef(null)
  const visionRef = useRef(null)
  const missionRef = useRef(null)
  const bgTextRef = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(missionRef.current, { y: '100%', opacity: 0, scale: 0.9 })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=150%',
          scrub: 0.5,
          pin: true,
          anticipatePin: 1,
        },
      })

      tl.to(visionRef.current, {
        y: '-120%',
        rotation: -5,
        opacity: 0,
        scale: 0.8,
        duration: 1,
        ease: 'power2.inOut',
      })
      .to(bgTextRef.current, {
        xPercent: -20,
        duration: 1,
      }, 0)
      .to(missionRef.current, {
        y: '0%',
        opacity: 1,
        scale: 1,
        duration: 1,
        ease: 'expo.out',
      }, '-=0.6')

    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden bg-[#08040d] text-white"
    >
      
      <div className="absolute inset-0 z-0">
        <div 
          ref={bgTextRef}
          className="absolute top-1/2 left-0 -translate-y-1/2 whitespace-nowrap text-[18rem] font-black uppercase tracking-tighter text-white/[0.02]"
        >
          INNOVATION • IMPACT • FUTURE • LEADERSHIP • GLOBAL • EXCELLENCE •
        </div>
        
        
        <div className="absolute top-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-violet-600/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-cyan-600/10 blur-[120px]" />
      </div>

      
      <div className="pointer-events-none absolute inset-0 z-[1] opacity-40">
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} color="#a855f7" />
          <MissionBackdropModel />
        </Canvas>
      </div>

      
      <div className="relative z-10 flex h-full items-center justify-center px-6">
        
        
        <div
          ref={visionRef}
          className="absolute w-full max-w-6xl"
        >
          <div className="relative overflow-hidden rounded-[3.5rem] border border-white/5 bg-white/[0.03] p-12 backdrop-blur-3xl md:p-24">
            <div className="absolute top-0 right-0 p-8">
               <Target className="h-20 w-20 text-fuchsia-500/20" />
            </div>
            
            <div className="flex flex-col gap-8 md:flex-row md:items-end">
              <div className="flex-1">
                <div className="mb-6 inline-block rounded-full bg-fuchsia-500/10 px-4 py-1 text-[10px] font-bold uppercase tracking-[0.3em] text-fuchsia-400">
                  The Visionary Goal
                </div>
                <h2 className="text-7xl font-black uppercase leading-[0.9] tracking-tighter md:text-9xl">
                  Our <br /> 
                  <span className="bg-gradient-to-r from-fuchsia-400 to-violet-500 bg-clip-text text-transparent">Vision</span>
                </h2>
              </div>
              <div className="flex-1 lg:pl-12">
                <p className="text-xl font-light leading-relaxed text-white/60 md:text-3xl">
                  To transform Bengaluru into <span className="font-bold text-white italic underline decoration-fuchsia-500/30">Asia's premier educational destination</span> by revolutionizing admission processes and fostering industry-leading partnerships.
                </p>
                <div className="mt-8 flex gap-2">
                  <div className="h-1 w-12 bg-fuchsia-500" />
                  <div className="h-1 w-4 bg-fuchsia-500/30" />
                </div>
              </div>
            </div>
          </div>
        </div>

        
        <div
          ref={missionRef}
          className="absolute w-full max-w-6xl"
        >
          <div className="relative overflow-hidden rounded-[3.5rem] border border-cyan-500/20 bg-[#0c1221]/80 p-12 backdrop-blur-3xl md:p-24 shadow-[0_0_100px_rgba(34,211,238,0.1)]">
            <div className="absolute bottom-0 left-0 p-8">
               <Rocket className="h-24 w-24 text-cyan-500/10" />
            </div>

            <div className="flex flex-col gap-8 md:flex-row md:items-end">
              <div className="flex-1">
                <div className="mb-6 inline-block rounded-full bg-cyan-500/10 px-4 py-1 text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-400">
                  Our Commitment
                </div>
                <h2 className="text-7xl font-black uppercase leading-[0.9] tracking-tighter md:text-9xl">
                  Our <br /> 
                  <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Mission</span>
                </h2>
              </div>
              <div className="flex-1 lg:pl-12">
                <p className="text-xl font-light leading-relaxed text-white/70 md:text-3xl">
                  To attract and empower students worldwide by providing <span className="font-bold text-white underline decoration-cyan-400/30">access to world-class education</span> in India, nurturing global talent and future leaders.
                </p>
                <div className="mt-10 flex gap-4">
                  {['Empower', 'Nurture', 'Lead'].map((word) => (
                    <span key={word} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-cyan-400/60">
                      <Sparkles className="h-3 w-3" /> {word}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30">
        <div className="flex flex-col items-center gap-2 text-white/20">
          <div className="h-12 w-[1px] bg-gradient-to-b from-white/40 to-transparent" />
          <span className="text-[10px] font-bold uppercase tracking-[0.5em]">Scroll Fast</span>
        </div>
      </div>
    </section>
  )
}


function FinalCTASection() {
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
      className="relative overflow-hidden bg-[#07020d] py-32 lg:py-48"
    >
      
      <div className="pointer-events-none absolute top-1/2 left-0 z-0 -translate-y-1/2 select-none opacity-10">
        <div ref={marqueeRef} className="flex whitespace-nowrap text-[15rem] font-black uppercase tracking-tighter text-violet-500">
          <span className="mx-10">Your Future Awaits</span>
          <span className="mx-10 text-transparent outline-text">Your Future Awaits</span>
          <span className="mx-10">Your Future Awaits</span>
        </div>
      </div>

      
      <div ref={bgShapeRef} className="pointer-events-none absolute inset-0 z-0">
        <div className="floating-shape absolute top-20 left-[10%] h-16 w-16 rounded-xl border border-fuchsia-500/30 bg-fuchsia-500/5 backdrop-blur-sm" />
        <div className="floating-shape absolute bottom-20 right-[15%] h-24 w-24 rounded-full border border-cyan-500/20 bg-cyan-500/5 backdrop-blur-sm" />
        <div className="absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/10 blur-[140px]" />
      </div>

      <div ref={contentRef} className="relative z-10 mx-auto max-w-5xl px-6 text-center">
        
        <div className="mb-10 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-6 py-2 backdrop-blur-md">
          <Sparkles className="h-4 w-4 text-fuchsia-400 animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/70">The Final Chapter</span>
        </div>

        
        <h2 
          ref={titleRef}
          className="mb-8 text-[clamp(2.5rem,8vw,6rem)] font-black uppercase leading-[0.85] tracking-tighter text-white"
        >
          Ready to <br />
          <span className="bg-gradient-to-r from-fuchsia-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
            Evolve?
          </span>
        </h2>

        <p className="cta-description mx-auto mb-16 max-w-xl text-lg font-light text-white/50 md:text-2xl">
          Don’t just dream about it. Step into Bengaluru’s most innovative educational ecosystem today.
        </p>

        
        <div className="interactive-portal flex justify-center">
          <a 
            href="#contact"
            className="group relative flex h-48 w-48 items-center justify-center transition-transform duration-500 hover:scale-110 md:h-64 md:w-64"
          >
            
            <div className="absolute inset-0 rounded-full border border-dashed border-white/20 animate-[spin_10s_linear_infinite]" />
            <div className="absolute inset-4 rounded-full border border-fuchsia-500/30 animate-[spin_6s_linear_infinite_reverse]" />
            
            
            <div className="relative flex h-full w-full flex-col items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-600 to-violet-700 p-2 text-white shadow-[0_0_50px_rgba(192,132,252,0.4)] transition-all group-hover:shadow-[0_0_80px_rgba(192,132,252,0.7)]">
              <span className="text-[0.65rem] font-bold uppercase tracking-widest opacity-70">Start Now</span>
              <span className="text-xl font-black uppercase md:text-2xl">Connect</span>
              <ArrowUpRight className="mt-2 h-6 w-6 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </div>
          </a>
        </div>

        
        <div className="mt-24 flex justify-center opacity-20">
          <div className="flex flex-col items-center gap-4">
             <div className="h-16 w-px bg-gradient-to-b from-white to-transparent" />
             <span className="text-[10px] font-bold uppercase tracking-[1em]">Scroll Up to Revisit</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .outline-text {
          -webkit-text-stroke: 1px rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </section>
  )
}

function Home() {
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
      <Opportunities />
      <ImpactNumbersSection />
      <VisionVideoSection />
      <VisionMissionSection />
      <FinalCTASection />
    </>
  )
}

export default Home

