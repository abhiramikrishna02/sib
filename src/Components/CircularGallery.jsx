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
  const width = 900
  const height = 1120
  const ratio = Math.min(window.devicePixelRatio || 1, 1.25)
  const accent = item.accent || '#a855f7'
  const accentSoft = item.accentSoft || 'rgba(168, 85, 247, 0.28)'

  canvas.width = width * ratio
  canvas.height = height * ratio
  canvas.style.width = `${width}px`
  canvas.style.height = `${height}px`
  ctx.scale(ratio, ratio)
  ctx.clearRect(0, 0, width, height)

  const bg = ctx.createLinearGradient(0, 0, width, height)
  bg.addColorStop(0, '#21132f')
  bg.addColorStop(0.46, '#12081f')
  bg.addColorStop(1, '#2a1034')
  roundedRect(ctx, 34, 34, width - 68, height - 68, 76)
  ctx.fillStyle = bg
  ctx.fill()

  const edge = ctx.createLinearGradient(0, 0, width, height)
  edge.addColorStop(0, 'rgba(255,255,255,0.34)')
  edge.addColorStop(0.35, accent)
  edge.addColorStop(0.72, 'rgba(255,255,255,0.1)')
  edge.addColorStop(1, accent)
  ctx.lineWidth = 3
  ctx.strokeStyle = edge
  ctx.stroke()

  const glow = ctx.createRadialGradient(210, 180, 0, 210, 180, 430)
  glow.addColorStop(0, accentSoft)
  glow.addColorStop(0.58, 'rgba(168,85,247,0.08)')
  glow.addColorStop(1, 'rgba(168,85,247,0)')
  ctx.fillStyle = glow
  ctx.fillRect(34, 34, width - 68, height - 68)

  const secondGlow = ctx.createRadialGradient(730, 890, 0, 730, 890, 380)
  secondGlow.addColorStop(0, 'rgba(255,255,255,0.12)')
  secondGlow.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = secondGlow
  ctx.fillRect(34, 34, width - 68, height - 68)

  ctx.save()
  roundedRect(ctx, 34, 34, width - 68, height - 68, 76)
  ctx.clip()
  ctx.globalAlpha = 0.16
  ctx.strokeStyle = '#ffffff'
  ctx.lineWidth = 1
  for (let x = -height; x < width; x += 74) {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x + height, height)
    ctx.stroke()
  }
  ctx.globalAlpha = 1

  ctx.strokeStyle = accent
  ctx.lineWidth = 4
  ctx.globalAlpha = 0.42
  ctx.beginPath()
  ctx.arc(width - 96, 112, 190, Math.PI * 0.55, Math.PI * 1.38)
  ctx.stroke()
  ctx.globalAlpha = 1
  ctx.restore()

  roundedRect(ctx, 84, 84, 176, 176, 44)
  ctx.fillStyle = 'rgba(255,255,255,0.08)'
  ctx.fill()
  ctx.strokeStyle = 'rgba(255,255,255,0.16)'
  ctx.lineWidth = 2
  ctx.stroke()

  ctx.fillStyle = accent
  ctx.shadowColor = accent
  ctx.shadowBlur = 38
  ctx.font = '900 78px Arial, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(item.code || String(index + 1).padStart(2, '0'), 172, 172)
  ctx.shadowBlur = 0

  ctx.textAlign = 'left'
  ctx.fillStyle = 'rgba(255,255,255,0.44)'
  ctx.font = '900 28px Arial, sans-serif'
  ctx.letterSpacing = '8px'
  ctx.fillText(item.subtitle || 'GLOBAL ACCESS', 84, 390)

  ctx.fillStyle = '#ffffff'
  ctx.font = '900 84px Arial, sans-serif'
  ctx.letterSpacing = '0px'
  const titleLines = wrapText(ctx, item.text || item.title || '', 690).slice(0, 3)
  titleLines.forEach((line, lineIndex) => {
    ctx.fillText(line.toUpperCase(), 84, 500 + lineIndex * 92)
  })

  ctx.fillStyle = 'rgba(255,255,255,0.62)'
  ctx.font = '500 31px Arial, sans-serif'
  const bodyLines = wrapText(ctx, item.note || 'Explore trusted academic pathways and student-first support.', 680).slice(0, 3)
  bodyLines.forEach((line, lineIndex) => {
    ctx.fillText(line, 84, 805 + lineIndex * 46)
  })

  ctx.strokeStyle = 'rgba(255,255,255,0.16)'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(84, 944)
  ctx.lineTo(680, 944)
  ctx.stroke()

  roundedRect(ctx, 84, 982, 286, 60, 30)
  ctx.fillStyle = 'rgba(255,255,255,0.08)'
  ctx.fill()
  ctx.strokeStyle = 'rgba(255,255,255,0.14)'
  ctx.stroke()
  ctx.fillStyle = 'rgba(255,255,255,0.8)'
  ctx.font = '900 23px Arial, sans-serif'
  ctx.fillText(item.path ? 'OPEN DETAILS' : 'EXPLORE', 112, 1021)

  ctx.fillStyle = accent
  ctx.font = '900 58px Arial, sans-serif'
  ctx.textAlign = 'right'
  ctx.fillText('->', 785, 1020)

  const texture = new Texture(gl, { generateMipmaps: false })
  texture.image = canvas
  return texture
}

