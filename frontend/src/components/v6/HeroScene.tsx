'use client'

import { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Icosahedron, Sphere, Stars } from '@react-three/drei'
import * as THREE from 'three'

// ─── Dispose helper — prevents VRAM leak on unmount ───────────────────────
function SceneDisposer() {
  const { gl, scene } = useThree()
  useEffect(() => {
    return () => {
      scene.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const mesh = obj as THREE.Mesh
          mesh.geometry?.dispose()
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach(m => m.dispose())
          } else {
            (mesh.material as THREE.Material)?.dispose()
          }
        }
      })
      gl.dispose()
    }
  }, [gl, scene])
  return null
}

// ─── Evidence Orb ─────────────────────────────────────────────────────────
function EvidenceOrb() {
  const meshRef = useRef<THREE.Mesh>(null)
  const wireRef = useRef<THREE.Mesh>(null)
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.12
      meshRef.current.rotation.x = t * 0.05
    }
    if (wireRef.current) {
      wireRef.current.rotation.y = -t * 0.08
      wireRef.current.rotation.z = t * 0.04
    }
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(t * 0.5) * 0.15
    }
  })

  return (
    <group ref={groupRef}>
      <Icosahedron ref={meshRef} args={[1, 0]}>
        <meshStandardMaterial
          color="#4F6EF7"
          emissive="#1a2a80"
          emissiveIntensity={0.5}
          metalness={0.9}
          roughness={0.1}
          transparent
          opacity={0.85}
        />
      </Icosahedron>

      <Icosahedron ref={wireRef} args={[1.35, 1]}>
        <meshBasicMaterial color="#818CF8" wireframe transparent opacity={0.15} />
      </Icosahedron>

      <Sphere args={[0.65, 32, 32]}>
        <meshStandardMaterial
          color="#6366f1"
          emissive="#4F6EF7"
          emissiveIntensity={1.2}
          transparent
          opacity={0.4}
        />
      </Sphere>
    </group>
  )
}

// ─── Evidence Nodes ────────────────────────────────────────────────────────
function EvidenceNodes() {
  // Reduce particle count on mobile/low-DPR devices
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
  const nodeCount = isMobile ? 6 : 12

  const nodes = useMemo(() => {
    return Array.from({ length: nodeCount }, (_, i) => {
      const phi   = Math.acos(-1 + (2 * i) / nodeCount)
      const theta = Math.sqrt(nodeCount * Math.PI) * phi
      const r = 2.8
      return {
        x: r * Math.sin(phi) * Math.cos(theta),
        y: r * Math.sin(phi) * Math.sin(theta),
        z: r * Math.cos(phi),
        speed: 0.3 + (i * 0.03),   // deterministic — avoids Math.random() on server
        phase: i * 0.52
      }
    })
  }, [nodeCount])

  const groupRef = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.elapsedTime * 0.07
    }
  })

  return (
    <group ref={groupRef}>
      {nodes.map((n, i) => (
        <EvidenceNode key={i} {...n} />
      ))}
    </group>
  )
}

function EvidenceNode({ x, y, z, speed, phase }: {
  x: number; y: number; z: number; speed: number; phase: number
}) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    if (ref.current) {
      const s = 0.9 + Math.sin(clock.elapsedTime * speed + phase) * 0.15
      ref.current.scale.setScalar(s)
    }
  })

  return (
    <Sphere ref={ref} args={[0.06, 8, 8]} position={[x, y, z]}>
      <meshStandardMaterial
        color="#22C55E"
        emissive="#22C55E"
        emissiveIntensity={1.5}
        transparent
        opacity={0.9}
      />
    </Sphere>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────
export function HeroScene() {
  // Cap DPR: prevents 3x-DPR mobile GPUs from over-rendering
  const dpr: [number, number] = [1, Math.min(window.devicePixelRatio, 1.5)]

  // Reduce star count on mobile
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
  const starCount = isMobile ? 1200 : 3000

  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 55 }}
      dpr={dpr}
      style={{ background: 'transparent' }}
      // frameloop="demand" stops the GPU render loop when idle.
      // Call invalidate() on any state change to trigger a re-render.
      // For an ambient animation scene, we use "always" but throttle via clock.
      // Using "demand" here would stop the rotation — keep "always" for the orb
      // but add performance.regress to auto-degrade on low-end devices.
      performance={{ min: 0.5 }}
    >
      <SceneDisposer />
      <Stars
        radius={80}
        depth={50}
        count={starCount}
        factor={3}
        fade
        speed={0.5}
      />
      <ambientLight intensity={0.4} />
      <pointLight position={[4, 4, 4]} intensity={1.5} color="#4F6EF7" />
      <pointLight position={[-4, -2, -4]} intensity={0.8} color="#22C55E" />
      <pointLight position={[0, -4, 2]} intensity={0.4} color="#818CF8" />
      <EvidenceOrb />
      <EvidenceNodes />
    </Canvas>
  )
}
