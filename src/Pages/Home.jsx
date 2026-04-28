import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
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
  Target,
  Rocket,
} from 'lucide-react'

import hero1 from '../assets/hero1.jpg'
import hero2 from '../assets/hero2.jpg'
import graduateVideo from '../assets/graduate.mp4'

gsap.registerPlugin(ScrollTrigger)
ScrollTrigger.config({ ignoreMobileResize: true })

/* ─────────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────────── */

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

/* ─────────────────────────────────────────────────────────────────
   COUNT-UP HELPER
───────────────────────────────────────────────────────────────── */

function CountUp({ start, value, suffix }) {
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
}

/* ─────────────────────────────────────────────────────────────────
   SECTION 1 — HOME HERO (SHATTER)
───────────────────────────────────────────────────────────────── */

function HeroSection() {
  const sectionRef    = useRef(null)
  const frontRef      = useRef(null)
  const backRef       = useRef(null)
  const textOneRef    = useRef(null)
  const textTwoRef    = useRef(null)
  const pieceOneRef   = useRef(null)
  const pieceTwoRef   = useRef(null)
  const pieceThreeRef = useRef(null)
  const pieceFourRef  = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const front  = frontRef.current
      const back   = backRef.current
      const textOne = textOneRef.current
      const textTwo = textTwoRef.current
      const pieces = [
        pieceOneRef.current,
        pieceTwoRef.current,
        pieceThreeRef.current,
        pieceFourRef.current,
      ].filter(Boolean)

      const moves = [
        { x: '-28vw', y: '-28vh', rotate: -1.1 },
        { x:  '28vw', y: '-28vh', rotate:  1.1 },
        { x: '-28vw', y:  '28vh', rotate:  1.1 },
        { x:  '28vw', y:  '28vh', rotate: -1.1 },
      ]

      gsap.set(back, {
        position: 'absolute', inset: 0,
        width: '100%', height: '100%', objectFit: 'cover',
        scale: 1.04, opacity: 0,
        transformOrigin: 'center center',
        willChange: 'transform, opacity',
        force3D: true,
        backfaceVisibility: 'hidden',
      })

      gsap.set(front, {
        position: 'absolute', inset: 0,
        width: '100%', height: '100%', objectFit: 'cover',
        scale: 1, opacity: 1,
        transformOrigin: 'center center',
        willChange: 'transform, opacity',
        force3D: true,
        backfaceVisibility: 'hidden',
      })

      const piecePositions = [
        { top: '-4px',    left: '-4px',    backgroundPosition: '0% 0%',     zIndex: 30 },
        { top: '-4px',    right: '-4px',   backgroundPosition: '100% 0%',   zIndex: 29 },
        { bottom: '-4px', left: '-4px',    backgroundPosition: '0% 100%',   zIndex: 28 },
        { bottom: '-4px', right: '-4px',   backgroundPosition: '100% 100%', zIndex: 27 },
      ]
      pieces.forEach((el, i) => {
        gsap.set(el, {
          position: 'absolute',
          width: 'calc(50% + 8px)',
          height: 'calc(50% + 8px)',
          backgroundImage: `url(${hero1})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: '200% 200%',
          backgroundPosition: piecePositions[i].backgroundPosition,
          opacity: 0,
          x: 0, y: 0, rotate: 0,
          scale: 0.995,
          transformOrigin: 'center center',
          willChange: 'transform, opacity',
          force3D: true,
          backfaceVisibility: 'hidden',
          zIndex: piecePositions[i].zIndex,
          ...piecePositions[i],
        })
      })

      gsap.set([textOne, textTwo], {
        opacity: 0, y: 28, scale: 0.985,
        transformOrigin: 'center center',
      })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=300%',
          scrub: 1.15,
          pin: true,
          anticipatePin: 1,
          fastScrollEnd: true,
          invalidateOnRefresh: true,
        },
      })

      tl.to(back,   { opacity: 1, scale: 1, duration: 0.9, ease: 'sine.inOut' }, 0.18)
      tl.to(front,  { opacity: 0, duration: 0.8, ease: 'sine.inOut' }, 0.7)
      tl.to(pieces, { opacity: 1, scale: 1, duration: 0.5, ease: 'sine.out', stagger: 0.02 }, 0.06)
      pieces.forEach((piece, i) => {
        tl.to(piece, {
          x: moves[i].x, y: moves[i].y,
          rotate: moves[i].rotate, scale: 1.08, opacity: 1,
          duration: 1.9, ease: 'power2.inOut',
        }, 0.12)
      })
      tl.to(pieces, { opacity: 0, duration: 0.65, ease: 'sine.inOut', stagger: 0.02 }, 1.65)
      tl.to(textOne, { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power3.out' }, 1.15)
      tl.to({}, { duration: 1.25 }, 1.75)
      tl.to(textOne, { opacity: 0, y: -16, scale: 0.99, duration: 0.4, ease: 'power3.in' }, 2.8)
      tl.to(textTwo, { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power3.out' }, 2.92)

    }, sectionRef)

    // ✅ ctx.revert() kills all GSAP tweens AND removes the pin spacer div
    requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative h-screen w-full overflow-hidden bg-black"
    >
      <img ref={backRef} src={hero2} alt="" draggable="false"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <img ref={frontRef} src={hero1} alt="" draggable="false"
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div ref={pieceOneRef}   aria-hidden="true" className="absolute h-1/2 w-1/2"
        style={{ top: '-4px', left: '-4px', backgroundImage: `url(${hero1})`, backgroundRepeat: 'no-repeat', backgroundSize: '200% 200%', backgroundPosition: '0% 0%' }}
      />
      <div ref={pieceTwoRef}   aria-hidden="true" className="absolute h-1/2 w-1/2"
        style={{ top: '-4px', right: '-4px', backgroundImage: `url(${hero1})`, backgroundRepeat: 'no-repeat', backgroundSize: '200% 200%', backgroundPosition: '100% 0%' }}
      />
      <div ref={pieceThreeRef} aria-hidden="true" className="absolute h-1/2 w-1/2"
        style={{ bottom: '-4px', left: '-4px', backgroundImage: `url(${hero1})`, backgroundRepeat: 'no-repeat', backgroundSize: '200% 200%', backgroundPosition: '0% 100%' }}
      />
      <div ref={pieceFourRef}  aria-hidden="true" className="absolute h-1/2 w-1/2"
        style={{ bottom: '-4px', right: '-4px', backgroundImage: `url(${hero1})`, backgroundRepeat: 'no-repeat', backgroundSize: '200% 200%', backgroundPosition: '100% 100%' }}
      />

      <div className="pointer-events-none absolute inset-0 z-40 bg-gradient-to-b from-black/10 via-transparent to-black/20" />

      <div className="pointer-events-none absolute inset-0 z-50 flex items-center justify-center px-4 text-center">
        <div className="relative h-24 w-[min(92vw,60rem)] overflow-hidden sm:h-28">
          <h1 ref={textOneRef}
            className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-white via-amber-100 to-white bg-clip-text text-[clamp(1.6rem,3.2vw,4rem)] font-semibold tracking-[0.12em] text-transparent drop-shadow-[0_2px_16px_rgba(0,0,0,0.5)]"
          >
            Study in Bengaluru
          </h1>
          <h1 ref={textTwoRef}
            className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-cyan-200 via-sky-300 to-white bg-clip-text text-[clamp(1.6rem,3.2vw,4rem)] font-semibold tracking-[0.12em] text-transparent drop-shadow-[0_2px_16px_rgba(0,0,0,0.5)]"
          >
            Study in India&apos;s Silicon Valley
          </h1>
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────────
   SECTION 2 — OPPORTUNITIES (GLASS GRID)
───────────────────────────────────────────────────────────────── */

function Opportunities() {
  return (
    <section id="services"
      className="relative overflow-hidden bg-[#0a0712] px-4 py-20 text-white sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-[1400px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="text-center"
        >
          <p className="mb-3 text-[0.72rem] font-semibold tracking-[0.55em] text-white/45">
            OPPORTUNITIES
          </p>
          <h2 className="text-balance text-[clamp(2rem,4vw,4.25rem)] font-black uppercase leading-[0.92] tracking-[-0.04em]">
            <span className="bg-gradient-to-r from-white via-violet-200 to-violet-400 bg-clip-text text-transparent">
              Explore the
            </span>{' '}
            <span className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-sky-300 bg-clip-text text-transparent">
              Right Path
            </span>
          </h2>
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="mx-auto mt-5 h-px w-28 origin-center bg-gradient-to-r from-transparent via-violet-300 to-transparent"
          />
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.14 }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.08, delayChildren: 0.08 } },
          }}
          className="mt-14 grid gap-5 sm:grid-cols-2 xl:grid-cols-5"
        >
          {items.map((item) => {
            const Icon = item.icon
            return (
              <motion.article
                key={item.title}
                variants={{
                  hidden: { opacity: 0, y: 34, scale: 0.96 },
                  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
                }}
                whileHover={{ y: -10, scale: 1.02, transition: { type: 'spring', stiffness: 260, damping: 18 } }}
                className="group relative min-h-[250px] overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl"
              >
                <div aria-hidden="true"
                  className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{ background: `radial-gradient(circle at top left, ${item.glow}, transparent 40%), radial-gradient(circle at bottom right, rgba(255,255,255,0.08), transparent 45%)` }}
                />
                <motion.div aria-hidden="true"
                  className={`absolute inset-0 bg-gradient-to-br ${item.accent} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
                />
                <motion.div aria-hidden="true"
                  className="absolute -inset-24 opacity-0 blur-3xl group-hover:opacity-100"
                  animate={{ rotate: [0, 6, 0] }}
                  transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.10) 0%, transparent 55%)' }}
                />
                <div className="relative flex h-full flex-col">
                  <div className="absolute right-4 top-4 h-3 w-3 rounded-full bg-violet-300 shadow-[0_0_24px_rgba(192,132,252,0.95)]" />
                  <motion.div
                    className="mt-4 grid h-16 w-16 place-items-center rounded-2xl border border-white/10 bg-white/8 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                    whileHover={{ rotate: [0, -8, 8, 0], scale: 1.06 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Icon className="h-8 w-8 text-violet-100" />
                  </motion.div>
                  <div className="mt-6 flex flex-1 flex-col items-center justify-center text-center">
                    <h3 className="text-[1.08rem] font-extrabold uppercase tracking-[0.22em] text-white sm:text-[1.15rem]">
                      {item.title}
                    </h3>
                    <p className="mt-4 max-w-[14rem] text-[0.72rem] font-medium uppercase tracking-[0.34em] text-white/35">
                      Explore what opens next
                    </p>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileHover={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35 }}
                      className="mt-5 max-w-[15rem] text-sm leading-6 text-white/72"
                    >
                      {item.detail}
                    </motion.div>
                  </div>
                  <div className="mt-6 h-px w-full bg-gradient-to-r from-transparent via-white/12 to-transparent" />
                  <div className="mt-4 flex items-center justify-between text-[0.68rem] uppercase tracking-[0.35em] text-white/28">
                    <span>01</span>
                    <span>Discover</span>
                  </div>
                </div>
                <motion.div aria-hidden="true"
                  className="pointer-events-none absolute inset-0"
                  style={{ background: 'linear-gradient(115deg, transparent 20%, rgba(255,255,255,0.18) 45%, transparent 60%)' }}
                  initial={{ x: '-140%' }}
                  animate={{ x: '140%' }}
                  transition={{ duration: 4.8, repeat: Infinity, repeatDelay: 2.5, ease: 'easeInOut' }}
                />
              </motion.article>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────────
   SECTION 3 — IMPACT NUMBERS
───────────────────────────────────────────────────────────────── */

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
    <section ref={sectionRef}
      className="relative overflow-hidden bg-[#080612] px-4 py-20 text-white sm:px-6 lg:px-8"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.24),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.14),transparent_28%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:72px_72px] opacity-20" />
        <motion.div className="absolute left-[-8rem] top-[-6rem] h-72 w-72 rounded-full bg-violet-500/20 blur-3xl"
          animate={{ x: [0, 40, 0], y: [0, 30, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div className="absolute bottom-[-7rem] right-[-6rem] h-80 w-80 rounded-full bg-fuchsia-500/15 blur-3xl"
          animate={{ x: [0, -35, 0], y: [0, -20, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="relative mx-auto max-w-[1500px]">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.75, ease: 'easeOut' }}
          className="relative overflow-hidden rounded-[2.4rem] border border-white/10 bg-white/[0.03] shadow-[0_24px_90px_rgba(0,0,0,0.45)] backdrop-blur-2xl"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.14),transparent_55%)]" />
          <div className="relative z-10 px-5 py-14 sm:px-10 lg:px-14">
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
                className="mt-4 text-balance text-[clamp(2.4rem,6vw,5.2rem)] font-black uppercase leading-[0.9] tracking-[-0.05em]"
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

            <div className="mt-10 overflow-hidden rounded-full border border-white/10 bg-white/[0.04]">
              <motion.div
                className="flex w-[200%] items-center gap-8 py-3 text-[0.7rem] font-semibold uppercase tracking-[0.5em] text-white/55 sm:text-xs"
                animate={{ x: ['0%', '-50%'] }}
                transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
              >
                {[...stats, ...stats].map((item, index) => (
                  <span key={`${item.label}-${index}`} className="flex items-center gap-3 whitespace-nowrap">
                    <span className="h-1.5 w-1.5 rounded-full bg-violet-300 shadow-[0_0_18px_rgba(192,132,252,0.9)]" />
                    {item.label}
                  </span>
                ))}
              </motion.div>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
              {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <motion.article
                    key={stat.label}
                    initial={{ opacity: 0, y: 30, scale: 0.96 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, amount: 0.25 }}
                    transition={{ duration: 0.7, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={{ y: -12, rotateX: 8, rotateY: -8, scale: 1.02, transition: { type: 'spring', stiffness: 240, damping: 18 } }}
                    className="group relative min-h-[240px] overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_20px_50px_rgba(0,0,0,0.35)] backdrop-blur-xl"
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    <div aria-hidden="true" className={`absolute inset-0 bg-gradient-to-br ${stat.accent} opacity-0 transition-opacity duration-500 group-hover:opacity-100`} />
                    <div aria-hidden="true" className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                      style={{ background: 'radial-gradient(circle at top left, rgba(255,255,255,0.12), transparent 35%), radial-gradient(circle at bottom right, rgba(255,255,255,0.08), transparent 40%)' }}
                    />
                    <motion.div aria-hidden="true"
                      className="absolute -inset-16 opacity-0 blur-3xl group-hover:opacity-100"
                      animate={{ rotate: [0, 8, 0] }}
                      transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                      style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.11) 0%, transparent 58%)' }}
                    />
                    <div className="relative flex h-full flex-col">
                      <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-violet-300/70 to-transparent" />
                      <div className="mt-5 flex items-center justify-between">
                        <motion.div
                          className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-white/8 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                          whileHover={{ rotate: [0, -8, 8, 0], scale: 1.07 }}
                          transition={{ duration: 0.45 }}
                        >
                          <Icon className="h-6 w-6 text-violet-100" />
                        </motion.div>
                        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/15 px-3 py-1 text-[0.62rem] font-bold uppercase tracking-[0.32em] text-white/40">
                          <span>Live</span>
                          <span className="h-1.5 w-1.5 rounded-full bg-violet-300 shadow-[0_0_14px_rgba(192,132,252,0.95)]" />
                        </div>
                      </div>
                      <div className="mt-auto pt-8 text-center">
                        <div className="text-[clamp(3rem,5vw,4.8rem)] font-black leading-none tracking-[-0.06em] text-white">
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
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────────
   SECTION 4 — VISION VIDEO (CINEMATIC EXPANSION)
───────────────────────────────────────────────────────────────── */

function VisionVideoSection() {
  const outerRef   = useRef(null)
  const frameRef   = useRef(null)
  const contentRef = useRef(null)
  const titleRef   = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(titleRef.current, { opacity: 0, y: 16 })
      gsap.set(frameRef.current, {
        scale: 0.22,
        borderRadius: '34px',
        transformOrigin: 'center center',
        willChange: 'transform, border-radius',
      })
      gsap.set(contentRef.current, {
        opacity: 0, y: 34, scale: 0.98,
        willChange: 'transform, opacity',
      })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: outerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.2,
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

    // ✅ ctx.revert() cleans up all tweens and ScrollTriggers created inside
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={outerRef}
      className="relative bg-[#080612] text-white"
      style={{ height: '190vh' }}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(244,114,182,0.16),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.12),transparent_30%)]" />
        <motion.div className="absolute left-[-6rem] top-[-5rem] h-72 w-72 rounded-full bg-fuchsia-500/20 blur-3xl"
          animate={{ x: [0, 30, 0], y: [0, 25, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div className="absolute bottom-[-7rem] right-[-5rem] h-80 w-80 rounded-full bg-cyan-500/12 blur-3xl"
          animate={{ x: [0, -24, 0], y: [0, -18, 0], scale: [1, 1.06, 1] }}
          transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden px-4">
        <div className="relative z-20 mx-auto mb-10 max-w-4xl text-center">
          <p ref={titleRef}
            className="text-[0.72rem] font-bold uppercase tracking-[0.55em] text-white/40"
          >
            Vision
          </p>
          <h2 className="mt-3 text-balance text-[clamp(2.3rem,5vw,4.8rem)] font-black uppercase leading-[0.92] tracking-[-0.05em]">
            <span className="bg-gradient-to-r from-white via-fuchsia-100 to-white bg-clip-text text-transparent">
              Study in Bengaluru
            </span>{' '}
            <span className="bg-gradient-to-r from-fuchsia-200 via-violet-300 to-cyan-200 bg-clip-text text-transparent">
              with Impact
            </span>
          </h2>
        </div>

        <div
          ref={frameRef}
          className="relative overflow-hidden bg-black shadow-[0_24px_90px_rgba(0,0,0,0.55)]"
          style={{ width: '100%', height: '100vh', transformOrigin: 'center center' }}
        >
          <video src={graduateVideo} autoPlay muted loop playsInline
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.12),rgba(0,0,0,0.18),rgba(0,0,0,0.32))]" />
          <div className="absolute left-5 top-5 rounded-full border border-white/15 bg-black/25 px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-white/70 backdrop-blur-md">
            Vision reel
          </div>
          <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4">
            <div className="max-w-[18rem] rounded-2xl border border-white/12 bg-black/20 px-4 py-3 text-[0.62rem] font-semibold uppercase tracking-[0.35em] text-white/60 backdrop-blur-md">
              Scroll to expand
            </div>
            <div className="h-2 w-2 rounded-full bg-yellow-200 shadow-[0_0_22px_rgba(250,204,21,0.95)]" />
          </div>

          <div ref={contentRef}
            className="absolute bottom-0 left-0 right-0 z-30 mx-auto max-w-[980px] px-4 pb-10"
          >
            <div className="rounded-[1.8rem] bg-[#ead8ed] px-6 py-7 text-[#2d1550] shadow-[0_20px_80px_rgba(0,0,0,0.35)] sm:px-8 sm:py-8">
              <p className="text-[0.95rem] leading-8 text-[#2d1550] sm:text-[1.02rem]">
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

