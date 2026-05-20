import { useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { cn } from '../lib/utils'

function ShaderMaterial({ source, uniforms }) {
  const { size } = useThree()
  const meshRef = useRef(null)

  const preparedUniforms = useMemo(() => {
    const nextUniforms = {}

    Object.entries(uniforms).forEach(([uniformName, uniform]) => {
      switch (uniform.type) {
        case 'uniform1f':
        case 'uniform1i':
        case 'uniform1fv':
          nextUniforms[uniformName] = { value: uniform.value }
          break
        case 'uniform3fv':
          nextUniforms[uniformName] = {
            value: uniform.value.map((value) => new THREE.Vector3().fromArray(value)),
          }
          break
        default:
          break
      }
    })

    nextUniforms.u_time = { value: 0 }
    nextUniforms.u_resolution = {
      value: new THREE.Vector2(size.width * 2, size.height * 2),
    }

    return nextUniforms
  }, [size.height, size.width, uniforms])

  const material = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: `
      precision mediump float;
      uniform vec2 u_resolution;
      out vec2 fragCoord;

      void main() {
        gl_Position = vec4(position.xy, 0.0, 1.0);
        fragCoord = (position.xy + vec2(1.0)) * 0.5 * u_resolution;
        fragCoord.y = u_resolution.y - fragCoord.y;
      }
    `,
    fragmentShader: source,
    uniforms: preparedUniforms,
    glslVersion: THREE.GLSL3,
    transparent: true,
    depthWrite: false,
    blending: THREE.CustomBlending,
    blendSrc: THREE.SrcAlphaFactor,
    blendDst: THREE.OneFactor,
  }), [preparedUniforms, source])

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    meshRef.current.material.uniforms.u_time.value = clock.getElapsedTime()
  })

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      <primitive object={material} attach="material" />
    </mesh>
  )
}

function Shader({ source, uniforms }) {
  return (
    <Canvas className="absolute inset-0 h-full w-full" gl={{ alpha: true, antialias: false }} dpr={[1, 1.5]}>
      <ShaderMaterial source={source} uniforms={uniforms} />
    </Canvas>
  )
}

function DotMatrix({
  colors = [[255, 255, 255]],
  opacities = [0.04, 0.04, 0.08, 0.08, 0.14, 0.18, 0.24, 0.32, 0.48, 0.72],
  totalSize = 22,
  dotSize = 4,
  reverse = false,
  center = ['x', 'y'],
}) {
  const uniforms = useMemo(() => {
    let colorsArray = [colors[0], colors[0], colors[0], colors[0], colors[0], colors[0]]

    if (colors.length === 2) {
      colorsArray = [colors[0], colors[0], colors[0], colors[1], colors[1], colors[1]]
    } else if (colors.length >= 3) {
      colorsArray = [colors[0], colors[0], colors[1], colors[1], colors[2], colors[2]]
    }

    return {
      u_colors: {
        value: colorsArray.map((color) => [color[0] / 255, color[1] / 255, color[2] / 255]),
        type: 'uniform3fv',
      },
      u_opacities: {
        value: opacities,
        type: 'uniform1fv',
      },
      u_total_size: {
        value: totalSize,
        type: 'uniform1f',
      },
      u_dot_size: {
        value: dotSize,
        type: 'uniform1f',
      },
      u_reverse: {
        value: reverse ? 1 : 0,
        type: 'uniform1i',
      },
    }
  }, [colors, dotSize, opacities, reverse, totalSize])

  return (
    <Shader
      source={`
        precision mediump float;
        in vec2 fragCoord;

        uniform float u_time;
        uniform float u_opacities[10];
        uniform vec3 u_colors[6];
        uniform float u_total_size;
        uniform float u_dot_size;
        uniform vec2 u_resolution;
        uniform int u_reverse;

        out vec4 fragColor;

        float PHI = 1.61803398874989484820459;

        float random(vec2 xy) {
          return fract(tan(distance(xy * PHI, xy) * 0.5) * xy.x);
        }

        void main() {
          vec2 st = fragCoord.xy;
          ${center.includes('x') ? 'st.x -= abs(floor((mod(u_resolution.x, u_total_size) - u_dot_size) * 0.5));' : ''}
          ${center.includes('y') ? 'st.y -= abs(floor((mod(u_resolution.y, u_total_size) - u_dot_size) * 0.5));' : ''}

          float opacity = step(0.0, st.x);
          opacity *= step(0.0, st.y);

          vec2 st2 = vec2(int(st.x / u_total_size), int(st.y / u_total_size));
          float show_offset = random(st2);
          float rand = random(st2 * floor((u_time / 5.0) + show_offset + 5.0));

          opacity *= u_opacities[int(rand * 10.0)];
          opacity *= 1.0 - step(u_dot_size / u_total_size, fract(st.x / u_total_size));
          opacity *= 1.0 - step(u_dot_size / u_total_size, fract(st.y / u_total_size));

          vec3 color = u_colors[int(show_offset * 6.0)];
          vec2 center_grid = u_resolution / 2.0 / u_total_size;
          float dist_from_center = distance(center_grid, st2);
          float max_grid_dist = distance(center_grid, vec2(0.0, 0.0));
          float timing_intro = dist_from_center * 0.01 + (random(st2) * 0.15);
          float timing_outro = (max_grid_dist - dist_from_center) * 0.02 + (random(st2 + 42.0) * 0.2);
          float animation_time = u_time * 0.55;

          if (u_reverse == 1) {
            opacity *= 1.0 - step(timing_outro, animation_time);
          } else {
            opacity *= step(timing_intro, animation_time);
          }

          fragColor = vec4(color, opacity);
          fragColor.rgb *= fragColor.a;
        }
      `}
      uniforms={uniforms}
    />
  )
}

export function CanvasRevealEffect({
  opacities,
  colors,
  containerClassName,
  dotSize,
  showGradient = true,
  reverse = false,
}) {
  return (
    <div className={cn('relative h-full w-full overflow-hidden', containerClassName)}>
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-80 [animation:canvas-reveal-drift_10s_linear_infinite]"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(255,255,255,0.34) 0 2px, transparent 2.6px), radial-gradient(circle, rgba(168,85,247,0.24) 0 1.8px, transparent 2.5px)',
          backgroundPosition: '0 0, 13px 13px',
          backgroundSize: '26px 26px',
        }}
      />
      <DotMatrix
        colors={colors}
        dotSize={dotSize}
        opacities={opacities}
        reverse={reverse}
      />
      {showGradient && <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />}
      <style>{`
        @keyframes canvas-reveal-drift {
          from { transform: translate3d(0, 0, 0); }
          to { transform: translate3d(26px, 26px, 0); }
        }
      `}</style>
    </div>
  )
}
