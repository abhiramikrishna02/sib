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

const PageGridOverlay = ({ opacity = 'opacity-[0.18]' }) => (
  <div
    aria-hidden="true"
    className={`pointer-events-none absolute inset-0 z-0 ${opacity}`}
    style={{
      backgroundImage: 'linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)',
      backgroundSize: '72px 72px',
      maskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)',
      WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)',
    }}
  />
)

class CanvasErrorBoundary extends Component {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) return <div className="hidden" />;
    return this.props.children;
  }
}

// ── SECTION 1 — ABOUT CARDS ──
const aboutCards = [
  {
    title: 'Diverse Programs', desc: 'Explore a wide range of undergraduate, postgraduate, and doctoral programs in various disciplines.',
    icon: BookOpen, code: 'DP', subtitle: 'PROGRAM DEPTH', accent: '#00CFFF', accentAlt: '#4FC3F7',
    bgTint: 'rgba(0,191,255,0.07)', borderColor: 'rgba(0,207,255,0.40)', glowOuter: 'rgba(0,207,255,0.22)',
    glowInner: 'rgba(0,207,255,0.12)', cardBg: 'linear-gradient(145deg, #030f1c 0%, #010a14 55%, #020e1a 100%)',
    iconBg: 'linear-gradient(145deg, #041828, #010a14)', sheenColor: 'rgba(0,207,255,0.55)',
  },
  {
    title: 'Top Institutions', desc: 'Access to premier universities and colleges across Bengaluru with diverse program offerings.',
    icon: Landmark, code: 'TI', subtitle: 'TRUSTED ACCESS', accent: '#E040FB', accentAlt: '#CE93D8',
    bgTint: 'rgba(156,39,176,0.08)', borderColor: 'rgba(224,64,251,0.38)', glowOuter: 'rgba(224,64,251,0.20)',
    glowInner: 'rgba(224,64,251,0.10)', cardBg: 'linear-gradient(145deg, #0e0318 0%, #08020f 55%, #0c0216 100%)',
    iconBg: 'linear-gradient(145deg, #1a0428, #08020f)', sheenColor: 'rgba(224,64,251,0.50)',
  },
  {
    title: 'City Advantages', desc: "Benefit from Bengaluru's tech ecosystem, cultural diversity, and excellent career opportunities.",
    icon: Building2, code: 'CA', subtitle: 'CITY EDGE', accent: '#00E5A0', accentAlt: '#4DB6AC',
    bgTint: 'rgba(0,191,165,0.07)', borderColor: 'rgba(0,229,160,0.38)', glowOuter: 'rgba(0,229,160,0.20)',
    glowInner: 'rgba(0,229,160,0.10)', cardBg: 'linear-gradient(145deg, #011810 0%, #010f0a 55%, #021410 100%)',
    iconBg: 'linear-gradient(145deg, #02201a, #010f0a)', sheenColor: 'rgba(0,229,160,0.50)',
  },
]

