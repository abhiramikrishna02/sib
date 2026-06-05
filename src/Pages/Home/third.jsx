import { useState, useEffect, useRef } from "react";

const projects = [
  {
    title: "Kontenta AI",
    desc: "Immersive cultural intelligence platform with infinite DOM spiral and real-time WebGL environments.",
    industry: "AI / Marketing Tech",
    stack: "Webflow, GSAP, Three.js",
    year: "2024",
  },
  {
    title: "Essence Persia",
    desc: "Luxury skincare e-commerce blending ancient Persian rituals with modern science.",
    industry: "Beauty / E-commerce",
    stack: "Webflow, CMS, Figma",
    year: "2024",
  },
  {
    title: "Comert Photography",
    desc: "Sophisticated portfolio for wedding, boudoir and lifestyle photography.",
    industry: "Photography / Portfolio",
    stack: "WordPress, Elementor",
    year: "2023",
  },
  {
    title: "Bushdid Smiles",
    desc: "Premium dental wellness site with custom loading and scroll-driven animations.",
    industry: "Healthcare / Dental",
    stack: "Webflow, GSAP",
    year: "2024",
  },
];

function FloatingCard({ project, mousePos, visible }) {
  const ref = useRef(null);
  const [pos, setPos] = useState({ left: 0, top: 0 });

  useEffect(() => {
    if (!ref.current) return;
    
    // Smooth trailing follow effect
    const cw = ref.current.offsetWidth || 340;
    const ch = ref.current.offsetHeight || 220;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    
    // Offset card slightly from the cursor
    let left = mousePos.x + 24;
    let top = mousePos.y + 24;
    
    // Screen bounds collision detection
    if (left + cw > vw - 24) left = mousePos.x - cw - 24;
    if (top + ch > vh - 24) top = mousePos.y - ch - 24;
    if (top < 24) top = 24;
    if (left < 24) left = 24;

    setPos({ left, top });
  }, [mousePos, visible]);

  return (
    <div
      ref={ref}
      className="pointer-events-none fixed top-0 left-0 z-50 w-[300px] md:w-[360px] rounded-2xl bg-[#0f0f0f] p-6 shadow-[0_30px_60px_rgba(0,0,0,0.3)] will-change-transform flex flex-col gap-4"
      style={{
        transform: `translate3d(${pos.left}px, ${pos.top}px, 0) scale(${visible ? 1 : 0.92})`,
        opacity: visible ? 1 : 0,
        transition: "opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <div className="flex flex-col gap-2">
        <h4 className="text-xl md:text-2xl font-medium tracking-tight text-white leading-tight">
          {project?.title}
        </h4>
        <p className="text-sm md:text-[15px] leading-relaxed text-white/60">
          {project?.desc}
        </p>
      </div>

      <div className="h-[1px] w-full bg-white/10 my-1" />

      <div className="flex flex-col gap-1.5">
        {[
          ["Industry", project?.industry],
          ["Stack", project?.stack],
          ["Year", project?.year],
        ].map(([label, value]) => (
          <div key={label} className="flex items-center justify-between text-[12px] md:text-[13px]">
            <span className="text-white/40">{label}</span>
            <span className="text-white/80 font-medium">{value}</span>
          </div>
        ))}
      </div>

      <div className="mt-2 text-[13px] font-semibold text-white transition-colors">
        View project <span className="ml-1 opacity-70">→</span>
      </div>
    </div>
  );
}

function ThirdSection() {
  const [hovered, setHovered] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let animationFrameId;
    const move = (e) => {
      // Use requestAnimationFrame for performant mouse tracking
      animationFrameId = requestAnimationFrame(() => {
        setMousePos({ x: e.clientX, y: e.clientY });
      });
    };
    window.addEventListener("mousemove", move);
    return () => {
      window.removeEventListener("mousemove", move);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section className="relative w-full overflow-hidden bg-white font-sans text-black select-none">
      {/* Background Vertical Grid Lines - Matching the Premium Screenshot Feel */}
      <div 
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.4]"
        style={{
          backgroundImage: "repeating-linear-gradient(90deg, rgba(0,0,0,0.06) 0px, rgba(0,0,0,0.06) 1px, transparent 1px, transparent 12.5vw)"
        }}
      />

      <div className="relative z-10 mx-auto w-full pt-24 pb-32">
        {/* Massive Premium Heading */}
        <h2 className="text-center font-medium tracking-tighter uppercase px-6 mb-16 md:mb-24" style={{ fontSize: "clamp(4rem, 14vw, 12rem)", lineHeight: 0.9 }}>
          PROJECTS
        </h2>

        {/* Top Full-Width Divider */}
        <div className="w-full border-t border-black/10" />

        {/* Project List */}
        <div className="flex flex-col w-full" onMouseLeave={() => setHovered(null)}>
          {projects.map((project) => (
            <div key={project.title} className="w-full">
              <div
                className="group relative w-full cursor-pointer transition-colors duration-500 ease-out hover:bg-[#f1f1f1]"
                onMouseEnter={() => setHovered(project)}
              >
                <div className="mx-auto w-full max-w-[1600px] px-6 py-10 md:px-12 md:py-14 lg:py-16 flex items-center">
                  <h3 
                    className="font-medium tracking-tight text-black transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                    style={{ 
                      fontSize: "clamp(2rem, 4vw, 3.5rem)",
                      transform: hovered?.title === project.title ? "translateX(24px)" : "translateX(0)"
                    }}
                  >
                    {project.title}
                  </h3>
                </div>
              </div>
              {/* Row Divider */}
              <div className="w-full border-b border-black/10" />
            </div>
          ))}
        </div>
      </div>

      {/* Floating Reveal Interaction */}
      <FloatingCard project={hovered} mousePos={mousePos} visible={!!hovered} />
    </section>
  );
}

export default ThirdSection;