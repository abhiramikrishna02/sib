import { useEffect, useRef, useState } from 'react'
import './App.css'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import Navbar from './Components/Navbar.jsx'
import Footer from './Components/Footer.jsx'
import ApplyModal from './Components/ApplyModal.jsx'
// import Apply from './Pages/Apply.jsx'
import About from './Pages/About.jsx'
import Contact from './Pages/Contact.jsx'
import Home from './Pages/Home.jsx'
import Services from './Pages/Services.jsx'
import Login from './Components/Login.jsx'; // Add this line
import Add from './Pages/Add.jsx';

gsap.registerPlugin(ScrollTrigger)

const routeMap = {
  '/': Home,
  '/about': About,
  '/services': Services,
  '/contact': Contact,
  '/login': Login,   // Add this
  '/admin': Login,    // Add this
  '/add': Add
}

function getPathname() {
  return window.location.pathname.replace(/\/+$/, '') || '/'
}

function App() {
  const [pathname, setPathname] = useState(getPathname)
  const [applyOpen, setApplyOpen] = useState(false)
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
    setApplyOpen(false)
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    window.history.pushState({}, '', nextPath)
    setPathname(nextPath)
  }

  return (
    <div className="site-shell">
      {/* Only show Navbar if not on login/admin pages */}
      {pathname !== '/login' && pathname !== '/admin' && pathname !== '/add' && (
        <Navbar
          currentPath={pathname}
          onNavigate={navigate}
          onApplyClick={() => setApplyOpen(true)}
        />
      )}
      
      <main className="site-main">
        <Page onNavigate={navigate} />
      </main>
      
      <ApplyModal open={applyOpen} onClose={() => setApplyOpen(false)} />
      
      {/* Only show Footer if not on login/admin pages */}
      {pathname !== '/login' && pathname !== '/admin' && <Footer />}
    </div>
  )
}

export default App
