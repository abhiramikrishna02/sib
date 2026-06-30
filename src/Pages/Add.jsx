import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getSupabaseErrorMessage, isSupabaseConfigured, supabase, supabaseConfigMessage } from '../lib/supabase.js';
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

function getStoragePath(file, category, folder) {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]+/g, '_');
  return `${category.toLowerCase()}/${folder}/${Date.now()}-${safeName}`;
}

function isDataUrl(value) {
  return String(value || '').startsWith('data:');
}

function getStorableUrl(value) {
  return value && !isDataUrl(value) ? value : '';
}

function isBucketMissingError(error) {
  const text = `${error?.message || ''} ${error?.details || ''} ${error?.hint || ''}`.toLowerCase();
  return text.includes('bucket not found') || text.includes('bucket') && text.includes('not found');
}

function createSlug(value) {
  const slug = String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return slug || `item-${Date.now()}`;
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
    fee_range: formData.feeRange || buildFeeRange(formData) || null,
    fee_from: formData.feeFrom || null,
    fee_to: formData.feeTo || null,
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

function buildFeeRange(formData) {
  if (formData.feeRange) return formData.feeRange;
  if (formData.feeFrom && formData.feeTo) return `${formData.feeFrom} - ${formData.feeTo}`;
  return formData.feeFrom || formData.feeTo || '';
}

function splitFeeRange(value) {
  const text = String(value || '').trim();
  if (!text) return ['', ''];
  const parts = text.split(/\s*(?:-|–|—|to)\s*/i).map((part) => part.trim()).filter(Boolean);
  return parts.length >= 2 ? [parts[0], parts.slice(1).join(' - ')] : [text, ''];
}

function getTableName(category) {
  if (category === 'Universities') return 'universities';
  if (category === 'Colleges') return 'colleges';
  if (category === 'Courses') return 'courses';
  return 'opportunities';
}

function buildTablePayload(formData, category, { includeMedia = true } = {}) {
  const name = formData.name.trim();
  const imageUrl = getStorableUrl(formData.image_url);
  const images = parseImageList(formData.images).filter((image) => !isDataUrl(image));
  const payload = {
    name,
    slug: createSlug(name),
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
    payload.logo_url = imageUrl || null;
    payload.image_url = imageUrl || null;
    if (includeMedia) payload.images = images;
  } else {
    payload.image_url = imageUrl || null;
    if (includeMedia) payload.images = images;
    payload.fee_range = buildFeeRange(formData) || null;
    payload.fee_from = formData.feeFrom || null;
    payload.fee_to = formData.feeTo || null;
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
    payload.affiliation = formData.affiliation || null;
    payload.category = formData.category || null;
    delete payload.address;
  }

  return payload;
}

function normalizeOpportunity(row) {
  const feeRange = row.fee_range || row.feeRange || '';
  const [rangeFrom, rangeTo] = splitFeeRange(feeRange);

  return {
    ...row,
    image_url: row.image_url || row.logo_url || '',
    images: Array.isArray(row.images) ? row.images : parseImageList(row.images),
    feeRange,
    feeFrom: row.fee_from || row.feeFrom || rangeFrom,
    feeTo: row.fee_to || row.feeTo || rangeTo,
    document_url: row.document_url || '',
    document_name: row.document_name || '',
    document_type: row.document_type || '',
  };
}

function getCardImage(item) {
  return item.image_url || item.images?.[0] || '';
}

function getFeeRange(item) {
  return item.feeRange || item.fee_range || [item.feeFrom || item.fee_from, item.feeTo || item.fee_to].filter(Boolean).join(' - ');
}

export default function Add({ onNavigate, globalData, setGlobalData, refreshGlobalData, dataLoading, dataError }) {
  const [activeCategory, setActiveCategory] = useState(null);
  const [dashboardPage, setDashboardPage] = useState({ Universities: 1, Colleges: 1, Courses: 1 });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dashboardItemsPerPage = 6;
  
  const initialFormState = {
    name: '', image_url: '', images: [], rating: '',
    university_id: '', college_id: '',
    location: '', feeRange: '', feeFrom: '', feeTo: '', about: '', type: '', levels: '', degree: '', category: '',
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
    if (isSubmitting) return;

    if (!isSupabaseConfigured) {
      alert(supabaseConfigMessage);
      return;
    }

    if (!formData.name.trim()) {
      alert(`Please enter a ${activeCategory?.slice(0, -1).toLowerCase() || 'record'} name.`);
      return;
    }

    setIsSubmitting(true);

    try {
      const tableName = getTableName(activeCategory);
      const payload = buildTablePayload(formData, activeCategory);
      if (!isEditing) payload.id = crypto.randomUUID();

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

    const getErrorText = (error) => {
      return `${error?.message || ''} ${error?.details || ''} ${error?.hint || ''}`.toLowerCase();
    };

    const isMissingColumnError = (error) => {
      const message = getErrorText(error);
      return (
        message.includes('column') &&
        (message.includes('does not exist') ||
          message.includes('could not find the') ||
          message.includes('schema cache'))
      );
    };

    const getMissingColumnName = (error) => {
      const text = `${error?.message || ''} ${error?.details || ''} ${error?.hint || ''}`;
      return (
        text.match(/'([^']+)'\s+column/i)?.[1] ||
        text.match(/column\s+"([^"]+)"/i)?.[1] ||
        text.match(/column\s+([a-zA-Z0-9_]+)/i)?.[1] ||
        ''
      );
    };

    const isNotNullError = (error) => {
      return getErrorText(error).includes('violates not-null constraint');
    };

    const isDuplicateError = (error) => {
      const message = getErrorText(error);
      return message.includes('duplicate key') || error?.code === '23505';
    };

    const getNotNullColumnName = (error) => {
      const text = `${error?.message || ''} ${error?.details || ''} ${error?.hint || ''}`;
      return text.match(/null value in column\s+"([^"]+)"/i)?.[1] || '';
    };

    const addRequiredFallback = (error, sourcePayload) => {
      const column = getNotNullColumnName(error);
      if (!column) return sourcePayload;

      const fallbackByColumn = {
        slug: createSlug(formData.name),
        name: formData.name.trim() || `Untitled ${activeCategory?.slice(0, -1) || 'Item'}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: 'active',
        category: formData.category || activeCategory?.slice(0, -1) || 'General',
        type: formData.type || 'General',
        level: formData.levels || 'General',
        levels: formData.levels || 'General',
        mode: formData.mode || 'Offline',
        images: [],
      };

      if (!Object.prototype.hasOwnProperty.call(fallbackByColumn, column)) {
        return sourcePayload;
      }

      const nextPayload = { ...sourcePayload };
      nextPayload[column] = fallbackByColumn[column];
      return nextPayload;
    };

    const removeUnsupportedColumns = (error, sourcePayload) => {
      const nextPayload = { ...sourcePayload };
      const missingColumn = getMissingColumnName(error);

      if (missingColumn && Object.prototype.hasOwnProperty.call(nextPayload, missingColumn)) {
        delete nextPayload[missingColumn];
        return nextPayload;
      }

      const message = getErrorText(error);
      const optionalColumns = [
        'about',
        'images',
        'image_url',
        'logo_url',
        'rating',
        'location',
        'document_url',
        'document_name',
        'document_type',
        'affiliation',
        'category',
        'degree',
        'level',
        'levels',
        'duration',
        'mode',
        'fee_range',
        'fee_from',
        'fee_to',
        'type',
        'phone',
        'email',
        'address',
        'university_id',
        'college_id',
      ];

      optionalColumns.forEach((column) => {
        if (message.includes(column)) delete nextPayload[column];
      });

      if (Object.keys(nextPayload).length === Object.keys(sourcePayload).length) {
        const fallbackColumn = optionalColumns.find((column) =>
          Object.prototype.hasOwnProperty.call(nextPayload, column)
        );
        if (fallbackColumn) delete nextPayload[fallbackColumn];
      }

      return nextPayload;
    };

    let activePayload = payload;
    let result = await saveWithRetry(activePayload);
    let retries = 0;

    while (result.error && isMissingColumnError(result.error) && retries < Object.keys(payload).length) {
      console.warn('Some optional columns are missing in the database, retrying without unsupported fields.');
      const previousPayload = activePayload;
      activePayload = removeUnsupportedColumns(result.error, activePayload);
      if (Object.keys(activePayload).length === Object.keys(previousPayload).length) break;
      result = await saveWithRetry(activePayload);
      retries += 1;
    }

    while (result.error && isNotNullError(result.error) && retries < Object.keys(payload).length + 8) {
      console.warn('A required database column was missing from the form payload, retrying with a fallback value.');
      const previousPayload = activePayload;
      activePayload = addRequiredFallback(result.error, activePayload);
      if (activePayload === previousPayload) break;
      result = await saveWithRetry(activePayload);
      retries += 1;
    }

    if (result.error && isDuplicateError(result.error) && activePayload.slug) {
      activePayload = {
        ...activePayload,
        slug: `${activePayload.slug}-${Date.now()}`,
      };
      result = await saveWithRetry(activePayload);
    }

    if (result.error) {
      alert(getSupabaseErrorMessage(result.error));
      return;
    }

    const savedRow = Array.isArray(result.data) ? result.data[0] : result.data;
    const savedItem = normalizeOpportunity(savedRow || {
      ...activePayload,
      id: editId || crypto.randomUUID(),
    });
    const visibleItem = {
      ...savedItem,
      image_url: savedItem.image_url || formData.image_url || '',
      images: savedItem.images?.length ? savedItem.images : parseImageList(formData.images),
      feeRange: savedItem.feeRange || buildFeeRange(formData),
      feeFrom: savedItem.feeFrom || formData.feeFrom || buildFeeRange(formData),
      feeTo: savedItem.feeTo || formData.feeTo || buildFeeRange(formData),
      document_url: savedItem.document_url || formData.document_url || '',
      document_name: savedItem.document_name || formData.document_name || '',
      document_type: savedItem.document_type || formData.document_type || '',
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
        [activeCategory]: [visibleItem, ...(prev[activeCategory] || [])],
      }));
      setDashboardPage((prev) => ({ ...prev, [activeCategory]: 1 }));
    }

      refreshGlobalData?.();
      closeModal();
    } catch (error) {
      console.error('Failed to publish dashboard data:', error);
      alert(getSupabaseErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePublishClick = () => {
    const form = document.getElementById('add-opportunity-form');
    if (form?.requestSubmit) {
      form.requestSubmit();
      return;
    }
    form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
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

    if (!isSupabaseConfigured) {
      alert(supabaseConfigMessage);
      event.target.value = '';
      return;
    }

    try {
      const path = getStoragePath(file, activeCategory || 'general', 'cover');
      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(path, file, {
          cacheControl: '3600',
          upsert: true,
          contentType: file.type,
        });

      if (uploadError) {
        if (isBucketMissingError(uploadError)) {
          const dataUrl = await fileToDataUrl(file);
          setFormData((prev) => ({ ...prev, image_url: dataUrl }));
          return;
        }

        alert(getSupabaseErrorMessage(uploadError));
        return;
      }

      const { data } = supabase.storage.from('media').getPublicUrl(path);
      setFormData((prev) => ({ ...prev, image_url: data.publicUrl }));
    } catch (error) {
      console.error('Failed to read image file:', error);
      alert(getSupabaseErrorMessage(error));
    } finally {
      event.target.value = '';
    }
  };

  const handleDocumentFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!isSupabaseConfigured) {
      alert(supabaseConfigMessage);
      event.target.value = '';
      return;
    }

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
        if (!isBucketMissingError(uploadError)) {
          alert(getSupabaseErrorMessage(uploadError));
          return;
        }

        const dataUrl = await fileToDataUrl(file);
        setFormData((prev) => ({
          ...prev,
          document_url: dataUrl,
          document_name: file.name,
          document_type: file.type,
        }));
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

    if (!isSupabaseConfigured) {
      alert(supabaseConfigMessage);
      event.target.value = '';
      return;
    }

    try {
      const urls = await Promise.all(files.map(async (file) => {
        const path = getStoragePath(file, activeCategory || 'general', 'gallery');
        const { error: uploadError } = await supabase.storage
          .from('media')
          .upload(path, file, {
            cacheControl: '3600',
            upsert: true,
            contentType: file.type,
          });

        if (uploadError) {
          if (isBucketMissingError(uploadError)) return fileToDataUrl(file);
          throw uploadError;
        }

        const { data } = supabase.storage.from('media').getPublicUrl(path);
        return data.publicUrl;
      }));
      setFormData((prev) => ({
        ...prev,
        images: [...(Array.isArray(prev.images) ? prev.images : []), ...urls],
      }));
    } catch (error) {
      console.error('Failed to read gallery images:', error);
      alert(getSupabaseErrorMessage(error));
    } finally {
      event.target.value = '';
    }
  };

  const removeItem = async (category, id) => {
    if (!window.confirm("Permanent Delete? This cannot be undone.")) return;

    if (!isSupabaseConfigured) {
      alert(supabaseConfigMessage);
      return;
    }

    const tableName = getTableName(category);

    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq('id', id);

    if (error) {
      alert(getSupabaseErrorMessage(error));
      return;
    }

    setGlobalData((prev) => ({
      ...prev,
      [category]: prev[category].filter((item) => item.id !== id),
    }));

    refreshGlobalData?.();
    if (isEditing) closeModal();
  };

  const renderSection = (title, Icon) => {
    const items = globalData[title] || [];
    const totalPages = Math.max(1, Math.ceil(items.length / dashboardItemsPerPage));
    const currentPage = Math.min(dashboardPage[title] || 1, totalPages);
    const pageStart = (currentPage - 1) * dashboardItemsPerPage;
    const displayItems = items.slice(pageStart, pageStart + dashboardItemsPerPage);

    const goToDashboardPage = (page) => {
      setDashboardPage((prev) => ({
        ...prev,
        [title]: Math.min(Math.max(page, 1), totalPages),
      }));
    };

    return (
      <section className="mb-12 sm:mb-14 md:mb-16">
        <div className="mb-7 flex flex-col items-start gap-4 border-b border-white/5 pb-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between sm:pb-5">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-white sm:h-14 sm:w-14">
              <Icon size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white sm:text-3xl">{title}</h2>
              <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em]">{items.length} Entries</p>
            </div>
          </div>
          <button 
            onClick={() => {
              setIsEditing(false);
              setEditId(null);
              setFormData(initialFormState);
              setActiveCategory(title);
            }}
            className="w-full rounded-xl bg-white px-5 py-3 text-[11px] font-black uppercase tracking-widest text-black transition-all hover:bg-white hover:text-white sm:w-auto sm:px-8"
          >
            + ADD {title.slice(0, -1)}
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 xl:gap-4">
          {dataLoading && displayItems.length === 0 && (
            <div className="col-span-full rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center text-sm font-semibold text-white/45">
              Loading saved {title.toLowerCase()}...
            </div>
          )}
          {!dataLoading && displayItems.length === 0 && (
            <div className="col-span-full rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center text-sm font-semibold text-white/45">
              No {title.toLowerCase()} saved yet.
            </div>
          )}
          {displayItems.map((item) => (
            <motion.div 
              layout 
              key={item.id} 
              className="group relative flex min-h-[340px] flex-col overflow-hidden rounded-[1.8rem] border border-white/10 bg-[#111111] transition-all duration-500 hover:-translate-y-1 hover:border-white/30 sm:min-h-[360px] sm:rounded-[2.2rem]"
            >
              <div className="relative h-36 w-full overflow-hidden sm:h-40">
                {getCardImage(item) ? (
                  <>
                    <img
                      src={getCardImage(item)}
                      alt={item.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/20 to-transparent" />
                  </>
                ) : (
                  <div className="h-full w-full bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.22),transparent_50%),linear-gradient(180deg,#1f1f1f_0%,#111111_100%)]" />
                )}

                <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
                  {item.rating && (
                    <span className="flex shrink-0 items-center gap-1 rounded-xl border border-white/20 bg-black/45 px-2.5 py-1 text-[10px] font-black text-white backdrop-blur-md">
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
                  {title !== 'Universities' && (
                    <div className="flex items-center gap-2 text-[10px] text-white/45">
                      <MapPin size={11} />
                      <span className="truncate">{item.location || 'Location not set'}</span>
                    </div>
                  )}
                </div>

                <div className="mb-3 flex flex-wrap gap-2">
                  <span className="rounded-lg border border-white/10 bg-black/35 px-2 py-1 text-[9px] font-bold uppercase text-white/70 backdrop-blur-md">
                    {item.type || item.level || 'General'}
                  </span>
                  {item.affiliation && (
                    <span className="rounded-lg border border-white/20 bg-white/10 px-2 py-1 text-[9px] font-bold uppercase text-white backdrop-blur-md">
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
                    {getFeeRange(item) && (
                      <div className="flex items-center justify-between gap-4">
                        <span className="uppercase tracking-[0.2em] text-white/25">Fees</span>
                        <span className="font-semibold text-white">{getFeeRange(item)}</span>
                      </div>
                    )}
                    {item.document_url && (
                      <div className="flex items-center justify-between gap-4">
                        <span className="uppercase tracking-[0.2em] text-white/25">Document</span>
                        <a href={item.document_url} target="_blank" rel="noreferrer" className="font-semibold text-white hover:text-white">
                          Download
                        </a>
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
                      className="flex items-center justify-center gap-1 rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-[9px] font-black uppercase tracking-widest text-white transition-all hover:bg-white hover:text-white backdrop-blur-md"
                    >
                      <ArrowRight size={12} /> View
                    </button>
                    <button
                      onClick={() => handleEdit(title, item)}
                      className="flex items-center justify-center gap-1 rounded-xl bg-white/10 px-3 py-2 text-[9px] font-black uppercase tracking-widest text-white transition-all hover:bg-white backdrop-blur-md"
                    >
                      <Pencil size={12} /> Edit
                    </button>
                    <button
                      onClick={() => removeItem(title, item.id)}
                      className="flex items-center justify-center gap-1 rounded-xl bg-white/10 px-3 py-2 text-[9px] font-black uppercase tracking-widest text-white/40 transition-all hover:bg-white hover:text-white backdrop-blur-md"
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {items.length > dashboardItemsPerPage && (
          <div className="mt-8 flex flex-col items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 sm:flex-row">
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/35">
              Page {currentPage} of {totalPages} · Showing {pageStart + 1}-{Math.min(pageStart + dashboardItemsPerPage, items.length)} of {items.length}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => goToDashboardPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="rounded-xl border border-white/10 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white/60 transition-colors hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-30"
              >
                Prev
              </button>
              <button
                type="button"
                onClick={() => goToDashboardPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="rounded-xl border border-white/10 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white/60 transition-colors hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-30"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </section>
    );
  };

  return (
    <div className="relative min-h-screen bg-[#050505] p-4 text-white sm:p-6 md:p-16">
      <div className="max-w-7xl mx-auto relative z-10">
        <header className="mb-16 flex flex-col items-start gap-6 sm:mb-20 sm:flex-row sm:justify-between sm:items-start md:mb-24">
          <div>
            <h1 className="text-[clamp(2.8rem,12vw,6rem)] font-black italic tracking-tighter text-white">CORE<span className="text-white">.</span></h1>
            <p className="text-white/20 text-xs font-bold uppercase tracking-[0.5em] mt-2">Database Management</p>
          </div>
          <button onClick={() => onNavigate('/')} className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-white/40 transition-all hover:text-white sm:pt-4">
            <ArrowLeft size={16} /> Exit Admin
          </button>
        </header>

        {!isSupabaseConfigured && (
          <div className="mb-10 rounded-2xl border border-white/30 bg-white/10 p-4 text-sm text-white">
            {supabaseConfigMessage}
          </div>
        )}

        {dataError && (
          <div className="mb-10 rounded-2xl border border-red-400/30 bg-red-500/10 p-4 text-sm font-semibold text-red-100">
            {dataError}
          </div>
        )}

        {renderSection("Universities", GraduationCap)}
        {renderSection("Colleges", School)}
        {renderSection("Courses", BookOpen)}
      </div>

      <AnimatePresence>
        {activeCategory && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden p-1.5 md:p-3"
            style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-y' }}
          >
            <motion.div initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} onClick={closeModal} className="absolute inset-0 bg-black/90 backdrop-blur-xl" />
            
            <motion.div initial={{y: 50, opacity: 0}} animate={{y: 0, opacity: 1}} className="relative z-10 flex h-[calc(100dvh-0.75rem)] w-[99vw] max-w-[96rem] flex-col overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#0f0f0f] shadow-2xl sm:rounded-[2rem] md:h-[calc(100dvh-1.5rem)]">
              
              <div className="shrink-0 flex items-center justify-between border-b border-white/5 bg-white/[0.02] px-4 py-3 sm:px-5 lg:px-6">
                <div>
                    <h2 className="text-xl font-black italic tracking-tighter uppercase sm:text-2xl lg:text-[1.8rem]">
                        {isEditing ? `Edit ${activeCategory.slice(0,-1)}` : `New ${activeCategory.slice(0,-1)}`}
                    </h2>
                    {isEditing && <p className="text-[10px] font-bold text-white uppercase tracking-widest mt-1">Modifying existing record ID: {editId}</p>}
                </div>
                <button onClick={closeModal} className="p-2 hover:bg-white/10 rounded-full transition-all"><X /></button>
              </div>

              <form
                id="add-opportunity-form"
                onSubmit={handleSubmit}
                noValidate
                className="custom-scrollbar min-h-0 flex-1 overflow-y-auto overscroll-contain p-3 sm:p-4"
                style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-y' }}
              >
                {activeCategory === 'Universities' && (
                  <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr] xl:gap-6">
                    <div className="space-y-5">
                      <div className="rounded-3xl border border-white/5 bg-white/[0.02] p-4 sm:p-5">
                        <h4 className="mb-3 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white">
                          <Info size={14}/> University Info
                        </h4>
                        <input
                          placeholder="University Name"
                          className="w-full rounded-xl border border-white/10 bg-white/5 p-3 outline-none focus:border-white"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          required
                        />
                        <textarea
                          rows="6"
                          placeholder="Short description about the university..."
                          className="mt-4 w-full resize-none rounded-2xl border border-white/10 bg-white/5 p-3 outline-none focus:border-white"
                          value={formData.about}
                          onChange={(e) => setFormData({...formData, about: e.target.value})}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-5">
                      <div className="rounded-3xl border border-white/5 bg-white/[0.02] p-4 sm:p-5">
                        <h4 className="mb-3 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white">
                          <Layers size={14}/> Logo
                        </h4>
                        <div className="group relative h-36 w-full overflow-hidden rounded-2xl border-2 border-dashed border-white/10 bg-white/5 transition-colors hover:border-white/50">
                          {formData.image_url ? (
                            <>
                              <img src={formData.image_url} alt="" className="h-full w-full object-contain p-4" />
                              <button
                                type="button"
                                onClick={() => setFormData({...formData, image_url: ''})}
                                className="absolute right-2 top-2 z-20 rounded-lg bg-white p-1"
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
                          className="mt-3 w-full rounded-xl border border-white/10 bg-white/5 p-3 text-[11px] outline-none focus:border-white"
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeCategory === 'Colleges' && (
                  <div className="grid grid-cols-1 gap-3 xl:grid-cols-[1fr_1fr] xl:gap-4">
                    <div className="space-y-3">
                      <div className="space-y-2.5 rounded-3xl border border-white/5 bg-white/[0.02] p-3">
                        <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white"><Info size={14}/> Basic Information</h4>
                        <input placeholder="College Name" className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-[11px] outline-none focus:border-white sm:text-sm" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required/>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <input placeholder="Rating" className="rounded-xl border border-white/10 bg-white/5 p-2.5 text-[11px] outline-none focus:border-white sm:text-sm" value={formData.rating} onChange={e => setFormData({...formData, rating: e.target.value})} required/>
                          <input placeholder="Location" className="rounded-xl border border-white/10 bg-white/5 p-2.5 text-[11px] outline-none focus:border-white sm:text-sm" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} required/>
                        </div>
                        <select className="w-full rounded-xl border border-white/10 bg-[#1a1a1a] p-2.5 text-[11px] outline-none focus:border-white sm:text-sm" value={formData.university_id} onChange={e => setFormData({...formData, university_id: e.target.value})} required>
                          <option value="">Select University</option>
                          {globalData.Universities?.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                        </select>
                      </div>

                      <div className="space-y-2.5 rounded-3xl border border-white/5 bg-white/[0.02] p-3">
                        <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white"><Banknote size={14}/> Fee / Upload</h4>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <input placeholder="Annual Fee From" className="rounded-xl border border-white/10 bg-white/5 p-2.5 text-[11px] outline-none focus:border-white sm:text-sm" value={formData.feeFrom} onChange={e => setFormData({...formData, feeFrom: e.target.value})} required/>
                          <input placeholder="Up To" className="rounded-xl border border-white/10 bg-white/5 p-2.5 text-[11px] outline-none focus:border-white sm:text-sm" value={formData.feeTo} onChange={e => setFormData({...formData, feeTo: e.target.value})} required/>
                        </div>
                        <input placeholder="Display Fee Range (auto if blank)" className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-[11px] outline-none focus:border-white sm:text-sm" value={formData.feeRange} onChange={e => setFormData({...formData, feeRange: e.target.value})} />
                        <div className="space-y-2 rounded-2xl border border-dashed border-white/10 bg-white/5 p-3">
                          <h5 className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-white">
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
                                  className="rounded-full bg-white px-2.5 py-1 text-[9px] font-black uppercase text-white"
                                >
                                  Remove
                                </button>
                              </div>
                            ) : (
                              <label className="flex cursor-pointer items-center justify-center rounded-lg border border-white/10 bg-black/20 px-3 py-3 text-center">
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

                      <div className="space-y-2.5 rounded-3xl border border-white/5 bg-white/[0.02] p-3">
                        <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white"><Phone size={14}/> Contact Details</h4>
                        <input placeholder="Phone" className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-[11px] outline-none focus:border-white sm:text-sm" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} required/>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <input placeholder="Email" className="rounded-xl border border-white/10 bg-white/5 p-2.5 text-[11px] outline-none focus:border-white sm:text-sm" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required/>
                          <input placeholder="Address" className="rounded-xl border border-white/10 bg-white/5 p-2.5 text-[11px] outline-none focus:border-white sm:text-sm" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} required/>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="space-y-2.5 rounded-3xl border border-white/5 bg-white/[0.02] p-3">
                        <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white"><ShieldCheck size={14}/> Quick Facts</h4>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <input placeholder="Institution Type" className="rounded-xl border border-white/10 bg-white/5 p-2.5 text-[11px] outline-none focus:border-white sm:text-sm" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} required/>
                          <input placeholder="Course Levels" className="rounded-xl border border-white/10 bg-white/5 p-2.5 text-[11px] outline-none focus:border-white sm:text-sm" value={formData.levels} onChange={e => setFormData({...formData, levels: e.target.value})} required/>
                        </div>
                      </div>

                      <div className="space-y-2.5 rounded-3xl border border-white/5 bg-white/[0.02] p-3">
                        <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white"><Layers size={14}/> About Section</h4>
                        <textarea rows="3" placeholder="About the college..." className="w-full resize-none rounded-2xl border border-white/10 bg-white/5 p-2.5 text-[11px] outline-none focus:border-white sm:text-sm xl:h-24" value={formData.about} onChange={e => setFormData({...formData, about: e.target.value})} required/>
                      </div>

                      <div className="space-y-2.5 rounded-3xl border border-white/5 bg-white/[0.02] p-3">
                        <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white">
                          <Layers size={14}/> Image Upload
                        </h4>
                        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[0.85fr_1.15fr]">
                          <div className="space-y-2">
                            <div className="group relative h-28 w-full overflow-hidden rounded-2xl border-2 border-dashed border-white/10 bg-white/5 transition-colors hover:border-white/50">
                              {formData.image_url ? (
                                <>
                                  <img src={formData.image_url} alt="" className="h-full w-full object-cover" />
                                  <button
                                    type="button"
                                    onClick={() => setFormData({...formData, image_url: ''})}
                                    className="absolute right-2 top-2 z-20 rounded-lg bg-white p-1"
                                  >
                                    <X size={14} />
                                  </button>
                                </>
                              ) : (
                                <div className="flex h-full flex-col items-center justify-center gap-1 opacity-40">
                                  <Plus size={20} />
                                  <span className="text-[9px] font-bold uppercase tracking-widest">Cover Image</span>
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
                              placeholder="Paste image URL"
                              className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-[11px] outline-none focus:border-white"
                              required
                            />
                          </div>

                          <div className="grid grid-cols-3 gap-2">
                            {formData.images?.slice(0, 5).map((img, idx) => (
                              <div key={idx} className="relative h-16 overflow-hidden rounded-lg border border-white/10 bg-white/10">
                                <img src={img} alt="" className="h-full w-full object-cover" />
                                <button
                                  type="button"
                                  onClick={() => setFormData({...formData, images: formData.images.filter((_, i) => i !== idx)})}
                                  className="absolute inset-0 flex items-center justify-center bg-white/80 opacity-0 transition-opacity hover:opacity-100"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            ))}
                            <label className="relative flex h-16 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-white/10 transition-colors hover:border-white">
                              <Plus size={16} className="text-white" />
                              <span className="text-[8px] font-bold uppercase text-white/40">Gallery</span>
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
                  </div>
                )}

                {activeCategory === 'Courses' && (
                  <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_1fr] xl:gap-6">
                    <div className="space-y-4 sm:space-y-5">
                      <div className="space-y-3 rounded-3xl border border-white/5 bg-white/[0.02] p-4 sm:p-5">
                        <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white"><Info size={14}/> Basic Information</h4>
                        <input placeholder="Course Name" className="w-full rounded-xl border border-white/10 bg-white/5 p-3 outline-none focus:border-white" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required/>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <input placeholder="Degree" className="rounded-xl border border-white/10 bg-white/5 p-3 outline-none focus:border-white" value={formData.degree} onChange={e => setFormData({...formData, degree: e.target.value})} required/>
                          <input placeholder="Category" className="rounded-xl border border-white/10 bg-white/5 p-3 outline-none focus:border-white" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} required/>
                        </div>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <input placeholder="Level" className="rounded-xl border border-white/10 bg-white/5 p-3 outline-none focus:border-white" value={formData.levels} onChange={e => setFormData({...formData, levels: e.target.value})} required/>
                          <input placeholder="Duration" className="rounded-xl border border-white/10 bg-white/5 p-3 outline-none focus:border-white" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} required/>
                        </div>
                        <select className="w-full rounded-xl border border-white/10 bg-[#1a1a1a] p-3 outline-none focus:border-white" value={formData.college_id} onChange={e => setFormData({...formData, college_id: e.target.value})} required>
                          <option value="">Select College</option>
                          {globalData.Colleges?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                      </div>

                      <div className="space-y-3 rounded-3xl border border-white/5 bg-white/[0.02] p-4 sm:p-5">
                        <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white">
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
                                className="rounded-full bg-white px-3 py-1 text-[10px] font-black uppercase text-white"
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
                        <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white"><Banknote size={14}/> Financial Information</h4>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <input placeholder="Annual Fee From" className="rounded-xl border border-white/10 bg-white/5 p-3 outline-none focus:border-white" value={formData.feeFrom} onChange={e => setFormData({...formData, feeFrom: e.target.value})} required/>
                          <input placeholder="Up To" className="rounded-xl border border-white/10 bg-white/5 p-3 outline-none focus:border-white" value={formData.feeTo} onChange={e => setFormData({...formData, feeTo: e.target.value})} required/>
                        </div>
                        <input placeholder="Display Fee Range (auto if blank)" className="w-full rounded-xl border border-white/10 bg-white/5 p-3 outline-none focus:border-white" value={formData.feeRange} onChange={e => setFormData({...formData, feeRange: e.target.value})} />
                      </div>
                    </div>

                    <div className="space-y-5 sm:space-y-6">
                      <div className="space-y-3 rounded-3xl border border-white/5 bg-white/[0.02] p-4 sm:p-5">
                        <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white"><ShieldCheck size={14}/> Provider Information</h4>
                        <input placeholder="Provider Type" className="w-full rounded-xl border border-white/10 bg-white/5 p-3 outline-none focus:border-white" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} required/>
                        <input placeholder="Affiliation" className="w-full rounded-xl border border-white/10 bg-white/5 p-3 outline-none focus:border-white" value={formData.affiliation} onChange={e => setFormData({...formData, affiliation: e.target.value})} required/>
                        <input placeholder="Phone" className="w-full rounded-xl border border-white/10 bg-white/5 p-3 outline-none focus:border-white" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} required/>
                        <input placeholder="Email" className="w-full rounded-xl border border-white/10 bg-white/5 p-3 outline-none focus:border-white" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required/>
                      </div>

                      <div className="space-y-3 rounded-3xl border border-white/5 bg-white/[0.02] p-4 sm:p-5">
                        <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white"><Layers size={14}/> About Section</h4>
                        <textarea rows="4" placeholder="About the course..." className="w-full resize-none rounded-2xl border border-white/10 bg-white/5 p-3 outline-none focus:border-white" value={formData.about} onChange={e => setFormData({...formData, about: e.target.value})} required/>
                      </div>
                    </div>
                  </div>
                )}

                {activeCategory !== 'Universities' && activeCategory !== 'Colleges' && activeCategory !== 'Courses' && (
                  <div className="rounded-3xl border border-white/5 bg-white/[0.02] p-4 text-sm text-white/50">
                    Unknown category selected.
                  </div>
                )}

              </form>

              <div className="shrink-0 border-t border-white/10 bg-[#0f0f0f]/98 p-2.5 backdrop-blur-xl sm:p-3">
                <div className="flex flex-col items-center justify-between gap-3 rounded-[1.35rem] border border-white/10 bg-[#0f0f0f]/95 p-3 md:flex-row md:gap-6">
                {isEditing ? (
                  <button 
                      type="button" 
                      onClick={() => removeItem(activeCategory, editId)}
                      className="w-full md:w-auto text-white/50 hover:text-white text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 transition-colors"
                  >
                      <Trash2 size={14}/> Delete Forever
                  </button>
                ) : (
                  <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest italic">Draft mode: ensure accuracy</p>
                )}
                
                <div className="flex w-full gap-4 md:w-auto">
                  <button onClick={closeModal} type="button" className="hidden md:block px-8 text-white/30 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors">Discard</button>
                  <button
                    type="button"
                    onClick={handlePublishClick}
                    disabled={isSubmitting}
                    className="w-full md:w-auto bg-white px-10 py-3 rounded-2xl text-black font-black uppercase tracking-widest hover:bg-white/90 transition-all flex items-center justify-center gap-3 shadow-xl shadow-white/20 disabled:cursor-wait disabled:opacity-60"
                  >
                      {isSubmitting ? "PUBLISHING..." : isEditing ? "SAVE CHANGES" : "PUBLISH DATA"} <Send size={18}/>
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
