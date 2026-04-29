import React from 'react';
import { motion } from 'framer-motion';
import { Plus, LayoutDashboard, Database, ArrowLeft } from 'lucide-react';

export default function Add({ onNavigate }) {
  return (
    <div className="min-h-screen w-full bg-[#0a0212] p-8 relative overflow-hidden">
      {/* Background Aura */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-black italic tracking-tighter text-white">ADMIN DASHBOARD</h1>
            <p className="text-white/40 text-xs font-bold uppercase tracking-[0.3em] mt-2">Manage System Content</p>
          </div>
          <button 
            onClick={() => onNavigate('/')}
            className="flex items-center gap-2 text-white/40 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest"
          >
            <ArrowLeft size={14} /> Back to Site
          </button>
        </div>

        {/* Action Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-white/5 border border-white/10 p-8 rounded-[2rem] backdrop-blur-xl cursor-pointer group"
          >
            <div className="h-12 w-12 rounded-xl bg-fuchsia-600 flex items-center justify-center mb-6 group-hover:shadow-[0_0_20px_rgba(192,132,252,0.4)] transition-all">
              <Plus className="text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Add Opportunity</h3>
            <p className="text-white/40 text-sm">Upload new universities, courses, or job listings.</p>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-white/5 border border-white/10 p-8 rounded-[2rem] backdrop-blur-xl cursor-pointer"
          >
            <div className="h-12 w-12 rounded-xl bg-blue-600 flex items-center justify-center mb-6">
              <Database className="text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Database</h3>
            <p className="text-white/40 text-sm">View and edit existing entries in the system.</p>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-white/5 border border-white/10 p-8 rounded-[2rem] backdrop-blur-xl cursor-pointer"
          >
            <div className="h-12 w-12 rounded-xl bg-emerald-600 flex items-center justify-center mb-6">
              <LayoutDashboard className="text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Analytics</h3>
            <p className="text-white/40 text-sm">Monitor user applications and engagement levels.</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}