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

/* ─── Data — glossy black cards with white text ──────────────────────────── */
const cardData = [
  { title: 'Universities',       subtitle: 'GLOBAL ACCESS',  icon: GraduationCap, code: 'UN',  accent: '#ffffff', accentSoft: 'rgba(255,255,255,0.08)',  note: 'Compare top institutions with clearer admissions guidance.',     path: '/services#universities' },
  { title: 'Colleges',           subtitle: 'CITY NETWORK',   icon: School,        code: 'CL',  accent: '#ffffff', accentSoft: 'rgba(255,255,255,0.08)',  note: 'Find trusted colleges across Bengaluru with practical support.', path: '/services#colleges'     },
  { title: 'Courses',            subtitle: 'FUTURE TRACKS',  icon: BookOpen,      code: 'CR',  accent: '#ffffff', accentSoft: 'rgba(255,255,255,0.08)',  note: 'Match your goals with programs that fit your next move.',        path: '/services#courses'      },
  { title: 'Online Courses',     subtitle: 'REMOTE READY',   icon: Globe,         code: 'OC',  accent: '#ffffff', accentSoft: 'rgba(255,255,255,0.08)',  note: 'Add flexible learning paths alongside your academic plan.',      path: null                     },
  { title: 'Short-term',         subtitle: 'FAST SKILLS',    icon: Clock,         code: 'SP',  accent: '#ffffff', accentSoft: 'rgba(255,255,255,0.08)',  note: 'Build employable skills through focused, practical programs.',   path: null                     },
  { title: 'Part-time Jobs',     subtitle: 'WORK ACCESS',    icon: Briefcase,     code: 'PJ',  accent: '#ffffff', accentSoft: 'rgba(255,255,255,0.08)',  note: 'Discover student-friendly work options around your schedule.',   path: null                     },
  { title: 'Accommodation',      subtitle: 'NEAR ME',        icon: Library,       code: 'AC',  accent: '#ffffff', accentSoft: 'rgba(255,255,255,0.08)',  note: 'Explore convenient stays close to your campus and city life.',   path: null                     },
  { title: 'Events',             subtitle: 'CAMPUS LIFE',    icon: Calendar,      code: 'EV',  accent: '#ffffff', accentSoft: 'rgba(255,255,255,0.08)',  note: 'Stay close to student events, meetups, and opportunity days.',  path: null                     },
  { title: '1-on-1 Counselling', subtitle: 'FREE SESSION',   icon: MessageCircle, code: '1:1', accent: '#ffffff', accentSoft: 'rgba(255,255,255,0.08)',  note: 'Talk through choices with personal guidance before you apply.',  path: null                     },
  { title: 'Internships',        subtitle: 'CAREER SIGNAL',  icon: UserCheck,     code: 'IN',  accent: '#ffffff', accentSoft: 'rgba(255,255,255,0.08)',  note: 'Connect academic decisions with early career experience.',       path: null                     },
]

/* ─── Noise grain ────────────────────────────────────────────────────────── */
const NoiseBg = () => (
  <svg className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-[0.025]" aria-hidden>
    <filter id="opp-noise">
      <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="4" stitchTiles="stitch" />
      <feColorMatrix type="saturate" values="0" />
    </filter>
    <rect width="100%" height="100%" filter="url(#opp-noise)" />
  </svg>
)

/* ─── Subtle grid pattern ────────────────────────────────────────────────── */
const GridPattern = () => (
  <div
    aria-hidden
    className="pointer-events-none absolute inset-0 z-0 opacity-[0.07]"
    style={{
      backgroundImage: `
        linear-gradient(rgba(0,0,0,0.25) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0,0,0,0.25) 1px, transparent 1px)
      `,
      backgroundSize: '48px 48px',
    }}
  />
)

/* ─── Ambient orbs — subtle dark glows on white bg ──────────────────────── */
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
    style={{
      backgroundImage:
        'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.008) 3px,rgba(0,0,0,0.008) 4px)',
    }}
  />
)

