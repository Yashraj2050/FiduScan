import type { Metadata } from 'next'
import Link from 'next/link'
import { Fingerprint, ScanLine, Link2, ShieldAlert, ArrowRight, Activity, Terminal } from 'lucide-react'

export const metadata: Metadata = {
  title: 'FiduScan — Digital Forensic Intelligence',
  description: 'Forensic platform for deepfake detection, media authenticity verification, and immutable evidence anchoring.',
}

const CAPABILITIES = [
  {
    icon: ScanLine,
    title: 'Deepfake & Manipulation Analysis',
    desc: 'Analyzes compression artifacts, facial geometry, and temporal inconsistencies across media formats. Detects synthetic generation and digital tampering with forensic precision.'
  },
  {
    icon: Fingerprint,
    title: 'Media Authentication & Tracing',
    desc: 'Embeds imperceptible forensic watermarks into digital assets. Cryptographically verifies origin, ownership, and chain of custody.'
  },
  {
    icon: Link2,
    title: 'Immutable Evidence Ledger',
    desc: 'Anchors evidence hashes directly to the blockchain. Provides cryptographically sound proof of existence and state that is legally admissible.'
  },
  {
    icon: ShieldAlert,
    title: 'Integrity Verification',
    desc: 'Automated authenticity scoring using multi-modal AI models. Flags synthetic content, deepfakes, and adversarial manipulations.'
  }
]

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--fs-bg)', color: 'var(--fs-text-1)', display: 'flex', flexDirection: 'column' }}>

      {/* ── Minimal Header ──────────────────────────────────────── */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        height: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 40px',
        background: 'rgba(5, 5, 5, 0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--fs-border)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 24, height: 24, background: 'var(--fs-text-1)', color: 'var(--fs-text-inverse)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--r-xs)'
          }}>
            <Fingerprint size={14} strokeWidth={2} />
          </div>
          <span style={{ fontWeight: 500, fontSize: '0.9375rem', letterSpacing: '-0.02em' }}>FiduScan</span>
          <div style={{ width: 1, height: 16, background: 'var(--fs-border-strong)', margin: '0 8px' }} />
          <span className="fs-mono" style={{ fontSize: '0.75rem', color: 'var(--fs-text-3)' }}>SYSTEM.CORE</span>
        </div>
        <nav aria-label="Top navigation" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link href="/developer" className="fs-nav-item" style={{ fontSize: '0.8125rem' }}>Documentation</Link>
          <Link href="/dashboard" className="fs-btn fs-btn-primary fs-btn-sm" style={{ padding: '0 16px' }}>
            Initialize Workspace
          </Link>
        </nav>
      </header>

      {/* ── Hero ────────────────────────────────────────────────── */}
      <section style={{
        position: 'relative', 
        padding: '160px 40px 120px', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        borderBottom: '1px solid var(--fs-border)',
        overflow: 'hidden'
      }}>
        {/* Subtle grid background */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0,
          backgroundImage: 'linear-gradient(var(--fs-border) 1px, transparent 1px), linear-gradient(90deg, var(--fs-border) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          opacity: 0.3,
          maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 20%, transparent 70%)'
        }} aria-hidden="true" />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 840, width: '100%' }}>
          
          <div className="animate-fade-in" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
            <span className="fs-status-dot verified pulse" />
            <span className="fs-mono" style={{ color: 'var(--fs-verified)', letterSpacing: '0.05em' }}>STATUS: OPERATIONAL</span>
          </div>

          <h1 className="fs-h1 animate-fade-in delay-100" style={{ marginBottom: 24, fontSize: 'clamp(2.5rem, 5vw, 4rem)', letterSpacing: '-0.04em' }}>
            Digital Evidence.<br />
            Forensic Intelligence.<br />
            Cryptographic Proof.
          </h1>

          <p className="animate-fade-in delay-200" style={{
            fontSize: '1.125rem', color: 'var(--fs-text-2)', lineHeight: 1.6,
            maxWidth: 640, marginBottom: 48
          }}>
            FiduScan is a forensic intelligence platform. We analyze media for synthetic generation, establish immutable chains of custody, and provide cryptographically sound verification of digital evidence.
          </p>

          <div className="animate-fade-in delay-300" style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <Link href="/dashboard" className="fs-btn fs-btn-primary fs-btn-lg" style={{ minWidth: 200, justifyContent: 'space-between' }}>
              Access Platform <ArrowRight size={16} />
            </Link>
            <Link href="/developer" className="fs-btn fs-btn-secondary fs-btn-lg" style={{ minWidth: 160 }}>
              View Architecture
            </Link>
          </div>

          {/* Technical Restrained Visualization */}
          <div className="animate-fade-up delay-400" style={{
            marginTop: 80,
            background: 'var(--fs-surface)',
            border: '1px solid var(--fs-border)',
            borderRadius: 'var(--r-md)',
            padding: '24px 32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            color: 'var(--fs-text-3)',
            position: 'relative'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
              <Terminal size={16} color="var(--fs-text-2)" style={{ marginBottom: 8 }} />
              <span>INGEST</span>
              <span style={{ color: 'var(--fs-text-1)' }}>EVIDENCE_RAW</span>
            </div>
            
            <div style={{ flex: 1, height: 1, background: 'var(--fs-border-strong)', margin: '0 24px', position: 'relative' }}>
              <div style={{ position: 'absolute', top: -3, left: '50%', transform: 'translateX(-50%)', background: 'var(--fs-surface)', padding: '0 8px', color: 'var(--fs-text-2)' }}>
                <Activity size={12} />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
              <ScanLine size={16} color="var(--fs-text-2)" style={{ marginBottom: 8 }} />
              <span>ANALYZE</span>
              <span style={{ color: 'var(--fs-text-1)' }}>MODEL_V3.1</span>
            </div>

            <div style={{ flex: 1, height: 1, background: 'var(--fs-border-strong)', margin: '0 24px', position: 'relative' }}>
               <div style={{ position: 'absolute', top: -3, left: '50%', transform: 'translateX(-50%)', background: 'var(--fs-surface)', padding: '0 8px', color: 'var(--fs-text-2)' }}>
                <ArrowRight size={12} />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
              <Fingerprint size={16} color="var(--fs-verified)" style={{ marginBottom: 8 }} />
              <span>VERIFY</span>
              <span style={{ color: 'var(--fs-verified)' }}>AUTH_99.4%</span>
            </div>

            <div style={{ flex: 1, height: 1, background: 'var(--fs-border-strong)', margin: '0 24px', position: 'relative' }}>
               <div style={{ position: 'absolute', top: -3, left: '50%', transform: 'translateX(-50%)', background: 'var(--fs-surface)', padding: '0 8px', color: 'var(--fs-text-2)' }}>
                <Link2 size={12} />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
              <ShieldAlert size={16} color="var(--fs-text-2)" style={{ marginBottom: 8 }} />
              <span>ANCHOR</span>
              <span style={{ color: 'var(--fs-text-1)' }}>0x7A9B...4F21</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Capabilities ─────────────────────────────────────────── */}
      <section style={{ padding: '120px 40px', borderBottom: '1px solid var(--fs-border)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          
          <div style={{ marginBottom: 80 }}>
            <div className="fs-mono" style={{ color: 'var(--fs-text-3)', marginBottom: 16 }}>01 // ARCHITECTURE</div>
            <h2 className="fs-h2" style={{ maxWidth: 500 }}>Engineered for absolute technical certainty.</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 40, borderTop: '1px solid var(--fs-border)', paddingTop: 40 }}>
            {CAPABILITIES.map((cap, i) => {
              const Icon = cap.icon
              return (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <Icon size={20} color="var(--fs-text-1)" strokeWidth={1.5} />
                  <h3 className="fs-h3">{cap.title}</h3>
                  <p style={{ color: 'var(--fs-text-2)', fontSize: '0.875rem', lineHeight: 1.6 }}>{cap.desc}</p>
                </div>
              )
            })}
          </div>

        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer style={{
        padding: '32px 40px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: 'var(--fs-surface)',
        marginTop: 'auto'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span className="fs-mono" style={{ fontSize: '0.6875rem', color: 'var(--fs-text-3)' }}>SYS.VERSION 6.0</span>
          <span className="fs-mono" style={{ fontSize: '0.6875rem', color: 'var(--fs-text-3)' }}>© 2026 FIDUSCAN INTELLIGENCE</span>
        </div>
        <div style={{ display: 'flex', gap: 24 }}>
          <Link href="/developer" className="fs-mono" style={{ fontSize: '0.6875rem', color: 'var(--fs-text-2)', textDecoration: 'none' }}>API REFERENCE</Link>
          <Link href="/settings" className="fs-mono" style={{ fontSize: '0.6875rem', color: 'var(--fs-text-2)', textDecoration: 'none' }}>PROTOCOLS</Link>
        </div>
      </footer>
    </div>
  )
}
