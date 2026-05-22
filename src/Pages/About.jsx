import { useLayoutEffect, useRef, Suspense, Component, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, ContactShadows, useGLTF, OrbitControls, PerspectiveCamera, Float as DreiFloat } from '@react-three/drei';
import { Landmark, BookOpen, Building2, GraduationCap, MapPin, BadgeCheck } from 'lucide-react';
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

const PageGridOverlay = ({ opacity = 'opacity-[0.14]' }) => (
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
    code: 'DP',
    subtitle: 'PROGRAM DEPTH',
    accent: '#e879f9',
    color: 'from-fuchsia-300 to-violet-500',
    shadow: 'shadow-fuchsia-500/20',
    panel: 'from-slate-900/88 via-fuchsia-950/78 to-violet-900/82',
    border: 'border-fuchsia-300/20',
  },
  {
    title: 'Top Institutions',
    desc: 'Access to premier universities and colleges across Bengaluru with diverse program offerings.',
    icon: Landmark,
    code: 'TI',
    subtitle: 'TRUSTED ACCESS',
    accent: '#22d3ee',
    color: 'from-cyan-300 to-violet-500',
    shadow: 'shadow-cyan-500/20',
    panel: 'from-slate-900/88 via-indigo-950/80 to-slate-950/92',
    border: 'border-cyan-300/18',
  },
  {
    title: 'City Advantages',
    desc: "Benefit from Bengaluru's tech ecosystem, cultural diversity, and excellent career opportunities.",
    icon: Building2,
    code: 'CA',
    subtitle: 'CITY EDGE',
    accent: '#fb7185',
    color: 'from-orange-300 to-rose-500',
    shadow: 'shadow-orange-500/20',
    panel: 'from-stone-900/88 via-rose-950/80 to-slate-950/92',
    border: 'border-orange-300/18',
  },
]

