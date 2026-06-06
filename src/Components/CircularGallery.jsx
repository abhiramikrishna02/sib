import { Camera, Mesh, Plane, Program, Renderer, Texture, Transform } from 'ogl'
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'

function debounce(func, wait) {
  let timeout
  return function (...args) {
    clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(this, args), wait)
  }
}

function lerp(p1, p2, t) {
  return p1 + (p2 - p1) * t
}

function roundedRect(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2)
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + width, y, x + width, y + height, r)
  ctx.arcTo(x + width, y + height, x, y + height, r)
  ctx.arcTo(x, y + height, x, y, r)
  ctx.arcTo(x, y, x + width, y, r)
  ctx.closePath()
}

function wrapText(ctx, text, maxWidth) {
  const words = text.split(' ')
  const lines = []
  let line = ''
  words.forEach((word) => {
    const test = line ? `${line} ${word}` : word
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line)
      line = word
    } else {
      line = test
    }
  })
  if (line) lines.push(line)
  return lines
}

function createCardTexture(gl, item, index) {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  const width  = 900
  const height = 1120
  const ratio  = Math.min(window.devicePixelRatio || 1, 2)

  canvas.width  = width  * ratio
  canvas.height = height * ratio
  canvas.style.width  = `${width}px`
  canvas.style.height = `${height}px`
  ctx.scale(ratio, ratio)

  // ── Fill canvas solid white (outside card area) ──
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, width, height)

  // ── Glossy black card face ──
  roundedRect(ctx, 20, 20, width - 40, height - 40, 72)
  // Base glossy black gradient
  const baseGrad = ctx.createLinearGradient(20, 20, 20, height - 20)
  baseGrad.addColorStop(0,   '#2a2a2a')
  baseGrad.addColorStop(0.3, '#111111')
  baseGrad.addColorStop(1,   '#050505')
  ctx.fillStyle = baseGrad
  ctx.fill()

  // ── Clip to card ──
  ctx.save()
  roundedRect(ctx, 20, 20, width - 40, height - 40, 72)
  ctx.clip()

  // Glossy sheen — bright highlight sweeping top-left to center
  const sheenGrad = ctx.createLinearGradient(20, 20, width * 0.65, height * 0.45)
  sheenGrad.addColorStop(0,    'rgba(255,255,255,0.13)')
  sheenGrad.addColorStop(0.35, 'rgba(255,255,255,0.06)')
  sheenGrad.addColorStop(1,    'rgba(255,255,255,0.00)')
  ctx.fillStyle = sheenGrad
  ctx.fillRect(20, 20, width - 40, height - 40)

  // Specular top-edge strip (thin bright line at very top — glass look)
  const specGrad = ctx.createLinearGradient(20, 20, 20, 20 + 80)
  specGrad.addColorStop(0,   'rgba(255,255,255,0.22)')
  specGrad.addColorStop(0.5, 'rgba(255,255,255,0.06)')
  specGrad.addColorStop(1,   'rgba(255,255,255,0.00)')
  ctx.fillStyle = specGrad
  ctx.fillRect(20, 20, width - 40, 80)

  // Decorative arc top-right
  ctx.strokeStyle = 'rgba(255,255,255,0.10)'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.arc(width - 96, 112, 190, Math.PI * 0.55, Math.PI * 1.38)
  ctx.stroke()

  ctx.restore()

  // ── Card border — subtle bright rim for glossy glass edge ──
  roundedRect(ctx, 20, 20, width - 40, height - 40, 72)
  const rimGrad = ctx.createLinearGradient(20, 20, width - 20, height - 20)
  rimGrad.addColorStop(0,   'rgba(255,255,255,0.35)')
  rimGrad.addColorStop(0.5, 'rgba(255,255,255,0.10)')
  rimGrad.addColorStop(1,   'rgba(255,255,255,0.20)')
  ctx.strokeStyle = rimGrad
  ctx.lineWidth = 2
  ctx.stroke()

  // ── Code badge ──
  roundedRect(ctx, 70, 70, 176, 176, 44)
  ctx.fillStyle = 'rgba(255,255,255,0.10)'
  ctx.fill()
  ctx.strokeStyle = 'rgba(255,255,255,0.22)'
  ctx.lineWidth = 2
  ctx.stroke()

  ctx.fillStyle = '#ffffff'
  ctx.font = '900 78px Arial Black, Arial, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(item.code || String(index + 1).padStart(2, '0'), 158, 158)

  // ── Subtitle ──
  ctx.textAlign = 'left'
  ctx.fillStyle = 'rgba(255,255,255,0.42)'
  ctx.font = '700 28px Arial, sans-serif'
  ctx.letterSpacing = '7px'
  ctx.fillText((item.subtitle || 'GLOBAL ACCESS').toUpperCase(), 70, 326)
  ctx.letterSpacing = '0px'

  // ── Title ──
  ctx.fillStyle = '#ffffff'
  ctx.font = '900 82px Arial Black, Arial, sans-serif'
  const titleLines = wrapText(ctx, item.text || item.title || '', 720).slice(0, 3)
  titleLines.forEach((line, i) => {
    ctx.fillText(line.toUpperCase(), 70, 416 + i * 98)
  })

  // ── Body note ──
  ctx.fillStyle = 'rgba(255,255,255,0.52)'
  ctx.font = '400 30px Arial, sans-serif'
  const noteY = 416 + titleLines.length * 98 + 48
  const bodyLines = wrapText(
    ctx,
    item.note || 'Explore trusted academic pathways and student-first support.',
    730
  ).slice(0, 3)
  bodyLines.forEach((line, i) => {
    ctx.fillText(line, 70, noteY + i * 46)
  })

  // ── Divider ──
  const divY = noteY + bodyLines.length * 46 + 44
  ctx.strokeStyle = 'rgba(255,255,255,0.18)'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(70, divY)
  ctx.lineTo(780, divY)
  ctx.stroke()

  // ── CTA pill ──
  const ctaY = divY + 36
  roundedRect(ctx, 70, ctaY, 300, 64, 32)
  ctx.fillStyle = '#ffffff'
  ctx.fill()
  ctx.fillStyle = '#000000'
  ctx.font = '800 22px Arial, sans-serif'
  ctx.letterSpacing = '2px'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'middle'
  ctx.fillText(item.path ? 'OPEN DETAILS' : 'EXPLORE', 104, ctaY + 32)
  ctx.letterSpacing = '0px'

  // ── Arrow ──
  ctx.fillStyle = '#ffffff'
  ctx.font = '900 60px Arial, sans-serif'
  ctx.textAlign = 'right'
  ctx.textBaseline = 'middle'
  ctx.fillText('→', 800, ctaY + 32)

  const texture = new Texture(gl, {
    generateMipmaps: false,
    premultiplyAlpha: false,
  })
  texture.image = canvas
  return texture
}

