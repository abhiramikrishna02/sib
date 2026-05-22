import { useEffect, useRef } from 'react'
import { AnimatedText } from '../../../components/ui/animated-text'

function HeroSection() {
  const videoRef = useRef(null)

  useEffect(() => {
    if (!videoRef.current) return
    videoRef.current.playbackRate = 0.5
  }, [])

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-black text-white">
      <video
        ref={videoRef}
        className="absolute inset-0 z-0 h-full w-full object-cover"
        style={{ transform: 'scale(1.15)' }}
        src="/hero.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />
      <div className="absolute inset-0 z-10 bg-black/30" />
      <div className="relative z-20 flex min-h-screen items-center justify-center px-6 py-24 text-center">
        <AnimatedText
          text="Study in Bengaluru"
          fontSize="clamp(3.2rem,10vw,9rem)"
          minWeight={520}
          maxWeight={900}
          animationDuration={3.8}
          delayMultiplier={0.13}
          className="font-black uppercase leading-[0.9] tracking-tighter text-white drop-shadow-[0_0_34px_rgba(255,255,255,0.22)]"
        />
      </div>
    </section>
  )
}

export default HeroSection
