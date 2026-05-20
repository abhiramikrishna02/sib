import React, { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'

function Globe({ rotationSpeed, radius }) {
  const groupRef = useRef(null)

  useFrame(() => {
    if (!groupRef.current) return
    groupRef.current.rotation.y += rotationSpeed
    groupRef.current.rotation.x += rotationSpeed * 0.3
    groupRef.current.rotation.z += rotationSpeed * 0.1
  })

  return (
    <group ref={groupRef}>
      <mesh>
        <sphereGeometry args={[radius, 64, 64]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.16} wireframe />
      </mesh>
    </group>
  )
}

const DotGlobeHero = React.forwardRef(
  ({ rotationSpeed = 0.005, globeRadius = 1, className = '', children, ...props }, ref) => (
    <div ref={ref} className={`relative w-full overflow-hidden bg-black ${className}`} {...props}>
      <div className="relative z-10">{children}</div>
      <div className="pointer-events-none absolute inset-0 z-0">
        <Canvas>
          <PerspectiveCamera makeDefault position={[0, 0, 3]} fov={75} />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <Globe rotationSpeed={rotationSpeed} radius={globeRadius} />
        </Canvas>
      </div>
    </div>
  ),
)

DotGlobeHero.displayName = 'DotGlobeHero'

export { DotGlobeHero }
