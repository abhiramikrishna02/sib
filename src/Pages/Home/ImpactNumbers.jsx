import EtherealBeamsBackground from '../../../components/ui/ethereal-beams-background'

const stats = [
  { value: 100, suffix: '+', label: 'Partner Colleges' },
  { value: 1000, suffix: '+', label: 'Students Enrolled' },
  { value: 95, suffix: '%', label: 'Admission Success' },
  { value: 50, suffix: '+', label: 'Franchises' },
  { value: 24, suffix: '/7', label: 'Student Support' },
]

function ImpactNumbersSection() {
  const loopStats = [...stats, ...stats]

  return (
    <section className="relative overflow-hidden border-y border-white/8 bg-[#090909] px-0 py-8 text-white sm:py-12 lg:py-16">
      <div className="pointer-events-none absolute inset-0 z-0">
        <EtherealBeamsBackground
          beamWidth={2.5}
          beamHeight={18}
          beamNumber={15}
          lightColor="#ffffff"
          speed={2.5}
          noiseIntensity={2}
          scale={0.15}
          rotation={43}
        />
      </div>
      <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-t from-black/50 via-transparent to-black/30" />
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_42%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px bg-gradient-to-r from-transparent via-white/18 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-px bg-gradient-to-r from-transparent via-white/18 to-transparent" />
      <div className="relative z-10 mx-auto w-full overflow-hidden py-6 sm:py-8">
        <div className="impact-stat-loop flex w-max items-center gap-10 px-6 sm:gap-18 sm:px-10 lg:gap-24">
          {loopStats.map((stat, index) => (
            <div
              key={`${stat.label}-${index}`}
              className="impact-stat-item min-w-[9.5rem] text-center sm:min-w-[13rem] lg:min-w-[17rem]"
              style={{ '--curve-y': `${Math.sin(index * 0.9) * 22}px`, '--curve-rotate': `${Math.sin(index * 0.9) * -2.2}deg` }}
            >
              <div className="text-[clamp(2.2rem,5.4vw,5.2rem)] font-bold leading-none tracking-[-0.045em] text-white">
                {stat.value}{stat.suffix}
              </div>
              <h3 className="mt-3 text-[clamp(0.72rem,1.25vw,1.2rem)] font-semibold uppercase leading-tight tracking-[0.12em] text-white/58 sm:mt-4">
                {stat.label}
              </h3>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        .impact-stat-loop {
          animation: impactStatLoop 28s linear infinite;
        }

        .impact-stat-loop:hover {
          animation-play-state: paused;
        }

        .impact-stat-item {
          transform: translateY(var(--curve-y)) rotate(var(--curve-rotate));
        }

        @keyframes impactStatLoop {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  )
}

export default ImpactNumbersSection