function AboutCardsSection() {
  const sectionRef = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const cards = Array.from(sectionRef.current?.querySelectorAll('.about-card') || [])
      if (!cards.length) return

      if (isMobileViewport()) {
        gsap.from(cards, {
          y: 28,
          opacity: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 78%', once: true },
        })
        return
      }

      gsap.set(cards, { transformOrigin: 'center bottom' })
      gsap.set(cards[1], { y: 12, scale: 0.94, opacity: 1, rotationX: 0 })
      gsap.set([cards[0], cards[2]], { y: 86, scale: 0.78, opacity: 0, rotationX: 12 })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 18%',
          end: '+=36%',
          scrub: true,
          pin: true,
          anticipatePin: 1,
        },
      })

      tl.to(cards[1], { y: 0, scale: 1, opacity: 1, rotationX: 0, duration: 0.45, ease: 'power2.out' }, 0)
        .to(cards[0], { y: 22, scale: 0.9, opacity: 1, rotationX: 0, rotationZ: -5, duration: 0.65, ease: 'power2.out' }, 0.28)
        .to(cards[2], { y: 22, scale: 0.9, opacity: 1, rotationX: 0, rotationZ: 5, duration: 0.65, ease: 'power2.out' }, 0.38)
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
      x: x * 0.035,
      y: y * 0.035,
      rotationY: x * 0.018,
      rotationX: -y * 0.018,
      duration: 0.22,
      overwrite: 'auto',
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
      duration: 0.28,
      ease: 'power2.out',
    })
  }

  return (
    <section
      ref={sectionRef}
      className="relative mx-auto -mt-4 flex min-h-[78svh] w-full max-w-[1780px] items-center justify-center overflow-hidden py-6 md:-mt-4 md:min-h-[86svh] md:py-8"
      style={{
        perspective: '1400px',
        background:
          'radial-gradient(circle at 14% 20%, rgba(34, 211, 238, 0.13) 0%, transparent 26%), radial-gradient(circle at 84% 18%, rgba(232, 121, 249, 0.14) 0%, transparent 28%), radial-gradient(circle at 50% 100%, rgba(245, 158, 11, 0.08) 0%, transparent 34%), linear-gradient(180deg, #08040f 0%, #14091d 48%, #0c0614 100%)',
      }}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/2 top-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-400/10 blur-[90px]" />
      </div>
      <PageGridOverlay opacity="opacity-[0.14]" />
      {/* 
        Mobile: single column stacked cards, each full-width
        Tablet+: 3-column grid (original layout)
      */}
      <div className="relative z-10 flex w-full max-w-[1320px] flex-col gap-4 px-4 sm:px-6 md:grid md:grid-cols-3 md:items-center md:gap-6 lg:gap-8">
        {aboutCards.map((card, i) => (
          <div
            key={card.title}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={`about-card group relative flex min-h-[360px] flex-col overflow-hidden rounded-[2rem] border border-white/12 bg-[#170a24]/92 p-6 text-left shadow-2xl shadow-black/25 backdrop-blur-xl sm:p-8 md:min-h-[520px] md:rounded-[2.25rem] md:p-8 lg:min-h-[560px] lg:p-10 ${i === 1 ? 'z-20' : 'z-10'}`}
            style={{
              borderColor: `${card.accent}66`,
              boxShadow: `0 28px 80px rgba(0,0,0,0.26), 0 0 42px ${card.accent}22`,
            }}
          >
            <div className="absolute inset-0 rounded-[inherit] bg-[linear-gradient(135deg,rgba(255,255,255,0.08),transparent_38%),radial-gradient(circle_at_22%_16%,rgba(255,255,255,0.12),transparent_22%),radial-gradient(circle_at_84%_84%,rgba(255,255,255,0.08),transparent_30%)] opacity-80" />
            <div className="absolute inset-0 rounded-[inherit] opacity-[0.14] [background-image:repeating-linear-gradient(45deg,rgba(255,255,255,0.35)_0px,rgba(255,255,255,0.35)_1px,transparent_1px,transparent_28px)]" />
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full border opacity-40 transition-transform duration-700 group-hover:scale-110" style={{ borderColor: card.accent }} />
            <div className="absolute -right-6 -top-6 hidden h-32 w-32 rounded-full blur-[34px] opacity-0 transition-opacity duration-500 group-hover:opacity-100 md:block" style={{ backgroundColor: `${card.accent}28` }} />

            <div className="relative z-10 mb-auto flex items-center justify-between">
              <div className="flex h-16 w-16 items-center justify-center rounded-[1.15rem] border border-white/12 bg-white/8 shadow-2xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6 sm:h-20 sm:w-20 sm:rounded-[1.4rem]" style={{ color: card.accent, boxShadow: `0 0 32px ${card.accent}33` }}>
                <span className="text-2xl font-black sm:text-3xl">{card.code}</span>
              </div>
              <card.icon className="h-7 w-7 opacity-75 sm:h-9 sm:w-9" style={{ color: card.accent }} />
            </div>

            <div className="relative z-10 mt-12 sm:mt-16 md:mt-auto">
              <p className="mb-4 text-[10px] font-black uppercase tracking-[0.42em] text-white/40">{card.subtitle}</p>
              <h3 className="mb-5 text-[clamp(1.6rem,3vw,3.1rem)] font-black uppercase leading-[0.92] tracking-tight text-white">{card.title}</h3>
              <p className="max-w-[22rem] text-sm font-light leading-relaxed text-white/64 sm:text-base lg:text-lg">{card.desc}</p>
              <div className="mt-8 flex items-center justify-between border-t border-white/12 pt-5">
                <span className="rounded-full border border-white/12 bg-white/8 px-4 py-2 text-[9px] font-black uppercase tracking-widest text-white/72">Explore</span>
                <span className="text-3xl font-black" style={{ color: card.accent }}>-&gt;</span>
              </div>
            </div>
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
    code: 'TI',
    subtitle: 'ACADEMIC ACCESS',
    accent: '#8b5cf6',
    color: 'from-violet-500 to-violet-400',
  },
  {
    title: 'Diverse Programs',
    desc: 'Explore a wide range of undergraduate, postgraduate, and doctoral disciplines.',
    icon: BookOpen,
    code: 'DP',
    subtitle: 'PROGRAM RANGE',
    accent: '#22d3ee',
    color: 'from-violet-500 to-violet-400',
  },
  {
    title: 'City Advantages',
    desc: "Benefit from Bengaluru's tech ecosystem, cultural diversity, and career opportunities.",
    icon: MapPin,
    code: 'CA',
    subtitle: 'BENGALURU EDGE',
    accent: '#34d399',
    color: 'from-violet-500 to-violet-400',
  },
  {
    title: 'Expert Guidance',
    desc: 'Get personalized consultations and end-to-end support from industry pros.',
    icon: BadgeCheck,
    code: 'EG',
    subtitle: 'MENTOR SUPPORT',
    accent: '#fb7185',
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

      if (isMobileViewport()) {
        // ── Mobile 3-phase scroll animation ──
        // Cards are on an ELLIPSE: rx=310px (hides E/W), ry=175px (N/S close to circle).
        // GSAP cannot rotate an ellipse directly, so we animate each card's angle
        // individually via a proxy object, recalculating x/y every frame.
        //
        // Phase 1 — hold: user reads top (0) & bottom (2).
        // Phase 2 — all angles advance 90°: cards 1 & 3 arrive at top/bottom.
        //           Card contents counter-rotate so text stays upright.
        // Phase 3 — cards fade, centre circle zooms → portal flash.

        const mobileCards = gsap.utils.toArray('.mobile-why-card')
        const mobileCardContents = gsap.utils.toArray('.mobile-why-card-content')

        const RX = 310  // horizontal semi-axis — E/W card centre is 310px off screen centre → hidden
        const RY = 175  // vertical semi-axis   — N/S card centre is 175px from circle centre → snug

        // Each card starts at angle: 0=top(-90°), 1=right(0°), 2=bottom(90°), 3=left(180°)
        const baseAngles = [-90, 0, 90, 180]  // degrees
        const proxy = { angle: 0 }  // shared rotation offset

        // Position all 4 cards at their current angle+offset
        const RING_SIZE = (RX + 120) * 2  // ring container size
        const RING_HALF = RING_SIZE / 2

        function positionCards(offset) {
          mobileCards.forEach((card, i) => {
            const deg = baseAngles[i] + offset
            const rad = deg * (Math.PI / 180)
            const cx = RING_HALF + Math.cos(rad) * RX
            const cy = RING_HALF + Math.sin(rad) * RY
            const CARD_W = 200
            const CARD_H = 185
            gsap.set(card, {
              x: cx - RING_HALF - CARD_W / 2,
              y: cy - RING_HALF - CARD_H / 2,
            })
          })
        }

        // Set initial card positions (offset = 0)
        positionCards(0)

        gsap.set(mobileCards, {
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: '200px',
          transformOrigin: 'center center',
        })
        gsap.set(coreRef.current, { scale: 1, opacity: 1 })
        gsap.set(portalFlashRef.current, { opacity: 0, backgroundColor: 'transparent' })
        gsap.set('.bg-glow', { opacity: 1, scale: 1 })

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: '+=280%',
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        })

        // Phase 1: hold
        tl.to({}, { duration: 0.35 })

        // Phase 2: rotate all cards 90° on the ellipse (x/y only — no wrapper rotation, so content stays upright)
        tl.to(proxy, {
            angle: 90,
            duration: 1.1,
            ease: 'power2.inOut',
            onUpdate: () => positionCards(proxy.angle),
          }, 'phase2')
          .to({}, { duration: 0.35 })

        // Phase 3: dive
        tl.to(mobileCards, { opacity: 0, scale: 0.72, duration: 0.4, stagger: 0.015, ease: 'power2.in' }, 'phase3')
          .to(coreRef.current, { scale: 12, opacity: 1, duration: 0.9, ease: 'power3.in' }, 'phase3+=0.15')
          .to('.bg-glow', { opacity: 0, scale: 0.45, duration: 0.55, ease: 'power2.in' }, 'phase3+=0.2')
          .to(portalFlashRef.current, { opacity: 1, duration: 0.28, backgroundColor: '#1b1028' }, 'phase3+=0.8')

        return
      }

      // ── Desktop (completely unchanged) ──
      const baseScale = window.innerWidth >= 1280 ? 0.86 : 0.74
      const readingScale = window.innerWidth >= 1280 ? 1.08 : 0.96
      const diveScale = readingScale * 1.14

      gsap.set(orbitalRef.current, { rotate: 0, scale: baseScale })
      gsap.set(coreRef.current, { scale: 1, opacity: 1, rotateY: 0, transformOrigin: 'center center' })
      gsap.set(cards, { opacity: 1, scale: 1, transformOrigin: 'center center' })
      gsap.set(cardContents, { rotate: 0, y: 0, transformOrigin: 'center center' })
      gsap.set(portalFlashRef.current, { opacity: 0, backgroundColor: 'transparent' })
      gsap.set('.bg-glow', { opacity: 1, scale: 1 })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=240%',
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })

      tl.to(orbitalRef.current, { scale: baseScale, rotate: 0, duration: 0.5, ease: 'none' })

      tl.to(orbitalRef.current, { rotate: 360, scale: baseScale, duration: 1.25, ease: 'none' }, 'scene2')
        .to(cardContents, { rotate: -360, duration: 1.25, ease: 'none' }, 'scene2')
        .to(orbitalRef.current, { scale: readingScale, duration: 0.9, ease: 'power2.out' }, 'read')
        .to(cards, { scale: 1.1, duration: 0.9, stagger: 0.03, ease: 'power2.out' }, 'read')
        .to(coreRef.current, { scale: 0.9, duration: 0.9, ease: 'power2.out' }, 'read')
        .to({}, { duration: 0.45 })

      tl.to(cards, { opacity: 0, scale: 0.76, duration: 0.45, stagger: 0.02, ease: 'power2.in' }, 'scene3')
        .to(orbitalRef.current, { scale: diveScale, duration: 0.5, ease: 'power2.in' }, 'scene3')
        .to(coreRef.current, { scale: 9, opacity: 1, duration: 0.85, ease: 'power3.in' }, 'scene3+=0.18')
        .to('.bg-glow', { opacity: 0, scale: 0.45, duration: 0.6, ease: 'power2.in' }, 'scene3+=0.2')
        .to(portalFlashRef.current, { opacity: 1, duration: 0.28, backgroundColor: '#1b1028' }, 'scene3+=0.78')
    }, containerRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={containerRef}
      className="relative flex min-h-[100svh] w-full items-center justify-center overflow-hidden bg-[#08040f] perspective-1000 py-12 md:min-h-[100svh] md:py-8"
      style={{
        perspective: '1400px',
        background:
          'radial-gradient(circle at 14% 20%, rgba(34, 211, 238, 0.13) 0%, transparent 26%), radial-gradient(circle at 84% 18%, rgba(232, 121, 249, 0.14) 0%, transparent 28%), radial-gradient(circle at 50% 100%, rgba(245, 158, 11, 0.08) 0%, transparent 34%), linear-gradient(180deg, #08040f 0%, #14091d 48%, #0c0614 100%)',
      }}
    >
      <PageGridOverlay opacity="opacity-[0.12]" />
      <div ref={portalFlashRef} className="absolute inset-0 z-[100] opacity-0 pointer-events-none" />
      <div className="bg-glow absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/10 blur-[70px]" />

      {isMobile ? (
        /* ── Mobile layout ──
           Elliptical orbit: rx=310px hides E/W cards beyond the ~195px screen half-width.
           ry=175px keeps N/S cards visually close to the 60px-radius centre circle.
           Cards are absolutely positioned at left:50% top:50% then offset via x/y by GSAP.
           coreRef is a sibling of the card container → never rotates.
        */
        <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
          {/* Card container — centred, cards positioned via GSAP x/y from here */}
          <div
            className="absolute"
            style={{ left: '50%', top: '50%', width: 0, height: 0 }}
          >
            {features.map((f, i) => {
              const Icon = f.icon
              return (
                <div
                  key={f.title}
                  className="mobile-why-card absolute z-40"
                  style={{
                    width: '200px',
                    transformOrigin: 'center center',
                  }}
                >
                  <div
                    className="mobile-why-card-content"
                    style={{ transformOrigin: 'center center' }}
                  >
                    <div
                      className="group relative overflow-hidden rounded-[1.2rem] border bg-[#170a24]/94 p-3.5 shadow-2xl shadow-black/20 backdrop-blur-xl"
                      style={{
                        borderColor: `${f.accent}66`,
                        boxShadow: `0 16px 48px rgba(0,0,0,0.28), 0 0 24px ${f.accent}22`,
                      }}
                    >
                      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),transparent_42%),radial-gradient(circle_at_20%_18%,rgba(255,255,255,0.12),transparent_28%)]" />
                      <div className="absolute inset-0 opacity-[0.10] [background-image:repeating-linear-gradient(45deg,rgba(255,255,255,0.34)_0px,rgba(255,255,255,0.34)_1px,transparent_1px,transparent_22px)]" />
                      <div className="absolute -right-7 -top-7 h-16 w-16 rounded-full border opacity-40" style={{ borderColor: f.accent }} />
                      <div className="relative z-10">
                        <div className="mb-2 flex items-center justify-between">
                          <div
                            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/12 bg-white/8"
                            style={{ color: f.accent, boxShadow: `0 0 20px ${f.accent}30` }}
                          >
                            <span className="text-[11px] font-black">{f.code}</span>
                          </div>
                          <Icon size={14} style={{ color: f.accent }} />
                        </div>
                        <p className="mb-1 text-[7px] font-black uppercase tracking-[0.28em] text-white/38">{f.subtitle}</p>
                        <h3 className="mb-1.5 text-[11px] font-black uppercase leading-tight text-white">{f.title}</h3>
                        <p className="text-[10px] leading-relaxed text-white/66">{f.desc}</p>
                        <div className="mt-2 flex items-center justify-between border-t border-white/12 pt-2">
                          <span className="rounded-full border border-white/12 bg-white/8 px-2 py-1 text-[7px] font-black uppercase tracking-widest text-white/70">Explore</span>
                          <span className="text-base font-black" style={{ color: f.accent }}>-&gt;</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Centre circle — sibling of card container, never rotates */}
          <div
            ref={coreRef}
            className="absolute z-50 flex h-[120px] w-[120px] flex-col items-center justify-center rounded-full border border-white/35 bg-gradient-to-br from-[#2b133f]/92 via-[#1f1735]/88 to-[#120a1f]/94 shadow-[0_0_50px_rgba(88,28,135,0.18)]"
            style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)', transformOrigin: 'center center' }}
          >
            <h2 className="text-center text-[10px] font-black uppercase tracking-tighter text-white leading-tight px-2">
              Why Choose <br />
              <span className="text-violet-400 underline decoration-violet-500/50 underline-offset-4">StudyIn</span>
              <br />Bengaluru?
            </h2>
          </div>
        </div>
      ) : (
        /* ── Desktop layout (completely unchanged) ── */
        <div className="relative flex h-full w-full items-center justify-center">
          <div ref={orbitalRef} className="relative flex h-[760px] w-[760px] items-center justify-center preserve-3d" style={{ transform: `scale(0.62)` }}>
            <style>{`@media (min-width: 480px)  { .orbital-inner { transform: scale(0.52) !important; } }@media (min-width: 640px)  { .orbital-inner { transform: scale(0.65) !important; } }@media (min-width: 768px)  { .orbital-inner { transform: scale(0.82) !important; } }@media (min-width: 1024px) { .orbital-inner { transform: scale(1)    !important; } }`}</style>
            <div ref={coreRef} className="relative z-50 preserve-3d h-52 w-52 md:h-64 md:w-64">
              <div className="backface-hidden absolute inset-0 flex flex-col items-center justify-center rounded-full border border-white/35 bg-gradient-to-br from-[#2b133f]/92 via-[#1f1735]/88 to-[#120a1f]/94 shadow-[0_0_50px_rgba(88,28,135,0.18)]">
                <h2 className="text-center text-lg font-black uppercase tracking-tighter text-white md:text-2xl">Why Choose <br /><span className="text-violet-400 underline decoration-violet-500/50 underline-offset-8">StudyIn</span><br />Bengaluru?</h2>
              </div>
              <div className="backface-hidden absolute inset-0 flex items-center justify-center rounded-full border-2 border-violet-300/70 bg-gradient-to-br from-[#1f1432] via-[#311a4b] to-[#130b22] shadow-[0_0_80px_rgba(168,85,247,0.28)]" style={{ transform: 'rotateY(180deg)' }}>
                <span className="animate-pulse text-2xl font-bold italic tracking-widest text-white">Why Bengaluru?</span>
              </div>
            </div>
            {features.map((f, i) => {
              const positions = [
                { top: '50%', left: '50%', transform: 'translate(-50%, -154%)' },
                { top: '50%', left: '50%', transform: 'translate(82%, -50%)' },
                { top: '50%', left: '50%', transform: 'translate(-50%, 54%)' },
                { top: '50%', left: '50%', transform: 'translate(-182%, -50%)' },
              ]
              const Icon = f.icon
              return (
                <div
                  key={f.title}
                  className="why-card absolute z-40"
                  style={{
                    width: '245px',
                    ...positions[i],
                  }}
                >
                  <div className="why-card-content preserve-3d">
                    <div
                      className="group relative overflow-hidden rounded-[1.4rem] border bg-[#170a24]/94 p-4 shadow-2xl shadow-black/20 backdrop-blur-xl"
                      style={{
                        borderColor: `${f.accent}66`,
                        boxShadow: `0 24px 70px rgba(0,0,0,0.22), 0 0 34px ${f.accent}22`,
                      }}
                    >
                      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),transparent_42%),radial-gradient(circle_at_20%_18%,rgba(255,255,255,0.12),transparent_28%)]" />
                      <div className="absolute inset-0 opacity-[0.12] [background-image:repeating-linear-gradient(45deg,rgba(255,255,255,0.34)_0px,rgba(255,255,255,0.34)_1px,transparent_1px,transparent_22px)]" />
                      <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full border opacity-40 transition-transform duration-700 group-hover:scale-110" style={{ borderColor: f.accent }} />
                      <div className="relative z-10">
                        <div className="mb-3 flex items-center justify-between">
                          <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/12 bg-white/8" style={{ color: f.accent, boxShadow: `0 0 28px ${f.accent}30` }}>
                            <span className="text-base font-black">{f.code}</span>
                          </div>
                          <Icon size={18} style={{ color: f.accent }} />
                        </div>
                        <p className="mb-2 text-[7px] font-black uppercase tracking-[0.32em] text-white/38">{f.subtitle}</p>
                        <h3 className="mb-2 text-base font-black uppercase leading-tight text-white">{f.title}</h3>
                        <p className="text-[12px] leading-relaxed text-white/66">{f.desc}</p>
                        <div className="mt-3 flex items-center justify-between border-t border-white/12 pt-3">
                          <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1.5 text-[8px] font-black uppercase tracking-widest text-white/70">Explore</span>
                          <span className="text-2xl font-black" style={{ color: f.accent }}>-&gt;</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </section>
  )
}

