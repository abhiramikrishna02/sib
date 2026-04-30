import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  GraduationCap, School, BookOpen, Star, MapPin, 
  Banknote, Clock, ArrowRight, ShieldCheck, Layers 
} from 'lucide-react';

const accentStyles = {
  'violet-500': {
    ring: 'bg-violet-500/10 border-violet-500/20 text-violet-500',
  },
  'violet-400': {
    ring: 'bg-violet-400/10 border-violet-400/20 text-violet-400',
  },
  'violet-400': {
    ring: 'bg-violet-400/10 border-violet-400/20 text-violet-400',
  },
}

export default function Services({ globalData, locationHash }) {
  const { Universities = [], Colleges = [], Courses = [] } = globalData || {};

  useEffect(() => {
    const hash = locationHash || window.location.hash
    if (!hash) return

    const element = document.querySelector(hash)
    if (!element) return

    const timer = window.setTimeout(() => {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)

    return () => window.clearTimeout(timer)
  }, [locationHash])

  const renderSection = (title, items, Icon, accentColor, sectionId) => {
    if (items.length === 0) return null;

    return (
      <div className="mb-24 scroll-mt-32" id={sectionId}>
        <div className="flex items-center gap-4 mb-10 border-b border-white/5 pb-6">
          <div className={`h-12 w-12 rounded-2xl flex items-center justify-center border ${accentStyles[accentColor].ring}`}>
            <Icon size={24} />
          </div>
          <div>
            <h2 className="text-3xl font-black italic tracking-tighter text-white uppercase">{title}</h2>
            <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em]">{items.length} Options Available</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-8 group hover:border-violet-500/30 transition-all duration-500 relative overflow-hidden"
            >
              {/* Background Glow */}
              <div className="absolute -right-20 -top-20 w-40 h-40 bg-violet-500/5 blur-[80px] group-hover:bg-violet-500/10 transition-all" />

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-xl font-bold text-white leading-tight pr-4">{item.name}</h3>
                  {item.rating && (
                    <span className="flex shrink-0 items-center gap-1 text-violet-400 text-[10px] font-black bg-violet-400/10 px-3 py-1.5 rounded-xl border border-violet-400/20">
                      <Star size={10} fill="currentColor"/> {item.rating}
                    </span>
                  )}
                </div>

                <div className="space-y-5">
                  <div className="flex flex-wrap gap-2">
                    <span className="text-[9px] font-bold text-white/40 uppercase bg-white/5 px-2.5 py-1 rounded-lg border border-white/5 flex items-center gap-1">
                      <MapPin size={10} /> {item.location}
                    </span>
                    <span className="text-[9px] font-bold text-violet-400 uppercase bg-violet-400/5 px-2.5 py-1 rounded-lg border border-violet-400/10">
                      {item.type || item.level || 'Premium'}
                    </span>
                  </div>

                  <div className="bg-black/40 p-5 rounded-2xl border border-white/5">
                    <ul className="text-[11px] text-white/60 space-y-2">
                      {item.feeRange && (
                        <li className="flex justify-between items-center">
                          <span className="text-white/20 uppercase font-black tracking-tighter text-[9px]">Fees</span> 
                          <span className="text-white font-medium">{item.feeRange}</span>
                        </li>
                      )}
                      {item.duration && (
                        <li className="flex justify-between items-center">
                          <span className="text-white/20 uppercase font-black tracking-tighter text-[9px]">Duration</span> 
                          <span className="text-white font-medium">{item.duration}</span>
                        </li>
                      )}
                      {item.mode && (
                        <li className="flex justify-between items-center">
                          <span className="text-white/20 uppercase font-black tracking-tighter text-[9px]">Learning</span> 
                          <span className="text-white font-medium">{item.mode}</span>
                        </li>
                      )}
                    </ul>
                  </div>
                  
                  <button className="w-full mt-4 py-4 rounded-xl border border-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 group-hover:bg-white group-hover:text-black transition-all flex items-center justify-center gap-2">
                    View Details <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#431f60] text-white pt-32 pb-20 px-6 md:px-16">
      <div className="max-w-7xl mx-auto">
        <header className="mb-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-violet-500 text-[10px] font-black uppercase tracking-[0.5em] mb-4">Explore our Database</p>
            <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter text-white mb-6 uppercase">
              Curated<span className="text-violet-500">.</span> Choices
            </h1>
            <p className="text-white/40 max-w-2xl mx-auto text-sm md:text-lg leading-relaxed">
              Browse through top-tier institutions and professional courses verified by our experts. 
              Find the perfect path for your academic journey.
            </p>
          </motion.div>
        </header>

        {/* Dynamic Sections */}
        {renderSection("Universities", Universities, GraduationCap, "violet-500", "universities")}
        {renderSection("Colleges", Colleges, School, "violet-400", "colleges")}
        {renderSection("Courses", Courses, BookOpen, "violet-400", "courses")}

        {/* Empty State Fallback */}
        {Universities.length === 0 && Colleges.length === 0 && Courses.length === 0 && (
          <div className="py-40 text-center border border-white/5 rounded-[3rem] bg-white/[0.01]">
            <Layers className="mx-auto text-white/10 mb-6" size={48} />
            <p className="text-white/20 text-xs font-black uppercase tracking-[0.3em]">No data has been published yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}



