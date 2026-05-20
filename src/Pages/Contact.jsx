import React from 'react';
import { motion } from 'framer-motion';
import { Phone, MessageSquare, MapPin, Star, Send } from 'lucide-react';
import { DotGlobeHero } from '../../components/ui/globe-hero';

export default function Contact() {
  return (
    <DotGlobeHero rotationSpeed={0.004} globeRadius={1.18} className="min-h-screen px-4 pt-36 pb-16 sm:px-6 sm:pt-40 sm:pb-20 md:px-6 md:pt-44 md:pb-24 lg:pt-48">
      <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-t from-black/75 via-black/25 to-black/40" />
      <div className="pointer-events-none absolute left-1/2 top-1/4 z-0 h-96 w-96 -translate-x-1/2 rounded-full bg-white/8 blur-3xl animate-pulse" />
      <div className="pointer-events-none absolute bottom-1/4 right-1/4 z-0 h-64 w-64 rounded-full bg-white/5 blur-3xl animate-pulse" />

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* HEADER SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-14 text-center md:mb-20 lg:mb-24"
        >
          <h2 className="mb-4 text-[clamp(2.7rem,10vw,5.8rem)] font-black uppercase leading-[0.9] tracking-tighter text-white md:text-8xl">
            Get in <span className="relative inline-block text-white/70">Touch<span className="absolute -bottom-2 left-0 h-2 w-full rounded-full bg-gradient-to-r from-white via-white/50 to-transparent shadow-[0_0_28px_rgba(255,255,255,0.32)]" /></span>
          </h2>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-white/62 sm:text-lg">
            Ready to start your journey in India's Silicon Valley? Our experts are standing by to guide you through every step.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-12">
          
          {/* LEFT: INTERACTIVE FORM */}
          <motion.div
            initial={{ opacity: 0, x: -36, filter: 'blur(12px)' }}
            whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="rounded-[2rem] border border-white/12 bg-white/[0.07] p-5 shadow-2xl shadow-black/35 backdrop-blur-2xl sm:rounded-[2.5rem] sm:p-8 md:p-12"
          >
            <form className="space-y-4 md:space-y-6">
              <div className="group relative">
                <input type="text" placeholder="Your Name" className="w-full rounded-2xl border border-white/10 bg-white/8 px-4 py-3.5 text-white outline-none transition-all placeholder:text-white/35 focus:border-white/45 focus:bg-white/12 md:py-4" />
              </div>
              <div className="group relative">
                <input type="email" placeholder="Email Address" className="w-full rounded-2xl border border-white/10 bg-white/8 px-4 py-3.5 text-white outline-none transition-all placeholder:text-white/35 focus:border-white/45 focus:bg-white/12 md:py-4" />
              </div>
              <div className="group relative">
                <textarea rows="4" placeholder="Tell us about your goals..." className="w-full resize-none rounded-2xl border border-white/10 bg-white/8 px-4 py-3.5 text-white outline-none transition-all placeholder:text-white/35 focus:border-white/45 focus:bg-white/12 md:py-4" />
              </div>
              <motion.button
                whileHover={{ scale: 1.025, y: -2, boxShadow: '0 24px 50px rgba(255,255,255,0.16)' }}
                whileTap={{ scale: 0.98 }}
                className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl border border-white/20 bg-white py-4 font-bold text-black transition-all hover:bg-white/90 md:py-5"
              >
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-black/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                <span className="relative z-10">SEND MESSAGE</span> <Send size={20} className="relative z-10 transition-transform group-hover:translate-x-2" />
              </motion.button>
            </form>
          </motion.div>

          {/* RIGHT: CONTACT DETAILS & MAP */}
          <motion.div
            initial={{ opacity: 0, x: 36, filter: 'blur(12px)' }}
            whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
            className="space-y-6 md:space-y-8"
          >
            {/* ADDRESS CARD */}
            <div className="rounded-[2rem] border border-white/12 bg-gradient-to-br from-white/12 to-white/[0.03] p-5 shadow-2xl shadow-black/25 backdrop-blur-2xl sm:rounded-[2.5rem] sm:p-8">
              <div className="flex items-start gap-4 sm:gap-6">
                <div className="rounded-2xl bg-white p-3.5 shadow-[0_0_30px_rgba(255,255,255,0.22)] sm:p-4">
                  <MapPin className="text-black" size={28} />
                </div>
                <div>
                  <h4 className="mb-2 text-lg font-bold text-white sm:text-xl">Our Campus Hub</h4>
                  <p className="leading-relaxed text-white/65">
                    3rd Floor, Startup Park, <br />
                    Opp. Police Station, Madiwala 1st Stage, <br />
                    Bengaluru, Karnataka - 560068
                  </p>
                </div>
              </div>
            </div>

            {/* QUICK CONTACTS GRID */}
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <a href="https://wa.me/919946953953" className="group flex items-center gap-4 rounded-3xl border border-white/10 bg-white/[0.07] p-5 shadow-xl shadow-black/20 backdrop-blur-xl transition-all hover:-translate-y-1 hover:bg-white/12 sm:p-6">
                <MessageSquare className="text-white/80 transition-transform group-hover:scale-110" size={24} />
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-widest font-bold">WhatsApp</p>
                  <p className="text-white font-medium">+91 99469 53953</p>
                </div>
              </a>
              <a href="tel:+919946953953" className="group flex items-center gap-4 rounded-3xl border border-white/10 bg-white/[0.07] p-5 shadow-xl shadow-black/20 backdrop-blur-xl transition-all hover:-translate-y-1 hover:bg-white/12 sm:p-6">
                <Phone className="text-white/80 transition-transform group-hover:scale-110" size={24} />
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-widest font-bold">Call Us</p>
                  <p className="text-white font-medium">+91 99469 53953</p>
                </div>
              </a>
            </div>

            {/* MAP PREVIEW */}
            <div className="relative group h-48 overflow-hidden rounded-[2rem] border border-white/12 shadow-2xl shadow-black/35 sm:h-64 sm:rounded-[2.5rem]">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.8!2d77.62!3d12.92!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDU1JzEyLjAiTiA3N8KwMzcnMTIuMCJF!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin" 
                className="w-full h-full grayscale invert opacity-75 group-hover:grayscale-0 group-hover:invert-0 group-hover:opacity-100 transition-all duration-700"
                allowFullScreen="" loading="lazy">
              </iframe>
              <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md px-4 py-2 rounded-xl flex items-center gap-2 border border-white/10">
                <Star className="text-white fill-white" size={16} />
                <span className="text-white font-bold text-sm">4.5 (72 Reviews)</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* FLOATING WHATSAPP BUTTON */}
      <a 
        href="https://wa.me/919946953953" 
        className="fixed bottom-4 right-4 z-[100] rounded-full border border-white/20 bg-white p-3 text-black shadow-[0_0_30px_rgba(255,255,255,0.28)] transition-all hover:scale-110 active:scale-95 animate-bounce sm:bottom-8 sm:right-8 sm:p-5"
      >
        <MessageSquare size={32} />
      </a>
    </DotGlobeHero>
  );
}

