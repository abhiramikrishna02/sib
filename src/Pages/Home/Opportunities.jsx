import { useEffect, useMemo, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  GraduationCap, BookOpen, School, Library, Globe, Clock, Briefcase,
  Calendar, MessageCircle, UserCheck,
} from 'lucide-react'
import CircularGallery from '../../Components/CircularGallery'
import Shuffle from '../../../components/ui/shuffle'

gsap.registerPlugin(ScrollTrigger)

/* ─── Data ──────────────────────────────────────────────────────────────── */
const cardData = [
  { title: 'Universities',       subtitle: 'GLOBAL ACCESS',  icon: GraduationCap, code: 'UN',  accent: '#ff6b35', accentSoft: 'rgba(255,107,53,0.22)',  note: 'Compare top institutions with clearer admissions guidance.',       path: '/services#universities' },
  { title: 'Colleges',           subtitle: 'CITY NETWORK',   icon: School,        code: 'CL',  accent: '#00d4aa', accentSoft: 'rgba(0,212,170,0.20)',    note: 'Find trusted colleges across Bengaluru with practical support.',   path: '/services#colleges'    },
  { title: 'Courses',            subtitle: 'FUTURE TRACKS',  icon: BookOpen,      code: 'CR',  accent: '#ffd60a', accentSoft: 'rgba(255,214,10,0.18)',   note: 'Match your goals with programs that fit your next move.',           path: '/services#courses'     },
  { title: 'Online Courses',     subtitle: 'REMOTE READY',   icon: Globe,         code: 'OC',  accent: '#ff4d6d', accentSoft: 'rgba(255,77,109,0.22)',   note: 'Add flexible learning paths alongside your academic plan.',         path: null                    },
  { title: 'Short-term',         subtitle: 'FAST SKILLS',    icon: Clock,         code: 'SP',  accent: '#a78bfa', accentSoft: 'rgba(167,139,250,0.22)',  note: 'Build employable skills through focused, practical programs.',      path: null                    },
  { title: 'Part-time Jobs',     subtitle: 'WORK ACCESS',    icon: Briefcase,     code: 'PJ',  accent: '#38bdf8', accentSoft: 'rgba(56,189,248,0.20)',   note: 'Discover student-friendly work options around your schedule.',      path: null                    },
  { title: 'Accommodation',      subtitle: 'NEAR ME',        icon: Library,       code: 'AC',  accent: '#f472b6', accentSoft: 'rgba(244,114,182,0.22)',  note: 'Explore convenient stays close to your campus and city life.',      path: null                    },
  { title: 'Events',             subtitle: 'CAMPUS LIFE',    icon: Calendar,      code: 'EV',  accent: '#4ade80', accentSoft: 'rgba(74,222,128,0.20)',   note: 'Stay close to student events, meetups, and opportunity days.',     path: null                    },
  { title: '1-on-1 Counselling', subtitle: 'FREE SESSION',   icon: MessageCircle, code: '1:1', accent: '#fb923c', accentSoft: 'rgba(251,146,60,0.22)',   note: 'Talk through choices with personal guidance before you apply.',     path: null                    },
  { title: 'Internships',        subtitle: 'CAREER SIGNAL',  icon: UserCheck,     code: 'IN',  accent: '#86efac', accentSoft: 'rgba(134,239,172,0.20)',  note: 'Connect academic decisions with early career experience.',          path: null                    },
]

/* ─── Noise grain ────────────────────────────────────────────────────────── */
const NoiseBg = () => (
  <svg className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-[0.022]" aria-hidden>
    <filter id="opp-noise">
      <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="4" stitchTiles="stitch" />
      <feColorMatrix type="saturate" values="0" />
    </filter>
    <rect width="100%" height="100%" filter="url(#opp-noise)" />
  </svg>
)

