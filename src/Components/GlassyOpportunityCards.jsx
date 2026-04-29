import { memo, useLayoutEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { School, BookMarked, BriefcaseBusiness, Globe, Sparkles, ArrowRight, GraduationCap, BookOpen } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const cardData = [
  { title: 'Colleges', icon: School, color: '#3b82f6', shadow: 'shadow-blue-500/20' },
  { title: 'Institutes', icon: BookMarked, color: '#a855f7', shadow: 'shadow-purple-500/20' },
  { title: 'Internships', icon: BriefcaseBusiness, color: '#f59e0b', shadow: 'shadow-orange-500/20' },
  { title: 'Courses', icon: Globe, color: '#10b981', shadow: 'shadow-emerald-500/20' },
  { title: 'Scholarships', icon: Sparkles, color: '#ec4899', shadow: 'shadow-pink-500/20' },
]

const GlassCard = memo(function GlassCard({ item, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -10, scale: 1.02 }}
      className="group relative h-[340px] w-full max-w-[320px] overflow-hidden rounded-[2.5rem] p-[1px] sm:h-[380px] md:min-w-[280px] md:max-w-none md:h-[400px]"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent opacity-100 transition-all duration-500 group-hover:from-white/50" />

      <div className="relative flex h-full w-full flex-col justify-between rounded-[2.5rem] border border-white/5 bg-[#1a0b2e]/60 p-8 shadow-2xl backdrop-blur-2xl">
        <div
          className="absolute -top-20 -left-20 h-40 w-40 rounded-full opacity-0 blur-[50px] transition-opacity duration-500 group-hover:opacity-20"
          style={{ backgroundColor: item.color }}
        />

        <div
          className={`flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg transition-transform duration-500 group-hover:rotate-[10deg] group-hover:scale-110 ${item.shadow}`}
          style={{ background: `linear-gradient(135deg, ${item.color} 0%, #000 150%)` }}
        >
          <item.icon className="h-8 w-8 text-white" />
        </div>

        <div className="space-y-2">
          <h3 className="text-3xl font-bold tracking-tight text-white">{item.title}</h3>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">Global Access</p>
          <div
            className="h-[2px] w-12 bg-white/10 transition-all duration-700 group-hover:w-full"
            style={{ backgroundColor: `${item.color}44` }}
          />
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm font-semibold uppercase tracking-widest text-white/80">Explore</span>
          <motion.div
            whileTap={{ scale: 0.9 }}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-all duration-300 group-hover:bg-white group-hover:text-black"
          >
            <ArrowRight className="h-5 w-5" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
})

export default function GlassyOpportunityCards() {
  const containerRef = useRef(null)
  const triggerRef = useRef(null)
  const bannerRef = useRef(null)
  const cardsRef = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tween = gsap.fromTo(
        cardsRef.current,
        { x: '100vw', opacity: 0 },
        {
          x: '0vw',
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: triggerRef.current,
            start: 'top top',
            end: '+=2000',
            scrub: 0.6,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const progress = Math.min(1, Math.max(0, 1 - self.progress * 2))
              gsap.to(bannerRef.current, {
                opacity: progress,
                x: -self.progress * 100,
                filter: `blur(${self.progress * 10}px)`,
                duration: 0.1,
              })
            },
          },
        }
      )

      return () => tween.kill()
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={triggerRef} className="overflow-hidden bg-[#0f021a]">
      <section ref={containerRef} className="relative flex min-h-[100svh] w-full items-center justify-center py-14 md:h-screen md:py-0">
        <div ref={bannerRef} className="absolute inset-0 z-20 flex flex-col items-center justify-center px-4 text-center">
          <div className="mb-6 flex gap-4 opacity-50">
            <GraduationCap className="h-8 w-8 animate-bounce text-white" />
            <BookOpen className="h-8 w-8 animate-pulse text-white" />
          </div>
          <h2 className="text-7xl font-black uppercase italic tracking-tighter text-white md:text-9xl">
            Opportunities
          </h2>
          <p className="mt-4 text-xs font-bold uppercase tracking-[0.5em] text-purple-300">
            Scroll to Reveal Matrix
          </p>
        </div>

        <div ref={cardsRef} className="relative z-10 flex w-full flex-col items-center gap-6 px-4 md:w-auto md:flex-row md:px-10">
          {cardData.map((item, index) => (
            <GlassCard key={item.title} item={item} index={index} />
          ))}
        </div>
      </section>
    </div>
  )
}
