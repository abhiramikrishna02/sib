import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Star, Send, MessageSquare } from 'lucide-react';
import PixelBlast from '../Components/ui/PixelBlast';

export default function Contact() {
  return (
    <div className="relative min-h-[100svh] overflow-hidden px-3 pb-14 pt-28 sm:px-5 sm:pb-18 sm:pt-36 md:px-6 md:pb-24 md:pt-44 lg:pt-48" style={{ background: '#030d0e' }}>

      {/* PixelBlast Background — fullscreen absolute */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, width: '100%', height: '100%' }}>
        <PixelBlast
          variant="circle"
          pixelSize={6}
          color="#4BBFBF"
          patternScale={3}
          patternDensity={1.2}
          pixelSizeJitter={0.5}
          enableRipples={true}
          rippleSpeed={0.4}
          rippleThickness={0.12}
          rippleIntensityScale={1.5}
          liquid={false}
          speed={0.6}
          edgeFade={0.25}
          transparent={true}
        />
      </div>

      {/* Very subtle dark tint — just enough to keep text readable, NOT hiding the bg */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'rgba(3,13,14,0.52)', pointerEvents: 'none' }} />

      {/* Soft glow blobs — amber-gold primary + teal secondary */}
      {/* Top-left: warm amber glow */}
      <div style={{ position: 'absolute', left: '-10%', top: '-10%', zIndex: 1, width: 460, height: 460, borderRadius: '50%', background: 'rgba(201,169,110,0.10)', filter: 'blur(110px)', pointerEvents: 'none' }} />
      {/* Top-right: teal glow */}
      <div style={{ position: 'absolute', right: '-8%', top: '-8%', zIndex: 1, width: 420, height: 420, borderRadius: '50%', background: 'rgba(75,191,191,0.08)', filter: 'blur(120px)', pointerEvents: 'none' }} />
      {/* Center-bottom: deep amber warmth */}
      <div style={{ position: 'absolute', bottom: '-12%', left: '50%', transform: 'translateX(-50%)', zIndex: 1, width: 600, height: 440, borderRadius: '50%', background: 'rgba(201,169,110,0.07)', filter: 'blur(130px)', pointerEvents: 'none' }} />
      {/* Mid-left accent: subtle teal */}
      <div style={{ position: 'absolute', left: '20%', top: '45%', zIndex: 1, width: 280, height: 280, borderRadius: '50%', background: 'rgba(75,191,191,0.05)', filter: 'blur(90px)', pointerEvents: 'none' }} />

      {/* Bottom fade so content doesn't hard-cut */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'linear-gradient(to top, rgba(3,13,14,0.55) 0%, transparent 40%)', pointerEvents: 'none' }} />

      <div className="relative mx-auto w-full max-w-7xl" style={{ zIndex: 10 }}>
        {/* HEADER SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-9 text-center sm:mb-12 md:mb-20 lg:mb-24"
        >
          <h2 className="mx-auto mb-4 max-w-[11ch] text-[clamp(2.35rem,13vw,5.8rem)] font-black uppercase leading-[0.9] tracking-normal text-white sm:max-w-none sm:tracking-tighter md:text-8xl">
            Get in{' '}
            <span className="relative inline-block" style={{ color: '#C9A96E' }}>
              Touch
              {/* Amber underline glow — matches new accent */}
              <span
                className="absolute -bottom-2 left-0 h-2 w-full rounded-full"
                style={{
                  background: 'linear-gradient(to right, #C9A96E, rgba(201,169,110,0.4), transparent)',
                  boxShadow: '0 0 28px rgba(201,169,110,0.38)',
                }}
              />
            </span>
          </h2>
          <p className="mx-auto max-w-2xl px-1 text-sm leading-relaxed sm:text-base md:text-lg" style={{ color: 'rgba(255,255,255,0.60)' }}>
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
            className="min-w-0 rounded-3xl p-4 shadow-2xl backdrop-blur-2xl sm:rounded-[2rem] sm:p-6 md:rounded-[2.5rem] md:p-10 lg:p-12"
            style={{
              border: '1px solid rgba(75,191,191,0.16)',
              background: 'rgba(75,191,191,0.05)',
              boxShadow: '0 32px 64px rgba(3,13,14,0.4), inset 0 1px 0 rgba(75,191,191,0.10)',
            }}
          >
            <form className="space-y-4 md:space-y-6">
              <div className="group relative">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full rounded-2xl px-4 py-3 text-white outline-none transition-all md:py-4"
                  style={{
                    border: '1px solid rgba(75,191,191,0.14)',
                    background: 'rgba(75,191,191,0.06)',
                    '::placeholder': { color: 'rgba(255,255,255,0.32)' },
                  }}
                  onFocus={e => {
                    e.target.style.border = '1px solid rgba(201,169,110,0.45)';
                    e.target.style.background = 'rgba(201,169,110,0.07)';
                  }}
                  onBlur={e => {
                    e.target.style.border = '1px solid rgba(75,191,191,0.14)';
                    e.target.style.background = 'rgba(75,191,191,0.06)';
                  }}
                />
              </div>
              <div className="group relative">
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full rounded-2xl px-4 py-3 text-white outline-none transition-all md:py-4"
                  style={{
                    border: '1px solid rgba(75,191,191,0.14)',
                    background: 'rgba(75,191,191,0.06)',
                  }}
                  onFocus={e => {
                    e.target.style.border = '1px solid rgba(201,169,110,0.45)';
                    e.target.style.background = 'rgba(201,169,110,0.07)';
                  }}
                  onBlur={e => {
                    e.target.style.border = '1px solid rgba(75,191,191,0.14)';
                    e.target.style.background = 'rgba(75,191,191,0.06)';
                  }}
                />
              </div>
              <div className="group relative">
                <textarea
                  rows="4"
                  placeholder="Tell us about your goals..."
                  className="w-full resize-none rounded-2xl px-4 py-3 text-white outline-none transition-all md:py-4"
                  style={{
                    border: '1px solid rgba(75,191,191,0.14)',
                    background: 'rgba(75,191,191,0.06)',
                  }}
                  onFocus={e => {
                    e.target.style.border = '1px solid rgba(201,169,110,0.45)';
                    e.target.style.background = 'rgba(201,169,110,0.07)';
                  }}
                  onBlur={e => {
                    e.target.style.border = '1px solid rgba(75,191,191,0.14)';
                    e.target.style.background = 'rgba(75,191,191,0.06)';
                  }}
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.025, y: -2, boxShadow: '0 24px 50px rgba(201,169,110,0.28)' }}
                whileTap={{ scale: 0.98 }}
                className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl py-3.5 font-bold transition-all md:py-5"
                style={{
                  background: 'linear-gradient(135deg, #C9A96E 0%, #B8934A 100%)',
                  border: '1px solid rgba(201,169,110,0.35)',
                  color: '#0a0500',
                  boxShadow: '0 8px 32px rgba(201,169,110,0.22)',
                }}
              >
                {/* Shimmer sweep on hover */}
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                <span className="relative z-10">SEND MESSAGE</span>
                <Send size={20} className="relative z-10 transition-transform group-hover:translate-x-2" />
              </motion.button>
            </form>
          </motion.div>

          {/* RIGHT: CONTACT DETAILS & MAP */}
          <motion.div
            initial={{ opacity: 0, x: 36, filter: 'blur(12px)' }}
            whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
            className="min-w-0 space-y-4 sm:space-y-6 md:space-y-8"
          >
            {/* ADDRESS CARD */}
            <div
              className="rounded-3xl p-4 shadow-2xl backdrop-blur-2xl sm:rounded-[2rem] sm:p-6 md:rounded-[2.5rem] md:p-8"
              style={{
                border: '1px solid rgba(201,169,110,0.18)',
                background: 'linear-gradient(135deg, rgba(201,169,110,0.10) 0%, rgba(75,191,191,0.04) 100%)',
                boxShadow: '0 24px 48px rgba(3,13,14,0.3)',
              }}
            >
              <div className="flex items-start gap-3 sm:gap-6">
                {/* Icon box — amber gold */}
                <div
                  className="rounded-2xl p-3 sm:p-4 shrink-0"
                  style={{
                    background: 'linear-gradient(135deg, #C9A96E 0%, #A8783A 100%)',
                    boxShadow: '0 0 30px rgba(201,169,110,0.30)',
                  }}
                >
                  <MapPin style={{ color: '#0a0500' }} size={24} />
                </div>
                <div className="min-w-0">
                  <h4 className="mb-2 text-lg font-bold text-white sm:text-xl">Our Campus Hub</h4>
                  <p className="text-sm leading-relaxed sm:text-base" style={{ color: 'rgba(255,255,255,0.62)' }}>
                    3rd Floor, Startup Park, <br />
                    Opp. Police Station, Madiwala 1st Stage, <br />
                    Bengaluru, Karnataka - 560068
                  </p>
                </div>
              </div>
            </div>

            {/* QUICK CONTACTS GRID */}
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">

              {/* EMAIL CARD */}
              <div
                className="group flex min-w-0 flex-col gap-3 rounded-2xl p-4 shadow-xl backdrop-blur-xl sm:rounded-3xl sm:p-6"
                style={{
                  border: '1px solid rgba(75,191,191,0.13)',
                  background: 'rgba(75,191,191,0.05)',
                  boxShadow: '0 16px 32px rgba(3,13,14,0.25)',
                }}
              >
                <div className="flex items-center gap-3">
                  {/* Teal icon */}
                  <Mail style={{ color: '#4BBFBF', flexShrink: 0 }} size={24} />
                  <p className="text-xs uppercase tracking-widest font-bold" style={{ color: 'rgba(75,191,191,0.55)' }}>Email Us</p>
                </div>
                <div className="space-y-2 min-w-0">
                  <a
                    href="mailto:info@studyinbengaluru.com"
                    className="block break-all text-sm font-medium text-white transition-colors"
                    style={{ '--hover-color': '#C9A96E' }}
                    onMouseEnter={e => e.target.style.color = '#C9A96E'}
                    onMouseLeave={e => e.target.style.color = 'white'}
                  >
                    info@studyinbengaluru.com
                  </a>
                  <a
                    href="mailto:abin@studyinbengaluru.com"
                    className="block break-all text-sm font-medium text-white transition-colors"
                    onMouseEnter={e => e.target.style.color = '#C9A96E'}
                    onMouseLeave={e => e.target.style.color = 'white'}
                  >
                    abin@studyinbengaluru.com
                  </a>
                </div>
              </div>

              {/* PHONE CARD */}
              <a
                href="tel:+919946953953"
                className="group flex min-w-0 items-center gap-3 rounded-2xl p-4 shadow-xl backdrop-blur-xl transition-all sm:gap-4 sm:rounded-3xl sm:p-6"
                style={{
                  border: '1px solid rgba(75,191,191,0.13)',
                  background: 'rgba(75,191,191,0.05)',
                  boxShadow: '0 16px 32px rgba(3,13,14,0.25)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(201,169,110,0.08)';
                  e.currentTarget.style.border = '1px solid rgba(201,169,110,0.22)';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(75,191,191,0.05)';
                  e.currentTarget.style.border = '1px solid rgba(75,191,191,0.13)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <Phone style={{ color: '#4BBFBF' }} size={24} className="transition-transform group-hover:scale-110" />
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-widest font-bold" style={{ color: 'rgba(75,191,191,0.55)' }}>Call Us</p>
                  <p className="break-words text-sm font-medium text-white sm:text-base">+91 99469 53953</p>
                </div>
              </a>
            </div>

            {/* MAP PREVIEW */}
            <div
              className="relative group h-44 overflow-hidden rounded-3xl shadow-2xl sm:h-56 sm:rounded-[2rem] md:h-64 md:rounded-[2.5rem]"
              style={{
                border: '1px solid rgba(201,169,110,0.16)',
                boxShadow: '0 32px 64px rgba(3,13,14,0.4)',
              }}
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.8!2d77.62!3d12.92!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDU1JzEyLjAiTiA3N8KwMzcnMTIuMCJF!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin"
                className="w-full h-full grayscale invert opacity-70 group-hover:grayscale-0 group-hover:invert-0 group-hover:opacity-100 transition-all duration-700"
                allowFullScreen=""
                loading="lazy"
              />
              {/* Rating badge — amber accent */}
              <div
                className="absolute left-3 top-3 flex items-center gap-2 rounded-xl px-3 py-2 backdrop-blur-md sm:left-4 sm:top-4 sm:px-4"
                style={{
                  border: '1px solid rgba(201,169,110,0.22)',
                  background: 'rgba(3,13,14,0.72)',
                }}
              >
                <Star style={{ color: '#C9A96E', fill: '#C9A96E' }} size={16} />
                <span className="text-xs font-bold text-white sm:text-sm">4.5 (72 Reviews)</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* FLOATING WHATSAPP BUTTON — teal accent */}
      <a
        href="https://wa.me/919946953953"
        style={{
          zIndex: 100,
          background: 'linear-gradient(135deg, #4BBFBF 0%, #2E9E9E 100%)',
          boxShadow: '0 0 32px rgba(75,191,191,0.35)',
          color: '#030d0e',
        }}
        className="fixed bottom-4 right-4 rounded-full p-3 transition-all hover:scale-110 active:scale-95 animate-bounce sm:bottom-8 sm:right-8 sm:p-5"
        onMouseEnter={e => {
          e.currentTarget.style.boxShadow = '0 0 48px rgba(75,191,191,0.55)';
          e.currentTarget.style.background = 'linear-gradient(135deg, #5DCFCF 0%, #3AAEAE 100%)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.boxShadow = '0 0 32px rgba(75,191,191,0.35)';
          e.currentTarget.style.background = 'linear-gradient(135deg, #4BBFBF 0%, #2E9E9E 100%)';
        }}
      >
        <MessageSquare className="h-6 w-6 sm:h-8 sm:w-8" />
      </a>
    </div>
  );
}
