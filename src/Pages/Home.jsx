import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import HeroSection from './Home/Hero'
import Opportunities from './Home/Opportunities'
import ImpactNumbersSection from './Home/ImpactNumbers'
import VisionVideoSection from './Home/VisionVideo'
import VisionMissionSection from './Home/VisionMission'
import FinalCTASection from './Home/FinalCTA'

gsap.registerPlugin(ScrollTrigger)
ScrollTrigger.config({ ignoreMobileResize: true, autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load' })

function Home({ onNavigate }) {
  useEffect(() => {
    document.body.classList.add('home-transparent-bg')
    return () => document.body.classList.remove('home-transparent-bg')
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill())
      gsap.set(document.body, { clearProps: 'all' })
      gsap.set(document.documentElement, { clearProps: 'all' })
    }
  }, [])

  return (
    <>
      <HeroSection />
      <Opportunities onNavigate={onNavigate} />
      <ImpactNumbersSection />
      <VisionVideoSection />
      <VisionMissionSection />
      <FinalCTASection onNavigate={onNavigate} />
    </>
  )
}

export default Home
