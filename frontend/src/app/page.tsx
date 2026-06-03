'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { Shield, Droplets, Link2, FileText, ChevronRight, Check } from 'lucide-react'

const HeroScene = dynamic(
  () => import('@/components/v6/HeroScene').then(m => m.HeroScene),
  { ssr: false, loading: () => <div style={{ flex: 1 }} /> }
)

const FEATURES = [
  {
    icon: Shield,
    color: '#4F6EF7',
    bg: 'rgba(79,110,247,0.1)',
    title: 'Deepfake Detection',
    desc: 'Vision-Transformer model analyzes compression artifacts, facial geometry, and temporal inconsistencies across image, audio, and video media.'
  },
  {
    icon: Droplets,
    color: '#22C55E',
    bg: 'rgba(34,197,94,0.1)',
    title: 'Digital Watermarking',
    desc: 'Embed imperceptible forensic watermarks into your assets. Verify origin and detect unauthorized use across all media formats.'
  },
  {
    icon: Link2,
    color: '#818CF8',
    bg: 'rgba(129,140,248,0.1)',
    title: 'Evidence Chain',
    desc: 'Every scan creates an immutable chain of custody record. Track creation, verification, and access events with full audit trail.'
  },
  {
    icon: FileText,
    color: '#EAB308',
    bg: 'rgba(234,179,8,0.1)',
    title: 'Blockchain Anchoring',
    desc: 'Anchor evidence hashes to Polygon. Provide cryptographic proof of authenticity that no adversary can dispute in court.'
  }
]

const STATS = [
  { value: '99.3%', label: 'Detection Accuracy' },
  { value: '<2s',   label: 'Analysis Time' },
  { value: '100%',  label: 'Chain Integrity' },
  { value: '3',     label: 'Media Types' },
]

