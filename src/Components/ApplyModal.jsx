import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'

const states = ['Karnataka', 'Tamil Nadu', 'Kerala', 'Telangana', 'Maharashtra', 'Other']
const districts = ['Bengaluru Urban', 'Mysuru', 'Mangaluru', 'Hubballi-Dharwad', 'Belagavi', 'Other']

export default function ApplyModal({ open, onClose }) {
  useEffect(() => {
    if (!open) return undefined

    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose?.()
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center px-3 py-4 sm:px-4 sm:py-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.button
            aria-label="Close apply form"
            className="absolute inset-0 cursor-default bg-black/70 backdrop-blur-md"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="apply-modal-title"
            initial={{ opacity: 0, scale: 0.96, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 18 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="relative z-10 w-full max-w-4xl overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#32104f] text-white shadow-[0_30px_80px_rgba(0,0,0,0.6)] sm:rounded-[2rem]"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent_42%)]" />

            <div className="relative p-4 sm:p-5 md:p-8">
              <div className="mb-5 flex items-start justify-between gap-4 sm:mb-6">
                <div className="w-full text-center">
                  <h2
                    id="apply-modal-title"
                    className="text-[clamp(1.8rem,4vw,2.8rem)] font-serif italic font-semibold text-violet-200"
                  >
                    Apply Now
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full border border-white/10 bg-white/5 p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
                  aria-label="Close modal"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-sm font-semibold text-white/90">Name</span>
                  <input
                    type="text"
                    className="h-11 rounded-lg border border-white/35 bg-transparent px-3 text-white outline-none placeholder:text-white/30 focus:border-violet-200/80 sm:h-12"
                    placeholder=""
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-semibold text-white/90">Phone Number</span>
                  <input
                    type="tel"
                    className="h-11 rounded-lg border border-white/35 bg-transparent px-3 text-white outline-none placeholder:text-white/30 focus:border-violet-200/80 sm:h-12"
                    placeholder=""
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-semibold text-white/90">Email</span>
                  <input
                    type="email"
                    className="h-11 rounded-lg border border-white/35 bg-transparent px-3 text-white outline-none placeholder:text-white/30 focus:border-violet-200/80 sm:h-12"
                    placeholder=""
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-semibold text-white/90">State</span>
                  <select className="h-11 rounded-lg border border-white/35 bg-transparent px-3 text-white outline-none focus:border-violet-200/80 sm:h-12">
                    <option value="" className="bg-[#32104f]">Select state</option>
                    {states.map((state) => (
                      <option key={state} value={state} className="bg-[#32104f]">
                        {state}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-semibold text-white/90">Interested Course</span>
                  <input
                    type="text"
                    className="h-11 rounded-lg border border-white/35 bg-transparent px-3 text-white outline-none placeholder:text-white/30 focus:border-violet-200/80 sm:h-12"
                    placeholder=""
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-semibold text-white/90">District</span>
                  <select className="h-11 rounded-lg border border-white/35 bg-transparent px-3 text-white outline-none focus:border-violet-200/80 sm:h-12">
                    <option value="" className="bg-[#32104f]">Select district</option>
                    {districts.map((district) => (
                      <option key={district} value={district} className="bg-[#32104f]">
                        {district}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="grid gap-2 md:col-span-1">
                  <span className="text-sm font-semibold text-white/90">Interested College</span>
                  <input
                    type="text"
                    className="h-11 rounded-lg border border-white/35 bg-transparent px-3 text-white outline-none placeholder:text-white/30 focus:border-violet-200/80 sm:h-12"
                    placeholder=""
                  />
                </label>

                <div className="mt-2 flex flex-col gap-3 md:col-span-2 md:flex-row md:items-center md:justify-between">
                  <button
                    type="submit"
                    className="w-full rounded-lg bg-[#7c3aed] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#8b5cf6] md:w-auto"
                  >
                    Submit
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="text-sm text-white/50 transition hover:text-white/80 md:self-center"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

