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

/* ─── Data — each card gets its own accent from the About palette ────────── */
const cardData = [
  { title: 'Universities',       subtitle: 'GLOBAL ACCESS',  icon: GraduationCap, code: 'UN',  accent: '#00E5A0', accentSoft: 'rgba(0,229,160,0.12)',   note: 'Compare top institutions with clearer admissions guidance.',     path: '/services#universities' },
  { title: 'Colleges',           subtitle: 'CITY NETWORK',   icon: School,        code: 'CL',  accent: '#FFB300', accentSoft: 'rgba(255,179,0,0.12)',    note: 'Find trusted colleges across Bengaluru with practical support.', path: '/services#colleges'     },
  { title: 'Courses',            subtitle: 'FUTURE TRACKS',  icon: BookOpen,      code: 'CR',  accent: '#00CFFF', accentSoft: 'rgba(0,207,255,0.12)',    note: 'Match your goals with programs that fit your next move.',        path: '/services#courses'      },
  { title: 'Online Courses',     subtitle: 'REMOTE READY',   icon: Globe,         code: 'OC',  accent: '#4DB6AC', accentSoft: 'rgba(77,182,172,0.12)',   note: 'Add flexible learning paths alongside your academic plan.',      path: null                     },
  { title: 'Short-term',         subtitle: 'FAST SKILLS',    icon: Clock,         code: 'SP',  accent: '#FFB300', accentSoft: 'rgba(255,179,0,0.12)',    note: 'Build employable skills through focused, practical programs.',   path: null                     },
  { title: 'Part-time Jobs',     subtitle: 'WORK ACCESS',    icon: Briefcase,     code: 'PJ',  accent: '#00E5A0', accentSoft: 'rgba(0,229,160,0.12)',   note: 'Discover student-friendly work options around your schedule.',   path: null                     },
  { title: 'Accommodation',      subtitle: 'NEAR ME',        icon: Library,       code: 'AC',  accent: '#FFCA28', accentSoft: 'rgba(255,202,40,0.12)',   note: 'Explore convenient stays close to your campus and city life.',   path: null                     },
  { title: 'Events',             subtitle: 'CAMPUS LIFE',    icon: Calendar,      code: 'EV',  accent: '#4FC3F7', accentSoft: 'rgba(79,195,247,0.12)',   note: 'Stay close to student events, meetups, and opportunity days.',  path: null                     },
  { title: '1-on-1 Counselling', subtitle: 'FREE SESSION',   icon: MessageCircle, code: '1:1', accent: '#00E5A0', accentSoft: 'rgba(0,229,160,0.12)',   note: 'Talk through choices with personal guidance before you apply.',  path: null                     },
  { title: 'Internships',        subtitle: 'CAREER SIGNAL',  icon: UserCheck,     code: 'IN',  accent: '#FFB300', accentSoft: 'rgba(255,179,0,0.12)',   note: 'Connect academic decisions with early career experience.',       path: null                     },
]

/* ─── Noise grain ────────────────────────────────────────────────────────── */
const NoiseBg = () => (
  <svg className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-[0.035]" aria-hidden>
    <filter id="opp-noise">
      <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="4" stitchTiles="stitch" />
      <feColorMatrix type="saturate" values="0" />
    </filter>
    <rect width="100%" height="100%" filter="url(#opp-noise)" />
  </svg>
)

/* ─── Grid — white lines on dark teal-black ──────────────────────────────── */
const GridPattern = () => (
  <div
    aria-hidden
    className="pointer-events-none absolute inset-0 z-0 opacity-[0.07]"
    style={{
      backgroundImage: `
        linear-gradient(rgba(0,229,160,0.15) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0,229,160,0.15) 1px, transparent 1px)
      `,
      backgroundSize: '72px 72px',
      maskImage: 'linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)',
      WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)',
    }}
  />
)

