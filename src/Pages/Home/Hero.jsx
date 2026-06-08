import { useEffect, useRef, useState, useCallback } from 'react'
import { AnimatedText } from '../../../components/ui/animated-text'
import InfiniteGallery from '../../../components/ui/3d-gallery-photography'
import hero1 from '../../assets/hero1.jpg'
import hero2 from '../../assets/hero2.jpg'
import hero3 from '../../assets/hero3.jpg'
import img1 from '../../assets/img1.jpg'
import img2 from '../../assets/img2.jpg'
import img3 from '../../assets/img3.jpg'
import img4 from '../../assets/img4.jpg'
import img5 from '../../assets/img5.jpg'
import img6 from '../../assets/img6.jpg'
import gsap from 'gsap'

const galleryImages = [
  { src: hero1, alt: 'Students exploring campus life in Bengaluru' },
  { src: hero2, alt: 'Study abroad counseling session' },
  { src: hero3, alt: 'Bengaluru education opportunity' },
  { src: img1,  alt: 'Student success story' },
  { src: img2,  alt: 'University guidance' },
  { src: img3,  alt: 'Academic planning support' },
  { src: img4,  alt: 'Career-focused learning' },
  { src: img5,  alt: 'Student community' },
  { src: img6,  alt: 'Higher education pathway' },
]

const SLOTS = [
  { x: -56, y: 30,  rotate: -40, scale: 0.70, opacity: 0.85 },
  { x: -42, y: 14,  rotate: -28, scale: 0.78, opacity: 0.90 },
  { x: -28, y:  4,  rotate: -18, scale: 0.86, opacity: 0.94 },
  { x: -13, y: -3,  rotate:  -9, scale: 0.92, opacity: 0.97 },
  {  x:  1, y: -8,  rotate:   1, scale: 0.97, opacity: 1.00 },
  {  x: 15, y: -2,  rotate:  10, scale: 0.92, opacity: 0.97 },
  {  x: 30, y:  6,  rotate:  20, scale: 0.86, opacity: 0.94 },
  {  x: 44, y: 16,  rotate:  30, scale: 0.78, opacity: 0.90 },
  {  x: 58, y: 32,  rotate:  42, scale: 0.70, opacity: 0.85 },
]

const N = galleryImages.length

// Fixed increment per RAF frame — no timestamps, no delta, always constant.
// At 60fps ≈ 0.4 units/sec. Tweak this one value to change speed.
const STEP = 0.4 / 60

function getSlotProps(pos) {
  const lo = Math.floor(pos), hi = lo + 1, t = pos - lo
  if (lo < 0 || hi > N - 1) return { ...( lo < 0 ? SLOTS[0] : SLOTS[N-1] ), opacity: 0 }
  const a = SLOTS[lo], b = SLOTS[hi]
  return {
    x:       a.x       + (b.x       - a.x)       * t,
    y:       a.y       + (b.y       - a.y)       * t,
    rotate:  a.rotate  + (b.rotate  - a.rotate)  * t,
    scale:   a.scale   + (b.scale   - a.scale)   * t,
    opacity: a.opacity + (b.opacity - a.opacity) * t,
  }
}

