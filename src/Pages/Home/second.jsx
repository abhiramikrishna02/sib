import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ─── pill grid config ─────────────────────────────────────────────────────────
const COLS = [
  { speed: 0.55, offset:   0 },
  { speed: 0.90, offset: -48 },
  { speed: 0.50, offset:   0 },
  { speed: 1.00, offset: -48 },
  { speed: 0.60, offset:   0 },
  { speed: 0.85, offset: -48 },
];
const PILLS = 5;

// ─── badge pill geometry ──────────────────────────────────────────────────────
const BW = 160, BH = 260, BR = 74, BCX = 80, BCY = 130;
const BADGE_PATH =
  `M${BCX},${BCY - BH / 2 + BR}` +
  ` A${BR},${BR} 0 0 1 ${BCX + BR},${BCY - BH / 2 + 2 * BR}` +
  ` L${BCX + BR},${BCY + BH / 2 - 2 * BR}` +
  ` A${BR},${BR} 0 0 1 ${BCX},${BCY + BH / 2 - BR}` +
  ` A${BR},${BR} 0 0 1 ${BCX - BR},${BCY + BH / 2 - 2 * BR}` +
  ` L${BCX - BR},${BCY - BH / 2 + 2 * BR}` +
  ` A${BR},${BR} 0 0 1 ${BCX},${BCY - BH / 2 + BR} Z`;

// ─── slide data ───────────────────────────────────────────────────────────────
const SLIDES = [
  {
    num: "01", title: "Admissions\nGuidance", subtitle: "Your First Step",
    dark: true, icon: "✦",
    items: [
      "College Selection: Personalised shortlist from 500+ partner institutions",
      "Application Support: End-to-end help from forms to submission",
      "Document Preparation: Verified checklists for every programme",
      "Deadline Tracking: Never miss a cutoff with our reminders",
    ],
    quote: null,
  },
  {
    num: "02", title: "Career\nCounselling", subtitle: "Shape Your Future",
    dark: true, icon: "❋",
    items: [
      "Aptitude Mapping: Discover the right stream for your strengths",
      "Industry Insights: Real data on Bengaluru's top hiring sectors",
      "Course Matching: Align your degree with your career goals",
      "1-on-1 Sessions: Free personalised counselling with experts",
    ],
  },
  {
    num: "03", title: "Top University\nAccess", subtitle: "Premier Institutions",
    dark: false, icon: "✿",
    items: [
      "500+ Partner Colleges: Bengaluru's widest institutional network",
      "UG, PG & Doctoral: Every level of education under one portal",
      "Engineering & Tech: Premier colleges in India's Silicon Valley",
      "Medical & Sciences: Top-ranked life-science programmes",
    ],
    quote: null,
  },
  {
    num: "04", title: "Internships\n& Jobs", subtitle: "Career Launchpad",
    dark: true, icon: "⬡",
    items: [
      "Part-time Jobs: Verified listings near your campus",
      "Internship Placements: Connections with Bengaluru's top startups",
      "MNC Tie-ups: Direct referrals to multinational hiring teams",
      "Resume & Interview Prep: Stand out in a competitive market",
    ],
    quote: null,
  },
  {
    num: "05", title: "Student\nLifestyle", subtitle: "Settle In. Thrive.",
    dark: false, icon: "◈",
    items: [
      "Accommodation Finder: PGs & hostels near your college",
      "City Orientation: Navigate Bengaluru like a local from day one",
      "Community Events: Network with students across the city",
      "Ongoing Support: We don't disappear after admission",
    ],
  },
];

// ─── stat cards ───────────────────────────────────────────────────────────────
const STATS = [
  {
    num: "01", stat: "500+", unit: "Partner", label: "Colleges",
    desc: "Bengaluru's widest network of accredited universities, colleges, and institutes across all disciplines.",
    art: "diagonal", dark: true,
  },
  {
    num: "02", stat: "98%", unit: "Admission", label: "Success",
    desc: "Nearly every student who applies through our platform secures a seat at their preferred institution.",
    art: "parallel", dark: false,
  },
  {
    num: "03", stat: "10K+", unit: "Students", label: "Enrolled",
    desc: "Over ten thousand students have built their futures in Bengaluru with our end-to-end guidance.",
    art: "sunburst", dark: true,
  },
];