/* ==========================================================================
   Section: Why Bengaluru horizontal slider
   ========================================================================== */

function WhyBengaluruSection() {
  const triggerRef = useRef(null), contentRef = useRef(null);
  const isMobile = isMobileViewport();
  const slides = [
    { title: 'Innovation Hub', desc: "Bengaluru is India's Silicon Valley, a global leader in IT, biotechnology, and innovation, offering unparalleled opportunities for tech enthusiasts.", color: 'from-blue-600', glow: 'rgba(37, 99, 235, 0.2)', img: img1 },
    { title: 'Global Opportunities', desc: 'With its thriving economy and multinational companies, Bengaluru is the perfect launchpad for a global career.', color: 'from-fuchsia-600', glow: 'rgba(192, 38, 211, 0.2)', img: img2 },
    { title: 'Top Institutions', desc: 'Home to prestigious universities and colleges offering diverse courses, Bengaluru ensures world-class education for every student.', color: 'from-violet-600', glow: 'rgba(124, 58, 237, 0.2)', img: img3 },
    { title: 'Cultural Melting Pot', desc: 'Experience a vibrant mix of cultures, traditions, and communities, making Bengaluru a welcoming city for everyone.', color: 'from-orange-500', glow: 'rgba(249, 115, 22, 0.2)', img: img4 },
    { title: 'Affordable Living', desc: 'Enjoy a high quality of life at a reasonable cost, making Bengaluru an ideal destination for students and professionals alike.', color: 'from-emerald-500', glow: 'rgba(16, 185, 129, 0.2)', img: img5 },
    { title: 'Thriving Ecosystem', desc: 'From startups to established giants, Bengaluru offers a dynamic ecosystem for learning, networking, and growth.', color: 'from-rose-500', glow: 'rgba(225, 29, 72, 0.2)', img: img6 },
  ];

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (isMobileViewport()) {
        gsap.from('.bengaluru-slide', {
          y: 28,
          opacity: 0,
          duration: 0.7,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: { trigger: triggerRef.current, start: 'top 75%', once: true },
        });
        return;
      }

      const items = gsap.utils.toArray('.bengaluru-slide');
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerRef.current,
          start: 'top top',
          end: () => `+=${Math.max((contentRef.current.scrollWidth - window.innerWidth) * 0.68, window.innerHeight * 0.8)}`,
          scrub: true,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
      tl.to(contentRef.current, { x: () => -(contentRef.current.scrollWidth - window.innerWidth), ease: 'none' });
      items.forEach((slide) => {
        const title = slide.querySelector('h3'), img = slide.querySelector('.slide-img'), num = slide.querySelector('.bg-number'), text = slide.querySelector('p');
        gsap.fromTo([title, text], { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.1, scrollTrigger: { trigger: slide, containerAnimation: tl, start: 'left 85%', end: 'left 35%', scrub: true } });
        gsap.to(num, { x: -100, scrollTrigger: { trigger: slide, containerAnimation: tl, start: 'left right', end: 'right left', scrub: true } });
        gsap.fromTo(img, { scale: 0.85, opacity: 0 }, { scale: 1, opacity: 1, scrollTrigger: { trigger: slide, containerAnimation: tl, start: 'left 95%', end: 'left 40%', scrub: true } });
      });
    }, triggerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={triggerRef} className="relative overflow-hidden bg-[#0c0614]">
      <div className="absolute inset-0 opacity-80" style={{ background: 'radial-gradient(circle at 14% 20%, rgba(34, 211, 238, 0.13) 0%, transparent 26%), radial-gradient(circle at 84% 18%, rgba(232, 121, 249, 0.14) 0%, transparent 28%), radial-gradient(circle at 50% 100%, rgba(245, 158, 11, 0.08) 0%, transparent 34%), linear-gradient(180deg, #08040f 0%, #14091d 48%, #0c0614 100%)' }} />
      <PageGridOverlay opacity="opacity-[0.12]" />
      <div ref={contentRef} className={`${isMobile ? 'flex-col py-10' : 'h-screen w-fit flex-row flex-nowrap'} flex`}>
        {slides.map((item, index) => (
          <div key={item.title} className={`${isMobile ? 'min-h-[auto] py-8' : 'h-screen flex-shrink-0'} bengaluru-slide relative flex items-center justify-center`} style={{ width: isMobile ? '100%' : '78vw' }}>
            {/* Override width per breakpoint via a scoped style tag */}
            <style>{`@media (min-width: 768px) { .bengaluru-slide { width: 74vw !important; } }`}</style>
            {/* Slide inner padding: smaller on mobile */}
            <div className="relative z-10 flex h-full w-full items-center px-5 py-6 sm:px-8 md:px-16 md:py-8 lg:px-20">
              <span className="bg-number pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none text-[22vw] font-black leading-none text-white/[0.03]">0{index + 1}</span>
              {/* Mobile: single column, image on top, text below; md+: two columns side by side (original) */}
              <div className="relative z-10 grid w-full max-w-7xl grid-cols-1 items-center gap-6 md:grid-cols-[minmax(0,0.82fr)_minmax(320px,0.86fr)] md:gap-10 lg:gap-14">
                {/* Text content — order-2 on mobile so image shows first */}
                <div className="order-2 min-w-0 space-y-4 md:order-1 md:space-y-6">
                  <div className="space-y-3 md:space-y-4">
                    <div className="flex items-center gap-4"><span className="h-px w-10 bg-gradient-to-r from-violet-500 to-transparent" /><span className="font-mono text-[10px] uppercase tracking-[0.3em] text-violet-400">Feature 0{index + 1}</span></div>
                    <h3 className="max-w-[12ch] text-[clamp(2rem,4.4vw,4.7rem)] font-black uppercase italic leading-[0.92] text-white drop-shadow-[0_18px_45px_rgba(168,85,247,0.18)] md:text-[clamp(2.35rem,4vw,4.35rem)]">
                      <span className="bg-gradient-to-r from-white via-white to-violet-200 bg-clip-text text-transparent">{item.title}</span>
                    </h3>
                  </div>
                  <p className="max-w-[34rem] border-l-2 border-violet-400/20 pl-6 text-sm leading-relaxed text-white/56 md:text-base lg:text-lg">{item.desc}</p>
                  <div className="flex gap-2 pt-1 md:pt-2">{slides.map((_, i) => (<div key={i} className={`h-1 rounded-full transition-all duration-500 ${i === index ? 'w-10 bg-white' : 'w-2 bg-white/10'}`} />))}</div>
                </div>
                {/* Image — order-1 on mobile so it shows first */}
                <div className="order-1 flex justify-center md:order-2">
                  <div className="group relative w-full max-w-[280px] sm:max-w-[340px] md:max-w-[400px]">
                    <div className={`absolute -inset-4 hidden rounded-[2.5rem] bg-gradient-to-br ${item.color} opacity-10 blur-xl transition-opacity duration-700 group-hover:opacity-25 md:block`} style={{ boxShadow: `0 0 60px 8px ${item.glow}` }} />
                    <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-1.5 transition-transform duration-500 group-hover:scale-[1.02] md:p-2">
                      <img src={item.img} alt={item.title} className="slide-img aspect-[4/3] w-full rounded-[1.5rem] object-cover grayscale-[0.2] transition-all duration-700 group-hover:grayscale-0 md:aspect-[4/5] md:rounded-[2rem]" />
                      <div className="absolute bottom-4 right-4 flex h-8 w-8 items-center justify-center rounded-xl border border-white/20 bg-black/25 md:bottom-6 md:right-6 md:h-10 md:w-10"><div className={`h-1.5 w-1.5 rounded-full bg-gradient-to-r ${item.color} animate-pulse`} /></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ==========================================================================
   Section: Hero 3D scene
   ========================================================================== */

function EducationParticles({ count = 16 }) {
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const x = THREE.MathUtils.randFloatSpread(15), y = THREE.MathUtils.randFloatSpread(15);
      const z = THREE.MathUtils.randFloatSpread(10) - 5, scale = THREE.MathUtils.randFloat(0.05, 0.2);
      const speed = THREE.MathUtils.randFloat(0.1, 0.3), type = i % 3;
      temp.push({ x, y, z, scale, speed, type });
    }
    return temp;
  }, [count]);

  return (
    <group>
      {particles.map((p, i) => (
        <DreiFloat key={i} speed={p.speed * 4} rotationIntensity={1.5} floatIntensity={2}>
          <mesh position={[p.x, p.y, p.z]} scale={p.scale}>
            {p.type === 0 ? <boxGeometry args={[1, 1, 1]} /> : p.type === 1 ? <sphereGeometry args={[0.6, 10, 10]} /> : <torusGeometry args={[0.5, 0.15, 6, 12]} />}
            <meshStandardMaterial color={p.type === 0 ? "#f472b6" : p.type === 1 ? "#22d3ee" : "#c084fc"} transparent opacity={0.26} roughness={0.35} metalness={0.5} />
          </mesh>
        </DreiFloat>
      ))}
    </group>
  );
}

