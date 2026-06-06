import { useEffect, useRef, useState } from 'react'

const stats = [
  { value: 100,  suffix: '+',  label: 'Partner Colleges'   },
  { value: 1000, suffix: '+',  label: 'Students Enrolled'  },
  { value: 95,   suffix: '%',  label: 'Admission Success'  },
  { value: 50,   suffix: '+',  label: 'Franchises'         },
  { value: 24,   suffix: '/7', label: 'Student Support'    },
]

/* ── Animated counter hook ──────────────────────────────────────────────── */
function useCountUp(target, suffix, active, duration = 1500) {
  const [display, setDisplay] = useState(`0${suffix}`)
  const raf = useRef(null)

  useEffect(() => {
    if (raf.current) cancelAnimationFrame(raf.current)
    if (!active) { setDisplay(`0${suffix}`); return }

    let start = null
    const step = (ts) => {
      if (!start) start = ts
      const p    = Math.min((ts - start) / duration, 1)
      const ease = 1 - Math.pow(1 - p, 3)
      setDisplay(`${Math.round(ease * target)}${suffix}`)
      if (p < 1) raf.current = requestAnimationFrame(step)
    }
    raf.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf.current)
  }, [active, target, suffix, duration])

  return display
}

/* ── Single stat item ───────────────────────────────────────────────────── */
function StatItem({ value, suffix, label, active, delay }) {
  const display = useCountUp(value, suffix, active, 1500)

  return (
    <div
      className="flex min-w-[8rem] flex-col items-center text-center transition-all duration-500 sm:min-w-[11rem] lg:min-w-[15rem]"
      style={{
        opacity:    active ? 1 : 0,
        transform:  active ? 'translateY(0)' : 'translateY(10px)',
        transitionDelay: active ? `${delay}ms` : '0ms',
      }}
    >
      <span className="text-[clamp(2rem,5vw,5rem)] font-bold leading-none tracking-[-0.045em] text-white">
        {display}
      </span>
      <span className="mt-2 text-[clamp(0.65rem,1.1vw,1rem)] font-semibold uppercase tracking-[0.12em] text-white/50 sm:mt-3">
        {label}
      </span>
    </div>
  )
}

/* ── Main component ─────────────────────────────────────────────────────── */
function ImpactNumbersSection() {
  const sectionRef  = useRef(null)
  const [open, setOpen] = useState(false)
  const timerRef    = useRef(null)

  /* Trigger on scroll-into-view (IntersectionObserver) */
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          /* Small delay so the curtain animation is visible */
          timerRef.current = setTimeout(() => setOpen(true), 120)
        } else {
          clearTimeout(timerRef.current)
          setOpen(false)
        }
      },
      { threshold: 0.45 }
    )
    observer.observe(el)
    return () => { observer.disconnect(); clearTimeout(timerRef.current) }
  }, [])

  /* Also open on hover (matches the MWS reference) */
  const handleMouseEnter = () => setOpen(true)
  const handleMouseLeave = () => {
    /* Only close on mouse-leave if the section is not in viewport-centre */
    /* (keep open while scrolled to it) */
  }

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden border-y border-white/8 bg-black text-white"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* ── Glossy Black Background Overlays ── */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-white/[0.08] via-transparent to-white/[0.03]" />
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.12),transparent_50%)]" />
      
      <div className="pointer-events-none absolute inset-x-0 top-0    z-10 h-px bg-gradient-to-r from-transparent via-white/18 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-px bg-gradient-to-r from-transparent via-white/18 to-transparent" />

      {/* ── Stats layer (always rendered, lives underneath curtains) ── */}
      <div className="relative z-10 mx-auto flex w-full flex-wrap items-center justify-center gap-x-6 gap-y-10 px-4 py-14 sm:gap-14 sm:px-10 sm:py-16 lg:gap-20 lg:py-20">
        {stats.map((stat, i) => (
          <StatItem
            key={stat.label}
            value={stat.value}
            suffix={stat.suffix}
            label={stat.label}
            active={open}
            delay={i * 80}
          />
        ))}
      </div>

      {/* ── TOP curtain (white, slides up) ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-end overflow-hidden bg-white px-[clamp(24px,5vw,80px)] pb-4"
        style={{
          height:    '50%',
          transform: open ? 'translateY(-100%)' : 'translateY(0)',
          transition: 'transform 0.72s cubic-bezier(0.76, 0, 0.24, 1)',
          borderBottom: open ? 'none' : '1px solid #e8e8e8',
        }}
      >
        <span
          className="whitespace-nowrap text-[clamp(1rem,3.2vw,2rem)] font-black uppercase leading-none tracking-[-0.02em] text-black"
          style={{
            opacity:    open ? 0 : 1,
            transition: 'opacity 0.2s',
          }}
        >
          Our Impact in Numbers
        </span>
      </div>

      {/* ── BOTTOM curtain (white, slides down) ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex items-start overflow-hidden bg-white px-[clamp(24px,5vw,80px)] pt-4"
        style={{
          height:    '50%',
          transform: open ? 'translateY(100%)' : 'translateY(0)',
          transition: 'transform 0.72s cubic-bezier(0.76, 0, 0.24, 1)',
          borderTop: open ? 'none' : '1px solid #e8e8e8',
        }}
      >
        <span
          className="whitespace-nowrap text-[clamp(1rem,3.2vw,2rem)] font-black uppercase leading-none tracking-[-0.02em] text-neutral-400"
          style={{
            opacity:    open ? 0 : 1,
            transition: 'opacity 0.2s',
          }}
        >
          Study in Bengaluru
        </span>
      </div>

      {/* ── Center seam hint (only when closed) ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-1/2 z-30 flex -translate-y-1/2 items-center justify-center gap-3"
        style={{
          opacity:    open ? 0 : 1,
          transition: 'opacity 0.25s',
        }}
      >
        <div className="h-px w-8 bg-neutral-300" />
        <span className="text-[9px] font-bold uppercase tracking-[0.22em] text-neutral-400">
          Scroll to reveal
        </span>
        <div className="h-px w-8 bg-neutral-300" />
      </div>

      <style>{`
        @media (max-width: 480px) {
          .impact-stat-hide { display: none; }
        }
      `}</style>
    </section>
  )
}

export default ImpactNumbersSection