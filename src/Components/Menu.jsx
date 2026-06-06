import { useEffect, useState, useRef } from "react";
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
  home: { from: "#ffffff", via: "#9f9f9f", to: "#111111", primary: "#ffffff", secondary: "#2a2a2a" },
  about: { from: "#ffffff", via: "#bdbdbd", to: "#111111", primary: "#ffffff", secondary: "#2a2a2a" },
  services: { from: "#ffffff", via: "#a6a6a6", to: "#111111", primary: "#ffffff", secondary: "#2a2a2a" },
  contact: { from: "#ffffff", via: "#cfcfcf", to: "#111111", primary: "#ffffff", secondary: "#2a2a2a" },
};

export function getMenuTheme(pathname = "/") {
  const active = pathname === "/" ? "home" : pathname.replace("/", "");
  return menuThemes[active] ?? menuThemes.home;
}

function Menu({ currentPath = "/", onNavigate, theme }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredTab, setHoveredTab] = useState(null);
  const activeTheme = theme ?? getMenuTheme(currentPath);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 300, damping: 30 });
  const smoothY = useSpring(mouseY, { stiffness: 300, damping: 30 });

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [currentPath]);

  // Prevent body scroll when menu open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

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

      {/* ── Mobile Hamburger Toggle ── */}
      {/* Styled to match the navbar: dark bg, white border, white icon */}
      <motion.button
        whileTap={{ scale: 0.88 }}
        aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        className="relative flex items-center justify-center rounded-full overflow-hidden"
        style={{
          width: 40,
          height: 40,
          background: "linear-gradient(160deg, #1a1a1a 0%, #080808 60%, #111111 100%)",
          border: "1px solid rgba(255,255,255,0.13)",
          boxShadow: "0 2px 12px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.07)",
        }}
        onClick={() => setMobileMenuOpen((open) => !open)}
      >
        {/* Subtle inner glow on hover */}
        <span
          className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 hover:opacity-100"
          style={{ background: "radial-gradient(circle at center, rgba(255,255,255,0.08), transparent 70%)" }}
        />
        <AnimatePresence mode="wait" initial={false}>
          {mobileMenuOpen ? (
            <motion.span
              key="close"
              initial={{ rotate: -45, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 45, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="flex items-center justify-center text-white"
            >
              <X size={18} strokeWidth={2.5} />
            </motion.span>
          ) : (
            <motion.span
              key="open"
              initial={{ rotate: 45, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -45, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="flex items-center justify-center text-white"
            >
              <MenuIcon size={18} strokeWidth={2.5} />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* ── Mobile Menu Portal ── */}
      {typeof document !== "undefined"
        ? createPortal(
            <AnimatePresence>
              {mobileMenuOpen && (
                <div className="fixed inset-0 z-[140]">
                  {/* Backdrop */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    onClick={() => setMobileMenuOpen(false)}
                    className="absolute inset-0"
                    style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }}
                  />

                  {/* Drawer — slides in from right */}
                  <motion.div
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{ type: "spring", damping: 28, stiffness: 220 }}
                    className="absolute right-0 top-0 flex h-full w-full max-w-[22rem] flex-col"
                    style={{
                      background: "linear-gradient(160deg, #1a1a1a 0%, #080808 60%, #111111 100%)",
                      borderLeft: "1px solid rgba(255,255,255,0.09)",
                      boxShadow: "-20px 0 80px rgba(0,0,0,0.8)",
                    }}
                  >
                    {/* Subtle grid texture — matches site aesthetic */}
                    <div
                      className="pointer-events-none absolute inset-0"
                      style={{
                        backgroundImage: "repeating-linear-gradient(0deg, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 1px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 1px, transparent 1px, transparent 40px)",
                      }}
                    />
                    {/* Top edge highlight — matches navbar inner glow */}
                    <div
                      className="pointer-events-none absolute left-0 right-0 top-0 h-px"
                      style={{ background: "rgba(255,255,255,0.10)" }}
                    />

                    {/* ── Drawer Header ── */}
                    <div className="relative flex shrink-0 items-center justify-between px-6 pt-6 pb-5"
                         style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                      {/* Logo mark — mirrors navbar logo */}
                      <div className="flex items-center gap-2.5">
                        <div
                          className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                          style={{
                            background: "linear-gradient(145deg, #ffffff 0%, #d4d4d4 100%)",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.40), inset 0 1px 2px rgba(255,255,255,0.80)",
                          }}
                        >
                          <div
                            className="h-3 w-3 rounded-full"
                            style={{ background: "linear-gradient(145deg, #111 0%, #333 100%)", boxShadow: "inset 0 1px 3px rgba(0,0,0,0.6)" }}
                          />
                        </div>
                        <div className="flex flex-col leading-none">
                          <span className="text-[8px] font-semibold uppercase tracking-[0.28em] text-white/45">Study in</span>
                          <span className="text-[13px] font-bold uppercase tracking-wide text-white">Bengaluru</span>
                        </div>
                      </div>

                      {/* Close button — pill style matching navbar */}
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center justify-center rounded-full text-white/50 hover:text-white transition-colors"
                        style={{
                          width: 36,
                          height: 36,
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.09)",
                        }}
                      >
                        <X size={16} strokeWidth={2.5} />
                      </motion.button>
                    </div>

                    {/* ── Nav Links ── */}
                    <div className="relative z-10 flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto px-4 py-4">
                      {menuLinks.map((link, i) => {
                        const isActive = currentPath === link.href;
                        return (
                          <motion.button
                            key={link.href}
                            initial={{ opacity: 0, x: 40 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.07 + 0.1, type: "spring", stiffness: 300, damping: 25 }}
                            onClick={(e) => handleNavigate(e, link.href)}
                            className="group relative flex items-center justify-between rounded-2xl px-5 py-4 text-left transition-all duration-300"
                            style={{
                              background: isActive
                                ? "linear-gradient(160deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.05) 100%)"
                                : "rgba(255,255,255,0.02)",
                              border: isActive
                                ? "1px solid rgba(255,255,255,0.18)"
                                : "1px solid rgba(255,255,255,0.05)",
                              boxShadow: isActive
                                ? "inset 0 1px 0 rgba(255,255,255,0.10), 0 4px 16px rgba(0,0,0,0.3)"
                                : "none",
                            }}
                          >
                            {/* Active top-left corner bracket — matches site's micro-detail style */}
                            {isActive && (
                              <>
                                <div className="absolute left-3 top-3 h-2 w-2 border-l border-t border-white/50" />
                                <div className="absolute bottom-3 right-3 h-2 w-2 border-b border-r border-white/50" />
                              </>
                            )}

                            <div className="flex flex-col gap-1">
                              <span
                                className="text-[1.6rem] font-black uppercase leading-none tracking-tighter transition-colors duration-300"
                                style={{ color: isActive ? "#ffffff" : "rgba(255,255,255,0.20)" }}
                              >
                                {link.label}
                              </span>
                              <span
                                className="text-[8px] font-bold uppercase tracking-[0.24em]"
                                style={{ color: "rgba(255,255,255,0.18)" }}
                              >
                                System Protocol 0{i + 1}
                              </span>
                            </div>

                            <link.icon
                              size={20}
                              strokeWidth={2}
                              style={{ color: isActive ? "rgba(255,255,255,0.70)" : "rgba(255,255,255,0.10)" }}
                            />
                          </motion.button>
                        );
                      })}

                      {/* Apply CTA inside drawer — mirrors the navbar Apply button */}
                      <motion.button
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: menuLinks.length * 0.07 + 0.1, type: "spring", stiffness: 300, damping: 25 }}
                        onClick={(e) => handleNavigate(e, "/apply")}
                        className="relative mt-2 flex items-center justify-center gap-2 overflow-hidden rounded-2xl px-5 py-4 text-[11px] font-bold uppercase tracking-widest text-black"
                        style={{
                          background: "linear-gradient(160deg, #ffffff 0%, #e0e0e0 100%)",
                          boxShadow: "0 2px 12px rgba(255,255,255,0.12), inset 0 1px 0 rgba(255,255,255,0.90)",
                        }}
                      >
                        <span
                          aria-hidden
                          className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-2xl"
                          style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0.55), transparent)" }}
                        />
                        <span className="relative z-10">Apply Now</span>
                        <Sparkles size={13} className="relative z-10 opacity-60" />
                      </motion.button>

                      <ChatButton theme={activeTheme} variant="mobile" />
                    </div>

                    {/* ── Footer ── */}
                    <div
                      className="relative shrink-0 px-6 py-4"
                      style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
                    >
                      <p className="text-center text-[8px] font-black uppercase tracking-[0.35em] text-white/20">
                        Study in Bengaluru · v2.04
                      </p>
                      <div className="mt-3 flex justify-center gap-3">
                        {[0, 75, 150].map((delay) => (
                          <div
                            key={delay}
                            className="h-1 w-1 rounded-full bg-white/30 animate-pulse"
                            style={{ animationDelay: `${delay}ms` }}
                          />
                        ))}
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