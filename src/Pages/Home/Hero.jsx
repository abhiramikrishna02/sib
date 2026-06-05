import { useEffect, useRef } from 'react'
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

const galleryImages = [
  { src: hero1, alt: 'Students exploring campus life in Bengaluru' },
  { src: hero2, alt: 'Study abroad counseling session' },
  { src: hero3, alt: 'Bengaluru education opportunity' },
  { src: img1, alt: 'Student success story' },
  { src: img2, alt: 'University guidance' },
  { src: img3, alt: 'Academic planning support' },
  { src: img4, alt: 'Career-focused learning' },
  { src: img5, alt: 'Student community' },
  { src: img6, alt: 'Higher education pathway' },
]

function HeroSection() {
  const videoRef = useRef(null)
  const sectionRef = useRef(null)

  useEffect(() => {
    if (!videoRef.current) return
    videoRef.current.playbackRate = 0.5
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[100svh] w-full overflow-hidden bg-black text-white"
    >
      {/* <video
        ref={videoRef}
        className="absolute inset-0 z-0 h-full w-full object-cover"
        style={{ transform: 'scale(1.08)' }}
        src="/hero.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      /> */}
      <div className="absolute inset-0 z-10 bg-black/55" />
      <InfiniteGallery
        images={galleryImages}
        speed={1.2}
        visibleCount={12}
        scrollSourceRef={sectionRef}
        fadeSettings={{
          fadeIn: { start: 0.05, end: 0.25 },
          fadeOut: { start: 0.42, end: 0.48 },
        }}
        blurSettings={{
          blurIn: { start: 0, end: 0.12 },
          blurOut: { start: 0.42, end: 0.48 },
          maxBlur: 8,
        }}
        className="absolute inset-0 z-20 h-full w-full opacity-80 mix-blend-screen"
      />
      <div className="absolute inset-0 z-30 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.05),rgba(0,0,0,0.58)_72%)]" />
      <div className="relative z-40 flex min-h-[100svh] w-full items-center justify-center px-4 pb-16 pt-32 text-center sm:px-6 sm:pb-20 sm:pt-36 md:px-8 lg:px-10">
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
