import React, { Suspense, useEffect, useLayoutEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, Environment } from '@react-three/drei';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Target, Rocket, ShieldCheck, Users } from 'lucide-react';

import bangaloreVideo from '../assets/Bangalore.mp4';
import cubeModel from '../assets/free__rubiks_cube_3d.glb?url';

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────────────────────────
   DATA
   side = which side the TEXT goes → cube goes to OPPOSITE side
───────────────────────────────────────────────────────────────── */
const storyItems = [
  {
    step: '01',
    eyebrow: 'Vision',
    side: 'left',       // text left  → cube right
    accent: '#d946ef',
    icon: Target,
    title: 'Our Vision',
    text: `To transform Bengaluru into Asia's premier educational destination, offering world-class guidance, strong academic pathways, and partnerships that open the right doors.`,
  },
  {
    step: '02',
    eyebrow: 'Mission',
    side: 'right',      // text right → cube left
    accent: '#22d3ee',
    icon: Rocket,
    title: 'Our Mission',
    text: `To connect students with trusted opportunities, simplify the admission journey, and create a clear route from ambition to achievement.`,
  },
  {
    step: '03',
    eyebrow: 'Values',
    side: 'left',       // text left  → cube right
    accent: '#f59e0b',
    icon: ShieldCheck,
    title: 'Our Values',
    text: `Integrity, clarity, and care. We believe every student deserves honest direction, a calm process, and a future built with confidence.`,
  },
  {
    step: '04',
    eyebrow: 'Support',
    side: 'right',      // text right → cube left
    accent: '#a855f7',
    icon: Users,
    title: 'Our Support',
    text: `From choosing the right course to understanding the next steps, we stay with students and families through the full journey.`,
  },
];

/* ─────────────────────────────────────────────────────────────────
   CUBE – Three.js model with idle rotation animation
───────────────────────────────────────────────────────────────── */
function SolvingCube({ scale = 0.2 }) {
  const { scene } = useGLTF(cubeModel);
  const groupRef  = useRef(null);

  useEffect(() => {
    if (!groupRef.current) return;
    const rot = groupRef.current.rotation;
    const pos = groupRef.current.position;

    const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.28 });
    tl.to(rot, { y: 0.65,  x:  0.28, z:  0.08, duration: 0.80, ease: 'power2.inOut' })
      .to(rot, { y: 1.25,  x: -0.16, z: -0.10, duration: 0.74, ease: 'power2.inOut' })
      .to(rot, { y: 1.90,  x:  0.22, z:  0.08, duration: 0.74, ease: 'power2.inOut' })
      .to(rot, { y: 2.55,  x:  0.02, z:  0.00, duration: 0.70, ease: 'power2.inOut' })
      .to(rot, { y: 3.15,  x:  0.18, z: -0.08, duration: 0.74, ease: 'power2.inOut' })
      .to(rot, { y: 3.80,  x: -0.08, z:  0.06, duration: 0.74, ease: 'power2.inOut' })
      .to(rot, { y: 4.28,  x:  0.00, z:  0.00, duration: 0.72, ease: 'power2.inOut' });

    const floatTween = gsap.to(pos, {
      y: 0.08, duration: 1.5, repeat: -1, yoyo: true, ease: 'sine.inOut',
    });

    return () => { tl.kill(); floatTween.kill(); };
  }, []);

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <primitive object={scene} scale={scale} position={[0, 0, 0]} rotation={[0.35, 0.55, 0]} />
    </group>
  );
}

function CubeCanvas({ scale = 0.2, cameraZ = 9.2 }) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0, cameraZ], fov: 40 }}
      style={{ width: '100%', height: '100%', pointerEvents: 'none' }}
    >
      <ambientLight intensity={0.85} />
      <directionalLight position={[5, 8, 6]}   intensity={1.5} color="#ffffff" />
      <directionalLight position={[-4, 2, 4]}  intensity={0.9} color="#b5ff4d" />
      <pointLight      position={[2, -2, 4]}   intensity={0.9} color="#64c8ff" />
      <Suspense fallback={null}>
        <SolvingCube scale={scale} />
        <Environment preset="city" />
      </Suspense>
    </Canvas>
  );
}

