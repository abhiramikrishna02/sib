import { useEffect, useMemo, useState, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Menu, X, Sparkles, Zap } from "lucide-react";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/contact", label: "Contact" },
];

const themes = {
  home: { from: "#7b2cbf", via: "#a855f7", to: "#3c096c", primary: "#a855f7", secondary: "#3c096c" },
  about: { from: "#3a0ca3", via: "#4361ee", to: "#4cc9f0", primary: "#4361ee", secondary: "#3a0ca3" },
  services: { from: "#2d6a4f", via: "#52b788", to: "#081c15", primary: "#52b788", secondary: "#081c15" },
  contact: { from: "#e01e37", via: "#ff4d6d", to: "#800f2f", primary: "#ff4d6d", secondary: "#800f2f" },
};

function Navbar({ currentPath = "/", onNavigate, onApplyClick }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredTab, setHoveredTab] = useState(null);
  const navRef = useRef(null);

  // Mouse Position for 3D Tilt & Spotlight
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs for the 3D effect
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  // Rotate transformations for 3D Tilt
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

  const active = currentPath === "/" ? "home" : currentPath.replace("/", "");
  const theme = useMemo(() => themes[active] ?? themes.home, [active]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleMouseMove = (e) => {
    if (!navRef.current) return;
    const rect = navRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Normalize values between -0.5 and 0.5
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setHoveredTab(null);
  };

  const handleNavigate = (event, to) => {
    event.preventDefault();
    setMobileMenuOpen(false);
    if (onNavigate) onNavigate(to);
    else window.location.href = to;
  };

  return (
    <header className="fixed inset-x-0 top-0 z-[100] px-4 pt-6 perspective-1000">
      <motion.div 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mx-auto max-w-6xl"
      >
        <motion.div 
          ref={navRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          className={`group relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#08040d]/60 backdrop-blur-3xl transition-all duration-700 ${
            scrolled ? "py-2 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.9)]" : "py-5"
          }`}
        >
          {/* --- BORDER BEAM EFFECT --- */}
          <div className="absolute inset-px z-0 overflow-hidden rounded-[2.5rem] pointer-events-none">
             <motion.div 
                className="absolute h-full w-20 opacity-40 blur-xl"
                style={{ background: `linear-gradient(to right, transparent, ${theme.primary}, transparent)` }}
                animate={{ x: ['-100%', '1000%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
             />
          </div>

          {/* --- HOLOGRAPHIC GRID OVERLAY --- */}
          <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] group-hover:opacity-[0.07] transition-opacity duration-500" />

          {/* --- DYNAMIC GLOW NUCLEUS --- */}
          <motion.div
            className="pointer-events-none absolute -inset-px z-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{
              background: `radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), ${theme.primary}10, transparent 80%)`
            }}
          />

          <div className="relative z-10 flex items-center justify-between px-10">
            
            {/* --- LOGO: TITANIUM STYLE --- */}
            <motion.a 
              href="/" 
              onClick={(e) => handleNavigate(e, "/")} 
              className="flex items-center gap-4"
              style={{ transform: "translateZ(30px)" }}
            >
              <div className="relative flex h-12 w-12 items-center justify-center">
                <div className="absolute inset-0 rotate-45 rounded-xl border border-white/10 bg-white/5 transition-transform group-hover:rotate-90 duration-700" />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/10 to-transparent blur-sm" />
                <Zap size={22} className="relative z-10" style={{ color: theme.primary }} />
                <motion.div 
                   className="absolute inset-0 rounded-full blur-2xl opacity-30"
                   style={{ backgroundColor: theme.primary }}
                   animate={{ scale: [1, 1.2, 1] }}
                   transition={{ duration: 3, repeat: Infinity }}
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black uppercase tracking-tighter text-white">SIB<span style={{ color: theme.primary }}>_</span>CORE</span>
                <span className="text-[8px] font-bold uppercase tracking-[0.4em] text-white/30">Neural Interface v2</span>
              </div>
            </motion.a>

            {/* --- JUMPING NAV: WITH TECH BRACKETS --- */}
            <nav className="hidden items-center gap-2 rounded-2xl border border-white/5 bg-black/40 p-1.5 md:flex" style={{ transform: "translateZ(20px)" }}>
              {links.map((link) => {
                const isActive = currentPath === link.href;
                return (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    onMouseEnter={() => setHoveredTab(link.href)}
                    onClick={(e) => handleNavigate(e, link.href)}
                    className={`relative px-7 py-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${
                      isActive ? "text-white" : "text-white/40 hover:text-white"
                    }`}
                  >
                    {/* LIQUID JUMP PILL */}
                    {isActive && (
                      <motion.div
                        layoutId="nav-glow-pill"
                        className="absolute inset-0 z-0 rounded-xl"
                        style={{
                          background: `linear-gradient(135deg, ${theme.from}, ${theme.via})`,
                          boxShadow: `0 0 25px ${theme.primary}66`
                        }}
                        transition={{ type: "spring", stiffness: 400, damping: 30, mass: 1 }}
                      >
                        <div className="absolute inset-0 rounded-xl bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-20" />
                      </motion.div>
                    )}
                    
                    {/* HOVER INDICATOR */}
                    {hoveredTab === link.href && !isActive && (
                      <motion.div
                        layoutId="hover-outline"
                        className="absolute inset-0 z-0 rounded-xl border border-white/10 bg-white/5"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                      />
                    )}

                    <span className="relative z-10">{link.label}</span>
                  </motion.a>
                );
              })}
            </nav>

            {/* --- ACTION BUTTON: THE "PULSE" --- */}
            <div className="hidden md:block" style={{ transform: "translateZ(40px)" }}>
              <motion.button
                whileHover={{ scale: 1.1, letterSpacing: "0.3em" }}
                whileTap={{ scale: 0.9 }}
                style={{ background: theme.primary }}
                className="group relative overflow-hidden rounded-xl px-10 py-4 text-[10px] font-black uppercase tracking-widest text-white shadow-2xl transition-all"
                onClick={() => onApplyClick ? onApplyClick() : window.location.href = "/apply"}
              >
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <span className="relative z-10 flex items-center gap-2">
                   Apply <Sparkles size={14} />
                </span>
              </motion.button>
            </div>

            {/* Mobile Toggle */}
            <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>

          {/* Corner Tech Accents */}
          <div className="absolute top-0 left-0 h-4 w-4 border-t-2 border-l-2 border-white/5" />
          <div className="absolute top-0 right-0 h-4 w-4 border-t-2 border-r-2 border-white/5" />
          <div className="absolute bottom-0 left-0 h-4 w-4 border-b-2 border-l-2 border-white/5" />
          <div className="absolute bottom-0 right-0 h-4 w-4 border-b-2 border-r-2 border-white/5" />
        </motion.div>
      </motion.div>

      {/* --- MOBILE OVERLAY (FULL SCREEN BLUR) --- */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[-1] flex flex-col items-center justify-center bg-black/90 backdrop-blur-2xl"
          >
             <div className="flex flex-col gap-10 text-center">
              {links.map((link, i) => (
                <motion.a
                  key={link.href}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={(e) => handleNavigate(e, link.href)}
                  className="text-6xl font-black uppercase italic tracking-tighter text-white hover:text-fuchsia-500 transition-colors"
                >
                  {link.label}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </header>
  );
}

export default Navbar;