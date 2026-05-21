import { Children, useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

function cx(...parts) {
  return parts.filter(Boolean).join(' ')
}

export function FlowSection({
  className,
  style = {},
  children,
  'aria-label': ariaLabel,
}) {
  return (
    <section
      data-flow-section
      aria-label={ariaLabel}
      className={cx('relative w-full overflow-hidden md:min-h-[100svh]', className)}
    >
      <div
        data-flow-inner
        className={cx(
          'flow-art-container relative flex w-full flex-col justify-start gap-8 px-5 py-10 sm:px-8 sm:py-12 md:min-h-[100svh] lg:justify-between lg:gap-6 lg:px-[4vw] lg:pt-[clamp(2rem,8vw,4vw)] lg:pb-[4vw]',
          'will-change-transform',
        )}
        style={{ transformOrigin: 'bottom left', ...style }}
      >
        {children}
      </div>
    </section>
  )
}

export default function FlowArt({
  children,
  className,
  'aria-label': ariaLabel = 'Story scroll',
}) {
  const containerRef = useRef(null)
  const [reducedMotion, setReducedMotion] = useState(false)
  const sectionCount = Children.count(children)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReducedMotion(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (!containerRef.current || reducedMotion || window.innerWidth < 768) return undefined

    const sections = Array.from(containerRef.current.querySelectorAll('[data-flow-section]'))
    if (sections.length === 0) return undefined

    const triggers = []

    sections.forEach((section, index) => {
      gsap.set(section, { zIndex: index + 1 })

      const inner = section.querySelector('.flow-art-container')
      if (!inner) return

      if (index > 0) {
        gsap.set(inner, { rotation: 30, transformOrigin: 'bottom left' })
        const tween = gsap.to(inner, {
          rotation: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'top 25%',
            scrub: true,
          },
        })
        if (tween.scrollTrigger) triggers.push(tween.scrollTrigger)
      }

      if (index < sections.length - 1) {
        triggers.push(
          ScrollTrigger.create({
            trigger: section,
            start: 'bottom bottom',
            end: 'bottom top',
            pin: true,
            pinSpacing: false,
          }),
        )
      }
    })

    ScrollTrigger.refresh()

    return () => {
      triggers.forEach(trigger => trigger.kill())
    }
  }, [sectionCount, reducedMotion])

  return (
    <main
      ref={containerRef}
      aria-label={ariaLabel}
      className={cx('w-full overflow-x-hidden', className)}
    >
      {children}
    </main>
  )
}
