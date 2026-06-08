import { useEffect, useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import HeroSection from './Home/Hero'
import FirstSection from './Home/first'
import SecondSection from './Home/second'
import ThirdSection from './Home/third'
import Opportunities from './Home/Opportunities'
import ImpactNumbersSection from './Home/ImpactNumbers'
import VisionVideoSection from './Home/VisionVideo'
import VisionMissionSection from './Home/VisionMission'
import FinalCTASection from './Home/FinalCTA'

gsap.registerPlugin(ScrollTrigger)
ScrollTrigger.config({ ignoreMobileResize: true, autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load' })

function Home({ onNavigate }) {
  const rootRef = useRef(null)

  useEffect(() => {
    document.body.classList.add('home-transparent-bg')
    return () => document.body.classList.remove('home-transparent-bg')
  }, [])

  useLayoutEffect(() => {
    const root = rootRef.current
    window.scrollTo(0, 0)
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (root && trigger.trigger && root.contains(trigger.trigger)) {
          trigger.kill()
        }
      })
      gsap.set(document.body, { clearProps: 'all' })
      gsap.set(document.documentElement, { clearProps: 'all' })
    }
  }, [])

  return (
    <div ref={rootRef} className="contents">
      <HeroSection />
      <FirstSection />
      <SecondSection />
      <ThirdSection />
      <Opportunities onNavigate={onNavigate} />
      <ImpactNumbersSection />
      <VisionVideoSection />
      <VisionMissionSection />
      <FinalCTASection onNavigate={onNavigate} />
    </div>
  )
}



export default Home
