import React from 'react';
import { Mail, MapPin, Phone, MessageSquare, ChevronRight } from 'lucide-react';

const navigationLinks = [
  { label: 'Home', to: '/' },
  { label: 'About Us', to: '/about' },
  { label: 'Services', to: '/services' },
  { label: 'Colleges', to: '/services#colleges' },
  { label: 'Courses', to: '/services#courses' },
];

const legalLinks = [
  { label: 'Privacy Policy', to: '/contact' },
  { label: 'Refund & Cancellation', to: '/contact' },
  { label: 'Terms & Conditions', to: '/contact' },
];

const Footer = ({ onNavigate }) => {
  const currentYear = new Date().getFullYear();

  const handleNavigate = (to) => {
    if (onNavigate) {
      onNavigate(to);
      return;
    }

    window.location.href = to;
  };

  return (
    <footer className="relative overflow-hidden border-t border-white/5 bg-[#0f021a] pb-8 pt-16 sm:pb-10 sm:pt-20">
      <div className="pointer-events-none absolute left-1/4 top-0 h-96 w-96 rounded-full bg-purple-600/10 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-cyan-500/10 blur-[120px]" />

      <div className="container relative z-10 mx-auto px-4 sm:px-6">
        <div className="mb-12 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4 sm:mb-16 sm:gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-xl font-bold text-white shadow-lg shadow-purple-500/20">
                S
              </div>
              <h2 className="text-2xl font-black tracking-tighter uppercase text-white">
                Study In <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Bengaluru</span>
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-white/60">
              Making Bengaluru the Education Capital of Asia. Empowering students with quality education and opportunities in India's Silicon Valley.
            </p>
            <div className="flex gap-3 sm:gap-4">
              {[Mail, MessageSquare, Phone, ChevronRight, MapPin].map((Icon, i) => (
                <button
                  key={i}
                  type="button"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-white/50 transition-all duration-300 hover:scale-110 hover:bg-white hover:text-black sm:h-10 sm:w-10"
                >
                  <Icon size={18} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-6 text-xs font-bold uppercase tracking-widest text-white">Navigation</h4>
            <ul className="space-y-4">
              {navigationLinks.map((link) => (
                <li key={link.label}>
                  <button
                    type="button"
                    onClick={() => handleNavigate(link.to)}
                    className="flex items-center group text-white/40 transition-colors hover:text-purple-400"
                  >
                    <ChevronRight size={14} className="mr-0 -ml-4 opacity-0 transition-all group-hover:ml-0 group-hover:opacity-100" />
                    <span>{link.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-6 text-xs font-bold uppercase tracking-widest text-white">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex gap-3 text-sm text-white/40">
                <MapPin size={18} className="shrink-0 text-purple-500" />
                <span>3rd Floor, Startup Park, Madiwala, Bengaluru, Karnataka 560068</span>
              </li>
              <li className="flex gap-3 text-sm italic text-white/40">
                <Mail size={18} className="shrink-0 text-purple-500" />
                <span>info@studyinbengaluru.com</span>
              </li>
              <li className="flex gap-3 text-sm text-white/40">
                <Phone size={18} className="shrink-0 text-purple-500" />
                <span>+91 9946953953</span>
              </li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">Get Our App</h4>
            <p className="text-xs italic text-white/40">Manage your applications on the go.</p>
            <a href="#" className="group inline-block transition-transform hover:-translate-y-1">
              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-black p-3 pr-6 transition-colors group-hover:border-purple-500/50">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                  alt="Google Play"
                  className="h-10"
                />
              </div>
            </a>
            <div className="rounded-2xl border border-purple-500/20 bg-gradient-to-r from-purple-500/10 to-transparent p-4">
              <div className="flex items-center gap-3">
                <MessageSquare className="text-green-400" size={20} />
                <span className="text-sm font-semibold text-white">WhatsApp Support</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 text-center md:flex-row md:text-left">
          <p className="text-xs text-white/30">
            © {currentYear} <span className="font-semibold text-white/60">StudyInBengaluru.in</span> - All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-8 md:justify-end">
            {legalLinks.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => handleNavigate(item.to)}
                className="text-xs text-white/30 underline-offset-4 transition-colors hover:text-white hover:underline"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
