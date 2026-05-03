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
import Details from './Pages/Details.jsx'
import Login from './Components/Login.jsx'; // Add this line
import Add from './Pages/Add.jsx';
import { supabase } from './lib/supabase.js'

gsap.registerPlugin(ScrollTrigger)

const routeMap = {
  '/': Home,
  '/about': About,
  '/services': Services,
  '/details': Details,
  '/contact': Contact,
  '/login': Login,   // Add this
  '/admin': Login,    // Add this
  '/add': Add
}

function getPathname() {
  return window.location.pathname.replace(/\/+$/, '') || '/'
}

function normalizeRows(rows = []) {
  return rows.map((row) => ({
    ...row,
    feeRange: row.fee_range || row.feeRange || '',
    image_url: row.image_url || '',
    images: Array.isArray(row.images) ? row.images : [],
    document_url: row.document_url || '',
    document_name: row.document_name || '',
    document_type: row.document_type || '',
  }))
}

function groupEducationData({
  universities = [],
  colleges = [],
  courses = [],
} = {}) {
  return {
    Universities: normalizeRows(universities),
    Colleges: normalizeRows(colleges),
    Courses: normalizeRows(courses),
  }
}

function App() {
  const [pathname, setPathname] = useState(getPathname)
  const [locationHash, setLocationHash] = useState(window.location.hash)
  const [applyOpen, setApplyOpen] = useState(false)
  const [globalData, setGlobalData] = useState({ Universities: [], Colleges: [], Courses: [] })
  const [dataLoading, setDataLoading] = useState(true)
  const lenisRef = useRef(null)

  useEffect(() => {
    let mounted = true

    const loadGlobalData = async () => {
      setDataLoading(true)
      const [universitiesResult, collegesResult, coursesResult] = await Promise.all([
        supabase.from('universities').select('*').order('created_at', { ascending: true }),
        supabase.from('colleges').select('*').order('created_at', { ascending: true }),
        supabase.from('courses').select('*').order('created_at', { ascending: true }),
      ])

      if (!mounted) return

      const hasError = universitiesResult.error || collegesResult.error || coursesResult.error

      if (hasError) {
        console.error('Failed to load education data:', {
          universities: universitiesResult.error,
          colleges: collegesResult.error,
          courses: coursesResult.error,
        })
        setGlobalData({ Universities: [], Colleges: [], Courses: [] })
      } else {
        setGlobalData(
          groupEducationData({
            universities: universitiesResult.data || [],
            colleges: collegesResult.data || [],
            courses: coursesResult.data || [],
          })
        )
      }

      setDataLoading(false)
    }

    loadGlobalData()

    return () => {
      mounted = false
    }
  }, [])

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
          dataLoading={dataLoading}
        />
      </main>
      
      <ApplyModal open={applyOpen} onClose={() => setApplyOpen(false)} />
      
      {/* Only show Footer if not on login/admin pages */}
      {pathname !== '/login' && pathname !== '/admin' && <Footer onNavigate={navigate} />}
    </div>
  )
}

export default App
