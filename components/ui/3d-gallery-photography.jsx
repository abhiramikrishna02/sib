import { Canvas, useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'

/* eslint-disable react-hooks/immutability, react-hooks/set-state-in-effect */

const DEFAULT_DEPTH_RANGE = 50
const MAX_HORIZONTAL_OFFSET = 8
const MAX_VERTICAL_OFFSET = 8

const createClothMaterial = () =>
  new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: {
      map: { value: null },
      opacity: { value: 1 },
      blurAmount: { value: 0 },
      scrollForce: { value: 0 },
      time: { value: 0 },
      isHovered: { value: 0 },
    },
    vertexShader: `
      uniform float scrollForce;
      uniform float time;
      uniform float isHovered;
      varying vec2 vUv;

      void main() {
        vUv = uv;
        vec3 pos = position;
        float curveIntensity = scrollForce * 0.3;
        float distanceFromCenter = length(pos.xy);
        float curve = distanceFromCenter * distanceFromCenter * curveIntensity;
        float ripple1 = sin(pos.x * 2.0 + scrollForce * 3.0) * 0.02;
        float ripple2 = sin(pos.y * 2.5 + scrollForce * 2.0) * 0.015;
        float clothEffect = (ripple1 + ripple2) * abs(curveIntensity) * 2.0;
        float flagWave = 0.0;

        if (isHovered > 0.5) {
          float wavePhase = pos.x * 3.0 + time * 8.0;
          float waveAmplitude = sin(wavePhase) * 0.1;
          float dampening = smoothstep(-0.5, 0.5, pos.x);
          float secondaryWave = sin(pos.x * 5.0 + time * 12.0) * 0.03 * dampening;
          flagWave = waveAmplitude * dampening + secondaryWave;
        }

        pos.z -= curve + clothEffect + flagWave;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D map;
      uniform float opacity;
      uniform float blurAmount;
      uniform float scrollForce;
      varying vec2 vUv;

      void main() {
        vec4 color = texture2D(map, vUv);

        if (blurAmount > 0.0) {
          vec2 texelSize = 1.0 / vec2(textureSize(map, 0));
          vec4 blurred = vec4(0.0);
          float total = 0.0;

          for (float x = -2.0; x <= 2.0; x += 1.0) {
            for (float y = -2.0; y <= 2.0; y += 1.0) {
              vec2 offset = vec2(x, y) * texelSize * blurAmount;
              float weight = 1.0 / (1.0 + length(vec2(x, y)));
              blurred += texture2D(map, vUv + offset) * weight;
              total += weight;
            }
          }

          color = blurred / total;
        }

        float curveHighlight = abs(scrollForce) * 0.05;
        color.rgb += vec3(curveHighlight * 0.1);
        gl_FragColor = vec4(color.rgb, color.a * opacity);
      }
    `,
  })

function ImagePlane({ slotIndex, textures, material, planesData, depthRange }) {
  const meshRef = useRef(null)
  const [isHovered, setIsHovered] = useState(false)
  const lastTextureIndexRef = useRef(-1)

  useFrame(() => {
    const plane = planesData.current[slotIndex]
    if (!plane || !meshRef.current) return

    const texture = textures[plane.imageIndex]
    if (!texture) return

    if (lastTextureIndexRef.current !== plane.imageIndex) {
      material.uniforms.map.value = texture
      lastTextureIndexRef.current = plane.imageIndex
    }

    const aspect = texture.image ? texture.image.width / texture.image.height : 1
    const scale = aspect > 1 ? [2 * aspect, 2, 1] : [2, 2 / aspect, 1]

    meshRef.current.position.set(plane.x, plane.y, plane.worldZ ?? plane.z - depthRange / 2)
    meshRef.current.scale.set(scale[0], scale[1], scale[2])
  })

  useEffect(() => {
    material.uniforms.isHovered.value = isHovered ? 1 : 0
  }, [isHovered, material])

  return (
    <mesh
      ref={meshRef}
      scale={[2, 2, 1]}
      material={material}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
    >
      <planeGeometry args={[1, 1, 32, 32]} />
    </mesh>
  )
}