function AboutCardsSection() {
  const sectionRef = useRef(null)
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const cards = Array.from(sectionRef.current?.querySelectorAll('.about-card') || [])
      if (!cards.length) return
      if (isMobileViewport()) {
        gsap.set(cards, { clearProps: 'all' })
        gsap.from(cards, { y: 40, opacity: 0, duration: 0.7, stagger: 0.14, ease: 'power2.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 82%', once: true } })
        return
      }
      gsap.set(cards, { transformOrigin: 'center bottom' })
      gsap.set(cards[1], { y: 12, scale: 0.94, opacity: 1, rotationX: 0 })
      gsap.set([cards[0], cards[2]], { y: 86, scale: 0.78, opacity: 0, rotationX: 12 })
      const tl = gsap.timeline({ scrollTrigger: { trigger: sectionRef.current, start: 'top 18%', end: '+=36%', scrub: true, pin: true, anticipatePin: 1 } })
      tl.to(cards[1], { y: 0, scale: 1, opacity: 1, rotationX: 0, duration: 0.45, ease: 'power2.out' }, 0)
        .to(cards[0], { y: 22, scale: 0.9, opacity: 1, rotationX: 0, rotationZ: -5, duration: 0.65, ease: 'power2.out' }, 0.28)
        .to(cards[2], { y: 22, scale: 0.9, opacity: 1, rotationX: 0, rotationZ: 5, duration: 0.65, ease: 'power2.out' }, 0.38)
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const handleMouseMove = (e) => {
    if (isMobileViewport()) return
    const card = e.currentTarget, rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2, y = e.clientY - rect.top - rect.height / 2
    gsap.to(card, { x: x * 0.035, y: y * 0.035, rotationY: x * 0.018, rotationX: -y * 0.018, duration: 0.22, overwrite: 'auto', ease: 'power2.out' })
  }
  const handleMouseLeave = (e) => {
    if (isMobileViewport()) return
    gsap.to(e.currentTarget, { x: 0, y: 0, rotationY: 0, rotationX: 0, duration: 0.28, ease: 'power2.out' })
  }

  return (
    <section
      ref={sectionRef}
      className="relative mx-auto -mt-4 flex w-full max-w-[1780px] items-center justify-center overflow-hidden py-10 md:-mt-4 md:min-h-[86svh] md:py-8"
      style={{ perspective: '1400px', background: 'linear-gradient(180deg, #020510 0%, #040820 48%, #020510 100%)' }}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-[16%] top-1/2 h-[380px] w-[280px] -translate-y-1/2 rounded-full blur-[100px]" style={{ background: 'rgba(0,207,255,0.07)' }} />
        <div className="absolute left-1/2 top-1/2 h-[400px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[100px]" style={{ background: 'rgba(224,64,251,0.07)' }} />
        <div className="absolute right-[16%] top-1/2 h-[380px] w-[280px] -translate-y-1/2 rounded-full blur-[100px]" style={{ background: 'rgba(0,229,160,0.07)' }} />
      </div>
      <PageGridOverlay opacity="opacity-[0.12]" />
      <div className="relative z-10 flex w-full max-w-[1320px] flex-col gap-5 px-4 sm:px-6 md:grid md:grid-cols-3 md:items-center md:gap-6 lg:gap-8">
        {aboutCards.map((card, i) => (
          <div
            key={card.title}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={`about-card group relative flex flex-col overflow-hidden rounded-[1.75rem] border p-5 text-left backdrop-blur-xl sm:p-6 md:min-h-[520px] md:rounded-[2.25rem] md:p-8 lg:min-h-[560px] lg:p-10 ${i === 1 ? 'z-20' : 'z-10'}`}
            style={{ borderColor: card.borderColor, boxShadow: `0 20px 60px rgba(0,0,0,0.75), 0 0 50px ${card.glowOuter}, inset 0 1px 0 ${card.sheenColor}33`, background: card.cardBg }}
          >
            <div className="absolute inset-x-0 top-0 h-[1px] rounded-t-[1.75rem] md:rounded-t-[2.25rem]" style={{ background: `linear-gradient(90deg, transparent, ${card.sheenColor}, transparent)` }} />
            <div className="absolute inset-0 rounded-[inherit]" style={{ background: `radial-gradient(circle at 22% 16%, ${card.glowInner}, transparent 50%), radial-gradient(circle at 80% 80%, ${card.glowInner}, transparent 40%)` }} />
            <div className="absolute inset-0 rounded-[inherit] opacity-[0.06] [background-image:repeating-linear-gradient(45deg,rgba(255,255,255,0.40)_0px,rgba(255,255,255,0.40)_1px,transparent_1px,transparent_28px)]" />
            <div className="absolute -right-14 -top-14 h-44 w-44 rounded-full border opacity-30 transition-transform duration-700 group-hover:scale-110" style={{ borderColor: card.accent }} />
            <div className="absolute -right-6 -top-6 hidden h-28 w-28 rounded-full blur-[40px] opacity-0 transition-opacity duration-500 group-hover:opacity-100 md:block" style={{ background: card.glowOuter }} />
            <div className="relative z-10 mb-4 flex items-center justify-between md:mb-auto">
              <div className="flex h-14 w-14 items-center justify-center rounded-[1rem] border shadow-2xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6 sm:h-16 sm:w-16 sm:rounded-[1.15rem] md:h-20 md:w-20 md:rounded-[1.4rem]"
                style={{ color: card.accent, borderColor: `${card.accent}55`, boxShadow: `0 0 28px ${card.glowOuter}, inset 0 1px 0 ${card.sheenColor}44`, background: card.iconBg }}>
                <span className="text-xl font-black sm:text-2xl md:text-3xl">{card.code}</span>
              </div>
              <card.icon className="h-6 w-6 opacity-80 sm:h-7 sm:w-7 md:h-9 md:w-9" style={{ color: card.accentAlt }} />
            </div>
            <div className="relative z-10 mt-2 md:mt-auto">
              <p className="mb-3 text-[9px] font-black uppercase tracking-[0.38em]" style={{ color: `${card.accent}aa` }}>{card.subtitle}</p>
              <h3 className="mb-4 text-[clamp(1.4rem,5vw,3.1rem)] font-black uppercase leading-[0.92] tracking-tight text-white">{card.title}</h3>
              <p className="max-w-[22rem] text-sm font-light leading-relaxed text-white/70 md:text-base lg:text-lg">{card.desc}</p>
              <div className="mt-6 flex items-center justify-between pt-4" style={{ borderTop: `1px solid ${card.accent}28` }}>
                <span className="rounded-full border px-3 py-1.5 text-[9px] font-black uppercase tracking-widest" style={{ borderColor: `${card.accent}44`, color: card.accent, background: `${card.glowInner}`, boxShadow: `inset 0 1px 0 ${card.sheenColor}22` }}>Explore</span>
                <span className="text-2xl font-black md:text-3xl" style={{ color: card.accent }}>-&gt;</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

// ── SECTION 2 — WHY CHOOSE ──
const features = [
  { title: 'Top Institutions', desc: 'Access to premier universities and colleges across Bengaluru with diverse program offerings.', icon: GraduationCap, code: 'TI', subtitle: 'ACADEMIC ACCESS', accent: '#00CFFF', accentAlt: '#4FC3F7', glowColor: 'rgba(0,207,255,0.18)', borderColor: 'rgba(0,207,255,0.36)', boxGlow: 'rgba(0,207,255,0.30)', cardBg: 'linear-gradient(145deg, #03101c 0%, #010a14 100%)', iconBg: 'linear-gradient(145deg, #041828, #010a14)' },
  { title: 'Diverse Programs', desc: 'Explore a wide range of undergraduate, postgraduate, and doctoral disciplines.', icon: BookOpen, code: 'DP', subtitle: 'PROGRAM RANGE', accent: '#F06292', accentAlt: '#F48FB1', glowColor: 'rgba(240,98,146,0.18)', borderColor: 'rgba(240,98,146,0.36)', boxGlow: 'rgba(240,98,146,0.30)', cardBg: 'linear-gradient(145deg, #1a0410 0%, #100208 100%)', iconBg: 'linear-gradient(145deg, #280614, #100208)' },
  { title: 'City Advantages', desc: "Benefit from Bengaluru's tech ecosystem, cultural diversity, and career opportunities.", icon: MapPin, code: 'CA', subtitle: 'BENGALURU EDGE', accent: '#FFB300', accentAlt: '#FFCA28', glowColor: 'rgba(255,179,0,0.18)', borderColor: 'rgba(255,179,0,0.36)', boxGlow: 'rgba(255,179,0,0.30)', cardBg: 'linear-gradient(145deg, #180e00 0%, #100900 100%)', iconBg: 'linear-gradient(145deg, #241400, #100900)' },
  { title: 'Expert Guidance', desc: 'Get personalized consultations and end-to-end support from industry pros.', icon: BadgeCheck, code: 'EG', subtitle: 'MENTOR SUPPORT', accent: '#B39DDB', accentAlt: '#CE93D8', glowColor: 'rgba(179,157,219,0.18)', borderColor: 'rgba(179,157,219,0.36)', boxGlow: 'rgba(179,157,219,0.30)', cardBg: 'linear-gradient(145deg, #0d0318 0%, #060112 100%)', iconBg: 'linear-gradient(145deg, #180428, #060112)' },
]

function renderWhyCard(f, size = 'desktop') {
  const Icon = f.icon, isMob = size === 'mobile'
  return (
    <div className={`group relative overflow-hidden backdrop-blur-xl ${isMob ? 'rounded-[1.2rem] p-4' : 'rounded-[1.4rem] p-4'}`}
      style={{ borderWidth: 1, borderStyle: 'solid', borderColor: f.borderColor, boxShadow: `0 ${isMob ? 16 : 24}px ${isMob ? 48 : 70}px rgba(0,0,0,0.82), 0 0 ${isMob ? 24 : 36}px ${f.glowColor}, inset 0 1px 0 ${f.accent}22`, background: f.cardBg }}>
      <div className={`absolute inset-x-0 top-0 h-[1px] ${isMob ? 'rounded-t-[1.2rem]' : 'rounded-t-[1.4rem]'}`} style={{ background: `linear-gradient(90deg, transparent, ${f.accent}88, transparent)` }} />
      <div className="absolute inset-0" style={{ background: `radial-gradient(circle at 20% 18%, ${f.glowColor}, transparent 45%)` }} />
      <div className="absolute inset-0 opacity-[0.07] [background-image:repeating-linear-gradient(45deg,rgba(255,255,255,0.40)_0px,rgba(255,255,255,0.40)_1px,transparent_1px,transparent_22px)]" />
      <div className={`absolute rounded-full border opacity-35 transition-transform duration-700 group-hover:scale-110 ${isMob ? '-right-7 -top-7 h-16 w-16' : '-right-10 -top-10 h-28 w-28'}`} style={{ borderColor: f.accent }} />
      <div className="relative z-10">
        <div className={`flex items-center justify-between ${isMob ? 'mb-2.5' : 'mb-3'}`}>
          <div className={`inline-flex items-center justify-center border ${isMob ? 'h-10 w-10 rounded-xl' : 'h-11 w-11 rounded-2xl'}`}
            style={{ color: f.accent, borderColor: `${f.accent}55`, boxShadow: `0 0 ${isMob ? 20 : 28}px ${f.boxGlow}`, background: f.iconBg }}>
            <span className={`font-black ${isMob ? 'text-[12px]' : 'text-base'}`}>{f.code}</span>
          </div>
          <Icon size={isMob ? 16 : 18} style={{ color: f.accentAlt }} />
        </div>
        <p className={`font-black uppercase ${isMob ? 'mb-1 text-[7px] tracking-[0.28em]' : 'mb-2 text-[7px] tracking-[0.32em]'}`} style={{ color: `${f.accent}99` }}>{f.subtitle}</p>
        <h3 className={`font-black uppercase leading-tight text-white ${isMob ? 'mb-1.5 text-[13px]' : 'mb-2 text-base'}`}>{f.title}</h3>
        <p className={`leading-relaxed text-white/70 ${isMob ? 'text-[11px]' : 'text-[12px]'}`}>{f.desc}</p>
        <div className={`flex items-center justify-between ${isMob ? 'mt-3 pt-2.5' : 'mt-3 pt-3'}`} style={{ borderTop: `1px solid ${f.accent}28` }}>
          <span className={`rounded-full border font-black uppercase tracking-widest ${isMob ? 'px-2.5 py-1 text-[8px]' : 'px-3 py-1.5 text-[8px]'}`}
            style={{ borderColor: `${f.accent}44`, color: f.accent, background: f.glowColor }}>Explore</span>
          <span className={`font-black ${isMob ? 'text-lg' : 'text-2xl'}`} style={{ color: f.accent }}>-&gt;</span>
        </div>
      </div>
    </div>
  )
}

function WhyChooseMobile() {
  const sectionRef = useRef(null), coreRef = useRef(null)
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(coreRef.current, { scale: 0.7, opacity: 0, duration: 0.8, ease: 'back.out(1.4)', scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true } })
      const cards = sectionRef.current?.querySelectorAll('.mobile-why-stack-card') || []
      gsap.from(cards, { y: 50, opacity: 0, duration: 0.65, stagger: 0.12, ease: 'power2.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 70%', once: true } })
    }, sectionRef)
    return () => ctx.revert()
  }, [])
  return (
    <section ref={sectionRef} className="relative w-full overflow-hidden py-14 px-4" style={{ background: 'linear-gradient(180deg, #06020e 0%, #0a0418 48%, #06020e 100%)' }}>
      <PageGridOverlay opacity="opacity-[0.10]" />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-0 top-1/4 h-48 w-48 rounded-full blur-[80px]" style={{ background: 'rgba(0,207,255,0.08)' }} />
        <div className="absolute right-0 top-1/2 h-48 w-48 rounded-full blur-[80px]" style={{ background: 'rgba(240,98,146,0.07)' }} />
        <div className="absolute bottom-1/4 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full blur-[70px]" style={{ background: 'rgba(255,179,0,0.07)' }} />
      </div>
      <div ref={coreRef} className="relative z-10 mx-auto mb-8 flex h-[100px] w-[100px] flex-col items-center justify-center rounded-full border-2"
        style={{ background: 'linear-gradient(145deg, #1c1000 0%, #0e0800 50%, #180e00 100%)', borderColor: 'rgba(255,179,0,0.55)', boxShadow: '0 0 40px rgba(255,179,0,0.25), 0 0 80px rgba(255,179,0,0.10), inset 0 1px 0 rgba(255,200,0,0.25)' }}>
        <h2 className="text-center text-[9px] font-black uppercase tracking-tighter leading-tight px-2" style={{ color: '#FFD54F' }}>Why Choose <br /><span className="underline underline-offset-2" style={{ color: '#FFB300', textDecorationColor: 'rgba(255,179,0,0.50)' }}>StudyIn</span><br />Bengaluru?</h2>
      </div>
      <div className="relative z-10 grid grid-cols-1 gap-4 xs:grid-cols-2 sm:grid-cols-2">
        {features.map((f) => (<div key={f.title} className="mobile-why-stack-card">{renderWhyCard(f, 'mobile')}</div>))}
      </div>
    </section>
  )
}