class Media {
  constructor({ geometry, gl, item, index, length, scene, screen, viewport, bend, borderRadius = 0 }) {
    this.extra        = 0
    this.geometry     = geometry
    this.gl           = gl
    this.item         = item
    this.index        = index
    this.length       = length
    this.scene        = scene
    this.screen       = screen
    this.viewport     = viewport
    this.bend         = bend
    this.borderRadius = borderRadius
    this.createShader()
    this.createMesh()
    this.onResize()
  }

  createShader() {
    const texture = createCardTexture(this.gl, this.item, this.index)
    this.program = new Program(this.gl, {
      depthTest:  false,
      depthWrite: false,
      vertex: `
        precision highp float;
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        uniform float uTime;
        uniform float uSpeed;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          vec3 p = position;
          p.z = (sin(p.x * 4.0 + uTime) * 1.4 + cos(p.y * 2.0 + uTime) * 1.2)
                * (0.08 + abs(uSpeed) * 0.45);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform sampler2D tMap;
        uniform float uBorderRadius;
        varying vec2 vUv;

        float roundedBoxSDF(vec2 p, vec2 b, float r) {
          vec2 d = abs(p) - b;
          return length(max(d, vec2(0.0))) + min(max(d.x, d.y), 0.0) - r;
        }

        void main() {
          vec4 color = texture2D(tMap, vUv);
          float d = roundedBoxSDF(vUv - 0.5, vec2(0.5 - uBorderRadius), uBorderRadius);
          float alpha = 1.0 - smoothstep(-0.004, 0.004, d);
          gl_FragColor = vec4(color.rgb, alpha);
        }
      `,
      uniforms: {
        tMap:          { value: texture },
        uSpeed:        { value: 0 },
        uTime:         { value: 12.5 + this.index * 8.75 },
        uBorderRadius: { value: this.borderRadius },
      },
      transparent: true,
    })
  }