// ─── particle canvas ──────────────────────────────────────────────────────────
const SYMS = ["✦", "◈", "❋", "⬡", "✿", "◆"];
function Particles({ icon, dark }) {
  const ref = useRef(null);
  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    // CHANGED: dark cards use cyan glow, light cards use magenta glow
    const color = dark ? "rgba(0,207,255,0.22)" : "rgba(224,64,251,0.18)";
    const resize = () => { cv.width = cv.offsetWidth || 400; cv.height = cv.offsetHeight || 500; };
    const ro = new ResizeObserver(resize);
    ro.observe(cv);
    resize();
    const mk = () => ({
      x: Math.random() * cv.width, y: -30 - Math.random() * 60,
      sym: icon || SYMS[Math.floor(Math.random() * SYMS.length)],
      sz: 12 + Math.random() * 14, spd: 0.35 + Math.random() * 0.8,
      dx: (Math.random() - 0.5) * 0.35,
      rot: Math.random() * Math.PI * 2, drot: (Math.random() - 0.5) * 0.02,
      a: 0.1 + Math.random() * 0.2,
    });
    let ps = Array.from({ length: 12 }, () => { const p = mk(); p.y = Math.random() * (cv.height + 60) - 30; return p; });
    let raf;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      ctx.clearRect(0, 0, cv.width, cv.height);
      if (Math.random() < 0.04 && ps.length < 18) ps.push(mk());
      ps = ps.filter((p) => {
        p.y += p.spd; p.x += p.dx; p.rot += p.drot;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
        ctx.globalAlpha = p.a; ctx.font = `${p.sz}px sans-serif`;
        ctx.fillStyle = color; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(p.sym, 0, 0); ctx.restore();
        return p.y < cv.height + 40;
      });
      while (ps.length < 8) ps.push(mk());
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [icon, dark]);
  return <canvas ref={ref} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 1 }} />;
}

// ─── SVG art ──────────────────────────────────────────────────────────────────
function CardArt({ type, dark }) {
  // CHANGED: dark cards use cyan strokes, light cards use gold strokes
  const s  = dark ? "rgba(0,207,255,0.30)" : "rgba(255,179,0,0.28)";
  const st = dark ? "rgba(0,207,255,0.14)" : "rgba(255,179,0,0.14)";
  if (type === "diagonal") {
    return (
      <svg viewBox="0 0 240 240" style={{ width: "100%", height: "100%", overflow: "visible" }}>
        {Array.from({ length: 22 }, (_, i) => (
          <line key={i} x1={220 - Math.min(180, 30 + i * 7)} y1={20 + i * 9} x2={220} y2={20 + i * 9} stroke={s} strokeWidth="1" />
        ))}
        {/* CHANGED: divider line uses card bg color */}
        <line x1="60"  y1="20"  x2="240" y2="240" stroke={dark ? "#03101e" : "#0e0318"} strokeWidth="10" />
        <line x1="62"  y1="20"  x2="242" y2="240" stroke={s} strokeWidth="1.5" />
      </svg>
    );
  }
  if (type === "parallel") {
    return (
      <svg viewBox="0 0 340 240" style={{ width: "100%", height: "100%", overflow: "visible" }}>
        {Array.from({ length: 20 }, (_, i) => {
          const len = 80 + i * 6;
          return <line key={i} x1={40 + i * 11} y1={220} x2={40 + i * 11 + len * 0.55} y2={220 - len} stroke={s} strokeWidth="1" />;
        })}
      </svg>
    );
  }
  if (type === "sunburst") {
    const cx = 120, cy = 120, r1 = 38, r2 = 115;
    return (
      <svg viewBox="0 0 240 240" style={{ width: "100%", height: "100%", overflow: "visible" }}>
        <circle cx={cx} cy={cy} r={r1 - 2} fill="none" stroke={st} strokeWidth="1" />
        <circle cx={cx} cy={cy} r={r2 + 8} fill="none" stroke={st} strokeWidth=".5" />
        {Array.from({ length: 48 }, (_, i) => {
          const a = (i / 48) * Math.PI * 2;
          const r = i % 3 === 0 ? r2 : i % 2 === 0 ? r2 * 0.78 : r2 * 0.6;
          return <line key={i} x1={cx + Math.cos(a) * r1} y1={cy + Math.sin(a) * r1} x2={cx + Math.cos(a) * r} y2={cy + Math.sin(a) * r} stroke={s} strokeWidth="1" />;
        })}
      </svg>
    );
  }
  return null;
}

