import { useEffect, useMemo, useRef, useState } from 'react'

const parseVariationSettings = (variationString) => {
  const settings = { wght: 400, opsz: 14 }
  const regex = /'?(wght|opsz)'?\s*([0-9]+(?:\.[0-9]+)?)/g
  let match
  while ((match = regex.exec(variationString))) {
    settings[match[1]] = Number(match[2])
  }
  return settings
}

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)
const lerp = (from, to, t) => from + (to - from) * t

function VariableProximity({
  label,
  fromFontVariationSettings = "'wght' 400, 'opsz' 9",
  toFontVariationSettings = "'wght' 900, 'opsz' 40",
  containerRef,
  radius = 120,
  falloff = 'gaussian',
  className = '',
  style = {},
}) {
  const wrapperRef = useRef(null)
  const [variation, setVariation] = useState(fromFontVariationSettings)

  const fromSettings = useMemo(() => parseVariationSettings(fromFontVariationSettings), [fromFontVariationSettings])
  const toSettings = useMemo(() => parseVariationSettings(toFontVariationSettings), [toFontVariationSettings])

  useEffect(() => {
    setVariation(fromFontVariationSettings)
  }, [fromFontVariationSettings])

  const getStrength = (distance, maxDistance) => {
    const normalized = clamp(distance / maxDistance, 0, 1)
    if (falloff === 'gaussian') {
      return Math.exp(-Math.pow(normalized, 2) * 2)
    }
    return 1 - normalized
  }

  const updateVariation = (event) => {
    const node = containerRef?.current ?? wrapperRef.current
    if (!node) return

    const rect = node.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const dx = event.clientX - centerX
    const dy = event.clientY - centerY
    const distance = Math.sqrt(dx * dx + dy * dy)
    const strength = getStrength(distance, radius)

    const wght = Math.round(lerp(toSettings.wght, fromSettings.wght, 1 - strength))
    const opsz = Math.round(lerp(toSettings.opsz, fromSettings.opsz, 1 - strength))

    setVariation(`'wght' ${wght}, 'opsz' ${opsz}`)
  }

  const resetVariation = () => {
    setVariation(fromFontVariationSettings)
  }

  return (
    <span
      ref={wrapperRef}
      className={className}
      style={{
        ...style,
        fontFamily: '"Roboto Flex", ui-sans-serif, system-ui, sans-serif',
        fontVariationSettings: variation,
        transition: 'font-variation-settings 0.16s ease-out, color 0.18s ease',
      }}
      onPointerMove={updateVariation}
      onPointerLeave={resetVariation}
    >
      {label}
    </span>
  )
}

export default VariableProximity
