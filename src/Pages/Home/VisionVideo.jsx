import { Sparkles } from 'lucide-react'
import graduateVideo from '../../assets/graduate.mp4'

function VisionVideoSection() {
  return (
    <section
      aria-label="Vision video"
      className="relative isolate overflow-hidden border-y border-white/10 bg-[#07070a] px-3 py-10 text-white sm:px-6 sm:py-16 lg:py-20"
    >
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_16%,rgba(34,211,238,0.12),transparent_28%),radial-gradient(circle_at_82%_20%,rgba(232,121,249,0.14),transparent_32%),linear-gradient(180deg,#050505_0%,#100817_55%,#050505_100%)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.13] [background-image:linear-gradient(rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:72px_72px]" />

      <div className="mx-auto w-full max-w-7xl">
        {/* Header row */}
        <div className="mb-4 flex items-center gap-3 sm:mb-5 sm:gap-4">
          <div className="inline-flex shrink-0 items-center gap-2 rounded-full border border-white/12 bg-white/6 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.28em] text-white/72 backdrop-blur sm:px-4 sm:py-2 sm:text-[10px] sm:tracking-[0.32em]">
            <Sparkles size={12} className="sm:w-3.5 sm:h-3.5" />
            Vision Video
          </div>
          <div className="h-px flex-1 bg-gradient-to-r from-white/24 to-transparent" />
        </div>

        {/* Video container — fixed aspect ratio, no min-h to avoid overflow on mobile */}
        <div className="relative w-full overflow-hidden rounded-2xl border border-white/12 bg-black shadow-[0_20px_80px_rgba(168,85,247,0.18)] sm:rounded-[1.75rem] lg:rounded-[2rem]">
          {/* Aspect ratio box: taller on mobile for impact, wider on desktop */}
          <div className="relative aspect-[4/5] w-full sm:aspect-[16/11] lg:aspect-[16/8]">
            <video
              src={graduateVideo}
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/28 to-black/10" />

            {/* Title — responsive size, always fits within frame */}
            <div className="absolute inset-x-0 bottom-0 p-4 sm:p-7 lg:p-10">
              <h2 className="text-[clamp(1.5rem,6.5vw,6rem)] font-black uppercase leading-[0.88] tracking-tight text-white sm:text-[clamp(1.75rem,5.5vw,5.5rem)] lg:max-w-4xl">
                Education in Bengaluru, made clearer.
              </h2>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default VisionVideoSection