// ─── slide card ───────────────────────────────────────────────────────────────
// CHANGED: each dark/light card now uses accent-tinted dark backgrounds instead of #1a1a1a / #f0eeea
const SLIDE_THEMES = [
  // 01 Admissions — deep navy + cyan
  { bg: "#02101e", fg: "#e0f7ff", sub: "rgba(0,207,255,0.45)", hr: "rgba(0,207,255,0.18)", itC: "rgba(200,240,255,0.80)", numC: "rgba(0,207,255,0.08)", icC: "rgba(0,207,255,0.40)", hoverShadow: "0 20px 60px rgba(0,207,255,0.18)" },
  // 02 Career — deep purple + magenta
  { bg: "#0d0218", fg: "#f5e0ff", sub: "rgba(224,64,251,0.50)", hr: "rgba(224,64,251,0.18)", itC: "rgba(240,200,255,0.80)", numC: "rgba(224,64,251,0.08)", icC: "rgba(224,64,251,0.40)", hoverShadow: "0 20px 60px rgba(224,64,251,0.18)" },
  // 03 University — deep teal (light card)
  { bg: "#001810", fg: "#d0fff0", sub: "rgba(0,229,160,0.55)", hr: "rgba(0,229,160,0.20)", itC: "rgba(180,255,230,0.80)", numC: "rgba(0,229,160,0.08)", icC: "rgba(0,229,160,0.42)", hoverShadow: "0 20px 60px rgba(0,229,160,0.18)" },
  // 04 Jobs — deep gold-black
  { bg: "#120900", fg: "#fff5d0", sub: "rgba(255,179,0,0.50)", hr: "rgba(255,179,0,0.18)", itC: "rgba(255,235,160,0.80)", numC: "rgba(255,179,0,0.08)", icC: "rgba(255,179,0,0.40)", hoverShadow: "0 20px 60px rgba(255,179,0,0.18)" },
  // 05 Lifestyle — deep pink-black (light card)
  { bg: "#160010", fg: "#ffe0f5", sub: "rgba(240,98,146,0.55)", hr: "rgba(240,98,146,0.20)", itC: "rgba(255,200,230,0.80)", numC: "rgba(240,98,146,0.08)", icC: "rgba(240,98,146,0.42)", hoverShadow: "0 20px 60px rgba(240,98,146,0.18)" },
];

const STAT_THEMES = [
  // 01 500+ Partner Colleges — deep navy + cyan
  { bg: "#02101e", fg: "#e0f7ff", muted: "rgba(0,207,255,0.50)", numC: "rgba(0,207,255,0.10)", hr: "rgba(0,207,255,0.16)", hoverShadow: "0 24px 64px rgba(0,207,255,0.20)" },
  // 02 98% Success — deep teal (lighter feel)
  { bg: "#001810", fg: "#d0fff0", muted: "rgba(0,229,160,0.55)", numC: "rgba(0,229,160,0.10)", hr: "rgba(0,229,160,0.18)", hoverShadow: "0 24px 64px rgba(0,229,160,0.20)" },
  // 03 10K+ Students — deep purple
  { bg: "#0d0218", fg: "#f5e0ff", muted: "rgba(179,157,219,0.55)", numC: "rgba(179,157,219,0.10)", hr: "rgba(179,157,219,0.18)", hoverShadow: "0 24px 64px rgba(179,157,219,0.20)" },
];

