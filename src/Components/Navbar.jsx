import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Sparkles } from "lucide-react";
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
    <header className="fixed inset-x-0 top-0 z-[100] px-3 pt-3 sm:px-4 sm:pt-4 perspective-1000">
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
            scrolled ? "py-1.5 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.9)]" : "py-3.5"
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

          <div className="relative z-10 flex items-center justify-between px-3 sm:px-6">
            
            {/* --- LOGO: TITANIUM STYLE --- */}
            <motion.a 
              href="/" 
              onClick={(e) => handleNavigate(e, "/")} 
              className="group flex items-center gap-2.5 rounded-[1.6rem] border border-white/10 bg-[#180f28]/80 px-3 py-2 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.9)] backdrop-blur-xl transition-all duration-300 hover:border-white/20 hover:bg-[#1d1230]/90 sm:gap-3 sm:px-4"
              style={{ transform: "translateZ(30px)" }}
            >
              <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-[1.05rem] bg-white/5 ring-1 ring-white/10 sm:h-11 sm:w-11">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent" />
                <div className="absolute inset-[5px] rounded-full border-[4px] border-white/80" />
                <div className="absolute left-[13px] top-[8px] h-3.5 w-3.5 rounded-full border-[4px] border-white/80" />
                <div className="absolute left-[15px] top-[16px] h-3 w-3 rounded-full bg-[#180f28]" />
                <div className="absolute top-[7px] left-[11px] h-1.5 w-6 rounded-full bg-white/80" />
                <motion.div 
                   className="absolute inset-0 rounded-[1.15rem] opacity-20"
                   style={{ backgroundColor: theme.primary }}
                   animate={{ opacity: [0.12, 0.22, 0.12] }}
                   transition={{ duration: 3, repeat: Infinity }}
                />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-[7px] font-semibold uppercase tracking-[0.34em] text-white/55 sm:text-[8px]">Study in</span>
                <span className="text-[12px] font-black uppercase tracking-tight text-white sm:text-[14px]">BENGALURU.COM</span>
              </div>
            </motion.a>

            <Menu currentPath={currentPath} onNavigate={onNavigate} theme={theme} />

            {/* --- ACTION BUTTON: THE "PULSE" --- */}
            <div className="hidden md:block" style={{ transform: "translateZ(40px)" }}>
              <motion.button
                whileHover={{ scale: 1.1, letterSpacing: "0.3em" }}
                whileTap={{ scale: 0.9 }}
                style={{ background: theme.primary }}
              className="group relative overflow-hidden rounded-xl px-8 py-3 text-[10px] font-black uppercase tracking-widest text-white shadow-2xl transition-all"
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
