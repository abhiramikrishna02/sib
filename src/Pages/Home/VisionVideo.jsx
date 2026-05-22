import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { Sparkles } from 'lucide-react'
import VariableProximity from '../VariableProximity'
import graduateVideo from '../../assets/graduate.mp4'

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

function VisionVideoSection() {
  const outerRef = useRef(null)
  const videoFrameRef = useRef(null)
  const videoRef = useRef(null)
  const textContentRef = useRef(null)
  const headerRef = useRef(null)
  const overlayRef = useRef(null)
  const quoteContainerRef = useRef(null)
  const visionLines = [
    <>
      <span className="bg-gradient-to-r from-white via-violet-100 to-cyan-100 bg-clip-text font-black text-transparent">StudyInBengaluru.com</span> opens Bengaluru&apos;s education network.
    </>,
    <>
      We connect ambitious students with <span className="font-semibold text-violet-200">trusted institutions</span>,
    </>,
    <>
      future-ready courses, and meaningful opportunities.
    </>,
    <>
      Together, we&apos;re shaping a leading education destination
    </>,
    <>
      built on credibility, partnerships, and student confidence across India and beyond.
    </>,
  ]

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: outerRef.current, start: 'top top', end: () => `+=${window.innerWidth < 768 ? window.innerHeight * 1.45 : window.innerHeight * 3}`, scrub: 1, pin: true, anticipatePin: 1, invalidateOnRefresh: true } })
      tl.to(headerRef.current, { opacity: 0, scale: 0.8, filter: 'blur(20px)', y: -100, duration: 1 }, 0)
        .to(videoFrameRef.current, { scale: 1, width: '100vw', height: '100vh', maxWidth: '100%', maxHeight: '100%', borderRadius: '0px', ease: 'power2.inOut', duration: 2 }, 0.2)
        .to(videoRef.current, { scale: 1.4, duration: 3, ease: 'none' }, 0.2)
        .to(overlayRef.current, { backgroundColor: 'rgba(0,0,0,0.64)', duration: 1 }, 1)
        .fromTo(textContentRef.current, { y: 80, opacity: 0, scale: 0.94, filter: 'blur(16px)' }, { y: 0, opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.8, ease: 'expo.out' }, 1.35)
        .fromTo('.vision-kicker', { y: 18, opacity: 0, filter: 'blur(10px)' }, { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.6, ease: 'power3.out' }, 1.55)
        .fromTo('.vision-copy-line', { yPercent: 120, opacity: 0, filter: 'blur(14px)' }, { yPercent: 0, opacity: 1, filter: 'blur(0px)', duration: 0.85, stagger: 0.18, ease: 'expo.out' }, 1.75)
        .fromTo('.vision-quote-card', { y: 42, opacity: 0, scale: 0.95, filter: 'blur(14px)' }, { y: 0, opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.75, ease: 'expo.out' }, 2.65)
        .fromTo('.vision-quote-line', { yPercent: 110, opacity: 0, filter: 'blur(10px)' }, { yPercent: 0, opacity: 1, filter: 'blur(0px)', duration: 0.65, stagger: 0.16, ease: 'power3.out' }, 2.85)
    }, outerRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={outerRef} className="relative h-[100svh] min-h-[100svh] w-full overflow-hidden border-y border-white/10 bg-[#0f0816]" style={opportunitySectionBackground}>
      <div className="pointer-events-none absolute inset-0 z-0">
        <HomeGridOverlay opacity="opacity-[0.16]" />
        <div className="absolute left-1/2 top-1/2 z-0 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/10 blur-[90px] sm:h-[520px] sm:w-[520px] lg:h-[620px] lg:w-[620px] lg:blur-[120px]" />
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/85 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/85 to-transparent" />
      </div>
      <div ref={headerRef} className="absolute inset-0 z-20 flex flex-col items-center justify-center px-4 text-center">
        <div className="mb-4 flex items-center gap-2 text-violet-500">
          <Sparkles size={16} className="animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.45em] sm:tracking-[0.8em]">The Vision</span>
        </div>
      </div>
      <div className="flex h-full w-full items-center justify-center px-3 sm:px-4">
        <div ref={videoFrameRef} className="relative h-[50vh] w-[92vw] max-w-[420px] overflow-hidden rounded-[2rem] border border-white/10 shadow-[0_0_100px_rgba(168,85,247,0.2)] sm:w-[85vw] md:h-[300px] md:w-[500px] md:max-w-none">
          <video ref={videoRef} src={graduateVideo} autoPlay muted loop playsInline className="h-full w-full object-cover" />
          <div ref={overlayRef} className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/90" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.25)_0%,transparent_65%)] mix-blend-screen" />

          <div ref={textContentRef} className="absolute inset-0 z-30 flex items-center justify-center p-4 pt-16 sm:p-6 sm:pt-24 md:p-12 md:pt-32">
            <div className="w-full max-w-5xl px-2 text-center text-white">
              <p className="vision-kicker mx-auto mb-4 inline-flex rounded-full border border-white/18 bg-white/10 px-4 py-2 text-[9px] font-black uppercase tracking-[0.34em] text-white/75 backdrop-blur-md shadow-[0_0_34px_rgba(168,85,247,0.2)] sm:mb-6 sm:px-5 sm:text-[10px] sm:tracking-[0.5em]">Our Vision</p>

              <div className="mx-auto max-w-4xl text-[clamp(0.98rem,4.3vw,2.28rem)] font-normal leading-[1.34] tracking-normal text-white drop-shadow-[0_5px_20px_rgba(0,0,0,0.72)] sm:leading-[1.34]" style={{ textShadow: '0 4px 18px rgba(0,0,0,0.82), 0 0 28px rgba(213, 161, 255, 0.22)' }}>
                {visionLines.map((line, index) => (
                  <div key={index} className="overflow-hidden pb-1.5">
                    <p className="vision-copy-line opacity-0 will-change-transform">{line}</p>
                  </div>
                ))}
              </div>

              <div
                ref={quoteContainerRef}
                className="vision-quote-card relative mx-auto mt-4 max-w-3xl cursor-crosshair overflow-hidden rounded-[1.1rem] border border-fuchsia-300/30 bg-black/28 px-4 py-3 opacity-0 backdrop-blur-md shadow-[0_0_44px_rgba(214,90,138,0.2)] sm:mt-8 sm:rounded-[1.35rem] sm:px-7 sm:py-5"
              >
                <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-fuchsia-200/70 to-transparent" />
                <div className="pointer-events-none absolute -inset-x-10 -bottom-16 h-28 bg-fuchsia-500/16 blur-3xl" />
                <div className="relative text-[clamp(0.82rem,3.4vw,1.28rem)] font-normal leading-relaxed text-[#ffe0ee]" style={{ textShadow: '0 2px 12px rgba(0,0,0,0.82), 0 0 20px rgba(214, 90, 138, 0.3)' }}>
                  <div className="overflow-hidden">
                    <p className="vision-quote-line opacity-0 will-change-transform">
                      &quot;<VariableProximity
                        label="Education opens the door."
                        fromFontVariationSettings="'wght' 390, 'opsz' 9"
                        toFontVariationSettings="'wght' 760, 'opsz' 36"
                        containerRef={quoteContainerRef}
                        radius={120}
                        falloff="gaussian"
                      />
                    </p>
                  </div>
                  <div className="overflow-hidden">
                    <p className="vision-quote-line opacity-0 will-change-transform">
                      <VariableProximity
                        label="StudyInBengaluru helps you walk through it with confidence."
                        fromFontVariationSettings="'wght' 390, 'opsz' 9"
                        toFontVariationSettings="'wght' 760, 'opsz' 36"
                        containerRef={quoteContainerRef}
                        radius={120}
                        falloff="gaussian"
                      />&quot;
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
      <div className="absolute -bottom-20 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-violet-600/10 blur-[120px]" />
    </section>
  )
}

export default VisionVideoSection
