import { useEffect, useId, useMemo, useRef, useState } from 'react'

const CurvedLoop = ({
  marqueeText = '',
  speed = 2,
  className,
  svgClassName,
  curveAmount = 400,
  direction = 'left',
  interactive = true,
}) => {
  const text = useMemo(() => {
    const hasTrailing = /\s|\u00A0$/.test(marqueeText)
    return `${hasTrailing ? marqueeText.replace(/\s+$/, '') : marqueeText}\u00A0`
  }, [marqueeText])

  const measureRef = useRef(null)
  const textPathRef = useRef(null)
  const [spacing, setSpacing] = useState(0)
  const [offset, setOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const uid = useId()
  const pathId = `curve-${uid}`
  const pathD = `M-100,40 Q500,${40 + curveAmount} 1540,40`

  const dragRef = useRef(false)
  const lastXRef = useRef(0)
  const dirRef = useRef(direction)
  const velRef = useRef(0)

  const totalText = spacing
    ? Array(Math.ceil(1800 / spacing) + 2).fill(text).join('')
    : text
  const ready = spacing > 0

  useEffect(() => {
    if (measureRef.current) {
      setSpacing(measureRef.current.getComputedTextLength())
    }
  }, [className, text])

  useEffect(() => {
    if (!spacing || !textPathRef.current) return
    const initial = -spacing
    textPathRef.current.setAttribute('startOffset', `${initial}px`)
    setOffset(initial)
  }, [spacing])

  useEffect(() => {
    if (!spacing || !ready) return undefined

    let frame = 0
    const step = () => {
      if (!dragRef.current && textPathRef.current) {
        const delta = dirRef.current === 'right' ? speed : -speed
        const currentOffset = parseFloat(textPathRef.current.getAttribute('startOffset') || '0')
        let newOffset = currentOffset + delta

        if (newOffset <= -spacing) newOffset += spacing
        if (newOffset > 0) newOffset -= spacing

        textPathRef.current.setAttribute('startOffset', `${newOffset}px`)
        setOffset(newOffset)
      }
      frame = requestAnimationFrame(step)
    }

    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [ready, spacing, speed])

  const onPointerDown = (event) => {
    if (!interactive) return
    dragRef.current = true
    setIsDragging(true)
    lastXRef.current = event.clientX
    velRef.current = 0
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const onPointerMove = (event) => {
    if (!interactive || !dragRef.current || !textPathRef.current) return

    const dx = event.clientX - lastXRef.current
    lastXRef.current = event.clientX
    velRef.current = dx

    const currentOffset = parseFloat(textPathRef.current.getAttribute('startOffset') || '0')
    let newOffset = currentOffset + dx

    if (newOffset <= -spacing) newOffset += spacing
    if (newOffset > 0) newOffset -= spacing

    textPathRef.current.setAttribute('startOffset', `${newOffset}px`)
    setOffset(newOffset)
  }

  const endDrag = () => {
    if (!interactive) return
    dragRef.current = false
    setIsDragging(false)
    dirRef.current = velRef.current > 0 ? 'right' : 'left'
  }

  return (
    <div
      className="flex w-full items-center justify-center"
      style={{ visibility: ready ? 'visible' : 'hidden', cursor: interactive ? (isDragging ? 'grabbing' : 'grab') : 'auto' }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerLeave={endDrag}
    >
      <svg
        className={`block aspect-[100/12] w-full select-none overflow-visible text-[clamp(2.2rem,7vw,6rem)] font-black uppercase leading-none ${svgClassName ?? ''}`}
        viewBox="0 0 1440 120"
      >
        <text ref={measureRef} xmlSpace="preserve" style={{ visibility: 'hidden', opacity: 0, pointerEvents: 'none' }}>
          {text}
        </text>
        <defs>
          <path id={pathId} d={pathD} fill="none" stroke="transparent" />
        </defs>
        {ready && (
          <text xmlSpace="preserve" className={`fill-white ${className ?? ''}`}>
            <textPath ref={textPathRef} href={`#${pathId}`} startOffset={`${offset}px`} xmlSpace="preserve">
              {totalText}
            </textPath>
          </text>
        )}
      </svg>
    </div>
  )
}

export default CurvedLoop
