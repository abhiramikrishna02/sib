import { ArrowUpRight, Sparkles } from 'lucide-react'
import FlowArt, { FlowSection } from '../../Components/StoryScroll'

const HomeGridOverlay = ({ opacity = 'opacity-[0.14]' }) => (
  <div
    aria-hidden="true"
    className={`pointer-events-none absolute inset-0 z-0 ${opacity}`}
    style={{
      backgroundImage: 'linear-gradient(rgba(255,255,255,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.18) 1px, transparent 1px)',
      backgroundSize: '72px 72px',
      maskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)',
      WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)',
    }}
  />
)

function VisionMissionSection() {
  return (
    <FlowArt aria-label="Vision and Mission story scroll" className="relative border-y border-white/6 bg-[#100718]">
      <FlowSection
        aria-label="Our Vision"
        className="text-white"
        style={{
          background:
            'radial-gradient(circle at 18% 18%, rgba(56, 189, 248, 0.18), transparent 30%), radial-gradient(circle at 82% 78%, rgba(168, 85, 247, 0.18), transparent 34%), linear-gradient(135deg, #071421 0%, #17244c 44%, #24113a 100%)',
        }}
      >
        <HomeGridOverlay opacity="opacity-[0.16]" />
        <div className="relative z-10">
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-cyan-100/80 sm:text-xs sm:tracking-[0.32em]">01 - Our Vision</p>
          <hr className="my-4 border-none border-t border-white/45 sm:my-[2vw]" />
          <h2 className="text-[clamp(3.6rem,18vw,13rem)] font-black uppercase leading-[0.82] tracking-tight text-white">
            Our
            <br />
            Vision
          </h2>
        </div>
        <div className="relative z-10 lg:mt-auto">
          <hr className="my-4 border-none border-t border-white/45 sm:my-[2vw]" />
          <p className="max-w-[58ch] text-[clamp(1rem,4.3vw,1.85rem)] font-medium leading-relaxed text-white/82">
            To transform Bengaluru into Asia&apos;s premier educational destination by revolutionizing admission processes, offering unparalleled career guidance, and fostering collaborative partnerships with top-tier institutions and industry leaders.
          </p>
          <hr className="my-4 border-none border-t border-white/35 sm:my-[2vw]" />
          <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.24em] text-cyan-200 sm:gap-4 sm:text-xs sm:tracking-[0.34em]">
            <span>View Roadmap</span>
            <ArrowUpRight size={18} />
          </div>
        </div>
      </FlowSection>

      <FlowSection
        aria-label="Our Mission"
        className="text-white"
        style={{
          background:
            'radial-gradient(circle at 24% 24%, rgba(251, 146, 60, 0.16), transparent 28%), radial-gradient(circle at 78% 28%, rgba(232, 121, 249, 0.2), transparent 32%), linear-gradient(135deg, #1b0913 0%, #261027 46%, #0d0714 100%)',
        }}
      >
        <HomeGridOverlay opacity="opacity-[0.14]" />
        <div className="relative z-10">
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-orange-100/80 sm:text-xs sm:tracking-[0.32em]">02 - Our Mission</p>
          <hr className="my-4 border-none border-t border-white/45 sm:my-[2vw]" />
          <h2 className="text-[clamp(3.6rem,18vw,13rem)] font-black uppercase leading-[0.82] tracking-tight text-white">
            Our
            <br />
            Mission
          </h2>
        </div>
        <div className="relative z-10">
          <hr className="my-4 border-none border-t border-white/45 sm:my-[2vw]" />
          <p className="max-w-[58ch] text-[clamp(1rem,4.3vw,1.85rem)] font-medium leading-relaxed text-white/82">
            To attract and empower students worldwide by providing access to world-class education in India, nurturing global talent, and creating a network of future leaders who drive innovation and positive change.
          </p>
          <hr className="my-4 border-none border-t border-white/35 sm:my-[2vw]" />
          <div className="flex flex-wrap gap-3 sm:gap-4">
            {['Empower', 'Nurture', 'Lead'].map((tag) => (
              <span key={tag} className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-3 py-2 text-[9px] font-black uppercase tracking-[0.18em] text-orange-200/80 sm:px-4 sm:text-[10px] sm:tracking-[0.28em]">
                <Sparkles size={12} /> {tag}
              </span>
            ))}
          </div>
        </div>
      </FlowSection>
    </FlowArt>
  )
}

export default VisionMissionSection