  createMesh() {
    this.plane = new Mesh(this.gl, { geometry: this.geometry, program: this.program })
    this.plane.setParent(this.scene)
  }

  update(scroll, direction) {
    this.plane.position.x = this.x - scroll.current - this.extra
    const x = this.plane.position.x
    const H = this.viewport.width / 2

    if (this.bend === 0) {
      this.plane.position.y = 0
      this.plane.rotation.z = 0
    } else {
      const bendAbs    = Math.abs(this.bend)
      const radius     = (H * H + bendAbs * bendAbs) / (2 * bendAbs)
      const effectiveX = Math.min(Math.abs(x), H)
      const arc        = radius - Math.sqrt(radius * radius - effectiveX * effectiveX)
      if (this.bend > 0) {
        this.plane.position.y = -arc
        this.plane.rotation.z = -Math.sign(x) * Math.asin(effectiveX / radius)
      } else {
        this.plane.position.y = arc
        this.plane.rotation.z = Math.sign(x) * Math.asin(effectiveX / radius)
      }
    }

    this.speed = scroll.current - scroll.last
    this.program.uniforms.uTime.value  += 0.035
    this.program.uniforms.uSpeed.value  = this.speed

    const planeOffset    = this.plane.scale.x / 2
    const viewportOffset = this.viewport.width / 2
    this.isBefore = this.plane.position.x + planeOffset < -viewportOffset
    this.isAfter  = this.plane.position.x - planeOffset >  viewportOffset

    if (direction === 'right' && this.isBefore) {
      this.extra -= this.widthTotal
      this.isBefore = this.isAfter = false
    }
    if (direction === 'left' && this.isAfter) {
      this.extra += this.widthTotal
      this.isBefore = this.isAfter = false
    }
  }

  onResize({ screen, viewport } = {}) {
    if (screen)   this.screen   = screen
    if (viewport) this.viewport = viewport

    const isMobile = this.screen.width < 768

    this.scale = this.screen.height / 1500

    if (isMobile) {
      // On mobile: card fills nearly the full viewport width and height
      // so one card is fully visible at a time, centered in the gallery area
      const cardW = this.viewport.width * 0.88
      // Maintain card aspect ratio (900:1120) so content isn't squished
      const cardAspect = 900 / 1120
      const cardH = Math.min(cardW / cardAspect, this.viewport.height * 0.92)
      this.plane.scale.x = cardW
      this.plane.scale.y = cardH
      // Zero padding so each card snaps flush — no partial neighbours visible
      this.padding = 0
    } else {
      this.plane.scale.y = (this.viewport.height * (920 * this.scale)) / this.screen.height
      this.plane.scale.x = (this.viewport.width  * (720 * this.scale)) / this.screen.width
      this.padding = 1.75
    }

    this.width      = this.plane.scale.x + this.padding
    this.widthTotal = this.width * this.length
    this.x          = this.width * this.index
  }
}

class App {
  constructor(container, { items, bend, borderRadius = 0.06, scrollSpeed = 2, scrollEase = 0.05, onSelect } = {}) {
    this.container       = container
    this.items           = items || []
    this.scrollSpeed     = scrollSpeed
    this.onSelect        = onSelect
    this.isVisible       = true
    this.scroll          = { ease: scrollEase, current: 0, target: 0, last: 0 }
    this.onCheckDebounce = debounce(this.onCheck.bind(this), 200)
    this.createRenderer()
    this.createCamera()
    this.createScene()
    this.onResize()
    this.createGeometry()
    this.createMedias(items, bend, borderRadius)
    this.addEventListeners()
    this.observeVisibility()
    this.update()
  }

