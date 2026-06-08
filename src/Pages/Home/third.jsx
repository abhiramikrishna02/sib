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
      className="pointer-events-none fixed top-0 left-0 z-50 w-[300px] md:w-[360px] rounded-2xl p-6 will-change-transform flex-col gap-4 hidden md:flex"
      style={{
        background: "#02101e",
        border: "1px solid rgba(0,207,255,0.22)",
        boxShadow: "0 30px 60px rgba(0,207,255,0.14), 0 0 0 1px rgba(0,207,255,0.06)",
        transform: `translate3d(${pos.left}px, ${pos.top}px, 0) scale(${visible ? 1 : 0.92})`,
        opacity: visible ? 1 : 0,
        transition: "opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      {/* cyan sheen top edge */}
      <div style={{ position: "absolute", inset: "0 0 auto 0", height: "1px", borderRadius: "1rem 1rem 0 0", background: "linear-gradient(90deg, transparent, rgba(0,207,255,0.55), transparent)" }} />

      <div className="flex flex-col gap-2">
        <h4 className="text-xl md:text-2xl font-medium tracking-tight leading-tight" style={{ color: "#00CFFF" }}>
          {pathway?.title}
        </h4>
        <p className="text-sm md:text-[15px] leading-relaxed" style={{ color: "rgba(180,240,255,0.60)" }}>
          {pathway?.desc}
        </p>
      </div>

      <div className="h-[1px] w-full my-1" style={{ background: "rgba(0,207,255,0.16)" }} />

      <div className="flex flex-col gap-1.5">
        {[
          ["Focus", pathway?.focus],
          ["Support", pathway?.support],
          ["Outcome", pathway?.outcome],
        ].map(([label, value]) => (
          <div key={label} className="flex items-center justify-between text-[12px] md:text-[13px]">
            <span style={{ color: "rgba(0,207,255,0.40)" }}>{label}</span>
            <span className="font-medium" style={{ color: "rgba(180,240,255,0.85)" }}>{value}</span>
          </div>
        ))}
      </div>

      <div className="mt-2 text-[13px] font-semibold" style={{ color: "#FFB300" }}>
        Explore support <span className="ml-1 opacity-70">→</span>
      </div>
    </div>
  );
}

function MobileExpandCard({ pathway }) {
  return (
    <div
      className="mx-4 mb-4 rounded-2xl p-5 flex flex-col gap-4 relative overflow-hidden"
      style={{
        background: "#02101e",
        border: "1px solid rgba(0,207,255,0.22)",
        boxShadow: "0 12px 40px rgba(0,207,255,0.10)",
      }}
    >
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: "1px", background: "linear-gradient(90deg, transparent, rgba(0,207,255,0.50), transparent)" }} />

      <p className="text-sm leading-relaxed" style={{ color: "rgba(180,240,255,0.60)" }}>
        {pathway.desc}
      </p>

      <div className="h-[1px] w-full" style={{ background: "rgba(0,207,255,0.16)" }} />

      <div className="flex flex-col gap-2">
        {[
          ["Focus", pathway.focus],
          ["Support", pathway.support],
          ["Outcome", pathway.outcome],
        ].map(([label, value]) => (
          <div key={label} className="flex items-start justify-between gap-4 text-[12px]">
            <span className="shrink-0" style={{ color: "rgba(0,207,255,0.40)" }}>{label}</span>
            <span className="font-medium text-right" style={{ color: "rgba(180,240,255,0.85)" }}>{value}</span>
          </div>
        ))}
      </div>

      <div className="text-[13px] font-semibold" style={{ color: "#FFB300" }}>
        Explore support <span className="ml-1 opacity-70">→</span>
      </div>
    </div>
  );
}