function GalleryScene({
  images,
  speed = 1,
  visibleCount = 8,
  fadeSettings = {
    fadeIn: { start: 0.05, end: 0.15 },
    fadeOut: { start: 0.85, end: 0.95 },
  },
  blurSettings = {
    blurIn: { start: 0, end: 0.1 },
    blurOut: { start: 0.9, end: 1 },
    maxBlur: 3,
  },
  scrollSourceRef,
  active = true,
}) {
  const velocityRef = useRef(0)
  const autoplayRef = useRef(true)
  const lastInteractionRef = useRef(0)

  const normalizedImages = useMemo(
    () => images.map((img) => (typeof img === 'string' ? { src: img, alt: '' } : img)),
    [images],
  )
  const textures = useTexture(normalizedImages.map((img) => img.src))

  const materials = useMemo(
    () => Array.from({ length: visibleCount }, () => createClothMaterial()),
    [visibleCount],
  )

  const spatialPositions = useMemo(() => {
    return Array.from({ length: visibleCount }, (_, i) => {
      const horizontalAngle = (i * 2.618) % (Math.PI * 2)
      const verticalAngle = (i * 1.618 + Math.PI / 3) % (Math.PI * 2)
      const horizontalRadius = (i % 3) * 1.2
      const verticalRadius = ((i + 1) % 4) * 0.8

      return {
        x: (Math.sin(horizontalAngle) * horizontalRadius * MAX_HORIZONTAL_OFFSET) / 3,
        y: (Math.cos(verticalAngle) * verticalRadius * MAX_VERTICAL_OFFSET) / 4,
      }
    })
  }, [visibleCount])

  const totalImages = normalizedImages.length
  const depthRange = DEFAULT_DEPTH_RANGE
  const initialPlanesData = useMemo(
    () =>
      Array.from({ length: visibleCount }, (_, i) => ({
        index: i,
        z: ((depthRange / Math.max(visibleCount, 1)) * i) % depthRange,
        imageIndex: totalImages > 0 ? i % totalImages : 0,
        x: spatialPositions[i]?.x ?? 0,
        y: spatialPositions[i]?.y ?? 0,
        worldZ: ((depthRange / Math.max(visibleCount, 1)) * i) % depthRange - depthRange / 2,
      })),
    [depthRange, spatialPositions, totalImages, visibleCount],
  )
  const planesData = useRef(initialPlanesData)
  const visibleSlots = useMemo(() => Array.from({ length: visibleCount }, (_, i) => i), [visibleCount])

  useEffect(() => {
    planesData.current = initialPlanesData
  }, [initialPlanesData])

  const pushVelocity = useCallback(
    (amount) => {
      velocityRef.current += amount * speed
      autoplayRef.current = false
      lastInteractionRef.current = Date.now()
    },
    [speed],
  )

  useEffect(() => {
    lastInteractionRef.current = Date.now()
    const target = scrollSourceRef?.current || window
    let lastTouchY = 0

    const handleWheel = (event) => {
      const rect = scrollSourceRef?.current?.getBoundingClientRect()
      if (rect && (rect.bottom < 0 || rect.top > window.innerHeight)) return
      pushVelocity(event.deltaY * 0.01)
    }

    const handleTouchStart = (event) => {
      lastTouchY = event.touches[0]?.clientY ?? 0
    }

    const handleTouchMove = (event) => {
      const nextY = event.touches[0]?.clientY ?? lastTouchY
      pushVelocity((lastTouchY - nextY) * 0.025)
      lastTouchY = nextY
    }

    const handleKeyDown = (event) => {
      if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') pushVelocity(-2)
      if (event.key === 'ArrowDown' || event.key === 'ArrowRight') pushVelocity(2)
    }

    target.addEventListener('wheel', handleWheel, { passive: true })
    target.addEventListener('touchstart', handleTouchStart, { passive: true })
    target.addEventListener('touchmove', handleTouchMove, { passive: true })
    document.addEventListener('keydown', handleKeyDown)

    const interval = window.setInterval(() => {
      if (Date.now() - lastInteractionRef.current > 3000) autoplayRef.current = true
    }, 1000)

    return () => {
      target.removeEventListener('wheel', handleWheel)
      target.removeEventListener('touchstart', handleTouchStart)
      target.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('keydown', handleKeyDown)
      window.clearInterval(interval)
    }
  }, [pushVelocity, scrollSourceRef])

  useEffect(() => {
    return () => materials.forEach((material) => material.dispose())
  }, [materials])

  useFrame((state, delta) => {
    if (!active) return

    if (autoplayRef.current) velocityRef.current += 0.3 * delta
    velocityRef.current *= 0.95

    const scrollVelocity = velocityRef.current
    const time = state.clock.getElapsedTime()

    materials.forEach((material) => {
      material.uniforms.time.value = time
      material.uniforms.scrollForce.value = scrollVelocity
    })

    const imageAdvance = totalImages > 0 ? visibleCount % totalImages || totalImages : 0
    const halfRange = depthRange / 2

    planesData.current.forEach((plane, i) => {
      let newZ = plane.z + scrollVelocity * delta * 10
      let wrapsForward = 0
      let wrapsBackward = 0

      if (newZ >= depthRange) {
        wrapsForward = Math.floor(newZ / depthRange)
        newZ -= depthRange * wrapsForward
      } else if (newZ < 0) {
        wrapsBackward = Math.ceil(-newZ / depthRange)
        newZ += depthRange * wrapsBackward
      }

      if (wrapsForward > 0 && imageAdvance > 0) {
        plane.imageIndex = (plane.imageIndex + wrapsForward * imageAdvance) % totalImages
      }

      if (wrapsBackward > 0 && imageAdvance > 0) {
        const step = plane.imageIndex - wrapsBackward * imageAdvance
        plane.imageIndex = ((step % totalImages) + totalImages) % totalImages
      }

      plane.z = ((newZ % depthRange) + depthRange) % depthRange
      plane.x = spatialPositions[i]?.x ?? 0
      plane.y = spatialPositions[i]?.y ?? 0

      const normalizedPosition = plane.z / depthRange
      let opacity = 1

      if (
        normalizedPosition >= fadeSettings.fadeIn.start &&
        normalizedPosition <= fadeSettings.fadeIn.end
      ) {
        opacity =
          (normalizedPosition - fadeSettings.fadeIn.start) /
          (fadeSettings.fadeIn.end - fadeSettings.fadeIn.start)
      } else if (normalizedPosition < fadeSettings.fadeIn.start) {
        opacity = 0
      } else if (
        normalizedPosition >= fadeSettings.fadeOut.start &&
        normalizedPosition <= fadeSettings.fadeOut.end
      ) {
        opacity =
          1 -
          (normalizedPosition - fadeSettings.fadeOut.start) /
            (fadeSettings.fadeOut.end - fadeSettings.fadeOut.start)
      } else if (normalizedPosition > fadeSettings.fadeOut.end) {
        opacity = 0
      }

      let blur = 0

      if (
        normalizedPosition >= blurSettings.blurIn.start &&
        normalizedPosition <= blurSettings.blurIn.end
      ) {
        blur =
          blurSettings.maxBlur *
          (1 -
            (normalizedPosition - blurSettings.blurIn.start) /
              (blurSettings.blurIn.end - blurSettings.blurIn.start))
      } else if (normalizedPosition < blurSettings.blurIn.start) {
        blur = blurSettings.maxBlur
      } else if (
        normalizedPosition >= blurSettings.blurOut.start &&
        normalizedPosition <= blurSettings.blurOut.end
      ) {
        blur =
          blurSettings.maxBlur *
          ((normalizedPosition - blurSettings.blurOut.start) /
            (blurSettings.blurOut.end - blurSettings.blurOut.start))
      } else if (normalizedPosition > blurSettings.blurOut.end) {
        blur = blurSettings.maxBlur
      }

      const material = materials[i]
      material.uniforms.opacity.value = Math.max(0, Math.min(1, opacity))
      material.uniforms.blurAmount.value = Math.max(0, Math.min(blurSettings.maxBlur, blur))
      plane.worldZ = plane.z - halfRange
    })
  })

  if (normalizedImages.length === 0) return null

  return (
    <>
      {visibleSlots.map((slotIndex) => {
        const material = materials[slotIndex]
        if (!material) return null

        return (
          <ImagePlane
            key={slotIndex}
            slotIndex={slotIndex}
            textures={textures}
            material={material}
            planesData={planesData}
            depthRange={depthRange}
          />
        )
      })}
    </>
  )
}

