import React from 'react';
import { Mail, MapPin, Phone, MessageSquare, ChevronRight } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#0f021a] pt-20 pb-10 overflow-hidden border-t border-white/5">
      {/* Background Neon Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center font-bold text-white text-xl shadow-lg shadow-purple-500/20">
                S
              </div>
              <h2 className="text-2xl font-black text-white tracking-tighter uppercase">
                Study In <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Bengaluru</span>
              </h2>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              Making Bengaluru the Education Capital of Asia. Empowering students with quality education and opportunities in India’s Silicon Valley.
            </p>
            <div className="flex gap-4">
              {[Mail, MessageSquare, Phone, ChevronRight, MapPin].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:bg-white hover:text-black hover:scale-110 transition-all duration-300">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Navigation</h4>
            <ul className="space-y-4">
              {['Home', 'About Us', 'Services', 'Colleges', 'Internships'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-white/40 hover:text-purple-400 flex items-center group transition-colors">
                    <ChevronRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    <span>{link}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex gap-3 text-white/40 text-sm">
                <MapPin size={18} className="text-purple-500 shrink-0" />
                <span>3rd Floor, Startup Park, Madiwala, Bengaluru, Karnataka 560068</span>
              </li>
              <li className="flex gap-3 text-white/40 text-sm italic">
                <Mail size={18} className="text-purple-500 shrink-0" />
                <span>info@studyinbengaluru.com</span>
              </li>
              <li className="flex gap-3 text-white/40 text-sm">
                <Phone size={18} className="text-purple-500 shrink-0" />
                <span>+91 9946953953</span>
              </li>
            </ul>
          </div>

          {/* App Download */}
          <div className="space-y-6">
            <h4 className="text-white font-bold uppercase tracking-widest text-xs">Get Our App</h4>
            <p className="text-white/40 text-xs italic">Manage your applications on the go.</p>
            <a href="#" className="inline-block group transition-transform hover:-translate-y-1">
              <div className="bg-black border border-white/10 rounded-xl p-3 pr-6 flex items-center gap-3 group-hover:border-purple-500/50 transition-colors">
                <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" className="h-10" />
              </div>
            </a>
            <div className="bg-gradient-to-r from-purple-500/10 to-transparent p-4 rounded-2xl border border-purple-500/20">
               <div className="flex items-center gap-3">
                  <MessageSquare className="text-green-400" size={20} />
                  <span className="text-white font-semibold text-sm">WhatsApp Support</span>
               </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-white/30 text-xs">
            © {currentYear} <span className="text-white/60 font-semibold">StudyInBengaluru.in</span> — All rights reserved.
          </p>
          <div className="flex gap-8">
            {['Privacy Policy', 'Refund & Cancellation', 'Terms & Conditions'].map((item) => (
              <a key={item} href="#" className="text-white/30 hover:text-white text-xs transition-colors underline-offset-4 hover:underline">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
