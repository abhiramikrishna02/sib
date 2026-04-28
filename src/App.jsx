import { useEffect, useRef, useState } from 'react'
import './App.css'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import Navbar from './Components/Navbar.jsx'
import About from './Pages/About.jsx'
import Contact from './Pages/Contact.jsx'
import Home from './Pages/Home.jsx'
import Services from './Pages/Services.jsx'

gsap.registerPlugin(ScrollTrigger)

const routeMap = {
  '/': Home,
  '/about': About,
  '/services': Services,
  '/contact': Contact,
}

function getPathname() {
  return window.location.pathname.replace(/\/+$/, '') || '/'
}

function App() {
  const [pathname, setPathname] = useState(getPathname)
  const lenisRef = useRef(null)

  useEffect(() => {
    window.history.scrollRestoration = 'manual'

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let lenis = null
    let raf = null

    if (!prefersReducedMotion) {
      lenis = new Lenis({
        duration: 1,
        lerp: 0.075,
        smoothWheel: true,
        smoothTouch: false,
        wheelMultiplier: 0.9,
      })
      lenisRef.current = lenis

      const onScroll = () => ScrollTrigger.update()
      lenis.on('scroll', onScroll)

      raf = (time) => {
        lenis.raf(time * 1000)
      }
      gsap.ticker.add(raf)
      gsap.ticker.lagSmoothing(0)
    }

    const onPopState = () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
      setPathname(getPathname())
    }

    window.addEventListener('popstate', onPopState)
    return () => {
      window.removeEventListener('popstate', onPopState)
      if (lenis) {
        lenis.destroy()
        lenisRef.current = null
      }
      if (raf) {
        gsap.ticker.remove(raf)
      }
    }
  }, [])

  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true })
    } else {
      window.scrollTo({ top: 0, behavior: 'auto' })
    }
    requestAnimationFrame(() => {
      ScrollTrigger.refresh()
    })
  }, [pathname])

  const Page = routeMap[pathname] ?? Home

  const navigate = (to) => {
    const nextPath = to.replace(/\/+$/, '') || '/'
    if (nextPath === pathname) return
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    window.history.pushState({}, '', nextPath)
    setPathname(nextPath)
  }

  return (
    <div className="site-shell">
      <Navbar currentPath={pathname} onNavigate={navigate} />
      <main className="site-main">
        <Page onNavigate={navigate} />
      </main>
    </div>
  )
}

export default App
