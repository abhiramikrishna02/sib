import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

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

  const active = currentPath === "/" ? "home" : currentPath.replace("/", "");
  const theme = useMemo(() => themes[active] ?? themes.home, [active]);

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
    if (onNavigate) {
      onNavigate(to);
      return;
    }

    window.location.href = to;
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4 sm:pt-4">
      <motion.div
        className="mx-auto w-[min(1220px,calc(100%-0.75rem))] rounded-[1.8rem] p-[1px]"
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

          <div className="relative flex min-h-[5rem] items-center justify-between gap-4 px-4 py-3 sm:px-5">
            <a
              className="group inline-flex items-center gap-3 select-none"
              href="/"
              aria-label="SIB home"
              onClick={(event) => handleNavigate(event, "/")}
            >
              <motion.span
                className="grid h-11 w-11 place-items-center rounded-[1rem] text-white font-black shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
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
                <strong className="text-[1.02rem] font-semibold tracking-[0.08em] text-white">
                  SIB
                </strong>
                <small className="text-[0.78rem] text-white/58">
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

            <nav className="md:hidden w-full" aria-label="Primary mobile">
              <div className="flex items-center gap-2 overflow-x-auto rounded-full border border-white/10 bg-white/5 p-1.5">
                {links.map((link) => {
                  const isActive = currentPath === link.href;

                  return (
                    <motion.a
                      key={link.href}
                      href={link.href}
                      onClick={(event) => handleNavigate(event, link.href)}
                      className="relative isolate flex min-w-[6.8rem] items-center justify-center overflow-hidden rounded-full px-4 py-2.5 text-sm font-semibold tracking-[0.03em] transition-colors duration-200"
                      whileTap={{ scale: 0.96 }}
                      style={{
                        color: isActive ? theme.text : "rgba(255,255,255,0.62)",
                      }}
                    >
                      <AnimatePresence mode="wait" initial={false}>
                        {isActive && (
                          <motion.span
                            key={active}
                            className="absolute inset-0 rounded-full"
                            style={{
                              background: `linear-gradient(135deg, ${theme.from}, ${theme.via} 55%, ${theme.to})`,
                              boxShadow: `0 10px 28px ${theme.glow}`,
                            }}
                            initial={{ opacity: 0, scale: 0.72, y: 10, rotate: -7 }}
                            animate={{
                              opacity: 1,
                              scale: [0.72, 1.14, 0.95, 1],
                              y: [10, -3, 1, 0],
                              rotate: [-7, 3, -1, 0],
                            }}
                            exit={{ opacity: 0, scale: 0.92 }}
                            transition={{ duration: 0.72, ease: "easeOut" }}
                          />
                        )}
                      </AnimatePresence>

                      <span className="relative z-10">{link.label}</span>
                    </motion.a>
                  );
                })}
              </div>
            </nav>
          </div>
        </div>
      </motion.div>
    </header>
  );
}

export default Navbar;
