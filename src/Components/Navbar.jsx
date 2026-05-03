import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Sparkles, Zap } from "lucide-react";
import Menu, { getMenuTheme } from "./Menu.jsx";

function Navbar({ currentPath = "/", onNavigate, onApplyClick }) {
  const [scrolled, setScrolled] = useState(false);
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

  const theme = useMemo(() => getMenuTheme(currentPath), [currentPath]);

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
  };

  return (
    <header className="fixed inset-x-0 top-0 z-[100] px-3 pt-4 sm:px-4 sm:pt-6 perspective-1000">
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

          <div className="relative z-10 flex items-center justify-between px-4 sm:px-10">
            
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

            <Menu currentPath={currentPath} onNavigate={onNavigate} theme={theme} />

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
          </div>

          {/* Corner Tech Accents */}
          <div className="absolute top-0 left-0 h-4 w-4 border-t-2 border-l-2 border-white/5" />
          <div className="absolute top-0 right-0 h-4 w-4 border-t-2 border-r-2 border-white/5" />
          <div className="absolute bottom-0 left-0 h-4 w-4 border-b-2 border-l-2 border-white/5" />
          <div className="absolute bottom-0 right-0 h-4 w-4 border-b-2 border-r-2 border-white/5" />
        </motion.div>
      </motion.div>

      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </header>
  );
}

export default Navbar;