class Media {
  constructor({ geometry, gl, item, index, length, scene, screen, viewport, bend, borderRadius = 0 }) {
    this.extra = 0
    this.geometry = geometry
    this.gl = gl
    this.item = item
    this.index = index
    this.length = length
    this.scene = scene
    this.screen = screen
    this.viewport = viewport
    this.bend = bend
    this.borderRadius = borderRadius
    this.createShader()
    this.createMesh()
    this.onResize()
  }

  createShader() {
    const texture = createCardTexture(this.gl, this.item, this.index)
    this.program = new Program(this.gl, {
      depthTest: false,
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
          p.z = (sin(p.x * 4.0 + uTime) * 1.4 + cos(p.y * 2.0 + uTime) * 1.2) * (0.08 + abs(uSpeed) * 0.45);
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
          float alpha = 1.0 - smoothstep(-0.002, 0.002, d);
          gl_FragColor = vec4(color.rgb, color.a * alpha);
        }
      `,
      uniforms: {
        tMap: { value: texture },
        uSpeed: { value: 0 },
        uTime: { value: 12.5 + this.index * 8.75 },
        uBorderRadius: { value: this.borderRadius }
      },
      transparent: true
    })
  }

  createMesh() {
    this.plane = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.program
    })
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
      const bendAbs = Math.abs(this.bend)
      const radius = (H * H + bendAbs * bendAbs) / (2 * bendAbs)
      const effectiveX = Math.min(Math.abs(x), H)
      const arc = radius - Math.sqrt(radius * radius - effectiveX * effectiveX)
      if (this.bend > 0) {
        this.plane.position.y = -arc
        this.plane.rotation.z = -Math.sign(x) * Math.asin(effectiveX / radius)
      } else {
        this.plane.position.y = arc
        this.plane.rotation.z = Math.sign(x) * Math.asin(effectiveX / radius)
      }
    }

    this.speed = scroll.current - scroll.last
    this.program.uniforms.uTime.value += 0.035
    this.program.uniforms.uSpeed.value = this.speed

    const planeOffset = this.plane.scale.x / 2
    const viewportOffset = this.viewport.width / 2
    this.isBefore = this.plane.position.x + planeOffset < -viewportOffset
    this.isAfter = this.plane.position.x - planeOffset > viewportOffset
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
    if (screen) this.screen = screen
    if (viewport) this.viewport = viewport
    this.scale = this.screen.height / 1500
    this.plane.scale.y = (this.viewport.height * (920 * this.scale)) / this.screen.height
    this.plane.scale.x = (this.viewport.width * (720 * this.scale)) / this.screen.width
    this.padding = this.screen.width < 768 ? 1.15 : 1.75
    this.width = this.plane.scale.x + this.padding
    this.widthTotal = this.width * this.length
    this.x = this.width * this.index
  }
}

class App {
  constructor(
    container,
    {
      items,
      bend,
      borderRadius = 0.06,
      scrollSpeed = 2,
      scrollEase = 0.05,
      onSelect
    } = {}
  ) {
    this.container = container
    this.items = items || []
    this.scrollSpeed = scrollSpeed
    this.onSelect = onSelect
    this.isVisible = true
    this.scroll = { ease: scrollEase, current: 0, target: 0, last: 0 }
    this.onCheckDebounce = debounce(this.onCheck, 200)
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
      alpha: true,
      antialias: true,
      dpr: Math.min(window.devicePixelRatio || 1, 2)
    })
    this.gl = this.renderer.gl
    this.gl.clearColor(0, 0, 0, 0)
    this.container.appendChild(this.gl.canvas)
  }

  createCamera() {
    this.camera = new Camera(this.gl)
    this.camera.fov = 45
    this.camera.position.z = 20
  }

  createScene() {
    this.scene = new Transform()
  }

  createGeometry() {
    this.planeGeometry = new Plane(this.gl, {
      heightSegments: 50,
      widthSegments: 100
    })
  }

  createMedias(items, bend = 1, borderRadius) {
    const defaultItems = [
      { text: 'Universities', subtitle: 'GLOBAL ACCESS' },
      { text: 'Colleges', subtitle: 'GLOBAL ACCESS' },
      { text: 'Courses', subtitle: 'GLOBAL ACCESS' },
      { text: 'Online Courses', subtitle: 'GLOBAL ACCESS' }
    ]
    const galleryItems = items && items.length ? items : defaultItems
    this.itemsLength = galleryItems.length
    this.mediasItems = galleryItems.concat(galleryItems)
    this.medias = this.mediasItems.map((item, index) => new Media({
      geometry: this.planeGeometry,
      gl: this.gl,
      item,
      index,
      length: this.mediasItems.length,
      scene: this.scene,
      screen: this.screen,
      viewport: this.viewport,
      bend,
      borderRadius
    }))
  }

  getWorldPosition(clientX, clientY) {
    const rect = this.container.getBoundingClientRect()
    return {
      x: ((clientX - rect.left) / rect.width - 0.5) * this.viewport.width,
      y: (0.5 - (clientY - rect.top) / rect.height) * this.viewport.height
    }
  }

  selectNearest(clientX, clientY) {
    if (!this.onSelect || !this.medias?.length) return
    const pointer = this.getWorldPosition(clientX, clientY)
    const selected = this.medias.reduce((nearest, media) => {
      const distanceX = Math.abs(media.plane.position.x - pointer.x)
      const distanceY = Math.abs(media.plane.position.y - pointer.y)
      const withinCard = distanceX <= media.plane.scale.x / 2 && distanceY <= media.plane.scale.y / 2
      if (!withinCard) return nearest
      const distance = Math.hypot(distanceX, distanceY)
      if (!nearest || distance < nearest.distance) return { media, distance }
      return nearest
    }, null)
    if (selected?.media?.item) this.onSelect(selected.media.item)
  }

  onTouchDown(e) {
    this.isDown = true
    this.didDrag = false
    this.scroll.position = this.scroll.current
    this.start = e.touches ? e.touches[0].clientX : e.clientX
    this.startY = e.touches ? e.touches[0].clientY : e.clientY
    this.lastPointerX = this.start
    this.lastPointerY = this.startY
  }

  onTouchMove(e) {
    if (!this.isDown) return
    const x = e.touches ? e.touches[0].clientX : e.clientX
    const distance = (this.start - x) * (this.scrollSpeed * 0.025)
    if (Math.abs(this.start - x) > 8) this.didDrag = true
    this.lastPointerX = x
    this.lastPointerY = e.touches ? e.touches[0].clientY : e.clientY
    this.scroll.target = this.scroll.position + distance
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
    if (!this.medias || !this.medias[0]) return
    const width = this.medias[0].width
    const itemIndex = Math.round(Math.abs(this.scroll.target) / width)
    const item = width * itemIndex
    this.scroll.target = this.scroll.target < 0 ? -item : item
  }

  setScrollProgress(progress = 0) {
    if (!this.medias || !this.medias[0]) return
    const clampedProgress = Math.max(0, Math.min(1, progress))
    this.scroll.target = this.medias[0].width * this.itemsLength * clampedProgress
  }

  onResize() {
    if (!this.container) return
    this.screen = {
      width: this.container.clientWidth,
      height: this.container.clientHeight
    }
    this.renderer.setSize(this.screen.width, this.screen.height)
    this.camera.perspective({
      aspect: this.screen.width / this.screen.height
    })
    const fov = (this.camera.fov * Math.PI) / 180
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z
    const width = height * this.camera.aspect
    this.viewport = { width, height }
    if (this.medias) {
      this.medias.forEach(media => media.onResize({ screen: this.screen, viewport: this.viewport }))
    }
  }

  update() {
    if (!this.isVisible) {
      this.raf = window.requestAnimationFrame(this.update.bind(this))
      return
    }
    this.scroll.current = lerp(this.scroll.current, this.scroll.target, this.scroll.ease)
    const direction = this.scroll.current > this.scroll.last ? 'right' : 'left'
    if (this.medias) {
      this.medias.forEach(media => media.update(this.scroll, direction))
    }
    this.renderer.render({ scene: this.scene, camera: this.camera })
    this.scroll.last = this.scroll.current
    this.raf = window.requestAnimationFrame(this.update.bind(this))
  }

  observeVisibility() {
    this.visibilityObserver = new IntersectionObserver(([entry]) => {
      this.isVisible = entry.isIntersecting
    }, { rootMargin: '220px 0px' })
    this.visibilityObserver.observe(this.container)
  }

  addEventListeners() {
    this.boundOnResize = this.onResize.bind(this)
    this.boundOnWheel = this.onWheel.bind(this)
    this.boundOnTouchDown = this.onTouchDown.bind(this)
    this.boundOnTouchMove = this.onTouchMove.bind(this)
    this.boundOnTouchUp = this.onTouchUp.bind(this)
    window.addEventListener('resize', this.boundOnResize)
    this.container.addEventListener('wheel', this.boundOnWheel, { passive: true })
    this.container.addEventListener('mousedown', this.boundOnTouchDown)
    window.addEventListener('mousemove', this.boundOnTouchMove)
    window.addEventListener('mouseup', this.boundOnTouchUp)
    this.container.addEventListener('touchstart', this.boundOnTouchDown, { passive: true })
    window.addEventListener('touchmove', this.boundOnTouchMove, { passive: true })
    window.addEventListener('touchend', this.boundOnTouchUp)
  }

  destroy() {
    window.cancelAnimationFrame(this.raf)
    this.visibilityObserver?.disconnect()
    window.removeEventListener('resize', this.boundOnResize)
    this.container.removeEventListener('wheel', this.boundOnWheel)
    this.container.removeEventListener('mousedown', this.boundOnTouchDown)
    window.removeEventListener('mousemove', this.boundOnTouchMove)
    window.removeEventListener('mouseup', this.boundOnTouchUp)
    this.container.removeEventListener('touchstart', this.boundOnTouchDown)
    window.removeEventListener('touchmove', this.boundOnTouchMove)
    window.removeEventListener('touchend', this.boundOnTouchUp)
    if (this.renderer?.gl?.canvas?.parentNode) {
      this.renderer.gl.canvas.parentNode.removeChild(this.renderer.gl.canvas)
    }
  }
}

const CircularGallery = forwardRef(function CircularGallery({
  items,
  bend = 3,
  borderRadius = 0.06,
  scrollSpeed = 2,
  scrollEase = 0.05,
  onSelect
}, ref) {
  const containerRef = useRef(null)
  const appRef = useRef(null)

  useImperativeHandle(ref, () => ({
    setScrollProgress(progress) {
      appRef.current?.setScrollProgress(progress)
    }
  }), [])

  useEffect(() => {
    if (!containerRef.current) return undefined
    const app = new App(containerRef.current, { items, bend, borderRadius, scrollSpeed, scrollEase, onSelect })
    appRef.current = app
    return () => {
      app.destroy()
      appRef.current = null
    }
  }, [items, bend, borderRadius, scrollSpeed, scrollEase, onSelect])

  return <div className="h-full w-full cursor-grab overflow-hidden active:cursor-grabbing" ref={containerRef} />
})

export default CircularGallery
