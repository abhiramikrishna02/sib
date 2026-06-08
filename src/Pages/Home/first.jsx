function FirstSection() {
  const rowData = [
    {
      items: ['STUDY ABROAD', 'STUDY ABROAD', 'STUDY ABROAD', 'STUDY ABROAD', 'STUDY ABROAD', 'STUDY ABROAD', 'STUDY ABROAD', 'STUDY ABROAD', 'STUDY ABROAD', 'STUDY ABROAD'],
      bgColor: 'bg-[#00CFFF]',
      textColor: 'text-[#020510] font-black',
      direction: 'animate-[marquee-right_60s_linear_infinite]',
      tilt: '-rotate-1',
    },
    {
      items: ['CAREER GROWTH', 'CAREER GROWTH', 'CAREER GROWTH', 'CAREER GROWTH', 'CAREER GROWTH', 'CAREER GROWTH', 'CAREER GROWTH', 'CAREER GROWTH', 'CAREER GROWTH', 'CAREER GROWTH'],
      bgColor: 'bg-[#0D0D1F]',
      textColor: 'text-[#E040FB] font-black',
      direction: 'animate-[marquee-left_70s_linear_infinite]',
      tilt: 'rotate-1',
    },
    {
      items: ['TOP UNIVERSITIES', 'TOP UNIVERSITIES', 'TOP UNIVERSITIES', 'TOP UNIVERSITIES', 'TOP UNIVERSITIES', 'TOP UNIVERSITIES', 'TOP UNIVERSITIES', 'TOP UNIVERSITIES', 'TOP UNIVERSITIES', 'TOP UNIVERSITIES'],
      bgColor: 'bg-[#00E5A0]',
      textColor: 'text-[#011810] font-black',
      direction: 'animate-[marquee-right_65s_linear_infinite]',
      tilt: '-rotate-2',
    },
    {
      items: ['OPPORTUNITIES', 'OPPORTUNITIES', 'OPPORTUNITIES', 'OPPORTUNITIES', 'OPPORTUNITIES', 'OPPORTUNITIES', 'OPPORTUNITIES', 'OPPORTUNITIES', 'OPPORTUNITIES', 'OPPORTUNITIES'],
      bgColor: 'bg-[#0E0318]',
      textColor: 'text-[#FFB300] font-bold',
      direction: 'animate-[marquee-left_55s_linear_infinite]',
      tilt: 'rotate-2',
    },
    {
      items: ['BENGALURU DREAMS', 'BENGALURU DREAMS', 'BENGALURU DREAMS', 'BENGALURU DREAMS', 'BENGALURU DREAMS', 'BENGALURU DREAMS', 'BENGALURU DREAMS', 'BENGALURU DREAMS', 'BENGALURU DREAMS', 'BENGALURU DREAMS'],
      bgColor: 'bg-[#F06292]',
      textColor: 'text-[#1a0410] font-extrabold',
      direction: 'animate-[marquee-right_75s_linear_infinite]',
      tilt: '-rotate-1',
    },
  ]

  return (
    <section className="relative flex min-h-screen w-full flex-col justify-center overflow-hidden bg-[#020510] py-20 font-sans select-none">
      <style>{`
        @keyframes marquee-left {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0%); }
        }
        .marquee-container {
          display: flex;
          width: max-content;
          will-change: transform;
        }
      `}</style>

      <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100px_100px]" />

      <div className="relative z-10 flex flex-col gap-6 w-full">
        {rowData.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className={`w-full overflow-hidden py-2 ${row.tilt}`}
          >
            <div className={`marquee-container ${row.direction}`}>
              {[...row.items, ...row.items].map((text, index) => (
                <div
                  key={index}
                  className={`mx-3 px-10 py-4 text-2xl md:text-4xl font-extrabold uppercase tracking-wider rounded-none border border-white/5 whitespace-nowrap ${row.bgColor} ${row.textColor}`}
                >
                  {text}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default FirstSection