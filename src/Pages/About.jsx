import { useLayoutEffect, useRef, Suspense, Component, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, ContactShadows, useGLTF, OrbitControls, PerspectiveCamera, Float as DreiFloat } from '@react-three/drei';
import { Landmark, BookOpen, Building2, MousePointer2, Zap, GraduationCap, Headset } from 'lucide-react';
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
    color: 'from-cyan-400 to-blue-600',
    shadow: 'shadow-cyan-500/20',
  },
  {
    title: 'Top Institutions',
    desc: 'Access to premier universities and colleges across Bengaluru with diverse program offerings.',
    icon: Landmark,
    color: 'from-fuchsia-400 to-violet-600',
    shadow: 'shadow-fuchsia-500/20',
  },
  {
    title: 'City Advantages',
    desc: "Benefit from Bengaluru's tech ecosystem, cultural diversity, and excellent career opportunities.",
    icon: Building2,
    color: 'from-amber-400 to-orange-500',
    shadow: 'shadow-amber-500/20',
  },
]

const bengaluruData = [
  { title: 'Innovation Hub', desc: 'India’s Silicon Valley, a global leader in IT, biotechnology, and innovation.', img: img1, color: 'from-blue-600/20' },
  { title: 'Global Opportunities', desc: 'A thriving economy and multinational companies, the perfect launchpad for a career.', img: img2, color: 'from-purple-600/20' },
  { title: 'Top Institutions', desc: 'Home to prestigious universities offering world-class education for every student.', img: img3, color: 'from-cyan-600/20' },
  { title: 'Cultural Melting Pot', desc: 'A vibrant mix of cultures and traditions, making it a welcoming city for everyone.', img: img4, color: 'from-orange-600/20' },
  { title: 'Affordable Living', desc: 'High quality of life at a reasonable cost for students and professionals alike.', img: img5, color: 'from-emerald-600/20' },
  { title: 'Thriving Ecosystem', desc: 'From startups to giants, a dynamic ecosystem for learning and growth.', img: img6, color: 'from-pink-600/20' },
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
      className="relative flex h-screen w-full items-center justify-center overflow-hidden"
      style={{ perspective: '2000px' }}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/10 blur-[150px]" />
      </div>
      <div className="relative z-10 grid w-full max-w-6xl grid-cols-1 gap-6 px-6 md:grid-cols-3 md:gap-2">
        {aboutCards.map((card, i) => (
          <div
            key={card.title}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={`about-card group relative flex flex-col items-center rounded-[3.5rem] border border-white/10 bg-[#160a26]/80 p-8 text-center backdrop-blur-2xl shadow-2xl will-change-transform md:p-12 ${
              i === 1 ? 'z-20' : 'z-10'
            }`}
          >
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/5 blur-[40px] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <div className={`mb-8 flex h-24 w-24 items-center justify-center rounded-[2rem] bg-gradient-to-br ${card.color} shadow-2xl ${card.shadow} transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6`}>
              <card.icon className="h-12 w-12 text-white" />
            </div>
            <h3 className="mb-6 text-2xl font-black uppercase tracking-tight text-white md:text-3xl">{card.title}</h3>
            <p className="text-lg font-light leading-relaxed text-white/60">{card.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ── BACKGROUND PARTICLES ────────────────────── */
const features = [
  {
    title: 'Direct Access',
    desc: 'Connect with top educational institutions directly.',
    icon: GraduationCap,
    final: { top: '-140px', left: '0' },
    color: 'from-blue-500 to-cyan-400',
  },
  {
    title: 'Simple Process',
    desc: 'Effortless and efficient application management.',
    icon: MousePointer2,
    final: { top: '0', right: '-220px' },
    color: 'from-fuchsia-500 to-purple-600',
  },
  {
    title: 'Expert Guidance',
    desc: 'Get personalized consultations from industry pros.',
    icon: Zap,
    final: { bottom: '0', left: '-220px' },
    color: 'from-amber-400 to-orange-500',
  },
  {
    title: 'End-to-End Support',
    desc: 'Guidance from initial inquiry to final admission.',
    icon: Headset,
    final: { bottom: '-140px', right: '0' },
    color: 'from-emerald-400 to-teal-500',
  },
]

function WhyChooseSection() {
  const containerRef = useRef(null)
  const coreRef = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const cards = Array.from(containerRef.current?.querySelectorAll('.why-card') || [])
      if (!cards.length) return

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=150%',
          scrub: 1,
          pin: true,
        },
      })

      tl.fromTo(
        coreRef.current,
        { x: -800, opacity: 0, scale: 1.5, filter: 'blur(15px)' },
        { x: 0, opacity: 1, scale: 1, filter: 'blur(0px)', duration: 1.5, ease: 'power4.out' }
      )

      cards.forEach((card, i) => {
        const { top, right, bottom, left } = features[i].final
        tl.to(
          card,
          {
            top: top || 'auto',
            right: right || 'auto',
            bottom: bottom || 'auto',
            left: left || 'auto',
            opacity: 1,
            scale: 1,
            duration: 1.2,
            ease: 'back.out(1.7)',
          },
          '-=0.8'
        )
      })

      tl.to('.orbital-container', {
        rotate: 360,
        duration: 3,
        ease: 'power1.inOut',
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={containerRef} className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-[#080414]">
      <div className="absolute inset-0 z-0">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-600/10 blur-[150px]" />
      </div>
      <div className="orbital-container relative z-10 flex h-[500px] w-full max-w-4xl items-center justify-center">
        <div ref={coreRef} className="relative z-20 group">
          <div className="absolute inset-0 rounded-full bg-white/10 blur-3xl scale-125" />
          <div className="relative flex h-56 w-56 flex-col items-center justify-center rounded-full border border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-6 text-center backdrop-blur-3xl shadow-2xl md:h-72 md:w-72">
            <h2 className="text-xl font-black uppercase tracking-tighter text-white md:text-2xl">
              Why Choose <br />
              <span className="text-fuchsia-400">StudyIn</span><br />
              Bengaluru?
            </h2>
            <div className="mt-4 h-1 w-10 overflow-hidden rounded-full bg-white/20">
              <div className="h-full animate-[loading_2s_infinite] bg-fuchsia-500" />
            </div>
          </div>
        </div>
        {features.map((f, i) => (
          <div
            key={f.title}
            className="why-card absolute scale-50 rounded-3xl bg-gradient-to-br p-[1px] opacity-0 transition-all duration-300 hover:z-50"
            style={{
              width: '240px',
              top: i === 0 ? '-120%' : i === 1 ? '-120%' : i === 2 ? '120%' : '120%',
              left: i === 0 || i === 2 ? '-120%' : 'auto',
              right: i === 1 || i === 3 ? '-120%' : 'auto',
            }}
          >
            <div className={`rounded-3xl bg-gradient-to-br ${f.color} p-[1.5px]`}>
              <div className="h-full rounded-[calc(1.5rem-1px)] bg-[#0d041a] p-5 backdrop-blur-xl">
                <div className={`mb-3 inline-flex rounded-xl bg-gradient-to-br ${f.color} p-2.5`}>
                  <f.icon className="text-white" size={20} />
                </div>
                <h3 className="mb-1 text-lg font-bold uppercase tracking-tight text-white">{f.title}</h3>
                <p className="text-xs leading-relaxed text-white/40">{f.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function WhyBengaluruSection() {
  const sectionRef = useRef(null)
  const triggerRef = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current,
        { x: 0 },
        {
          x: '-500vw',
          ease: 'none',
          scrollTrigger: {
            trigger: triggerRef.current,
            start: 'top top',
            end: () => `+=${window.innerWidth * 5}`,
            scrub: 0.6,
            pin: true,
            anticipatePin: 1,
          },
        }
      )
    }, triggerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={triggerRef} className="relative overflow-hidden bg-[#0a0516]">
      <div className="absolute top-12 left-6 z-50 md:left-12">
        <h2 className="text-3xl font-black uppercase tracking-tighter text-white/20 md:text-6xl">
          Why Bengaluru?
        </h2>
      </div>

      <div ref={sectionRef} className="relative flex h-screen w-[600vw] flex-row">
        {bengaluruData.map((item, index) => (
          <div key={item.title} className="relative flex h-screen w-screen items-center justify-center px-6 md:px-16 lg:px-32">
            <div className={`absolute inset-0 bg-gradient-to-r ${item.color} to-transparent opacity-30`} />

            <div className="relative z-10 flex w-full max-w-7xl flex-col items-center gap-10 md:flex-row md:gap-12">
              <div className="w-full space-y-5 md:w-1/2">
                <span className="font-mono text-lg text-fuchsia-500 md:text-xl">0{index + 1} / 06</span>
                <h3 className="text-4xl font-bold leading-none text-white md:text-7xl">
                  {item.title.split(' ').map((word, wordIndex) => (
                    <span key={`${word}-${wordIndex}`} className="block">
                      {word}
                    </span>
                  ))}
                </h3>
                <p className="max-w-md border-l-2 border-fuchsia-500 pl-5 text-base leading-relaxed text-white/60 md:text-xl">
                  {item.desc}
                </p>
              </div>

              <div className="group relative w-full md:w-1/2">
                <div className="absolute -inset-4 rounded-full bg-fuchsia-500/20 opacity-0 blur-2xl transition-opacity duration-700 group-hover:opacity-100" />
                <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="h-full w-full scale-110 object-cover transition-transform duration-1000 group-hover:scale-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0516] via-transparent to-transparent opacity-60" />
                </div>
              </div>
            </div>

            <div className="absolute bottom-10 left-1/2 flex -translate-x-1/2 gap-4">
              {bengaluruData.map((_, i) => (
                <div
                  key={i}
                  className={`h-1 transition-all duration-500 ${i === index ? 'w-12 bg-fuchsia-500' : 'w-4 bg-white/20'}`}
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

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
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
        <spotLight position={[5, 10, 5]} angle={0.25} penumbra={1} intensity={3} color="#fdf4ff" />
        <pointLight position={[-10, -10, -10]} color="#d946ef" intensity={2} />
        <pointLight position={[10, -5, 5]} color="#22d3ee" intensity={1.5} />

        <Suspense fallback={null}>
          <EducationParticles />
          <EducationModel />
          <Environment preset="city" />
          {/* Adjusted Contact Shadow to match new model position and scale */}
          <ContactShadows position={[2.4, -1.5, 0]} opacity={0.4} scale={4} blur={2.5} color="#000000" />
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
          trigger: containerRef.current,
          start: "top top",
          end: "+=150%",
          scrub: 1,
        },
        xPercent: -30,
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={containerRef} className="relative bg-[#0d041a] overflow-hidden min-h-screen">
      
      {/* ── PARALLAX BACKGROUND TEXT ── */}
      <div className="absolute top-[15%] left-0 z-0 pointer-events-none opacity-5 w-[200vw]">
        <h2 className="parallax-text text-[18rem] font-black uppercase whitespace-nowrap text-white tracking-tighter">
          Innovate • Empower • Transform • Discover •
        </h2>
      </div>

      {/* Global Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-fuchsia-600/15 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-cyan-600/10 blur-[150px] rounded-full" />
        <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.8)_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>

      {/* ── 3D HERO CANVAS ── */}
      <div className="parallax-canvas absolute inset-0 z-10 pointer-events-none h-screen">
        <div className="absolute inset-0 pointer-events-auto">
          <Scene3D />
        </div>
      </div>

      {/* ── HERO SECTION ── */}
      <section className="relative h-screen flex items-center px-8 lg:px-24 z-20 pointer-events-none">
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="max-w-2xl text-center lg:text-left pointer-events-auto relative">
            
            {/* Adorable Floating Glass Badge */}
            <div className="reveal absolute -top-12 -left-8 hidden md:flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-[0_10px_30px_rgba(217,70,239,0.15)] animate-[bounce_4s_infinite]">
              <span className="h-2 w-2 rounded-full bg-fuchsia-400 shadow-[0_0_10px_#d946ef]"></span>
              <span className="text-xs font-bold text-white/80 uppercase tracking-widest">Est. 2024</span>
            </div>

            <div className="reveal inline-block px-5 py-2 mb-8 rounded-full border border-cyan-500/20 bg-cyan-500/10 backdrop-blur-xl uppercase tracking-[0.4em] text-[10px] text-cyan-300 font-black shadow-[0_0_20px_rgba(34,211,238,0.1)]">
              Our Identity
            </div>
            
            <h1 className="reveal text-[clamp(4rem,9vw,8rem)] font-black leading-[0.85] tracking-tighter mb-8 text-white drop-shadow-2xl">
              About <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 via-white to-cyan-400">
                Study in
              </span><br />
              Bengaluru
            </h1>
            
            <p className="reveal max-w-lg text-xl text-white/60 font-light leading-relaxed mb-10 mx-auto lg:mx-0">
              Welcome to the premier admission ecosystem. We don't just process applications; we engineer <span className="text-white font-medium italic">transformative educational journeys</span>.
            </p>

            {/* Creative Scroll Indicator */}
            <div className="reveal flex items-center gap-4 justify-center lg:justify-start opacity-60">
               <div className="w-12 h-px bg-gradient-to-r from-transparent to-white"></div>
               <span className="text-[9px] uppercase tracking-[0.5em] font-bold">Scroll to Explore</span>
            </div>
          </div>
          
          {/* Empty div to ensure layout holds space for the 3D canvas on the right */}
          <div className="hidden lg:block h-[500px]" />
        </div>
      </section>

      <AboutCardsSection />
      <WhyChooseSection />
      <WhyBengaluruSection />
    </main>
  );
};

export default About;
