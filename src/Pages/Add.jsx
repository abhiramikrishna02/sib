import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, ArrowLeft, GraduationCap, School, BookOpen, X, Trash2, 
  Send, MapPin, Star, Banknote, Info, Phone, Mail, Globe, 
  Layers, Clock, Trophy, ShieldCheck, Pencil, AlertCircle
} from 'lucide-react';

export default function Add({ onNavigate, globalData, setGlobalData }) {
  const [activeCategory, setActiveCategory] = useState(null);
  const [showAll, setShowAll] = useState({ Universities: false, Colleges: false, Courses: false });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  
  const initialFormState = {
    name: '', rating: '', affiliation: '', location: '', streams: '',
    feeRange: '', feeStart: '', feeMax: '',
    about: '', type: '', levels: '',
    phone: '', email: '', address: '',
    degree: '', level: '', categoryTag: '', duration: '',
    providerType: '', providerName: '', medianSalary: '', mode: 'Offline'
  };

  const [formData, setFormData] = useState(initialFormState);

  // Close modal and reset state
  const closeModal = () => {
    setActiveCategory(null);
    setIsEditing(false);
    setEditId(null);
    setFormData(initialFormState);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isEditing) {
      // Update existing item
      const updatedList = globalData[activeCategory].map(item => 
        item.id === editId ? { ...formData, id: editId } : item
      );
      setGlobalData({ ...globalData, [activeCategory]: updatedList });
    } else {
      // Add new item
      const newItem = { ...formData, id: Date.now() };
      setGlobalData({
        ...globalData,
        [activeCategory]: [...(globalData[activeCategory] || []), newItem]
      });
    }
    closeModal();
  };

  const handleEdit = (category, item) => {
    setFormData(item);
    setActiveCategory(category);
    setIsEditing(true);
    setEditId(item.id);
  };

  const removeItem = (category, id) => {
    if(window.confirm("Permanent Delete? This cannot be undone.")) {
      setGlobalData({
        ...globalData,
        [category]: globalData[category].filter(item => item.id !== id)
      });
      if(isEditing) closeModal();
    }
  };

  const renderSection = (title, Icon) => {
    const items = globalData[title] || [];
    const displayItems = showAll[title] ? items : items.slice(0, 6);

    return (
      <section className="mb-24">
        <div className="flex justify-between items-end mb-10 border-b border-white/5 pb-6">
          <div className="flex items-center gap-5">
            <div className="h-14 w-14 rounded-2xl bg-violet-500/10 flex items-center justify-center border border-violet-500/20 text-violet-400">
              <Icon size={28} />
            </div>
            <div>
              <h2 className="text-3xl font-black italic tracking-tighter text-white uppercase">{title}</h2>
              <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em]">{items.length} Entries</p>
            </div>
          </div>
          <button 
            onClick={() => { setIsEditing(false); setActiveCategory(title); }}
            className="bg-white px-8 py-3 rounded-xl text-black text-[11px] font-black uppercase tracking-widest hover:bg-violet-500 hover:text-white transition-all"
          >
            + ADD {title.slice(0, -1)}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayItems.map((item) => (
            <motion.div layout key={item.id} className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-8 relative group flex flex-col justify-between overflow-hidden">
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-xl font-bold text-white leading-tight">{item.name}</h3>
                  {item.rating && (
                    <span className="flex shrink-0 items-center gap-1 text-violet-400 text-[10px] font-black bg-violet-400/10 px-3 py-1.5 rounded-xl border border-violet-400/20">
                      <Star size={10} fill="currentColor"/> {item.rating}
                    </span>
                  )}
                </div>

                <div className="space-y-5">
                  <div className="flex flex-wrap gap-2">
                    <span className="text-[9px] font-bold text-white/40 uppercase bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">{item.location}</span>
                    <span className="text-[9px] font-bold text-violet-400 uppercase bg-violet-400/5 px-2.5 py-1 rounded-lg border border-violet-400/10">{item.type || item.level}</span>
                  </div>

                  <div className="bg-black/20 p-5 rounded-2xl border border-white/5 shadow-inner">
                    <p className="text-[9px] text-white/20 uppercase font-black tracking-widest mb-3">Specifications</p>
                    <ul className="text-[11px] text-white/60 space-y-2">
                      {item.feeRange && <li className="flex justify-between items-center"><span className="text-white/30">Fees:</span> <span className="text-white font-medium">{item.feeRange}</span></li>}
                      {item.duration && <li className="flex justify-between items-center"><span className="text-white/30">Duration:</span> <span className="text-white font-medium">{item.duration}</span></li>}
                      {item.mode && <li className="flex justify-between items-center"><span className="text-white/30">Mode:</span> <span className="text-white font-medium">{item.mode}</span></li>}
                    </ul>
                  </div>
                </div>
              </div>

              {/* CLEAN ACTION BAR AT BOTTOM */}
              <div className="mt-8 pt-6 border-t border-white/5 flex justify-end items-center gap-3">
                <button 
                  onClick={() => handleEdit(title, item)}
                  className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white hover:bg-violet-500 transition-all duration-300"
                >
                  <Pencil size={12} /> Edit
                </button>
                <button 
                  onClick={() => removeItem(title, item.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-white hover:bg-red-500 transition-all duration-300"
                >
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {items.length > 6 && (
          <button onClick={() => setShowAll({...showAll, [title]: !showAll[title]})} className="mt-12 mx-auto block text-[10px] font-black uppercase tracking-[0.5em] text-white/20 hover:text-violet-400 transition-colors">
            {showAll[title] ? "Hide Extras" : "See More Options"}
          </button>
        )}
      </section>
    );
  };

  return (
    <div className="min-h-screen bg-[#431f60] text-white p-6 md:p-16 relative">
      <div className="max-w-7xl mx-auto relative z-10">
        <header className="flex justify-between items-start mb-24">
          <div>
            <h1 className="text-6xl font-black italic tracking-tighter text-white">CORE<span className="text-violet-500">.</span></h1>
            <p className="text-white/20 text-xs font-bold uppercase tracking-[0.5em] mt-2">Database Management</p>
          </div>
          <button onClick={() => onNavigate('/')} className="flex items-center gap-3 text-white/40 hover:text-white transition-all text-[10px] font-bold uppercase tracking-widest pt-4">
            <ArrowLeft size={16} /> Exit Admin
          </button>
        </header>

        {renderSection("Universities", GraduationCap)}
        {renderSection("Colleges", School)}
        {renderSection("Courses", BookOpen)}
      </div>

      <AnimatePresence>
        {activeCategory && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            <motion.div initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} onClick={closeModal} className="absolute inset-0 bg-black/90 backdrop-blur-xl" />
            
            <motion.div initial={{y: 50, opacity: 0}} animate={{y: 0, opacity: 1}} className="relative w-full max-w-4xl bg-[#431f60] border border-white/10 rounded-[3rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
              
              <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                <div>
                    <h2 className="text-3xl font-black italic tracking-tighter uppercase">
                        {isEditing ? `Edit ${activeCategory.slice(0,-1)}` : `New ${activeCategory.slice(0,-1)}`}
                    </h2>
                    {isEditing && <p className="text-[10px] font-bold text-violet-400 uppercase tracking-widest mt-1">Modifying existing record ID: {editId}</p>}
                </div>
                <button onClick={closeModal} className="p-2 hover:bg-white/10 rounded-full transition-all"><X /></button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 md:p-12 overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <h4 className="text-violet-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2"><Info size={14}/> Basic Information</h4>
                      <input placeholder="Official Name" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-violet-500" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required/>
                      <div className="grid grid-cols-2 gap-4">
                        <input placeholder="Rating" className="bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-violet-500" value={formData.rating} onChange={e => setFormData({...formData, rating: e.target.value})} />
                        <input placeholder="Location" className="bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-violet-500" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} required/>
                      </div>
                      {activeCategory === "Colleges" && (
                        <select className="w-full bg-[#431f60] border border-white/10 rounded-xl p-4 outline-none focus:border-violet-500" value={formData.affiliation} onChange={e => setFormData({...formData, affiliation: e.target.value})}>
                          <option value="">Select University Affiliation</option>
                          {globalData.Universities?.map(u => <option key={u.id} value={u.name}>{u.name}</option>)}
                        </select>
                      )}
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-violet-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2"><Banknote size={14}/> Fee Details</h4>
                      <input placeholder="Annual Fee Range" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-violet-500" value={formData.feeRange} onChange={e => setFormData({...formData, feeRange: e.target.value})} />
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-violet-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2"><Phone size={14}/> Contact Details</h4>
                      <input placeholder="Phone" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-violet-500" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                      <input placeholder="Email" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-violet-500" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div className="space-y-4">
                      <h4 className="text-violet-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2"><ShieldCheck size={14}/> Quick Facts</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <input placeholder="Inst. Type" className="bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-violet-500" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} />
                        <input placeholder="Course Levels" className="bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-violet-500" value={formData.levels} onChange={e => setFormData({...formData, levels: e.target.value})} />
                      </div>
                      {activeCategory === "Courses" && (
                        <>
                          <input placeholder="Duration" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-violet-500" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} />
                          <select className="w-full bg-[#431f60] border border-white/10 rounded-xl p-4 outline-none focus:border-violet-500" value={formData.mode} onChange={e => setFormData({...formData, mode: e.target.value})}>
                            <option value="Offline">Offline Mode</option>
                            <option value="Online">Online Mode</option>
                            <option value="Hybrid">Hybrid Mode</option>
                          </select>
                        </>
                      )}
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-violet-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2"><Layers size={14}/> About Section</h4>
                      <textarea rows="6" placeholder="About the institution..." className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-violet-500 resize-none" value={formData.about} onChange={e => setFormData({...formData, about: e.target.value})} />
                    </div>
                  </div>
                </div>

                <div className="mt-12 p-8 bg-white/5 border border-white/10 rounded-[2rem] flex flex-col md:flex-row justify-between items-center gap-6">
                  {isEditing ? (
                    <button 
                        type="button" 
                        onClick={() => removeItem(activeCategory, editId)}
                        className="w-full md:w-auto text-red-500/50 hover:text-red-500 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 transition-colors"
                    >
                        <Trash2 size={14}/> Delete Forever
                    </button>
                  ) : (
                    <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest italic">Draft mode: ensure accuracy</p>
                  )}
                  
                  <div className="flex w-full md:w-auto gap-4">
                    <button onClick={closeModal} type="button" className="hidden md:block px-8 text-white/30 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors">Discard</button>
                    <button type="submit" className="w-full md:w-auto bg-violet-500 px-12 py-5 rounded-2xl text-white font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all flex items-center justify-center gap-3 shadow-xl shadow-violet-500/20">
                        {isEditing ? "SAVE CHANGES" : "PUBLISH DATA"} <Send size={18}/>
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(192, 132, 252, 0.2); border-radius: 10px; }
      `}</style>
    </div>
  );
}