function ThirdSection() {
  const [hovered, setHovered] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (isMobile) return;
    let raf;
    const move = (e) => {
      raf = requestAnimationFrame(() => setMousePos({ x: e.clientX, y: e.clientY }));
    };
    window.addEventListener("mousemove", move);
    return () => { window.removeEventListener("mousemove", move); cancelAnimationFrame(raf); };
  }, [isMobile]);

  const handleRowInteraction = (pathway) => {
    if (isMobile) {
      setExpanded((prev) => (prev?.title === pathway.title ? null : pathway));
    }
  };

  return (
    <section
      className="relative w-full overflow-hidden font-sans select-none"
      // CHANGED: deep navy bg matching About page global bg
      style={{ background: "#020510" }}
    >
      {/* CHANGED: vertical grid lines flipped to white/cyan tint for dark bg */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, rgba(0,207,255,0.04) 0px, rgba(0,207,255,0.04) 1px, transparent 1px, transparent 12.5vw)",
        }}
      />

      {/* Ambient glow blobs — match About page atmosphere */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute left-[-10%] top-0 h-[400px] w-[400px] rounded-full blur-[120px]" style={{ background: "rgba(0,207,255,0.06)" }} />
        <div className="absolute right-[-8%] bottom-0 h-[350px] w-[350px] rounded-full blur-[120px]" style={{ background: "rgba(224,64,251,0.05)" }} />
      </div>

      <div className="relative z-10 mx-auto w-full pt-16 pb-20 md:pt-24 md:pb-32">
        {/* CHANGED: heading text white, same size/weight/tracking */}
        <h2
          className="text-center font-medium tracking-tighter uppercase px-4 mb-10 md:mb-16 lg:mb-24 leading-none"
          style={{
            fontSize: "clamp(2.8rem, 13vw, 12rem)",
            color: "#ffffff",
          }}
        >
          PATHWAYS
        </h2>

        {/* CHANGED: top divider uses white/10 on dark */}
        <div className="w-full" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }} />

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
                <div
                  className="group relative w-full transition-colors duration-300 ease-out cursor-pointer"
                  // CHANGED: hover bg is a dark cyan tint instead of #f1f1f1
                  style={{ background: isActive ? "rgba(0,207,255,0.04)" : "transparent" }}
                  onMouseEnter={() => !isMobile && setHovered(pathway)}
                  onClick={() => handleRowInteraction(pathway)}
                >
                  <div className="mx-auto w-full max-w-[1600px] px-5 py-7 md:px-12 md:py-14 lg:py-16 flex items-center justify-between">
                    <h3
                      className="font-medium tracking-tight transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                      style={{
                        fontSize: "clamp(1.6rem, 4vw, 3.5rem)",
                        transform: isActive ? "translateX(12px)" : "translateX(0)",
                        // CHANGED: white normally, cyan on active
                        color: isActive ? "#00CFFF" : "rgba(255,255,255,0.90)",
                      }}
                    >
                      {pathway.title}
                    </h3>

                    {/* CHANGED: mobile + uses gold when open */}
                    <span
                      className="md:hidden text-2xl shrink-0 ml-4"
                      style={{
                        transform: isActive ? "rotate(45deg)" : "rotate(0deg)",
                        transition: "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), color 0.25s",
                        color: isActive ? "#FFB300" : "rgba(255,255,255,0.25)",
                      }}
                    >
                      +
                    </span>

                    {/* CHANGED: desktop arrow gold on hover */}
                    <span
                      className="hidden md:block text-2xl shrink-0 ml-4"
                      style={{
                        opacity: isActive ? 1 : 0,
                        transform: isActive ? "translateX(0)" : "translateX(-8px)",
                        color: "#FFB300",
                        transition: "opacity 0.3s, transform 0.3s",
                      }}
                    >
                      →
                    </span>
                  </div>

                  {/* CHANGED: left-edge cyan accent bar */}
                  <div
                    style={{
                      position: "absolute",
                      left: 0, top: 0, bottom: 0,
                      width: "3px",
                      background: "#00CFFF",
                      borderRadius: "0 2px 2px 0",
                      opacity: isActive ? 1 : 0,
                      transition: "opacity 0.3s ease",
                    }}
                  />
                </div>

                {/* Mobile accordion */}
                <div
                  className="md:hidden overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{ maxHeight: expanded?.title === pathway.title ? "400px" : "0px" }}
                >
                  <MobileExpandCard pathway={pathway} />
                </div>

                {/* CHANGED: row divider white/8 on dark */}
                <div className="w-full" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }} />
              </div>
            );
          })}
        </div>
      </div>

      <FloatingCard pathway={hovered} mousePos={mousePos} visible={!!hovered} />
    </section>
  );
}

export default ThirdSection;