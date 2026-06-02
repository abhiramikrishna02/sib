import { useEffect, useRef } from 'react'
import { AnimatedText } from '../../../components/ui/animated-text'

function HeroSection() {
  const videoRef = useRef(null)

  useEffect(() => {
    if (!videoRef.current) return
    videoRef.current.playbackRate = 0.5
  }, [])

  return (
    <section className="relative flex min-h-[100svh] w-full overflow-hidden bg-black text-white">
      <video
        ref={videoRef}
        className="absolute inset-0 z-0 h-full w-full object-cover"
        style={{ transform: 'scale(1.08)' }}
        src="/hero.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />
      <div className="absolute inset-0 z-10 bg-black/30" />
      <div className="relative z-20 flex min-h-[100svh] w-full items-center justify-center px-4 pb-16 pt-32 text-center sm:px-6 sm:pb-20 sm:pt-36 md:px-8 lg:px-10">
        <div className="w-full max-w-[min(92vw,78rem)]">
          <AnimatedText
            text="Study in Bengaluru"
            fontSize="clamp(2.15rem,12vw,9rem)"
            minWeight={520}
            maxWeight={900}
            animationDuration={3.8}
            delayMultiplier={0.13}
            className="mx-auto max-w-full whitespace-normal break-words font-black uppercase leading-[0.92] tracking-normal text-white drop-shadow-[0_0_34px_rgba(255,255,255,0.22)] sm:leading-[0.9] lg:tracking-tighter"
          />
        </div>
      </div>
    </section>
  )
}

export default HeroSection