  createRenderer() {
    this.renderer = new Renderer({
      alpha:     true,
      antialias: true,
      dpr:       Math.min(window.devicePixelRatio || 1, 2),
    })
    this.gl = this.renderer.gl
    this.gl.clearColor(0, 0, 0, 0)
    this.container.appendChild(this.gl.canvas)
  }

  createCamera() {
    this.camera            = new Camera(this.gl)
    this.camera.fov        = 45
    this.camera.position.z = 20
  }

  createScene() {
    this.scene = new Transform()
  }

  createGeometry() {
    this.planeGeometry = new Plane(this.gl, { heightSegments: 50, widthSegments: 100 })
  }

  createMedias(items, bend = 1, borderRadius) {
    const defaultItems = [
      { text: 'Universities',   subtitle: 'GLOBAL ACCESS' },
      { text: 'Colleges',       subtitle: 'CITY NETWORK'  },
      { text: 'Courses',        subtitle: 'FUTURE TRACKS' },
      { text: 'Online Courses', subtitle: 'REMOTE READY'  },
    ]
    const galleryItems  = items?.length ? items : defaultItems
    this.itemsLength    = galleryItems.length
    this.mediasItems    = galleryItems.concat(galleryItems)
    this.medias         = this.mediasItems.map((item, index) =>
      new Media({
        geometry:     this.planeGeometry,
        gl:           this.gl,
        item,
        index,
        length:       this.mediasItems.length,
        scene:        this.scene,
        screen:       this.screen,
        viewport:     this.viewport,
        bend,
        borderRadius,
      })
    )
  }

  getWorldPosition(clientX, clientY) {
    const rect = this.container.getBoundingClientRect()
    return {
      x: ((clientX - rect.left) / rect.width  - 0.5) * this.viewport.width,
      y: (0.5 - (clientY - rect.top) / rect.height)  * this.viewport.height,
    }
  }

  selectNearest(clientX, clientY) {
    if (!this.onSelect || !this.medias?.length) return
    const pointer  = this.getWorldPosition(clientX, clientY)
    const selected = this.medias.reduce((nearest, media) => {
      const dx     = Math.abs(media.plane.position.x - pointer.x)
      const dy     = Math.abs(media.plane.position.y - pointer.y)
      const within = dx <= media.plane.scale.x / 2 && dy <= media.plane.scale.y / 2
      if (!within) return nearest
      const dist = Math.hypot(dx, dy)
      return !nearest || dist < nearest.distance ? { media, distance: dist } : nearest
    }, null)
    if (selected?.media?.item) this.onSelect(selected.media.item)
  }

  onTouchDown(e) {
    this.isDown          = true
    this.didDrag         = false
    this.scroll.position = this.scroll.current
    this.start           = e.touches ? e.touches[0].clientX : e.clientX
    this.startY          = e.touches ? e.touches[0].clientY : e.clientY
    this.lastPointerX    = this.start
    this.lastPointerY    = this.startY
  }

  onTouchMove(e) {
    if (!this.isDown) return
    const x    = e.touches ? e.touches[0].clientX : e.clientX
    const dist = (this.start - x) * (this.scrollSpeed * 0.025)
    if (Math.abs(this.start - x) > 8) this.didDrag = true
    this.lastPointerX  = x
    this.lastPointerY  = e.touches ? e.touches[0].clientY : e.clientY
    this.scroll.target = this.scroll.position + dist
  }

  onTouchUp() {
    if (!this.isDown) return
    if (!this.didDrag) this.selectNearest(this.lastPointerX || this.start, this.lastPointerY || this.startY)
    this.isDown = false
    this.onCheck()
  }

  onWheel(e) {
    const delta = e.deltaY || e.wheelDelta || e.detail
    this.scroll.target += (delta > 0 ? this.scrollSpeed : -this.scrollSpeed) * 0.2
    this.onCheckDebounce()
  }

  onCheck() {
    if (!this.medias?.[0]) return
    const width     = this.medias[0].width
    const itemIndex = Math.round(Math.abs(this.scroll.target) / width)
    const item      = width * itemIndex
    this.scroll.target = this.scroll.target < 0 ? -item : item
  }