/* ─── Component ──────────────────────────────────────────────────────────── */
function Opportunities({ onNavigate }) {
  const containerRef = useRef(null)
  const galleryRef   = useRef(null)
  const triggerRef   = useRef(null)

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
    const frameId = requestAnimationFrame(() => {
      const ctx = gsap.context(() => {
        const n = galleryItems.length

        const getScrollDist = () => {
          const vw  = window.innerWidth
          const vh  = window.innerHeight
          const mob = vw < 768
          return Math.round(vh * (mob ? n * 0.72 : n * 0.38))
        }

        triggerRef.current = ScrollTrigger.create({
          trigger:   containerRef.current,
          start:     'top top',
          end:       () => `+=${getScrollDist()}`,
          pin:       true,
          scrub:     1.2,
          snap: {
            snapTo:   n > 1 ? 1 / (n - 1) : 1,
            duration: { min: 0.15, max: 0.30 },
            delay:    0.05,
            ease:     'power1.inOut',
          },
          anticipatePin:       1,
          invalidateOnRefresh: true,
          onUpdate:    (self) => galleryRef.current?.setScrollProgress(self.progress),
          onLeaveBack: ()     => galleryRef.current?.setScrollProgress(0),
        })

        /* Heading reveal */
        gsap.fromTo('.opp-heading',
          { opacity: 0, y: 28, filter: 'blur(10px)' },
          {
            opacity: 1, y: 0, filter: 'blur(0px)',
            duration: 1.0, ease: 'expo.out', stagger: 0.08,
            scrollTrigger: {
              trigger: containerRef.current,
              start:   'top 80%',
              toggleActions: 'play none none reverse',
            },
          })

        /* Orbs float */
        gsap.to('.opp-orb-a', { y: -26, x: 16,  duration: 7,  repeat: -1, yoyo: true, ease: 'sine.inOut' })
        gsap.to('.opp-orb-b', { y:  20, x: -12, duration: 9,  repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1.5 })
        gsap.to('.opp-orb-c', { y: -16, x: 22,  duration: 11, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 3   })
      }, containerRef)

      return () => ctx.revert()
    })

    return () => {
      cancelAnimationFrame(frameId)
      triggerRef.current?.kill()
    }
  }, [galleryItems.length])

  const handleSelect = (item) => {
    if (item.path) onNavigate?.(item.path)
  }

  return (
    <>
      <style>{`
        /* ── Ambient orbs — soft dark on white ── */
        .opp-orb-a { background: radial-gradient(circle, rgba(0,0,0,0.04) 0%, transparent 70%); filter: blur(80px); }
        .opp-orb-b { background: radial-gradient(circle, rgba(0,0,0,0.03) 0%, transparent 70%); filter: blur(90px); }
        .opp-orb-c { background: radial-gradient(circle, rgba(0,0,0,0.03) 0%, transparent 70%); filter: blur(100px); }

        /* ── Chip ── */
        .opp-chip {
          background: rgba(0,0,0,0.06);
          border: 1px solid rgba(0,0,0,0.14);
          border-radius: 100px;
          font-size: 10px;
          letter-spacing: 0.18em;
          font-weight: 700;
          text-transform: uppercase;
          color: rgba(0,0,0,0.45);
          padding: 5px 16px;
          display: inline-block;
        }

        /* ── Footer divider ── */
        .opp-foot-line {
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(0,0,0,0.16) 40%,
            rgba(0,0,0,0.16) 60%,
            transparent
          );
        }

        /* ── Gallery wrapper ── */
        .opp-gallery-wrap {
          position: relative;
          opacity: 1 !important;
          filter: none !important;
          mix-blend-mode: normal !important;
          width: 100%;
          height: calc(100svh - 240px);
          min-height: 320px;
          max-height: 680px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* ── Mobile: gallery takes remaining space so card fits fully ── */
        @media (max-width: 767px) {
          .opp-gallery-wrap {
            height: calc(100svh - 180px);
            max-height: none;
            min-height: 0;
          }
        }

        .opp-gallery-wrap > * {
          position: absolute !important;
          inset: 0 !important;
          width: 100% !important;
          height: 100% !important;
        }
        .opp-gallery-wrap canvas {
          opacity: 1 !important;
          filter: none !important;
          mix-blend-mode: normal !important;
        }

        /* ── Edge fade colours matching the white background ── */
        .opp-edge-left {
          background: linear-gradient(to right, #ffffff, transparent) !important;
        }
        .opp-edge-right {
          background: linear-gradient(to left, #ffffff, transparent) !important;
        }

        /* ── Mobile: hide edge fades entirely so card isn't clipped ── */
        @media (max-width: 767px) {
          .opp-edge-left,
          .opp-edge-right {
            display: none !important;
          }
        }

        /* ── Mobile: tighten header so more room goes to the card ── */
        @media (max-width: 767px) {
          .opp-head {
            padding-top: 10px !important;
            padding-bottom: 4px !important;
            gap: 6px !important;
          }
          .opp-foot {
            padding-top: 4px !important;
            padding-bottom: 4px !important;
          }
        }
      `}</style>

      <div
        ref={containerRef}
        className="relative flex h-[100svh] w-full flex-col items-center overflow-hidden"
        style={{
          background: '#ffffff',
        }}
      >
        <NoiseBg />
        <GridPattern />
        <ScanLines />
        <AmbientOrbs />

        {/* Top edge line */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px"
          style={{
            background:
              'linear-gradient(90deg, transparent, rgba(0,0,0,0.18) 30%, rgba(0,0,0,0.18) 70%, transparent)',
          }}
        />

        {/* ── Head ── */}
        <div className="opp-head relative z-10 flex w-full flex-shrink-0 flex-col items-center gap-3 px-4 pt-10 pb-2 sm:pt-14 sm:gap-4">

          <div className="opp-heading">
            <span className="opp-chip">What We Offer</span>
          </div>

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
              colorFrom="rgba(0,0,0,0.25)"
              colorTo="#000000"
              textAlign="center"
              className="mx-auto whitespace-nowrap text-[clamp(1.6rem,4.2vw,3.6rem)] font-black leading-[1.0] tracking-[-0.025em] text-black"
            />
          </div>

          <p
            className="opp-heading mx-auto max-w-[min(88vw,440px)] text-center text-[clamp(0.75rem,1.6vw,0.92rem)] font-light leading-relaxed"
            style={{ color: 'rgba(0,0,0,0.42)' }}
          >
            Tap any card to enter — each one is a gateway to your next step.
          </p>
        </div>

        {/* ── Gallery ── */}
        <div className="opp-gallery opp-gallery-wrap z-10 flex-1">
          <CircularGallery
            ref={galleryRef}
            items={galleryItems}
            bend={2.6}
            borderRadius={0.07}
            scrollSpeed={2.2}
            scrollEase={0.045}
            onSelect={handleSelect}
          />
          {/* Edge fades — pure white (hidden on mobile via CSS) */}
          <div
            className="opp-edge-left pointer-events-none absolute inset-y-0 left-0 z-20 w-[10vw]"
          />
          <div
            className="opp-edge-right pointer-events-none absolute inset-y-0 right-0 z-20 w-[10vw]"
          />
        </div>

        {/* ── Footer ── */}
        <div className="opp-foot relative z-10 flex flex-shrink-0 flex-col items-center gap-2 py-4">
          <div className="opp-foot-line w-16" />
          <span
            className="mt-1 text-[9px] font-bold uppercase tracking-[0.34em]"
            style={{ color: 'rgba(0,0,0,0.22)' }}
          >
            Opportunities 2026
          </span>
        </div>

        {/* Bottom edge line */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-px"
          style={{
            background:
              'linear-gradient(90deg, transparent, rgba(0,0,0,0.14) 30%, rgba(0,0,0,0.14) 70%, transparent)',
          }}
        />
      </div>
    </>
  )
}

export default Opportunities