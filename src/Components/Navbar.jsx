import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/contact", label: "Contact" },
];

const themes = {
  home: {
    from: "#7b2cbf",
    via: "#a855f7",
    to: "#1e0338",
    glow: "rgba(123, 44, 191, 0.38)",
    text: "#ffffff",
  },
  about: {
    from: "#7b2cbf",
    via: "#a855f7",
    to: "#1e0338",
    glow: "rgba(123, 44, 191, 0.38)",
    text: "#ffffff",
  },
  services: {
    from: "#7b2cbf",
    via: "#a855f7",
    to: "#1e0338",
    glow: "rgba(123, 44, 191, 0.38)",
    text: "#ffffff",
  },
  contact: {
    from: "#7b2cbf",
    via: "#a855f7",
    to: "#1e0338",
    glow: "rgba(123, 44, 191, 0.38)",
    text: "#ffffff",
  },
};

function Navbar({ currentPath = "/", onNavigate }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const active = currentPath === "/" ? "home" : currentPath.replace("/", "");
  const theme = useMemo(() => themes[active] ?? themes.home, [active]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [currentPath]);

  useEffect(() => {
    if (typeof document === "undefined") return undefined;
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 16);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const handleNavigate = (event, to) => {
    event.preventDefault();
    setMobileMenuOpen(false);
    if (onNavigate) {
      onNavigate(to);
      return;
    }

    window.location.href = to;
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-2 pt-2 sm:px-3 sm:pt-3 md:px-4 md:pt-4">
      <motion.div
        className="mx-auto w-[min(1220px,calc(100%-0.5rem))] rounded-[1.45rem] p-[1px] sm:w-[min(1220px,calc(100%-0.75rem))] sm:rounded-[1.8rem]"
        style={{
          background:
            "linear-gradient(90deg, rgba(255,255,255,0.08), rgba(255,255,255,0.22), rgba(34,211,238,0.22), rgba(255,255,255,0.12), rgba(255,255,255,0.08))",
          backgroundSize: "240% 240%",
        }}
        animate={{ backgroundPositionX: ["0%", "100%", "0%"] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      >
        <div
          className={[
            "relative overflow-hidden rounded-[1.75rem] border backdrop-blur-2xl",
            "transition-all duration-300 ease-out",
            scrolled
              ? "border-white/12 bg-[#1b0a21]/82 shadow-[0_22px_70px_rgba(0,0,0,0.5)]"
              : "border-white/10 bg-[#1b0a21]/68 shadow-[0_16px_48px_rgba(0,0,0,0.35)]",
          ].join(" ")}
        >
          <motion.div
            aria-hidden="true"
            className="absolute inset-0 opacity-60"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.05) 18%, rgba(255,255,255,0.14) 50%, rgba(255,255,255,0.05) 82%, transparent 100%)",
              backgroundSize: "220% 100%",
            }}
            animate={{ backgroundPositionX: ["0%", "100%"] }}
            transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
          />

          <motion.div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-px opacity-80"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.55), rgba(103,232,249,0.7), rgba(255,255,255,0.55), transparent)",
              backgroundSize: "200% 100%",
            }}
            animate={{ backgroundPositionX: ["0%", "100%", "0%"] }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          />

          <div className="relative flex min-h-[4.5rem] flex-wrap items-center justify-between gap-3 px-3 py-2.5 sm:min-h-[5rem] sm:gap-4 sm:px-4 sm:py-3 md:px-5">
            <a
              className="group inline-flex select-none items-center gap-2 sm:gap-3"
              href="/"
              aria-label="SIB home"
              onClick={(event) => handleNavigate(event, "/")}
            >
              <motion.span
                className="grid h-9 w-9 place-items-center rounded-[0.85rem] font-black text-white shadow-[0_10px_30px_rgba(0,0,0,0.35)] sm:h-11 sm:w-11 sm:rounded-[1rem]"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(123,44,191,1) 0%, rgba(168,85,247,1) 50%, rgba(30,3,56,1) 100%)",
                }}
                whileHover={{ scale: 1.06, rotate: -3 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 500, damping: 22 }}
              >
                S
              </motion.span>

              <span className="grid leading-tight">
                <strong className="text-[0.92rem] font-semibold tracking-[0.08em] text-white sm:text-[1.02rem]">
                  SIB
                </strong>
                <small className="hidden text-[0.78rem] text-white/58 sm:block">
                  Simple React website
                </small>
              </span>
            </a>

            <nav className="hidden md:block" aria-label="Primary">
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                {links.map((link) => {
                  const isActive = currentPath === link.href;

                  return (
                    <motion.a
                      key={link.href}
                      href={link.href}
                      onClick={(event) => handleNavigate(event, link.href)}
                      className="relative isolate flex min-w-[7rem] items-center justify-center overflow-hidden rounded-full px-5 py-3 font-semibold tracking-[0.04em] transition-colors duration-200"
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.96 }}
                      style={{
                        color: isActive ? theme.text : "rgba(255,255,255,0.62)",
                        textShadow: isActive
                          ? "0 0 18px rgba(255,255,255,0.14)"
                          : "none",
                      }}
                    >
                      <AnimatePresence mode="wait" initial={false}>
                        {isActive && (
                          <motion.span
                            key={active}
                            className="absolute inset-0 rounded-full"
                            style={{
                              background: `linear-gradient(135deg, ${theme.from}, ${theme.via} 55%, ${theme.to})`,
                              boxShadow: `0 10px 30px ${theme.glow}`,
                            }}
                            initial={{ opacity: 0, scale: 0.72, y: 10, rotate: -7 }}
                            animate={{
                              opacity: 1,
                              scale: [0.72, 1.16, 0.95, 1],
                              y: [10, -3, 1, 0],
                              rotate: [-7, 3, -1, 0],
                            }}
                            exit={{ opacity: 0, scale: 0.92 }}
                            transition={{
                              duration: 0.72,
                              ease: "easeOut",
                              times: [0, 0.35, 0.68, 1],
                            }}
                          />
                        )}
                      </AnimatePresence>

                      <span className="relative z-10">{link.label}</span>
                    </motion.a>
                  );
                })}
              </div>
            </nav>

            <div className="md:hidden">
              <motion.button
                type="button"
                onClick={() => setMobileMenuOpen((open) => !open)}
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileMenuOpen}
                className="grid h-11 w-11 place-items-center rounded-[1rem] border border-white/10 bg-white/5 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                whileTap={{ scale: 0.94 }}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </motion.button>
            </div>
          </div>

          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                className="fixed inset-0 z-40 md:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <button
                  type="button"
                  aria-label="Close menu overlay"
                  className="absolute inset-0 bg-black/55 backdrop-blur-sm"
                  onClick={() => setMobileMenuOpen(false)}
                />

                <motion.div
                  className="absolute left-3 right-3 top-[5.4rem] overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#1b0a21]/96 shadow-[0_24px_70px_rgba(0,0,0,0.45)] backdrop-blur-2xl"
                  initial={{ y: -16, opacity: 0, scale: 0.98 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ y: -10, opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.24, ease: "easeOut" }}
                >
                  <div className="border-b border-white/10 px-4 py-4">
                    <p className="text-[0.68rem] font-bold uppercase tracking-[0.45em] text-white/40">
                      Menu
                    </p>
                  </div>
                  <div className="grid gap-2 p-3">
                    {links.map((link) => {
                      const isActive = currentPath === link.href;

                      return (
                        <motion.a
                          key={link.href}
                          href={link.href}
                          onClick={(event) => handleNavigate(event, link.href)}
                          className="relative isolate flex items-center justify-center overflow-hidden rounded-[1rem] px-4 py-4 text-sm font-semibold tracking-[0.04em]"
                          whileTap={{ scale: 0.98 }}
                          style={{
                            color: isActive ? theme.text : "rgba(255,255,255,0.78)",
                          }}
                        >
                          <AnimatePresence mode="wait" initial={false}>
                            {isActive && (
                              <motion.span
                                key={active}
                                className="absolute inset-0 rounded-[1rem]"
                                style={{
                                  background: `linear-gradient(135deg, ${theme.from}, ${theme.via} 55%, ${theme.to})`,
                                  boxShadow: `0 10px 28px ${theme.glow}`,
                                }}
                                initial={{ opacity: 0, scale: 0.88 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.94 }}
                                transition={{ duration: 0.28, ease: "easeOut" }}
                              />
                            )}
                          </AnimatePresence>

                          <span className="relative z-10">{link.label}</span>
                        </motion.a>
                      );
                    })}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </header>
  );
}

export default Navbar;