  setScrollProgress(progress = 0) {
    if (!this.medias?.[0]) return
    const p = Math.max(0, Math.min(1, progress))
    this.scroll.target = this.medias[0].width * this.itemsLength * p
  }

  onResize() {
    if (!this.container) return
    this.screen = { width: this.container.clientWidth, height: this.container.clientHeight }
    this.renderer.setSize(this.screen.width, this.screen.height)
    this.camera.perspective({ aspect: this.screen.width / this.screen.height })
    const fov    = (this.camera.fov * Math.PI) / 180
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z
    this.viewport = { width: height * this.camera.aspect, height }
    this.medias?.forEach(m => m.onResize({ screen: this.screen, viewport: this.viewport }))
  }

  update() {
    if (this.isVisible) {
      this.scroll.current = lerp(this.scroll.current, this.scroll.target, this.scroll.ease)
      const direction = this.scroll.current > this.scroll.last ? 'right' : 'left'
      this.medias?.forEach(m => m.update(this.scroll, direction))
      this.renderer.render({ scene: this.scene, camera: this.camera })
      this.scroll.last = this.scroll.current
    }
    this.raf = window.requestAnimationFrame(this.update.bind(this))
  }

  observeVisibility() {
    this.visibilityObserver = new IntersectionObserver(
      ([entry]) => { this.isVisible = entry.isIntersecting },
      { rootMargin: '220px 0px' }
    )
    this.visibilityObserver.observe(this.container)
  }

  addEventListeners() {
    this.boundOnResize    = this.onResize.bind(this)
    this.boundOnWheel     = this.onWheel.bind(this)
    this.boundOnTouchDown = this.onTouchDown.bind(this)
    this.boundOnTouchMove = this.onTouchMove.bind(this)
    this.boundOnTouchUp   = this.onTouchUp.bind(this)
    window.addEventListener('resize',     this.boundOnResize)
    this.container.addEventListener('wheel',      this.boundOnWheel,     { passive: true })
    this.container.addEventListener('mousedown',  this.boundOnTouchDown)
    window.addEventListener('mousemove',          this.boundOnTouchMove)
    window.addEventListener('mouseup',            this.boundOnTouchUp)
    this.container.addEventListener('touchstart', this.boundOnTouchDown, { passive: true })
    window.addEventListener('touchmove',          this.boundOnTouchMove, { passive: true })
    window.addEventListener('touchend',           this.boundOnTouchUp)
  }

  destroy() {
    window.cancelAnimationFrame(this.raf)
    this.visibilityObserver?.disconnect()
    window.removeEventListener('resize',          this.boundOnResize)
    this.container.removeEventListener('wheel',      this.boundOnWheel)
    this.container.removeEventListener('mousedown',  this.boundOnTouchDown)
    window.removeEventListener('mousemove',          this.boundOnTouchMove)
    window.removeEventListener('mouseup',            this.boundOnTouchUp)
    this.container.removeEventListener('touchstart', this.boundOnTouchDown)
    window.removeEventListener('touchmove',          this.boundOnTouchMove)
    window.removeEventListener('touchend',           this.boundOnTouchUp)
    if (this.renderer?.gl?.canvas?.parentNode) {
      this.renderer.gl.canvas.parentNode.removeChild(this.renderer.gl.canvas)
    }
  }
}

const CircularGallery = forwardRef(function CircularGallery(
  { items, bend = 3, borderRadius = 0.06, scrollSpeed = 2, scrollEase = 0.05, onSelect },
  ref
) {
  const containerRef = useRef(null)
  const appRef       = useRef(null)

  useImperativeHandle(ref, () => ({
    setScrollProgress(progress) { appRef.current?.setScrollProgress(progress) }
  }), [])

  useEffect(() => {
    if (!containerRef.current) return
    const app      = new App(containerRef.current, { items, bend, borderRadius, scrollSpeed, scrollEase, onSelect })
    appRef.current = app
    return () => { app.destroy(); appRef.current = null }
  }, [items, bend, borderRadius, scrollSpeed, scrollEase, onSelect])

  return (
    <div
      className="h-full w-full cursor-grab overflow-hidden active:cursor-grabbing"
      ref={containerRef}
    />
  )
})

export default CircularGallery