export default function HeroSection() {
  const sectionRef = useRef(null)
  const cardRefs   = useRef([])
  const knobRef    = useRef(null)
  const tlRef      = useRef(null)
  const rafRef     = useRef(null)
  const offsetRef  = useRef(0)
  const animRef    = useRef(false)
  const expandRef  = useRef(false)

  const [showGallery, setShowGallery] = useState(true)
  const [isExpanded,  setIsExpanded]  = useState(false)

  // ── Apply slot positions ───────────────────────────────────────────────────
  const applySlots = useCallback(() => {
    cardRefs.current.forEach((card, i) => {
      if (!card || card.style.display === 'none') return
      const raw = ((i - offsetRef.current) % N + N) % N
      let props, z
      if (raw >= N - 1) {
        const t = (raw - (N - 1)) / 1
        props = { ...SLOTS[N - 1], opacity: SLOTS[N - 1].opacity * (1 - t) }
        z = 1
      } else if (raw < 0.35) {
        props = { ...SLOTS[0], opacity: SLOTS[0].opacity * (raw / 0.35) }
        z = 1
      } else {
        props = getSlotProps(raw)
        z = Math.max(1, Math.round(10 - Math.abs(raw - 4) * 1.2))
      }
      card.style.zIndex    = z
      card.style.opacity   = props.opacity
      card.style.transform = `translateX(${props.x}cqw) translateY(${props.y}cqh) rotate(${props.rotate}deg) scale(${props.scale})`
    })
  }, [])

  // ── Loop: fixed STEP per frame, zero timestamp logic ──────────────────────
  const startLoop = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    const tick = () => {
      if (!expandRef.current) return
      offsetRef.current = (offsetRef.current + STEP) % N
      applySlots()
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
  }, [applySlots])

  const stopLoop = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }, [])

  // ── Pause when tab hidden, resume cleanly when visible ────────────────────
  useEffect(() => {
    const onVisibility = () => {
      if (!expandRef.current) return
      if (document.visibilityState === 'hidden') {
        stopLoop()
      } else {
        startLoop()
      }
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [startLoop, stopLoop])

  // ── Hover tilt ─────────────────────────────────────────────────────────────
  const onMouseMove = useCallback((e, i) => {
    if (!expandRef.current) return
    const card = cardRefs.current[i]; if (!card) return
    const r = card.getBoundingClientRect()
    gsap.to(card, {
      rotateX: -((e.clientY - (r.top  + r.height / 2)) / (r.height / 2)) * 7,
      rotateY:  ((e.clientX - (r.left + r.width  / 2)) / (r.width  / 2)) * 7,
      boxShadow: '0 32px 80px rgba(0,0,0,0.7),0 0 40px rgba(255,255,255,0.14)',
      duration: 0.28, ease: 'power2.out', overwrite: 'auto',
    })
  }, [])

  const onMouseLeave = useCallback((i) => {
    if (!expandRef.current) return
    gsap.to(cardRefs.current[i], {
      rotateX: 0, rotateY: 0,
      boxShadow: '0 12px 48px rgba(0,0,0,0.55)',
      duration: 0.5, ease: 'power3.out', overwrite: 'auto',
    })
  }, [])

  // ── Toggle expand / collapse ───────────────────────────────────────────────
  const handleToggle = useCallback(() => {
    if (animRef.current) return
    animRef.current = true
    if (tlRef.current) tlRef.current.kill()
    const tl = gsap.timeline({ onComplete: () => { animRef.current = false } })
    tlRef.current = tl

    if (!expandRef.current) {
      expandRef.current = true
      offsetRef.current = 0
      setShowGallery(false)
      setIsExpanded(true)
      tl.to(knobRef.current, { x: 40, duration: 0.45, ease: 'power3.inOut' }, 0)
      cardRefs.current.forEach(card => {
        if (!card) return
        gsap.set(card, {
          display: 'block', opacity: 0, scale: 0.05, x: 0, y: 0, rotate: 0,
          rotateX: 0, rotateY: 0, transformOrigin: '50% 100%',
        })
        card.style.transform = 'translateX(0vw) translateY(0vh) rotate(0deg) scale(0.05)'
      })
      ;[4, 3, 5, 2, 6, 1, 7, 0, 8].forEach((ci, step) => {
        const card = cardRefs.current[ci]; if (!card) return
        const slot = SLOTS[ci], delay = 0.08 + step * 0.055
        tl.to(card, { opacity: slot.opacity, scale: slot.scale, duration: 0.85, ease: 'expo.out' }, delay)
        tl.to({ p: 0 }, {
          p: 1, duration: 0.85, ease: 'expo.out',
          onUpdate() {
            const p = this.targets()[0].p
            card.style.transform = `translateX(${slot.x * p}cqw) translateY(${slot.y * p}cqh) rotate(${slot.rotate * p}deg) scale(${0.05 + (slot.scale - 0.05) * p})`
          },
        }, delay)
      })
      tl.call(() => startLoop(), [], 0.08 + 8 * 0.055 + 0.95)
    } else {
      expandRef.current = false
      stopLoop()
      cardRefs.current.forEach((card, i) => {
        if (!card) return
        const raw = ((i - offsetRef.current) % N + N) % N
        const lo  = Math.min(Math.floor(raw), N - 2), t2 = raw - lo
        const a = SLOTS[lo], b = SLOTS[lo + 1]
        const cx = a.x      + (b.x      - a.x)      * t2
        const cy = a.y      + (b.y      - a.y)      * t2
        const cr = a.rotate + (b.rotate - a.rotate)  * t2
        const cs = a.scale  + (b.scale  - a.scale)   * t2
        tl.to(card, { opacity: 0, scale: 0.05, duration: 0.48, ease: 'power4.inOut' }, i * 0.025)
        tl.to({ p: 1 }, {
          p: 0, duration: 0.48, ease: 'power4.inOut',
          onUpdate() {
            const p = this.targets()[0].p
            card.style.transform = `translateX(${cx * p}cqw) translateY(${cy * p}cqh) rotate(${cr * p}deg) scale(${0.05 + (cs - 0.05) * p})`
          },
        }, i * 0.025)
      })
      tl.to(knobRef.current, { x: 0, duration: 0.45, ease: 'power3.inOut' }, 0)
      tl.call(() => {
        cardRefs.current.forEach(c => { if (c) { gsap.set(c, { display: 'none' }); c.style.transform = '' } })
        setShowGallery(true)
        setIsExpanded(false)
      })
    }
  }, [startLoop, stopLoop])

  useEffect(() => () => stopLoop(), [stopLoop])

  const cardStyle = {
    display: 'none', position: 'absolute', top: '50%', left: '50%',
    width: 'clamp(190px,24vw,360px)', aspectRatio: '3/4',
    marginTop: 'calc(clamp(190px,24vw,360px)*-2/3)',
    marginLeft: 'calc(clamp(190px,24vw,360px)/-2)',
    borderRadius: '14px', overflow: 'hidden',
    boxShadow: '0 12px 48px rgba(0,0,0,0.55)',
    border: '1px solid rgba(255,255,255,0.13)',
    willChange: 'transform,opacity', pointerEvents: 'auto', transition: 'box-shadow 0.3s',
  }

  return (
    <section
      ref={sectionRef}
      className="home-hero-section"
      style={{ position: 'relative', display: 'flex', minHeight: '100svh', width: '100%', overflow: 'hidden', background: '#000', color: '#fff', contain: 'paint', containerType: 'size' }}
    >

      {/* Dark base */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 10, background: 'rgba(0,0,0,0.55)' }} />

      {/* Gallery */}
      {showGallery && (
        <InfiniteGallery images={galleryImages} speed={0.9} visibleCount={8} scrollSourceRef={sectionRef}
          fadeSettings={{ fadeIn: { start: 0.05, end: 0.25 }, fadeOut: { start: 0.42, end: 0.48 } }}
          blurSettings={{ blurIn: { start: 0, end: 0.12 }, blurOut: { start: 0.42, end: 0.48 }, maxBlur: 0 }}
          className="absolute inset-0 h-full w-full opacity-75" style={{ zIndex: 20 }} />
      )}

      {/* Vignette */}
      {showGallery && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 30, background: 'radial-gradient(circle at center,rgba(0,0,0,0.05),rgba(0,0,0,0.58) 72%)' }} />
      )}

      {/* Fan cards */}
      <div style={{ pointerEvents: 'none', position: 'absolute', inset: 0, zIndex: 38, perspective: '1100px', perspectiveOrigin: '50% 62%', transformStyle: 'preserve-3d' }}>
        {galleryImages.map((img, i) => (
          <div key={i} ref={el => cardRefs.current[i] = el} style={cardStyle}
            onMouseMove={e => onMouseMove(e, i)} onMouseLeave={() => onMouseLeave(i)}>
            <img src={img.src} alt={img.alt}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', userSelect: 'none', pointerEvents: 'none' }}
              draggable={false} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(155deg,rgba(255,255,255,0.10) 0%,transparent 52%)', pointerEvents: 'none' }} />
          </div>
        ))}
      </div>

      {/* Hero content */}
      <div style={{ position: 'relative', zIndex: 40, display: 'flex', minHeight: '100svh', width: '100%', alignItems: 'center', justifyContent: 'center', padding: '8rem 1rem 4rem', textAlign: 'center' }}>
        <div style={{ width: '100%', maxWidth: 'min(92vw,78rem)' }}>
          <AnimatedText text="Study in Bengaluru" fontSize="clamp(2.15rem,12vw,9rem)"
            minWeight={520} maxWeight={900} animationDuration={3.8} delayMultiplier={0.13}
            className="mx-auto max-w-full whitespace-normal break-words font-black uppercase leading-[0.92] tracking-normal text-white drop-shadow-[0_0_34px_rgba(255,255,255,0.22)] sm:leading-[0.9] lg:tracking-tighter" />
          <div style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'center' }}>
            <button onClick={handleToggle} aria-label={isExpanded ? 'Collapse gallery' : 'Explore gallery'}
              style={{
                position: 'relative', display: 'inline-flex', alignItems: 'center',
                width: '92px', height: '52px', borderRadius: '9999px',
                border: `1.5px solid ${isExpanded ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.45)'}`,
                background: isExpanded ? 'rgba(255,255,255,0.15)' : 'rgba(10,10,10,0.65)',
                backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
                boxShadow: isExpanded ? '0 0 36px rgba(255,255,255,0.28),inset 0 0 14px rgba(255,255,255,0.08)' : '0 0 18px rgba(255,255,255,0.06)',
                cursor: 'pointer', padding: '6px', outline: 'none',
                transition: 'background 0.45s,box-shadow 0.45s,border-color 0.45s',
              }}>
              <span ref={knobRef}
                style={{
                  display: 'block', width: '38px', height: '38px', borderRadius: '9999px',
                  background: isExpanded ? '#fff' : 'rgba(255,255,255,0.82)',
                  boxShadow: isExpanded ? '0 0 22px rgba(255,255,255,0.75),0 2px 8px rgba(0,0,0,0.2)' : '0 2px 10px rgba(0,0,0,0.45)',
                  transition: 'background 0.45s,box-shadow 0.45s',
                  willChange: 'transform', flexShrink: 0,
                }} />
            </button>
          </div>
        </div>
      </div>

    </section>
  )
}