function SlideCard({ slide, isMobile, themeIndex }) {
  const { icon, num, title, subtitle, items, quote } = slide;
  const theme = SLIDE_THEMES[themeIndex] || SLIDE_THEMES[0];
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: "relative", flexShrink: 0,
        width: isMobile ? "85vw" : "clamp(280px,30vw,460px)",
        height: "100%",
        background: theme.bg,
        borderRadius: "20px",
        padding: isMobile ? "20px" : "clamp(24px,3.5vw,44px)",
        display: "flex", flexDirection: "column", justifyContent: "space-between",
        overflow: "hidden",
        // CHANGED: border uses accent color
        border: `1px solid ${theme.hr}`,
        boxShadow: hov ? theme.hoverShadow : "0 2px 40px rgba(0,0,0,0.60)",
        transform: hov ? "translateY(-6px) scale(1.01)" : "translateY(0) scale(1)",
        transition: "transform .38s cubic-bezier(.34,1.56,.64,1), box-shadow .38s ease",
        boxSizing: "border-box",
      }}
    >
      <Particles icon={icon} dark={true} />
      <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between" }}>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: isMobile ? "12px" : "24px" }}>
            <span style={{ fontSize: isMobile ? "2.4rem" : "clamp(3rem,5.5vw,5rem)", fontWeight: 900, color: theme.numC, lineHeight: 1, fontFamily: "'Helvetica Neue',Arial,sans-serif", userSelect: "none" }}>{num}</span>
            <span style={{ fontSize: "22px", color: theme.icC, lineHeight: 1 }}>{icon}</span>
          </div>
          <h3 style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: isMobile ? "1.35rem" : "clamp(1.4rem,2.4vw,2.1rem)", fontWeight: 800, color: theme.fg, lineHeight: 1.1, margin: isMobile ? "0 0 4px" : "0 0 6px", whiteSpace: "pre-line" }}>{title}</h3>
          <p style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: "10px", letterSpacing: "3px", color: theme.sub, textTransform: "uppercase", margin: isMobile ? "0 0 14px" : "0 0 22px", fontWeight: 500 }}>{subtitle}</p>
          <div style={{ height: "1px", background: theme.hr, marginBottom: isMobile ? "12px" : "18px" }} />
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: isMobile ? "9px" : "11px" }}>
            {items.map((item, i) => (
              <li key={i} style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                <span style={{ color: theme.sub, fontSize: "10px", marginTop: "3px", flexShrink: 0, fontFamily: "'Helvetica Neue',Arial,sans-serif", fontWeight: 600 }}>{i + 1}:</span>
                <span style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: isMobile ? ".78rem" : "clamp(.76rem,1.1vw,.88rem)", color: theme.itC, lineHeight: 1.5 }}>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        {quote && (
          <div style={{
            marginTop: "16px", alignSelf: "flex-end", width: "clamp(160px,80%,260px)",
            background: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(10px)", borderRadius: "14px", padding: "14px 16px",
            border: `1px solid ${theme.hr}`,
            transform: hov ? "rotate(-1.5deg) translateY(-4px)" : "rotate(-3deg)",
            transition: "transform .38s ease",
          }}>
            <p style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: ".75rem", color: theme.itC, lineHeight: 1.6, margin: 0, fontStyle: "italic" }}>"{quote}"</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── stat card ────────────────────────────────────────────────────────────────
function StatCard({ card, cardRef, innerRef, isMobile, themeIndex }) {
  const { stat, unit, label, desc, art, num } = card;
  const theme = STAT_THEMES[themeIndex] || STAT_THEMES[0];
  const [hov, setHov] = useState(false);
  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: "relative",
        width: isMobile ? "100%" : "clamp(220px,26vw,380px)",
        height: isMobile ? "auto" : "clamp(380px,60vh,580px)",
        minHeight: isMobile ? "0" : undefined,
        background: theme.bg,
        borderRadius: "18px",
        border: `1px solid ${theme.hr}`,
        overflow: "hidden", flexShrink: 0, display: "flex", flexDirection: "column",
        boxShadow: hov ? theme.hoverShadow : "0 4px 32px rgba(0,0,0,0.60)",
        transform: hov ? "translateY(-6px) scale(1.012)" : "translateY(0) scale(1)",
        transition: "transform .4s cubic-bezier(.34,1.56,.64,1), box-shadow .4s ease",
        boxSizing: "border-box",
      }}
    >
      <Particles dark={true} />
      <div ref={innerRef} style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", height: "100%", padding: isMobile ? "20px" : "clamp(20px,3vw,36px)" }}>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: isMobile ? "2rem" : "clamp(2.2rem,4vw,3.6rem)", fontWeight: 900, lineHeight: 1, color: theme.fg, margin: "0 0 4px", letterSpacing: "-.03em" }}>{stat} {unit}<br />{label}</h2>
          <div style={{ height: "1px", background: theme.hr, margin: isMobile ? "12px 0" : "16px 0" }} />
          <p style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: isMobile ? ".82rem" : "clamp(.78rem,1.1vw,.92rem)", color: theme.muted, lineHeight: 1.6, margin: 0 }}>{desc}</p>
        </div>
        {!isMobile && (
          <div style={{ position: "relative", height: "clamp(120px,20vh,200px)", marginTop: "auto", overflow: "hidden" }}>
            <CardArt type={art} dark={true} />
            <span style={{ position: "absolute", bottom: 0, left: 0, fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: "clamp(2.2rem,4vw,3.8rem)", fontWeight: 900, color: theme.numC, lineHeight: 1, userSelect: "none" }}>{num}</span>
          </div>
        )}
        {isMobile && (
          <div style={{ marginTop: "12px", display: "flex", justifyContent: "flex-end" }}>
            <span style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: "2.4rem", fontWeight: 900, color: theme.numC, lineHeight: 1, userSelect: "none" }}>{num}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── main export ──────────────────────────────────────────────────────────────