function FallbackGallery({ images }) {
  const normalizedImages = useMemo(
    () => images.map((img) => (typeof img === 'string' ? { src: img, alt: '' } : img)),
    [images],
  )

  return (
    <div className="grid h-full w-full grid-cols-2 gap-3 overflow-hidden bg-black/20 p-4 sm:grid-cols-3">
      {normalizedImages.slice(0, 6).map((img, i) => (
        <img
          key={`${img.src}-${i}`}
          src={img.src}
          alt={img.alt}
          className="h-full min-h-0 w-full rounded-md object-cover opacity-75"
        />
      ))}
    </div>
  )
}

export default function InfiniteGallery({
  images,
  speed = 1,
  visibleCount = 8,
  className = 'h-96 w-full',
  style,
  fadeSettings = {
    fadeIn: { start: 0.05, end: 0.25 },
    fadeOut: { start: 0.4, end: 0.43 },
  },
  blurSettings = {
    blurIn: { start: 0, end: 0.1 },
    blurOut: { start: 0.4, end: 0.43 },
    maxBlur: 8,
  },
  scrollSourceRef,
}) {
  const [webglSupported, setWebglSupported] = useState(true)
  const [active, setActive] = useState(true)
  const containerRef = useRef(null)

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      setWebglSupported(Boolean(gl))
    } catch {
      setWebglSupported(false)
    }
  }, [])

  useEffect(() => {
    const node = containerRef.current
    if (!node || typeof IntersectionObserver === 'undefined') return

    const observer = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { rootMargin: '240px 0px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  if (!webglSupported) {
    return (
      <div ref={containerRef} className={className} style={style}>
        <FallbackGallery images={images} />
      </div>
    )
  }

  return (
    <div ref={containerRef} className={className} style={style}>
      <Canvas
        camera={{ position: [0, 0, 0], fov: 55 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
      >
        <Suspense fallback={null}>
          <GalleryScene
            images={images}
            speed={speed}
            visibleCount={visibleCount}
            fadeSettings={fadeSettings}
            blurSettings={blurSettings}
            scrollSourceRef={scrollSourceRef}
            active={active}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}
