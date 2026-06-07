import React, { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { GraduationCap, School, BookOpen, Star, MapPin, ArrowRight, Layers, Search, Download, ArrowLeft, ChevronLeft } from 'lucide-react'

// ── Per-section accent tokens (mirroring About page card anatomy) ──
const ACCENT = {
  university: {
    color:       '#00CFFF',
    colorAlt:    '#4FC3F7',
    border:      'rgba(0,207,255,0.32)',
    glow:        'rgba(0,207,255,0.18)',
    glowDim:     'rgba(0,207,255,0.08)',
    sheen:       'rgba(0,207,255,0.55)',
    cardBg:      'linear-gradient(145deg,#030f1c 0%,#010a14 100%)',
    iconBg:      'linear-gradient(145deg,#041828,#010a14)',
    sectionBg:   'linear-gradient(180deg,#010c1a 0%,#020f20 50%,#010c1a 100%)',
    pillActive:  { background: '#00CFFF', color: '#010a14' },
  },
  college: {
    color:       '#00E5A0',
    colorAlt:    '#4DB6AC',
    border:      'rgba(0,229,160,0.32)',
    glow:        'rgba(0,229,160,0.18)',
    glowDim:     'rgba(0,229,160,0.08)',
    sheen:       'rgba(0,229,160,0.55)',
    cardBg:      'linear-gradient(145deg,#011810 0%,#010f0a 100%)',
    iconBg:      'linear-gradient(145deg,#02201a,#010f0a)',
    sectionBg:   'linear-gradient(180deg,#011810 0%,#021e14 50%,#011810 100%)',
    pillActive:  { background: '#00E5A0', color: '#010f0a' },
  },
  course: {
    color:       '#FFB300',
    colorAlt:    '#FFCA28',
    border:      'rgba(255,179,0,0.32)',
    glow:        'rgba(255,179,0,0.18)',
    glowDim:     'rgba(255,179,0,0.08)',
    sheen:       'rgba(255,179,0,0.55)',
    cardBg:      'linear-gradient(145deg,#180e00 0%,#100900 100%)',
    iconBg:      'linear-gradient(145deg,#241400,#100900)',
    sectionBg:   'linear-gradient(180deg,#180b00 0%,#1e1000 50%,#180b00 100%)',
    pillActive:  { background: '#FFB300', color: '#100900' },
  },
}

const PAGE_BG = '#06020e'

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

  // ── Reusable back button styled to a given accent ──
  const BackButton = ({ onClick, accent, label = 'Back' }) => (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all duration-200 hover:scale-105"
      style={{
        border: `1px solid ${accent.border}`,
        background: accent.glowDim,
        color: accent.color,
        boxShadow: `0 0 16px ${accent.glowDim}`,
      }}
    >
      <ChevronLeft size={13} />
      {label}
    </button>
  )

  // ── Pagination: accent-coloured active page button ──
  const renderPagination = (page, totalPages, setPage, accent) => {
    if (totalPages <= 1) return null
    return (
      <div className="mt-8 flex flex-wrap justify-center gap-2">
        {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((num) => (
          <button
            key={num}
            onClick={() => setPage(num)}
            style={
              page === num
                ? {
                    background: accent.color,
                    color: '#020510',
                    border: 'none',
                    boxShadow: `0 0 18px ${accent.glow}`,
                  }
                : {
                    border: `1px solid ${accent.border}`,
                    background: accent.glowDim,
                    color: accent.colorAlt,
                  }
            }
            className="h-10 min-w-10 rounded-full px-3 text-[10px] font-black transition-all duration-200 hover:scale-105"
          >
            {num}
          </button>
        ))}
      </div>
    )
  }

  // ── Search bar with accent border ──
  const SearchBar = ({ value, onChange, placeholder, accent }) => (
    <label
      className="flex items-center gap-3 rounded-full px-4 py-3 text-white backdrop-blur-xl"
      style={{
        border: `1px solid ${accent.border}`,
        background: `${accent.glowDim}`,
        boxShadow: `0 0 20px ${accent.glowDim}, inset 0 1px 0 ${accent.sheen}22`,
      }}
    >
      <Search size={18} className="shrink-0" style={{ color: accent.colorAlt }} />
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-transparent text-sm font-medium outline-none"
        style={{ color: '#fff' }}
      />
    </label>
  )

  // ── Filter pill row ──
  const FilterPills = ({ options, active, onSelect, accent }) => (
    <div className="flex flex-wrap gap-3">
      {options.map((pill) => (
        <button
          key={pill}
          onClick={() => onSelect(pill)}
          style={
            active === pill
              ? {
                  ...accent.pillActive,
                  boxShadow: `0 0 16px ${accent.glow}`,
                  border: 'none',
                }
              : {
                  border: `1px solid ${accent.border}`,
                  background: accent.glowDim,
                  color: accent.colorAlt,
                }
          }
          className="rounded-full px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all duration-200 hover:scale-105"
        >
          {pill}
        </button>
      ))}
    </div>
  )

  // ── Section wrapper: tinted dark bg + accent ambient glows ──
  const SectionShell = ({ children, accent, id, className = '' }) => (
    <section className={`mb-16 scroll-mt-32 sm:mb-20 md:mb-24 ${className}`} id={id}>
      <div
        className="relative overflow-hidden rounded-[2.5rem] shadow-2xl shadow-black/60 backdrop-blur-xl"
        style={{
          border: `1px solid ${accent.border}`,
          background: accent.cardBg,
          boxShadow: `0 32px 80px rgba(0,0,0,0.80), 0 0 60px ${accent.glow}`,
        }}
      >
        {/* Top sheen line */}
        <div
          className="absolute inset-x-0 top-0 h-[1px] rounded-t-[2.5rem]"
          style={{ background: `linear-gradient(90deg, transparent, ${accent.sheen}, transparent)` }}
        />
        {/* Ambient radial overlays */}
        <div
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
          style={{
            background: `radial-gradient(circle at 85% 10%, ${accent.glow}, transparent 38%),
                         radial-gradient(circle at 15% 90%, ${accent.glowDim}, transparent 30%)`,
          }}
        />
        {/* Subtle diagonal texture */}
        <div className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-[0.05] [background-image:repeating-linear-gradient(45deg,rgba(255,255,255,0.40)_0px,rgba(255,255,255,0.40)_1px,transparent_1px,transparent_28px)]" />
        <div className="relative">{children}</div>
      </div>
    </section>
  )

  // ── Section header band ──
  const SectionHeader = ({ label, title, desc, accent }) => (
    <div
      className="border-b px-4 py-6 text-center sm:px-6 sm:py-8"
      style={{ borderColor: accent.border }}
    >
      <p
        className="mb-2 text-[9px] font-black uppercase tracking-[0.45em]"
        style={{ color: `${accent.color}aa` }}
      >
        {label}
      </p>
      <h2
        className="text-[clamp(2.1rem,6vw,3.6rem)] font-black italic uppercase tracking-tighter"
        style={{
          background: `linear-gradient(135deg, ${accent.color} 0%, #ffffff 55%, ${accent.colorAlt} 100%)`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          filter: `drop-shadow(0 8px 20px ${accent.glow})`,
        }}
      >
        {title}
      </h2>
      <p className="mt-2 text-[10px] font-medium text-white/60 sm:text-sm">{desc}</p>
    </div>
  )

  return (
    <div
      className="relative min-h-screen overflow-hidden px-4 pb-16 pt-28 text-white sm:px-6 sm:pb-20 sm:pt-32 md:px-16"
      style={{ background: PAGE_BG }}
    >
      {/* ── Global background ── */}
      <div className="pointer-events-none fixed inset-0 z-0" style={{ background: 'linear-gradient(180deg,#06020e 0%,#0a0418 48%,#06020e 100%)' }} />

      {/* Ambient corner glows */}
      <div className="pointer-events-none fixed left-[-10%] top-[-10%] z-0 h-[520px] w-[520px] rounded-full blur-[120px]" style={{ background: 'rgba(0,207,255,0.08)' }} />
      <div className="pointer-events-none fixed right-[-8%] top-[-8%] z-0 h-[480px] w-[480px] rounded-full blur-[120px]" style={{ background: 'rgba(224,64,251,0.07)' }} />
      <div className="pointer-events-none fixed bottom-[-12%] left-1/3 z-0 h-[440px] w-[500px] rounded-full blur-[130px]" style={{ background: 'rgba(0,229,160,0.06)' }} />
      <div className="pointer-events-none fixed bottom-[-8%] right-1/4 z-0 h-[380px] w-[380px] rounded-full blur-[110px]" style={{ background: 'rgba(255,179,0,0.05)' }} />

      {/* Grid overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.18]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl">

        {/* ── PAGE HEADER ── */}
        <header className="mb-16 text-center sm:mb-20 md:mb-24">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div
              className="mb-4 inline-block rounded-full border px-4 py-2 text-[9px] font-black uppercase tracking-[0.4em] backdrop-blur-xl"
              style={{
                borderColor: 'rgba(224,64,251,0.30)',
                color: '#CE93D8',
                background: 'linear-gradient(145deg,rgba(224,64,251,0.10),rgba(224,64,251,0.04))',
                boxShadow: '0 0 20px rgba(224,64,251,0.12)',
              }}
            >
              Browse Educational Options
            </div>

            <h1
              className="mb-6 text-[clamp(2.8rem,12vw,4.8rem)] font-black italic uppercase tracking-tighter md:text-8xl"
              style={{
                background: 'linear-gradient(135deg, #00CFFF 0%, #CE93D8 45%, #00E5A0 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 12px 30px rgba(0,207,255,0.20))',
              }}
            >
              Study<span style={{ WebkitTextFillColor: 'rgba(255,255,255,0.35)' }}>.</span> Directory
            </h1>

            <p className="mx-auto max-w-2xl text-sm leading-relaxed text-white/70 md:text-lg">
              Explore trusted universities, colleges, and courses in one place.
            </p>

          
          </motion.div>
        </header>

        {/* ── UNIVERSITIES SECTION — Cyan accent ── */}
        {!universityOnlyView && (
          <SectionShell accent={ACCENT.university} id="universities">
            <SectionHeader
              label="Featured Universities"
              title="Universities"
              desc="Compare universities and open the colleges linked to each institution."
              accent={ACCENT.university}
            />
            <div className="relative px-4 py-10 sm:px-6 sm:py-12 md:px-10">
              <div className="mx-auto mb-8 max-w-xl">
                <SearchBar
                  value={universitySearch}
                  onChange={(e) => setUniversitySearch(e.target.value)}
                  placeholder="Search universities"
                  accent={ACCENT.university}
                />
              </div>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                {dataLoading && universityPageItems.length === 0 && (
                  <div
                    className="col-span-full rounded-3xl p-8 text-center"
                    style={{ border: `1px solid ${ACCENT.university.border}`, background: ACCENT.university.glowDim, color: ACCENT.university.colorAlt }}
                  >
                    Loading universities...
                  </div>
                )}
                {!dataLoading && universityPageItems.length === 0 && (
                  <div
                    className="col-span-full rounded-3xl p-8 text-center"
                    style={{ border: `1px solid ${ACCENT.university.border}`, background: ACCENT.university.glowDim, color: ACCENT.university.colorAlt }}
                  >
                    No universities found.
                  </div>
                )}
                {universityPageItems.map((item) => (
                  <motion.article
                    key={item.id}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="group relative overflow-hidden rounded-[1.7rem] p-4 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 sm:p-5"
                    style={{
                      border: `1px solid ${ACCENT.university.border}`,
                      background: ACCENT.university.cardBg,
                      boxShadow: `0 16px 48px rgba(0,0,0,0.70), 0 0 28px ${ACCENT.university.glowDim}`,
                    }}
                  >
                    <div
                      className="absolute inset-x-0 top-0 h-[1px] rounded-t-[1.7rem]"
                      style={{ background: `linear-gradient(90deg, transparent, ${ACCENT.university.sheen}, transparent)` }}
                    />
                    <div
                      className="absolute -right-8 -top-8 h-24 w-24 rounded-full border opacity-25 transition-transform duration-700 group-hover:scale-110"
                      style={{ borderColor: ACCENT.university.color }}
                    />

                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[88px_minmax(0,1fr)] lg:gap-5">
                      <div
                        className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border"
                        style={{
                          background: ACCENT.university.iconBg,
                          borderColor: `${ACCENT.university.color}44`,
                          boxShadow: `0 0 20px ${ACCENT.university.glow}`,
                        }}
                      >
                        {getCardImage(item) ? (
                          <img src={getCardImage(item)} alt={item.name} className="h-full w-full object-cover" />
                        ) : (
                          <GraduationCap style={{ color: ACCENT.university.color }} size={28} />
                        )}
                      </div>

                      <div className="min-w-0 py-1 lg:py-0">
                        <h3 className="text-lg font-black leading-tight text-white sm:text-xl lg:max-w-[18rem]">
                          {item.name}
                        </h3>
                        <p className="mt-1 max-w-[34rem] text-sm leading-relaxed text-white/80">
                          {item.about || 'University information not available.'}
                        </p>
                        <div className="mt-3 flex flex-wrap items-center gap-3">
                          {item.rating && (
                            <span
                              className="rounded-full border px-2 py-1 text-[9px] font-black uppercase tracking-[0.18em]"
                              style={{
                                borderColor: `${ACCENT.university.color}44`,
                                color: ACCENT.university.color,
                                background: ACCENT.university.glowDim,
                              }}
                            >
                              {item.rating}
                            </span>
                          )}
                        </div>
                        <div className="mt-4">
                          <button
                            onClick={() => onNavigate?.(`/services#colleges-${item.id}`)}
                            className="inline-flex shrink-0 items-center justify-center rounded-full px-5 py-3 text-[11px] font-black uppercase tracking-widest transition-all duration-200 hover:scale-105"
                            style={{
                              background: ACCENT.university.color,
                              color: '#010a14',
                              boxShadow: `0 0 20px ${ACCENT.university.glow}`,
                            }}
                          >
                            Explore Colleges
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
              {renderPagination(universityPage, universityPages, setUniversityPage, ACCENT.university)}
            </div>
          </SectionShell>
        )}

        {/* ── COLLEGE UNIVERSITY-FILTERED VIEW — Teal accent ── */}
        {universityOnlyView && (
          <SectionShell accent={ACCENT.college} id="college-view">
            {/* ── Section header with back button top-left ── */}
            <div
              className="border-b px-4 py-6 sm:px-6 sm:py-8"
              style={{ borderColor: ACCENT.college.border }}
            >
              {/* Back button row — sits above the centred heading */}
              <div className="mb-4 flex items-center">
                <BackButton
                  onClick={() => onNavigate?.('/services')}
                  accent={ACCENT.college}
                  label="Back to Universities"
                />
              </div>
              {/* Centred heading content */}
              <div className="text-center">
                <p
                  className="mb-2 text-[9px] font-black uppercase tracking-[0.45em]"
                  style={{ color: `${ACCENT.college.color}aa` }}
                >
                  Colleges Under University
                </p>
                <h2
                  className="text-[clamp(2.1rem,6vw,3.6rem)] font-black italic uppercase tracking-tighter"
                  style={{
                    background: `linear-gradient(135deg, ${ACCENT.college.color} 0%, #ffffff 55%, ${ACCENT.college.colorAlt} 100%)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    filter: `drop-shadow(0 8px 20px ${ACCENT.college.glow})`,
                  }}
                >
                  Leading Colleges
                </h2>
                <p className="mt-2 text-[10px] font-medium text-white/60 sm:text-sm">
                  Browse colleges, ratings, and fee ranges across Bengaluru.
                </p>
              </div>
            </div>

            <div className="relative px-4 py-8 sm:px-6 md:px-10">
              <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <FilterPills
                  options={['All', 'Top Rated', 'Autonomous']}
                  active={collegeFilter}
                  onSelect={setCollegeFilter}
                  accent={ACCENT.college}
                />
                <div className="w-full lg:max-w-md">
                  <SearchBar
                    value={collegeSearch}
                    onChange={(e) => setCollegeSearch(e.target.value)}
                    placeholder="Search colleges..."
                    accent={ACCENT.college}
                  />
                </div>
              </div>
              {selectedUniversity && (
                <div
                  className="relative mt-5 rounded-2xl px-4 py-3 text-sm text-white/80 backdrop-blur-md"
                  style={{ border: `1px solid ${ACCENT.college.border}`, background: ACCENT.college.glowDim }}
                >
                  Showing colleges under <span className="font-black" style={{ color: ACCENT.college.color }}>{selectedUniversity.name}</span>
                </div>
              )}
              <div className="relative mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                {dataLoading && collegePageItems.length === 0 && (
                  <div className="col-span-full rounded-3xl p-8 text-center" style={{ border: `1px solid ${ACCENT.college.border}`, background: ACCENT.college.glowDim, color: ACCENT.college.colorAlt }}>
                    Loading colleges...
                  </div>
                )}
                {!dataLoading && collegePageItems.length === 0 && (
                  <div className="col-span-full rounded-3xl p-8 text-center" style={{ border: `1px solid ${ACCENT.college.border}`, background: ACCENT.college.glowDim, color: ACCENT.college.colorAlt }}>
                    No colleges found.
                  </div>
                )}
                {collegePageItems.map((item) => (
                  <CollegeCard key={item.id} item={item} accent={ACCENT.college} getFeeFrom={getFeeFrom} getFeeTo={getFeeTo} getCardImage={getCardImage} getDocumentUrl={getDocumentUrl} onNavigate={onNavigate} />
                ))}
              </div>
              {renderPagination(collegePage, collegePages, setCollegePage, ACCENT.college)}
            </div>
          </SectionShell>
        )}

        {/* ── ALL COLLEGES SECTION — Teal accent ── */}
        <SectionShell accent={ACCENT.college} id="colleges">
          <SectionHeader
            label="Browse All Colleges"
            title="Leading Colleges"
            desc="Browse colleges, ratings, and fee ranges across Bengaluru."
            accent={ACCENT.college}
          />
          <div className="relative px-4 py-8 sm:px-6 md:px-10">
            <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <FilterPills
                options={['All', 'Top Rated', 'Autonomous']}
                active={collegeFilter}
                onSelect={setCollegeFilter}
                accent={ACCENT.college}
              />
              <div className="w-full lg:max-w-md">
                <SearchBar
                  value={collegeSearch}
                  onChange={(e) => setCollegeSearch(e.target.value)}
                  placeholder="Search colleges..."
                  accent={ACCENT.college}
                />
              </div>
            </div>
            <div className="relative mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {dataLoading && collegePageItems.length === 0 && (
                <div className="col-span-full rounded-3xl p-8 text-center" style={{ border: `1px solid ${ACCENT.college.border}`, background: ACCENT.college.glowDim, color: ACCENT.college.colorAlt }}>
                  Loading colleges...
                </div>
              )}
              {!dataLoading && collegePageItems.length === 0 && (
                <div className="col-span-full rounded-3xl p-8 text-center" style={{ border: `1px solid ${ACCENT.college.border}`, background: ACCENT.college.glowDim, color: ACCENT.college.colorAlt }}>
                  No colleges found.
                </div>
              )}
              {collegePageItems.map((item) => (
                <CollegeCard key={item.id} item={item} accent={ACCENT.college} getFeeFrom={getFeeFrom} getFeeTo={getFeeTo} getCardImage={getCardImage} getDocumentUrl={getDocumentUrl} onNavigate={onNavigate} />
              ))}
            </div>
            {renderPagination(collegePage, collegePages, setCollegePage, ACCENT.college)}
          </div>
        </SectionShell>

        {/* ── COURSES SECTION — Gold accent ── */}
        {!universityOnlyView && (
          <SectionShell accent={ACCENT.course} id="courses">
            <SectionHeader
              label="Explore Programmes"
              title="Career Courses"
              desc="Find undergraduate and postgraduate courses matched to your goals."
              accent={ACCENT.course}
            />
            <div className="relative px-4 py-8 sm:px-6 md:px-10">
              <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <FilterPills
                  options={['All', 'UG', 'PG']}
                  active={courseFilter}
                  onSelect={setCourseFilter}
                  accent={ACCENT.course}
                />
                <div className="w-full lg:max-w-md">
                  <SearchBar
                    value={courseSearch}
                    onChange={(e) => setCourseSearch(e.target.value)}
                    placeholder="Search courses..."
                    accent={ACCENT.course}
                  />
                </div>
              </div>
              <div className="relative mt-8 grid grid-cols-1 items-start gap-5 md:grid-cols-2 xl:grid-cols-3">
                {dataLoading && coursePageItems.length === 0 && (
                  <div className="col-span-full rounded-3xl p-8 text-center" style={{ border: `1px solid ${ACCENT.course.border}`, background: ACCENT.course.glowDim, color: ACCENT.course.colorAlt }}>
                    Loading courses...
                  </div>
                )}
                {!dataLoading && coursePageItems.length === 0 && (
                  <div className="col-span-full rounded-3xl p-8 text-center" style={{ border: `1px solid ${ACCENT.course.border}`, background: ACCENT.course.glowDim, color: ACCENT.course.colorAlt }}>
                    No courses found.
                  </div>
                )}
                {coursePageItems.map((item) => (
                  <motion.article
                    key={item.id}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="group relative self-start overflow-hidden rounded-[1.25rem] backdrop-blur-md transition-all duration-300 hover:-translate-y-1"
                    style={{
                      border: `1px solid ${ACCENT.course.border}`,
                      background: ACCENT.course.cardBg,
                      boxShadow: `0 16px 48px rgba(0,0,0,0.70), 0 0 28px ${ACCENT.course.glowDim}`,
                    }}
                  >
                    <div
                      className="absolute inset-x-0 top-0 h-[1px] rounded-t-[1.25rem]"
                      style={{ background: `linear-gradient(90deg, transparent, ${ACCENT.course.sheen}, transparent)` }}
                    />
                    <div
                      className="absolute -right-6 -top-6 h-20 w-20 rounded-full border opacity-25 transition-transform duration-700 group-hover:scale-110"
                      style={{ borderColor: ACCENT.course.color }}
                    />

                    <div className="relative p-4 text-white sm:p-5">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-lg font-black uppercase leading-tight sm:text-xl">{item.name}</h3>
                        <span
                          className="shrink-0 rounded-full px-2.5 py-1 text-[9px] font-black uppercase"
                          style={{
                            background: ACCENT.course.color,
                            color: '#100900',
                            boxShadow: `0 0 12px ${ACCENT.course.glow}`,
                          }}
                        >
                          {(String(item.level || item.levels || 'UG').toUpperCase().includes('PG') ? 'PG' : 'UG')}
                        </span>
                      </div>
                      <p className="mt-2 text-[11px] leading-relaxed text-white/75">
                        Provided by:{' '}
                        <span className="font-black" style={{ color: ACCENT.course.color }}>
                          {getCourseCollege(item)?.name || item.affiliation || 'Study in Bengaluru'}
                        </span>
                      </p>
                      <div
                        className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 border-t pt-3 text-sm"
                        style={{ borderColor: `${ACCENT.course.color}28` }}
                      >
                        <div>
                          <div className="text-[10px] uppercase tracking-[0.16em]" style={{ color: `${ACCENT.course.color}99` }}>From</div>
                          <div className="mt-1 text-sm font-black text-white">{getFeeFrom(item)}</div>
                        </div>
                        <div>
                          <div className="text-[10px] uppercase tracking-[0.16em]" style={{ color: `${ACCENT.course.color}99` }}>Up To</div>
                          <div className="mt-1 text-sm font-black text-white">{getFeeTo(item)}</div>
                        </div>
                        <div>
                          <div className="text-[10px] uppercase tracking-[0.16em]" style={{ color: `${ACCENT.course.color}99` }}>Duration</div>
                          <div className="mt-1 text-sm font-black text-white">{item.duration || 'N/A'}</div>
                        </div>
                        <div>
                          <div className="text-[10px] uppercase tracking-[0.16em]" style={{ color: `${ACCENT.course.color}99` }}>Affiliation</div>
                          <div className="mt-1 text-sm font-black text-white">{item.affiliation || getCourseCollege(item)?.name || item.type || 'N/A'}</div>
                        </div>
                      </div>
                      <div
                        className="mt-4 flex items-center justify-end border-t pt-3"
                        style={{ borderColor: `${ACCENT.course.color}28` }}
                      >
                        <button
                          onClick={() => onNavigate?.(`/details#type=course&id=${item.id}`)}
                          className="inline-flex items-center gap-2 text-xs font-black transition-colors hover:opacity-80"
                          style={{ color: ACCENT.course.colorAlt }}
                        >
                          View Details <ArrowRight size={14} />
                        </button>
                        {getDocumentUrl(item) && (
                          <a
                            href={getDocumentUrl(item)}
                            download
                            target="_blank"
                            rel="noreferrer"
                            className="ml-3 inline-flex items-center gap-2 rounded-full px-3 py-2 text-[9px] font-black uppercase tracking-widest transition-all duration-200 hover:scale-105"
                            style={{
                              border: `1px solid ${ACCENT.course.border}`,
                              background: ACCENT.course.glowDim,
                              color: ACCENT.course.color,
                            }}
                          >
                            <Download size={12} /> Download
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
              {renderPagination(coursePage, coursePages, setCoursePage, ACCENT.course)}
            </div>
          </SectionShell>
        )}

        {/* ── Back button — bottom (university drill-down view only) ── */}
        {universityOnlyView && (
          <div className="mb-10 flex justify-between">
            <BackButton
              onClick={() => onNavigate?.('/services')}
              accent={ACCENT.college}
              label="Back to Universities"
            />
          </div>
        )}

        {/* ── Empty state ── */}
        {Universities.length === 0 && Colleges.length === 0 && Courses.length === 0 && (
          <div
            className="rounded-[3rem] py-24 text-center sm:py-32 md:py-40"
            style={{
              border: '1px solid rgba(179,157,219,0.15)',
              background: 'rgba(179,157,219,0.03)',
            }}
          >
            <Layers className="mx-auto mb-6" size={48} style={{ color: 'rgba(179,157,219,0.20)' }} />
            <p
              className="text-xs font-black uppercase tracking-[0.3em]"
              style={{ color: 'rgba(179,157,219,0.25)' }}
            >
              No data has been published yet.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

// ── College card ──
function CollegeCard({ item, accent, getFeeFrom, getFeeTo, getCardImage, getDocumentUrl, onNavigate }) {
  return (
    <motion.article
      key={item.id}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative overflow-hidden rounded-[1.4rem] backdrop-blur-md transition-all duration-300 hover:-translate-y-1"
      style={{
        border: `1px solid ${accent.border}`,
        background: accent.cardBg,
        boxShadow: `0 16px 48px rgba(0,0,0,0.70), 0 0 28px ${accent.glowDim}`,
      }}
    >
      <div
        className="absolute inset-x-0 top-0 z-10 h-[1px] rounded-t-[1.4rem]"
        style={{ background: `linear-gradient(90deg, transparent, ${accent.sheen}, transparent)` }}
      />

      <div className="relative h-44 overflow-hidden">
        {getCardImage(item) ? (
          <img src={getCardImage(item)} alt={item.name} className="h-full w-full object-cover" />
        ) : (
          <div
            className="h-full w-full"
            style={{ background: `linear-gradient(135deg, ${accent.cardBg}, ${accent.glowDim})` }}
          />
        )}
        {item.rating && (
          <div
            className="absolute right-2 top-2 rounded-full px-3 py-1 text-[10px] font-black backdrop-blur-md"
            style={{
              background: 'rgba(0,0,0,0.55)',
              border: `1px solid ${accent.border}`,
              color: accent.color,
            }}
          >
            {'★'.repeat(Math.min(5, Math.round(Number(item.rating) || 0)))}
          </div>
        )}
      </div>

      <div className="p-4 text-white">
        <h3 className="text-base font-black leading-snug sm:text-lg">{item.name}</h3>
        <div className="mt-1 flex items-center gap-2 text-[10px]" style={{ color: accent.colorAlt }}>
          <MapPin size={10} />
          <span className="truncate">{item.location || 'Location not set'}</span>
        </div>
        <div className="mt-3 border-t pt-3" style={{ borderColor: `${accent.color}28` }}>
          <div className="grid grid-cols-2 gap-3 text-[10px]">
            <div>
              <span style={{ color: `${accent.color}88` }}>Annual Fees From</span>
              <div className="mt-1 font-normal text-white">{getFeeFrom(item)}</div>
            </div>
            <div>
              <span style={{ color: `${accent.color}88` }}>Up To</span>
              <div className="mt-1 font-normal text-white">{getFeeTo(item)}</div>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <button
              onClick={() => onNavigate?.(`/details#type=college&id=${item.id}`)}
              className="text-[10px] font-black uppercase tracking-widest transition-colors hover:opacity-80"
              style={{ color: accent.color }}
            >
              View Details
            </button>
            {getDocumentUrl(item) ? (
              <a
                href={getDocumentUrl(item)}
                download
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 rounded-full px-2.5 py-1.5 text-[9px] font-black uppercase tracking-widest transition-all duration-200 hover:scale-105"
                style={{
                  border: `1px solid ${accent.border}`,
                  background: accent.glowDim,
                  color: accent.color,
                }}
              >
                <Download size={11} /> Doc
              </a>
            ) : (
              <ArrowRight size={14} style={{ color: accent.colorAlt }} />
            )}
          </div>
        </div>
      </div>
    </motion.article>
  )
}