/* ─────────────────────────────────────────────────────────────────
   SECTION 5 — VISION & MISSION (LAYERED STACKING)
───────────────────────────────────────────────────────────────── */

function VisionMissionSection() {
  const sectionRef = useRef(null)
  const missionRef = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(missionRef.current, { y: '100vh' })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=200%',
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })

      tl.fromTo(missionRef.current,
        { y: '100vh' },
        { y: '0vh', ease: 'none', duration: 1 }
      )
    }, sectionRef)

    // ✅ ctx.revert() removes the pin spacer and kills the ScrollTrigger
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden bg-[#080612] text-white"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-violet-600/10 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-fuchsia-600/10 blur-[120px]" />
      </div>

      <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-8">
        <div className="relative w-full max-w-6xl overflow-hidden rounded-[3.5rem] border border-white/10 bg-white/[0.02] p-8 md:p-20 shadow-2xl backdrop-blur-3xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-500 to-violet-600 shadow-lg shadow-fuchsia-500/20">
                <Target className="h-8 w-8 text-white" />
              </div>
              <p className="mb-2 text-[0.7rem] font-bold uppercase tracking-[0.6em] text-fuchsia-400">
                The Future State
              </p>
              <h2 className="text-[clamp(2.5rem,5vw,4.5rem)] font-black uppercase leading-none tracking-tight text-white">
                Our{' '}
                <span className="bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">Vision</span>
              </h2>
            </div>
            <div>
              <p className="text-lg font-light leading-relaxed text-white/70 md:text-2xl">
                To transform Bengaluru into{' '}
                <span className="font-medium text-white">Asia&apos;s premier educational destination</span>{' '}
                by revolutionizing admission processes, offering unparalleled career guidance, and fostering
                collaborative partnerships with top-tier institutions and industry leaders.
              </p>
              <div className="mt-8 h-px w-24 bg-fuchsia-500/50" />
            </div>
          </div>
        </div>
      </div>

      <div
        ref={missionRef}
        className="absolute inset-0 z-20 flex items-center justify-center p-4 sm:p-8"
      >
        <div className="relative w-full max-w-6xl overflow-hidden rounded-[3.5rem] border border-white/10 bg-[#120a1f] p-8 md:p-20 shadow-[0_-20px_80px_rgba(0,0,0,0.5)]">
          <div className="absolute -top-24 left-1/2 h-48 w-1/2 -translate-x-1/2 bg-sky-500/20 blur-[80px]" />
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 shadow-lg shadow-cyan-500/20">
                <Rocket className="h-8 w-8 text-white" />
              </div>
              <p className="mb-2 text-[0.7rem] font-bold uppercase tracking-[0.6em] text-cyan-400">
                Our Daily Commitment
              </p>
              <h2 className="text-[clamp(2.5rem,5vw,4.5rem)] font-black uppercase leading-none tracking-tight text-white">
                Our{' '}
                <span className="bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">Mission</span>
              </h2>
            </div>
            <div>
              <p className="text-lg font-light leading-relaxed text-white/70 md:text-2xl">
                To attract and empower students worldwide by providing{' '}
                <span className="font-medium text-white">access to world-class education</span> in India,
                nurturing global talent, and creating a network of future leaders who drive innovation and
                positive change.
              </p>
              <div className="mt-8 h-px w-24 bg-cyan-500/50" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────────
   ROOT EXPORT
   ✅ KEY FIX: useEffect here kills ALL remaining ScrollTriggers
   and forces a scroll reset when this page unmounts (navigating away).
   This prevents pinned spacer divs and stale triggers from
   leaking into the About/Services/Contact pages.
───────────────────────────────────────────────────────────────── */

function Home() {
  useEffect(() => {
    // Scroll to top when Home mounts so pins start correctly
    window.scrollTo(0, 0)

    return () => {
      // Kill every ScrollTrigger when leaving Home
      ScrollTrigger.getAll().forEach((t) => t.kill())
      // Clear any inline styles GSAP may have left on body/html
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
    </>
  )
}

export default Home
