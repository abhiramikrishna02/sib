import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Mail, Phone, MessageSquare, MapPin, Star, Send } from 'lucide-react';

export default function Contact() {
  const canvasRef = useRef(null);

  // --- MATRIX RAIN EFFECT ---
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=%\"'#&_(),.;:?!\\|{}<>[]^~";
    const fontSize = 14;
    let drops = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const columns = Math.floor(canvas.width / fontSize);
      drops = Array(columns).fill(1);
    };

    resizeCanvas();

    const draw = () => {
      ctx.fillStyle = "rgba(8, 4, 20, 0.1)"; // Match your deep violet theme
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#d946ef"; // Fuchsia-500
      ctx.font = fontSize + "px monospace";

      for (let i = 0; i < drops.length; i++) {
        const text = characters.charAt(Math.floor(Math.random() * characters.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 33);
    window.addEventListener('resize', resizeCanvas);
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0a0212] px-4 py-16 sm:px-6 md:px-6 md:py-24">
      {/* Background Matrix Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-20 pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* HEADER SECTION */}
        <div className="mb-14 text-center md:mb-20">
          <h2 className="mb-4 text-[clamp(2.2rem,10vw,4.8rem)] font-black uppercase tracking-tighter text-white md:text-7xl">
            Get in <span className="text-fuchsia-500">Touch</span>
          </h2>
          <p className="mx-auto max-w-2xl text-base text-white/40 sm:text-lg">
            Ready to start your journey in India's Silicon Valley? Our experts are standing by to guide you through every step.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-12">
          
          {/* LEFT: INTERACTIVE FORM */}
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-xl sm:rounded-[2.5rem] sm:p-8 md:p-12">
            <form className="space-y-4 md:space-y-6">
              <div className="group relative">
                <input type="text" placeholder="Your Name" className="w-full border-b-2 border-white/10 bg-white/5 px-2 py-3.5 text-white outline-none transition-colors placeholder:text-white/20 focus:border-fuchsia-500 md:py-4" />
              </div>
              <div className="group relative">
                <input type="email" placeholder="Email Address" className="w-full border-b-2 border-white/10 bg-white/5 px-2 py-3.5 text-white outline-none transition-colors placeholder:text-white/20 focus:border-fuchsia-500 md:py-4" />
              </div>
              <div className="group relative">
                <textarea rows="4" placeholder="Tell us about your goals..." className="w-full resize-none border-b-2 border-white/10 bg-white/5 px-2 py-3.5 text-white outline-none transition-colors placeholder:text-white/20 focus:border-fuchsia-500 md:py-4" />
              </div>
              <button className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-fuchsia-600 py-4 font-bold text-white transition-all hover:bg-fuchsia-500 hover:scale-[1.02] md:py-5">
                SEND MESSAGE <Send size={20} className="group-hover:translate-x-2 transition-transform" />
              </button>
            </form>
          </div>

          {/* RIGHT: CONTACT DETAILS & MAP */}
          <div className="space-y-6 md:space-y-8">
            {/* ADDRESS CARD */}
            <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-fuchsia-600/20 to-transparent p-5 backdrop-blur-lg sm:rounded-[2.5rem] sm:p-8">
              <div className="flex items-start gap-4 sm:gap-6">
                <div className="rounded-2xl bg-fuchsia-500 p-3.5 shadow-[0_0_20px_rgba(162,28,175,0.4)] sm:p-4">
                  <MapPin className="text-white" size={28} />
                </div>
                <div>
                  <h4 className="mb-2 text-lg font-bold text-white sm:text-xl">Our Campus Hub</h4>
                  <p className="leading-relaxed text-white/60">
                    3rd Floor, Startup Park, <br />
                    Opp. Police Station, Madiwala 1st Stage, <br />
                    Bengaluru, Karnataka - 560068
                  </p>
                </div>
              </div>
            </div>

            {/* QUICK CONTACTS GRID */}
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <a href="https://wa.me/919946953953" className="flex items-center gap-4 rounded-3xl border border-white/10 bg-white/5 p-5 transition-all hover:bg-white/10 sm:p-6">
                <MessageSquare className="text-fuchsia-400" size={24} />
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-widest font-bold">WhatsApp</p>
                  <p className="text-white font-medium">+91 99469 53953</p>
                </div>
              </a>
              <a href="tel:+919946953953" className="flex items-center gap-4 rounded-3xl border border-white/10 bg-white/5 p-5 transition-all hover:bg-white/10 sm:p-6">
                <Phone className="text-fuchsia-400" size={24} />
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-widest font-bold">Call Us</p>
                  <p className="text-white font-medium">+91 99469 53953</p>
                </div>
              </a>
            </div>

            {/* MAP PREVIEW */}
            <div className="relative group h-48 overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl sm:h-64 sm:rounded-[2.5rem]">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.8!2d77.62!3d12.92!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDU1JzEyLjAiTiA3N8KwMzcnMTIuMCJF!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin" 
                className="w-full h-full grayscale invert opacity-70 group-hover:grayscale-0 group-hover:invert-0 group-hover:opacity-100 transition-all duration-700"
                allowFullScreen="" loading="lazy">
              </iframe>
              <div className="absolute top-4 left-4 bg-[#0a0212]/80 backdrop-blur-md px-4 py-2 rounded-xl flex items-center gap-2 border border-white/10">
                <Star className="text-fuchsia-400 fill-fuchsia-400" size={16} />
                <span className="text-white font-bold text-sm">4.5 (72 Reviews)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FLOATING WHATSAPP BUTTON */}
      <a 
        href="https://wa.me/919946953953" 
        className="fixed bottom-4 right-4 z-[100] rounded-full bg-fuchsia-500 p-3 text-white shadow-[0_0_30px_rgba(192,132,252,0.4)] transition-all hover:scale-110 active:scale-95 animate-bounce sm:bottom-8 sm:right-8 sm:p-5"
      >
        <MessageSquare size={32} />
      </a>
    </div>
  );
}



