import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const VERTEX_SHADER = `
attribute vec2 aAnimation;
attribute vec3 aTranslation;
attribute vec3 aControlPoint0;
attribute vec3 aControlPoint1;
attribute vec4 aAxisAngle;
attribute vec3 aFrontColor;
attribute vec3 aBackColor;

uniform float uTime;

varying vec3 vFrontColor;
varying vec3 vBackColor;

vec3 rotateVector(vec4 q, vec3 v) {
  return v + 2.0 * cross(q.xyz, cross(q.xyz, v) + q.w * v);
}

vec4 quatFromAxisAngle(vec3 axis, float angle) {
  float halfAngle = angle * 0.5;
  return vec4(axis.xyz * sin(halfAngle), cos(halfAngle));
}

vec3 cubicBezier(vec3 p0, vec3 p1, vec3 c0, vec3 c1, float t) {
  float tn = 1.0 - t;
  return tn * tn * tn * p0 + 3.0 * tn * tn * t * c0 + 3.0 * tn * t * t * c1 + t * t * t * p1;
}

float easeOutQuart(float t, float b, float c, float d) {
  t = t / d - 1.0;
  return -c * (t * t * t * t - 1.0) + b;
}

void main() {
  float tDelay = aAnimation.x;
  float tDuration = aAnimation.y;
  float tTime = clamp(uTime - tDelay, 0.0, tDuration);
  float tProgress = easeOutQuart(tTime, 0.0, 1.0, tDuration);

  vec3 tPosition = position;
  vec4 tQuat = quatFromAxisAngle(aAxisAngle.xyz, aAxisAngle.w * tProgress);
  tPosition = rotateVector(tQuat, tPosition);

  vec3 tp0 = tPosition;
  vec3 tp1 = tPosition + aTranslation;
  vec3 tc0 = tPosition + aControlPoint0;
  vec3 tc1 = tPosition + aControlPoint1;
  tPosition = cubicBezier(tp0, tp1, tc0, tc1, tProgress);

  vFrontColor = aFrontColor;
  vBackColor = aBackColor;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(tPosition, 1.0);
}
`

const FRAGMENT_SHADER = `
varying vec3 vFrontColor;
varying vec3 vBackColor;

void main() {
  if (gl_FrontFacing) {
    gl_FragColor = vec4(vFrontColor, 1.0);
  } else {
    gl_FragColor = vec4(vBackColor, 1.0);
  }
}
`

// Valentine palette (RGB 0-1)
const PALETTE = [
  [1.0, 0.18, 0.42],   // rose
  [1.0, 0.85, 0.24],   // gold
  [0.55, 0.36, 0.96],  // violet
  [1.0, 0.56, 0.56],   // coral
  [0.37, 0.84, 0.78],  // teal
  [0.78, 0.41, 0.82],  // magenta
]

function randomRange(min, max) {
  return Math.random() * (max - min) + min
}

