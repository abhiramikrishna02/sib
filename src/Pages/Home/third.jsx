import { useState, useEffect, useRef } from "react";

const pathways = [
  {
    title: "University Selection",
    desc: "Shortlist the right Bengaluru universities and colleges by course fit, budget, location, ranking, and admission chances.",
    focus: "UG / PG Admissions",
    support: "College shortlist, eligibility check",
    outcome: "Clear options before applying",
  },
  {
    title: "Course Counselling",
    desc: "Compare programmes across engineering, management, commerce, healthcare, design, aviation, and emerging career fields.",
    focus: "Course Planning",
    support: "Career mapping, stream guidance",
    outcome: "A degree path with purpose",
  },
  {
    title: "Application Support",
    desc: "Move from enquiry to confirmed admission with help on forms, documents, deadlines, fee details, and follow-ups.",
    focus: "Admission Process",
    support: "Forms, documents, coordination",
    outcome: "Less confusion, faster progress",
  },
  {
    title: "Student Services",
    desc: "Settle into Bengaluru with practical support for accommodation, local guidance, part-time work, internships, and student life.",
    focus: "After Admission",
    support: "Stay, city help, opportunities",
    outcome: "A smoother start in Bengaluru",
  },
];

// Desktop-only floating card that follows the cursor
function FloatingCard({ pathway, mousePos, visible }) {
  const ref = useRef(null);
  const [pos, setPos] = useState({ left: 0, top: 0 });

  useEffect(() => {
    if (!ref.current) return;
    const cw = ref.current.offsetWidth || 340;
    const ch = ref.current.offsetHeight || 220;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    let left = mousePos.x + 24;
    let top = mousePos.y + 24;

    if (left + cw > vw - 24) left = mousePos.x - cw - 24;
    if (top + ch > vh - 24) top = mousePos.y - ch - 24;
    if (top < 24) top = 24;
    if (left < 24) left = 24;

    setPos({ left, top });
  }, [mousePos, visible]);

  return (
    <div
      ref={ref}
      className="pointer-events-none fixed top-0 left-0 z-50 w-[300px] md:w-[360px] rounded-2xl bg-[#0f0f0f] p-6 shadow-[0_30px_60px_rgba(0,0,0,0.3)] will-change-transform flex-col gap-4 hidden md:flex"
      style={{
        transform: `translate3d(${pos.left}px, ${pos.top}px, 0) scale(${visible ? 1 : 0.92})`,
        opacity: visible ? 1 : 0,
        transition:
          "opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <div className="flex flex-col gap-2">
        <h4 className="text-xl md:text-2xl font-medium tracking-tight text-white leading-tight">
          {pathway?.title}
        </h4>
        <p className="text-sm md:text-[15px] leading-relaxed text-white/60">
          {pathway?.desc}
        </p>
      </div>

      <div className="h-[1px] w-full bg-white/10 my-1" />

      <div className="flex flex-col gap-1.5">
        {[
          ["Focus", pathway?.focus],
          ["Support", pathway?.support],
          ["Outcome", pathway?.outcome],
        ].map(([label, value]) => (
          <div
            key={label}
            className="flex items-center justify-between text-[12px] md:text-[13px]"
          >
            <span className="text-white/40">{label}</span>
            <span className="text-white/80 font-medium">{value}</span>
          </div>
        ))}
      </div>

      <div className="mt-2 text-[13px] font-semibold text-white transition-colors">
        Explore support <span className="ml-1 opacity-70">→</span>
      </div>
    </div>
  );
}

// Mobile accordion card that expands inline on tap
function MobileExpandCard({ pathway, isOpen, onToggle }) {
  return (
    <div
      className="overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
      style={{ maxHeight: isOpen ? "400px" : "0px" }}
    >
      <div className="mx-4 mb-4 rounded-2xl bg-[#0f0f0f] p-5 flex flex-col gap-4">
        <p className="text-sm leading-relaxed text-white/60">{pathway.desc}</p>

        <div className="h-[1px] w-full bg-white/10" />

        <div className="flex flex-col gap-2">
          {[
            ["Focus", pathway.focus],
            ["Support", pathway.support],
            ["Outcome", pathway.outcome],
          ].map(([label, value]) => (
            <div
              key={label}
              className="flex items-start justify-between gap-4 text-[12px]"
            >
              <span className="text-white/40 shrink-0">{label}</span>
              <span className="text-white/80 font-medium text-right">{value}</span>
            </div>
          ))}
        </div>

        <div className="text-[13px] font-semibold text-white">
          Explore support <span className="ml-1 opacity-70">→</span>
        </div>
      </div>
    </div>
  );
}

function ThirdSection() {
  const [hovered, setHovered] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);

  // Detect screen size for interaction mode
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Mouse tracking for desktop floating card
  useEffect(() => {
    if (isMobile) return;
    let raf;
    const move = (e) => {
      raf = requestAnimationFrame(() => {
        setMousePos({ x: e.clientX, y: e.clientY });
      });
    };
    window.addEventListener("mousemove", move);
    return () => {
      window.removeEventListener("mousemove", move);
      cancelAnimationFrame(raf);
    };
  }, [isMobile]);

  const handleRowInteraction = (pathway) => {
    if (isMobile) {
      setExpanded((prev) => (prev?.title === pathway.title ? null : pathway));
    }
  };

  return (
    <section
      className="relative w-full overflow-hidden bg-white font-sans text-black select-none"
    >
      {/* Background vertical grid lines */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-40"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, rgba(0,0,0,0.06) 0px, rgba(0,0,0,0.06) 1px, transparent 1px, transparent 12.5vw)",
        }}
      />

      <div className="relative z-10 mx-auto w-full pt-16 pb-20 md:pt-24 md:pb-32">
        {/* Heading — scales gracefully across all breakpoints */}
        <h2
          className="text-center font-medium tracking-tighter uppercase px-4 mb-10 md:mb-16 lg:mb-24 leading-none"
          style={{ fontSize: "clamp(2.8rem, 13vw, 12rem)" }}
        >
          PATHWAYS
        </h2>

        {/* Top divider */}
        <div className="w-full border-t border-black/10" />

        {/* Pathway list */}
        <div
          className="flex flex-col w-full"
          onMouseLeave={() => !isMobile && setHovered(null)}
        >
          {pathways.map((pathway) => {
            const isActive = isMobile
              ? expanded?.title === pathway.title
              : hovered?.title === pathway.title;

            return (
              <div key={pathway.title} className="w-full">
                {/* Row */}
                <div
                  className={`group relative w-full transition-colors duration-300 ease-out ${
                    isMobile ? "cursor-pointer active:bg-[#f1f1f1]" : "cursor-pointer hover:bg-[#f1f1f1]"
                  } ${isActive && isMobile ? "bg-[#f1f1f1]" : ""}`}
                  onMouseEnter={() => !isMobile && setHovered(pathway)}
                  onClick={() => handleRowInteraction(pathway)}
                >
                  <div className="mx-auto w-full max-w-[1600px] px-5 py-7 md:px-12 md:py-14 lg:py-16 flex items-center justify-between">
                    <h3
                      className="font-medium tracking-tight text-black transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                      style={{
                        fontSize: "clamp(1.6rem, 4vw, 3.5rem)",
                        transform: isActive ? "translateX(12px)" : "translateX(0)",
                      }}
                    >
                      {pathway.title}
                    </h3>

                    {/* Mobile expand indicator */}
                    <span
                      className="md:hidden text-black/30 text-2xl transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] shrink-0 ml-4"
                      style={{
                        transform: isActive ? "rotate(45deg)" : "rotate(0deg)",
                        transition: "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
                      }}
                    >
                      +
                    </span>
                  </div>
                </div>

                {/* Mobile inline accordion panel */}
                <div className="md:hidden">
                  <MobileExpandCard
                    pathway={pathway}
                    isOpen={expanded?.title === pathway.title}
                    onToggle={() => handleRowInteraction(pathway)}
                  />
                </div>

                {/* Row divider */}
                <div className="w-full border-b border-black/10" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Desktop-only floating card */}
      <FloatingCard pathway={hovered} mousePos={mousePos} visible={!!hovered} />
    </section>
  );
}

export default ThirdSection;