/* ─── Ambient orbs — teal + gold + cyan on dark teal-black ──────────────── */
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
        'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,229,160,0.008) 3px,rgba(0,229,160,0.008) 4px)',
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
        /* ── Ambient orbs — teal + gold + cyan on dark teal-black ── */
        .opp-orb-a { background: radial-gradient(circle, rgba(0,229,160,0.16) 0%, transparent 70%); filter: blur(80px); }
        .opp-orb-b { background: radial-gradient(circle, rgba(255,179,0,0.12) 0%, transparent 70%);  filter: blur(90px); }
        .opp-orb-c { background: radial-gradient(circle, rgba(0,207,255,0.10) 0%, transparent 70%);  filter: blur(100px); }

        /* ── Chip — teal accent ── */
        .opp-chip {
          background: rgba(0,229,160,0.10);
          border: 1px solid rgba(0,229,160,0.30);
          border-radius: 100px;
          font-size: 10px;
          letter-spacing: 0.18em;
          font-weight: 700;
          text-transform: uppercase;
          color: rgba(0,229,160,0.75);
          padding: 5px 16px;
          display: inline-block;
        }

        /* ── Footer divider — teal ── */
        .opp-foot-line {
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(0,229,160,0.35) 40%,
            rgba(0,229,160,0.35) 60%,
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
          z-index: 10;
          isolation: isolate;
        }

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

        /* ── Edge fades — match dark teal-black bg ── */
        .opp-edge-left {
          background: linear-gradient(to right, #030e10, transparent) !important;
          z-index: 20 !important;
          pointer-events: none !important;
        }
        .opp-edge-right {
          background: linear-gradient(to left, #030e10, transparent) !important;
          z-index: 20 !important;
          pointer-events: none !important;
        }

        @media (max-width: 767px) {
          .opp-edge-left,
          .opp-edge-right {
            display: none !important;
          }
        }

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

        /* ── Head and foot stay above canvas ── */
        .opp-head { position: relative; z-index: 30; }
        .opp-foot { position: relative; z-index: 30; }
      `}</style>

      <div
        ref={containerRef}
        className="relative flex h-[100svh] w-full flex-col items-center overflow-hidden"
        style={{
          /* Section 4 — dark teal-black, distinct from navy sections */
          background: 'linear-gradient(180deg, #030e10 0%, #051a18 50%, #030e10 100%)',
        }}
      >
        <NoiseBg />
        <GridPattern />
        <ScanLines />
        <AmbientOrbs />

        {/* Top edge line — teal tint */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px"
          style={{
            background:
              'linear-gradient(90deg, transparent, rgba(0,229,160,0.28) 30%, rgba(0,229,160,0.28) 70%, transparent)',
          }}
        />

        {/* ── Head ── */}
        <div className="opp-head relative z-30 flex w-full flex-shrink-0 flex-col items-center gap-3 px-4 pt-10 pb-2 sm:pt-14 sm:gap-4">

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
              /* scramble from muted teal to white */
              colorFrom="rgba(0,229,160,0.35)"
              colorTo="#ffffff"
              textAlign="center"
              className="mx-auto whitespace-nowrap text-[clamp(1.6rem,4.2vw,3.6rem)] font-black leading-[1.0] tracking-[-0.025em] text-white"
            />
          </div>

          <p
            className="opp-heading mx-auto max-w-[min(88vw,440px)] text-center text-[clamp(0.75rem,1.6vw,0.92rem)] font-light leading-relaxed"
            /* muted teal-white */
            style={{ color: 'rgba(160,240,210,0.50)' }}
          >
            Tap any card to enter — each one is a gateway to your next step.
          </p>
        </div>

        {/* ── Gallery ── */}
        <div className="opp-gallery opp-gallery-wrap flex-1" style={{ zIndex: 10, isolation: 'isolate' }}>
          <CircularGallery
            ref={galleryRef}
            items={galleryItems}
            bend={2.6}
            borderRadius={0}
            scrollSpeed={2.2}
            scrollEase={0.045}
            onSelect={handleSelect}
          />
          <div className="opp-edge-left pointer-events-none absolute inset-y-0 left-0 w-[10vw]" style={{ zIndex: 20 }} />
          <div className="opp-edge-right pointer-events-none absolute inset-y-0 right-0 w-[10vw]" style={{ zIndex: 20 }} />
        </div>

        {/* ── Footer ── */}
        <div className="opp-foot relative z-30 flex flex-shrink-0 flex-col items-center gap-2 py-4">
          <div className="opp-foot-line w-16" />
          <span
            className="mt-1 text-[9px] font-bold uppercase tracking-[0.34em]"
            style={{ color: 'rgba(0,229,160,0.32)' }}
          >
            Opportunities 2026
          </span>
        </div>

        {/* Bottom edge line — gold tint for contrast with teal top */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-px"
          style={{
            background:
              'linear-gradient(90deg, transparent, rgba(255,179,0,0.20) 30%, rgba(255,179,0,0.20) 70%, transparent)',
          }}
        />
      </div>
    </>
  )
}

export default Opportunities