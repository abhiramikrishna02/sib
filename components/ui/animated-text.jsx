import { useEffect, useRef } from 'react'

export function AnimatedText({
  text,
  fontSize = 'clamp(3.2rem,10vw,9rem)',
  minWeight = 500,
  maxWeight = 900,
  animationDuration = 1.5,
  delayMultiplier = 0.08,
  className = '',
  style = {},
}) {
  const containerRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return

    const spans = containerRef.current.querySelectorAll('span')
    const numLetters = spans.length

    spans.forEach((span, index) => {
      const mappedIndex = index - numLetters / 2
      span.style.animationDelay = `${mappedIndex * delayMultiplier}s`
    })
  }, [text, delayMultiplier])

  return (
    <div className="flex items-center justify-center">
      <p
        ref={containerRef}
        aria-label={text}
        className={`m-0 font-sans ${className}`}
        style={{
          fontSize,
          '--animated-min-weight': minWeight,
          '--animated-max-weight': maxWeight,
          '--animated-duration': `${animationDuration}s`,
          ...style,
        }}
      >
        {text.split('').map((char, index) => (
          <span key={`${char}-${index}`} aria-hidden="true" className="animated-text-letter">
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </p>
    </div>
  )
}
