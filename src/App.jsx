import { useEffect, useState } from 'react'
import './App.css'
import Footer from './Components/Footer.jsx'
import Navbar from './Components/Navbar.jsx'
import About from './Pages/About.jsx'
import Contact from './Pages/Contact.jsx'
import Home from './Pages/Home.jsx'
import Services from './Pages/Services.jsx'

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

  useEffect(() => {
    const onPopState = () => {
      setPathname(getPathname())
    }

    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  const Page = routeMap[pathname] ?? Home

  const navigate = (to) => {
    const nextPath = to.replace(/\/+$/, '') || '/'
    if (nextPath === pathname) return
    window.history.pushState({}, '', nextPath)
    setPathname(nextPath)
  }

  return (
    <div className="site-shell">
      <Navbar currentPath={pathname} onNavigate={navigate} />
      <main className="site-main">
        <Page onNavigate={navigate} />
      </main>
      <Footer />
    </div>
  )
}

export default App
