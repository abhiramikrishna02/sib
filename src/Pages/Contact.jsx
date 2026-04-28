import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Mail, Phone, MessageSquare, MapPin, Star, Send } from 'lucide-react';

export default function Contact() {
  const canvasRef = useRef(null);

  // --- MATRIX RAIN EFFECT ---
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=%\"'#&_(),.;:?!\\|{}<>[]^~";
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = Array(Math.floor(columns)).fill(1);

    const draw = () => {
      ctx.fillStyle = "rgba(8, 4, 20, 0.1)"; // Match your deep purple theme
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#a21caf"; // Fuchsia-700
      ctx.font = fontSize + "px monospace";

      for (let i = 0; i < drops.length; i++) {
        const text = characters.charAt(Math.floor(Math.random() * characters.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 33);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-[#080414] overflow-hidden py-24 px-6">
      {/* Background Matrix Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-20 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* HEADER SECTION */}
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter mb-4">
            Get in <span className="text-fuchsia-500">Touch</span>
          </h2>
          <p className="text-white/40 max-w-2xl mx-auto text-lg">
            Ready to start your journey in India's Silicon Valley? Our experts are standing by to guide you through every step.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* LEFT: INTERACTIVE FORM */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl">
            <form className="space-y-6">
              <div className="group relative">
                <input type="text" placeholder="Your Name" className="w-full bg-white/5 border-b-2 border-white/10 py-4 px-2 text-white outline-none focus:border-fuchsia-500 transition-colors placeholder:text-white/20" />
              </div>
              <div className="group relative">
                <input type="email" placeholder="Email Address" className="w-full bg-white/5 border-b-2 border-white/10 py-4 px-2 text-white outline-none focus:border-fuchsia-500 transition-colors placeholder:text-white/20" />
              </div>
              <div className="group relative">
                <textarea rows="4" placeholder="Tell us about your goals..." className="w-full bg-white/5 border-b-2 border-white/10 py-4 px-2 text-white outline-none focus:border-fuchsia-500 transition-colors placeholder:text-white/20 resize-none" />
              </div>
              <button className="group w-full py-5 bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-bold rounded-2xl flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02]">
                SEND MESSAGE <Send size={20} className="group-hover:translate-x-2 transition-transform" />
              </button>
            </form>
          </div>

          {/* RIGHT: CONTACT DETAILS & MAP */}
          <div className="space-y-8">
            {/* ADDRESS CARD */}
            <div className="bg-gradient-to-br from-fuchsia-600/20 to-transparent backdrop-blur-lg border border-white/10 rounded-[2.5rem] p-8">
              <div className="flex items-start gap-6">
                <div className="p-4 bg-fuchsia-500 rounded-2xl shadow-[0_0_20px_rgba(162,28,175,0.4)]">
                  <MapPin className="text-white" size={28} />
                </div>
                <div>
                  <h4 className="text-white font-bold text-xl mb-2">Our Campus Hub</h4>
                  <p className="text-white/60 leading-relaxed">
                    3rd Floor, Startup Park, <br />
                    Opp. Police Station, Madiwala 1st Stage, <br />
                    Bengaluru, Karnataka - 560068
                  </p>
                </div>
              </div>
            </div>

            {/* QUICK CONTACTS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a href="https://wa.me/919946953953" className="flex items-center gap-4 p-6 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 transition-all">
                <MessageSquare className="text-green-400" size={24} />
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-widest font-bold">WhatsApp</p>
                  <p className="text-white font-medium">+91 99469 53953</p>
                </div>
              </a>
              <a href="tel:+919946953953" className="flex items-center gap-4 p-6 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 transition-all">
                <Phone className="text-blue-400" size={24} />
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-widest font-bold">Call Us</p>
                  <p className="text-white font-medium">+91 99469 53953</p>
                </div>
              </a>
            </div>

            {/* MAP PREVIEW */}
            <div className="relative group overflow-hidden rounded-[2.5rem] border border-white/10 h-64 shadow-2xl">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.8!2d77.62!3d12.92!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDU1JzEyLjAiTiA3N8KwMzcnMTIuMCJF!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin" 
                className="w-full h-full grayscale invert opacity-70 group-hover:grayscale-0 group-hover:invert-0 group-hover:opacity-100 transition-all duration-700"
                allowFullScreen="" loading="lazy">
              </iframe>
              <div className="absolute top-4 left-4 bg-[#080414]/80 backdrop-blur-md px-4 py-2 rounded-xl flex items-center gap-2 border border-white/10">
                <Star className="text-yellow-400 fill-yellow-400" size={16} />
                <span className="text-white font-bold text-sm">4.5 (72 Reviews)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FLOATING WHATSAPP BUTTON */}
      <a 
        href="https://wa.me/919946953953" 
        className="fixed bottom-8 right-8 z-[100] p-5 bg-green-500 rounded-full text-white shadow-[0_0_30px_rgba(34,197,94,0.4)] hover:scale-110 active:scale-95 transition-all animate-bounce"
      >
        <MessageSquare size={32} />
      </a>
    </div>
  );
}