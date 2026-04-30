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
  const [locationHash, setLocationHash] = useState(window.location.hash)
  const [applyOpen, setApplyOpen] = useState(false)
  const [globalData, setGlobalData] = useState(() => {
    const saved = localStorage.getItem('sib_data')
    return saved ? JSON.parse(saved) : { Universities: [], Colleges: [], Courses: [] }
  })
  const lenisRef = useRef(null)

  useEffect(() => {
    localStorage.setItem('sib_data', JSON.stringify(globalData))
  }, [globalData])

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
      setLocationHash(window.location.hash)
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
    const [rawPath, rawHash = ''] = to.split('#')
    const nextPath = rawPath.replace(/\/+$/, '') || '/'
    const nextHash = rawHash ? `#${rawHash}` : ''
    if (nextPath === pathname && nextHash === locationHash) return
    setApplyOpen(false)
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    window.history.pushState({}, '', `${nextPath}${nextHash}`)
    setPathname(nextPath)
    setLocationHash(nextHash)
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
        <Page
          onNavigate={navigate}
          globalData={globalData}
          setGlobalData={setGlobalData}
          locationHash={locationHash}
        />
      </main>
      
      <ApplyModal open={applyOpen} onClose={() => setApplyOpen(false)} />
      
      {/* Only show Footer if not on login/admin pages */}
      {pathname !== '/login' && pathname !== '/admin' && <Footer />}
    </div>
  )
}

export default App
