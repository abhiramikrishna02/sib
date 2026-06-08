import { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react'
import './App.css'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import Navbar from './Components/Navbar.jsx'
import Footer from './Components/Footer.jsx'
import ApplyModal from './Components/ApplyModal.jsx'
import { isSupabaseConfigured, supabase, supabaseConfigMessage } from './lib/supabase.js'

gsap.registerPlugin(ScrollTrigger)

const Home = lazy(() => import('./Pages/Home.jsx'))
const About = lazy(() => import('./Pages/About.jsx'))
const Contact = lazy(() => import('./Pages/Contact.jsx'))
const Services = lazy(() => import('./Pages/Services.jsx'))
const Details = lazy(() => import('./Pages/Details.jsx'))
const Login = lazy(() => import('./Components/Login.jsx'))
const Add = lazy(() => import('./Pages/Add.jsx'))

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

const ABOUT_ROUTE_VERSION = 'about-responsive-v1'

function getPathname() {
  return window.location.pathname.replace(/\/+$/, '') || '/'
}

function normalizeRows(rows = []) {
  const splitFeeRange = (value) => {
    const text = String(value || '').trim()
    if (!text) return ['', '']
    const parts = text.split(/\s*(?:-|–|—|to)\s*/i).map((part) => part.trim()).filter(Boolean)
    return parts.length >= 2 ? [parts[0], parts.slice(1).join(' - ')] : [text, '']
  }

  const parseImages = (images) => {
    if (Array.isArray(images)) return images.filter(Boolean)
    if (typeof images === 'string') {
      try {
        const parsed = JSON.parse(images)
        if (Array.isArray(parsed)) return parsed.filter(Boolean)
      } catch {
        return images
          .split(/\r?\n|,/)
          .map((item) => item.trim())
          .filter(Boolean)
      }
    }
    return []
  }

  return rows.map((row) => {
    const feeRange = row.fee_range || row.feeRange || ''
    const [rangeFrom, rangeTo] = splitFeeRange(feeRange)

    return {
      ...row,
      feeRange,
      feeFrom: row.fee_from || row.feeFrom || rangeFrom,
      feeTo: row.fee_to || row.feeTo || rangeTo,
      image_url: row.image_url || row.logo_url || '',
      images: parseImages(row.images),
      document_url: row.document_url || '',
      document_name: row.document_name || '',
      document_type: row.document_type || '',
    }
  })
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
  const hasLoadedDataRef = useRef(false)

  const loadGlobalData = useCallback(async ({ silent = false } = {}) => {
    if (!silent) setDataLoading(true)

    if (!isSupabaseConfigured) {
      console.warn(supabaseConfigMessage)
      setGlobalData({ Universities: [], Colleges: [], Courses: [] })
      setDataLoading(false)
      hasLoadedDataRef.current = true
      return
    }

    const loadTable = async (tableName) => {
      const ordered = await supabase.from(tableName).select('*').order('created_at', { ascending: true })
      if (!ordered.error) return ordered

      const message = `${ordered.error.message || ''} ${ordered.error.details || ''} ${ordered.error.hint || ''}`.toLowerCase()
      const canRetryWithoutOrder =
        message.includes('created_at') ||
        message.includes('order') ||
        message.includes('does not exist') ||
        message.includes('schema cache')

      if (canRetryWithoutOrder) {
        const unordered = await supabase.from(tableName).select('*')
        if (!unordered.error) return unordered
      }

      return ordered
    }

    const [universitiesResult, collegesResult, coursesResult] = await Promise.all([
      loadTable('universities'),
      loadTable('colleges'),
      loadTable('courses'),
    ])

    const hasError = universitiesResult.error || collegesResult.error || coursesResult.error

    if (hasError) {
      console.error('Failed to load some education data:', {
        universities: universitiesResult.error,
        colleges: collegesResult.error,
        courses: coursesResult.error,
      })
    }

    setGlobalData(
      groupEducationData({
        universities: universitiesResult.error ? [] : universitiesResult.data || [],
        colleges: collegesResult.error ? [] : collegesResult.data || [],
        courses: coursesResult.error ? [] : coursesResult.data || [],
      })
    )

    setDataLoading(false)
    hasLoadedDataRef.current = true
  }, [])

  useEffect(() => {
    loadGlobalData()
  }, [loadGlobalData])

  useEffect(() => {
    if (!hasLoadedDataRef.current) return
    if (!['/services', '/details', '/add'].includes(pathname)) return
    loadGlobalData({ silent: true })
  }, [loadGlobalData, pathname])

  useEffect(() => {
    window.history.scrollRestoration = 'manual'

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let lenis = null
    let rafId = 0

    if (!prefersReducedMotion) {
      lenis = new Lenis({
        lerp: 0.12,
        smoothWheel: true,
        smoothTouch: false,
        wheelMultiplier: 1,
        touchMultiplier: 1.4,
        syncTouch: false,
      })
      lenisRef.current = lenis

      const onScroll = () => ScrollTrigger.update()
      lenis.on('scroll', onScroll)

      const raf = (time) => {
        lenis.raf(time)
        rafId = requestAnimationFrame(raf)
      }
      rafId = requestAnimationFrame(raf)
    }

    const onPopState = () => {
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
      if (rafId) {
        cancelAnimationFrame(rafId)
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
  const pageKey = pathname === '/about' ? `${pathname}:${locationHash}:${ABOUT_ROUTE_VERSION}` : `${pathname}:${locationHash}`

  const navigate = (to) => {
    const [rawPath, rawHash = ''] = to.split('#')
    const nextPath = rawPath.replace(/\/+$/, '') || '/'
    const nextHash = rawHash ? `#${rawHash}` : ''
    if (nextPath === pathname && nextHash === locationHash) return
    setApplyOpen(false)
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
        <Suspense fallback={<div className="min-h-screen bg-[#08040f]" />}>
          <Page
            key={pageKey}
            onNavigate={navigate}
            globalData={globalData}
            setGlobalData={setGlobalData}
            refreshGlobalData={() => loadGlobalData({ silent: true })}
            locationHash={locationHash}
            dataLoading={dataLoading}
          />
        </Suspense>
      </main>
      
      <ApplyModal open={applyOpen} onClose={() => setApplyOpen(false)} />
      
      {/* Only show Footer if not on login/admin pages */}
      {pathname !== '/login' && pathname !== '/admin' && <Footer onNavigate={navigate} />}
    </div>
  )
}

export default App
