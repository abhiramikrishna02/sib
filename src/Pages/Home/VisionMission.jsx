import { useEffect, useRef } from 'react'

/* Add to your global CSS / index.html:
   @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Serif+Display&family=Space+Mono:wght@400;700&display=swap');
*/

const VISION_TEXT  = "To transform Bengaluru into Asia's premier educational destination by revolutionizing admission processes, offering unparalleled career guidance, and fostering collaborative partnerships with top-tier institutions and industry leaders."
const MISSION_TEXT = "To attract and empower students worldwide by providing access to world-class education in India, nurturing global talent, and creating a network of future leaders who drive innovation and positive change."
const VCHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789∑∂∇∞≈±⊕'
const MCHARS = '01⌥⌘→←↑↓◈◉▲▼◆♦∅Ø'

function initRain(canvas, color, chars, spd = 0.55) {
  const ctx = canvas.getContext('2d')
  let cols, drops, W, H
  function resize() {
    W = canvas.width  = canvas.offsetWidth
    H = canvas.height = canvas.offsetHeight
    cols  = Math.floor(W / 22)
    drops = Array.from({ length: cols }, () => Math.random() * -(H / 14))
  }
  resize()
  const ro = new ResizeObserver(resize)
  ro.observe(canvas)
  function draw() {
    ctx.clearRect(0, 0, W, H)
    ctx.font = '13px Space Mono, monospace'
    ctx.fillStyle = color
    for (let i = 0; i < cols; i++) {
      ctx.fillText(chars[Math.random() * chars.length | 0], i * 22 + 4, drops[i] * 14)
      if (drops[i] * 14 > H && Math.random() > 0.975) drops[i] = 0
      drops[i] += spd
    }
  }
  return { draw, cleanup: () => ro.disconnect() }
}

