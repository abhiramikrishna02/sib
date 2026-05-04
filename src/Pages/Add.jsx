import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase.js';
import {
  Plus, ArrowLeft, GraduationCap, School, BookOpen, X, Trash2, 
  Send, MapPin, Star, Banknote, Info, Phone, Mail, Globe, ArrowRight,
  Layers, Clock, Trophy, ShieldCheck, Pencil, AlertCircle
} from 'lucide-react';

function parseImageList(images) {
  if (Array.isArray(images)) return images.filter(Boolean);
  if (typeof images === 'string') {
    return images
      .split(/\r?\n|,/)
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function getDocumentPath(file, category) {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]+/g, '_');
  return `${category.toLowerCase()}/${Date.now()}-${safeName}`;
}

function buildOpportunityPayload(formData, category) {
  return {
    category,
    name: formData.name,
    image_url: formData.image_url || null,
    images: parseImageList(formData.images),
    rating: formData.rating || null,
    affiliation: formData.affiliation || null,
    location: formData.location || null,
    fee_range: formData.feeRange || null,
    type: formData.type || null,
    levels: formData.levels || null,
    phone: formData.phone || null,
    email: formData.email || null,
    address: formData.address || null,
    about: formData.about || null,
    duration: formData.duration || null,
    mode: formData.mode || 'Offline',
    document_url: formData.document_url || null,
    document_name: formData.document_name || null,
    document_type: formData.document_type || null,
  };
}

function getTableName(category) {
  if (category === 'Universities') return 'universities';
  if (category === 'Colleges') return 'colleges';
  if (category === 'Courses') return 'courses';
  return 'opportunities';
}

function buildTablePayload(formData, category, { includeMedia = true } = {}) {
  const payload = {
    name: formData.name,
    rating: formData.rating || null,
    location: formData.location || null,
    about: formData.about || null,
    phone: formData.phone || null,
    email: formData.email || null,
    address: formData.address || null,
    document_url: formData.document_url || null,
    document_name: formData.document_name || null,
    document_type: formData.document_type || null,
  };

  if (category === 'Universities') {
    payload.logo_url = formData.image_url || null;
    payload.image_url = formData.image_url || null;
    if (includeMedia) payload.images = parseImageList(formData.images);
  } else {
    payload.image_url = formData.image_url || null;
    if (includeMedia) payload.images = parseImageList(formData.images);
    payload.fee_range = formData.feeRange || null;
    payload.type = formData.type || null;
    payload.levels = formData.levels || null;
    payload.duration = formData.duration || null;
    payload.mode = formData.mode || 'Offline';
  }

  if (category === 'Colleges') {
    payload.university_id = formData.university_id || null;
  }

  if (category === 'Courses') {
    payload.college_id = formData.college_id || null;
    payload.degree = formData.degree || formData.type || null;
    payload.level = formData.levels || null;
    delete payload.address;
  }

  return payload;
}

function normalizeOpportunity(row) {
  return {
    ...row,
    image_url: row.image_url || '',
    images: Array.isArray(row.images) ? row.images : parseImageList(row.images),
    feeRange: row.fee_range || '',
    document_url: row.document_url || '',
    document_name: row.document_name || '',
    document_type: row.document_type || '',
  };
}

function getCardImage(item) {
  return item.image_url || item.images?.[0] || '';
}

