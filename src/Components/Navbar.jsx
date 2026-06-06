import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import Menu from "./Menu.jsx";
import ChatButton from "./ChatButton.jsx";

/* ── Menu Items Configuration ───────────────────────────────────────────── */
const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Contact", href: "/contact" },
];

/* ── GooeyNav Sub-Component ─────────────────────────────────────────────── */
const GooeyNav = ({
  items,
  onNavigate,
  currentPath,
  animationTime = 600,
  particleCount = 15,
  particleDistances = [90, 10],
  particleR = 100,
  timeVariance = 300,
  colors = [1, 2, 3, 1, 2, 3, 1, 4]
}) => {
  const containerRef = useRef(null);
  const navRef = useRef(null);
  const filterRef = useRef(null);
  const textRef = useRef(null);

  const initialIndex = Math.max(0, items.findIndex(item => item.href === currentPath));
  const [activeIndex, setActiveIndex] = useState(initialIndex);

  useEffect(() => {
    const newIndex = items.findIndex(item => item.href === currentPath);
    if (newIndex !== -1 && newIndex !== activeIndex) {
      setActiveIndex(newIndex);
    }
  }, [currentPath, items]);

  const noise = (n = 1) => n / 2 - Math.random() * n;
  const getXY = (distance, pointIndex, totalPoints) => {
    const angle = ((360 + noise(8)) / totalPoints) * pointIndex * (Math.PI / 180);
    return [distance * Math.cos(angle), distance * Math.sin(angle)];
  };

  const createParticle = (i, t, d, r) => {
    let rotate = noise(r / 10);
    return {
      start: getXY(d[0], particleCount - i, particleCount),
      end: getXY(d[1] + noise(7), particleCount - i, particleCount),
      time: t,
      scale: 1 + noise(0.2),
      color: colors[Math.floor(Math.random() * colors.length)],
      rotate: rotate > 0 ? (rotate + r / 20) * 10 : (rotate - r / 20) * 10
    };
  };

  const makeParticles = element => {
    const d = particleDistances;
    const r = particleR;
    const bubbleTime = animationTime * 2 + timeVariance;
    element.style.setProperty('--time', `${bubbleTime}ms`);
    for (let i = 0; i < particleCount; i++) {
      const t = animationTime * 2 + noise(timeVariance * 2);
      const p = createParticle(i, t, d, r);
      element.classList.remove('active');
      setTimeout(() => {
        const particle = document.createElement('span');
        const point = document.createElement('span');
        particle.classList.add('particle');
        particle.style.setProperty('--start-x', `${p.start[0]}px`);
        particle.style.setProperty('--start-y', `${p.start[1]}px`);
        particle.style.setProperty('--end-x', `${p.end[0]}px`);
        particle.style.setProperty('--end-y', `${p.end[1]}px`);
        particle.style.setProperty('--time', `${p.time}ms`);
        particle.style.setProperty('--scale', `${p.scale}`);
        particle.style.setProperty('--color', `var(--color-${p.color}, white)`);
        particle.style.setProperty('--rotate', `${p.rotate}deg`);
        point.classList.add('point');
        particle.appendChild(point);
        element.appendChild(particle);
        requestAnimationFrame(() => { element.classList.add('active'); });
        setTimeout(() => {
          try { element.removeChild(particle); } catch { }
        }, t);
      }, 30);
    }
  };

  const updateEffectPosition = element => {
    if (!containerRef.current || !filterRef.current || !textRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const pos = element.getBoundingClientRect();
    const styles = {
      left: `${pos.x - containerRect.x}px`,
      top: `${pos.y - containerRect.y}px`,
      width: `${pos.width}px`,
      height: `${pos.height}px`
    };
    Object.assign(filterRef.current.style, styles);
    Object.assign(textRef.current.style, styles);
    textRef.current.innerText = element.innerText;
  };

  const handleClick = (e, index, href) => {
    e.preventDefault();
    if (onNavigate) onNavigate(href);
    else window.location.href = href;

    const liEl = e.currentTarget.parentElement;
    if (activeIndex === index) return;

    setActiveIndex(index);
    updateEffectPosition(liEl);
    if (filterRef.current) {
      const particles = filterRef.current.querySelectorAll('.particle');
      particles.forEach(p => filterRef.current.removeChild(p));
    }
    if (textRef.current) {
      textRef.current.classList.remove('active');
      void textRef.current.offsetWidth;
      textRef.current.classList.add('active');
    }
    if (filterRef.current) {
      makeParticles(filterRef.current);
    }
  };

  useEffect(() => {
    if (!navRef.current || !containerRef.current) return;
    const activeLi = navRef.current.querySelectorAll('li')[activeIndex];
    if (activeLi) {
      updateEffectPosition(activeLi);
      textRef.current?.classList.add('active');
    }
    const resizeObserver = new ResizeObserver(() => {
      const currentActiveLi = navRef.current?.querySelectorAll('li')[activeIndex];
      if (currentActiveLi) updateEffectPosition(currentActiveLi);
    });
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [activeIndex]);

  return (
    <div className="relative" ref={containerRef}>
      {/* Hidden SVG filter — no visual output, just defines the gooey filter */}
      <svg width="0" height="0" style={{ position: 'absolute', pointerEvents: 'none' }}>
        <defs>
          <filter id="gooey-filter">
            <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="blur" />
            <feColorMatrix in="blur" mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -8"
              result="gooey" />
            <feComposite in="SourceGraphic" in2="gooey" operator="atop" />
          </filter>
        </defs>
      </svg>

      <nav className="flex relative" style={{ transform: 'translate3d(0,0,0.01px)' }}>
        <ul
          ref={navRef}
          className="flex gap-1 sm:gap-4 list-none p-0 m-0 relative z-[3]"
          style={{ color: 'white', textShadow: '0 1px 1px rgba(0,0,0,0.2)' }}
        >
          {items.map((item, index) => (
            <li
              key={index}
              className={`rounded-full relative cursor-pointer transition-[background-color_color_box-shadow] duration-300 ease text-white ${activeIndex === index ? 'active' : ''}`}
            >
              <a
                onClick={e => handleClick(e, index, item.href)}
                href={item.href}
                className="outline-none py-1.5 px-2.5 sm:px-4 text-[11px] sm:text-[13px] font-bold uppercase tracking-wider inline-block"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Filter effect — uses SVG filter instead of mix-blend-mode + black backdrop */}
      <span
        className="effect filter"
        ref={filterRef}
        style={{ filter: 'url(#gooey-filter)' }}
      />
      <span className="effect text" ref={textRef} />
    </div>
  );
};

/* ── Main Navbar Component ──────────────────────────────────────────────── */
function Navbar({ currentPath = "/", onNavigate, onApplyClick }) {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScrollYRef = useRef(0);
  const tickingRef = useRef(false);
  const scrolledRef = useRef(false);
  const hiddenRef = useRef(false);

  useEffect(() => {
    const update = () => {
      const latest = window.scrollY || 0;
      const previous = lastScrollYRef.current;
      const nextHidden = latest > previous && latest > 150;
      const nextScrolled = latest > 20;

      if (nextHidden !== hiddenRef.current) {
        hiddenRef.current = nextHidden;
        setHidden(nextHidden);
      }

      if (nextScrolled !== scrolledRef.current) {
        scrolledRef.current = nextScrolled;
        setScrolled(nextScrolled);
      }

      lastScrollYRef.current = Math.max(latest, 0);
      tickingRef.current = false;
    };

    const onScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;
      requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogoClick = useCallback((e) => {
    e.preventDefault();
    if (onNavigate) onNavigate("/");
    else window.location.href = "/";
  }, [onNavigate]);

  return (
    <motion.header
      animate={hidden ? "hidden" : "visible"}
      variants={{ visible: { y: 0, opacity: 1 }, hidden: { y: "-110%", opacity: 0 } }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-0 z-[100] px-4 pt-3 sm:px-8 sm:pt-5"
    >
      <style>{`
        :root {
          --linear-ease: linear(0, 0.068, 0.19 2.7%, 0.804 8.1%, 1.037, 1.199 13.2%, 1.245, 1.27 15.8%, 1.274, 1.272 17.4%, 1.249 19.1%, 0.996 28%, 0.949, 0.928 33.3%, 0.926, 0.933 36.8%, 1.001 45.6%, 1.013, 1.019 50.8%, 1.018 54.4%, 1 63.1%, 0.995 68%, 1.001 85%, 1);
        }

        /* ── Effect base ── */
        .effect {
          position: absolute;
          opacity: 1;
          pointer-events: none;
          display: grid;
          place-items: center;
          z-index: 1;
        }

        /* ── Text overlay ── */
        .effect.text {
          color: white;
          transition: color 0.3s ease;
          font-size: 13px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        @media (max-width: 640px) { .effect.text { font-size: 11px; } }
        .effect.text.active { color: black; }

        /* ── Gooey pill filter layer — NO ::before black bleed ── */
        .effect.filter::after {
          content: "";
          position: absolute;
          inset: 0;
          background: white;
          transform: scale(0);
          opacity: 0;
          z-index: -1;
          border-radius: 9999px;
        }
        .effect.active::after { animation: pill 0.3s ease both; }
        @keyframes pill { to { transform: scale(1); opacity: 1; } }

        /* ── Particles ── */
        .particle, .point {
          display: block;
          opacity: 0;
          width: 20px;
          height: 20px;
          border-radius: 9999px;
          transform-origin: center;
        }
        .particle {
          --time: 5s;
          position: absolute;
          top: calc(50% - 10px);
          left: calc(50% - 10px);
          animation: particle calc(var(--time)) ease 1 -350ms;
        }
        .point {
          background: var(--color, white);
          opacity: 1;
          animation: point calc(var(--time)) ease 1 -350ms;
        }
        @keyframes particle {
          0%   { transform: rotate(0deg) translate(var(--start-x), var(--start-y)); opacity: 1; animation-timing-function: cubic-bezier(0.55,0,1,0.45); }
          70%  { transform: rotate(calc(var(--rotate)*0.5)) translate(calc(var(--end-x)*1.2), calc(var(--end-y)*1.2)); opacity: 1; animation-timing-function: ease; }
          85%  { transform: rotate(calc(var(--rotate)*0.66)) translate(var(--end-x), var(--end-y)); opacity: 1; }
          100% { transform: rotate(calc(var(--rotate)*1.2)) translate(calc(var(--end-x)*0.5), calc(var(--end-y)*0.5)); opacity: 1; }
        }
        @keyframes point {
          0%   { transform: scale(0); opacity: 0; animation-timing-function: cubic-bezier(0.55,0,1,0.45); }
          25%  { transform: scale(calc(var(--scale)*0.25)); }
          38%  { opacity: 1; }
          65%  { transform: scale(var(--scale)); opacity: 1; animation-timing-function: ease; }
          85%  { transform: scale(var(--scale)); opacity: 1; }
          100% { transform: scale(0); opacity: 0; }
        }

        /* ── Active nav item ── */
        li.active { color: black; text-shadow: none; }
        li.active::after { opacity: 1; transform: scale(1); }
        li::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 9999px;
          background: white;
          opacity: 0;
          transform: scale(0);
          transition: all 0.3s ease;
          z-index: -1;
        }
      `}</style>

      <div className="mx-auto max-w-6xl">
        <motion.nav
          animate={{
            scale: scrolled ? 0.985 : 1,
          }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative flex items-center justify-between rounded-full px-5 py-3"
          style={{
            background: "linear-gradient(160deg, #1a1a1a 0%, #080808 60%, #111111 100%)",
            border: "1px solid rgba(255,255,255,0.09)",
            boxShadow: scrolled
              ? "0 2px 24px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.07)"
              : "0 8px 40px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.10)",
          }}
        >
          {/* Logo */}
          <a href="/" onClick={handleLogoClick} className="group relative z-10 flex items-center gap-2.5 transition-opacity hover:opacity-75">
            <div
              className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
              style={{ background: "linear-gradient(145deg, #ffffff 0%, #d4d4d4 100%)", boxShadow: "0 2px 8px rgba(0,0,0,0.40), inset 0 1px 2px rgba(255,255,255,0.80)" }}
            >
              <div className="h-3 w-3 rounded-full" style={{ background: "linear-gradient(145deg, #111 0%, #333 100%)", boxShadow: "inset 0 1px 3px rgba(0,0,0,0.6)" }} />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-[8px] font-semibold uppercase tracking-[0.28em] text-white/45">Study in</span>
              <span className="text-[13px] font-bold uppercase tracking-wide text-white">Bengaluru</span>
            </div>
          </a>

          {/* Desktop: GooeyNav — hidden on mobile */}
          <div className="relative z-10 hidden sm:block">
            <GooeyNav items={NAV_ITEMS} onNavigate={onNavigate} currentPath={currentPath} />
          </div>

          {/* Desktop: Chat + Apply — hidden on mobile */}
          <div className="relative z-10 hidden items-center gap-3 sm:flex">
            <ChatButton />
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              onClick={() => onApplyClick ? onApplyClick() : (window.location.href = "/apply")}
              className="relative flex items-center gap-1.5 overflow-hidden rounded-full px-5 py-2 sm:px-6 text-[11px] font-bold uppercase tracking-widest text-black"
              style={{ background: "linear-gradient(160deg, #ffffff 0%, #e0e0e0 100%)", boxShadow: "0 2px 12px rgba(255,255,255,0.12), inset 0 1px 0 rgba(255,255,255,0.90)" }}
            >
              <span
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-full"
                style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0.55), transparent)" }}
              />
              <span className="relative z-10">Apply</span>
              <Sparkles size={12} className="relative z-10 opacity-60" />
            </motion.button>
          </div>

          {/* Mobile: Menu toggle — only visible on mobile */}
          <div className="relative z-10 sm:hidden">
            <Menu currentPath={currentPath} onNavigate={onNavigate} />
          </div>
        </motion.nav>
      </div>
    </motion.header>
  );
}

export default Navbar;
