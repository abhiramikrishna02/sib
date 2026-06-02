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
  const words = text.split(' ')

  useEffect(() => {
    if (!containerRef.current) return

    const spans = containerRef.current.querySelectorAll('.animated-text-letter')
    const numLetters = spans.length

    spans.forEach((span, index) => {
      const mappedIndex = index - numLetters / 2
      span.style.animationDelay = `${mappedIndex * delayMultiplier}s`
    })
  }, [text, delayMultiplier])

  return (
    <div className="flex min-w-0 items-center justify-center">
      <p
        ref={containerRef}
        aria-label={text}
        className={`m-0 min-w-0 font-sans ${className}`}
        style={{
          fontSize,
          '--animated-min-weight': minWeight,
          '--animated-max-weight': maxWeight,
          '--animated-duration': `${animationDuration}s`,
          ...style,
        }}
      >
        {words.map((word, wordIndex) => (
          <span
            key={`${word}-${wordIndex}`}
            aria-hidden="true"
            className={`inline-block whitespace-nowrap ${wordIndex < words.length - 1 ? 'mr-[0.22em]' : ''}`}
          >
            {word.split('').map((char, charIndex) => (
              <span
                key={`${char}-${wordIndex}-${charIndex}`}
                aria-hidden="true"
                className="animated-text-letter"
              >
                {char}
              </span>
            ))}
          </span>
        ))}
      </p>
    </div>
  )
}
