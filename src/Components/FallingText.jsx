import { useEffect, useMemo, useRef, useState } from 'react'
import Matter from 'matter-js'

const FallingText = ({
  text = '',
  highlightWords = [],
  highlightClass = 'text-white font-bold',
  trigger = 'auto',
  backgroundColor = 'transparent',
  wireframes = false,
  gravity = 1,
  mouseConstraintStiffness = 0.2,
  fontSize = '1rem',
  lineHeight = 1.18,
  play = false,
  wordSpacing = '2px',
  className = '',
  textClassName = '',
  observerOptions = { threshold: 0.35 },
}) => {
  const containerRef = useRef(null)
  const textRef = useRef(null)
  const canvasContainerRef = useRef(null)
  const frameRef = useRef(null)
  const [effectStarted, setEffectStarted] = useState(trigger === 'auto' || play)

  const words = useMemo(() => text.trim().split(/\s+/).filter(Boolean), [text])

  useEffect(() => {
    if (trigger === 'auto') return undefined

    if (play && !effectStarted) {
      const frameId = requestAnimationFrame(() => {
        setEffectStarted(true)
      })
      return () => cancelAnimationFrame(frameId)
    }

    if (!play && effectStarted) {
      setEffectStarted(false)
    }

    return undefined
  }, [effectStarted, play, trigger])

  useEffect(() => {
    const node = containerRef.current
    if (trigger !== 'scroll' || !node) return undefined

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setEffectStarted(true)
        observer.disconnect()
      }
    }, observerOptions)

    observer.observe(node)
    return () => observer.disconnect()
  }, [observerOptions, trigger])

  useEffect(() => {
    if (!effectStarted || !containerRef.current || !textRef.current || !canvasContainerRef.current)
      return undefined

    const { Engine, Render, World, Bodies, Runner, Mouse, MouseConstraint, Body } = Matter

    const container = containerRef.current
    const textNode = textRef.current
    const canvasNode = canvasContainerRef.current
    const containerRect = container.getBoundingClientRect()
    const width = containerRect.width
    const height = containerRect.height

    if (width <= 0 || height <= 0) return undefined

    const engine = Engine.create()
    engine.world.gravity.y = gravity

    const render = Render.create({
      element: canvasNode,
      engine,
      options: {
        width,
        height,
        background: backgroundColor,
        wireframes,
        pixelRatio: window.devicePixelRatio || 1,
      },
    })

    render.canvas.style.pointerEvents = 'none'
    render.canvas.style.position = 'absolute'
    render.canvas.style.inset = '0'

    const boundaryOptions = {
      isStatic: true,
      render: { fillStyle: 'transparent' },
    }

    const floor = Bodies.rectangle(width / 2, height + 26, width, 52, boundaryOptions)
    const leftWall = Bodies.rectangle(-26, height / 2, 52, height, boundaryOptions)
    const rightWall = Bodies.rectangle(width + 26, height / 2, 52, height, boundaryOptions)
    const ceiling = Bodies.rectangle(width / 2, -26, width, 52, boundaryOptions)

    const wordSpans = Array.from(textNode.querySelectorAll('[data-falling-word]'))
    const wordBodies = wordSpans.map((elem) => {
      const rect = elem.getBoundingClientRect()
      const x = rect.left - containerRect.left + rect.width / 2
      const y = rect.top - containerRect.top + rect.height / 2
      const body = Bodies.rectangle(x, y, rect.width, rect.height, {
        render: { fillStyle: 'transparent' },
        restitution: 0.78,
        frictionAir: 0.014,
        friction: 0.18,
      })

      Body.setVelocity(body, {
        x: (Math.random() - 0.5) * 4.8,
        y: Math.random() * 1.5,
      })
      Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.08)

      elem.style.position = 'absolute'
      elem.style.left = `${x}px`
      elem.style.top = `${y}px`
      elem.style.margin = '0'
      elem.style.transform = 'translate(-50%, -50%)'
      elem.style.willChange = 'transform, left, top'

      return { elem, body }
    })

    const mouse = Mouse.create(container)
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse,
      constraint: {
        stiffness: mouseConstraintStiffness,
        render: { visible: false },
      },
    })
    render.mouse = mouse

    World.add(engine.world, [
      floor,
      leftWall,
      rightWall,
      ceiling,
      mouseConstraint,
      ...wordBodies.map(({ body }) => body),
    ])

    const runner = Runner.create()
    Runner.run(runner, engine)
    Render.run(render)

    const updateWords = () => {
      wordBodies.forEach(({ body, elem }) => {
        elem.style.left = `${body.position.x}px`
        elem.style.top = `${body.position.y}px`
        elem.style.transform = `translate(-50%, -50%) rotate(${body.angle}rad)`
      })
      frameRef.current = requestAnimationFrame(updateWords)
    }

    frameRef.current = requestAnimationFrame(updateWords)

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
      Render.stop(render)
      Runner.stop(runner)
      if (render.canvas?.parentNode) {
        render.canvas.parentNode.removeChild(render.canvas)
      }
      World.clear(engine.world, false)
      Engine.clear(engine)
      render.textures = {}
    }
  }, [backgroundColor, effectStarted, gravity, mouseConstraintStiffness, wireframes])

  const handleTrigger = () => {
    if (!effectStarted && (trigger === 'click' || trigger === 'hover')) {
      setEffectStarted(true)
    }
  }

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden ${className}`}
      onClick={trigger === 'click' ? handleTrigger : undefined}
      onMouseEnter={trigger === 'hover' ? handleTrigger : undefined}
    >
      <div
        ref={textRef}
        className={`relative z-10 inline-block w-full ${textClassName}`}
        style={{ fontSize, lineHeight }}
      >
        {words.map((word, index) => {
          const isHighlighted = highlightWords.some((highlight) =>
            word.toLowerCase().startsWith(highlight.toLowerCase())
          )
          return (
            <span
              key={`${word}-${index}`}
              data-falling-word
              className={`inline-block select-none ${isHighlighted ? highlightClass : ''}`}
              style={{ marginInline: wordSpacing }}
            >
              {word}
            </span>
          )
        })}
      </div>
      <div ref={canvasContainerRef} className="pointer-events-none absolute inset-0 z-0" />
    </div>
  )
}

export default FallingText