import { useLayoutEffect, useRef, Suspense, Component, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, ContactShadows, useGLTF, OrbitControls, PerspectiveCamera, Float as DreiFloat } from '@react-three/drei';
import { Landmark, BookOpen, Building2, MousePointer2, Zap, GraduationCap, Headset, MapPin, BadgeCheck } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';

import img1 from '../assets/img1.jpg';
import img2 from '../assets/img2.jpg';
import img3 from '../assets/img3.jpg';
import img4 from '../assets/img4.jpg';
import img5 from '../assets/img5.jpg';
import img6 from '../assets/img6.jpg';

gsap.registerPlugin(ScrollTrigger);

const MOBILE_QUERY = '(max-width: 767px)';

function isMobileViewport() {
  return typeof window !== 'undefined' && window.matchMedia(MOBILE_QUERY).matches;
}

/* ── ERROR BOUNDARY ─────────────────────────────────────────────── */
class CanvasErrorBoundary extends Component {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) return <div className="hidden" />;
    return this.props.children;
  }
}

const aboutCards = [
  {
    title: 'Diverse Programs',
    desc: 'Explore a wide range of undergraduate, postgraduate, and doctoral programs in various disciplines.',
    icon: BookOpen,
    color: 'from-violet-400 to-violet-600',
    shadow: 'shadow-violet-500/20',
  },
  {
    title: 'Top Institutions',
    desc: 'Access to premier universities and colleges across Bengaluru with diverse program offerings.',
    icon: Landmark,
    color: 'from-violet-400 to-violet-600',
    shadow: 'shadow-violet-500/20',
  },
  {
    title: 'City Advantages',
    desc: "Benefit from Bengaluru's tech ecosystem, cultural diversity, and excellent career opportunities.",
    icon: Building2,
    color: 'from-violet-400 to-orange-500',
    shadow: 'shadow-violet-500/20',
  },
]

const bengaluruData = [
  { title: 'Innovation Hub', desc: 'India’s Silicon Valley, a global leader in IT, biotechnology, and innovation.', img: img1, color: 'from-violet-600/20' },
  { title: 'Global Opportunities', desc: 'A thriving economy and multinational companies, the perfect launchpad for a career.', img: img2, color: 'from-violet-600/20' },
  { title: 'Top Institutions', desc: 'Home to prestigious universities offering world-class education for every student.', img: img3, color: 'from-violet-600/20' },
  { title: 'Cultural Melting Pot', desc: 'A vibrant mix of cultures and traditions, making it a welcoming city for everyone.', img: img4, color: 'from-orange-600/20' },
  { title: 'Affordable Living', desc: 'High quality of life at a reasonable cost for students and professionals alike.', img: img5, color: 'from-violet-600/20' },
  { title: 'Thriving Ecosystem', desc: 'From startups to giants, a dynamic ecosystem for learning and growth.', img: img6, color: 'from-violet-600/20' },
]

