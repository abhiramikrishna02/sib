import { useEffect, useState, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { Menu as MenuIcon, X, Sparkles, Zap, Shield } from "lucide-react";
import ChatButton from "./ChatButton.jsx";

export const menuLinks = [
  { href: "/", label: "Home", icon: Zap },
  { href: "/about", label: "About", icon: Shield },
  { href: "/services", label: "Services", icon: Sparkles },
  { href: "/contact", label: "Contact", icon: MenuIcon },
];

export const menuThemes = {
  home: { from: "#7b2cbf", via: "#a855f7", to: "#3c096c", primary: "#a855f7", secondary: "#3c096c" },
  about: { from: "#3a0ca3", via: "#4361ee", to: "#4cc9f0", primary: "#4361ee", secondary: "#3a0ca3" },
  services: { from: "#2d6a4f", via: "#52b788", to: "#081c15", primary: "#52b788", secondary: "#081c15" },
  contact: { from: "#e01e37", via: "#ff4d6d", to: "#800f2f", primary: "#ff4d6d", secondary: "#800f2f" },
};

export function getMenuTheme(pathname = "/") {
  const active = pathname === "/" ? "home" : pathname.replace("/", "");
  return menuThemes[active] ?? menuThemes.home;
}

function Menu({ currentPath = "/", onNavigate, theme }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredTab, setHoveredTab] = useState(null);
  const activeTheme = theme ?? getMenuTheme(currentPath);
  
  // Mouse tracking for the spotlight effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 300, damping: 30 });
  const smoothY = useSpring(mouseY, { stiffness: 300, damping: 30 });

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [currentPath]);

  const handleMouseMove = (e) => {
    const { left, top } = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  };

  const handleNavigate = (event, to) => {
    event.preventDefault();
    setMobileMenuOpen(false);
    if (onNavigate) onNavigate(to);
    else window.location.href = to;
  };

  return (
    <div className="relative flex items-center">
      {/* --- DESKTOP NAVIGATION --- */}
      <nav
        onMouseMove={handleMouseMove}
        className="group hidden items-center gap-1 rounded-2xl border border-white/10 bg-[#0c0616]/60 p-1.5 backdrop-blur-2xl md:flex relative overflow-hidden"
      >
        {/* Internal Glow Follower */}
        <motion.div 
            className="pointer-events-none absolute -inset-px z-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{
                background: `radial-gradient(100px circle at ${smoothX}px ${smoothY}px, ${activeTheme.primary}25, transparent 80%)`
            }}
        />

        {/* The Scanning Laser Line */}
        <motion.div 
            className="absolute inset-y-0 w-[1px] bg-gradient-to-b from-transparent via-fuchsia-500 to-transparent z-10"
            animate={{ x: ['-100%', '1000%'] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />

        {menuLinks.map((link) => {
          const isActive = currentPath === link.href;
          return (
            <motion.a
              key={link.href}
              href={link.href}
              onMouseEnter={() => setHoveredTab(link.href)}
              onMouseLeave={() => setHoveredTab(null)}
              onClick={(e) => handleNavigate(e, link.href)}
              className={`relative px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.25em] transition-all duration-500 ${
                isActive ? "text-white" : "text-white/30 hover:text-white"
              }`}
            >
              {/* LIQUID JUMP PILL */}
              {isActive && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute inset-0 z-0 rounded-xl"
                  style={{
                    background: `linear-gradient(135deg, ${activeTheme.from}, ${activeTheme.via})`,
                    boxShadow: `0 0 20px ${activeTheme.primary}44`,
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                >
                  <div className="absolute inset-0 rounded-xl bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
                </motion.div>
              )}

              {/* HOVER GLOW */}
              {hoveredTab === link.href && !isActive && (
                <motion.div
                  layoutId="hover-box"
                  className="absolute inset-0 z-0 rounded-xl bg-white/5 border border-white/5"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                />
              )}

              <span className="relative z-10 flex items-center gap-2">
                {link.label}
              </span>
            </motion.a>
          );
        })}

        <ChatButton theme={activeTheme} />
      </nav>

      {/* --- MOBILE TOGGLE --- */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        className="md:hidden relative group p-3 rounded-xl bg-[#1a0b2e] border border-white/10 text-white overflow-hidden"
        onClick={() => setMobileMenuOpen((open) => !open)}
      >
        <div className="absolute inset-0 bg-fuchsia-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        {mobileMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
      </motion.button>

      {/* --- MOBILE MENU PORTAL --- */}
      {typeof document !== "undefined"
        ? createPortal(
            <AnimatePresence>
              {mobileMenuOpen && (
                <div className="fixed inset-0 z-[140] md:hidden">
                  {/* Blur Backdrop */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setMobileMenuOpen(false)}
                    className="absolute inset-0 bg-[#08040d]/80 backdrop-blur-xl"
                  />

                  {/* Sidebar/Drawer */}
                  <motion.div
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="absolute right-0 top-0 flex h-full w-full max-w-[24rem] flex-col border-l border-white/10 bg-[#0f071a]/95 px-4 py-5 shadow-[-20px_0_80px_rgba(0,0,0,0.8)] sm:w-[86%] sm:px-6 sm:py-7"
                  >
                    {/* Tech Textures */}
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')] opacity-[0.05] pointer-events-none" />
                    
                    {/* Header */}
                    <div className="relative mb-5 flex shrink-0 items-center justify-between sm:mb-8">
                      <div>
                        <h2 className="text-[clamp(1.7rem,9vw,2.25rem)] font-black italic leading-none tracking-tighter text-white">CORE_NAV</h2>
                        <div className="mt-2 h-1 w-12 bg-fuchsia-500" />
                      </div>
                      <button onClick={() => setMobileMenuOpen(false)} className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/10 bg-white/5 sm:h-12 sm:w-12">
                        <X size={20} className="text-white/40" />
                      </button>
                    </div>

                    {/* Links */}
                    <div className="relative z-10 flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto pr-1 sm:gap-4">
                      {menuLinks.map((link, i) => (
                        <motion.button
                          key={link.href}
                          initial={{ opacity: 0, x: 50 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 + 0.2 }}
                          onClick={(e) => handleNavigate(e, link.href)}
                          className={`group relative flex flex-col items-start rounded-2xl border p-4 text-left transition-all sm:rounded-3xl sm:p-5 ${
                            currentPath === link.href 
                              ? "border-fuchsia-500/50 bg-fuchsia-500/10" 
                              : "border-white/5 bg-white/[0.02]"
                          }`}
                        >
                          <div className="flex w-full items-center justify-between">
                            <span className={`min-w-0 text-[clamp(1.75rem,9vw,2.65rem)] font-black uppercase leading-none tracking-tighter ${currentPath === link.href ? 'text-white' : 'text-white/20'}`}>
                                {link.label}
                            </span>
                            <link.icon className={currentPath === link.href ? 'text-fuchsia-500' : 'text-white/10'} size={24} />
                          </div>
                          
                          {/* Subtext decorator */}
                          <span className="mt-2 text-[8px] font-bold uppercase tracking-[0.24em] text-white/20 sm:text-[9px] sm:tracking-[0.3em]">
                             Access System Protocol 0{i+1}
                          </span>

                          {/* Hover/Active Corner Brackets */}
                          {currentPath === link.href && (
                             <>
                                <div className="absolute left-3 top-3 h-2 w-2 border-l border-t border-fuchsia-500 sm:left-4 sm:top-4" />
                                <div className="absolute bottom-3 right-3 h-2 w-2 border-b border-r border-fuchsia-500 sm:bottom-4 sm:right-4" />
                             </>
                          )}
                        </motion.button>
                      ))}
                      <ChatButton theme={activeTheme} variant="mobile" />
                    </div>

                    {/* Footer Info */}
                    <div className="mt-4 flex shrink-0 flex-col gap-2 border-t border-white/5 pt-4 sm:mt-6 sm:pt-6">
                         <p className="text-center text-[8px] font-black uppercase tracking-[0.32em] text-white/20 sm:text-[9px] sm:tracking-[0.5em]">Neural Interface v2.04</p>
                         <div className="flex justify-center gap-4">
                             <div className="h-1 w-1 bg-fuchsia-500 rounded-full animate-pulse" />
                             <div className="h-1 w-1 bg-fuchsia-500 rounded-full animate-pulse delay-75" />
                             <div className="h-1 w-1 bg-fuchsia-500 rounded-full animate-pulse delay-150" />
                         </div>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>,
            document.body
          )
        : null}
    </div>
  );
}

export default Menu;
