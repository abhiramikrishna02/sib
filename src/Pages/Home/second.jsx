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
    const color = dark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.15)";
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
  const s  = dark ? "rgba(255,255,255,0.22)" : "rgba(0,0,0,0.18)";
  const st = dark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.10)";
  if (type === "diagonal") {
    return (
      <svg viewBox="0 0 240 240" style={{ width: "100%", height: "100%", overflow: "visible" }}>
        {Array.from({ length: 22 }, (_, i) => (
          <line key={i} x1={220 - Math.min(180, 30 + i * 7)} y1={20 + i * 9} x2={220} y2={20 + i * 9} stroke={s} strokeWidth="1" />
        ))}
        <line x1="60"  y1="20"  x2="240" y2="240" stroke={dark ? "#111" : "#f0eeea"} strokeWidth="10" />
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
function SlideCard({ slide }) {
  const { dark, icon, num, title, subtitle, items, quote } = slide;
  const bg  = dark ? "#1a1a1a" : "#f0eeea";
  const fg  = dark ? "#fff"    : "#111";
  const sub = dark ? "rgba(255,255,255,.40)" : "rgba(0,0,0,.38)";
  const hr  = dark ? "rgba(255,255,255,.12)" : "rgba(0,0,0,.12)";
  const itC = dark ? "rgba(255,255,255,.78)" : "rgba(0,0,0,.72)";
  const numC= dark ? "rgba(255,255,255,.09)" : "rgba(0,0,0,.08)";
  const icC = dark ? "rgba(255,255,255,.32)" : "rgba(0,0,0,.22)";
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: "relative", flexShrink: 0,
        width: "clamp(280px,30vw,460px)", height: "100%",
        background: bg, borderRadius: "24px",
        padding: "clamp(24px,3.5vw,44px)",
        display: "flex", flexDirection: "column", justifyContent: "space-between",
        overflow: "hidden",
        border: dark ? "1px solid rgba(255,255,255,.07)" : "1px solid rgba(0,0,0,.07)",
        boxShadow: hov
          ? dark ? "0 20px 60px rgba(0,0,0,.65)" : "0 20px 60px rgba(0,0,0,.18)"
          : dark ? "0 2px 40px rgba(0,0,0,.45)" : "0 2px 24px rgba(0,0,0,.08)",
        transform: hov ? "translateY(-8px) scale(1.012)" : "translateY(0) scale(1)",
        transition: "transform .38s cubic-bezier(.34,1.56,.64,1), box-shadow .38s ease",
      }}
    >
      <Particles icon={icon} dark={dark} />
      <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between" }}>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
            <span style={{ fontSize: "clamp(3rem,5.5vw,5rem)", fontWeight: 900, color: numC, lineHeight: 1, fontFamily: "'Helvetica Neue',Arial,sans-serif", userSelect: "none" }}>{num}</span>
            <span style={{ fontSize: "26px", color: icC, lineHeight: 1 }}>{icon}</span>
          </div>
          <h3 style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: "clamp(1.4rem,2.4vw,2.1rem)", fontWeight: 800, color: fg, lineHeight: 1.1, margin: "0 0 6px", whiteSpace: "pre-line" }}>{title}</h3>
          <p style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: "11px", letterSpacing: "3.5px", color: sub, textTransform: "uppercase", margin: "0 0 22px", fontWeight: 500 }}>{subtitle}</p>
          <div style={{ height: "1px", background: hr, marginBottom: "18px" }} />
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "11px" }}>
            {items.map((item, i) => (
              <li key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                <span style={{ color: dark ? "rgba(255,255,255,.28)" : "rgba(0,0,0,.28)", fontSize: "11px", marginTop: "3px", flexShrink: 0, fontFamily: "'Helvetica Neue',Arial,sans-serif", fontWeight: 600 }}>{i + 1}:</span>
                <span style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: "clamp(.76rem,1.1vw,.88rem)", color: itC, lineHeight: 1.55 }}>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        {quote && (
          <div style={{
            marginTop: "20px", alignSelf: "flex-end", width: "clamp(200px,80%,290px)",
            background: dark ? "rgba(255,255,255,.07)" : "rgba(0,0,0,.055)",
            backdropFilter: "blur(10px)", borderRadius: "16px", padding: "18px 20px",
            border: dark ? "1px solid rgba(255,255,255,.10)" : "1px solid rgba(0,0,0,.08)",
            transform: hov ? "rotate(-1.5deg) translateY(-4px)" : "rotate(-3deg)",
            transition: "transform .38s ease",
          }}>
            <p style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: "clamp(.70rem,1.05vw,.82rem)", color: dark ? "rgba(255,255,255,.72)" : "rgba(0,0,0,.62)", lineHeight: 1.65, margin: 0, fontStyle: "italic" }}>"{quote}"</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── stat card ────────────────────────────────────────────────────────────────
function StatCard({ card, cardRef, innerRef }) {
  const { dark, stat, unit, label, desc, art, num } = card;
  const bg    = dark ? "#1a1a1a" : "#f0eeea";
  const fg    = dark ? "#fff"    : "#111";
  const muted = dark ? "rgba(255,255,255,.45)" : "rgba(0,0,0,.40)";
  const numC  = dark ? "rgba(255,255,255,.10)" : "rgba(0,0,0,.08)";
  const hr    = dark ? "rgba(255,255,255,.10)" : "rgba(0,0,0,.10)";
  const [hov, setHov] = useState(false);
  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: "relative",
        width: "clamp(260px,26vw,400px)", height: "clamp(440px,68vh,640px)",
        background: bg, borderRadius: "20px",
        border: dark ? "1px solid rgba(255,255,255,.08)" : "1px solid rgba(0,0,0,.08)",
        overflow: "hidden", flexShrink: 0, display: "flex", flexDirection: "column",
        boxShadow: hov
          ? dark ? "0 24px 64px rgba(0,0,0,.70)" : "0 24px 64px rgba(0,0,0,.16)"
          : dark ? "0 4px 32px rgba(0,0,0,.50)" : "0 4px 24px rgba(0,0,0,.08)",
        transform: hov ? "translateY(-10px) scale(1.014)" : "translateY(0) scale(1)",
        transition: "transform .4s cubic-bezier(.34,1.56,.64,1), box-shadow .4s ease",
      }}
    >
      <Particles dark={dark} />
      <div ref={innerRef} style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", height: "100%", padding: "clamp(24px,3.5vw,40px)" }}>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: "clamp(2.6rem,4.5vw,4rem)", fontWeight: 900, lineHeight: 1, color: fg, margin: "0 0 4px", letterSpacing: "-.03em" }}>{stat} {unit}<br />{label}</h2>
          <div style={{ height: "1px", background: hr, margin: "20px 0" }} />
          <p style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: "clamp(.82rem,1.2vw,.96rem)", color: muted, lineHeight: 1.6, margin: 0 }}>{desc}</p>
        </div>
        <div style={{ position: "relative", height: "clamp(140px,24vh,220px)", marginTop: "auto", overflow: "hidden" }}>
          <CardArt type={art} dark={dark} />
          <span style={{ position: "absolute", bottom: 0, left: 0, fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: "clamp(2.6rem,4.5vw,4.2rem)", fontWeight: 900, color: numC, lineHeight: 1, userSelect: "none" }}>{num}</span>
        </div>
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

    // ── Initial states ──────────────────────────────────────────────────────
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

    // Spinning badge text
    const spin = gsap.to(bSvg, {
      rotation: 360, duration: 10, repeat: -1, ease: "none",
      transformOrigin: `${BCX}px ${BCY}px`,
    });

    // ── Carousel scroll distance calculation ────────────────────────────────
    // We compute the total x-travel needed so the LAST card is fully visible.
    // The track starts with a left-padding offset (TRACK_OFFSET) so card 1
    // is always fully visible when the carousel first appears.
    const getScrollDist = () => {
      const trackEl = trackRef.current;
      if (!trackEl) return 0;
      const carouselEl = carouselRef.current;
      if (!carouselEl) return 0;

      // Horizontal padding applied to the carousel container
      const carouselPadding = parseFloat(
        getComputedStyle(carouselEl).paddingLeft || "60"
      ) || 60;

      // Total width of all cards + gaps
      const trackWidth = trackEl.scrollWidth;
      // Available viewport width (carousel inner width)
      const viewWidth = carouselEl.offsetWidth;

      // We want the last card's right edge to land at (viewWidth - padding)
      // track starts at x=0 (already offset), so total travel:
      const totalTravel = trackWidth - viewWidth + carouselPadding;
      return Math.max(0, totalTravel);
    };

    // ── Master scroll timeline ──────────────────────────────────────────────
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

    // Phase 1 — pills parallax (0→0.20)
    cols.forEach((c, i) => {
      tl.to(c, { y: -(280 + COLS[i].speed * 380), ease: "none", duration: 0.20 }, 0);
    });

    // Phase 2 — badge appears (0.06→0.18)
    tl.to(badge, { opacity: 1, scale: 1, duration: 0.08, ease: "back.out(2.2)" }, 0.06);

    // Phase 4 — expand pill bursts from badge center (0.20→0.30)
    tl.to(badge,  { opacity: 0, duration: 0.04 }, 0.20);
    tl.to(expand, { scale: 80, duration: 0.14, ease: "power3.inOut" }, 0.20);

    // Phase 5 — blast text appears (0.24→0.30)
    tl.to(blast,  { opacity: 1, duration: 0.04 }, 0.24);

    // Phase 6 — letters EXPLODE (0.28→0.40)
    tl.to(blastL, { x: "-65vw", duration: 0.14, ease: "power3.in" }, 0.28);
    tl.to(blastR, { x:  "65vw", duration: 0.14, ease: "power3.in" }, 0.28);
    tl.to(blast,  { opacity: 0, duration: 0.05 }, 0.38);

    // Phase 7 — dark overlay gone (0.22)
    tl.to(dark,   { opacity: 0, duration: 0.06 }, 0.22);

    // Phase 8 — EXPLORE layer (0.40→0.56)
    tl.to(explore, { opacity: 1, duration: 0.04 }, 0.40);
    tl.to(explEls, { opacity: 1, y: 0, duration: 0.08, stagger: 0.015, ease: "power3.out" }, 0.41);
    tl.to(explEls, { opacity: 0, y: -28, duration: 0.06, stagger: 0.01, ease: "power2.in" }, 0.50);
    tl.to(explore, { opacity: 0, duration: 0.04 }, 0.54);

    // Phase 9 — carousel (0.55→0.80)
    // The track x starts at 0 (card 1 fully visible thanks to carousel padding).
    // We animate x to -getScrollDist() so all cards are traversed.
    tl.to(carousel, { opacity: 1, duration: 0.05 }, 0.55);
    tl.to(track, {
      x: () => -getScrollDist(),
      ease: "none",
      duration: 0.23,
    }, 0.55);
    tl.to(carousel, { opacity: 0, duration: 0.04 }, 0.80);

    // Phase 10 — stat cards (0.82→1.00)
    tl.to(content, { opacity: 1, duration: 0.04, ease: "power2.out" }, 0.82);
    cards.forEach((c, i) => tl.to(c, { x: "0%", duration: 0.06, ease: "power3.out" }, 0.84 + i * 0.04));
    tl.to(inners,  { opacity: 1, y: 0, duration: 0.05, stagger: 0.02, ease: "power2.out" }, 0.93);

    return () => { spin.kill(); ScrollTrigger.getAll().forEach((t) => t.kill()); };
  }, []);

  const colW = 100 / COLS.length;

  // Responsive carousel padding — matches the carousel header padding
  const carouselPad = "clamp(24px,4vw,60px)";

  return (
    <div
      ref={wrapRef}
      style={{ position: "relative", width: "100%", height: "100vh", overflow: "hidden", background: "#0e0e0e" }}
    >
      {/* ── LAYER 1: dark pill grid ─────────────────────────────────────────── */}
      <div ref={darkRef} style={{ position: "absolute", inset: 0, zIndex: 0, background: "#0e0e0e" }}>
        {COLS.map((_, i) => (
          <div key={`vl${i}`} style={{ position: "absolute", top: 0, bottom: 0, left: `${i * colW + colW / 2}%`, width: "1px", background: "rgba(255,255,255,.06)" }} />
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
              <div key={pi} style={{ width: "72%", aspectRatio: "1 / 2.1", border: "1px solid rgba(255,255,255,.15)", borderRadius: "999px", background: "transparent", flexShrink: 0 }} />
            ))}
          </div>
        ))}
      </div>

      {/* ── LAYER 2: white expander pill ───────────────────────────────────── */}
      <div
        ref={expandRef}
        style={{
          position: "absolute",
          top:  `calc(50% - ${BH / 2}px)`,
          left: `calc(50% - ${BW / 2}px)`,
          width:  `${BW}px`,
          height: `${BH}px`,
          borderRadius: "999px",
          background: "#f5f4f0",
          zIndex: 8,
          pointerEvents: "none",
        }}
      />

      {/* ── LAYER 3: spinning badge ─────────────────────────────────────────── */}
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
        <div style={{ position: "absolute", inset: 0, border: "1.5px solid rgba(255,255,255,.78)", borderRadius: "999px" }} />
        <svg
          ref={badgeSvg}
          viewBox={`0 0 ${BW} ${BH}`}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}
        >
          <defs><path id="bp" d={BADGE_PATH} fill="none" /></defs>
          <text fontSize="11" fontFamily="'Helvetica Neue',Arial,sans-serif" fontWeight="700" letterSpacing="4" fill="rgba(255,255,255,.88)">
            <textPath href="#bp" startOffset="0%">KEEP SCROLLING • KEEP SCROLLING • </textPath>
          </text>
        </svg>
      </div>

      {/* ── LAYER 4: cinematic BLAST text ───────────────────────────────────── */}
      <div
        ref={blastRef}
        style={{
          position: "absolute", inset: 0, zIndex: 15,
          pointerEvents: "none", overflow: "hidden",
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
            paddingRight: "2vw",
            willChange: "transform",
          }}
        >
          <span style={{
            fontFamily: "'Helvetica Neue',Arial,sans-serif",
            fontSize: "clamp(6rem,18vw,18rem)",
            fontWeight: 900,
            color: "rgba(0,0,0,.22)",
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
            paddingLeft: "2vw",
            willChange: "transform",
          }}
        >
          <span style={{
            fontFamily: "'Helvetica Neue',Arial,sans-serif",
            fontSize: "clamp(6rem,18vw,18rem)",
            fontWeight: 900,
            color: "rgba(0,0,0,.22)",
            lineHeight: 1,
            letterSpacing: "-.04em",
            whiteSpace: "nowrap",
            userSelect: "none",
          }}>
            SCROLLING
          </span>
        </div>
      </div>

      {/* ── LAYER 5: EXPLORE ───────────────────────────────────────────────── */}
      <div
        ref={exploreRef}
        style={{
          position: "absolute", inset: 0, zIndex: 20,
          background: "#f5f4f0",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          opacity: 0, pointerEvents: "none", overflow: "hidden",
        }}
      >
        <p className="el" style={{ fontSize: "11px", fontFamily: "'Helvetica Neue',Arial,sans-serif", fontWeight: 600, letterSpacing: "6px", color: "#999", textTransform: "uppercase", margin: "0 0 24px", opacity: 0 }}>
          Scroll to discover
        </p>
        <div className="el" style={{ display: "flex", alignItems: "baseline", gap: "clamp(2px,.6vw,12px)", opacity: 0 }}>
          {"EXPLORE".split("").map((ch, i) => (
            <span key={i} style={{
              fontSize: "clamp(4rem,13vw,13rem)",
              fontFamily: "'Helvetica Neue',Arial,sans-serif",
              fontWeight: 900, lineHeight: 0.88, letterSpacing: "-.04em",
              color: i % 2 === 0 ? "#111" : "#ccc",
              display: "inline-block",
              transform: i % 2 === 0 ? "translateY(0)" : "translateY(8px)",
            }}>{ch}</span>
          ))}
        </div>
        <div className="el" style={{ width: "clamp(180px,38vw,520px)", height: "1px", background: "linear-gradient(90deg,transparent,#999 30%,#999 70%,transparent)", margin: "28px 0", opacity: 0 }} />
        <p className="el" style={{ fontSize: "clamp(.8rem,1.3vw,1rem)", fontFamily: "'Helvetica Neue',Arial,sans-serif", fontWeight: 400, letterSpacing: "2px", color: "#888", textTransform: "uppercase", margin: 0, opacity: 0 }}>
          Five pathways. One platform.
        </p>
        {[{ top: "8%", left: "5%" }, { top: "8%", right: "5%" }, { bottom: "8%", left: "5%" }, { bottom: "8%", right: "5%" }].map((pos, i) => (
          <div key={i} style={{ position: "absolute", ...pos, width: "36px", height: "36px", border: "1px solid rgba(0,0,0,.12)", borderRadius: "4px" }} />
        ))}
        {[{ w: "160px", h: "270px", top: "8%",  left:  "-3%", op: 0.06 },
          { w: "120px", h: "200px", bottom: "4%", right: "-2%", op: 0.07 }].map((p, i) => (
          <div key={i} style={{ position: "absolute", top: p.top, bottom: p.bottom, left: p.left, right: p.right, width: p.w, height: p.h, border: "1px solid rgba(0,0,0,.25)", borderRadius: "999px", opacity: p.op, pointerEvents: "none" }} />
        ))}
      </div>

      {/* ── LAYER 6: carousel ──────────────────────────────────────────────── */}
      <div
        ref={carouselRef}
        style={{
          position: "absolute", inset: 0, zIndex: 25,
          background: "#f5f4f0", opacity: 0, pointerEvents: "none",
          overflow: "hidden", display: "flex", flexDirection: "column",
        }}
      >
        {/* subtle vertical guide lines */}
        {[20, 35, 50, 65, 80].map((pct) => (
          <div key={pct} style={{ position: "absolute", top: 0, bottom: 0, left: `${pct}%`, width: "1px", background: "rgba(0,0,0,.04)", pointerEvents: "none" }} />
        ))}

        {/* Header */}
        <div style={{ padding: `clamp(24px,4vh,48px) ${carouselPad} 0`, flexShrink: 0 }}>
          <p style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: "11px", letterSpacing: "5px", color: "#aaa", textTransform: "uppercase", margin: "0 0 8px" }}>What we offer</p>
          <h2 style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: "clamp(3rem,8vw,8rem)", fontWeight: 900, color: "rgba(0,0,0,.07)", lineHeight: 0.9, margin: 0, letterSpacing: "-.03em" }}>Services</h2>
        </div>

        {/* Track — paddingLeft equals carousel side padding so card 1 is flush-left visible */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", overflow: "visible" }}>
          <div
            ref={trackRef}
            style={{
              display: "flex",
              gap: "clamp(12px,1.8vw,22px)",
              willChange: "transform",
              height: "clamp(360px,60vh,540px)",
              // Left padding so card 1 starts fully visible inside the viewport
              paddingLeft: carouselPad,
              // Right padding so the last card has some breathing room
              paddingRight: carouselPad,
              // Allow the track to size to its content
              flexShrink: 0,
            }}
          >
            {SLIDES.map((slide, i) => (
              <div key={i} data-sc="1" style={{ height: "100%", flexShrink: 0 }}>
                <SlideCard slide={slide} />
              </div>
            ))}
          </div>
        </div>

        {/* Dot indicators */}
        <div style={{ display: "flex", justifyContent: "center", gap: "8px", padding: "16px 0 clamp(16px,3vh,32px)", flexShrink: 0 }}>
          {SLIDES.map((_, i) => (
            <div key={i} style={{ width: i === dot ? "28px" : "8px", height: "8px", borderRadius: "999px", background: i === dot ? "#111" : "rgba(0,0,0,.18)", transition: "all .4s cubic-bezier(.34,1.56,.64,1)" }} />
          ))}
        </div>
      </div>

      {/* ── LAYER 7: stat cards ────────────────────────────────────────────── */}
      <div
        ref={contentRef}
        style={{
          position: "absolute", inset: 0, zIndex: 30,
          background: "#111", opacity: 0, pointerEvents: "none",
          overflow: "hidden", display: "flex", flexDirection: "column",
        }}
      >
        {[16, 33, 50, 67, 84].map((p) => (
          <div key={p} style={{ position: "absolute", top: 0, bottom: 0, left: `${p}%`, width: "1px", background: "rgba(255,255,255,.04)", pointerEvents: "none" }} />
        ))}
        <div style={{ position: "absolute", top: "clamp(20px,3vh,36px)", left: "clamp(24px,3.5vw,52px)", display: "flex", alignItems: "center", gap: "10px", zIndex: 4 }}>
          <span style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: "11px", letterSpacing: "5px", color: "rgba(255,255,255,.35)", textTransform: "uppercase" }}>Why us</span>
          <div style={{ width: "32px", height: "1px", background: "rgba(255,255,255,.18)" }} />
        </div>
        <div style={{ position: "absolute", bottom: "clamp(12px,2vh,24px)", left: "clamp(24px,3.5vw,52px)", fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: "clamp(4rem,11vw,10rem)", fontWeight: 900, color: "rgba(255,255,255,.04)", lineHeight: 1, letterSpacing: "-.03em", userSelect: "none", pointerEvents: "none", zIndex: 0 }}>Impact</div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "clamp(12px,1.8vw,22px)", flex: 1, padding: "clamp(60px,10vh,100px) clamp(24px,4vw,60px) clamp(24px,4vh,48px)", position: "relative", zIndex: 3, flexWrap: "wrap" }}>
          {STATS.map((card, i) => (
            <StatCard key={i} card={card} cardRef={(el) => (cardRefs.current[i] = el)} innerRef={(el) => (innerRefs.current[i] = el)} />
          ))}
        </div>
      </div>
    </div>
  );
}