// import { useEffect, useRef } from 'react'
// import { gsap } from 'gsap'
// import { CalendarDays, CheckCircle2, FileText, Mail, Phone, Sparkles } from 'lucide-react'

// export default function Apply() {
//   const sectionRef = useRef(null)

//   useEffect(() => {
//     const ctx = gsap.context(() => {
//       gsap.from('.apply-reveal', {
//         y: 30,
//         opacity: 0,
//         stagger: 0.08,
//         duration: 0.8,
//         ease: 'power3.out',
//       })
//     }, sectionRef)

//     return () => ctx.revert()
//   }, [])

//   return (
//     <main ref={sectionRef} className="relative min-h-screen overflow-hidden bg-[#05010a] px-4 py-24 text-white sm:px-6 lg:px-8">
//       <div className="pointer-events-none absolute inset-0">
//         <div className="absolute left-[-10%] top-[-10%] h-[28rem] w-[28rem] rounded-full bg-fuchsia-600/15 blur-[140px]" />
//         <div className="absolute bottom-[-10%] right-[-10%] h-[30rem] w-[30rem] rounded-full bg-cyan-500/10 blur-[160px]" />
//       </div>

//       <div className="relative mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
//         <section className="apply-reveal rounded-[2.5rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-2xl sm:p-8 lg:p-10">
//           <div className="inline-flex items-center gap-2 rounded-full border border-fuchsia-500/20 bg-fuchsia-500/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.4em] text-fuchsia-300">
//             <Sparkles className="h-4 w-4" />
//             Apply Nowikiio
//           </div>

//           <h1 className="mt-6 text-[clamp(2.8rem,8vw,5.8rem)] font-black uppercase leading-[0.92] tracking-tighter">
//             Start your
//             <span className="block bg-gradient-to-r from-fuchsia-400 via-white to-cyan-300 bg-clip-text text-transparent">
//               application
//             </span>
//           </h1>

//           <p className="mt-5 max-w-2xl text-base leading-7 text-white/65 sm:text-lg">
//             Apply to StudyInBengaluru and let us help you find the right college, course, and admission path.
//             Share your details below and our team will get in touch.
//           </p>

//           <form className="mt-8 grid gap-4 sm:grid-cols-2">
//             <label className="grid gap-2 sm:col-span-1">
//               <span className="text-xs font-bold uppercase tracking-[0.28em] text-white/45">Full Name</span>
//               <input
//                 type="text"
//                 placeholder="Your name"
//                 className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white placeholder:text-white/25 outline-none transition focus:border-fuchsia-500/60"
//               />
//             </label>
//             <label className="grid gap-2 sm:col-span-1">
//               <span className="text-xs font-bold uppercase tracking-[0.28em] text-white/45">Email</span>
//               <input
//                 type="email"
//                 placeholder="you@example.com"
//                 className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white placeholder:text-white/25 outline-none transition focus:border-fuchsia-500/60"
//               />
//             </label>
//             <label className="grid gap-2 sm:col-span-1">
//               <span className="text-xs font-bold uppercase tracking-[0.28em] text-white/45">Phone</span>
//               <input
//                 type="tel"
//                 placeholder="+91 ..."
//                 className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white placeholder:text-white/25 outline-none transition focus:border-fuchsia-500/60"
//               />
//             </label>
//             <label className="grid gap-2 sm:col-span-1">
//               <span className="text-xs font-bold uppercase tracking-[0.28em] text-white/45">Course Interest</span>
//               <input
//                 type="text"
//                 placeholder="Engineering, MBA, etc."
//                 className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white placeholder:text-white/25 outline-none transition focus:border-fuchsia-500/60"
//               />
//             </label>
//             <label className="grid gap-2 sm:col-span-2">
//               <span className="text-xs font-bold uppercase tracking-[0.28em] text-white/45">Your goals</span>
//               <textarea
//                 rows="5"
//                 placeholder="Tell us what you're aiming for..."
//                 className="rounded-[1.5rem] border border-white/10 bg-black/20 px-4 py-3 text-white placeholder:text-white/25 outline-none transition focus:border-fuchsia-500/60"
//               />
//             </label>

//             <button
//               type="submit"
//               className="sm:col-span-2 inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-fuchsia-500 to-violet-600 px-6 py-4 text-sm font-black uppercase tracking-[0.25em] text-white transition hover:scale-[1.01]"
//             >
//               Submit Application
//             </button>
//           </form>
//         </section>

//         <aside className="apply-reveal grid gap-4">
//           <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-2xl">
//             <div className="mb-4 flex items-center gap-3">
//               <div className="rounded-2xl bg-cyan-500/10 p-3 text-cyan-300">
//                 <CheckCircle2 className="h-6 w-6" />
//               </div>
//               <h2 className="text-xl font-black uppercase tracking-tight">What Happens Next</h2>
//             </div>
//             <ul className="space-y-3 text-sm leading-6 text-white/65">
//               <li className="flex gap-3"><span className="mt-1 h-2 w-2 rounded-full bg-fuchsia-400" />We review your application details.</li>
//               <li className="flex gap-3"><span className="mt-1 h-2 w-2 rounded-full bg-fuchsia-400" />Our team contacts you with options.</li>
//               <li className="flex gap-3"><span className="mt-1 h-2 w-2 rounded-full bg-fuchsia-400" />We help you move toward admission.</li>
//             </ul>
//           </div>

//           <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
//             <div className="rounded-[2rem] border border-white/10 bg-[#120a1d] p-5">
//               <div className="mb-3 flex items-center gap-3 text-fuchsia-300">
//                 <Phone className="h-5 w-5" />
//                 <span className="text-xs font-bold uppercase tracking-[0.28em]">Call</span>
//               </div>
//               <p className="text-sm text-white/70">+91 99469 53953</p>
//             </div>
//             <div className="rounded-[2rem] border border-white/10 bg-[#120a1d] p-5">
//               <div className="mb-3 flex items-center gap-3 text-cyan-300">
//                 <Mail className="h-5 w-5" />
//                 <span className="text-xs font-bold uppercase tracking-[0.28em]">Email</span>
//               </div>
//               <p className="text-sm text-white/70">admissions@studyinbengaluru.com</p>
//             </div>
//           </div>

//           <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-fuchsia-500/15 to-cyan-500/10 p-6 backdrop-blur-2xl">
//             <div className="mb-4 flex items-center gap-3">
//               <CalendarDays className="h-5 w-5 text-fuchsia-300" />
//               <h3 className="text-lg font-black uppercase tracking-tight">Fast Track</h3>
//             </div>
//             <p className="text-sm leading-6 text-white/70">
//               Submit now and we&apos;ll guide you through the next step with a personal admission plan.
//             </p>
//             <div className="mt-6 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.3em] text-white/45">
//               <FileText className="h-4 w-4" />
//               Simple and direct
//             </div>
//           </div>
//         </aside>
//       </div>
//     </main>
//   )
// }