export default function SecondSection() {
  const wrapRef     = useRef(null);
  const darkRef     = useRef(null);
  const colRefs     = useRef([]);
  const badgeRef    = useRef(null);
  const badgeSvg    = useRef(null);
  const expandRef   = useRef(null);

  const blastRef      = useRef(null);
  const blastLeftRef  = useRef(null);
  const blastRightRef = useRef(null);

  const exploreRef  = useRef(null);
  const carouselRef = useRef(null);
  const trackRef    = useRef(null);
  const contentRef  = useRef(null);
  const cardRefs    = useRef([]);
  const innerRefs   = useRef([]);
  const [dot, setDot] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const wrap    = wrapRef.current;
    const dark    = darkRef.current;
    const cols    = colRefs.current;
    const badge   = badgeRef.current;
    const bSvg    = badgeSvg.current;
    const expand  = expandRef.current;
    const blast   = blastRef.current;
    const blastL  = blastLeftRef.current;
    const blastR  = blastRightRef.current;
    const explore = exploreRef.current;
    const carousel= carouselRef.current;
    const track   = trackRef.current;
    const content = contentRef.current;

    if (!wrap || !dark || !badge || !expand || !blast || !explore || !carousel || !track || !content) return;
    if (cols.filter(Boolean).length < COLS.length) return;

    const cards  = cardRefs.current.filter(Boolean);
    const inners = innerRefs.current.filter(Boolean);

    gsap.set(badge,  { opacity: 0, scale: 0.05, transformOrigin: "center center" });
    gsap.set(expand, { scale: 0, transformOrigin: "center center" });
    gsap.set(blast,  { opacity: 0 });
    gsap.set(blastL, { x: 0 });
    gsap.set(blastR, { x: 0 });
    gsap.set([explore, carousel, content], { opacity: 0 });
    gsap.set(cards,  { x: "-110%" });
    gsap.set(inners, { opacity: 0, y: 30 });

    const explEls = explore.querySelectorAll(".el");
    gsap.set(explEls, { opacity: 0, y: 50 });

    const spin = gsap.to(bSvg, {
      rotation: 360, duration: 10, repeat: -1, ease: "none",
      transformOrigin: `${BCX}px ${BCY}px`,
    });

    const getScrollDist = () => {
      const trackEl = trackRef.current;
      const carouselEl = carouselRef.current;
      if (!trackEl || !carouselEl) return 0;
      const pad = parseFloat(getComputedStyle(trackEl).paddingLeft) || 16;
      const totalTravel = trackEl.scrollWidth - carouselEl.offsetWidth + pad;
      return Math.max(0, totalTravel);
    };

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: wrap,
        start: "top top",
        end: "+=700%",
        scrub: 0.65,
        pin: true,
        anticipatePin: 1,
        onUpdate(self) {
          const p = self.progress, s = 0.55, e = 0.78;
          if (p >= s && p <= e)
            setDot(Math.min(SLIDES.length - 1, Math.floor(((p - s) / (e - s)) * SLIDES.length)));
          else setDot(p < s ? 0 : SLIDES.length - 1);
        },
      },
    });

    cols.forEach((c, i) => {
      tl.to(c, { y: -(280 + COLS[i].speed * 380), ease: "none", duration: 0.20 }, 0);
    });

    tl.to(badge, { opacity: 1, scale: 1, duration: 0.08, ease: "back.out(2.2)" }, 0.06);
    tl.to(badge,  { opacity: 0, duration: 0.04 }, 0.20);
    tl.to(expand, { scale: 80, duration: 0.14, ease: "power3.inOut" }, 0.20);
    tl.to(blast,  { opacity: 1, duration: 0.04 }, 0.24);
    tl.to(blastL, { x: "-55vw", duration: 0.14, ease: "power3.in" }, 0.28);
    tl.to(blastR, { x:  "55vw", duration: 0.14, ease: "power3.in" }, 0.28);
    tl.to(blast,  { opacity: 0, duration: 0.05 }, 0.38);
    tl.to(dark,   { opacity: 0, duration: 0.06 }, 0.22);
    tl.to(explore, { opacity: 1, duration: 0.04 }, 0.40);
    tl.to(explEls, { opacity: 1, y: 0, duration: 0.08, stagger: 0.015, ease: "power3.out" }, 0.41);
    tl.to(explEls, { opacity: 0, y: -28, duration: 0.06, stagger: 0.01, ease: "power2.in" }, 0.50);
    tl.to(explore, { opacity: 0, duration: 0.04 }, 0.54);
    tl.to(carousel, { opacity: 1, duration: 0.05 }, 0.55);
    tl.to(track, { x: () => -getScrollDist(), ease: "none", duration: 0.23 }, 0.55);
    tl.to(carousel, { opacity: 0, duration: 0.04 }, 0.80);
    tl.to(content, { opacity: 1, duration: 0.04, ease: "power2.out" }, 0.82);
    cards.forEach((c, i) => tl.to(c, { x: "0%", duration: 0.06, ease: "power3.out" }, 0.84 + i * 0.04));
    tl.to(inners,  { opacity: 1, y: 0, duration: 0.05, stagger: 0.02, ease: "power2.out" }, 0.93);

    return () => { spin.kill(); ScrollTrigger.getAll().forEach((t) => t.kill()); };
  }, []);

  const colW = 100 / COLS.length;
  const carouselPad = isMobile ? "16px" : "clamp(24px,4vw,60px)";

  return (
    <div
      ref={wrapRef}
      // CHANGED: wrapper bg is the About page's deep navy
      style={{ position: "relative", width: "100%", height: "100vh", overflow: "hidden", background: "#020510" }}
    >
      {/* ── LAYER 1: pill grid — deep navy with cyan column lines ────────────── */}
      <div ref={darkRef} style={{ position: "absolute", inset: 0, zIndex: 0, background: "#020510" }}>
        {COLS.map((_, i) => (
          // CHANGED: column lines use cyan tint instead of white
          <div key={`vl${i}`} style={{ position: "absolute", top: 0, bottom: 0, left: `${i * colW + colW / 2}%`, width: "1px", background: "rgba(0,207,255,0.08)" }} />
        ))}
        {COLS.map((col, ci) => (
          <div
            key={`col${ci}`}
            ref={(el) => (colRefs.current[ci] = el)}
            style={{
              position: "absolute", top: `${col.offset}%`,
              left: `${ci * colW}%`, width: `${colW}%`,
              display: "flex", flexDirection: "column", alignItems: "center", gap: "18px",
              willChange: "transform",
            }}
          >
            {Array.from({ length: PILLS }).map((_, pi) => (
              // CHANGED: pills use cyan border glow
              <div key={pi} style={{ width: "72%", aspectRatio: "1 / 2.1", border: "1px solid rgba(0,207,255,0.18)", borderRadius: "999px", background: "transparent", flexShrink: 0 }} />
            ))}
          </div>
        ))}
      </div>

      {/* ── LAYER 2: expander — CHANGED to deep purple instead of cream ──────── */}
      <div
        ref={expandRef}
        style={{
          position: "absolute",
          top:  `calc(50% - ${BH / 2}px)`,
          left: `calc(50% - ${BW / 2}px)`,
          width:  `${BW}px`,
          height: `${BH}px`,
          borderRadius: "999px",
          // CHANGED: bursts into deep magenta/purple instead of off-white
          background: "#0d0218",
          zIndex: 8,
          pointerEvents: "none",
        }}
      />

      {/* ── LAYER 3: spinning badge — cyan border + text ─────────────────────── */}
      <div
        ref={badgeRef}
        style={{
          position: "absolute",
          top:  `calc(50% - ${BH / 2}px)`,
          left: `calc(50% - ${BW / 2}px)`,
          width:  `${BW}px`,
          height: `${BH}px`,
          zIndex: 12,
          pointerEvents: "none",
        }}
      >
        {/* CHANGED: badge border uses cyan */}
        <div style={{ position: "absolute", inset: 0, border: "1.5px solid rgba(0,207,255,0.70)", borderRadius: "999px" }} />
        <svg
          ref={badgeSvg}
          viewBox={`0 0 ${BW} ${BH}`}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}
        >
          <defs><path id="bp" d={BADGE_PATH} fill="none" /></defs>
          {/* CHANGED: badge text uses cyan */}
          <text fontSize="11" fontFamily="'Helvetica Neue',Arial,sans-serif" fontWeight="700" letterSpacing="4" fill="rgba(0,207,255,0.88)">
            <textPath href="#bp" startOffset="0%">KEEP SCROLLING • KEEP SCROLLING • </textPath>
          </text>
        </svg>
      </div>

      {/* ── LAYER 4: BLAST text — CHANGED to cyan/magenta split ──────────────── */}
      <div
        ref={blastRef}
        style={{
          position: "absolute", inset: 0, zIndex: 15,
          pointerEvents: "none",
          overflow: "hidden",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        <div
          ref={blastLeftRef}
          style={{
            position: "absolute",
            left: 0, top: 0, bottom: 0,
            width: "50%",
            display: "flex", alignItems: "center", justifyContent: "flex-end",
            paddingRight: "1vw",
            willChange: "transform",
            overflow: "hidden",
          }}
        >
          {/* CHANGED: "KEEP" is cyan-tinted */}
          <span style={{
            fontFamily: "'Helvetica Neue',Arial,sans-serif",
            fontSize: "clamp(2.8rem,10vw,14rem)",
            fontWeight: 900,
            color: "rgba(0,207,255,0.28)",
            lineHeight: 1,
            letterSpacing: "-.04em",
            whiteSpace: "nowrap",
            userSelect: "none",
          }}>
            KEEP
          </span>
        </div>
        <div
          ref={blastRightRef}
          style={{
            position: "absolute",
            right: 0, top: 0, bottom: 0,
            width: "50%",
            display: "flex", alignItems: "center", justifyContent: "flex-start",
            paddingLeft: "1vw",
            willChange: "transform",
            overflow: "hidden",
          }}
        >
          {/* CHANGED: "SCROLLING" is magenta-tinted */}
          <span style={{
            fontFamily: "'Helvetica Neue',Arial,sans-serif",
            fontSize: "clamp(2.8rem,10vw,14rem)",
            fontWeight: 900,
            color: "rgba(224,64,251,0.28)",
            lineHeight: 1,
            letterSpacing: "-.04em",
            whiteSpace: "nowrap",
            userSelect: "none",
          }}>
            SCROLLING
          </span>
        </div>
      </div>

      {/* ── LAYER 5: EXPLORE — CHANGED from cream to deep purple bg ─────────── */}
      <div
        ref={exploreRef}
        style={{
          position: "absolute", inset: 0, zIndex: 20,
          // CHANGED: deep purple instead of #f5f4f0
          background: "#06020e",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          opacity: 0, pointerEvents: "none",
          overflow: "hidden",
        }}
      >
        {/* CHANGED: label color to cyan */}
        <p className="el" style={{ fontSize: "10px", fontFamily: "'Helvetica Neue',Arial,sans-serif", fontWeight: 600, letterSpacing: "5px", color: "rgba(0,207,255,0.55)", textTransform: "uppercase", margin: "0 0 20px", opacity: 0 }}>
          Scroll to discover
        </p>
        <div className="el" style={{ display: "flex", alignItems: "baseline", gap: "clamp(1px,.4vw,8px)", opacity: 0, maxWidth: "100vw", overflow: "hidden" }}>
          {"EXPLORE".split("").map((ch, i) => (
            <span key={i} style={{
              fontSize: "clamp(2.8rem,10vw,11rem)",
              fontFamily: "'Helvetica Neue',Arial,sans-serif",
              fontWeight: 900, lineHeight: 0.88, letterSpacing: "-.04em",
              // CHANGED: alternating cyan / muted purple instead of black / #ccc
              color: i % 2 === 0 ? "#00CFFF" : "rgba(179,157,219,0.55)",
              display: "inline-block",
              transform: i % 2 === 0 ? "translateY(0)" : "translateY(6px)",
            }}>{ch}</span>
          ))}
        </div>
        {/* CHANGED: divider uses cyan fade */}
        <div className="el" style={{ width: "clamp(140px,80vw,480px)", height: "1px", background: "linear-gradient(90deg,transparent,rgba(0,207,255,0.45) 30%,rgba(0,207,255,0.45) 70%,transparent)", margin: "20px 0", opacity: 0 }} />
        {/* CHANGED: subtitle color to muted cyan */}
        <p className="el" style={{ fontSize: "clamp(.72rem,1.1vw,.9rem)", fontFamily: "'Helvetica Neue',Arial,sans-serif", fontWeight: 400, letterSpacing: "2px", color: "rgba(0,207,255,0.40)", textTransform: "uppercase", margin: 0, opacity: 0, textAlign: "center", padding: "0 16px" }}>
          Five pathways. One platform.
        </p>
        {/* CHANGED: corner accents use cyan border */}
        {!isMobile && [{ top: "8%", left: "5%" }, { top: "8%", right: "5%" }, { bottom: "8%", left: "5%" }, { bottom: "8%", right: "5%" }].map((pos, i) => (
          <div key={i} style={{ position: "absolute", ...pos, width: "32px", height: "32px", border: "1px solid rgba(0,207,255,0.18)", borderRadius: "4px" }} />
        ))}
        {!isMobile && [{ w: "160px", h: "270px", top: "8%", left: "-3%", op: 0.12 },
          { w: "120px", h: "200px", bottom: "4%", right: "-2%", op: 0.10 }].map((p, i) => (
          <div key={i} style={{ position: "absolute", top: p.top, bottom: p.bottom, left: p.left, right: p.right, width: p.w, height: p.h, border: "1px solid rgba(0,207,255,0.30)", borderRadius: "999px", opacity: p.op, pointerEvents: "none" }} />
        ))}
      </div>

      {/* ── LAYER 6: carousel — CHANGED from cream to deep navy ──────────────── */}
      <div
        ref={carouselRef}
        style={{
          position: "absolute", inset: 0, zIndex: 25,
          // CHANGED: deep navy bg with subtle grid lines
          background: "#020510", opacity: 0, pointerEvents: "none",
          overflow: "hidden", display: "flex", flexDirection: "column",
        }}
      >
        {/* CHANGED: guide lines use cyan tint */}
        {(isMobile ? [50] : [20, 35, 50, 65, 80]).map((pct) => (
          <div key={pct} style={{ position: "absolute", top: 0, bottom: 0, left: `${pct}%`, width: "1px", background: "rgba(0,207,255,0.05)", pointerEvents: "none" }} />
        ))}

        <div style={{ padding: `clamp(16px,3vh,40px) ${carouselPad} 0`, flexShrink: 0 }}>
          {/* CHANGED: label muted cyan */}
          <p style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: "10px", letterSpacing: "4px", color: "rgba(0,207,255,0.40)", textTransform: "uppercase", margin: "0 0 4px" }}>What we offer</p>
          {/* CHANGED: "Services" watermark uses cyan ghost */}
          <h2 style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: isMobile ? "clamp(2.4rem,14vw,5rem)" : "clamp(3rem,8vw,8rem)", fontWeight: 900, color: "rgba(0,207,255,0.06)", lineHeight: 0.9, margin: 0, letterSpacing: "-.03em" }}>Services</h2>
        </div>

        <div style={{ flex: 1, display: "flex", alignItems: "center", overflow: "visible", minHeight: 0 }}>
          <div
            ref={trackRef}
            style={{
              display: "flex",
              gap: isMobile ? "12px" : "clamp(12px,1.8vw,22px)",
              willChange: "transform",
              height: isMobile ? "clamp(320px,62vh,480px)" : "clamp(340px,58vh,520px)",
              paddingLeft: carouselPad,
              paddingRight: carouselPad,
              flexShrink: 0,
              boxSizing: "border-box",
            }}
          >
            {SLIDES.map((slide, i) => (
              <div key={i} data-sc="1" style={{ height: "100%", flexShrink: 0 }}>
                <SlideCard slide={slide} isMobile={isMobile} themeIndex={i} />
              </div>
            ))}
          </div>
        </div>

        {/* CHANGED: dot indicators use cyan active color */}
        <div style={{ display: "flex", justifyContent: "center", gap: "8px", padding: "12px 0 clamp(12px,2.5vh,28px)", flexShrink: 0 }}>
          {SLIDES.map((_, i) => (
            <div key={i} style={{ width: i === dot ? "28px" : "8px", height: "8px", borderRadius: "999px", background: i === dot ? "#00CFFF" : "rgba(0,207,255,0.15)", transition: "all .4s cubic-bezier(.34,1.56,.64,1)" }} />
          ))}
        </div>
      </div>

      {/* ── LAYER 7: stat cards — CHANGED bg to deep navy #020510 ────────────── */}
      <div
        ref={contentRef}
        style={{
          position: "absolute", inset: 0, zIndex: 30,
          // CHANGED: deep navy instead of #111
          background: "#020510", opacity: 0, pointerEvents: "none",
          overflowY: isMobile ? "auto" : "hidden",
          overflowX: "hidden",
          display: "flex", flexDirection: "column",
        }}
      >
        {/* CHANGED: guide lines use magenta tint */}
        {(isMobile ? [] : [16, 33, 50, 67, 84]).map((p) => (
          <div key={p} style={{ position: "absolute", top: 0, bottom: 0, left: `${p}%`, width: "1px", background: "rgba(224,64,251,0.04)", pointerEvents: "none" }} />
        ))}

        <div style={{ position: isMobile ? "relative" : "absolute", top: isMobile ? undefined : "clamp(16px,2.5vh,30px)", left: isMobile ? undefined : "clamp(20px,3vw,48px)", display: "flex", alignItems: "center", gap: "10px", zIndex: 4, padding: isMobile ? "clamp(16px,4vh,28px) 20px 0" : undefined, flexShrink: 0 }}>
          {/* CHANGED: "Why us" label uses cyan */}
          <span style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: "10px", letterSpacing: "5px", color: "rgba(0,207,255,0.40)", textTransform: "uppercase" }}>Why us</span>
          <div style={{ width: "28px", height: "1px", background: "rgba(0,207,255,0.20)" }} />
        </div>

        {/* CHANGED: "Impact" watermark uses cyan ghost */}
        {!isMobile && (
          <div style={{ position: "absolute", bottom: "clamp(10px,1.5vh,20px)", left: "clamp(20px,3vw,48px)", fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: "clamp(4rem,11vw,10rem)", fontWeight: 900, color: "rgba(0,207,255,0.04)", lineHeight: 1, letterSpacing: "-.03em", userSelect: "none", pointerEvents: "none", zIndex: 0 }}>Impact</div>
        )}

        <div style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: isMobile ? "stretch" : "center",
          justifyContent: isMobile ? "flex-start" : "center",
          gap: isMobile ? "12px" : "clamp(12px,1.8vw,22px)",
          flex: isMobile ? undefined : 1,
          padding: isMobile
            ? "16px 16px clamp(24px,4vh,40px)"
            : "clamp(50px,8vh,90px) clamp(20px,3.5vw,52px) clamp(20px,3.5vh,40px)",
          position: "relative", zIndex: 3,
        }}>
          {STATS.map((card, i) => (
            <StatCard
              key={i}
              card={card}
              isMobile={isMobile}
              themeIndex={i}
              cardRef={(el) => (cardRefs.current[i] = el)}
              innerRef={(el) => (innerRefs.current[i] = el)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}