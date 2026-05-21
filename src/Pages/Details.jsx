import React from 'react'
import { ArrowLeft, MapPin, Star, Phone, Mail, Globe, BookOpen, Building2, Download, Search, GraduationCap } from 'lucide-react'

function getCardImage(item) {
  return item?.image_url || item?.images?.[0] || ''
}

function splitText(value) {
  return String(value || '')
    .split(/,|\n/)
    .map((v) => v.trim())
    .filter(Boolean)
}

function splitFeeRange(value) {
  const text = String(value || '').trim()
  if (!text) return ['', '']
  const parts = text.split(/\s*(?:-|–|—|to)\s*/i).map((part) => part.trim()).filter(Boolean)
  return parts.length >= 2 ? [parts[0], parts.slice(1).join(' - ')] : [text, '']
}

function getFeeFrom(item) {
  const [from] = splitFeeRange(item?.feeRange || item?.fee_range)
  return item?.feeFrom || item?.fee_from || from || 'N/A'
}

function getFeeTo(item) {
  const [, to] = splitFeeRange(item?.feeRange || item?.fee_range)
  return item?.feeTo || item?.fee_to || to || 'N/A'
}

function getFeeRange(item) {
  return item?.feeRange || item?.fee_range || [item?.feeFrom || item?.fee_from, item?.feeTo || item?.fee_to].filter(Boolean).join(' - ') || 'N/A'
}

function DetailRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-violet-300">
        <Icon size={16} />
      </div>
      <div>
        <div className="text-[11px] font-black uppercase tracking-[0.18em] text-violet-200/70">{label}</div>
        <div className="mt-0.5 text-sm font-semibold text-white">{value || 'N/A'}</div>
      </div>
    </div>
  )
}