function WhyChooseSection() {
  const containerRef = useRef(null), coreRef = useRef(null), orbitalRef = useRef(null), portalFlashRef = useRef(null)
  if (typeof window !== 'undefined' && isMobileViewport()) return <WhyChooseMobile />
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray('.why-card'), cardContents = gsap.utils.toArray('.why-card-content')
      const baseScale = window.innerWidth >= 1280 ? 0.86 : 0.74
      const readingScale = window.innerWidth >= 1280 ? 1.08 : 0.96
      const diveScale = readingScale * 1.14
      gsap.set(orbitalRef.current, { rotate: 0, scale: baseScale })
      gsap.set(coreRef.current, { scale: 1, opacity: 1, rotateY: 0, transformOrigin: 'center center' })
      gsap.set(cards, { opacity: 1, scale: 1, transformOrigin: 'center center' })
      gsap.set(cardContents, { rotate: 0, y: 0, transformOrigin: 'center center' })
      gsap.set(portalFlashRef.current, { opacity: 0, backgroundColor: 'transparent' })
      gsap.set('.bg-glow', { opacity: 1, scale: 1 })
      const tl = gsap.timeline({ scrollTrigger: { trigger: containerRef.current, start: 'top top', end: '+=160%', scrub: 1, pin: true, anticipatePin: 1, invalidateOnRefresh: true } })
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
        .to(portalFlashRef.current, { opacity: 1, duration: 0.28, backgroundColor: '#020510' }, 'scene3+=0.78')
    }, containerRef)
    return () => ctx.revert()
  }, [])
  return (
    <section ref={containerRef} className="relative flex min-h-[100svh] w-full items-center justify-center overflow-hidden perspective-1000 py-12 md:min-h-[100svh] md:py-8"
      style={{ perspective: '1400px', background: 'linear-gradient(180deg, #06020e 0%, #0a0418 48%, #06020e 100%)' }}>
      <PageGridOverlay opacity="opacity-[0.12]" />
      <div ref={portalFlashRef} className="absolute inset-0 z-[100] opacity-0 pointer-events-none" />
      <div className="bg-glow absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{ width: 500, height: 500 }}>
        <div className="absolute left-1/2 top-0 h-48 w-48 -translate-x-1/2 rounded-full blur-[60px]" style={{ background: 'rgba(0,207,255,0.12)' }} />
        <div className="absolute right-0 top-1/2 h-48 w-48 -translate-y-1/2 rounded-full blur-[60px]" style={{ background: 'rgba(240,98,146,0.10)' }} />
        <div className="absolute bottom-0 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full blur-[60px]" style={{ background: 'rgba(255,179,0,0.10)' }} />
        <div className="absolute left-0 top-1/2 h-48 w-48 -translate-y-1/2 rounded-full blur-[60px]" style={{ background: 'rgba(179,157,219,0.10)' }} />
      </div>
      <div className="relative flex h-full w-full items-center justify-center">
        <div ref={orbitalRef} className="relative flex h-[760px] w-[760px] items-center justify-center preserve-3d" style={{ transform: `scale(0.62)` }}>
          <style>{`@media (min-width: 480px) { .orbital-inner { transform: scale(0.52) !important; } }@media (min-width: 640px) { .orbital-inner { transform: scale(0.65) !important; } }@media (min-width: 768px) { .orbital-inner { transform: scale(0.82) !important; } }@media (min-width: 1024px) { .orbital-inner { transform: scale(1) !important; } }`}</style>
          <div ref={coreRef} className="relative z-50 preserve-3d h-52 w-52 md:h-64 md:w-64">
            <div className="backface-hidden absolute inset-0 flex flex-col items-center justify-center rounded-full border-2"
              style={{ background: 'linear-gradient(145deg, #1c1000 0%, #0e0800 50%, #180e00 100%)', borderColor: 'rgba(255,179,0,0.55)', boxShadow: '0 0 60px rgba(255,179,0,0.28), 0 0 120px rgba(255,179,0,0.10), inset 0 1px 0 rgba(255,200,0,0.25)' }}>
              <h2 className="text-center text-lg font-black uppercase tracking-tighter md:text-2xl" style={{ color: '#FFD54F' }}>Why Choose <br /><span className="underline underline-offset-8" style={{ color: '#FFB300', textDecorationColor: 'rgba(255,179,0,0.50)' }}>StudyIn</span><br />Bengaluru?</h2>
            </div>
            <div className="backface-hidden absolute inset-0 flex items-center justify-center rounded-full border-2"
              style={{ background: 'linear-gradient(145deg, #1e1200 0%, #100900 50%, #1a1000 100%)', borderColor: 'rgba(255,200,0,0.70)', boxShadow: '0 0 80px rgba(255,179,0,0.35)', transform: 'rotateY(180deg)' }}>
              <span className="animate-pulse text-2xl font-bold italic tracking-widest" style={{ color: '#FFB300' }}>Why Bengaluru?</span>
            </div>
          </div>
          {features.map((f, i) => {
            const positions = [
              { top: '50%', left: '50%', transform: 'translate(-50%, -154%)' },
              { top: '50%', left: '50%', transform: 'translate(82%, -50%)' },
              { top: '50%', left: '50%', transform: 'translate(-50%, 54%)' },
              { top: '50%', left: '50%', transform: 'translate(-182%, -50%)' },
            ]
            return (
              <div key={f.title} className="why-card absolute z-40" style={{ width: '245px', ...positions[i] }}>
                <div className="why-card-content preserve-3d">{renderWhyCard(f, 'desktop')}</div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ── SECTION 3 — WHY BENGALURU SLIDER ──
const slideData = [
  { title: 'Innovation Hub', desc: "Bengaluru is India's Silicon Valley, a global leader in IT, biotechnology, and innovation, offering unparalleled opportunities for tech enthusiasts.", img: img1, accent: '#00CFFF', accentDim: '#4FC3F7', glow: 'rgba(0,207,255,0.20)', glowDim: 'rgba(0,207,255,0.08)', borderColor: 'rgba(0,207,255,0.35)' },
  { title: 'Global Opportunities', desc: 'With its thriving economy and multinational companies, Bengaluru is the perfect launchpad for a global career.', img: img2, accent: '#F06292', accentDim: '#F48FB1', glow: 'rgba(240,98,146,0.20)', glowDim: 'rgba(240,98,146,0.08)', borderColor: 'rgba(240,98,146,0.35)' },
  { title: 'Top Institutions', desc: 'Home to prestigious universities and colleges offering diverse courses, Bengaluru ensures world-class education for every student.', img: img3, accent: '#00E5A0', accentDim: '#4DB6AC', glow: 'rgba(0,229,160,0.20)', glowDim: 'rgba(0,229,160,0.08)', borderColor: 'rgba(0,229,160,0.35)' },
  { title: 'Cultural Melting Pot', desc: 'Experience a vibrant mix of cultures, traditions, and communities, making Bengaluru a welcoming city for everyone.', img: img4, accent: '#CE93D8', accentDim: '#B39DDB', glow: 'rgba(206,147,216,0.20)', glowDim: 'rgba(206,147,216,0.08)', borderColor: 'rgba(206,147,216,0.35)' },
  { title: 'Affordable Living', desc: 'Enjoy a high quality of life at a reasonable cost, making Bengaluru an ideal destination for students and professionals alike.', img: img5, accent: '#FFB300', accentDim: '#FFCA28', glow: 'rgba(255,179,0,0.20)', glowDim: 'rgba(255,179,0,0.08)', borderColor: 'rgba(255,179,0,0.35)' },
  { title: 'Thriving Ecosystem', desc: 'From startups to established giants, Bengaluru offers a dynamic ecosystem for learning, networking, and growth.', img: img6, accent: '#B0BEC5', accentDim: '#CFD8DC', glow: 'rgba(176,190,197,0.20)', glowDim: 'rgba(176,190,197,0.08)', borderColor: 'rgba(176,190,197,0.35)' },
]

function WhyBengaluruSection() {
  const triggerRef = useRef(null), contentRef = useRef(null)
  const isMob = typeof window !== 'undefined' && isMobileViewport()

  useLayoutEffect(() => {
    // Mobile: CSS scroll-snap handles it — no GSAP, no pin
    if (isMob) return

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray('.bengaluru-slide')
      const getScrollDistance = () => {
        if (!contentRef.current || !triggerRef.current) return window.innerHeight
        const horizontalDistance = contentRef.current.scrollWidth - triggerRef.current.clientWidth
        const minScrollDistance = window.innerHeight * (items.length - 1) * 0.72
        return Math.max(horizontalDistance, minScrollDistance, window.innerHeight * 0.9)
      }
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerRef.current, start: 'top top',
          end: () => `+=${getScrollDistance()}`, scrub: true,
          snap: { snapTo: items.length > 1 ? 1 / (items.length - 1) : 1, duration: { min: 0.12, max: 0.35 }, delay: 0.03, ease: 'power1.out' },
          pin: true, anticipatePin: 1, invalidateOnRefresh: true,
        },
      })
      tl.to(contentRef.current, { x: () => -(contentRef.current.scrollWidth - triggerRef.current.clientWidth), ease: 'none' })
      items.forEach((slide) => {
        const title = slide.querySelector('h3'), img = slide.querySelector('.slide-img')
        const num = slide.querySelector('.bg-number'), text = slide.querySelector('p')
        if (title && text) gsap.fromTo([title, text], { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.1, scrollTrigger: { trigger: slide, containerAnimation: tl, start: 'left 85%', end: 'left 35%', scrub: true } })
        if (num) gsap.to(num, { x: -100, scrollTrigger: { trigger: slide, containerAnimation: tl, start: 'left right', end: 'right left', scrub: true } })
        if (img) gsap.fromTo(img, { scale: 0.85, opacity: 0 }, { scale: 1, opacity: 1, scrollTrigger: { trigger: slide, containerAnimation: tl, start: 'left 95%', end: 'left 40%', scrub: true } })
      })
      requestAnimationFrame(() => ScrollTrigger.refresh())
    }, triggerRef)
    return () => ctx.revert()
  }, [])

  // ── MOBILE: CSS-only horizontal scroll-snap, auto height, zero GSAP pin ──
  if (isMob) {
    return (
      <section
        ref={triggerRef}
        className="relative w-full overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #030510 0%, #050816 48%, #030510 100%)' }}
      >
        <PageGridOverlay opacity="opacity-[0.10]" />
        {/* Native horizontal scroll with snap — height fits content naturally */}
        <div
          ref={contentRef}
          className="mob-beng-track relative z-10 flex flex-row flex-nowrap"
          style={{
            overflowX: 'auto',
            overflowY: 'hidden',
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
            // hide scrollbar
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {slideData.map((item, index) => (
            <div
              key={item.title}
              className="mob-bengaluru-slide relative flex-shrink-0"
              style={{
                width: '92vw',
                scrollSnapAlign: 'center',
                padding: '1.25rem 0.75rem',
              }}
            >
              {/* Card wrapper */}
              <div className="relative overflow-hidden rounded-[1.4rem]"
                style={{ border: `1px solid ${item.borderColor}`, background: 'linear-gradient(145deg, #04080f 0%, #02050a 100%)', boxShadow: `0 8px 32px rgba(0,0,0,0.70), 0 0 20px ${item.glow}` }}>
                {/* Image */}
                <div className="relative overflow-hidden rounded-t-[1.3rem]">
                  <img src={item.img} alt={item.title} className="slide-img w-full object-cover" style={{ aspectRatio: '16/9', filter: 'brightness(0.88)' }} />
                  <div className="absolute inset-x-0 bottom-0 h-16" style={{ background: 'linear-gradient(to top, #04080f, transparent)' }} />
                  {/* Feature badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-2 rounded-full px-3 py-1 backdrop-blur-md"
                    style={{ background: 'rgba(0,0,0,0.55)', border: `1px solid ${item.borderColor}` }}>
                    <div className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: item.accent }} />
                    <span className="font-mono text-[9px] uppercase tracking-[0.25em]" style={{ color: item.accent }}>Feature {String(index + 1).padStart(2, '0')}</span>
                  </div>
                </div>
                {/* Text */}
                <div className="p-4 space-y-2">
                  <h3 className="text-[1.35rem] font-black uppercase italic leading-tight"
                    style={{ background: `linear-gradient(135deg, ${item.accent} 0%, #ffffff 55%, ${item.accentDim} 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                    {item.title}
                  </h3>
                  <p className="text-[13px] leading-relaxed text-white/68 pl-3" style={{ borderLeft: `2px solid ${item.borderColor}` }}>{item.desc}</p>
                  {/* Dots */}
                  <div className="flex gap-1.5 pt-1">
                    {slideData.map((_, i) => (
                      <div key={i} className="h-[3px] rounded-full"
                        style={{ width: i === index ? '1.6rem' : '0.3rem', background: i === index ? item.accent : 'rgba(255,255,255,0.18)', transition: 'width 0.3s', boxShadow: i === index ? `0 0 6px ${item.glow}` : 'none' }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Hide webkit scrollbar via style tag */}
        <style>{`.mob-beng-track::-webkit-scrollbar{display:none}`}</style>
      </section>
    )
  }

  // ── DESKTOP: original GSAP pinned horizontal scroll ──
  return (
    <section ref={triggerRef} className="relative h-[100svh] overflow-hidden" style={{ background: '#010c1a' }}>
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #030510 0%, #050816 48%, #030510 100%)' }} />
      <PageGridOverlay opacity="opacity-[0.10]" />
      <div ref={contentRef} className="flex w-fit flex-row flex-nowrap" style={{ height: '100svh', alignItems: 'center' }}>
        {slideData.map((item, index) => (
          <div key={item.title} className="bengaluru-slide relative flex flex-shrink-0 items-center justify-center" style={{ width: '74vw', height: '100svh' }}>
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute left-1/4 top-1/2 h-[300px] w-[300px] -translate-y-1/2 rounded-full blur-[100px]" style={{ background: item.glowDim }} />
              <div className="absolute right-1/4 top-1/2 h-[240px] w-[240px] -translate-y-1/2 rounded-full blur-[80px]" style={{ background: item.glowDim }} />
            </div>
            <div className="relative z-10 flex h-full w-full items-center px-5 py-6 sm:px-8 md:px-16 md:py-8 lg:px-20">
              <span className="bg-number pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none text-[22vw] font-black leading-none" style={{ color: `${item.accent}09` }}>0{index + 1}</span>
              <div className="relative z-10 grid w-full max-w-7xl items-center gap-10 md:grid-cols-[minmax(0,0.82fr)_minmax(320px,0.86fr)] lg:gap-14">
                <div className="order-2 min-w-0 space-y-6 md:order-1">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <span className="h-px w-10" style={{ background: `linear-gradient(to right, ${item.accent}, transparent)` }} />
                      <span className="font-mono text-[10px] uppercase tracking-[0.3em]" style={{ color: `${item.accent}cc` }}>Feature 0{index + 1}</span>
                    </div>
                    <h3 className="max-w-[12ch] text-[clamp(2.35rem,4vw,4.35rem)] font-black uppercase italic leading-[0.92]"
                      style={{ background: `linear-gradient(135deg, ${item.accent} 0%, #ffffff 55%, ${item.accentDim} 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', filter: `drop-shadow(0 12px 30px ${item.glow})` }}>
                      {item.title}
                    </h3>
                  </div>
                  <p className="max-w-[34rem] pl-5 text-sm leading-relaxed text-white/70 md:pl-6 md:text-base lg:text-lg" style={{ borderLeft: `2px solid ${item.borderColor}` }}>{item.desc}</p>
                  <div className="flex gap-2">
                    {slideData.map((_, i) => (
                      <div key={i} className="h-1 rounded-full transition-all duration-500"
                        style={{ width: i === index ? '2.5rem' : '0.5rem', background: i === index ? item.accent : 'rgba(255,255,255,0.15)', boxShadow: i === index ? `0 0 10px ${item.glow}` : 'none' }} />
                    ))}
                  </div>
                </div>
                <div className="order-1 flex justify-center md:order-2">
                  <div className="group relative w-full max-w-[340px] md:max-w-[400px]">
                    <div className="absolute -inset-4 hidden rounded-[2.5rem] blur-xl opacity-20 transition-opacity duration-700 group-hover:opacity-40 md:block" style={{ background: item.glow }} />
                    <div className="relative overflow-hidden rounded-[2rem] p-1.5 transition-transform duration-500 group-hover:scale-[1.02] md:p-2"
                      style={{ border: `1px solid ${item.borderColor}`, background: `linear-gradient(145deg, ${item.accent}18 0%, #04080f 100%)`, boxShadow: `inset 0 1px 0 ${item.accent}30, 0 0 40px ${item.glow}` }}>
                      <img src={item.img} alt={item.title} className="slide-img aspect-[4/5] w-full rounded-[2rem] object-cover grayscale-[0.1] transition-all duration-700 group-hover:grayscale-0" />
                      <div className="absolute bottom-6 right-6 flex h-10 w-10 items-center justify-center rounded-xl" style={{ border: `1px solid ${item.borderColor}`, background: 'rgba(0,0,0,0.50)' }}>
                        <div className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: item.accent, boxShadow: `0 0 8px ${item.accent}` }} />
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

// ── HERO ──
function EducationParticles({ count = 16 }) {
  const particles = useMemo(() => {
    const temp = [], colors = ['#00CFFF', '#F06292', '#00E5A0', '#B39DDB', '#FFB300', '#CE93D8', '#4FC3F7', '#FFCA28']
    for (let i = 0; i < count; i++) {
      const x = THREE.MathUtils.randFloatSpread(15), y = THREE.MathUtils.randFloatSpread(15)
      const z = THREE.MathUtils.randFloatSpread(10) - 5, scale = THREE.MathUtils.randFloat(0.05, 0.2)
      const speed = THREE.MathUtils.randFloat(0.1, 0.3), type = i % 3, color = colors[i % colors.length]
      temp.push({ x, y, z, scale, speed, type, color })
    }
    return temp
  }, [count])
  return (
    <group>
      {particles.map((p, i) => (
        <DreiFloat key={i} speed={p.speed * 4} rotationIntensity={1.5} floatIntensity={2}>
          <mesh position={[p.x, p.y, p.z]} scale={p.scale}>
            {p.type === 0 ? <boxGeometry args={[1, 1, 1]} /> : p.type === 1 ? <sphereGeometry args={[0.6, 10, 10]} /> : <torusGeometry args={[0.5, 0.15, 6, 12]} />}
            <meshStandardMaterial color={p.color} transparent opacity={0.38} roughness={0.15} metalness={0.80} />
          </mesh>
        </DreiFloat>
      ))}
    </group>
  )
}

function EducationModel({ modelScale = 0.78, modelPosition = [1.38, -0.08, 0] }) {
  const { scene } = useGLTF('/3d_sketchbook_6_-_education_icon.glb'), ref = useRef()
  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    ref.current.rotation.y = -0.12 + Math.sin(t / 3) * 0.08
    ref.current.rotation.z = Math.cos(t / 4) * 0.025
    ref.current.position.y = modelPosition[1] + Math.sin(t * 1.2) * 0.045
  })
  return <primitive ref={ref} object={scene} scale={modelScale} position={modelPosition} />
}

function Scene3D({ compact = false }) {
  const modelPosition = compact ? [0, -0.16, 0] : [1.38, -0.08, 0]
  const modelScale = compact ? 0.82 : 0.78
  const shadowPosition = compact ? [0, -1.28, 0] : [1.38, -1.36, 0]
  return (
    <CanvasErrorBoundary>
      <Canvas dpr={[1, 1.25]} gl={{ antialias: false, powerPreference: 'high-performance' }}>
        <PerspectiveCamera makeDefault position={[0, 0, 5.5]} fov={34} />
        <ambientLight intensity={1.8} />
        <spotLight position={[5, 10, 5]} angle={0.25} penumbra={1} intensity={3.5} color="#00CFFF" />
        <pointLight position={[-10, -10, -10]} color="#E040FB" intensity={2.2} />
        <pointLight position={[10, -5, 5]} color="#00E5A0" intensity={1.8} />
        <Suspense fallback={null}>
          <EducationParticles count={compact ? 10 : 16} />
          <EducationModel modelScale={modelScale} modelPosition={modelPosition} />
          <Environment preset="city" />
          <ContactShadows position={shadowPosition} opacity={0.28} scale={compact ? 3 : 4.4} blur={1.6} color="#000820" />
        </Suspense>
        <OrbitControls enableZoom={false} enablePan={false} makeDefault rotateSpeed={0.4} minPolarAngle={Math.PI / 2.5} maxPolarAngle={Math.PI / 1.5} />
      </Canvas>
    </CanvasErrorBoundary>
  )
}

function GlobalBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #020510 0%, #040820 48%, #020510 100%)' }} />
      <div className="absolute left-[-10%] top-[-10%] h-[520px] w-[520px] rounded-full blur-[120px]" style={{ background: 'rgba(0,207,255,0.08)' }} />
      <div className="absolute right-[-8%] top-[-8%] h-[480px] w-[480px] rounded-full blur-[120px]" style={{ background: 'rgba(224,64,251,0.08)' }} />
      <div className="absolute bottom-[-12%] left-1/3 h-[440px] w-[500px] rounded-full blur-[130px]" style={{ background: 'rgba(0,229,160,0.06)' }} />
      <div className="absolute bottom-[-8%] right-1/4 h-[380px] w-[380px] rounded-full blur-[110px]" style={{ background: 'rgba(255,179,0,0.05)' }} />
      <div className="absolute left-1/4 top-1/2 h-[240px] w-[240px] rounded-full blur-[80px]" style={{ background: 'rgba(240,98,146,0.05)' }} />
      <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.9)_1px,transparent_1px)] bg-[size:24px_24px]" />
    </div>
  )
}

function HeroCanvasSection() {
  return (
    <div className="parallax-canvas absolute inset-0 z-10 hidden h-screen pointer-events-none md:block">
      <div className="absolute inset-0 pointer-events-auto"><Scene3D /></div>
    </div>
  )
}

function HeroSection() {
  return (
    <section className="relative z-20 flex min-h-[100svh] items-center px-0 pb-8 pt-4 pointer-events-auto md:min-h-[92svh] md:py-10 lg:min-h-[96vh] lg:px-24 lg:py-0 lg:pointer-events-none">
      <PageGridOverlay opacity="opacity-[0.12]" />
      <div className="container mx-auto grid grid-cols-1 items-center gap-4 md:gap-8 lg:grid-cols-2 lg:gap-10">
        <div className="relative w-full max-w-2xl px-4 text-center pointer-events-auto sm:px-6 lg:px-0 lg:text-left">
          <div className="reveal relative mx-auto mb-2 h-[200px] w-full max-w-[340px] md:hidden">
            <div className="absolute inset-x-10 bottom-0 h-12 rounded-full blur-3xl" style={{ background: 'rgba(0,207,255,0.22)' }} />
            <div className="absolute inset-0"><Scene3D compact /></div>
          </div>
          <div className="reveal absolute -top-12 -left-8 hidden items-center gap-2 rounded-2xl border px-4 py-2 backdrop-blur-md animate-[bounce_4s_infinite] md:flex"
            style={{ borderColor: 'rgba(0,207,255,0.30)', background: 'linear-gradient(145deg, #041828, #01080f)', boxShadow: '0 10px 30px rgba(0,207,255,0.12), inset 0 1px 0 rgba(0,207,255,0.15)' }}>
            <span className="h-2 w-2 rounded-full" style={{ background: '#00CFFF', boxShadow: '0 0 10px #00CFFF' }} />
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#4FC3F7' }}>Est. 2024</span>
          </div>
          <div className="reveal mb-4 inline-block rounded-full border px-4 py-2 text-[9px] font-black uppercase tracking-[0.3em] backdrop-blur-xl sm:tracking-[0.4em] sm:text-[10px] md:mb-6"
            style={{ borderColor: 'rgba(224,64,251,0.30)', color: '#CE93D8', background: 'linear-gradient(145deg, rgba(224,64,251,0.10), rgba(224,64,251,0.04))', boxShadow: '0 0 20px rgba(224,64,251,0.12)' }}>Our Identity</div>
          <h1 className="reveal mb-4 text-[clamp(2.8rem,12vw,7rem)] font-black leading-[0.88] tracking-tighter text-white drop-shadow-2xl md:mb-5 lg:mb-8 lg:text-[clamp(4rem,9vw,8rem)]">
            About <br />
            <span style={{ background: 'linear-gradient(135deg, #00CFFF 0%, #CE93D8 45%, #00E5A0 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Study in</span>
            <br />Bengaluru
          </h1>
          <p className="reveal mx-auto mb-6 max-w-lg text-sm font-light leading-relaxed text-white/72 sm:text-base lg:mx-0 lg:mb-10 lg:text-xl">
            Welcome to the premier admission ecosystem. We don't just process applications; we engineer{' '}
            <span className="font-medium italic" style={{ color: '#00CFFF' }}>transformative educational journeys</span>.
          </p>
          
        </div>
        <div className="hidden h-[500px] lg:block" />
      </div>
    </section>
  )
}

function ParallaxTextStrip({ textStripRef }) {
  return (
    <section ref={textStripRef} className="relative z-10 -mt-3 overflow-hidden py-1 sm:-mt-4 sm:py-2 lg:-mt-6 lg:py-3">
      <h2 className="parallax-text whitespace-nowrap text-[clamp(3rem,12vw,18rem)] font-black uppercase tracking-tighter"
        style={{ background: 'linear-gradient(90deg, rgba(0,207,255,0.15) 0%, rgba(224,64,251,0.12) 25%, rgba(0,229,160,0.12) 50%, rgba(255,179,0,0.10) 75%, rgba(0,207,255,0.12) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
        Innovate • Empower • Transform • Discover •
      </h2>
    </section>
  )
}

const About = () => {
  const containerRef = useRef(null), textStripRef = useRef(null)
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.reveal', { y: 44, opacity: 0, duration: 0.85, stagger: 0.1, ease: 'power3.out', delay: 0.1 })
      if (!isMobileViewport()) {
        gsap.to('.parallax-canvas', { scrollTrigger: { trigger: containerRef.current, start: 'top top', end: 'bottom top', scrub: true }, y: 120 })
      }
      gsap.to('.parallax-text', { scrollTrigger: { trigger: textStripRef.current, start: 'top bottom', end: 'bottom top', scrub: true, invalidateOnRefresh: true }, xPercent: -18 })
    }, containerRef)
    return () => ctx.revert()
  }, [])

  return (
    <main ref={containerRef} className="relative min-h-screen overflow-x-hidden px-0" style={{ background: '#020510' }}>
      <GlobalBackground />
      <HeroCanvasSection />
      <HeroSection />
      <ParallaxTextStrip textStripRef={textStripRef} />
      <AboutCardsSection />
      <WhyChooseSection />
      <WhyBengaluruSection />
    </main>
  )
}

export default About;