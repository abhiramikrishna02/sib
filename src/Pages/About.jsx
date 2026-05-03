import { useLayoutEffect, useRef, Suspense, Component, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, ContactShadows, useGLTF, OrbitControls, PerspectiveCamera, Float as DreiFloat } from '@react-three/drei';
import { Landmark, BookOpen, Building2, MousePointer2, Zap, GraduationCap, Headset, MapPin, BadgeCheck } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';

import img1 from '../assets/img1.jpg';
import img2 from '../assets/img2.jpg';
import img3 from '../assets/img3.jpg';
import img4 from '../assets/img4.jpg';
import img5 from '../assets/img5.jpg';
import img6 from '../assets/img6.jpg';

gsap.registerPlugin(ScrollTrigger);

const MOBILE_QUERY = '(max-width: 767px)';

function isMobileViewport() {
  return typeof window !== 'undefined' && window.matchMedia(MOBILE_QUERY).matches;
}

/* ── ERROR BOUNDARY ─────────────────────────────────────────────── */
class CanvasErrorBoundary extends Component {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) return <div className="hidden" />;
    return this.props.children;
  }
}

const aboutCards = [
  {
    title: 'Diverse Programs',
    desc: 'Explore a wide range of undergraduate, postgraduate, and doctoral programs in various disciplines.',
    icon: BookOpen,
    color: 'from-fuchsia-300 to-violet-500',
    shadow: 'shadow-fuchsia-500/20',
    panel: 'from-slate-900/88 via-fuchsia-950/78 to-violet-900/82',
    border: 'border-fuchsia-300/20',
  },
  {
    title: 'Top Institutions',
    desc: 'Access to premier universities and colleges across Bengaluru with diverse program offerings.',
    icon: Landmark,
    color: 'from-cyan-300 to-violet-500',
    shadow: 'shadow-cyan-500/20',
    panel: 'from-slate-900/88 via-indigo-950/80 to-slate-950/92',
    border: 'border-cyan-300/18',
  },
  {
    title: 'City Advantages',
    desc: "Benefit from Bengaluru's tech ecosystem, cultural diversity, and excellent career opportunities.",
    icon: Building2,
    color: 'from-orange-300 to-rose-500',
    shadow: 'shadow-orange-500/20',
    panel: 'from-stone-900/88 via-rose-950/80 to-slate-950/92',
    border: 'border-orange-300/18',
  },
]

const bengaluruData = [
  { title: 'Innovation Hub', desc: "India's Silicon Valley, a global leader in IT, biotechnology, and innovation.", img: img1, color: 'from-violet-600/20' },
  { title: 'Global Opportunities', desc: 'A thriving economy and multinational companies, the perfect launchpad for a career.', img: img2, color: 'from-violet-600/20' },
  { title: 'Top Institutions', desc: 'Home to prestigious universities offering world-class education for every student.', img: img3, color: 'from-violet-600/20' },
  { title: 'Cultural Melting Pot', desc: 'A vibrant mix of cultures and traditions, making it a welcoming city for everyone.', img: img4, color: 'from-orange-600/20' },
  { title: 'Affordable Living', desc: 'High quality of life at a reasonable cost for students and professionals alike.', img: img5, color: 'from-violet-600/20' },
  { title: 'Thriving Ecosystem', desc: 'From startups to giants, a dynamic ecosystem for learning and growth.', img: img6, color: 'from-violet-600/20' },
]