function EducationModel() {
  const { scene } = useGLTF('/3d_sketchbook_6_-_education_icon.glb');
  const ref = useRef();
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.y = -0.12 + Math.sin(t / 3) * 0.08;
    ref.current.rotation.z = Math.cos(t / 4) * 0.025;
    ref.current.position.y = -0.08 + Math.sin(t * 1.2) * 0.045;
  });
  return <primitive ref={ref} object={scene} scale={0.78} position={[1.38, -0.08, 0]} />;
}

function Scene3D() {
  return (
    <CanvasErrorBoundary>
      <Canvas dpr={[1, 1.25]} gl={{ antialias: false, powerPreference: 'high-performance' }}>
        <PerspectiveCamera makeDefault position={[0, 0, 5.5]} fov={34} />
        <ambientLight intensity={1.5} />
        <spotLight position={[5, 10, 5]} angle={0.25} penumbra={1} intensity={3} color="#ffffff" />
        <pointLight position={[-10, -10, -10]} color="#d946ef" intensity={2} />
        <pointLight position={[10, -5, 5]} color="#22d3ee" intensity={1.5} />
        <Suspense fallback={null}>
          <EducationParticles />
          <EducationModel />
          <Environment preset="city" />
          <ContactShadows position={[1.38, -1.36, 0]} opacity={0.24} scale={4.4} blur={1.6} color="#14091d" />
        </Suspense>
        <OrbitControls enableZoom={false} enablePan={false} makeDefault rotateSpeed={0.4} minPolarAngle={Math.PI / 2.5} maxPolarAngle={Math.PI / 1.5} />
      </Canvas>
    </CanvasErrorBoundary>
  );
}

function GlobalBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#08040f_0%,#14091d_48%,#0c0614_100%)]" />
      <div className="absolute left-[-10%] top-[-10%] h-[520px] w-[520px] rounded-full bg-cyan-500/10 blur-[110px]" />
      <div className="absolute right-[-8%] top-[-8%] h-[520px] w-[520px] rounded-full bg-fuchsia-400/12 blur-[120px]" />
      <div className="absolute bottom-[-12%] left-1/2 h-[520px] w-[720px] -translate-x-1/2 rounded-full bg-amber-500/8 blur-[130px]" />
      <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.8)_1px,transparent_1px)] bg-[size:24px_24px]" />
    </div>
  );
}

function HeroCanvasSection() {
  return (
    <div className="parallax-canvas absolute inset-0 z-10 hidden h-screen pointer-events-none md:block">
      <div className="absolute inset-0 pointer-events-auto"><Scene3D /></div>
    </div>
  );
}

function HeroSection() {
  return (
    <section className="relative z-20 flex min-h-[92svh] items-center px-0 py-10 pointer-events-auto lg:min-h-[96vh] lg:px-24 lg:py-0 lg:pointer-events-none">
      <PageGridOverlay opacity="opacity-[0.1]" />
      <div className="container mx-auto grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-10">
        <div className="relative max-w-2xl text-center pointer-events-auto lg:text-left">
          <div className="reveal absolute -top-12 -left-8 hidden items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 shadow-[0_10px_30px_rgba(217,70,239,0.15)] backdrop-blur-md animate-[bounce_4s_infinite] md:flex">
            <span className="h-2 w-2 rounded-full bg-violet-400 shadow-[0_0_10px_#d946ef]" />
            <span className="text-xs font-bold text-white/80 uppercase tracking-widest">Est. 2024</span>
          </div>
          <div className="reveal inline-block px-4 py-2 mb-6 rounded-full border border-violet-500/20 bg-violet-500/10 backdrop-blur-xl uppercase tracking-[0.3em] text-[9px] sm:tracking-[0.4em] sm:text-[10px] text-violet-300 font-black shadow-[0_0_20px_rgba(34,211,238,0.1)]">Our Identity</div>
          <h1 className="reveal mb-5 text-[clamp(2.6rem,11vw,7rem)] font-black leading-[0.9] tracking-tighter text-white drop-shadow-2xl lg:mb-8 lg:text-[clamp(4rem,9vw,8rem)]">About <br /><span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-white to-violet-400">Study in</span><br />Bengaluru</h1>
          <p className="reveal mx-auto mb-7 max-w-lg text-sm font-light leading-relaxed text-white/60 sm:text-base lg:mx-0 lg:mb-10 lg:text-xl">Welcome to the premier admission ecosystem. We don't just process applications; we engineer <span className="text-white font-medium italic">transformative educational journeys</span>.</p>
          <div className="reveal flex items-center justify-center gap-4 opacity-60 lg:justify-start"><div className="h-px w-12 bg-gradient-to-r from-transparent to-white" /><span className="text-[9px] uppercase tracking-[0.5em] font-bold text-white">Scroll to Explore</span></div>
        </div>
        <div className="hidden h-[500px] lg:block" />
      </div>
    </section>
  );
}