export default function Add({ onNavigate, globalData, setGlobalData }) {
  const [activeCategory, setActiveCategory] = useState(null);
  const [showAll, setShowAll] = useState({ Universities: false, Colleges: false, Courses: false });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  
  const initialFormState = {
    name: '', image_url: '', images: [], rating: '',
    university_id: '', college_id: '',
    location: '', feeRange: '', about: '', type: '', levels: '', degree: '', category: '',
    phone: '', email: '', address: '', duration: '', mode: 'Offline',
    document_url: '', document_name: '', document_type: '',
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    if (!activeCategory) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [activeCategory]);

  // Close modal and reset state
  const closeModal = () => {
    setActiveCategory(null);
    setIsEditing(false);
    setEditId(null);
    setFormData(initialFormState);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const tableName = getTableName(activeCategory);
    const payload = buildTablePayload(formData, activeCategory);
    const fallbackPayload = buildTablePayload(formData, activeCategory, { includeMedia: false });

    const saveWithRetry = async (mode) => {
      if (isEditing) {
        return supabase
          .from(tableName)
          .update(mode)
          .eq('id', editId)
          .select();
      }

      return supabase
        .from(tableName)
        .insert([mode])
        .select();
    };

    const isMissingColumnError = (error) => {
      const message = `${error?.message || ''} ${error?.details || ''} ${error?.hint || ''}`.toLowerCase();
      return (
        message.includes('column') &&
        (message.includes('does not exist') ||
          message.includes('could not find the') ||
          message.includes('schema cache'))
      );
    };

    let result = await saveWithRetry(payload);

    if (result.error && isMissingColumnError(result.error)) {
      console.warn('Media columns are missing in the database, retrying without image fields.');
      result = await saveWithRetry(fallbackPayload);
    }

    if (result.error) {
      alert(result.error.message);
      return;
    }

    const savedRow = Array.isArray(result.data) ? result.data[0] : result.data;
    const savedItem = normalizeOpportunity(savedRow || {
      ...payload,
      id: editId || crypto.randomUUID(),
    });
    const visibleItem = {
      ...savedItem,
      image_url: savedItem.image_url || formData.image_url || '',
      images: savedItem.images?.length ? savedItem.images : parseImageList(formData.images),
    };

    if (isEditing) {
      setGlobalData((prev) => ({
        ...prev,
        [activeCategory]: prev[activeCategory].map((item) =>
          item.id === editId ? visibleItem : item
        ),
      }));
    } else {
      setGlobalData((prev) => ({
        ...prev,
        [activeCategory]: [...(prev[activeCategory] || []), visibleItem],
      }));
    }

    closeModal();
  };

  const handleEdit = (category, item) => {
    setFormData({
      ...initialFormState,
      ...item,
      image_url: item.image_url || '',
      images: Array.isArray(item.images) ? item.images : parseImageList(item.images),
    });
    setActiveCategory(category);
    setIsEditing(true);
    setEditId(item.id);
  };

  const handleCoverFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const dataUrl = await fileToDataUrl(file);
      setFormData((prev) => ({ ...prev, image_url: dataUrl }));
    } catch (error) {
      console.error('Failed to read image file:', error);
      alert('Could not read that image file.');
    } finally {
      event.target.value = '';
    }
  };

  const handleDocumentFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain',
    ];

    if (!allowedTypes.includes(file.type)) {
      alert('Please upload a PDF or document file.');
      event.target.value = '';
      return;
    }

    try {
      const path = getDocumentPath(file, activeCategory || 'general');
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(path, file, {
          cacheControl: '3600',
          upsert: true,
          contentType: file.type,
        });

      if (uploadError) {
        alert(uploadError.message);
        return;
      }

      const { data } = supabase.storage.from('documents').getPublicUrl(path);
      setFormData((prev) => ({
        ...prev,
        document_url: data.publicUrl,
        document_name: file.name,
        document_type: file.type,
      }));
    } catch (error) {
      console.error('Failed to upload document:', error);
      alert('Could not upload that document.');
    } finally {
      event.target.value = '';
    }
  };

  const handleGalleryFileChange = async (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    try {
      const urls = await Promise.all(files.map(fileToDataUrl));
      setFormData((prev) => ({
        ...prev,
        images: [...(Array.isArray(prev.images) ? prev.images : []), ...urls],
      }));
    } catch (error) {
      console.error('Failed to read gallery images:', error);
      alert('Could not read one or more gallery images.');
    } finally {
      event.target.value = '';
    }
  };

  const removeItem = async (category, id) => {
    if (!window.confirm("Permanent Delete? This cannot be undone.")) return;
    const tableName = getTableName(category);

    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq('id', id);

    if (error) {
      alert(error.message);
      return;
    }

    setGlobalData((prev) => ({
      ...prev,
      [category]: prev[category].filter((item) => item.id !== id),
    }));

    if (isEditing) closeModal();
  };

  const renderSection = (title, Icon) => {
    const items = globalData[title] || [];
    const displayItems = showAll[title] ? items : items.slice(0, 6);

    return (
      <section className="mb-12 sm:mb-14 md:mb-16">
        <div className="mb-7 flex flex-col items-start gap-4 border-b border-white/5 pb-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between sm:pb-5">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-fuchsia-500/20 bg-fuchsia-500/10 text-fuchsia-400 sm:h-14 sm:w-14">
              <Icon size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white sm:text-3xl">{title}</h2>
              <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em]">{items.length} Entries</p>
            </div>
          </div>
          <button 
            onClick={() => { setIsEditing(false); setActiveCategory(title); }}
            className="w-full rounded-xl bg-white px-5 py-3 text-[11px] font-black uppercase tracking-widest text-black transition-all hover:bg-fuchsia-500 hover:text-white sm:w-auto sm:px-8"
          >
            + ADD {title.slice(0, -1)}
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 xl:gap-4">
          {displayItems.map((item) => (
            <motion.div 
              layout 
              key={item.id} 
              className="group relative flex min-h-[340px] flex-col overflow-hidden rounded-[1.8rem] border border-white/10 bg-[#1a0b2e] transition-all duration-500 hover:-translate-y-1 hover:border-fuchsia-500/30 sm:min-h-[360px] sm:rounded-[2.2rem]"
            >
              <div className="relative h-36 w-full overflow-hidden sm:h-40">
                {getCardImage(item) ? (
                  <>
                    <img
                      src={getCardImage(item)}
                      alt={item.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#12081d] via-[#12081d]/20 to-transparent" />
                  </>
                ) : (
                  <div className="h-full w-full bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.22),transparent_50%),linear-gradient(180deg,#2a1140_0%,#1a0b2e_100%)]" />
                )}

                <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
                  {item.rating && (
                    <span className="flex shrink-0 items-center gap-1 rounded-xl border border-amber-400/20 bg-black/45 px-2.5 py-1 text-[10px] font-black text-amber-400 backdrop-blur-md">
                      <Star size={10} fill="currentColor" /> {item.rating}
                    </span>
                  )}
                  {item.images?.length > 0 && (
                    <span className="rounded-xl border border-white/10 bg-black/45 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.18em] text-white/70 backdrop-blur-md">
                      +{item.images.length} Photos
                    </span>
                  )}
                </div>
              </div>

              <div className="relative z-10 flex flex-1 flex-col p-4 sm:p-5">
                <div className="mb-3 space-y-1.5">
                  <h3 className="text-lg font-black leading-tight text-white drop-shadow-md sm:text-xl">{item.name}</h3>
                  <div className="flex items-center gap-2 text-[10px] text-white/45">
                    <MapPin size={11} />
                    <span className="truncate">{item.location || 'Location not set'}</span>
                  </div>
                </div>

                <div className="mb-3 flex flex-wrap gap-2">
                  <span className="rounded-lg border border-white/10 bg-black/35 px-2 py-1 text-[9px] font-bold uppercase text-white/70 backdrop-blur-md">
                    {item.type || item.level || 'General'}
                  </span>
                  {item.affiliation && (
                    <span className="rounded-lg border border-fuchsia-400/20 bg-fuchsia-400/10 px-2 py-1 text-[9px] font-bold uppercase text-fuchsia-300 backdrop-blur-md">
                      {item.affiliation}
                    </span>
                  )}
                </div>

                {item.about && (
                  <p className="mb-3 line-clamp-2 text-[13px] leading-relaxed text-white/55">
                    {item.about}
                  </p>
                )}

                <div className="mt-auto space-y-2 border-t border-white/10 pt-3">
                  <div className="grid grid-cols-1 gap-1.5 text-[10px] text-white/65">
                    {item.feeRange && (
                      <div className="flex items-center justify-between gap-4">
                        <span className="uppercase tracking-[0.2em] text-white/25">Fees</span>
                        <span className="font-semibold text-white">{item.feeRange}</span>
                      </div>
                    )}
                    {item.duration && (
                      <div className="flex items-center justify-between gap-4">
                        <span className="uppercase tracking-[0.2em] text-white/25">Duration</span>
                        <span className="font-semibold text-white">{item.duration}</span>
                      </div>
                    )}
                    {item.mode && (
                      <div className="flex items-center justify-between gap-4">
                        <span className="uppercase tracking-[0.2em] text-white/25">Mode</span>
                        <span className="font-semibold text-white">{item.mode}</span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-1">
                    <button
                      onClick={() => {
                        if (title === 'Universities') {
                          onNavigate(`/details#type=university&id=${item.id}`)
                        } else if (title === 'Colleges') {
                          onNavigate(`/details#type=college&id=${item.id}`)
                        } else if (title === 'Courses') {
                          onNavigate(`/details#type=course&id=${item.id}`)
                        }
                      }}
                      className="flex items-center justify-center gap-1 rounded-xl border border-fuchsia-400/20 bg-fuchsia-400/10 px-3 py-2 text-[9px] font-black uppercase tracking-widest text-fuchsia-200 transition-all hover:bg-fuchsia-500 hover:text-white backdrop-blur-md"
                    >
                      <ArrowRight size={12} /> View
                    </button>
                    <button
                      onClick={() => handleEdit(title, item)}
                      className="flex items-center justify-center gap-1 rounded-xl bg-white/10 px-3 py-2 text-[9px] font-black uppercase tracking-widest text-white transition-all hover:bg-fuchsia-500 backdrop-blur-md"
                    >
                      <Pencil size={12} /> Edit
                    </button>
                    <button
                      onClick={() => removeItem(title, item.id)}
                      className="flex items-center justify-center gap-1 rounded-xl bg-white/10 px-3 py-2 text-[9px] font-black uppercase tracking-widest text-white/40 transition-all hover:bg-red-500 hover:text-white backdrop-blur-md"
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {items.length > 6 && (
          <button onClick={() => setShowAll({...showAll, [title]: !showAll[title]})} className="mt-12 mx-auto block text-[10px] font-black uppercase tracking-[0.5em] text-white/20 hover:text-fuchsia-400 transition-colors">
            {showAll[title] ? "Hide Extras" : "See More Options"}
          </button>
        )}
      </section>
    );
  };

  return (
    <div className="relative min-h-screen bg-[#06010a] p-4 text-white sm:p-6 md:p-16">
      <div className="max-w-7xl mx-auto relative z-10">
        <header className="mb-16 flex flex-col items-start gap-6 sm:mb-20 sm:flex-row sm:justify-between sm:items-start md:mb-24">
          <div>
            <h1 className="text-[clamp(2.8rem,12vw,6rem)] font-black italic tracking-tighter text-white">CORE<span className="text-fuchsia-500">.</span></h1>
            <p className="text-white/20 text-xs font-bold uppercase tracking-[0.5em] mt-2">Database Management</p>
          </div>
          <button onClick={() => onNavigate('/')} className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-white/40 transition-all hover:text-white sm:pt-4">
            <ArrowLeft size={16} /> Exit Admin
          </button>
        </header>

        {renderSection("Universities", GraduationCap)}
        {renderSection("Colleges", School)}
        {renderSection("Courses", BookOpen)}
      </div>

      <AnimatePresence>
        {activeCategory && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto p-2 md:p-4"
            style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-y' }}
          >
            <motion.div initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} onClick={closeModal} className="absolute inset-0 bg-black/90 backdrop-blur-xl" />
            
            <motion.div initial={{y: 50, opacity: 0}} animate={{y: 0, opacity: 1}} className="relative z-10 flex w-[98vw] max-w-[96rem] flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-[#12081d] shadow-2xl sm:rounded-[3rem]" style={{ maxHeight: 'calc(100dvh - 1.5rem)' }}>
              
              <div className="shrink-0 flex items-center justify-between border-b border-white/5 bg-white/[0.02] p-4 sm:p-5 lg:p-6">
                <div>
                    <h2 className="text-2xl font-black italic tracking-tighter uppercase sm:text-[2rem]">
                        {isEditing ? `Edit ${activeCategory.slice(0,-1)}` : `New ${activeCategory.slice(0,-1)}`}
                    </h2>
                    {isEditing && <p className="text-[10px] font-bold text-fuchsia-400 uppercase tracking-widest mt-1">Modifying existing record ID: {editId}</p>}
                </div>
                <button onClick={closeModal} className="p-2 hover:bg-white/10 rounded-full transition-all"><X /></button>
              </div>

              <form
                id="add-opportunity-form"
                onSubmit={handleSubmit}
                className="custom-scrollbar min-h-0 overflow-y-auto overscroll-contain p-3 sm:p-4 lg:p-5"
                style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-y', maxHeight: 'calc(100dvh - 14rem)' }}
              >
                {activeCategory === 'Universities' && (
                  <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr] xl:gap-6">
                    <div className="space-y-5">
                      <div className="rounded-3xl border border-white/5 bg-white/[0.02] p-4 sm:p-5">
                        <h4 className="mb-3 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-fuchsia-500">
                          <Info size={14}/> University Info
                        </h4>
                        <input
                          placeholder="University Name"
                          className="w-full rounded-xl border border-white/10 bg-white/5 p-3 outline-none focus:border-fuchsia-500"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          required
                        />
                        <textarea
                          rows="6"
                          placeholder="Short description about the university..."
                          className="mt-4 w-full resize-none rounded-2xl border border-white/10 bg-white/5 p-3 outline-none focus:border-fuchsia-500"
                          value={formData.about}
                          onChange={(e) => setFormData({...formData, about: e.target.value})}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-5">
                      <div className="rounded-3xl border border-white/5 bg-white/[0.02] p-4 sm:p-5">
                        <h4 className="mb-3 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-fuchsia-500">
                          <Layers size={14}/> Logo
                        </h4>
                        <div className="group relative h-36 w-full overflow-hidden rounded-2xl border-2 border-dashed border-white/10 bg-white/5 transition-colors hover:border-fuchsia-500/50">
                          {formData.image_url ? (
                            <>
                              <img src={formData.image_url} alt="" className="h-full w-full object-contain p-4" />
                              <button
                                type="button"
                                onClick={() => setFormData({...formData, image_url: ''})}
                                className="absolute right-2 top-2 z-20 rounded-lg bg-red-500 p-1"
                              >
                                <X size={14} />
                              </button>
                            </>
                          ) : (
                            <div className="flex h-full flex-col items-center justify-center gap-2 opacity-30">
                              <Plus size={24} />
                              <span className="text-[9px] font-bold">Upload logo</span>
                            </div>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleCoverFileChange}
                            className="absolute inset-0 z-10 cursor-pointer opacity-0"
                            aria-label="Upload university logo"
                          />
                        </div>
                        <input
                          value={formData.image_url}
                          onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                          placeholder="Paste logo image URL if needed"
                          className="mt-3 w-full rounded-xl border border-white/10 bg-white/5 p-3 text-[11px] outline-none focus:border-fuchsia-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeCategory === 'Colleges' && (
                  <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_1fr] xl:gap-5">
                    <div className="space-y-3.5 sm:space-y-4">
                      <div className="space-y-2.5 rounded-3xl border border-white/5 bg-white/[0.02] p-3.5 sm:p-4">
                        <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-fuchsia-500"><Info size={14}/> Basic Information</h4>
                        <input placeholder="College Name" className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-[11px] outline-none focus:border-fuchsia-500 sm:text-sm" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required/>
                        <div className="grid grid-cols-2 gap-3.5">
                          <input placeholder="Rating" className="rounded-xl border border-white/10 bg-white/5 p-2.5 text-[11px] outline-none focus:border-fuchsia-500 sm:text-sm" value={formData.rating} onChange={e => setFormData({...formData, rating: e.target.value})} />
                          <input placeholder="Location" className="rounded-xl border border-white/10 bg-white/5 p-2.5 text-[11px] outline-none focus:border-fuchsia-500 sm:text-sm" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} required/>
                        </div>
                        <select className="w-full rounded-xl border border-white/10 bg-[#1e0f2d] p-2.5 text-[11px] outline-none focus:border-fuchsia-500 sm:text-sm" value={formData.university_id} onChange={e => setFormData({...formData, university_id: e.target.value})}>
                          <option value="">Select University</option>
                          {globalData.Universities?.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                        </select>
                      </div>

                      <div className="space-y-2.5 rounded-3xl border border-white/5 bg-white/[0.02] p-3.5 sm:p-4">
                        <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-fuchsia-500"><Banknote size={14}/> Fee / Upload</h4>
                        <input placeholder="Annual Fee Range" className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-[11px] outline-none focus:border-fuchsia-500 sm:text-sm" value={formData.feeRange} onChange={e => setFormData({...formData, feeRange: e.target.value})} />
                        <div className="space-y-2 rounded-2xl border border-dashed border-white/10 bg-white/5 p-3.5">
                          <h5 className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-fuchsia-400">
                            <BookOpen size={12}/> Document Upload
                          </h5>
                          <p className="text-[10px] leading-snug text-white/45">
                            Upload a PDF or document file for download from Services.
                          </p>
                          <div className="rounded-xl border border-dashed border-white/10 bg-black/15 p-3">
                            {formData.document_name ? (
                              <div className="flex items-center justify-between gap-3">
                                <div className="min-w-0">
                                  <div className="truncate text-xs font-black text-white">{formData.document_name}</div>
                                  <div className="text-[9px] text-white/40">Stored in Supabase Storage</div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setFormData((prev) => ({ ...prev, document_url: '', document_name: '', document_type: '' }))}
                                  className="rounded-full bg-red-500 px-2.5 py-1 text-[9px] font-black uppercase text-white"
                                >
                                  Remove
                                </button>
                              </div>
                            ) : (
                              <label className="flex cursor-pointer items-center justify-center rounded-lg border border-white/10 bg-black/20 px-3 py-4 text-center">
                                <div>
                                  <div className="text-xs font-black text-white">Click to upload document</div>
                                  <div className="mt-1 text-[9px] text-white/40">PDF, DOC, DOCX, XLS, TXT</div>
                                </div>
                                <input
                                  type="file"
                                  accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                  onChange={handleDocumentFileChange}
                                  className="hidden"
                                  aria-label="Upload document"
                                />
                              </label>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2.5 rounded-3xl border border-white/5 bg-white/[0.02] p-3.5 sm:p-4">
                        <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-fuchsia-500"><Phone size={14}/> Contact Details</h4>
                        <input placeholder="Phone" className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-[11px] outline-none focus:border-fuchsia-500 sm:text-sm" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                        <input placeholder="Email" className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-[11px] outline-none focus:border-fuchsia-500 sm:text-sm" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                        <input placeholder="Address" className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-[11px] outline-none focus:border-fuchsia-500 sm:text-sm" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                      </div>
                    </div>

                    <div className="space-y-4 sm:space-y-5">
                      <div className="space-y-2.5 rounded-3xl border border-white/5 bg-white/[0.02] p-3.5 sm:p-4">
                        <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-fuchsia-500"><ShieldCheck size={14}/> Quick Facts</h4>
                        <div className="grid grid-cols-2 gap-3.5">
                          <input placeholder="Institution Type" className="rounded-xl border border-white/10 bg-white/5 p-2.5 text-[11px] outline-none focus:border-fuchsia-500 sm:text-sm" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} />
                          <input placeholder="Course Levels" className="rounded-xl border border-white/10 bg-white/5 p-2.5 text-[11px] outline-none focus:border-fuchsia-500 sm:text-sm" value={formData.levels} onChange={e => setFormData({...formData, levels: e.target.value})} />
                        </div>
                      </div>

                      <div className="space-y-2.5 rounded-3xl border border-white/5 bg-white/[0.02] p-3.5 sm:p-4">
                        <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-fuchsia-500"><Layers size={14}/> About Section</h4>
                        <textarea rows="3" placeholder="About the college..." className="w-full resize-none rounded-2xl border border-white/10 bg-white/5 p-2.5 text-[11px] outline-none focus:border-fuchsia-500 sm:text-sm" value={formData.about} onChange={e => setFormData({...formData, about: e.target.value})} />
                      </div>
                    </div>
                  </div>
                )}

                {activeCategory === 'Courses' && (
                  <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_1fr] xl:gap-6">
                    <div className="space-y-4 sm:space-y-5">
                      <div className="space-y-3 rounded-3xl border border-white/5 bg-white/[0.02] p-4 sm:p-5">
                        <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-fuchsia-500"><Info size={14}/> Basic Information</h4>
                        <input placeholder="Course Name" className="w-full rounded-xl border border-white/10 bg-white/5 p-3 outline-none focus:border-fuchsia-500" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required/>
                        <div className="grid grid-cols-2 gap-4">
                          <input placeholder="Degree" className="rounded-xl border border-white/10 bg-white/5 p-3 outline-none focus:border-fuchsia-500" value={formData.degree} onChange={e => setFormData({...formData, degree: e.target.value})} />
                          <input placeholder="Category" className="rounded-xl border border-white/10 bg-white/5 p-3 outline-none focus:border-fuchsia-500" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <input placeholder="Level" className="rounded-xl border border-white/10 bg-white/5 p-3 outline-none focus:border-fuchsia-500" value={formData.levels} onChange={e => setFormData({...formData, levels: e.target.value})} />
                          <input placeholder="Duration" className="rounded-xl border border-white/10 bg-white/5 p-3 outline-none focus:border-fuchsia-500" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} />
                        </div>
                        <select className="w-full rounded-xl border border-white/10 bg-[#1e0f2d] p-3 outline-none focus:border-fuchsia-500" value={formData.college_id} onChange={e => setFormData({...formData, college_id: e.target.value})}>
                          <option value="">Select College</option>
                          {globalData.Colleges?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                      </div>

                      <div className="space-y-3 rounded-3xl border border-white/5 bg-white/[0.02] p-4 sm:p-5">
                        <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-fuchsia-500">
                          <BookOpen size={14}/> Document Upload
                        </h4>
                        <p className="text-[11px] text-white/45">
                          Upload a PDF or document file that users can download from Services.
                        </p>
                        <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-4">
                          {formData.document_name ? (
                            <div className="flex items-center justify-between gap-4">
                              <div className="min-w-0">
                                <div className="truncate text-sm font-black text-white">{formData.document_name}</div>
                                <div className="text-[10px] text-white/45">Stored in Supabase Storage</div>
                              </div>
                              <button
                                type="button"
                                onClick={() => setFormData((prev) => ({ ...prev, document_url: '', document_name: '', document_type: '' }))}
                                className="rounded-full bg-red-500 px-3 py-1 text-[10px] font-black uppercase text-white"
                              >
                                Remove
                              </button>
                            </div>
                          ) : (
                            <label className="flex cursor-pointer items-center justify-center rounded-xl border border-white/10 bg-black/20 px-4 py-5 text-center">
                              <div>
                                <div className="text-sm font-black text-white">Click to upload document</div>
                                <div className="mt-1 text-[10px] text-white/40">PDF, DOC, DOCX, XLS, TXT</div>
                              </div>
                              <input
                                type="file"
                                accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                onChange={handleDocumentFileChange}
                                className="hidden"
                                aria-label="Upload document"
                              />
                            </label>
                          )}
                        </div>
                      </div>

                      <div className="space-y-3 rounded-3xl border border-white/5 bg-white/[0.02] p-4 sm:p-5">
                        <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-fuchsia-500"><Banknote size={14}/> Financial Information</h4>
                        <input placeholder="Course Fees" className="w-full rounded-xl border border-white/10 bg-white/5 p-3 outline-none focus:border-fuchsia-500" value={formData.feeRange} onChange={e => setFormData({...formData, feeRange: e.target.value})} />
                      </div>
                    </div>

                    <div className="space-y-5 sm:space-y-6">
                      <div className="space-y-3 rounded-3xl border border-white/5 bg-white/[0.02] p-4 sm:p-5">
                        <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-fuchsia-500"><ShieldCheck size={14}/> Provider Information</h4>
                        <input placeholder="Provider Type" className="w-full rounded-xl border border-white/10 bg-white/5 p-3 outline-none focus:border-fuchsia-500" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} />
                        <input placeholder="Affiliation" className="w-full rounded-xl border border-white/10 bg-white/5 p-3 outline-none focus:border-fuchsia-500" value={formData.affiliation} onChange={e => setFormData({...formData, affiliation: e.target.value})} />
                        <input placeholder="Phone" className="w-full rounded-xl border border-white/10 bg-white/5 p-3 outline-none focus:border-fuchsia-500" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                        <input placeholder="Email" className="w-full rounded-xl border border-white/10 bg-white/5 p-3 outline-none focus:border-fuchsia-500" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                      </div>

                      <div className="space-y-3 rounded-3xl border border-white/5 bg-white/[0.02] p-4 sm:p-5">
                        <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-fuchsia-500"><Layers size={14}/> About Section</h4>
                        <textarea rows="4" placeholder="About the course..." className="w-full resize-none rounded-2xl border border-white/10 bg-white/5 p-3 outline-none focus:border-fuchsia-500" value={formData.about} onChange={e => setFormData({...formData, about: e.target.value})} />
                      </div>
                    </div>
                  </div>
                )}

                {activeCategory !== 'Universities' && activeCategory !== 'Colleges' && activeCategory !== 'Courses' && (
                  <div className="rounded-3xl border border-white/5 bg-white/[0.02] p-4 text-sm text-white/50">
                    Unknown category selected.
                  </div>
                )}

                {activeCategory === 'Colleges' && (
                  <div className="mt-5 space-y-3 rounded-3xl border border-white/5 bg-white/[0.02] p-4 sm:p-5">
                    <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-fuchsia-500">
                      <Layers size={14}/> Media Assets
                    </h4>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div className="space-y-3">
                        <label className="text-[10px] font-bold uppercase text-white/40">Main Cover Image URL</label>
                        <div className="group relative h-32 w-full overflow-hidden rounded-2xl border-2 border-dashed border-white/10 bg-white/5 transition-colors hover:border-fuchsia-500/50 sm:h-36">
                          {formData.image_url ? (
                            <>
                              <img src={formData.image_url} alt="" className="h-full w-full object-cover" />
                              <button
                                type="button"
                                onClick={() => setFormData({...formData, image_url: ''})}
                                className="absolute right-2 top-2 z-20 rounded-lg bg-red-500 p-1"
                              >
                                <X size={14} />
                              </button>
                            </>
                          ) : (
                            <div className="flex h-full flex-col items-center justify-center gap-2 opacity-30">
                              <Plus size={24} />
                              <span className="text-[9px] font-bold">Click to upload</span>
                            </div>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleCoverFileChange}
                            className="absolute inset-0 z-10 cursor-pointer opacity-0"
                            aria-label="Upload main cover image"
                          />
                        </div>
                        <input
                          value={formData.image_url}
                          onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                          placeholder="https://image-link.com/photo.jpg or upload from device"
                          className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-[11px] outline-none focus:border-fuchsia-500"
                        />
                      </div>

                      <div className="space-y-3">
                        <label className="text-[10px] font-bold uppercase text-white/40">Additional Gallery Images</label>
                        <div className="grid grid-cols-3 gap-2">
                          {formData.images?.map((img, idx) => (
                            <div key={idx} className="relative h-20 overflow-hidden rounded-lg border border-white/10 bg-white/10">
                              <img src={img} alt="" className="h-full w-full object-cover" />
                              <button
                                type="button"
                                onClick={() => setFormData({...formData, images: formData.images.filter((_, i) => i !== idx)})}
                                className="absolute inset-0 flex items-center justify-center bg-red-500/80 opacity-0 transition-opacity hover:opacity-100"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          ))}
                          <label className="relative flex h-20 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-white/10 transition-colors hover:border-fuchsia-500">
                            <Plus size={16} className="text-fuchsia-500" />
                            <span className="text-[8px] font-bold opacity-40">ADD MORE</span>
                            <span className="text-[7px] font-bold uppercase tracking-[0.2em] text-white/20">From File</span>
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={handleGalleryFileChange}
                              className="absolute inset-0 cursor-pointer opacity-0"
                              aria-label="Upload gallery images"
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              </form>

              <div className="shrink-0 border-t border-white/10 bg-[#12081d]/98 p-3 backdrop-blur-xl sm:p-4 lg:p-5">
                <div className="flex flex-col items-center justify-between gap-4 rounded-[2rem] border border-white/10 bg-[#12081d]/95 p-4 md:flex-row md:gap-6 md:p-5">
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
                
                <div className="flex w-full gap-4 md:w-auto">
                  <button onClick={closeModal} type="button" className="hidden md:block px-8 text-white/30 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors">Discard</button>
                  <button type="submit" form="add-opportunity-form" className="w-full md:w-auto bg-fuchsia-500 px-12 py-4 rounded-2xl text-white font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all flex items-center justify-center gap-3 shadow-xl shadow-fuchsia-500/20">
                      {isEditing ? "SAVE CHANGES" : "PUBLISH DATA"} <Send size={18}/>
                  </button>
                </div>
                </div>
              </div>
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