function AboutCardsSection() {
  const sectionRef = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const cards = Array.from(sectionRef.current?.querySelectorAll('.about-card') || [])
      if (!cards.length) return

      gsap.set(cards, {
        y: window.innerHeight,
        scale: 0.4,
        opacity: 0,
        rotationX: 45,
        transformOrigin: 'center bottom',
      })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=200%',
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      })

      tl.to(cards[1], { y: 0, scale: 1.1, opacity: 1, rotationX: 0, duration: 1, ease: 'power2.out' })
        .to(cards[0], { y: 40, scale: 0.95, opacity: 1, rotationX: 0, rotationZ: -6, duration: 1, ease: 'power2.out' }, '-=0.4')
        .to(cards[2], { y: 40, scale: 0.95, opacity: 1, rotationX: 0, rotationZ: 6, duration: 1, ease: 'power2.out' }, '-=0.8')
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const handleMouseMove = (e) => {
    const card = e.currentTarget
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2

    gsap.to(card, {
      x: x * 0.1,
      y: y * 0.1,
      rotationY: x * 0.05,
      rotationX: -y * 0.05,
      duration: 0.5,
      ease: 'power2.out',
    })
  }

  const handleMouseLeave = (e) => {
    gsap.to(e.currentTarget, {
      x: 0,
      y: 0,
      rotationY: 0,
      rotationX: 0,
      duration: 0.5,
      ease: 'power2.out',
    })
  }

  return (
    <section
      ref={sectionRef}
      className="relative -mt-6 flex min-h-[88svh] w-full items-center justify-center overflow-hidden py-6 md:-mt-10 md:min-h-[100svh] md:py-0"
      style={{ perspective: '2000px' }}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/10 blur-[150px]" />
      </div>
      <div className="relative z-10 grid w-full max-w-6xl grid-cols-1 gap-4 px-4 sm:px-6 md:grid-cols-3 md:gap-2">
        {aboutCards.map((card, i) => (
          <div
            key={card.title}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={`about-card group relative flex flex-col items-center rounded-[2rem] border border-white/10 bg-[#431f60]/80 p-6 text-center shadow-2xl backdrop-blur-2xl will-change-transform sm:p-8 md:rounded-[3.5rem] md:p-12 ${
              i === 1 ? 'z-20' : 'z-10'
            }`}
          >
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/5 blur-[40px] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <div className={`mb-6 flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-gradient-to-br ${card.color} shadow-2xl ${card.shadow} transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6 sm:mb-8 sm:h-24 sm:w-24 sm:rounded-[2rem]`}>
              <card.icon className="h-10 w-10 text-white sm:h-12 sm:w-12" />
            </div>
            <h3 className="mb-4 text-xl font-black uppercase tracking-tight text-white sm:mb-6 sm:text-2xl md:text-3xl">{card.title}</h3>
            <p className="text-base font-light leading-relaxed text-white/60 sm:text-lg">{card.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ── BACKGROUND PARTICLES ────────────────────── */
const features = [
  {
    title: 'Top Institutions',
    desc: 'Access to premier universities and colleges across Bengaluru with diverse program offerings.',
    icon: GraduationCap,
    color: 'from-violet-500 to-violet-400',
  },
  {
    title: 'Diverse Programs',
    desc: 'Explore a wide range of undergraduate, postgraduate, and doctoral disciplines.',
    icon: BookOpen,
    color: 'from-violet-500 to-violet-400',
  },
  {
    title: 'City Advantages',
    desc: "Benefit from Bengaluru's tech ecosystem, cultural diversity, and career opportunities.",
    icon: MapPin,
    color: 'from-violet-500 to-violet-400',
  },
  {
    title: 'Expert Guidance',
    desc: 'Get personalized consultations and end-to-end support from industry pros.',
    icon: BadgeCheck,
    color: 'from-orange-500 to-violet-400',
  },
]

function WhyChooseSection() {
  const containerRef = useRef(null)
  const coreRef = useRef(null)
  const orbitalRef = useRef(null)
  const portalFlashRef = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray('.why-card')
      const cardContents = gsap.utils.toArray('.why-card-content')

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=400%',
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      })

      tl.fromTo(
        coreRef.current,
        { scale: 0, opacity: 0, rotateY: -90 },
        { scale: 1, opacity: 1, rotateY: 0, duration: 1.5, ease: 'power4.out' }
      )

      tl.to(
        orbitalRef.current,
        {
          rotate: 360,
          duration: 3,
          ease: 'none',
        },
        'spin'
      )

      cardContents.forEach((cardContent) => {
        tl.to(cardContent, { rotate: -360, duration: 3, ease: 'none' }, 'spin')
      })

      tl.to(coreRef.current, {
        rotateY: 180,
        scale: 1.1,
        duration: 1.2,
        ease: 'back.inOut(1.7)',
      }, '+=0.2')

      tl.to(coreRef.current, {
        scale: 40,
        duration: 2,
        ease: 'expo.in',
      }, 'zoom')

      tl.to(cards, { opacity: 0, scale: 0, duration: 1 }, 'zoom')
      tl.to('.bg-glow', { opacity: 0, scale: 0, duration: 1 }, 'zoom')

      tl.to(portalFlashRef.current, {
        opacity: 1,
        duration: 0.5,
        backgroundColor: '#431f60',
      }, 'zoom+=1.5')
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={containerRef}
      className="relative flex min-h-[100svh] w-full items-center justify-center overflow-hidden bg-[#431f60] perspective-1000 py-16 md:h-screen md:py-0"
      style={{ perspective: '2000px' }}
    >
      <div ref={portalFlashRef} className="absolute inset-0 z-[100] opacity-0 pointer-events-none" />

      <div className="bg-glow absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/10 blur-[180px]" />

      <div className="relative flex h-full w-full items-center justify-center">
        <div ref={orbitalRef} className="relative flex h-[620px] w-[620px] scale-[0.65] items-center justify-center preserve-3d sm:scale-[0.82] md:scale-100">
          <div ref={coreRef} className="relative z-50 preserve-3d h-64 w-64 md:h-80 md:w-80">
            <div className="backface-hidden absolute inset-0 flex flex-col items-center justify-center rounded-full border border-white/20 bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-3xl shadow-[0_0_50px_rgba(168,85,247,0.3)]">
              <h2 className="text-center text-xl font-black uppercase tracking-tighter text-white md:text-3xl">
                Why Choose <br />
                <span className="text-violet-400 underline decoration-violet-500/50 underline-offset-8">StudyIn</span><br />
                Bengaluru?
              </h2>
            </div>

            <div className="backface-hidden absolute inset-0 flex items-center justify-center rounded-full border-2 border-violet-500 bg-[#431f60] shadow-[0_0_80px_rgba(168,85,247,0.6)]" style={{ transform: 'rotateY(180deg)' }}>
              <span className="animate-pulse text-2xl font-bold italic tracking-widest text-white">Why Bengaluru?</span>
            </div>
          </div>

          {features.map((f, i) => {
              const positions = [
                { top: '50%', left: '50%', transform: 'translate(-50%, -215%)' },
                { top: '50%', left: '50%', transform: 'translate(112%, -50%)' },
                { top: '50%', left: '50%', transform: 'translate(-50%, 115%)' },
                { top: '50%', left: '50%', transform: 'translate(-212%, -50%)' },
              ]
            const Icon = f.icon
            return (
                <div
                  key={f.title}
                  className="why-card absolute z-40"
                  style={{
                    width: '300px',
                    ...positions[i],
                  }}
                >
                <div className="why-card-content preserve-3d">
                  <div className={`rounded-3xl bg-gradient-to-br ${f.color} p-[1.5px] shadow-2xl`}>
                    <div className="rounded-[calc(1.5rem-1px)] bg-[#431f60]/95 p-6 backdrop-blur-2xl">
                      <div className={`mb-3 inline-flex rounded-xl bg-gradient-to-br ${f.color} p-2.5`}>
                        <Icon className="text-white" size={22} />
                      </div>
                      <h3 className="mb-2 text-lg font-bold uppercase text-white">{f.title}</h3>
                      <p className="text-sm leading-relaxed text-white/50">{f.desc}</p>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function WhyBengaluruSection() {
  const triggerRef = useRef(null)
  const contentRef = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerRef.current,
          start: 'top top',
          end: '+=500%',
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })

      tl.fromTo(
        contentRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.2, ease: 'power3.out' }
      )

      tl.to(
        contentRef.current,
        {
          x: '-500vw',
          ease: 'none',
          duration: 4,
        },
        '<'
      )
    }, triggerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={triggerRef} className="relative -mt-10 overflow-hidden bg-[#431f60] py-10 md:-mt-16 md:py-0">
      <div ref={contentRef} className="horizontal-wrapper flex min-h-[100svh] w-full flex-col md:h-screen md:w-[600vw] md:flex-row">
        {bengaluruData.map((item, index) => (
          <div key={item.title} className="relative flex min-h-[100svh] w-full items-center justify-center px-6 py-20 md:h-screen md:w-screen md:px-16 md:py-0 lg:px-32">
            <div className={`absolute inset-0 bg-gradient-to-r ${item.color} to-transparent opacity-30`} />

            <div className="relative z-10 grid w-full max-w-7xl grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-12">
              <div className="space-y-5">
                <h2 className="absolute top-10 left-4 text-5xl font-black uppercase tracking-tighter text-white/10 md:top-20 md:left-20 md:text-8xl">
                  Bengaluru
                </h2>
                <span className="font-mono text-lg text-violet-500 md:text-2xl">0{index + 1}</span>
                <h3 className="text-4xl font-black uppercase italic leading-none text-white md:text-7xl">
                  {item.title}
                </h3>
                <p className="max-w-lg border-l-4 border-violet-500 pl-6 text-base leading-relaxed text-white/60 md:text-xl">
                  {item.desc}
                </p>
              </div>

              <div className="group relative">
                <div className="absolute -inset-4 rounded-[3rem] bg-violet-500/20 opacity-0 blur-3xl transition-opacity duration-1000 group-hover:opacity-100" />
                <img
                  src={item.img}
                  alt={item.title}
                  className="relative z-10 aspect-[4/5] w-full rounded-[3rem] border border-white/10 object-cover shadow-2xl"
                />
              </div>
            </div>

            <div className="absolute bottom-10 left-1/2 flex -translate-x-1/2 gap-4">
              {bengaluruData.map((_, i) => (
                <div
                  key={i}
                  className={`h-1 transition-all duration-500 ${i === index ? 'w-12 bg-violet-500' : 'w-4 bg-white/20'}`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function EducationParticles({ count = 30 }) {
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const x = THREE.MathUtils.randFloatSpread(15);
      const y = THREE.MathUtils.randFloatSpread(15);
      const z = THREE.MathUtils.randFloatSpread(10) - 5;
      const scale = THREE.MathUtils.randFloat(0.05, 0.2); // Smaller, more elegant particles
      const speed = THREE.MathUtils.randFloat(0.1, 0.3);
      const type = i % 3;
      temp.push({ x, y, z, scale, speed, type });
    }
    return temp;
  }, [count]);

  return (
    <group>
      {particles.map((p, i) => (
        <DreiFloat key={i} speed={p.speed * 4} rotationIntensity={1.5} floatIntensity={2}>
          <mesh position={[p.x, p.y, p.z]} scale={p.scale}>
            {p.type === 0 ? <boxGeometry args={[1, 1, 1]} /> : 
             p.type === 1 ? <sphereGeometry args={[0.6, 16, 16]} /> : 
             <torusGeometry args={[0.5, 0.15, 8, 20]} />}
            <meshStandardMaterial 
              color={p.type === 0 ? "#f472b6" : p.type === 1 ? "#22d3ee" : "#c084fc"} 
              transparent 
              opacity={0.3} 
              roughness={0.2}
              metalness={0.8}
            />
          </mesh>
        </DreiFloat>
      ))}
    </group>
  );
}

/* ── HERO MODEL ────────────────────────────────────────── */
function EducationModel() {
  const { scene } = useGLTF('/3d_sketchbook_6_-_education_icon.glb');
  const ref = useRef();

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    // Adorable floating animation: gentle rotation and bobbing up/down
    ref.current.rotation.y = Math.sin(t / 3) * 0.15;
    ref.current.rotation.z = Math.cos(t / 4) * 0.05;
    ref.current.position.y = -0.2 + Math.sin(t * 1.5) * 0.08; 
  });

  return (
    <primitive 
      ref={ref} 
      object={scene} 
      scale={0.55} // <-- SHRUNK THE MODEL HERE
      position={[2.4, -0.2, 0]} // <-- REPOSITIONED TO FIT THE RIGHT COLUMN
    />
  );
}

/* ── SCENE ──────────────────────────────────────────────────────── */
function Scene3D() {
  return (
    <CanvasErrorBoundary>
      <Canvas dpr={[1, 2]} gl={{ antialias: true }}>
        <PerspectiveCamera makeDefault position={[0, 0, 5.5]} fov={38} />
        <ambientLight intensity={1.5} />
        <spotLight position={[5, 10, 5]} angle={0.25} penumbra={1} intensity={3} color="#ffffff" />
        <pointLight position={[-10, -10, -10]} color="#d946ef" intensity={2} />
        <pointLight position={[10, -5, 5]} color="#22d3ee" intensity={1.5} />

        <Suspense fallback={null}>
          <EducationParticles />
          <EducationModel />
          <Environment preset="city" />
          {/* Adjusted Contact Shadow to match new model position and scale */}
          <ContactShadows position={[2.4, -1.5, 0]} opacity={0.4} scale={4} blur={2.5} color="#431f60" />
        </Suspense>

        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          makeDefault 
          rotateSpeed={0.4}
          minPolarAngle={Math.PI / 2.5}
          maxPolarAngle={Math.PI / 1.5}
        />
      </Canvas>
    </CanvasErrorBoundary>
  );
}

/* ── ABOUT PAGE ─────────────────────────────────────────────────── */
const About = () => {
  const containerRef = useRef(null);
  const textStripRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Hero Entrance
      gsap.from('.reveal', { 
        y: 80, 
        opacity: 0, 
        skewY: 5,
        duration: 1.2, 
        stagger: 0.15, 
        ease: 'power4.out', 
        delay: 0.2 
      });

      // 3D Canvas Parallax
      gsap.to('.parallax-canvas', {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
        y: 200,
      });

      // Background Text Parallax (Horizontal Scroll)
      gsap.to('.parallax-text', {
        scrollTrigger: {
          trigger: textStripRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
          invalidateOnRefresh: true,
        },
        xPercent: -30,
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={containerRef} className="relative min-h-screen overflow-hidden bg-[#431f60] px-4 sm:px-6">
      
      {/* ── PARALLAX BACKGROUND TEXT ── */}

      {/* Global Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-violet-600/15 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-violet-600/10 blur-[150px] rounded-full" />
        <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.8)_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>

      {/* ── 3D HERO CANVAS ── */}
      <div className="parallax-canvas absolute inset-0 z-10 hidden h-screen pointer-events-none lg:block">
        <div className="absolute inset-0 pointer-events-auto">
          <Scene3D />
        </div>
      </div>

      {/* ── HERO SECTION ── */}
      <section className="relative z-20 flex min-h-[100svh] items-center px-0 py-20 pointer-events-auto lg:min-h-screen lg:px-24 lg:py-0 lg:pointer-events-none">
        <div className="container mx-auto grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-12">
          <div className="relative max-w-2xl text-center pointer-events-auto lg:text-left">
            
            {/* Adorable Floating Glass Badge */}
            <div className="reveal absolute -top-12 -left-8 hidden items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 shadow-[0_10px_30px_rgba(217,70,239,0.15)] backdrop-blur-md animate-[bounce_4s_infinite] md:flex">
              <span className="h-2 w-2 rounded-full bg-violet-400 shadow-[0_0_10px_#d946ef]"></span>
              <span className="text-xs font-bold text-white/80 uppercase tracking-widest">Est. 2024</span>
            </div>

            <div className="reveal inline-block px-5 py-2 mb-8 rounded-full border border-violet-500/20 bg-violet-500/10 backdrop-blur-xl uppercase tracking-[0.4em] text-[10px] text-violet-300 font-black shadow-[0_0_20px_rgba(34,211,238,0.1)]">
              Our Identity
            </div>
            
            <h1 className="reveal mb-6 text-[clamp(3rem,13vw,7rem)] font-black leading-[0.9] tracking-tighter text-white drop-shadow-2xl lg:mb-8 lg:text-[clamp(4rem,9vw,8rem)]">
              About <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-white to-violet-400">
                Study in
              </span><br />
              Bengaluru
            </h1>
            
            <p className="reveal mx-auto mb-8 max-w-lg text-base font-light leading-relaxed text-white/60 sm:text-lg lg:mx-0 lg:mb-10 lg:text-xl">
              Welcome to the premier admission ecosystem. We don't just process applications; we engineer <span className="text-white font-medium italic">transformative educational journeys</span>.
            </p>

            {/* Creative Scroll Indicator */}
            <div className="reveal flex items-center justify-center gap-4 opacity-60 lg:justify-start">
               <div className="h-px w-12 bg-gradient-to-r from-transparent to-white"></div>
               <span className="text-[9px] uppercase tracking-[0.5em] font-bold">Scroll to Explore</span>
            </div>
          </div>
          
          {/* Empty div to ensure layout holds space for the 3D canvas on the right */}
          <div className="hidden h-[500px] lg:block" />
        </div>
      </section>

      <section
        ref={textStripRef}
        className="relative z-10 -mt-6 overflow-hidden py-2 sm:-mt-8 sm:py-3 lg:-mt-10 lg:py-4"
      >
        <h2 className="parallax-text whitespace-nowrap text-[clamp(4.5rem,17vw,18rem)] font-black uppercase tracking-tighter text-white/6">
          Innovate • Empower • Transform • Discover •
        </h2>
      </section>

      <AboutCardsSection />
      <WhyChooseSection />
      <WhyBengaluruSection />
    </main>
  );
};

export default About;