/* ─────────────────────────────────────────────────────────────────
   STORY PANEL — one cinematic section
───────────────────────────────────────────────────────────────── */
function StorySection({ item, sectionRef, panelRef }) {
  const isLeft = item.side === 'left';  // true = text on left
  const Icon   = item.icon;

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen items-center overflow-hidden px-4 sm:px-6 lg:px-8"
      style={{
        background:
          'linear-gradient(180deg,rgba(5,5,5,0.98) 0%,rgba(10,7,17,0.96) 50%,rgba(5,5,5,0.99) 100%)',
      }}
    >
      {/* subtle bg tint per section */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(circle at ${isLeft ? '25% 50%' : '75% 50%'}, ${item.accent}12 0%, transparent 55%)`,
        }}
      />

      <div className="mx-auto grid w-full max-w-[1500px] items-center gap-10 lg:grid-cols-2">
        {/*
          Text column — order-1 when left, order-2 when right
          Cube column is a visual placeholder ONLY on desktop so the
          grid splits correctly; the real cube is in the fixed overlay.
        */}

        {/* TEXT PANEL */}
        <div className={isLeft ? 'lg:order-1' : 'lg:order-2'}>
          <div
            ref={panelRef}
            style={{
              maxWidth: 640,
              width: '100%',
              marginLeft:  isLeft ? 0 : 'auto',
              marginRight: isLeft ? 'auto' : 0,
              opacity: 0,
              borderRadius: '2rem',
              border: '1px solid rgba(255,255,255,0.10)',
              background: 'rgba(8,8,18,0.55)',
              backdropFilter: 'blur(28px)',
              WebkitBackdropFilter: 'blur(28px)',
              padding: 'clamp(1.6rem,3vw,2.8rem)',
              boxShadow:
                '0 32px 80px rgba(0,0,0,0.55),inset 0 1px 0 rgba(255,255,255,0.06)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* top glow line */}
            <div style={{
              position: 'absolute', top: 0, left: '12%', right: '12%', height: 1,
              background: `linear-gradient(to right,transparent,${item.accent}90,transparent)`,
            }} />

            {/* corner blob */}
            <div style={{
              position: 'absolute',
              top: '-45%', [isLeft ? 'left' : 'right']: '-16%',
              width: '75%', height: '75%', borderRadius: '50%',
              background: `radial-gradient(circle,${item.accent}22 0%,transparent 70%)`,
              filter: 'blur(38px)', pointerEvents: 'none',
            }} />

            {/* icon */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: 52, height: 52, borderRadius: 14,
              background: `${item.accent}18`,
              border: `1px solid ${item.accent}35`,
              boxShadow: `0 0 22px ${item.accent}20`,
              marginBottom: '1.3rem',
            }}>
              <Icon size={22} color={item.accent} />
            </div>

            {/* eyebrow */}
            <p style={{
              fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.55em',
              textTransform: 'uppercase', color: item.accent,
              marginBottom: '0.6rem', fontFamily: "'DM Sans',sans-serif",
            }}>
              {item.step} / {item.eyebrow}
            </p>

            {/* title */}
            <h2 style={{
              fontFamily: "'Bebas Neue',sans-serif",
              fontSize: 'clamp(2.6rem,4.7vw,4.4rem)',
              lineHeight: 0.95, letterSpacing: '0.02em',
              color: '#f0f0f0', marginBottom: '1rem',
            }}>
              {item.title}
            </h2>

            {/* rule */}
            <div style={{
              width: 40, height: 2,
              background: `linear-gradient(to right,${item.accent},transparent)`,
              marginBottom: '1rem',
            }} />

            {/* body */}
            <p style={{
              fontSize: 'clamp(0.92rem,1.12vw,1.05rem)',
              color: 'rgba(255,255,255,0.58)',
              lineHeight: 1.9, fontWeight: 300,
              fontFamily: "'DM Sans',sans-serif",
            }}>
              {item.text}
            </p>
          </div>
        </div>

        {/*
          Spacer column — occupies the grid cell where the cube visually sits.
          The real cube travels through this space in the fixed overlay.
          Hidden on mobile (cube is centered on mobile instead).
        */}
        <div
          className={['hidden lg:block', isLeft ? 'lg:order-2' : 'lg:order-1'].join(' ')}
          aria-hidden="true"
        />
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────
   MAIN ABOUT PAGE
───────────────────────────────────────────────────────────────── */
const About = () => {
  const introRef         = useRef(null);
  const introTitleRef    = useRef(null);
  const introSubRef      = useRef(null);
  const storyRef         = useRef(null);   // wraps all 4 story sections
  const cubeWrapRef      = useRef(null);   // the fixed positioned cube box

  const sectionRefs = useRef([]);
  const panelRefs   = useRef([]);

  const setSectionRef = (i) => (el) => { sectionRefs.current[i] = el; };
  const setPanelRef   = (i) => (el) => { panelRefs.current[i]   = el; };

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {

      /* ── 1. Cube starts centered, centered in viewport ── */
      gsap.set(cubeWrapRef.current, {
        left: '50%',
        top:  '50%',
        xPercent: -50,
        yPercent: -50,
        scale: 1,
      });

      /* ── 2. Intro title / sub fade up on load ── */
      gsap.fromTo(
        [introTitleRef.current, introSubRef.current],
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 1.1, stagger: 0.1, ease: 'power3.out' }
      );

      /* ── 3. Intro text fades as user scrolls past hero ── */
      gsap.to([introTitleRef.current, introSubRef.current], {
        opacity: 0.1, y: -22,
        scrollTrigger: {
          trigger: introRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });

      /* ── 4. Cube travels through story sections ──────────────
         The cube wrapper is `position: fixed` with `left / top`
         as CSS properties. GSAP animates `left` and `top` directly
         (percentage strings), so there's no conflict with xPercent.

         We pre-calculate the target positions:
           - When text is LEFT  → cube sits on the RIGHT  half → left ≈ 75%
           - When text is RIGHT → cube sits on the LEFT   half → left ≈ 25%
           - top stays centered vertically → top = 50%

         The cube size is clamp(220px,28vw,380px) so center offset
         is −50% via xPercent/yPercent which GSAP keeps constant;
         we only animate `left` and `top` (absolute % of viewport).
      ─────────────────────────────────────────────────────────── */

      // Where the cube lives while hero is visible
      const heroPose  = { left: '50%', top: '50%', scale: 1   };

      // Per-section cube poses (opposite side from text)
      const cubePoses = storyItems.map((item) => ({
        left:  item.side === 'left' ? '74%' : '26%',
        top:   '50%',
        scale: 0.88,
      }));

      /* Build one scrubbed timeline across the entire story block */
      const cubeTl = gsap.timeline({
        scrollTrigger: {
          trigger: storyRef.current,
          start:  'top bottom',   // begins as story block enters viewport
          end:    'bottom bottom',
          scrub:  1.2,
          invalidateOnRefresh: true,
        },
      });

      /* Move from hero center → section 1 pose */
      cubeTl.to(cubeWrapRef.current, {
        left:  cubePoses[0].left,
        top:   cubePoses[0].top,
        scale: cubePoses[0].scale,
        duration: 1,
        ease: 'power3.inOut',
      });

      /* Section 1 → 2 → 3 → 4 */
      for (let i = 1; i < cubePoses.length; i++) {
        cubeTl.to(cubeWrapRef.current, {
          left:  cubePoses[i].left,
          top:   cubePoses[i].top,
          scale: cubePoses[i].scale,
          duration: 1,
          ease: 'power3.inOut',
        });
      }

      /* ── 5. Panel reveal — each panel slides in from its side ── */
      sectionRefs.current.forEach((sectionEl, index) => {
        const panelEl = panelRefs.current[index];
        if (!sectionEl || !panelEl) return;

        const fromX = storyItems[index].side === 'left' ? -80 : 80;

        gsap.fromTo(
          panelEl,
          { opacity: 0, x: fromX, y: 16, scale: 0.97 },
          {
            opacity: 1, x: 0, y: 0, scale: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionEl,
              start: 'top 72%',
              end:   'top 38%',
              scrub: 1.0,
            },
          }
        );
      });

    }); // end gsap.context

    return () => ctx.revert();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,700;1,9..40,300&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        html { scroll-behavior: smooth; }

        @keyframes sib-float {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-8px); }
        }
      `}</style>

      <main style={{ background: '#050505', color: '#f0f0f0', fontFamily: "'DM Sans',sans-serif", overflowX: 'hidden' }}>

        {/* ── FIXED CUBE LAYER ──────────────────────────────────────
            Lives in a fixed full-screen container (z-index 10).
            The cube wrapper is moved by GSAP using left/top %.
            xPercent/yPercent stay at -50/-50 permanently so the
            cube is always centered around its own midpoint.
        ─────────────────────────────────────────────────────────── */}
        <div
          aria-hidden="true"
          style={{ position: 'fixed', inset: 0, zIndex: 10, pointerEvents: 'none' }}
        >
          <div
            ref={cubeWrapRef}
            style={{
              position: 'absolute',
              /* left / top are animated by GSAP — start values set via gsap.set */
              left: '50%',
              top:  '50%',
              width:  'clamp(280px,34vw,520px)',
              height: 'clamp(280px,34vw,520px)',
              /* xPercent/yPercent handle the -50% centering offset */
              transform: 'translate(-50%,-50%)',
              filter: 'drop-shadow(0 32px 70px rgba(0,0,0,0.65))',
              willChange: 'left, top, transform',
            }}
          >
            <CubeCanvas scale={0.28} cameraZ={8.2} />
          </div>

          {/* radial vignette so cube blends with dark bg */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(circle at center,transparent 16%,rgba(0,0,0,0.32) 50%,rgba(0,0,0,0.72) 100%)',
          }} />
        </div>

        {/* ── HERO / INTRO ─────────────────────────────────────────── */}
        <section
          ref={introRef}
          style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden', background: '#050505' }}
        >
          {/* Video background */}
          <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
            <video
              autoPlay loop muted playsInline
              style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.32, filter: 'brightness(0.7) saturate(0.88)' }}
            >
              <source src={bangaloreVideo} type="video/mp4" />
            </video>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to bottom,rgba(5,5,5,0.76) 0%,rgba(5,5,5,0.30) 40%,rgba(5,5,5,0.42) 70%,rgba(5,5,5,0.94) 100%)',
          }} />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse 88% 88% at 50% 50%,transparent 34%,rgba(5,5,5,0.82) 100%)',
          }} />
        </div>

          {/* Hero text — sits above the cube (z-index 20) */}
          <div style={{
            position: 'relative', zIndex: 20,
            minHeight: '100vh', display: 'grid', placeItems: 'center',
            textAlign: 'center', padding: '2rem',
          }}>
            <div style={{ maxWidth: 1100 }}>
              <p style={{
                margin: 0, fontSize: '0.64rem', fontWeight: 700,
                letterSpacing: '0.62em', textTransform: 'uppercase',
                color: 'rgba(181,255,77,0.8)', marginBottom: '1.2rem',
              }}>
                About Us
              </p>

              <h1
                ref={introTitleRef}
                style={{
                  margin: 0,
                  fontFamily: "'Bebas Neue',sans-serif",
                  fontSize: 'clamp(4.8rem,14vw,13.6rem)',
                  lineHeight: 0.84, letterSpacing: '0.025em',
                  color: '#ffffff',
                  textShadow: '0 0 80px rgba(181,255,77,0.1)',
                }}
              >
                Study in
                <br />
                <span style={{ color: 'transparent', WebkitTextStroke: '2px rgba(255,255,255,0.32)' }}>
                  Bengaluru
                </span>
              </h1>

              <p
                ref={introSubRef}
                style={{
                  margin: '1.4rem auto 0', maxWidth: 820,
                  fontSize: 'clamp(0.95rem,1.4vw,1.25rem)', lineHeight: 1.8,
                  color: 'rgba(255,255,255,0.80)',
                }}
              >
                Welcome to the Admission Portal for Study in Bengaluru. We are dedicated to providing
                a transformative educational experience and guiding you on your academic journey.
              </p>

              {/* Scroll indicator */}
              <div style={{ marginTop: '2.2rem', display: 'flex', justifyContent: 'center' }}>
                <div style={{
                  width: 18, height: 28, border: '1px solid rgba(255,255,255,0.18)',
                  borderRadius: 20, display: 'flex', justifyContent: 'center', paddingTop: 5,
                  background: 'rgba(255,255,255,0.02)',
                }}>
                  <div style={{
                    width: 3, height: 6, borderRadius: 3, background: '#b5ff4d',
                    animation: 'sib-float 1.6s ease-in-out infinite',
                  }} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── STORY SECTIONS ────────────────────────────────────────── */}
        <section ref={storyRef} style={{ position: 'relative' }}>
          {storyItems.map((item, index) => (
            <StorySection
              key={item.step}
              item={item}
              sectionRef={setSectionRef(index)}
              panelRef={setPanelRef(index)}
            />
          ))}
        </section>

      </main>
    </>
  );
};

export default About;

useGLTF.preload(cubeModel);