export default function Details({ onNavigate, globalData, locationHash, dataLoading }) {
  const params = new URLSearchParams(locationHash.replace(/^#/, ''))
  const type = params.get('type')
  const id = params.get('id')

  const university = (globalData?.Universities || []).find((row) => String(row.id) === String(id))
  const college = (globalData?.Colleges || []).find((row) => String(row.id) === String(id))
  const course = (globalData?.Courses || []).find((row) => String(row.id) === String(id))
  const item = type === 'university' ? university : type === 'course' ? course : college
  const courseCollege = type === 'course'
    ? (globalData?.Colleges || []).find((row) => String(row.id) === String(course?.college_id))
    : null
  const linkedUniversity = (globalData?.Universities || []).find((row) => String(row.id) === String((courseCollege || college)?.university_id))

  if (!item && dataLoading) {
    return (
      <div className="min-h-screen bg-[#431f60] px-6 py-32 text-white">
        <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
          <h1 className="text-3xl font-black">Loading details...</h1>
        </div>
      </div>
    )
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-[#431f60] px-6 py-32 text-white">
        <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
          <h1 className="text-3xl font-black">Details not found</h1>
          <button
            onClick={() => onNavigate('/services')}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-xs font-black uppercase tracking-widest text-black"
          >
            <ArrowLeft size={14} /> Back
          </button>
        </div>
      </div>
    )
  }

  const heroTitle = type === 'course' ? item.name : item.name
  const about =
    item.about ||
    (type === 'course'
      ? 'Course information not available.'
      : type === 'university'
        ? 'University information not available.'
        : 'College information not available.')
  const gallery = item.images?.length ? item.images : (getCardImage(item) ? [getCardImage(item)] : [])
  const courses = type === 'university'
    ? (globalData?.Colleges || []).filter((row) => String(row.university_id) === String(item.id))
    : (globalData?.Courses || []).filter((row) => String(row.college_id) === String(item.id))
  const documentUrl = item.document_url || ''
  const linkedColleges = type === 'university'
    ? (globalData?.Colleges || []).filter((row) => String(row.university_id) === String(item.id))
    : []
  const universitySearch = ''
  const typeLabel = type === 'course' ? 'Course' : type === 'university' ? 'University' : 'Affiliated'
  const showHeroMedia = type !== 'course'
  const showGallery = gallery.length > 0 && type !== 'course'
  const providerName = type === 'course'
    ? courseCollege?.name || item.affiliation || 'Study in Bengaluru'
    : linkedUniversity?.name || item.affiliation || 'Study in Bengaluru'
  const displayLocation = type === 'course'
    ? courseCollege?.location || item.location || 'Location not set'
    : item.location || 'Location not set'

  return (
    <div className="min-h-screen bg-[#431f60] px-4 pb-16 pt-44 text-white sm:px-6 md:px-16 md:pt-48">
      <div className="mx-auto max-w-7xl">
        <div className="relative z-[60] mb-10 mt-2 flex items-center justify-start">
          <button
            onClick={() => onNavigate('/services')}
            className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-4 py-2 text-xs font-black uppercase tracking-widest text-white/70 backdrop-blur-md transition-colors hover:bg-white hover:text-black"
          >
            <ArrowLeft size={14} /> Back to Services
          </button>
        </div>

        {type === 'university' && (
          <section className="mb-16 overflow-hidden rounded-[2.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(40,14,61,0.98),rgba(94,57,132,0.82))] shadow-2xl">
            <div className="relative px-4 py-10 sm:px-6 sm:py-12 md:px-10">
              <div className="mb-6 text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-violet-300/80">Top Universities</p>
                <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/55">
                  Discover the best universities to pursue your academic goals.
                </p>
              </div>

              <div className="mx-auto mb-8 max-w-2xl">
                <label className="flex items-center gap-3 rounded-full border border-white/15 bg-white/90 px-4 py-3 text-[#28103d] shadow-lg shadow-black/20">
                  <Search size={18} className="shrink-0 text-[#4b2c73]" />
                  <input
                    readOnly
                    value={universitySearch}
                    placeholder="Search universities"
                    className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-[#4b2c73]/60"
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                {[item].map((uni) => (
                  <div
                    key={uni.id}
                    className="rounded-[1.7rem] bg-[rgba(76,40,108,0.92)] p-4 shadow-xl shadow-black/10 sm:p-5"
                  >
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[96px_minmax(0,1fr)_auto] lg:items-center">
                      <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl bg-white">
                        {getCardImage(uni) ? (
                          <img src={getCardImage(uni)} alt={uni.name} className="h-full w-full object-cover" />
                        ) : (
                          <GraduationCap className="text-violet-500" size={28} />
                        )}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-lg font-black leading-tight text-white sm:text-xl">{uni.name}</h3>
                        <p className="mt-1 line-clamp-4 max-w-[34rem] text-sm leading-relaxed text-white/80">
                          {uni.about || uni.location || 'University information not available.'}
                        </p>
                        <div className="mt-3 flex items-center gap-3 text-[10px] text-white/55">
                          <MapPin size={11} />
                          <span className="truncate">{uni.location || 'Location not set'}</span>
                          {uni.rating && (
                            <span className="rounded-full border border-white/10 bg-black/20 px-2 py-1 text-[9px] font-black uppercase tracking-[0.18em] text-violet-200">
                              {uni.rating}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-start lg:justify-end">
                        <button
                          onClick={() => onNavigate?.(`/services#colleges-${uni.id}`)}
                          className="inline-flex shrink-0 items-center justify-center rounded-full bg-violet-500 px-5 py-3 text-[11px] font-black uppercase tracking-widest text-white transition-colors hover:bg-white hover:text-black"
                        >
                          View Colleges
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <div className="relative z-10 rounded-[2.25rem] border border-white/10 bg-[#1a0b2e] p-4 shadow-2xl shadow-black/20 sm:p-5 md:p-6">
          <div className={`grid gap-5 ${showHeroMedia ? 'lg:grid-cols-[320px_1fr]' : 'lg:grid-cols-1'}`}>
            {showHeroMedia && (
              <div className="overflow-hidden rounded-[1.1rem] border border-white/10 bg-white/5">
                {getCardImage(item) ? (
                  <img src={getCardImage(item)} alt={heroTitle} className="h-[260px] w-full object-cover" />
                ) : (
                  <div className="flex h-[260px] items-center justify-center bg-[linear-gradient(135deg,#7a5da0,#b58fdc)]">
                    <Building2 size={44} className="text-white/80" />
                  </div>
                )}
              </div>
            )}

            <div className={`flex flex-col justify-between gap-5 ${showHeroMedia ? '' : 'lg:pt-2'}`}>
              <div>
                <h1 className="text-[clamp(2rem,5vw,3rem)] font-black leading-tight text-white">
                  {heroTitle}
                </h1>

                <div className="mt-3 flex flex-wrap items-center gap-3">
                  {item.rating && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#3f2a77] px-3 py-1 text-[10px] font-black text-yellow-300">
                      <Star size={12} fill="currentColor" /> {item.rating}
                    </span>
                  )}
                  <span className="rounded-full bg-[#2c4ea0] px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white">
                    {typeLabel}
                  </span>
                </div>

                <div className="mt-4 flex items-start gap-2 text-white/85">
                  <MapPin size={16} className="mt-0.5 shrink-0 text-white/70" />
                  <p className="text-sm font-semibold leading-relaxed">{displayLocation}</p>
                </div>
                {type === 'course' && (
                  <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80">
                    Offered by <span className="font-black text-white">{providerName}</span>
                    {linkedUniversity?.name && <span className="text-white/55"> under {linkedUniversity.name}</span>}
                  </div>
                )}

                {type !== 'course' && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {splitText(item.type || item.levels || linkedUniversity?.name || 'Engineering').map((tag, idx) => (
                      <span key={`${tag}-${idx}`} className="rounded-full bg-white/15 px-3 py-1 text-[10px] font-black text-white/80">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="text-base font-black text-white">Annual Fee Range</div>
                <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-end">
                  <div>
                    <div className="text-[11px] font-medium text-white/65">Starting from</div>
                    <div className="mt-1 text-2xl font-black text-white">{getFeeFrom(item)}</div>
                  </div>
                  <div className="hidden h-10 w-px bg-white/15 sm:block" />
                  <div>
                    <div className="text-[11px] font-medium text-white/65">Up to</div>
                    <div className="mt-1 text-2xl font-black text-white">{getFeeTo(item)}</div>
                  </div>
                </div>
              </div>
              {documentUrl && (
                <a
                  href={documentUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-widest text-white/80 transition-colors hover:bg-white hover:text-black"
                >
                    <Download size={14} /> Download {item.document_name || 'Document'}
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="space-y-6">
            <section className="rounded-[1.5rem] border border-white/10 bg-[#1a0b2e] p-5 sm:p-6">
              <h2 className="text-2xl font-black text-white">
                {type === 'university' ? 'About the University' : type === 'course' ? 'About the Course' : 'About the College'}
              </h2>
              <div className="mt-3 h-px bg-white/10" />
              <p className="mt-4 text-sm leading-relaxed text-white/75">
                {about}
              </p>
            </section>

            {showGallery && (
              <section className="rounded-[1.5rem] border border-white/10 bg-[#1a0b2e] p-5 sm:p-6">
                <h2 className="text-2xl font-black text-white">
                  {type === 'university' ? 'University Gallery' : 'Campus Gallery'}
                </h2>
                <div className="mt-3 h-px bg-white/10" />
                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {gallery.slice(0, 3).map((img, idx) => (
                    <div key={idx} className="overflow-hidden rounded-xl border border-white/10 bg-white/5">
                      <img src={img} alt={`${heroTitle} gallery ${idx + 1}`} className="h-44 w-full object-cover" />
                    </div>
                  ))}
                </div>
              </section>
            )}

            <section className="rounded-[1.5rem] border border-white/10 bg-[#1a0b2e] p-5 sm:p-6">
              <h2 className="text-2xl font-black text-white">
                {type === 'university' ? 'Available Colleges' : 'Available Courses'}
              </h2>
              <div className="mt-3 h-px bg-white/10" />
              <div className="mt-5 space-y-4">
                {courses.length > 0 ? courses.slice(0, 6).map((row) => (
                  <div key={row.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-lg font-black text-white">{row.name}</div>
                        <div className="mt-1 text-sm text-white/60">
                          {type === 'university'
                            ? row.location || 'College'
                            : row.degree || row.level || row.levels || 'Course'}
                        </div>
                      </div>
                      <span className="rounded-full bg-[#dfffd8] px-3 py-1 text-[10px] font-black uppercase text-[#1b6b2a]">
                        {type === 'university'
                          ? 'College'
                          : String(row.level || row.levels || 'UG').toUpperCase().includes('PG')
                            ? 'PG'
                            : 'UG'}
                      </span>
                    </div>
                    <div className="mt-3 text-sm text-white/70">
                      Fees: <span className="font-black text-white">{getFeeRange(row)}</span>
                    </div>
                  </div>
                )) : (
                  <p className="text-sm italic text-white/45">
                    {type === 'university' ? 'colleges are updating....' : 'courses are updating....'}
                  </p>
                )}
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <section className="rounded-[1.5rem] border border-white/10 bg-[#1a0b2e] p-5 sm:p-6">
              <h2 className="text-2xl font-black text-white">Quick Facts</h2>
              <div className="mt-3 h-px bg-white/10" />
              <div className="mt-5 space-y-4">
                <DetailRow
                  icon={Building2}
                  label={type === 'course' ? 'College' : type === 'university' ? 'University Type' : 'Institution Type'}
                  value={type === 'course' ? providerName : item.type || linkedUniversity?.name || 'Affiliated College'}
                />
                <DetailRow
                  icon={BookOpen}
                  label={type === 'university' ? 'Affiliated Colleges' : 'Course Levels'}
                  value={type === 'university' ? String(linkedColleges.length) : item.levels || item.level || 'UG, PG'}
                />
              </div>
            </section>

            <section className="rounded-[1.5rem] border border-white/10 bg-[#1a0b2e] p-5 sm:p-6">
              <h2 className="text-2xl font-black text-white">Contact Information</h2>
              <div className="mt-3 h-px bg-white/10" />
              <div className="mt-5 space-y-4">
                <DetailRow icon={Phone} label="Phone" value={item.phone || 'N/A'} />
                <DetailRow icon={Mail} label="Email" value={item.email || 'N/A'} />
                <DetailRow icon={Globe} label="Address" value={item.address || 'N/A'} />
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
