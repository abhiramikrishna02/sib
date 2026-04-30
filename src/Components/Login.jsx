import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';

const DUMMY_USER = { email: "user@sib.com", password: "password123" };
const DUMMY_ADMIN = { email: "admin@sib.com", password: "admin123" };

// ADDED: { onNavigate } prop to use your app's smooth routing
export default function Login({ onNavigate }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdminView, setIsAdminView] = useState(false);
  const [error, setError] = useState(''); // New: Show error on screen instead of popup

  useEffect(() => {
    if (window.location.href.includes('admin')) {
      setIsAdminView(true);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    const target = isAdminView ? DUMMY_ADMIN : DUMMY_USER;

    if (email === target.email && password === target.password) {
  // Change the redirect logic here:
  if (isAdminView) {
    onNavigate('/add'); // Admins go to the Add page
  } else {
    onNavigate('/');    // Regular users go Home
  }
} else {
      // CHANGED: Set an error message state instead of using alert()
      setError("Invalid credentials. Please check your email and password.");
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0a0212] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-fuchsia-600/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md bg-white/5 border border-white/10 backdrop-blur-2xl rounded-[2.5rem] p-10 shadow-2xl"
      >
        <div className="text-center mb-10">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-600 to-purple-600 mb-4 shadow-lg shadow-fuchsia-500/20">
            {isAdminView ? <ShieldCheck className="text-white" size={32} /> : <User className="text-white" size={32} />}
          </div>
          <h1 className="text-3xl font-black italic tracking-tighter text-white">
            {isAdminView ? 'ADMIN PORTAL' : 'STUDENT LOGIN'}
          </h1>
          
          {/* NEW: Error Message Display */}
          {error && (
            <p className="mt-4 text-xs font-bold uppercase text-red-500 bg-red-500/10 py-2 rounded-lg border border-red-500/20">
              {error}
            </p>
          )}
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-fuchsia-400 transition-colors" size={18} />
            <input 
              type="email" 
              placeholder="Email Address"
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 outline-none focus:border-fuchsia-500/50 transition-all"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(''); }}
              required
            />
          </div>

          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-fuchsia-400 transition-colors" size={18} />
            <input 
              type="password" 
              placeholder="Password"
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 outline-none focus:border-fuchsia-500/50 transition-all"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              required
            />
          </div>

          <button 
            type="submit"
            className="w-full group relative overflow-hidden rounded-2xl bg-white py-4 font-black uppercase tracking-widest text-black transition-all hover:bg-fuchsia-500 hover:text-white"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              Access Dashboard <ArrowRight size={18} />
            </span>
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => { setIsAdminView(!isAdminView); setError(''); }}
            className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 hover:text-white transition-colors"
          >
            Switch to {isAdminView ? 'Student' : 'Administrator'} View
          </button>
        </div>
      </motion.div>
    </div>
  );
}


