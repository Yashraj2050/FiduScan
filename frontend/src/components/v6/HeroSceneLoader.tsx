'use client'

import dynamic from 'next/dynamic'

const HeroScene = dynamic(
  () => import('@/components/v6/HeroScene').then(m => m.HeroScene),
  {
    ssr: false,
    loading: () => (
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(79,110,247,0.06) 0%, transparent 70%)',
      }} />
    )
  }
)

export function HeroSceneLoader() {
  return <HeroScene />
}
