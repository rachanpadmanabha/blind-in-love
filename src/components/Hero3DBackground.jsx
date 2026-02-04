import { useEffect, useRef } from 'react'
import * as THREE from 'three'

// Classic parametric heart: two lobes at top, point at bottom.
// x = 16*sin³(t), y = 13*cos(t) - 5*cos(2t) - 2*cos(3t) - cos(4t), t in [0, 2π]
function createHeartShape(scale) {
  const shape = new THREE.Shape()
  const steps = 32
  const norm = scale / 20
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * Math.PI * 2
    const x = 16 * Math.pow(Math.sin(t), 3)
    const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)
    const px = x * norm
    const py = -y * norm // flip so point is at bottom (negative Y) in Three.js
    if (i === 0) shape.moveTo(px, py)
    else shape.lineTo(px, py)
  }
  return shape
}

function createHeartGeometry(scale = 1) {
  const shape = createHeartShape(scale)
  const extrudeSettings = {
    depth: 0.12 * scale,
    bevelEnabled: true,
    bevelSegments: 3,
    bevelSize: 0.06 * scale,
    bevelThickness: 0.04 * scale,
    steps: 1,
  }
  return new THREE.ExtrudeGeometry(shape, extrudeSettings)
}

export default function Hero3DBackground() {
  const containerRef = useRef(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const frameRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(58, window.innerWidth / window.innerHeight, 0.1, 100)
    camera.position.set(0, 0, 3.2)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x000000, 0)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    // Single 3D heart – right-side up, prominent
    const heartScale = 0.7
    const heartGeometry = createHeartGeometry(heartScale)
    const heartMaterial = new THREE.MeshStandardMaterial({
      color: 0xff2d6a,
      emissive: 0xff1744,
      emissiveIntensity: 0.35,
      metalness: 0.15,
      roughness: 0.5,
      transparent: true,
      opacity: 1,
    })
    const heart = new THREE.Mesh(heartGeometry, heartMaterial)
    heart.position.set(0, 0, 0)
    // Shape is in XY with point at bottom (negative Y), lobes at top – already right-side up
    scene.add(heart)

    // Soft back light so the heart has depth
    const ambient = new THREE.AmbientLight(0xffe4ec, 0.5)
    scene.add(ambient)
    const keyLight = new THREE.DirectionalLight(0xffffff, 0.5)
    keyLight.position.set(2, 1, 2)
    scene.add(keyLight)
    const fillLight = new THREE.PointLight(0xff8e8e, 0.4, 6)
    fillLight.position.set(-1, -0.5, 1)
    scene.add(fillLight)

    // A few large, soft “atmosphere” spheres in the back – no confetti, just depth
    const sphereGeos = []
    const sphereMeshes = []
    const orbCount = 3
    const orbColors = [0xff2d6a, 0x8b5cf6, 0xffd93d]
    const orbScales = [0.8, 0.6, 0.5]
    const orbOffsets = [
      new THREE.Vector3(0.6, 0.3, -1.2),
      new THREE.Vector3(-0.5, -0.2, -1.5),
      new THREE.Vector3(0.2, 0.5, -1),
    ]
    for (let i = 0; i < orbCount; i++) {
      const g = new THREE.SphereGeometry(orbScales[i], 32, 32)
      const m = new THREE.MeshBasicMaterial({
        color: orbColors[i],
        transparent: true,
        opacity: 0.08,
        depthWrite: false,
      })
      const mesh = new THREE.Mesh(g, m)
      mesh.position.copy(orbOffsets[i])
      scene.add(mesh)
      sphereGeos.push(g)
      sphereMeshes.push(mesh)
    }

    let time = 0
    function tick() {
      frameRef.current = requestAnimationFrame(tick)
      time += 0.016

      // Gentle rotation and float
      heart.rotation.y = time * 0.12
      heart.position.y = Math.sin(time * 0.4) * 0.04

      // Subtle mouse parallax
      const mx = mouseRef.current.x
      const my = mouseRef.current.y
      camera.position.x = THREE.MathUtils.lerp(camera.position.x, mx * 0.15, 0.03)
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, my * 0.15, 0.03)
      camera.lookAt(0, 0, 0)

      // Orbs drift very slowly
      sphereMeshes[0].position.x = orbOffsets[0].x + Math.sin(time * 0.2) * 0.1
      sphereMeshes[1].position.y = orbOffsets[1].y + Math.cos(time * 0.15) * 0.08
      sphereMeshes[2].position.x = orbOffsets[2].x + Math.cos(time * 0.25) * 0.06

      renderer.render(scene, camera)
    }
    tick()

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    const onMouseMove = (e) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    }

    window.addEventListener('resize', onResize)
    window.addEventListener('mousemove', onMouseMove)

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('mousemove', onMouseMove)
      heartGeometry.dispose()
      heartMaterial.dispose()
      sphereGeos.forEach(g => g.dispose())
      sphereMeshes.forEach(m => m.material.dispose())
      renderer.dispose()
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={containerRef} className="hero-3d-wrap" aria-hidden="true" />
}