export default function VisionMissionSection() {
  const outerRef     = useRef(null)
  const missionRef   = useRef(null)
  const vCanvasRef   = useRef(null)
  const mCanvasRef   = useRef(null)
  const mTagsRef     = useRef(null)
  const vHeadRef     = useRef(null)
  const missionRevealed = useRef(false)

  /* rain loop */
  useEffect(() => {
    if (!vCanvasRef.current || !mCanvasRef.current) return
    const v = initRain(vCanvasRef.current, 'rgba(124,0,255,0.07)',    VCHARS, 0.55)
    const m = initRain(mCanvasRef.current, 'rgba(200,160,255,0.08)',  MCHARS, 0.5)
    let raf
    const loop = () => { v.draw(); m.draw(); raf = requestAnimationFrame(loop) }
    raf = requestAnimationFrame(loop)
    return () => { cancelAnimationFrame(raf); v.cleanup(); m.cleanup() }
  }, [])

  /* glitch interval */
  useEffect(() => {
    if (!vHeadRef.current) return
    const id = setInterval(() => {
      vHeadRef.current?.classList.add('vm-glitching')
      setTimeout(() => vHeadRef.current?.classList.remove('vm-glitching'), 200)
    }, 4200)
    return () => clearInterval(id)
  }, [])

  /* desktop scroll */
  useEffect(() => {
    const outer   = outerRef.current
    const mission = missionRef.current
    if (!outer || !mission) return
    let frame = 0

    function glitch(el) {
      el?.classList.add('vm-glitching')
      setTimeout(() => el?.classList.remove('vm-glitching'), 200)
    }

    function revealMission() {
      if (missionRevealed.current) return
      missionRevealed.current = true
      missionRef.current?.classList.add('vm-revealed')
      setTimeout(() => glitch(missionRef.current?.querySelector('.vm-headline')), 150)
      if (mTagsRef.current) mTagsRef.current.style.opacity = '1'
    }

    function hideMission() {
      missionRevealed.current = false
      missionRef.current?.classList.remove('vm-revealed')
      if (mTagsRef.current) mTagsRef.current.style.opacity = '0'
    }

    function update() {
      frame = 0
      if (window.innerWidth < 768) return
      const rect  = outer.getBoundingClientRect()
      const total = outer.offsetHeight - window.innerHeight
      if (total <= 0) return
      const p = Math.min(1, Math.max(0, -rect.top) / total)
      mission.style.transform = `translateY(${(1 - p) * 100}%) rotate(${(1 - p) * 10}deg)`
      if (p > 0.4)  revealMission()
      if (p <= 0.25) hideMission()
    }

    function requestUpdate() {
      if (frame) return
      frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate, { passive: true })

    /* mobile: IntersectionObserver */
    let obs
    if (window.innerWidth < 768) {
      obs = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) revealMission()
      }, { threshold: 0.3 })
      obs.observe(mission)
    }

    return () => {
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)
      if (frame) cancelAnimationFrame(frame)
      obs?.disconnect()
    }
  }, [])

  return (
    <section aria-label="Vision and Mission">
      <style>{`
        .vm-outer { position: relative; height: 300vh; }
        .vm-stage { position: sticky; top: 0; height: 100vh; overflow: hidden; }

        .vm-card {
          position: absolute; inset: 0; overflow: hidden;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          padding: clamp(1.5rem, 4vw, 4rem) clamp(1rem, 5vw, 6rem);
          text-align: center;
        }
        .vm-vision  { background: #f5f0ff; z-index: 1; }
        .vm-mission {
          background: #060010; z-index: 2;
          transform: translateY(100%) rotate(10deg);
          transform-origin: bottom left; will-change: transform;
        }

        .vm-canvas { position: absolute; inset: 0; pointer-events: none; z-index: 0; }

        .vm-grid {
          position: absolute; inset: 0; pointer-events: none; z-index: 0;
          background-size: 55px 55px;
          background-image: linear-gradient(rgba(0,0,0,1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(0,0,0,1) 1px, transparent 1px);
        }
        .vm-vision .vm-grid  { opacity: 0.04; }
        .vm-mission .vm-grid {
          opacity: 0.07;
          background-image: linear-gradient(rgba(200,160,255,1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(200,160,255,1) 1px, transparent 1px);
        }

        .vm-scan {
          position: absolute; left: 0; right: 0; height: 2px;
          pointer-events: none; z-index: 3;
          background: linear-gradient(90deg, transparent, rgba(200,160,255,0.5), transparent);
          animation: vm-scanline 5s linear infinite;
        }
        @keyframes vm-scanline {
          0%   { top: -2px; opacity: 0; } 5% { opacity: 1; }
          95%  { opacity: 1; } 100% { top: 100%; opacity: 0; }
        }

        .vm-num {
          position: absolute; font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(14rem, 35vw, 28rem); line-height: 1;
          letter-spacing: -0.05em; pointer-events: none; z-index: 0;
          bottom: -0.15em; right: -0.05em;
        }
        .vm-vision .vm-num  { color: rgba(124,0,255,0.05); }
        .vm-mission .vm-num { color: rgba(200,160,255,0.04); }

        .vm-orbit {
          position: absolute; border-radius: 50%; border: 1px dashed;
          pointer-events: none; z-index: 0;
          width: clamp(300px, 50vw, 560px); height: clamp(300px, 50vw, 560px);
          top: 50%; left: 50%; transform: translate(-50%, -50%);
        }
        .vm-vision .vm-orbit  { border-color: rgba(124,0,255,0.1); }
        .vm-mission .vm-orbit {
          border-color: rgba(200,160,255,0.1);
          animation: vm-spin 28s linear infinite;
        }
        @keyframes vm-spin { to { transform: translate(-50%, -50%) rotate(360deg); } }

        .vm-orbit-dot {
          position: absolute; width: 8px; height: 8px;
          border-radius: 50%; top: -4px; left: 50%; margin-left: -4px;
        }
        .vm-vision .vm-orbit-dot  { background: #7c00ff; box-shadow: 0 0 10px #7c00ff; }
        .vm-mission .vm-orbit-dot { background: #c8a0ff; box-shadow: 0 0 10px #c8a0ff; }

        .vm-content {
          position: relative; z-index: 1;
          display: flex; flex-direction: column;
          align-items: center; gap: clamp(0.6rem, 2vh, 1.1rem);
          max-width: 680px; width: 100%;
        }

        .vm-label {
          font-family: 'Space Mono', monospace;
          font-size: clamp(0.55rem, 1.4vw, 0.65rem);
          font-weight: 700; letter-spacing: 0.35em; text-transform: uppercase;
        }
        .vm-vision .vm-label  { color: rgba(80,0,160,0.5); }
        .vm-mission .vm-label { color: rgba(200,160,255,0.5); }

        .vm-headline {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(4rem, 11vw, 8.5rem);
          line-height: 0.88; letter-spacing: -0.01em;
          position: relative; user-select: none;
        }
        .vm-vision .vm-headline  { color: #12001a; }
        .vm-mission .vm-headline {
          color: transparent;
          -webkit-text-stroke: 1.5px rgba(200,160,255,0.45);
        }
        .vm-mission .vm-headline .fill {
          position: absolute; inset: 0; color: #fff;
          clip-path: inset(0 100% 0 0);
          transition: clip-path 0.9s cubic-bezier(0.16,1,0.3,1);
          -webkit-text-stroke: 0;
        }
        .vm-mission.vm-revealed .vm-headline .fill { clip-path: inset(0 0% 0 0); }

        .vm-headline::before, .vm-headline::after {
          content: attr(data-text); position: absolute;
          top: 0; left: 0; font-family: inherit; font-size: inherit;
          line-height: inherit; opacity: 0;
        }
        .vm-vision .vm-headline::before  { color: #7c00ff; clip-path: inset(20% 0 60% 0); }
        .vm-vision .vm-headline::after   { color: #00d4ff; clip-path: inset(65% 0 5% 0); }
        .vm-mission .vm-headline::before { color: #c8a0ff; clip-path: inset(15% 0 65% 0); }
        .vm-mission .vm-headline::after  { color: #00ffcc; clip-path: inset(65% 0 5% 0); }

        .vm-glitching::before, .vm-glitching::after {
          opacity: 1; animation: vm-glitch 0.18s steps(2, end) both;
        }
        @keyframes vm-glitch {
          0%  { transform: translate(0); }  20% { transform: translate(-4px, 2px); }
          40% { transform: translate(4px, -2px); } 60% { transform: translate(-2px, 4px); }
          80% { transform: translate(2px,-1px); } 100% { transform: translate(0); }
        }

        .vm-divider { width: clamp(40px, 8vw, 80px); height: 1px; flex-shrink: 0; }
        .vm-vision .vm-divider  { background: rgba(124,0,255,0.25); }
        .vm-mission .vm-divider { background: rgba(200,160,255,0.25); }

        .vm-body {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(1.05rem, 2.2vw, 1.35rem);
          line-height: 1.65; max-width: 52ch; text-align: center;
          min-height: 5.5em;
        }
        .vm-vision .vm-body  { color: rgba(18,0,26,0.72); }
        .vm-mission .vm-body { color: rgba(220,200,255,0.85); }

        .vm-cta {
          display: inline-flex; align-items: center; gap: 0.5rem;
          font-family: 'Space Mono', monospace;
          font-size: clamp(0.55rem, 1.4vw, 0.62rem);
          font-weight: 700; letter-spacing: 0.3em; text-transform: uppercase;
          cursor: pointer; background: none; border: none; padding: 0;
        }
        .vm-vision .vm-cta  { color: #5b1eaa; }
        .vm-mission .vm-cta { color: #c8a0ff; }

        .vm-cta-arrow {
          width: 26px; height: 26px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          transition: transform 0.3s;
        }
        .vm-vision .vm-cta-arrow  { background: #7c00ff; color: #fff; }
        .vm-mission .vm-cta-arrow {
          background: rgba(200,160,255,0.15); color: #c8a0ff;
          border: 1px solid rgba(200,160,255,0.3);
        }
        .vm-cta:hover .vm-cta-arrow { transform: rotate(45deg); }

        .vm-tags {
          display: flex; flex-wrap: wrap; gap: 0.5rem;
          justify-content: center; transition: opacity 0.5s;
        }
        .vm-tag {
          padding: 0.35rem 0.85rem; border-radius: 9999px;
          font-family: 'Space Mono', monospace;
          font-size: clamp(0.5rem, 1.3vw, 0.58rem);
          font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase;
          background: rgba(200,160,255,0.08);
          border: 1px solid rgba(200,160,255,0.22);
          color: rgba(220,200,255,0.82);
        }

        @media (max-width: 767px) {
          .vm-outer { height: auto; }
          .vm-stage { position: relative; height: auto; overflow: visible; }
          .vm-card  { position: relative; inset: auto; min-height: 100svh; padding: 2.5rem 1.25rem; }
          .vm-mission { transform: none !important; }
        }
      `}</style>

      <div ref={outerRef} className="vm-outer">
        <div className="vm-stage">

          {/* VISION */}
          <div className="vm-card vm-vision">
            <canvas ref={vCanvasRef} className="vm-canvas" />
            <div className="vm-grid" />
            <div className="vm-orbit"><span className="vm-orbit-dot" /></div>
            <div className="vm-content">
              <p className="vm-label">01 — Our Vision</p>
              <h2 ref={vHeadRef} className="vm-headline" data-text="OUR VISION">OUR VISION</h2>
              <div className="vm-divider" />
              <p className="vm-body">{VISION_TEXT}</p>
              <button className="vm-cta">
                View Roadmap
                <span className="vm-cta-arrow">
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                    <path d="M2 10L10 2M10 2H4M10 2V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </span>
              </button>
            </div>
          </div>

          {/* MISSION */}
          <div ref={missionRef} className="vm-card vm-mission">
            <canvas ref={mCanvasRef} className="vm-canvas" />
            <div className="vm-grid" />
            <div className="vm-scan" />
            <div className="vm-num">02</div>
            <div className="vm-orbit"><span className="vm-orbit-dot" /></div>
            <div className="vm-content">
              <h2 className="vm-headline" data-text="OUR MISSION">
                OUR MISSION
                <span className="fill">OUR MISSION</span>
              </h2>
              <div className="vm-divider" />
              <p className="vm-body">{MISSION_TEXT}</p>
              <div ref={mTagsRef} className="vm-tags" style={{ opacity: 0 }}>
                {['✦ Empower', '✦ Nurture', '✦ Lead'].map(t => (
                  <span key={t} className="vm-tag">{t}</span>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}