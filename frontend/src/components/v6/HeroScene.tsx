'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Icosahedron, Sphere, Stars } from '@react-three/drei'
import * as THREE from 'three'

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
      {/* Core solid */}
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

      {/* Wireframe outer shell */}
      <Icosahedron ref={wireRef} args={[1.35, 1]}>
        <meshBasicMaterial
          color="#818CF8"
          wireframe
          transparent
          opacity={0.15}
        />
      </Icosahedron>

      {/* Inner glow sphere */}
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

function EvidenceNodes() {
  const nodeCount = 12
  const nodes = useMemo(() => {
    return Array.from({ length: nodeCount }, (_, i) => {
      const phi   = Math.acos(-1 + (2 * i) / nodeCount)
      const theta = Math.sqrt(nodeCount * Math.PI) * phi
      const r = 2.8
      return {
        x: r * Math.sin(phi) * Math.cos(theta),
        y: r * Math.sin(phi) * Math.sin(theta),
        z: r * Math.cos(phi),
        speed: 0.3 + Math.random() * 0.2,
        phase: Math.random() * Math.PI * 2
      }
    })
  }, [])

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

export function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 55 }}
      dpr={[1, 2]}
      style={{ background: 'transparent' }}
    >
      <Stars radius={80} depth={50} count={3000} factor={3} fade speed={0.5} />
      <ambientLight intensity={0.4} />
      <pointLight position={[4, 4, 4]} intensity={1.5} color="#4F6EF7" />
      <pointLight position={[-4, -2, -4]} intensity={0.8} color="#22C55E" />
      <pointLight position={[0, -4, 2]} intensity={0.4} color="#818CF8" />
      <EvidenceOrb />
      <EvidenceNodes />
    </Canvas>
  )
}
