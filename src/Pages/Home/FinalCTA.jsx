import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ArrowUpRight, Sparkles } from 'lucide-react'
import FallingText from '../../Components/FallingText'
import { Liquid } from '../../../components/ui/button-1'

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

const CTA_BUTTON_COLORS = {
  color1: '#FFFFFF',
  color2: '#1E10C5',
  color3: '#9089E2',
  color4: '#FCFCFE',
  color5: '#F9F9FD',
  color6: '#B2B8E7',
  color7: '#0E2DCB',
  color8: '#0017E9',
  color9: '#4743EF',
  color10: '#7D7BF4',
  color11: '#0B06FC',
  color12: '#C5C1EA',
  color13: '#1403DE',
  color14: '#B6BAF6',
  color15: '#C1BEEB',
  color16: '#290ECB',
  color17: '#3F4CC0',
}

function FinalCTASection({ onNavigate }) {
  const sectionRef = useRef(null)
  const contentRef = useRef(null)
  const titleRef = useRef(null)
  const readDelayRef = useRef(null)
  const [fallingTextActive, setFallingTextActive] = useState(false)
  const [buttonHovered, setButtonHovered] = useState(false)

  useEffect(() => {
    const node = sectionRef.current
    if (!node) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          if (readDelayRef.current) {
            window.clearTimeout(readDelayRef.current)
            readDelayRef.current = null
          }
          if (fallingTextActive) {
            setFallingTextActive(false)
          }
          return
        }

        if (fallingTextActive || readDelayRef.current || entry.intersectionRatio < 0.55) return

        readDelayRef.current = window.setTimeout(() => {
          setFallingTextActive(true)
          readDelayRef.current = null
        }, 650)
      },
      { threshold: [0, 0.25, 0.55, 0.75, 1] }
    )

    observer.observe(node)

    return () => {
      observer.disconnect()
      if (readDelayRef.current) {
        window.clearTimeout(readDelayRef.current)
        readDelayRef.current = null
      }
    }
  }, [fallingTextActive])

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.timeline({ scrollTrigger: { trigger: contentRef.current, start: 'top 80%' } })
        .from(titleRef.current, { y: 100, opacity: 0, skewY: 7, duration: 1.2, ease: 'power4.out' })
        .from('.cta-description', { opacity: 0, y: 20, duration: 0.8 }, '-=0.8')
        .from('.interactive-portal', { scale: 0, opacity: 0, rotate: -20, duration: 1, ease: 'back.out(1.7)' }, '-=0.5')
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="relative overflow-hidden border-t border-white/10 bg-[#0f0816] py-8 sm:py-12 lg:py-16" style={opportunitySectionBackground}>
      <div className="pointer-events-none absolute inset-0 z-0">
        <HomeGridOverlay opacity="opacity-[0.16]" />
        <div className="absolute left-1/2 top-1/2 z-0 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/10 blur-[90px] sm:h-[520px] sm:w-[520px] lg:h-[620px] lg:w-[620px] lg:blur-[120px]" />
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/85 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/85 to-transparent" />
      </div>
      <div ref={contentRef} className="relative z-10 mx-auto max-w-5xl px-4 text-center sm:px-6">
        <div className="mb-3 inline-flex max-w-full items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-md sm:mb-5 sm:gap-3 sm:px-6">
          <Sparkles className="h-4 w-4 text-violet-400 animate-pulse" />
          <span className="text-[9px] font-bold uppercase tracking-[0.24em] text-white/70 sm:text-[10px] sm:tracking-[0.4em]">The Final Chapter</span>
        </div>
        <div ref={titleRef} className="mb-2">
          <FallingText
            text="Start Your Educational Journey Today!"
            trigger="manual"
            play={fallingTextActive}
            gravity={0.82}
            mouseConstraintStiffness={0.8}
            fontSize="clamp(1.8rem, 7vw, 4.5rem)"
            lineHeight={0.95}
            wordSpacing="6px"
            className="pointer-events-none mx-auto h-[16rem] -mb-[11rem] sm:h-[24rem] sm:-mb-[16.5rem] md:h-[31rem] md:-mb-[22rem]"
            textClassName="font-black tracking-tighter text-white"
            observerOptions={{ threshold: 0.35 }}
          />
        </div>
        <FallingText
          text="Get personalized guidance from our admission experts."
          trigger="manual"
          play={fallingTextActive}
          gravity={0.7}
          mouseConstraintStiffness={0.78}
          fontSize="clamp(0.875rem, 2.1vw, 1.5rem)"
          lineHeight={1.45}
          wordSpacing="4px"
          className="cta-description pointer-events-none mx-auto h-[12rem] -mb-[9.5rem] max-w-2xl sm:h-[20rem] sm:-mb-[16rem] md:h-[25rem] md:-mb-[19.5rem]"
          textClassName="font-light text-white/70"
          observerOptions={{ threshold: 0.65 }}
        />
        <div className="interactive-portal relative z-20 flex justify-center">
          <div className="relative inline-block">
            <div className="absolute w-[112.81%] h-[128.57%] top-[8.57%] left-1/2 -translate-x-1/2 filter blur-[13px] opacity-70">
              <span className="absolute inset-0 rounded-xl bg-[#d9d9d9] filter blur-[5px]" />
              <div className="relative w-full h-full overflow-hidden rounded-xl">
                <Liquid isHovered={buttonHovered} colors={CTA_BUTTON_COLORS} />
              </div>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[40%] w-[92.23%] h-[112.85%] rounded-xl bg-[#010128] filter blur-[5px]" />
            <div className="relative h-11 w-[9.75rem] overflow-hidden rounded-xl border border-white/20 sm:h-12 sm:w-[10.75rem] lg:h-14 lg:w-[12rem]">
              <span className="absolute inset-0 rounded-xl bg-[#d9d9d9]" />
              <span className="absolute inset-0 rounded-xl bg-black" />
              <Liquid isHovered={buttonHovered} colors={CTA_BUTTON_COLORS} />
              {[1, 2, 3, 4, 5].map((i) => (
                <span
                  key={i}
                  className={`absolute inset-0 rounded-xl mix-blend-overlay border border-white/10 filter ${
                    i <= 2 ? 'blur-[3px]' : i === 3 ? 'blur-[5px]' : 'blur-[4px]'
                  }`}
                />
              ))}
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[40%] w-[70.8%] h-[42.85%] rounded-xl filter blur-[10px] bg-[#006]" />
              <button
                type="button"
                onClick={() => onNavigate?.('/contact')}
                onMouseEnter={() => setButtonHovered(true)}
                onMouseLeave={() => setButtonHovered(false)}
                className="absolute inset-0 rounded-xl bg-transparent"
              >
                <span className="relative flex h-full w-full items-center justify-center gap-2 rounded-xl px-3 text-xs font-semibold uppercase tracking-wide text-white sm:text-sm lg:text-base">
                  <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-4.5 lg:w-4.5" />
                  <span>Connect</span>
                </span>
              </button>
            </div>
          </div>
        </div>
        <div className="mt-5 flex justify-center opacity-20 sm:mt-8">
          <div className="flex flex-col items-center gap-4">
            <div className="h-8 w-px bg-gradient-to-b from-white to-transparent sm:h-10" />
            <FallingText
              text="Scroll Up to Revisit"
              trigger="manual"
              play={fallingTextActive}
              gravity={0.56}
              mouseConstraintStiffness={0.7}
              fontSize="0.625rem"
              lineHeight={1}
              wordSpacing="5px"
              className="min-h-5 w-[min(17rem,86vw)]"
              textClassName="font-bold uppercase tracking-[1em]"
              observerOptions={{ threshold: 1 }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default FinalCTASection