const TRUST = [
  'Forensic-grade SHA-256 integrity verification',
  'Polygon blockchain anchoring — immutable proof',
  'Full chain of custody with audit trail',
  'Enterprise RBAC with Reviewer & Approver roles',
  'PDF & JSON report export for legal proceedings',
]

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--fs-bg)' }}>

      {/* ── Topbar ──────────────────────────────────────────────── */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        height: 60,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 40px',
        background: 'rgba(8,9,12,0.8)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--fs-border)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 8,
            background: 'var(--fs-accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.6875rem', fontWeight: 700, color: '#fff'
          }}>FS</div>
          <span style={{ fontWeight: 700, fontSize: '1rem', letterSpacing: '-0.03em' }}>FiduScan</span>
          <span className="fs-badge fs-badge-accent" style={{ marginLeft: 4 }}>Forensic Platform</span>
        </div>
        <nav style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Link href="/dashboard" className="fs-btn fs-btn-ghost" style={{ fontSize: '0.875rem' }}>Platform</Link>
          <Link href="/dashboard" className="fs-btn fs-btn-primary">
            Start Investigating <ChevronRight size={14} />
          </Link>
        </nav>
      </header>

      {/* ── Hero ────────────────────────────────────────────────── */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        {/* 3D Canvas */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <HeroScene />
        </div>

        {/* Radial vignette */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1,
          background: 'radial-gradient(ellipse 70% 60% at 50% 50%, transparent 0%, var(--fs-bg) 100%)',
          pointerEvents: 'none'
        }} />

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '80px 24px 40px', maxWidth: 780 }}>
          <div className="fs-badge fs-badge-chain animate-fade-up" style={{ marginBottom: 24, fontSize: '0.75rem' }}>
            <span className="fs-status-dot verified pulse" />
            Digital Authenticity Intelligence
          </div>

          <h1 className="fs-h1 animate-fade-up delay-100" style={{ marginBottom: 20 }}>
            Verify. Authenticate.{' '}
            <span className="fs-gradient-text">Anchor.</span>
          </h1>

          <p className="animate-fade-up delay-200" style={{
            fontSize: '1.125rem', color: 'var(--fs-text-2)', lineHeight: 1.65,
            maxWidth: 600, margin: '0 auto 40px'
          }}>
            Enterprise forensic platform for deepfake detection, digital watermarking, and immutable evidence chains. Built for investigators who require legal-grade proof.
          </p>

          <div className="animate-fade-up delay-300" style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/dashboard" className="fs-btn fs-btn-primary fs-btn-lg">
              Open Platform <ChevronRight size={16} />
            </Link>
            <Link href="/dashboard" className="fs-btn fs-btn-secondary fs-btn-lg">
              View Demo
            </Link>
          </div>
        </div>

        {/* Stats bar */}
        <div className="animate-fade-up delay-400" style={{
          position: 'relative', zIndex: 2,
          display: 'flex', gap: 0,
          background: 'var(--fs-panel)',
          border: '1px solid var(--fs-border)',
          borderRadius: 'var(--r-xl)',
          overflow: 'hidden',
          marginTop: 60,
        }}>
          {STATS.map((s, i) => (
            <div key={i} style={{
              padding: '20px 36px',
              textAlign: 'center',
              borderRight: i < STATS.length - 1 ? '1px solid var(--fs-border)' : 'none'
            }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.04em', color: 'var(--fs-text-1)' }}>{s.value}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--fs-text-3)', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Scroll hint */}
        <div style={{ position: 'absolute', bottom: 32, zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: '0.6875rem', color: 'var(--fs-text-3)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Discover</span>
          <div style={{ width: 1, height: 40, background: 'linear-gradient(to bottom, var(--fs-border-strong), transparent)' }} />
        </div>
      </section>

      {/* ── Features ────────────────────────────────────────────── */}
      <section style={{ padding: '120px 40px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 72 }}>
          <div className="fs-label" style={{ marginBottom: 16 }}>Capabilities</div>
          <h2 className="fs-h2">Built for forensic-grade verification</h2>
          <p style={{ color: 'var(--fs-text-2)', maxWidth: 560, margin: '16px auto 0', lineHeight: 1.6 }}>
            A unified workflow from evidence collection through blockchain anchoring, designed to withstand legal scrutiny.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
          {FEATURES.map((f, i) => {
            const Icon = f.icon
            return (
              <div key={i} className="fs-feature-card">
                <div className="fs-feature-icon" style={{ background: f.bg }}>
                  <Icon size={20} color={f.color} />
                </div>
                <h3 style={{ fontSize: '1.0625rem', fontWeight: 600, marginBottom: 10, letterSpacing: '-0.02em' }}>{f.title}</h3>
                <p style={{ color: 'var(--fs-text-2)', lineHeight: 1.65, fontSize: '0.875rem' }}>{f.desc}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── Trust Signal ────────────────────────────────────────── */}
      <section style={{
        padding: '80px 40px',
        borderTop: '1px solid var(--fs-border)',
        borderBottom: '1px solid var(--fs-border)',
        background: 'var(--fs-surface)',
      }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
          <div>
            <div className="fs-label" style={{ marginBottom: 16 }}>Forensic Standards</div>
            <h2 className="fs-h2" style={{ marginBottom: 16 }}>Evidence that holds up.</h2>
            <p style={{ color: 'var(--fs-text-2)', lineHeight: 1.7, marginBottom: 32 }}>
              FiduScan is engineered for investigations where the integrity of digital evidence is non-negotiable.
              Every operation is logged, every hash is anchored, every audit trail is preserved.
            </p>
            <Link href="/dashboard" className="fs-btn fs-btn-primary">
              Open Investigation <ChevronRight size={14} />
            </Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {TRUST.map((item, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '14px 18px',
                background: 'var(--fs-panel)',
                border: '1px solid var(--fs-border)',
                borderRadius: 'var(--r-md)',
              }}>
                <div style={{
                  width: 22, height: 22, borderRadius: '50%',
                  background: 'var(--fs-verified-dim)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>
                  <Check size={12} color="var(--fs-verified)" />
                </div>
                <span style={{ fontSize: '0.875rem', color: 'var(--fs-text-1)' }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────── */}
      <section style={{ padding: '120px 40px', textAlign: 'center' }}>
        <h2 className="fs-h2" style={{ marginBottom: 16 }}>Ready to investigate?</h2>
        <p style={{ color: 'var(--fs-text-2)', marginBottom: 40, fontSize: '1rem' }}>
          Open your first investigation. No setup required.
        </p>
        <Link href="/dashboard" className="fs-btn fs-btn-primary fs-btn-lg">
          Enter FiduScan Platform <ChevronRight size={16} />
        </Link>
      </section>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer style={{
        padding: '24px 40px',
        borderTop: '1px solid var(--fs-border)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <span style={{ fontSize: '0.8125rem', color: 'var(--fs-text-3)' }}>© 2025 FiduScan. Forensic Intelligence Platform.</span>
        <div style={{ display: 'flex', gap: 20 }}>
          <Link href="/developer" style={{ fontSize: '0.8125rem', color: 'var(--fs-text-3)', textDecoration: 'none' }}>API</Link>
          <Link href="/settings" style={{ fontSize: '0.8125rem', color: 'var(--fs-text-3)', textDecoration: 'none' }}>Privacy</Link>
        </div>
      </footer>
    </div>
  )
}
