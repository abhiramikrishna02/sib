import React, { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { GraduationCap, School, BookOpen, Star, MapPin, ArrowRight, Layers, Search, Download } from 'lucide-react'

export default function Services({ globalData, locationHash, onNavigate, dataLoading }) {
  const { Universities = [], Colleges = [], Courses = [] } = globalData || {}
  const [universitySearch, setUniversitySearch] = useState('')
  const [collegeSearch, setCollegeSearch] = useState('')
  const [courseSearch, setCourseSearch] = useState('')
  const [collegeFilter, setCollegeFilter] = useState('All')
  const [courseFilter, setCourseFilter] = useState('All')
  const [universityPage, setUniversityPage] = useState(1)
  const [collegePage, setCollegePage] = useState(1)
  const [coursePage, setCoursePage] = useState(1)
  const itemsPerPage = 9

  const getCardImage = (item) => item.image_url || item.images?.[0] || ''
  const getDocumentUrl = (item) => item.document_url || ''
  const splitFeeRange = (value) => {
    const text = String(value || '').trim()
    if (!text) return ['', '']
    const parts = text.split(/\s*(?:-|–|—|to)\s*/i).map((part) => part.trim()).filter(Boolean)
    return parts.length >= 2 ? [parts[0], parts.slice(1).join(' - ')] : [text, '']
  }
  const getFeeFrom = (item) => {
    const [from] = splitFeeRange(item.feeRange || item.fee_range)
    return item.feeFrom || item.fee_from || from || 'N/A'
  }
  const getFeeTo = (item) => {
    const [, to] = splitFeeRange(item.feeRange || item.fee_range)
    return item.feeTo || item.fee_to || to || 'N/A'
  }
  const getCourseCollege = (item) => Colleges.find((college) => String(college.id) === String(item.college_id))

  const selectedUniversityId = useMemo(() => {
    const hash = (locationHash || window.location.hash || '').replace(/^#/, '')
    if (!hash.startsWith('colleges-')) return ''
    return hash.replace('colleges-', '')
  }, [locationHash])

  const selectedUniversity = Universities.find((item) => String(item.id) === String(selectedUniversityId))

  const visibleUniversities = Universities.filter((item) => {
    const q = universitySearch.trim().toLowerCase()
    if (!q) return true
    return [item.name, item.location, item.about].filter(Boolean).some((v) => String(v).toLowerCase().includes(q))
  })

  const collegesForUniversity = selectedUniversityId
    ? Colleges.filter((college) => String(college.university_id) === String(selectedUniversityId))
    : Colleges
  const collegesToDisplay = selectedUniversityId ? collegesForUniversity : Colleges

  const visibleColleges = collegesToDisplay.filter((item) => {
    const q = collegeSearch.trim().toLowerCase()
    const matchesSearch =
      !q ||
      [item.name, item.location, item.about, item.type, item.level, item.feeRange]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q))
    const tag = String(item.type || item.level || '').toLowerCase()
    const matchesFilter =
      collegeFilter === 'All' ||
      (collegeFilter === 'Top Rated' && Number(item.rating) >= 4) ||
      (collegeFilter === 'Autonomous' && tag.includes('autonomous'))
    return matchesSearch && matchesFilter
  })

  const visibleCourses = Courses.filter((item) => {
    const q = courseSearch.trim().toLowerCase()
    const matchesSearch =
      !q ||
      [item.name, item.location, item.about, item.type, item.level, item.degree, item.category]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q))
    const level = String(item.level || item.levels || '').toLowerCase()
    const matchesFilter =
      courseFilter === 'All' ||
      (courseFilter === 'UG' && level.includes('ug')) ||
      (courseFilter === 'PG' && level.includes('pg'))
    return matchesSearch && matchesFilter
  })

  const universityPageItems = visibleUniversities.slice((universityPage - 1) * itemsPerPage, universityPage * itemsPerPage)
  const collegePageItems = visibleColleges.slice((collegePage - 1) * itemsPerPage, collegePage * itemsPerPage)
  const coursePageItems = visibleCourses.slice((coursePage - 1) * itemsPerPage, coursePage * itemsPerPage)
  const universityPages = Math.max(1, Math.ceil(visibleUniversities.length / itemsPerPage))
  const collegePages = Math.max(1, Math.ceil(visibleColleges.length / itemsPerPage))
  const coursePages = Math.max(1, Math.ceil(visibleCourses.length / itemsPerPage))
  const universityOnlyView = Boolean(selectedUniversityId)

  useEffect(() => {
    const hash = locationHash || window.location.hash
    if (!hash) return
    const hashId = hash.replace(/^#/, '')
    const element = document.getElementById(hashId) || (hashId.startsWith('colleges-') ? document.getElementById('college-view') : null)
    if (!element) return
    const timer = window.setTimeout(() => {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
    return () => window.clearTimeout(timer)
  }, [dataLoading, locationHash])

  useEffect(() => setUniversityPage(1), [universitySearch])
  useEffect(() => setCollegePage(1), [collegeSearch, collegeFilter, selectedUniversityId])
  useEffect(() => setCoursePage(1), [courseSearch, courseFilter])

  const renderPagination = (page, totalPages, setPage) => {
    if (totalPages <= 1) return null
    return (
      <div className="mt-8 flex flex-wrap justify-center gap-2">
        {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((num) => (
          <button
            key={num}
            onClick={() => setPage(num)}
            className={`h-10 min-w-10 rounded-full px-3 text-[10px] font-black transition-colors ${
              page === num
                ? 'bg-white text-black'
                : 'border border-white/10 bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
            }`}
          >
            {num}
          </button>
        ))}
      </div>
    )
  }

  return (

    <div className="relative min-h-screen overflow-hidden bg-[#08040f] px-4 pb-16 pt-28 text-white sm:px-6 sm:pb-20 sm:pt-32 md:px-16">
      <div className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(180deg,#08040f_0%,#14091d_48%,#0c0614_100%)]" />
      <div className="pointer-events-none fixed left-[-10%] top-[-10%] z-0 h-[520px] w-[520px] rounded-full bg-cyan-500/10 blur-[110px]" />
      <div className="pointer-events-none fixed right-[-8%] top-[-8%] z-0 h-[520px] w-[520px] rounded-full bg-fuchsia-400/12 blur-[120px]" />
      <div className="pointer-events-none fixed bottom-[-12%] left-1/2 z-0 h-[520px] w-[720px] -translate-x-1/2 rounded-full bg-amber-500/8 blur-[130px]" />
      <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.04] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.8)_1px,transparent_1px)] bg-[size:24px_24px]" />
      <div className="relative z-10 mx-auto max-w-7xl">
        <header className="mb-16 text-center sm:mb-20 md:mb-24">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="mb-4 text-[10px] font-black uppercase tracking-[0.5em] text-white/60">Browse Educational Options</p>
            <h1 className="mb-6 text-[clamp(2.8rem,12vw,4.8rem)] font-black italic uppercase tracking-tighter text-white md:text-8xl">
              Study<span className="text-white/45">.</span> Directory
            </h1>
            <p className="mx-auto max-w-2xl text-sm leading-relaxed text-white/70 md:text-lg">
              Explore trusted universities, colleges, and courses in one place.
            </p>
          </motion.div>
        </header>

        {!universityOnlyView && (
          <section className="mb-16 scroll-mt-32 sm:mb-20 md:mb-24" id="universities">
          <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.045] shadow-2xl shadow-black/40 backdrop-blur-xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.08),transparent_28%)]" />
            <div className="relative px-4 py-10 sm:px-6 sm:py-12 md:px-10">
              <div className="mb-6 text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/65">Featured Universities</p>
                <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/60">
                  Compare universities and open the colleges linked to each institution.
                </p>
              </div>
              <div className="mx-auto mb-8 max-w-xl">
                <label className="flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-4 py-3 text-white shadow-lg shadow-black/20 backdrop-blur-xl">
                  <Search size={18} className="shrink-0 text-white/70" />
                  <input value={universitySearch} onChange={(e) => setUniversitySearch(e.target.value)} placeholder="Search universities" className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-white/45" />
                </label>
              </div>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                {dataLoading && universityPageItems.length === 0 && (
                  <div className="col-span-full rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-white/55">
                    Loading universities...
                  </div>
                )}
                {!dataLoading && universityPageItems.length === 0 && (
                  <div className="col-span-full rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-white/55">
                    No universities found.
                  </div>
                )}
                {universityPageItems.map((item) => (
                  <motion.article
                    key={item.id}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="rounded-[1.7rem] border border-white/10 bg-white/[0.07] p-4 shadow-xl shadow-black/20 backdrop-blur-md transition-transform duration-300 hover:-translate-y-1 hover:bg-white/[0.1] sm:p-5"
                  >
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[88px_minmax(0,1fr)] lg:gap-5">
                      <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white">
                        {getCardImage(item) ? (
                          <img src={getCardImage(item)} alt={item.name} className="h-full w-full object-cover" />
                        ) : (
                          <GraduationCap className="text-black" size={28} />
                        )}
                      </div>

                      <div className="min-w-0 py-1 lg:py-0">
                        <h3 className="text-lg font-black leading-tight text-white sm:text-xl lg:max-w-[18rem]">
                          {item.name}
                        </h3>
                        <p className="mt-1 max-w-[34rem] text-sm leading-relaxed text-white/80">
                          {item.about || 'University information not available.'}
                        </p>
                        <div className="mt-3 flex flex-wrap items-center gap-3 text-[10px] leading-none text-white/55">
                          {item.rating && (
                            <span className="rounded-full border border-white/15 bg-white/10 px-2 py-1 text-[9px] font-black uppercase tracking-[0.18em] text-white/80">
                              {item.rating}
                            </span>
                          )}
                        </div>

                        <div className="mt-4">
                          <button
                          onClick={() => onNavigate?.(`/services#colleges-${item.id}`)}
                          className="inline-flex shrink-0 items-center justify-center rounded-full bg-white px-5 py-3 text-[11px] font-black uppercase tracking-widest text-black transition-colors hover:bg-white/80"
                        >
                            Explore Colleges
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
              {renderPagination(universityPage, universityPages, setUniversityPage)}
            </div>
          </div>
          </section>
        )}

        {universityOnlyView && (
          <section className="mb-16 scroll-mt-32 sm:mb-20 md:mb-24" id="college-view">
          <div className="overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.045] shadow-2xl shadow-black/40 backdrop-blur-xl">
            <div className="border-b border-white/10 bg-white/[0.055] px-4 py-6 text-center sm:px-6 sm:py-8">
              <h2 className="text-[clamp(2.1rem,6vw,3.6rem)] font-black italic uppercase tracking-tighter text-white">Leading Colleges</h2>
              <p className="mt-2 text-[10px] font-medium text-white/60 sm:text-sm">Browse colleges, ratings, and fee ranges across Bengaluru.</p>
            </div>
            <div className="relative px-4 py-8 sm:px-6 md:px-10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.06),transparent_20%)]" />
              <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-wrap gap-3">
                  {['All', 'Top Rated', 'Autonomous'].map((pill) => (
                    <button key={pill} onClick={() => setCollegeFilter(pill)} className={`rounded-full px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-colors ${collegeFilter === pill ? 'bg-white text-black' : 'border border-white/10 bg-white/10 text-white/80 hover:bg-white/20'}`}>
                      {pill}
                    </button>
                  ))}
                </div>
                <label className="flex w-full items-center gap-3 rounded-full border border-white/15 bg-white/10 px-4 py-3 text-white shadow-lg shadow-black/10 backdrop-blur-xl lg:max-w-md">
                  <input value={collegeSearch} onChange={(e) => setCollegeSearch(e.target.value)} placeholder="Search colleges..." className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-white/45" />
                  <Search size={18} className="shrink-0 text-white/70" />
                </label>
              </div>
              {selectedUniversity && (
                <div className="relative mt-5 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white/80 backdrop-blur-md">
                  Showing colleges under <span className="font-black text-white">{selectedUniversity.name}</span>
                </div>
              )}
              <div className="relative mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                {dataLoading && collegePageItems.length === 0 && (
                  <div className="col-span-full rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-white/55">
                    Loading colleges...
                  </div>
                )}
                {!dataLoading && collegePageItems.length === 0 && (
                  <div className="col-span-full rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-white/55">
                    No colleges found.
                  </div>
                )}
                {collegePageItems.map((item) => (
                  <motion.article key={item.id} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="overflow-hidden rounded-[1.4rem] border border-white/10 bg-white/[0.07] shadow-xl shadow-black/20 backdrop-blur-md transition-transform duration-300 hover:-translate-y-1 hover:bg-white/[0.1]">
                    <div className="relative h-44 overflow-hidden">
                      {getCardImage(item) ? <img src={getCardImage(item)} alt={item.name} className="h-full w-full object-cover" /> : <div className="h-full w-full bg-[linear-gradient(135deg,#111,#5a5a5a)]" />}
                      {item.rating && <div className="absolute right-2 top-2 rounded-full bg-black/35 px-3 py-1 text-[10px] font-black text-yellow-300 backdrop-blur-md">{'★'.repeat(Math.min(5, Math.round(Number(item.rating) || 0)))}</div>}
                    </div>
                    <div className="p-4 text-white">
                      <h3 className="text-base font-black leading-snug sm:text-lg">{item.name}</h3>
                      <div className="mt-1 flex items-center gap-2 text-[10px] text-white/70"><MapPin size={10} /><span className="truncate">{item.location || 'Location not set'}</span></div>
                      <div className="mt-3 border-t border-white/10 pt-3">
                        <div className="grid grid-cols-2 gap-3 text-[10px] text-white/55">
                          <div><span>Annual Fees From</span><div className="mt-1 font-normal text-white">{getFeeFrom(item)}</div></div>
                          <div><span>Up To</span><div className="mt-1 font-normal text-white">{getFeeTo(item)}</div></div>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <button onClick={() => onNavigate?.(`/details#type=college&id=${item.id}`)} className="text-[10px] font-black uppercase tracking-widest text-white/85 hover:text-white">View Details</button>
                          {getDocumentUrl(item) ? (
                            <a href={getDocumentUrl(item)} download target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/10 px-2.5 py-1.5 text-[9px] font-black uppercase tracking-widest text-white/80 hover:bg-white hover:text-black">
                              <Download size={11} /> Doc
                            </a>
                          ) : <ArrowRight size={14} className="text-white/80" />}
                        </div>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
              {renderPagination(collegePage, collegePages, setCollegePage)}
            </div>
          </div>
          </section>
        )}

        <section className="mb-16 scroll-mt-32 sm:mb-20 md:mb-24" id="colleges">
          <div className="overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.045] shadow-2xl shadow-black/40 backdrop-blur-xl">
            <div className="border-b border-white/10 bg-white/[0.055] px-4 py-6 text-center sm:px-6 sm:py-8">
              <h2 className="text-[clamp(2.1rem,6vw,3.6rem)] font-black italic uppercase tracking-tighter text-white">Leading Colleges</h2>
              <p className="mt-2 text-[10px] font-medium text-white/60 sm:text-sm">Browse colleges, ratings, and fee ranges across Bengaluru.</p>
            </div>
            <div className="relative px-4 py-8 sm:px-6 md:px-10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.06),transparent_20%)]" />
              <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-wrap gap-3">
                  {['All', 'Top Rated', 'Autonomous'].map((pill) => (
                    <button key={pill} onClick={() => setCollegeFilter(pill)} className={`rounded-full px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-colors ${collegeFilter === pill ? 'bg-white text-black' : 'border border-white/10 bg-white/10 text-white/80 hover:bg-white/20'}`}>
                      {pill}
                    </button>
                  ))}
                </div>
                <label className="flex w-full items-center gap-3 rounded-full border border-white/15 bg-white/10 px-4 py-3 text-white shadow-lg shadow-black/10 backdrop-blur-xl lg:max-w-md">
                  <input value={collegeSearch} onChange={(e) => setCollegeSearch(e.target.value)} placeholder="Search colleges..." className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-white/45" />
                  <Search size={18} className="shrink-0 text-white/70" />
                </label>
              </div>
              <div className="relative mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                {dataLoading && collegePageItems.length === 0 && (
                  <div className="col-span-full rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-white/55">
                    Loading colleges...
                  </div>
                )}
                {!dataLoading && collegePageItems.length === 0 && (
                  <div className="col-span-full rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-white/55">
                    No colleges found.
                  </div>
                )}
                {collegePageItems.map((item) => (
                  <motion.article key={item.id} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="overflow-hidden rounded-[1.4rem] border border-white/10 bg-white/[0.07] shadow-xl shadow-black/20 backdrop-blur-md transition-transform duration-300 hover:-translate-y-1 hover:bg-white/[0.1]">
                    <div className="relative h-44 overflow-hidden">
                      {getCardImage(item) ? <img src={getCardImage(item)} alt={item.name} className="h-full w-full object-cover" /> : <div className="h-full w-full bg-[linear-gradient(135deg,#111,#5a5a5a)]" />}
                      {item.rating && <div className="absolute right-2 top-2 rounded-full bg-black/35 px-3 py-1 text-[10px] font-black text-yellow-300 backdrop-blur-md">{'★'.repeat(Math.min(5, Math.round(Number(item.rating) || 0)))}</div>}
                    </div>
                    <div className="p-4 text-white">
                      <h3 className="text-base font-black leading-snug sm:text-lg">{item.name}</h3>
                      <div className="mt-1 flex items-center gap-2 text-[10px] text-white/70"><MapPin size={10} /><span className="truncate">{item.location || 'Location not set'}</span></div>
                      <div className="mt-3 border-t border-white/10 pt-3">
                        <div className="grid grid-cols-2 gap-3 text-[10px] text-white/55">
                          <div><span>Annual Fees From</span><div className="mt-1 font-normal text-white">{getFeeFrom(item)}</div></div>
                          <div><span>Up To</span><div className="mt-1 font-normal text-white">{getFeeTo(item)}</div></div>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <button onClick={() => onNavigate?.(`/details#type=college&id=${item.id}`)} className="text-[10px] font-black uppercase tracking-widest text-white/85 hover:text-white">View Details</button>
                          {getDocumentUrl(item) ? (
                            <a href={getDocumentUrl(item)} download target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/10 px-2.5 py-1.5 text-[9px] font-black uppercase tracking-widest text-white/80 hover:bg-white hover:text-black">
                              <Download size={11} /> Doc
                            </a>
                          ) : <ArrowRight size={14} className="text-white/80" />}
                        </div>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
              {renderPagination(collegePage, collegePages, setCollegePage)}
            </div>
          </div>
        </section>

        {!universityOnlyView && (
          <section className="mb-16 scroll-mt-32 sm:mb-20 md:mb-24" id="courses">
          <div className="overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.045] shadow-2xl shadow-black/40 backdrop-blur-xl">
            <div className="border-b border-white/10 bg-white/[0.055] px-4 py-6 text-center sm:px-6 sm:py-8">
              <h2 className="text-[clamp(2.1rem,6vw,3.6rem)] font-black italic uppercase tracking-tighter text-white">Career Courses</h2>
              <p className="mt-2 text-[10px] font-medium text-white/60 sm:text-sm">Find undergraduate and postgraduate courses matched to your goals.</p>
            </div>
            <div className="relative px-4 py-8 sm:px-6 md:px-10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.06),transparent_20%)]" />
              <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-wrap gap-3">
                  {['All', 'UG', 'PG'].map((pill) => (
                    <button key={pill} onClick={() => setCourseFilter(pill)} className={`rounded-full px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-colors ${courseFilter === pill ? 'bg-white text-black' : 'border border-white/10 bg-white/10 text-white/80 hover:bg-white/20'}`}>
                      {pill}
                    </button>
                  ))}
                </div>
                <label className="flex w-full items-center gap-3 rounded-full border border-white/15 bg-white/10 px-4 py-3 text-white shadow-lg shadow-black/10 backdrop-blur-xl lg:max-w-md">
                  <input value={courseSearch} onChange={(e) => setCourseSearch(e.target.value)} placeholder="Search courses..." className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-white/45" />
                  <Search size={18} className="shrink-0 text-white/70" />
                </label>
              </div>
              <div className="relative mt-8 grid grid-cols-1 items-start gap-5 md:grid-cols-2 xl:grid-cols-3">
                {dataLoading && coursePageItems.length === 0 && (
                  <div className="col-span-full rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-white/55">
                    Loading courses...
                  </div>
                )}
                {!dataLoading && coursePageItems.length === 0 && (
                  <div className="col-span-full rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-white/55">
                    No courses found.
                  </div>
                )}
                {coursePageItems.map((item) => (
                  <motion.article key={item.id} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="self-start overflow-hidden rounded-[1.25rem] border border-white/10 bg-white/[0.07] shadow-xl shadow-black/20 backdrop-blur-md transition-transform duration-300 hover:-translate-y-1 hover:bg-white/[0.1]">
                    <div className="p-4 text-white sm:p-5">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-lg font-black uppercase leading-tight sm:text-xl">{item.name}</h3>
                        <span className="shrink-0 rounded-full bg-white px-2.5 py-1 text-[9px] font-black uppercase text-black">
                          {(String(item.level || item.levels || 'UG').toUpperCase().includes('PG') ? 'PG' : 'UG')}
                        </span>
                      </div>
                      <p className="mt-2 text-[11px] leading-relaxed text-white/75">
                        Provided by: <span className="font-black text-white">{getCourseCollege(item)?.name || item.affiliation || "Study in Bengaluru"}</span>
                      </p>
                      <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-white/10 pt-3 text-sm">
                        <div><div className="text-[10px] uppercase tracking-[0.16em] text-white/45">From</div><div className="mt-1 text-sm font-black text-white">{getFeeFrom(item)}</div></div>
                        <div><div className="text-[10px] uppercase tracking-[0.16em] text-white/45">Up To</div><div className="mt-1 text-sm font-black text-white">{getFeeTo(item)}</div></div>
                        <div><div className="text-[10px] uppercase tracking-[0.16em] text-white/45">Duration</div><div className="mt-1 text-sm font-black text-white">{item.duration || "N/A"}</div></div>
                        <div><div className="text-[10px] uppercase tracking-[0.16em] text-white/45">Affiliation</div><div className="mt-1 text-sm font-black text-white">{item.affiliation || getCourseCollege(item)?.name || item.type || "N/A"}</div></div>
                      </div>
                      <div className="mt-4 flex items-center justify-end">
                        <button
                          onClick={() => onNavigate?.(`/details#type=course&id=${item.id}`)}
                          className="inline-flex items-center gap-2 text-xs font-black text-white/80 hover:text-white"
                        >
                          View Details <ArrowRight size={14} />
                        </button>
                        {getDocumentUrl(item) && (
                          <a
                            href={getDocumentUrl(item)}
                            download
                            target="_blank"
                            rel="noreferrer"
                            className="ml-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-2 text-[9px] font-black uppercase tracking-widest text-white/80 hover:bg-white hover:text-black"
                          >
                            <Download size={12} /> Download
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
              {renderPagination(coursePage, coursePages, setCoursePage)}
            </div>
          </div>
          </section>
        )}

        {universityOnlyView && (
          <div className="mb-10 flex justify-between">
            <button
              onClick={() => onNavigate?.('/services')}
              className="rounded-full border border-white/15 bg-white/10 px-5 py-3 text-[10px] font-black uppercase tracking-widest text-white hover:bg-white hover:text-black"
            >
              Back to Universities
            </button>
          </div>
        )}

        {Universities.length === 0 && Colleges.length === 0 && Courses.length === 0 && (
          <div className="rounded-[3rem] border border-white/5 bg-white/[0.01] py-24 text-center sm:py-32 md:py-40">
            <Layers className="mx-auto mb-6 text-white/10" size={48} />
            <p className="text-xs font-black uppercase tracking-[0.3em] text-white/20">No data has been published yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
