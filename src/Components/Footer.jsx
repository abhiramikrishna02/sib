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
    <footer
      className="relative overflow-hidden pb-8 pt-16 sm:pb-10 sm:pt-20"
      style={{
        background: '#08060a',
        borderTop: '1px solid rgba(201,169,110,0.10)',
      }}
    >
      {/* Glow blobs — amber top-left, teal bottom-right, purple mid */}
      <div
        className="pointer-events-none absolute left-1/4 top-0 h-96 w-96 rounded-full"
        style={{ background: 'rgba(201,169,110,0.07)', filter: 'blur(120px)' }}
      />
      <div
        className="pointer-events-none absolute bottom-0 right-1/4 h-96 w-96 rounded-full"
        style={{ background: 'rgba(75,191,191,0.06)', filter: 'blur(120px)' }}
      />
      {/* Subtle purple centre warmth */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: 'rgba(140,90,180,0.04)', filter: 'blur(100px)' }}
      />

      <div className="container relative z-10 mx-auto px-4 sm:px-6">
        <div className="mb-12 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4 sm:mb-16 sm:gap-12">

          {/* COL 1 — Brand */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              {/* Logo mark — amber gradient */}
              <div
                className="flex h-10 w-10 items-center justify-center rounded-lg text-xl font-bold"
                style={{
                  background: 'linear-gradient(135deg, #C9A96E 0%, #A8783A 100%)',
                  color: '#08060a',
                  boxShadow: '0 0 20px rgba(201,169,110,0.28)',
                }}
              >
                S
              </div>
              <h2 className="text-2xl font-black tracking-tighter uppercase text-white">
                Study In{' '}
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: 'linear-gradient(90deg, #C9A96E 0%, #4BBFBF 100%)' }}
                >
                  Bengaluru
                </span>
              </h2>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
              Making Bengaluru the Education Capital of Asia. Empowering students with quality education and opportunities in India's Silicon Valley.
            </p>
            {/* Social icon row — amber hover */}
            <div className="flex gap-3 sm:gap-4">
              {[Mail, MessageSquare, Phone, ChevronRight, MapPin].map((Icon, i) => (
                <button
                  key={i}
                  type="button"
                  className="flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300 hover:scale-110 sm:h-10 sm:w-10"
                  style={{
                    background: 'rgba(201,169,110,0.08)',
                    border: '1px solid rgba(201,169,110,0.14)',
                    color: 'rgba(201,169,110,0.55)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #C9A96E 0%, #A8783A 100%)';
                    e.currentTarget.style.color = '#08060a';
                    e.currentTarget.style.border = '1px solid transparent';
                    e.currentTarget.style.boxShadow = '0 0 16px rgba(201,169,110,0.32)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(201,169,110,0.08)';
                    e.currentTarget.style.color = 'rgba(201,169,110,0.55)';
                    e.currentTarget.style.border = '1px solid rgba(201,169,110,0.14)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <Icon size={18} />
                </button>
              ))}
            </div>
          </div>

          {/* COL 2 — Navigation */}
          <div>
            {/* Section label — teal */}
            <h4
              className="mb-6 text-xs font-bold uppercase tracking-widest"
              style={{ color: '#4BBFBF' }}
            >
              Navigation
            </h4>
            <ul className="space-y-4">
              {navigationLinks.map((link) => (
                <li key={link.label}>
                  <button
                    type="button"
                    onClick={() => handleNavigate(link.to)}
                    className="group flex items-center transition-colors"
                    style={{ color: 'rgba(255,255,255,0.38)' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#C9A96E'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.38)'}
                  >
                    <ChevronRight
                      size={14}
                      className="mr-0 -ml-4 opacity-0 transition-all group-hover:ml-0 group-hover:opacity-100"
                      style={{ color: '#C9A96E' }}
                    />
                    <span>{link.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* COL 3 — Contact Us */}
          <div>
            {/* Section label — teal */}
            <h4
              className="mb-6 text-xs font-bold uppercase tracking-widest"
              style={{ color: '#4BBFBF' }}
            >
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li className="flex gap-3 text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>
                {/* MapPin — amber */}
                <MapPin size={18} className="shrink-0" style={{ color: '#C9A96E' }} />
                <span>3rd Floor, Startup Park, Madiwala, Bengaluru, Karnataka 560068</span>
              </li>
              <li className="flex gap-3 text-sm italic" style={{ color: 'rgba(255,255,255,0.45)' }}>
                {/* Mail — teal */}
                <Mail size={18} className="shrink-0" style={{ color: '#4BBFBF' }} />
                <span>info@studyinbengaluru.com</span>
              </li>
              <li className="flex gap-3 text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>
                {/* Phone — amber */}
                <Phone size={18} className="shrink-0" style={{ color: '#C9A96E' }} />
                <span>+91 9946953953</span>
              </li>
            </ul>
          </div>

          {/* COL 4 — App + WhatsApp */}
          <div className="space-y-6">
            {/* Section label — teal */}
            <h4
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: '#4BBFBF' }}
            >
              Get Our App
            </h4>
            <p className="text-xs italic" style={{ color: 'rgba(255,255,255,0.38)' }}>
              Manage your applications on the go.
            </p>
            <a href="#" className="group inline-block transition-transform hover:-translate-y-1">
              <div
                className="flex items-center gap-3 rounded-xl p-3 pr-6 transition-all duration-300"
                style={{
                  border: '1px solid rgba(201,169,110,0.16)',
                  background: 'rgba(201,169,110,0.05)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.border = '1px solid rgba(201,169,110,0.40)';
                  e.currentTarget.style.background = 'rgba(201,169,110,0.09)';
                  e.currentTarget.style.boxShadow = '0 0 20px rgba(201,169,110,0.12)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.border = '1px solid rgba(201,169,110,0.16)';
                  e.currentTarget.style.background = 'rgba(201,169,110,0.05)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                  alt="Google Play"
                  className="h-10"
                />
              </div>
            </a>
            {/* WhatsApp card — teal accent */}
            <div
              className="rounded-2xl p-4"
              style={{
                border: '1px solid rgba(75,191,191,0.18)',
                background: 'linear-gradient(135deg, rgba(75,191,191,0.10) 0%, rgba(75,191,191,0.03) 100%)',
              }}
            >
              <div className="flex items-center gap-3">
                <MessageSquare style={{ color: '#4BBFBF' }} size={20} />
                <span className="text-sm font-semibold text-white">WhatsApp Support</span>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div
          className="flex flex-col items-center justify-between gap-4 pt-8 text-center md:flex-row md:text-left"
          style={{ borderTop: '1px solid rgba(201,169,110,0.08)' }}
        >
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.28)' }}>
            © {currentYear}{' '}
            <span style={{ color: 'rgba(201,169,110,0.70)', fontWeight: 600 }}>
              StudyInBengaluru.in
            </span>{' '}
            - All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-8 md:justify-end">
            {legalLinks.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => handleNavigate(item.to)}
                className="text-xs underline-offset-4 transition-colors hover:underline"
                style={{ color: 'rgba(255,255,255,0.28)' }}
                onMouseEnter={e => e.currentTarget.style.color = '#4BBFBF'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.28)'}
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