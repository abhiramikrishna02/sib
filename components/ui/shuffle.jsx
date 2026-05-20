import React, { useEffect, useMemo, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const DEFAULT_SCRAMBLE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

export default function Shuffle({
  text = '',
  className = '',
  style = {},
  shuffleDirection = 'right',
  duration = 0.35,
  maxDelay = 0,
  ease = 'power3.out',
  threshold = 0.1,
  rootMargin = '-100px',
  tag = 'p',
  textAlign = 'center',
  onShuffleComplete,
  animationMode = 'evenodd',
  loop = false,
  loopDelay = 0,
  stagger = 0.03,
  scrambleCharset = '',
  colorFrom,
  colorTo,
  triggerOnce = true,
  respectReducedMotion = true,
  triggerOnHover = true,
}) {
  const ref = useRef(null)
  const timelineRef = useRef(null)
  const hoverHandlerRef = useRef(null)
  const [ready, setReady] = useState(false)
  const Tag = tag || 'p'
  const charset = scrambleCharset || text.replace(/\s/g, '') || DEFAULT_SCRAMBLE

  const scrollTriggerStart = useMemo(() => {
    const startPct = (1 - threshold) * 100
    const match = /^(-?\d+(?:\.\d+)?)(px|em|rem|%)?$/.exec(rootMargin || '')
    const value = match ? parseFloat(match[1]) : 0
    const unit = match ? match[2] || 'px' : 'px'
    const offset = value === 0 ? '' : value < 0 ? `-=${Math.abs(value)}${unit}` : `+=${value}${unit}`
    return `top ${startPct}%${offset}`
  }, [threshold, rootMargin])

  const letters = useMemo(
    () => Array.from(text).map((char, index) => ({ char, key: `${char}-${index}` })),
    [text],
  )

  useEffect(() => {
    const el = ref.current
    if (!el || !text) return undefined

    if (respectReducedMotion && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setReady(true)
      onShuffleComplete?.()
      return undefined
    }

    const chars = Array.from(el.querySelectorAll('.shuffle-char'))
    const offset = 22
    const fromVars = {
      x: shuffleDirection === 'left' ? offset : shuffleDirection === 'right' ? -offset : 0,
      y: shuffleDirection === 'up' ? offset : shuffleDirection === 'down' ? -offset : 0,
      opacity: 0,
      filter: 'blur(10px)',
      color: colorFrom,
      force3D: true,
    }
    const randomGlyph = () => charset.charAt(Math.floor(Math.random() * charset.length)) || ''

    const reset = () => {
      chars.forEach((char) => {
        char.textContent = char.getAttribute('data-final') || ''
      })
      gsap.set(chars, fromVars)
      setReady(true)
    }

    const play = () => {
      timelineRef.current?.kill()
      reset()

      const tl = gsap.timeline({
        repeat: loop ? -1 : 0,
        repeatDelay: loop ? loopDelay : 0,
        onComplete: () => {
          chars.forEach((char) => {
            char.textContent = char.getAttribute('data-final') || ''
          })
          if (colorTo) gsap.set(chars, { color: colorTo })
          onShuffleComplete?.()
        },
        onRepeat: onShuffleComplete,
      })

      const orderedChars =
        animationMode === 'evenodd'
          ? [...chars.filter((_, index) => index % 2 === 1), ...chars.filter((_, index) => index % 2 === 0)]
          : chars

      orderedChars.forEach((char, orderIndex) => {
        const finalChar = char.getAttribute('data-final') || ''
        if (!finalChar.trim()) return
        const delay = animationMode === 'random' ? Math.random() * maxDelay : orderIndex * stagger

        tl.fromTo(
          char,
          fromVars,
          {
            x: 0,
            y: 0,
            opacity: 1,
            filter: 'blur(0px)',
            color: colorTo,
            duration,
            ease,
            onStart: () => {
              char.textContent = randomGlyph()
            },
            onUpdate: () => {
              if (Math.random() > 0.72) char.textContent = randomGlyph()
            },
            onComplete: () => {
              char.textContent = finalChar
            },
          },
          delay,
        )
      })

      timelineRef.current = tl
    }

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: scrollTriggerStart,
      once: triggerOnce,
      onEnter: play,
    })

    if (triggerOnHover) {
      hoverHandlerRef.current = play
      el.addEventListener('mouseenter', hoverHandlerRef.current)
    }

    reset()

    return () => {
      trigger.kill()
      timelineRef.current?.kill()
      if (hoverHandlerRef.current) el.removeEventListener('mouseenter', hoverHandlerRef.current)
      hoverHandlerRef.current = null
    }
  }, [
    text,
    duration,
    maxDelay,
    ease,
    scrollTriggerStart,
    shuffleDirection,
    animationMode,
    loop,
    loopDelay,
    stagger,
    charset,
    colorFrom,
    colorTo,
    triggerOnce,
    respectReducedMotion,
    triggerOnHover,
    onShuffleComplete,
  ])

  return (
    <Tag
      ref={ref}
      className={`inline-block whitespace-normal break-words uppercase leading-none ${ready ? 'visible' : 'invisible'} ${className}`.trim()}
      style={{ textAlign, ...style }}
    >
      {letters.map(({ char, key }) => {
        if (char === ' ') {
          return <span key={key} className="inline-block w-[0.32em]" data-final=" " aria-hidden="true" />
        }

        return (
          <span key={key} className="inline-block overflow-hidden align-bottom">
            <span className="shuffle-char inline-block min-w-[0.62em] text-center will-change-transform" data-final={char}>
              {char}
            </span>
          </span>
        )
      })}
    </Tag>
  )
}