export default function ConfettiCanvas({ active, onComplete }) {
  const containerRef = useRef(null)
  const rafRef = useRef(null)
  const timeRef = useRef(0)
  const endTime = 14

  useEffect(() => {
    if (!active || !containerRef.current) return

    const container = containerRef.current
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 2000)
    camera.position.set(0, 0, 6)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x000000, 0)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    const confettiCount = 5000
    const quads = confettiCount
    const triangles = quads * 2
    const vertices = triangles * 3
    const halfW = 0.018
    const halfH = halfW * 0.6
    const verts = [
      [-halfW, halfH, 0], [halfW, halfH, 0], [halfW, -halfH, 0],
      [-halfW, halfH, 0], [halfW, -halfH, 0], [-halfW, -halfH, 0],
    ]

    const position = new Float32Array(vertices * 3)
    const aAnimation = new Float32Array(vertices * 2)
    const aTranslation = new Float32Array(vertices * 3)
    const aControlPoint0 = new Float32Array(vertices * 3)
    const aControlPoint1 = new Float32Array(vertices * 3)
    const aAxisAngle = new Float32Array(vertices * 4)
    const aFrontColor = new Float32Array(vertices * 3)
    const aBackColor = new Float32Array(vertices * 3)

    for (let i = 0; i < quads; i++) {
      const delay = randomRange(0, 3)
      const duration = randomRange(6, 10)
      for (let j = 0; j < 6; j++) {
        const vi = (i * 6 + j) * 3
        position[vi] = verts[j][0]
        position[vi + 1] = verts[j][1]
        position[vi + 2] = verts[j][2]
      }
      const tx = randomRange(-3, 3)
      const tz = randomRange(-3, 3)
      const phi = Math.random() * Math.PI * 2
      const r = 2 + Math.random() * 2
      const ty = randomRange(-2, 1)
      const ax = Math.random() * 2 - 1
      const az = Math.random() * 2 - 1
      const len = Math.sqrt(ax * ax + az * az) || 1
      ax /= len
      az /= len
      const angle = Math.PI * randomRange(20, 60)

      const cp0x = randomRange(-1, 1)
      const cp0y = randomRange(4, 8)
      const cp0z = randomRange(-1, 1)
      const cp1x = randomRange(-4, 4)
      const cp1y = randomRange(2, 6)
      const cp1z = randomRange(-4, 4)

      const col = PALETTE[i % PALETTE.length]
      const back = col.map(c => c * 0.7)

      for (let j = 0; j < 6; j++) {
        const base = (i * 6 + j) * 2
        aAnimation[base] = delay
        aAnimation[base + 1] = duration
      }
      for (let j = 0; j < 6; j++) {
        const base = (i * 6 + j) * 3
        aTranslation[base] = tx + r * Math.cos(phi)
        aTranslation[base + 1] = ty
        aTranslation[base + 2] = tz + r * Math.sin(phi)
      }
      for (let j = 0; j < 6; j++) {
        const base = (i * 6 + j) * 3
        aControlPoint0[base] = cp0x
        aControlPoint0[base + 1] = cp0y
        aControlPoint0[base + 2] = cp0z
        aControlPoint1[base] = cp1x
        aControlPoint1[base + 1] = cp1y
        aControlPoint1[base + 2] = cp1z
      }
      for (let j = 0; j < 6; j++) {
        const base = (i * 6 + j) * 4
        aAxisAngle[base] = ax
        aAxisAngle[base + 1] = 0
        aAxisAngle[base + 2] = az
        aAxisAngle[base + 3] = angle
      }
      for (let j = 0; j < 6; j++) {
        const base = (i * 6 + j) * 3
        aFrontColor[base] = col[0]
        aFrontColor[base + 1] = col[1]
        aFrontColor[base + 2] = col[2]
        aBackColor[base] = back[0]
        aBackColor[base + 1] = back[1]
        aBackColor[base + 2] = back[2]
      }
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(position, 3))
    geometry.setAttribute('aAnimation', new THREE.BufferAttribute(aAnimation, 2))
    geometry.setAttribute('aTranslation', new THREE.BufferAttribute(aTranslation, 3))
    geometry.setAttribute('aControlPoint0', new THREE.BufferAttribute(aControlPoint0, 3))
    geometry.setAttribute('aControlPoint1', new THREE.BufferAttribute(aControlPoint1, 3))
    geometry.setAttribute('aAxisAngle', new THREE.BufferAttribute(aAxisAngle, 4))
    geometry.setAttribute('aFrontColor', new THREE.BufferAttribute(aFrontColor, 3))
    geometry.setAttribute('aBackColor', new THREE.BufferAttribute(aBackColor, 3))

    const material = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 } },
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      side: THREE.DoubleSide,
      transparent: true,
      depthWrite: false,
    })

    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    let completed = false
    function tick() {
      if (completed) return
      rafRef.current = requestAnimationFrame(tick)
      timeRef.current += 1 / 60
      const t = timeRef.current
      if (t >= endTime) {
        completed = true
        onComplete?.()
        return
      }
      material.uniforms.uTime.value = t
      renderer.render(scene, camera)
    }
    tick()

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', onResize)

    return () => {
      completed = true
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
      geometry.dispose()
      material.dispose()
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement)
    }
  }, [active, onComplete])

  if (!active) return null
  return <div ref={containerRef} className="confetti-canvas-wrap" aria-hidden="true" />
}
