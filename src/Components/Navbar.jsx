import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/contact", label: "Contact" },
];

const themes = {
  home: { from: "#7b2cbf", via: "#a855f7", to: "#3c096c", glow: "rgba(168, 85, 247, 0.4)" },
  about: { from: "#3a0ca3", via: "#4361ee", to: "#4cc9f0", glow: "rgba(67, 97, 238, 0.4)" },
  services: { from: "#2d6a4f", via: "#52b788", to: "#081c15", glow: "rgba(82, 183, 136, 0.4)" },
  contact: { from: "#e01e37", via: "#ff4d6d", to: "#800f2f", glow: "rgba(255, 77, 109, 0.4)" },
};

function Navbar({ currentPath = "/", onNavigate, onApplyClick }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredTab, setHoveredTab] = useState(null);

  const active = currentPath === "/" ? "home" : currentPath.replace("/", "");
  const theme = useMemo(() => themes[active] ?? themes.home, [active]);

  // Spring physics for the "Physical Jump"
  const springConfig = { type: "spring", stiffness: 400, damping: 30 };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavigate = (event, to) => {
    event.preventDefault();
    setMobileMenuOpen(false);
    if (onNavigate) onNavigate(to);
    else window.location.href = to;
  };

  return (
    <header className="fixed inset-x-0 top-0 z-[100] px-4 pt-4">
      <motion.div 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mx-auto max-w-6xl"
      >
        <div className={`relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#08040d]/60 backdrop-blur-2xl transition-all duration-500 ${scrolled ? "shadow-[0_20px_50px_rgba(0,0,0,0.5)]" : ""}`}>
          
          {/* --- PASSING AURA LIGHTS --- */}
          <motion.div
            className="absolute inset-0 z-0 opacity-30"
            animate={{
              background: [
                `radial-gradient(600px circle at 0% 50%, ${theme.via}22, transparent 40%)`,
                `radial-gradient(600px circle at 100% 50%, ${theme.via}22, transparent 40%)`,
                `radial-gradient(600px circle at 0% 50%, ${theme.via}22, transparent 40%)`,
              ]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          />

          {/* Top Edge Glow Line */}
          <motion.div 
            className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-fuchsia-500/50 to-transparent"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />

          <div className="relative z-10 flex h-20 items-center justify-between px-6">
            
            {/* --- LOGO NUCLEUS --- */}
            <a href="/" onClick={(e) => handleNavigate(e, "/")} className="group flex items-center gap-3">
              <motion.div
                className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-white/10 to-white/5 shadow-xl"
                whileHover={{ rotate: 180 }}
              >
                <div className="absolute inset-0 rounded-xl bg-fuchsia-600 blur-md opacity-20 group-hover:opacity-60 transition-opacity" />
                <span className="relative text-xl font-black text-white">S</span>
              </motion.div>
              <div className="hidden flex-col sm:flex">
                <span className="text-sm font-black tracking-widest text-white">SIB.</span>
                <span className="text-[10px] uppercase text-fuchsia-400/80">Premium Portal</span>
              </div>
            </a>

            {/* --- DESKTOP NAV --- */}
            <nav className="hidden items-center gap-1 rounded-full border border-white/5 bg-black/20 p-1.5 md:flex">
              {links.map((link) => {
                const isActive = currentPath === link.href;
                return (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    onMouseEnter={() => setHoveredTab(link.href)}
                    onMouseLeave={() => setHoveredTab(null)}
                    onClick={(e) => handleNavigate(e, link.href)}
                    className={`relative px-6 py-2.5 text-sm font-bold transition-colors duration-300 ${isActive ? "text-white" : "text-white/50 hover:text-white"}`}
                  >
                    {/* PHYSICAL JUMPING PILL */}
                    {isActive && (
                      <motion.div
                        layoutId="activePill"
                        className="absolute inset-0 z-0 rounded-full shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                        style={{
                          background: `linear-gradient(135deg, ${theme.from}, ${theme.via})`,
                        }}
                        transition={springConfig}
                      >
                        {/* Aura spill inside the pill */}
                        <motion.div 
                          className="absolute inset-0 rounded-full bg-white/20 blur-sm"
                          animate={{ opacity: [0.5, 0.8, 0.5] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      </motion.div>
                    )}
                    
                    {/* Hover Indicator */}
                    {hoveredTab === link.href && !isActive && (
                      <motion.div
                        layoutId="hoverPill"
                        className="absolute inset-0 z-0 rounded-full bg-white/5"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}

                    <span className="relative z-10">{link.label}</span>
                  </motion.a>
                );
              })}
            </nav>

            {/* --- ACTION BUTTON --- */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="hidden rounded-full bg-white px-6 py-2.5 text-xs font-black uppercase tracking-tighter text-black md:block"
              onClick={() => {
                if (onApplyClick) onApplyClick()
                else window.location.href = "/apply"
              }}
            >
              Apply Now
            </motion.button>

            {/* Mobile Toggle */}
            <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </motion.div>

      {/* --- MOBILE OVERLAY --- */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(12px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            className="fixed inset-0 z-[-1] flex flex-col items-center justify-center bg-black/60"
          >
            {links.map((link, i) => (
              <motion.a
                key={link.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={(e) => handleNavigate(e, link.href)}
                className="py-4 text-4xl font-black text-white"
              >
                {link.label}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Navbar;