function ParallaxTextStrip({ textStripRef }) {
  return (
    <section ref={textStripRef} className="relative z-10 -mt-3 overflow-hidden py-1 sm:-mt-4 sm:py-2 lg:-mt-6 lg:py-3">
      <h2 className="parallax-text whitespace-nowrap text-[clamp(3rem,12vw,18rem)] font-black uppercase tracking-tighter text-white/6">Innovate • Empower • Transform • Discover •</h2>
    </section>
  );
}

/* ==========================================================================
   Page: About
   ========================================================================== */

const About = () => {
  const containerRef = useRef(null), textStripRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Hero Entrance
      gsap.from('.reveal', { y: 44, opacity: 0, duration: 0.85, stagger: 0.1, ease: 'power3.out', delay: 0.1 });
      // 3D Canvas Parallax — only on desktop
      if (!isMobileViewport()) { gsap.to('.parallax-canvas', { scrollTrigger: { trigger: containerRef.current, start: "top top", end: "bottom top", scrub: true }, y: 120 }); }
      // Background Text Parallax (Horizontal Scroll)
      gsap.to('.parallax-text', { scrollTrigger: { trigger: textStripRef.current, start: 'top bottom', end: 'bottom top', scrub: true, invalidateOnRefresh: true }, xPercent: -18 });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <main ref={containerRef} className="relative min-h-screen overflow-hidden bg-[#08040f] px-4 sm:px-6">
      <GlobalBackground />
      <HeroCanvasSection />
      <HeroSection />
      <ParallaxTextStrip textStripRef={textStripRef} />
      <AboutCardsSection />
      <WhyChooseSection />
      <WhyBengaluruSection />
    </main>
  );
};

export default About;
