import { useEffect, useMemo, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  GraduationCap, BookOpen, School, Library, Globe, Clock, Briefcase,
  Calendar, MessageCircle, UserCheck,
} from 'lucide-react'
import CircularGallery from '../../Components/CircularGallery'
import Shuffle from '../../../components/ui/shuffle'

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

const opportunitySectionBackground = {
  background: 'radial-gradient(circle at 14% 20%, rgba(34, 211, 238, 0.13) 0%, transparent 26%), radial-gradient(circle at 84% 18%, rgba(232, 121, 249, 0.14) 0%, transparent 28%), radial-gradient(circle at 50% 100%, rgba(245, 158, 11, 0.08) 0%, transparent 34%), linear-gradient(180deg, #08040f 0%, #14091d 48%, #0c0614 100%)'
}

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
        end: () => {
          const mobile = window.innerWidth < 768
          return `+=${mobile ? window.innerHeight * 1.15 : Math.max(window.innerHeight * 2.4, galleryItems.length * 260)}`
        },
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
  }, [galleryItems.length])

  const handleSelect = (item) => {
    if (item.path) onNavigate?.(item.path)
  }

  return (
    <div
      ref={containerRef}
      className="relative flex min-h-[88svh] w-full items-center overflow-hidden border-y border-white/6 bg-[#0f0816] py-7 sm:min-h-[92svh] sm:py-10 lg:min-h-[100svh] lg:py-14"
      style={opportunitySectionBackground}
    >
      <HomeGridOverlay opacity="opacity-[0.16]" />
      <div className="absolute left-1/2 top-1/2 z-0 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/10 blur-[90px] sm:h-[520px] sm:w-[520px] lg:h-[620px] lg:w-[620px] lg:blur-[120px]" />
      <div className="relative z-10 mx-auto w-full max-w-[1620px] px-3 sm:px-6 lg:px-8">
        <div className="opportunity-heading mb-3 flex flex-col items-center justify-between gap-4 sm:mb-4 md:mb-0 md:flex-row md:items-end">
          <div className="relative w-full text-center md:w-auto md:text-left">
            <Shuffle
              text="Explore Opportunities"
              tag="h2"
              shuffleDirection="right"
              duration={0.42}
              animationMode="evenodd"
              shuffleTimes={2}
              ease="power3.out"
              stagger={0.025}
              threshold={0.1}
              triggerOnce={true}
              triggerOnHover={true}
              respectReducedMotion={true}
              scrambleCharset="ExploreOpportunities"
              colorFrom="rgba(103,232,249,0.45)"
              colorTo="#ffffff"
              textAlign="inherit"
              className="mx-auto max-w-[min(92vw,44rem)] whitespace-normal break-words bg-gradient-to-r from-white via-violet-200 via-55% to-cyan-200 bg-clip-text text-[clamp(2rem,11vw,4.9rem)] font-black leading-[0.92] tracking-tight text-transparent drop-shadow-[0_0_22px_rgba(34,211,238,0.34)] [text-shadow:0_0_26px_rgba(168,85,247,0.26)] md:mx-0 md:max-w-none md:whitespace-nowrap md:text-[clamp(1.95rem,4.6vw,4.9rem)]"
            />
            <span className="absolute -bottom-3 left-1/2 h-1 w-4/5 -translate-x-1/2 rounded-full bg-gradient-to-r from-violet-400 via-cyan-300 to-fuchsia-300 shadow-[0_0_24px_rgba(34,211,238,0.55)] md:left-0 md:w-full md:translate-x-0" />
            <span className="pointer-events-none absolute -inset-x-4 -bottom-5 h-10 rounded-full bg-cyan-400/10 blur-2xl" />
          </div>
          <div className="hidden h-px flex-grow bg-gradient-to-r from-violet-400/50 via-cyan-300/30 to-transparent md:block" />
        </div>

        <div className="opportunity-gallery-shell relative mx-auto h-[min(58svh,470px)] w-full sm:h-[clamp(430px,58svh,620px)]">
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

        <div className="mt-0 flex items-center justify-center gap-3 opacity-25 sm:-mt-4 sm:gap-4">
            <div className="h-px w-10 bg-white sm:w-12" />
            <span className="max-w-[54vw] text-center text-[8px] font-bold uppercase tracking-[0.32em] sm:max-w-none sm:text-[9px] sm:tracking-[1em]">Opportunities 2026</span>
            <div className="h-px w-10 bg-white sm:w-12" />
        </div>
      </div>
    </div>
  )
}

export default Opportunities