/* ─── Ambient orbs ───────────────────────────────────────────────────────── */
const AmbientOrbs = () => (
  <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
    <div className="opp-orb opp-orb-a absolute -left-[10vw] top-[6%]  h-[46vmin] w-[46vmin] rounded-full" />
    <div className="opp-orb opp-orb-b absolute right-[-6vw]  top-[18%] h-[38vmin] w-[38vmin] rounded-full" />
    <div className="opp-orb opp-orb-c absolute bottom-[3%] left-[28%] h-[34vmin] w-[34vmin] rounded-full" />
  </div>
)

/* ─── Scanlines ──────────────────────────────────────────────────────────── */
const ScanLines = () => (
  <div
    aria-hidden
    className="pointer-events-none absolute inset-0 z-0"
    style={{ backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(255,255,255,0.010) 3px,rgba(255,255,255,0.010) 4px)' }}
  />
)

/* ─── Component ──────────────────────────────────────────────────────────── */
function Opportunities({ onNavigate }) {
  const containerRef = useRef(null)
  const galleryRef   = useRef(null)

  const galleryItems = useMemo(() => cardData.map((item) => ({
    text:       item.title,
    subtitle:   item.subtitle,
    note:       item.note,
    code:       item.code,
    accent:     item.accent,
    accentSoft: item.accentSoft,
    path:       item.path,
  })), [])

  useEffect(() => {
    const getScrollDist = () => {
      const n   = Math.max(galleryItems.length, 1)
      const mob = window.innerWidth < 768
      return Math.max(window.innerHeight * (mob ? n * 0.82 : 2.4), n * (mob ? 260 : 320))
    }

    const ctx = gsap.context(() => {
      /* Carousel scroll-pin */
      const carouselTrigger = ScrollTrigger.create({
        trigger: containerRef.current,
        start:   'top top',
        end:     () => `+=${getScrollDist()}`,
        pin:     true,
        scrub:   1,
        snap: {
          snapTo:   galleryItems.length > 1 ? 1 / (galleryItems.length - 1) : 1,
          duration: { min: 0.12, max: 0.28 },
          delay:    0.04,
          ease:     'power1.out',
        },
        anticipatePin:       1,
        invalidateOnRefresh: true,
        onUpdate:    (self) => galleryRef.current?.setScrollProgress(self.progress),
        onLeaveBack: ()     => galleryRef.current?.setScrollProgress(0),
      })

      requestAnimationFrame(() => { carouselTrigger.refresh(); ScrollTrigger.refresh() })

      /* Heading reveal */
      gsap.fromTo('.opp-heading',
        { opacity: 0, y: 32, filter: 'blur(12px)' },
        { opacity: 1, y: 0,  filter: 'blur(0px)', duration: 1.0, ease: 'expo.out', stagger: 0.08,
          scrollTrigger: { trigger: containerRef.current, start: 'top 80%', toggleActions: 'play none none reverse' }
        })

      /* Gallery reveal */
      gsap.fromTo('.opp-gallery',
        { opacity: 0, scale: 0.94, y: 44 },
        { opacity: 1, scale: 1,    y: 0,  duration: 1.2, ease: 'expo.out',
          scrollTrigger: { trigger: containerRef.current, start: 'top 65%', toggleActions: 'play none none reverse' }
        })

      /* Orbs float */
      gsap.to('.opp-orb-a', { y: -26, x: 16,  duration: 7,  repeat: -1, yoyo: true, ease: 'sine.inOut' })
      gsap.to('.opp-orb-b', { y:  20, x: -12, duration: 9,  repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1.5 })
      gsap.to('.opp-orb-c', { y: -16, x: 22,  duration: 11, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 3   })
    }, containerRef)

    return () => ctx.revert()
  }, [galleryItems.length])

  const handleSelect = (item) => {
    if (item.path) onNavigate?.(item.path)
  }

  return (
    <>
      <style>{`
        /* Orbs */
        .opp-orb-a { background: radial-gradient(circle, rgba(255,107,53,0.30) 0%, transparent 68%); filter: blur(72px); }
        .opp-orb-b { background: radial-gradient(circle, rgba(167,139,250,0.26) 0%, transparent 68%); filter: blur(82px); }
        .opp-orb-c { background: radial-gradient(circle, rgba(0,212,170,0.24) 0%, transparent 68%); filter: blur(90px); }

        /* Chip */
        .opp-chip {
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 100px;
          font-size: 10px;
          letter-spacing: .16em;
          font-weight: 700;
          text-transform: uppercase;
          color: rgba(255,255,255,0.50);
          padding: 5px 16px;
          display: inline-block;
        }

        /* Footer divider */
        .opp-foot-line {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.16) 40%, rgba(255,255,255,0.16) 60%, transparent);
        }
      `}</style>

      <div
        ref={containerRef}
        className="relative flex min-h-[100svh] w-full flex-col items-center overflow-hidden"
        style={{ background: 'linear-gradient(155deg, #0d0820 0%, #150d2a 35%, #0f1628 65%, #0a0d1f 100%)' }}
      >
        <NoiseBg />
        <ScanLines />
        <AmbientOrbs />

        {/* Top edge line */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px"
          style={{ background: 'linear-gradient(90deg,transparent,rgba(255,107,53,0.60) 28%,rgba(167,139,250,0.60) 65%,transparent)' }} />

        {/* ── Head ── */}
        <div className="relative z-10 flex w-full flex-col items-center gap-3 px-4 pt-10 pb-4 sm:pt-14 sm:gap-4">

          <div className="opp-heading">
            <span className="opp-chip">What We Offer</span>
          </div>

          {/* Title — tighter clamp so it never wraps */}
          <div className="opp-heading w-full text-center">
            <Shuffle
              text="Explore Opportunities"
              tag="h2"
              shuffleDirection="right"
              duration={0.40}
              animationMode="evenodd"
              shuffleTimes={2}
              ease="power3.out"
              stagger={0.022}
              threshold={0.1}
              triggerOnce={true}
              triggerOnHover={true}
              respectReducedMotion={true}
              scrambleCharset="ExploreOpportunities"
              colorFrom="rgba(255,107,53,0.50)"
              colorTo="#ffffff"
              textAlign="center"
              className="mx-auto whitespace-nowrap bg-gradient-to-r from-[#ff6b35] via-white via-40% to-[#a78bfa] bg-clip-text text-[clamp(1.7rem,4.2vw,3.6rem)] font-black leading-[1.0] tracking-[-0.025em] text-transparent"
            />
          </div>

          {/* Subtitle */}
          <p className="opp-heading mx-auto max-w-[min(88vw,440px)] text-center text-[clamp(0.78rem,1.6vw,0.95rem)] font-light leading-relaxed text-white/38">
            Tap any card to enter — each one is a gateway to your next step.
          </p>
        </div>

        {/* ── Gallery — takes remaining space ── */}
        <div
          className="opp-gallery relative z-10 w-full"
          style={{ flex: '1 1 auto', minHeight: 'clamp(400px,55svh,620px)' }}
        >
          <CircularGallery
            ref={galleryRef}
            items={galleryItems}
            bend={2.6}
            borderRadius={0.07}
            scrollSpeed={2.2}
            scrollEase={0.045}
            onSelect={handleSelect}
          />
          {/* Full-bleed edge fades */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-[10vw] bg-gradient-to-r from-[#0a0d1f] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-[10vw] bg-gradient-to-l from-[#0a0d1f] to-transparent" />
        </div>

        {/* ── Footer ── */}
        <div className="relative z-10 flex flex-col items-center gap-2 py-6">
          <div className="opp-foot-line w-16" />
          <span className="mt-1 text-[9px] font-bold uppercase tracking-[0.34em] text-white/18">Opportunities 2026</span>
        </div>

        {/* Bottom edge line */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-px"
          style={{ background: 'linear-gradient(90deg,transparent,rgba(167,139,250,0.45) 28%,rgba(0,212,170,0.45) 65%,transparent)' }} />
      </div>
    </>
  )
}

export default Opportunities