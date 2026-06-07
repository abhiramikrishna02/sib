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
      <motion.button
        whileTap={{ scale: 0.88 }}
        aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        className="relative flex items-center justify-center rounded-full overflow-hidden"
        style={{
          width: 40,
          height: 40,
          background: "linear-gradient(160deg, #0d1a1a 0%, #06090a 60%, #0a1010 100%)",
          border: "1px solid rgba(75,191,191,0.18)",
          boxShadow: "0 2px 12px rgba(0,0,0,0.55), inset 0 1px 0 rgba(75,191,191,0.08)",
        }}
        onClick={() => setMobileMenuOpen((open) => !open)}
      >
        <span
          className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 hover:opacity-100"
          style={{ background: "radial-gradient(circle at center, rgba(201,169,110,0.10), transparent 70%)" }}
        />
        <AnimatePresence mode="wait" initial={false}>
          {mobileMenuOpen ? (
            <motion.span
              key="close"
              initial={{ rotate: -45, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 45, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="flex items-center justify-center"
              style={{ color: "#C9A96E" }}
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
              className="flex items-center justify-center"
              style={{ color: "#4BBFBF" }}
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
                    style={{ background: "rgba(3,10,10,0.80)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }}
                  />

                  {/* Drawer */}
                  <motion.div
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{ type: "spring", damping: 28, stiffness: 220 }}
                    className="absolute right-0 top-0 flex h-full w-full max-w-[22rem] flex-col"
                    style={{
                      background: "linear-gradient(160deg, #0c1718 0%, #06090a 55%, #080c0c 100%)",
                      borderLeft: "1px solid rgba(75,191,191,0.10)",
                      boxShadow: "-20px 0 80px rgba(0,0,0,0.8)",
                    }}
                  >
                    {/* Subtle teal grid texture */}
                    <div
                      className="pointer-events-none absolute inset-0"
                      style={{
                        backgroundImage: "repeating-linear-gradient(0deg, rgba(75,191,191,0.025) 0px, rgba(75,191,191,0.025) 1px, transparent 1px, transparent 48px), repeating-linear-gradient(90deg, rgba(75,191,191,0.025) 0px, rgba(75,191,191,0.025) 1px, transparent 1px, transparent 48px)",
                      }}
                    />
                    {/* Top edge highlight — teal */}
                    <div
                      className="pointer-events-none absolute left-0 right-0 top-0 h-px"
                      style={{ background: "rgba(75,191,191,0.18)" }}
                    />
                    {/* Ambient glow — amber top-right */}
                    <div
                      className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full"
                      style={{ background: "rgba(201,169,110,0.06)", filter: "blur(80px)" }}
                    />
                    {/* Ambient glow — teal bottom-left */}
                    <div
                      className="pointer-events-none absolute bottom-0 left-0 h-48 w-48 rounded-full"
                      style={{ background: "rgba(75,191,191,0.05)", filter: "blur(70px)" }}
                    />

                    {/* ── Drawer Header ── */}
                    <div
                      className="relative flex shrink-0 items-center justify-between px-5 pt-5 pb-4"
                      style={{ borderBottom: "1px solid rgba(75,191,191,0.08)" }}
                    >
                      {/* Logo mark */}
                      <div className="flex items-center gap-2.5">
                        <div
                          className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                          style={{
                            background: "linear-gradient(145deg, #C9A96E 0%, #A8783A 100%)",
                            boxShadow: "0 2px 12px rgba(201,169,110,0.30), inset 0 1px 2px rgba(255,255,255,0.25)",
                          }}
                        >
                          <div
                            className="h-3 w-3 rounded-full"
                            style={{ background: "#06090a", boxShadow: "inset 0 1px 3px rgba(0,0,0,0.7)" }}
                          />
                        </div>
                        <div className="flex flex-col leading-none">
                          <span
                            className="text-[8px] font-semibold uppercase tracking-[0.28em]"
                            style={{ color: "rgba(75,191,191,0.55)" }}
                          >
                            Study in
                          </span>
                          <span className="text-[13px] font-bold uppercase tracking-wide text-white">Bengaluru</span>
                        </div>
                      </div>

                      {/* Close button */}
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center justify-center rounded-full transition-colors"
                        style={{
                          width: 34,
                          height: 34,
                          background: "rgba(201,169,110,0.07)",
                          border: "1px solid rgba(201,169,110,0.15)",
                          color: "rgba(201,169,110,0.60)",
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.background = "rgba(201,169,110,0.14)";
                          e.currentTarget.style.color = "#C9A96E";
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background = "rgba(201,169,110,0.07)";
                          e.currentTarget.style.color = "rgba(201,169,110,0.60)";
                        }}
                      >
                        <X size={15} strokeWidth={2.5} />
                      </motion.button>
                    </div>

                    {/* ── Nav Links ── */}
                    <div className="relative z-10 flex min-h-0 flex-1 flex-col gap-1.5 overflow-y-auto px-3 py-3">
                      {menuLinks.map((link, i) => {
                        const isActive = currentPath === link.href;
                        return (
                          <motion.button
                            key={link.href}
                            initial={{ opacity: 0, x: 40 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.07 + 0.1, type: "spring", stiffness: 300, damping: 25 }}
                            onClick={(e) => handleNavigate(e, link.href)}
                            className="group relative flex items-center justify-between rounded-xl px-4 py-3 text-left transition-all duration-250"
                            style={{
                              background: isActive
                                ? "linear-gradient(135deg, rgba(201,169,110,0.13) 0%, rgba(201,169,110,0.05) 100%)"
                                : "rgba(255,255,255,0.02)",
                              border: isActive
                                ? "1px solid rgba(201,169,110,0.22)"
                                : "1px solid rgba(75,191,191,0.06)",
                              boxShadow: isActive
                                ? "inset 0 1px 0 rgba(201,169,110,0.12), 0 4px 16px rgba(0,0,0,0.25)"
                                : "none",
                            }}
                            onMouseEnter={e => {
                              if (!isActive) {
                                e.currentTarget.style.background = "rgba(75,191,191,0.05)";
                                e.currentTarget.style.border = "1px solid rgba(75,191,191,0.14)";
                              }
                            }}
                            onMouseLeave={e => {
                              if (!isActive) {
                                e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                                e.currentTarget.style.border = "1px solid rgba(75,191,191,0.06)";
                              }
                            }}
                          >
                            {/* Active corner brackets — amber */}
                            {isActive && (
                              <>
                                <div
                                  className="absolute left-2.5 top-2.5 h-1.5 w-1.5 border-l border-t"
                                  style={{ borderColor: "rgba(201,169,110,0.60)" }}
                                />
                                <div
                                  className="absolute bottom-2.5 right-2.5 h-1.5 w-1.5 border-b border-r"
                                  style={{ borderColor: "rgba(201,169,110,0.60)" }}
                                />
                              </>
                            )}

                            {/* Left: index pill + label */}
                            <div className="flex items-center gap-3">
                              {/* Index pill */}
                              <span
                                className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[9px] font-bold tabular-nums"
                                style={{
                                  background: isActive
                                    ? "rgba(201,169,110,0.18)"
                                    : "rgba(75,191,191,0.07)",
                                  color: isActive
                                    ? "#C9A96E"
                                    : "rgba(75,191,191,0.45)",
                                  border: isActive
                                    ? "1px solid rgba(201,169,110,0.28)"
                                    : "1px solid rgba(75,191,191,0.12)",
                                }}
                              >
                                0{i + 1}
                              </span>
                              {/* Label */}
                              <span
                                className="text-[0.95rem] font-bold uppercase tracking-wide transition-colors duration-200"
                                style={{
                                  color: isActive ? "#ffffff" : "rgba(255,255,255,0.38)",
                                  letterSpacing: "0.04em",
                                }}
                              >
                                {link.label}
                              </span>
                            </div>

                            {/* Right: icon */}
                            <link.icon
                              size={15}
                              strokeWidth={2}
                              style={{
                                color: isActive ? "#C9A96E" : "rgba(75,191,191,0.25)",
                                flexShrink: 0,
                              }}
                            />
                          </motion.button>
                        );
                      })}

                      {/* ── Divider ── */}
                      <div
                        className="my-1 h-px w-full"
                        style={{ background: "linear-gradient(90deg, transparent, rgba(201,169,110,0.12), transparent)" }}
                      />

                      {/* Apply CTA — amber gradient */}
                      <motion.button
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: menuLinks.length * 0.07 + 0.1, type: "spring", stiffness: 300, damping: 25 }}
                        onClick={(e) => handleNavigate(e, "/apply")}
                        className="relative flex items-center justify-center gap-2 overflow-hidden rounded-xl px-5 py-3 text-[11px] font-bold uppercase tracking-widest transition-all duration-200"
                        style={{
                          background: "linear-gradient(135deg, #C9A96E 0%, #A8783A 100%)",
                          boxShadow: "0 4px 20px rgba(201,169,110,0.22), inset 0 1px 0 rgba(255,255,255,0.18)",
                          color: "#06090a",
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.boxShadow = "0 4px 28px rgba(201,169,110,0.38), inset 0 1px 0 rgba(255,255,255,0.18)";
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.boxShadow = "0 4px 20px rgba(201,169,110,0.22), inset 0 1px 0 rgba(255,255,255,0.18)";
                        }}
                      >
                        <span
                          aria-hidden
                          className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-xl"
                          style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0.18), transparent)" }}
                        />
                        <span className="relative z-10">Apply Now</span>
                        <Sparkles size={12} className="relative z-10 opacity-70" />
                      </motion.button>

                      <ChatButton theme={activeTheme} variant="mobile" />
                    </div>

                    {/* ── Drawer Footer ── */}
                    <div
                      className="relative shrink-0 px-5 py-3.5"
                      style={{ borderTop: "1px solid rgba(75,191,191,0.07)" }}
                    >
                      <p
                        className="text-center text-[8px] font-black uppercase tracking-[0.35em]"
                        style={{ color: "rgba(75,191,191,0.22)" }}
                      >
                        Study in Bengaluru · v2.04
                      </p>
                      <div className="mt-2.5 flex justify-center gap-3">
                        {[0, 75, 150].map((delay) => (
                          <div
                            key={delay}
                            className="h-1 w-1 rounded-full animate-pulse"
                            style={{
                              animationDelay: `${delay}ms`,
                              background: delay === 0 ? "#C9A96E" : delay === 75 ? "#4BBFBF" : "rgba(255,255,255,0.20)",
                              opacity: 0.5,
                            }}
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