function AboutCardsSection() {
  const sectionRef = useRef(null)
  const isMobile = isMobileViewport()

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const cards = Array.from(sectionRef.current?.querySelectorAll('.about-card') || [])
      if (!cards.length) return

      gsap.set(cards, {
        y: window.innerHeight,
        scale: 0.4,
        opacity: 0,
        rotationX: 45,
        transformOrigin: 'center bottom',
      })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=200%',
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      })

      tl.to(cards[1], { y: 0, scale: isMobile ? 1 : 1.1, opacity: 1, rotationX: 0, duration: 1, ease: 'power2.out' })
        .to(cards[0], { y: isMobile ? 20 : 40, scale: isMobile ? 0.97 : 0.95, opacity: 1, rotationX: 0, rotationZ: -6, duration: 1, ease: 'power2.out' }, '-=0.4')
        .to(cards[2], { y: isMobile ? 20 : 40, scale: isMobile ? 0.97 : 0.95, opacity: 1, rotationX: 0, rotationZ: 6, duration: 1, ease: 'power2.out' }, '-=0.8')
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const handleMouseMove = (e) => {
    if (isMobileViewport()) return
    const card = e.currentTarget
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2

    gsap.to(card, {
      x: x * 0.1,
      y: y * 0.1,
      rotationY: x * 0.05,
      rotationX: -y * 0.05,
      duration: 0.5,
      ease: 'power2.out',
    })
  }

  const handleMouseLeave = (e) => {
    if (isMobileViewport()) return
    gsap.to(e.currentTarget, {
      x: 0,
      y: 0,
      rotationY: 0,
      rotationX: 0,
      duration: 0.5,
      ease: 'power2.out',
    })
  }

  return (
    <section
      ref={sectionRef}
      className="relative -mt-4 flex min-h-[84svh] w-full items-center justify-center overflow-hidden py-4 md:-mt-6 md:min-h-[92svh] md:py-0"
      style={{
        perspective: '2000px',
        background:
          'radial-gradient(circle at 50% 20%, rgba(168, 85, 247, 0.24), transparent 28%), radial-gradient(circle at 15% 35%, rgba(34, 211, 238, 0.12), transparent 22%), radial-gradient(circle at 85% 32%, rgba(251, 146, 60, 0.1), transparent 20%), linear-gradient(180deg, #431f60 0%, #38194f 52%, #241034 100%)',
      }}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/2 top-1/2 h-[860px] w-[860px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-400/14 blur-[170px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:84px_84px] opacity-[0.16]" />
      </div>
      {/* 
        Mobile: single column stacked cards, each full-width
        Tablet+: 3-column grid (original layout)
      */}
      <div className="relative z-10 flex w-full max-w-6xl flex-col gap-4 px-4 sm:px-6 md:grid md:grid-cols-3 md:gap-2">
        {aboutCards.map((card, i) => (
          <div
            key={card.title}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={`about-card group relative flex flex-col items-center rounded-[2rem] border bg-gradient-to-br ${card.panel} ${card.border} p-6 text-center shadow-2xl shadow-black/25 backdrop-blur-2xl will-change-transform sm:p-8 md:rounded-[3.5rem] md:p-12 ${
              i === 1 ? 'z-20' : 'z-10'
            }`}
          >
            <div className="absolute inset-0 rounded-[inherit] bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.12),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(255,255,255,0.05),_transparent_34%)] opacity-80" />
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/8 blur-[44px] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <div className={`mb-5 flex h-16 w-16 items-center justify-center rounded-[1.25rem] bg-gradient-to-br ${card.color} shadow-2xl ${card.shadow} transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6 sm:mb-8 sm:h-24 sm:w-24 sm:rounded-[2rem]`}>
              <card.icon className="h-8 w-8 text-white sm:h-12 sm:w-12" />
            </div>
            <h3 className="mb-3 text-lg font-black uppercase tracking-tight text-white sm:mb-6 sm:text-2xl md:text-3xl">{card.title}</h3>
            <p className="text-sm font-light leading-relaxed text-white/68 sm:text-lg">{card.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ── BACKGROUND PARTICLES ────────────────────── */
const features = [
  {
    title: 'Top Institutions',
    desc: 'Access to premier universities and colleges across Bengaluru with diverse program offerings.',
    icon: GraduationCap,
    color: 'from-violet-500 to-violet-400',
  },
  {
    title: 'Diverse Programs',
    desc: 'Explore a wide range of undergraduate, postgraduate, and doctoral disciplines.',
    icon: BookOpen,
    color: 'from-violet-500 to-violet-400',
  },
  {
    title: 'City Advantages',
    desc: "Benefit from Bengaluru's tech ecosystem, cultural diversity, and career opportunities.",
    icon: MapPin,
    color: 'from-violet-500 to-violet-400',
  },
  {
    title: 'Expert Guidance',
    desc: 'Get personalized consultations and end-to-end support from industry pros.',
    icon: BadgeCheck,
    color: 'from-orange-500 to-violet-400',
  },
]

function WhyChooseSection() {
  const containerRef = useRef(null)
  const coreRef = useRef(null)
  const orbitalRef = useRef(null)
  const portalFlashRef = useRef(null)
  const isMobile = isMobileViewport()

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray('.why-card')
      const cardContents = gsap.utils.toArray('.why-card-content')

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=320%',
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      })

      tl.fromTo(
        coreRef.current,
        { scale: 0, opacity: 0, rotateY: -90 },
        { scale: 1, opacity: 1, rotateY: 0, duration: 1.5, ease: 'power4.out' }
      )

      tl.to(
        orbitalRef.current,
        {
          rotate: 360,
          scale: 1.02,
          duration: 3,
          ease: 'none',
        },
        'spin'
      )

      gsap.set(cardContents, { rotate: 0, clearProps: 'transform' })

      cardContents.forEach((cardContent, index) => {
        tl.to(
          cardContent,
          {
            rotate: 0,
            y: index === 1 ? -12 : 12,
            duration: 3,
            ease: 'none',
          },
          'spin'
        )
      })

      tl.to(coreRef.current, {
        rotateY: 180,
        scale: 1.1,
        duration: 1.2,
        ease: 'back.inOut(1.7)',
      }, '+=0.2')

      tl.to(coreRef.current, {
        scale: 40,
        duration: 2,
        ease: 'expo.in',
      }, 'zoom')

      tl.to(cards, { opacity: 0, scale: 0, duration: 1 }, 'zoom')
      tl.to('.bg-glow', { opacity: 0, scale: 0, duration: 1 }, 'zoom')

      tl.to(portalFlashRef.current, {
        opacity: 1,
        duration: 0.5,
        backgroundColor: '#1b1028',
      }, 'zoom+=1.5')
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={containerRef}
      className="relative flex min-h-[92svh] w-full items-center justify-center overflow-hidden bg-[#431f60] perspective-1000 py-10 md:min-h-[96svh] md:py-0"
      style={{ perspective: '2000px' }}
    >
      <div ref={portalFlashRef} className="absolute inset-0 z-[100] opacity-0 pointer-events-none" />

      <div className="bg-glow absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/10 blur-[180px]" />

      <div className="relative flex h-full w-full items-center justify-center">
        {/* 
          Mobile scale: 0.38 → fits 4 orbital cards on small screens
          sm: 0.52
          md: 0.82
          lg+: 1
        */}
        <div
          ref={orbitalRef}
          className="relative flex h-[620px] w-[620px] items-center justify-center preserve-3d"
          style={{ transform: `scale(${isMobile ? 0.38 : 0.65})` }}
        >
          {/* Use inline style for the initial scale so GSAP can animate from it */}
          <style>{`
            @media (min-width: 480px)  { .orbital-inner { transform: scale(0.52) !important; } }
            @media (min-width: 640px)  { .orbital-inner { transform: scale(0.65) !important; } }
            @media (min-width: 768px)  { .orbital-inner { transform: scale(0.82) !important; } }
            @media (min-width: 1024px) { .orbital-inner { transform: scale(1)    !important; } }
          `}</style>

          <div ref={coreRef} className="relative z-50 preserve-3d h-64 w-64 md:h-80 md:w-80">
            <div className="backface-hidden absolute inset-0 flex flex-col items-center justify-center rounded-full border border-white/35 bg-gradient-to-br from-[#2b133f]/92 via-[#1f1735]/88 to-[#120a1f]/94 backdrop-blur-3xl shadow-[0_0_50px_rgba(88,28,135,0.18)]">
              <h2 className="text-center text-xl font-black uppercase tracking-tighter text-white md:text-3xl">
                Why Choose <br />
                <span className="text-violet-400 underline decoration-violet-500/50 underline-offset-8">StudyIn</span><br />
                Bengaluru?
              </h2>
            </div>

            <div className="backface-hidden absolute inset-0 flex items-center justify-center rounded-full border-2 border-violet-300/70 bg-gradient-to-br from-[#1f1432] via-[#311a4b] to-[#130b22] shadow-[0_0_80px_rgba(168,85,247,0.28)]" style={{ transform: 'rotateY(180deg)' }}>
              <span className="animate-pulse text-2xl font-bold italic tracking-widest text-white">Why Bengaluru?</span>
            </div>
          </div>

          {features.map((f, i) => {
            const positions = [
              { top: '50%', left: '50%', transform: 'translate(-50%, -215%)' },
              { top: '50%', left: '50%', transform: 'translate(112%, -50%)' },
              { top: '50%', left: '50%', transform: 'translate(-50%, 115%)' },
              { top: '50%', left: '50%', transform: 'translate(-212%, -50%)' },
            ]
            const Icon = f.icon
            return (
              <div
                key={f.title}
                className="why-card absolute z-40"
                style={{
                  width: '300px',
                  ...positions[i],
                }}
              >
                <div className="why-card-content preserve-3d">
                  <div className={`rounded-3xl bg-gradient-to-br ${f.color} p-[1.5px] shadow-2xl shadow-black/15`}>
                    <div className="rounded-[calc(1.5rem-1px)] bg-[#140b1f]/92 p-6 backdrop-blur-2xl">
                      <div className={`mb-3 inline-flex rounded-xl bg-gradient-to-br ${f.color} p-2.5`}>
                        <Icon className="text-white" size={22} />
                      </div>
                      <h3 className="mb-2 text-lg font-bold uppercase text-white">{f.title}</h3>
                      <p className="text-sm leading-relaxed text-white/66">{f.desc}</p>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function WhyBengaluruSection() {
  const triggerRef = useRef(null)
  const contentRef = useRef(null)

  const slides = [
    {
      title: 'Innovation Hub',
      desc: "Bengaluru is India's Silicon Valley, a global leader in IT, biotechnology, and innovation, offering unparalleled opportunities for tech enthusiasts.",
      color: 'from-blue-600',
      glow: 'rgba(37, 99, 235, 0.2)',
      img: img1,
    },
    {
      title: 'Global Opportunities',
      desc: 'With its thriving economy and multinational companies, Bengaluru is the perfect launchpad for a global career.',
      color: 'from-fuchsia-600',
      glow: 'rgba(192, 38, 211, 0.2)',
      img: img2,
    },
    {
      title: 'Top Institutions',
      desc: 'Home to prestigious universities and colleges offering diverse courses, Bengaluru ensures world-class education for every student.',
      color: 'from-violet-600',
      glow: 'rgba(124, 58, 237, 0.2)',
      img: img3,
    },
    {
      title: 'Cultural Melting Pot',
      desc: 'Experience a vibrant mix of cultures, traditions, and communities, making Bengaluru a welcoming city for everyone.',
      color: 'from-orange-500',
      glow: 'rgba(249, 115, 22, 0.2)',
      img: img4,
    },
    {
      title: 'Affordable Living',
      desc: 'Enjoy a high quality of life at a reasonable cost, making Bengaluru an ideal destination for students and professionals alike.',
      color: 'from-emerald-500',
      glow: 'rgba(16, 185, 129, 0.2)',
      img: img5,
    },
    {
      title: 'Thriving Ecosystem',
      desc: 'From startups to established giants, Bengaluru offers a dynamic ecosystem for learning, networking, and growth.',
      color: 'from-rose-500',
      glow: 'rgba(225, 29, 72, 0.2)',
      img: img6,
    },
  ]

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray('.bengaluru-slide')

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerRef.current,
          start: 'top top',
          end: () => `+=${contentRef.current.scrollWidth}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })

      tl.to(contentRef.current, {
        x: () => -(contentRef.current.scrollWidth - window.innerWidth),
        ease: 'none',
      })

      items.forEach((slide) => {
        const title = slide.querySelector('h3')
        const img = slide.querySelector('.slide-img')
        const num = slide.querySelector('.bg-number')
        const text = slide.querySelector('p')

        gsap.fromTo(
          [title, text],
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.1,
            scrollTrigger: {
              trigger: slide,
              containerAnimation: tl,
              start: 'left 85%',
              end: 'left 35%',
              scrub: true,
            },
          }
        )

        gsap.to(num, {
          x: -100,
          scrollTrigger: {
            trigger: slide,
            containerAnimation: tl,
            start: 'left right',
            end: 'right left',
            scrub: true,
          },
        })

        gsap.fromTo(
          img,
          { scale: 0.85, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            scrollTrigger: {
              trigger: slide,
              containerAnimation: tl,
              start: 'left 95%',
              end: 'left 40%',
              scrub: true,
            },
          }
        )
      })
    }, triggerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={triggerRef} className="relative overflow-hidden bg-[#1a0b2e]">
      <div
        className="absolute inset-0 opacity-20"
        style={{ background: 'radial-gradient(circle at 50% 50%, #431f60 0%, transparent 70%)' }}
      />

      <div ref={contentRef} className="flex h-screen w-fit flex-row flex-nowrap">
        {slides.map((item, index) => (
          <div
            key={item.title}
            className="bengaluru-slide relative flex h-screen flex-shrink-0 items-center justify-center"
            /* 
              Mobile: almost full viewport width with smaller padding
              md+: 85vw with original padding
            */
            style={{ width: 'clamp(92vw, 92vw, 92vw)' }}
            // Using inline style so we can override with a media-driven class below
          >
            {/* Override width per breakpoint via a scoped style tag */}
            <style>{`
              @media (min-width: 768px) {
                .bengaluru-slide { width: 85vw !important; }
              }
            `}</style>

            {/* Slide inner padding: smaller on mobile */}
            <div className="relative z-10 flex h-full w-full items-center px-5 py-6 sm:px-8 md:px-16 md:py-8 lg:px-20">
              <span className="bg-number pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none text-[22vw] font-black leading-none text-white/[0.03]">
                0{index + 1}
              </span>

              {/* 
                Mobile: single column, image on top, text below
                md+: two columns side by side (original)
              */}
              <div className="relative z-10 grid w-full max-w-7xl grid-cols-1 items-center gap-6 md:grid-cols-2 md:gap-12">
                {/* Text content — order-2 on mobile so image shows first */}
                <div className="order-2 space-y-4 md:order-1 md:space-y-6">
                  <div className="space-y-2 md:space-y-3">
                    <div className="flex items-center gap-4">
                      <span className="h-px w-10 bg-gradient-to-r from-violet-500 to-transparent" />
                      <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-violet-400">
                        Feature 0{index + 1}
                      </span>
                    </div>
                    <h3 className="text-[clamp(2.2rem,8vw,8rem)] font-black uppercase italic leading-[0.95] text-white">
                      {item.title}
                    </h3>
                  </div>

                  <p className="max-w-md border-l-2 border-white/5 pl-6 text-sm leading-relaxed text-white/50 md:text-base lg:text-lg">
                    {item.desc}
                  </p>

                  <div className="flex gap-2 pt-1 md:pt-2">
                    {slides.map((_, i) => (
                      <div
                        key={i}
                        className={`h-1 rounded-full transition-all duration-500 ${i === index ? 'w-10 bg-white' : 'w-2 bg-white/10'}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Image — order-1 on mobile so it shows first */}
                <div className="order-1 flex justify-center md:order-2">
                  <div className="group relative w-full max-w-[280px] sm:max-w-[340px] md:max-w-[400px]">
                    <div
                      className={`absolute -inset-4 rounded-[2.5rem] bg-gradient-to-br ${item.color} opacity-10 blur-3xl transition-opacity duration-700 group-hover:opacity-30`}
                      style={{ boxShadow: `0 0 120px 20px ${item.glow}` }}
                    />

                    <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-1.5 md:p-2 backdrop-blur-sm transition-transform duration-500 group-hover:scale-[1.02]">
                      <img
                        src={item.img}
                        alt={item.title}
                        className="slide-img aspect-[4/3] w-full rounded-[1.5rem] object-cover grayscale-[0.2] transition-all duration-700 group-hover:grayscale-0 md:aspect-[4/5] md:rounded-[2rem]"
                      />

                      <div className="absolute bottom-4 right-4 flex h-8 w-8 items-center justify-center rounded-xl border border-white/20 bg-white/10 backdrop-blur-md md:bottom-6 md:right-6 md:h-10 md:w-10">
                        <div className={`h-1.5 w-1.5 rounded-full bg-gradient-to-r ${item.color} animate-pulse`} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function EducationParticles({ count = 30 }) {
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const x = THREE.MathUtils.randFloatSpread(15);
      const y = THREE.MathUtils.randFloatSpread(15);
      const z = THREE.MathUtils.randFloatSpread(10) - 5;
      const scale = THREE.MathUtils.randFloat(0.05, 0.2);
      const speed = THREE.MathUtils.randFloat(0.1, 0.3);
      const type = i % 3;
      temp.push({ x, y, z, scale, speed, type });
    }
    return temp;
  }, [count]);

  return (
    <group>
      {particles.map((p, i) => (
        <DreiFloat key={i} speed={p.speed * 4} rotationIntensity={1.5} floatIntensity={2}>
          <mesh position={[p.x, p.y, p.z]} scale={p.scale}>
            {p.type === 0 ? <boxGeometry args={[1, 1, 1]} /> :
             p.type === 1 ? <sphereGeometry args={[0.6, 16, 16]} /> :
             <torusGeometry args={[0.5, 0.15, 8, 20]} />}
            <meshStandardMaterial
              color={p.type === 0 ? "#f472b6" : p.type === 1 ? "#22d3ee" : "#c084fc"}
              transparent
              opacity={0.3}
              roughness={0.2}
              metalness={0.8}
            />
          </mesh>
        </DreiFloat>
      ))}
    </group>
  );
}

/* ── HERO MODEL ────────────────────────────────────────── */
function EducationModel() {
  const { scene } = useGLTF('/3d_sketchbook_6_-_education_icon.glb');
  const ref = useRef();

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.y = Math.sin(t / 3) * 0.15;
    ref.current.rotation.z = Math.cos(t / 4) * 0.05;
    ref.current.position.y = -0.2 + Math.sin(t * 1.5) * 0.08;
  });

  return (
    <primitive
      ref={ref}
      object={scene}
      scale={0.55}
      position={[2.4, -0.2, 0]}
    />
  );
}

/* ── SCENE ──────────────────────────────────────────────────────── */
function Scene3D() {
  return (
    <CanvasErrorBoundary>
      <Canvas dpr={[1, 2]} gl={{ antialias: true }}>
        <PerspectiveCamera makeDefault position={[0, 0, 5.5]} fov={38} />
        <ambientLight intensity={1.5} />
        <spotLight position={[5, 10, 5]} angle={0.25} penumbra={1} intensity={3} color="#ffffff" />
        <pointLight position={[-10, -10, -10]} color="#d946ef" intensity={2} />
        <pointLight position={[10, -5, 5]} color="#22d3ee" intensity={1.5} />

        <Suspense fallback={null}>
          <EducationParticles />
          <EducationModel />
          <Environment preset="city" />
          <ContactShadows position={[2.4, -1.5, 0]} opacity={0.4} scale={4} blur={2.5} color="#431f60" />
        </Suspense>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          makeDefault
          rotateSpeed={0.4}
          minPolarAngle={Math.PI / 2.5}
          maxPolarAngle={Math.PI / 1.5}
        />
      </Canvas>
    </CanvasErrorBoundary>
  );
}

/* ── ABOUT PAGE ─────────────────────────────────────────────────── */
const About = () => {
  const containerRef = useRef(null);
  const textStripRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Hero Entrance
      gsap.from('.reveal', {
        y: 80,
        opacity: 0,
        skewY: 5,
        duration: 1.2,
        stagger: 0.15,
        ease: 'power4.out',
        delay: 0.2
      });

      // 3D Canvas Parallax — only on desktop
      if (!isMobileViewport()) {
        gsap.to('.parallax-canvas', {
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
          y: 200,
        });
      }

      // Background Text Parallax (Horizontal Scroll)
      gsap.to('.parallax-text', {
        scrollTrigger: {
          trigger: textStripRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
          invalidateOnRefresh: true,
        },
        xPercent: -30,
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={containerRef} className="relative min-h-screen overflow-hidden bg-[#431f60] px-4 sm:px-6">

      {/* Global Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] h-[600px] w-[600px] rounded-full bg-violet-600/15 blur-[150px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[600px] w-[600px] rounded-full bg-violet-600/10 blur-[150px]" />
        <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.8)_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>

      {/* ── 3D HERO CANVAS — desktop only ── */}
      <div className="parallax-canvas absolute inset-0 z-10 hidden h-screen pointer-events-none lg:block">
        <div className="absolute inset-0 pointer-events-auto">
          <Scene3D />
        </div>
      </div>

      {/* ── HERO SECTION ── */}
      <section className="relative z-20 flex min-h-[92svh] items-center px-0 py-10 pointer-events-auto lg:min-h-[96vh] lg:px-24 lg:py-0 lg:pointer-events-none">
        <div className="container mx-auto grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-10">
          {/* Text content — always full-width on mobile, left column on desktop */}
          <div className="relative max-w-2xl text-center pointer-events-auto lg:text-left">

            {/* Glass badge — hidden on mobile, shown md+ */}
            <div className="reveal absolute -top-12 -left-8 hidden items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 shadow-[0_10px_30px_rgba(217,70,239,0.15)] backdrop-blur-md animate-[bounce_4s_infinite] md:flex">
              <span className="h-2 w-2 rounded-full bg-violet-400 shadow-[0_0_10px_#d946ef]"></span>
              <span className="text-xs font-bold text-white/80 uppercase tracking-widest">Est. 2024</span>
            </div>

            <div className="reveal inline-block px-4 py-2 mb-6 rounded-full border border-violet-500/20 bg-violet-500/10 backdrop-blur-xl uppercase tracking-[0.3em] text-[9px] sm:tracking-[0.4em] sm:text-[10px] text-violet-300 font-black shadow-[0_0_20px_rgba(34,211,238,0.1)]">
              Our Identity
            </div>

            {/* 
              Headline: clamp scales naturally from ~2.5rem on 320px up to 8rem on desktop
              The lg override ensures it stays big on desktop as before
            */}
            <h1 className="reveal mb-5 text-[clamp(2.6rem,11vw,7rem)] font-black leading-[0.9] tracking-tighter text-white drop-shadow-2xl lg:mb-8 lg:text-[clamp(4rem,9vw,8rem)]">
              About <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-white to-violet-400">
                Study in
              </span><br />
              Bengaluru
            </h1>

            <p className="reveal mx-auto mb-7 max-w-lg text-sm font-light leading-relaxed text-white/60 sm:text-base lg:mx-0 lg:mb-10 lg:text-xl">
              Welcome to the premier admission ecosystem. We don't just process applications; we engineer <span className="text-white font-medium italic">transformative educational journeys</span>.
            </p>

            {/* Scroll Indicator */}
            <div className="reveal flex items-center justify-center gap-4 opacity-60 lg:justify-start">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-white"></div>
              <span className="text-[9px] uppercase tracking-[0.5em] font-bold text-white">Scroll to Explore</span>
            </div>
          </div>

          {/* Spacer for 3D canvas on desktop only */}
          <div className="hidden h-[500px] lg:block" />
        </div>
      </section>

      {/* ── PARALLAX TEXT STRIP ── */}
      <section
        ref={textStripRef}
        className="relative z-10 -mt-3 overflow-hidden py-1 sm:-mt-4 sm:py-2 lg:-mt-6 lg:py-3"
      >
        <h2 className="parallax-text whitespace-nowrap text-[clamp(3rem,12vw,18rem)] font-black uppercase tracking-tighter text-white/6">
          Innovate • Empower • Transform • Discover •
        </h2>
      </section>

      <AboutCardsSection />
      <WhyChooseSection />
      <WhyBengaluruSection />
    </main>
  );
};

export default About;
