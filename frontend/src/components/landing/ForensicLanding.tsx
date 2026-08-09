'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import ForensicCanvas from './ForensicCanvas';

// ─── Utility ──────────────────────────────────────────────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); obs.disconnect(); }
    }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

// ─── SHA-256 Hash Animation ────────────────────────────────────────────────────
function HashStream({ active }: { active: boolean }) {
  const hash = 'a3f8c2d9e1b47056f3a8c2d9e1b47056f3a8c2d9e1b47056f3a8c2d9e1b47056';
  const [revealed, setRevealed] = useState(0);

  useEffect(() => {
    if (!active) { setRevealed(0); return; }
    let i = 0;
    const t = setInterval(() => {
      i += 2;
      setRevealed(i);
      if (i >= hash.length) clearInterval(t);
    }, 22);
    return () => clearInterval(t);
  }, [active, hash.length]);

  return (
    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.04em', lineHeight: 1.8, color: 'rgba(255,255,255,0.25)' }}>
      <div style={{ color: 'rgba(255,255,255,0.35)', marginBottom: 4, fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.12em' }}>SHA-256</div>
      <span style={{ color: '#22C55E' }}>
        {hash.slice(0, revealed)}
      </span>
      <span style={{ color: 'rgba(255,255,255,0.1)' }}>
        {hash.slice(revealed)}
      </span>
    </div>
  );
}

// ─── Heatmap Visualization ────────────────────────────────────────────────────
function HeatmapViz({ active }: { active: boolean }) {
  const cols = 18;
  const rows = 12;
  const cells = cols * rows;

  const getHeat = (i: number) => {
    const x = (i % cols) / cols;
    const y = Math.floor(i / cols) / rows;
    const cx = 0.45, cy = 0.38;
    const dx = x - cx, dy = y - cy;
    const dist = Math.sqrt(dx * dx + dy * dy * 1.6);
    const base = Math.max(0, 1 - dist * 2.2);
    const secondary = Math.max(0, 0.6 - Math.sqrt((x - 0.72) ** 2 + (y - 0.55) ** 2) * 3);
    return base * 0.85 + secondary * 0.3 + Math.random() * 0.04;
  };

  const heatValues = Array.from({ length: cells }, (_, i) => getHeat(i));

  const heatColor = (v: number): string => {
    if (v < 0.1) return 'rgba(79,110,247,0.06)';
    if (v < 0.25) return `rgba(79,110,247,${(v * 0.5).toFixed(2)})`;
    if (v < 0.5) return `rgba(129,140,248,${(v * 0.6).toFixed(2)})`;
    if (v < 0.7) return `rgba(234,179,8,${(v * 0.7).toFixed(2)})`;
    if (v < 0.85) return `rgba(249,115,22,${(v * 0.8).toFixed(2)})`;
    return `rgba(239,68,68,${Math.min(v, 1).toFixed(2)})`;
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${cols}, 1fr)`,
      gap: 2,
      borderRadius: 8,
      overflow: 'hidden',
      padding: 2,
    }}>
      {heatValues.map((v, i) => (
        <div
          key={i}
          style={{
            aspectRatio: '1',
            borderRadius: 2,
            background: active ? heatColor(v) : 'rgba(255,255,255,0.03)',
            transition: `background ${0.6 + (i / cells) * 0.8}s ease`,
            transitionDelay: active ? `${(i / cells) * 0.5}s` : '0s',
          }}
        />
      ))}
    </div>
  );
}

// ─── Chain of Custody Timeline ─────────────────────────────────────────────────
function CustodyTimeline({ active }: { active: boolean }) {
  const events = [
    { id: 'EV-8821', action: 'INGESTED', actor: 'system', hash: 'a3f8c2d9', ts: '2025-06-12T19:04:48Z', color: '#4F6EF7' },
    { id: 'EV-8821', action: 'HASHED', actor: 'system', hash: 'b9d1e3f7', ts: '2025-06-12T19:04:49Z', color: '#818CF8' },
    { id: 'EV-8821', action: 'ANALYZED', actor: 'inference_v2', hash: 'c4a7f2e8', ts: '2025-06-12T19:04:51Z', color: '#22C55E' },
    { id: 'EV-8821', action: 'VERIFIED', actor: 'analyst_a', hash: 'd6b3e9a1', ts: '2025-06-12T19:11:22Z', color: '#EAB308' },
    { id: 'EV-8821', action: 'EXPORTED', actor: 'analyst_a', hash: 'e2c8f4d7', ts: '2025-06-12T19:15:03Z', color: '#22C55E' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {events.map((e, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            gap: 16,
            opacity: active ? 1 : 0,
            transform: active ? 'translateX(0)' : 'translateX(-12px)',
            transition: `all 0.4s ease ${i * 0.1}s`,
          }}
        >
          {/* Line */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, width: 16 }}>
            <div style={{
              width: 8, height: 8, borderRadius: '50%',
              background: e.color,
              boxShadow: `0 0 8px ${e.color}`,
              flexShrink: 0,
              marginTop: 16,
            }} />
            {i < events.length - 1 && (
              <div style={{ width: 1, flex: 1, background: 'rgba(255,255,255,0.07)', marginTop: 4 }} />
            )}
          </div>
          {/* Content */}
          <div style={{ paddingBottom: i < events.length - 1 ? 20 : 0, paddingTop: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', fontWeight: 700, color: e.color, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{e.action}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'rgba(255,255,255,0.2)' }}>{e.id}</span>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'rgba(255,255,255,0.25)' }}>actor:{e.actor}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'rgba(255,255,255,0.18)' }}>hash:{e.hash}…</span>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.575rem', color: 'rgba(255,255,255,0.15)', marginTop: 2 }}>{e.ts}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Confidence Meter ─────────────────────────────────────────────────────────
function ConfidenceMeter({ value, label, color, active, delay = 0 }: { value: number; label: string; color: string; active: boolean; delay?: number }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!active) { setCurrent(0); return; }
    const target = value;
    let v = 0;
    const step = target / 40;
    const t = setInterval(() => {
      v = Math.min(v + step, target);
      setCurrent(v);
      if (v >= target) clearInterval(t);
    }, 20);
    const timeout = setTimeout(() => {}, delay);
    return () => { clearInterval(t); clearTimeout(timeout); };
  }, [active, value, delay]);

  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', fontWeight: 700, color }}>{Math.round(current)}%</span>
      </div>
      <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${current}%`,
          background: color,
          borderRadius: 99,
          boxShadow: `0 0 8px ${color}`,
          transition: 'width 0.05s linear',
        }} />
      </div>
    </div>
  );
}

// ─── Report Preview ────────────────────────────────────────────────────────────
function ReportPreview({ active }: { active: boolean }) {
  const lines = [
    { indent: 0, key: 'FORENSIC REPORT', value: null, color: '#818CF8' },
    { indent: 0, key: '─────────────────────────────────────', value: null, color: 'rgba(255,255,255,0.08)' },
    { indent: 0, key: 'report_id', value: 'rep_1749834512', color: '#fff' },
    { indent: 0, key: 'scan_id', value: 'sc_EV8821_A3F8C2', color: 'rgba(255,255,255,0.5)' },
    { indent: 0, key: 'timestamp', value: '2025-06-12T19:15:03Z', color: 'rgba(255,255,255,0.4)' },
    { indent: 0, key: '─────────────────────────────────────', value: null, color: 'rgba(255,255,255,0.08)' },
    { indent: 0, key: 'prediction', value: 'AI_GENERATED', color: '#EF4444' },
    { indent: 0, key: 'confidence', value: '0.9823', color: '#EF4444' },
    { indent: 0, key: 'authenticity_score', value: '0.0177', color: 'rgba(255,255,255,0.35)' },
    { indent: 0, key: '─────────────────────────────────────', value: null, color: 'rgba(255,255,255,0.08)' },
    { indent: 0, key: 'report_hash', value: 'a3f8c2d9e1b47056', color: '#22C55E' },
    { indent: 0, key: 'report_signature', value: 'b9d1e3f7c4a7f2e8', color: '#22C55E' },
    { indent: 0, key: 'method', value: 'SHA-256', color: 'rgba(255,255,255,0.3)' },
    { indent: 0, key: 'integrity', value: 'VERIFIED ✓', color: '#22C55E' },
  ];

  return (
    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', lineHeight: 1.9 }}>
      {lines.map((l, i) => (
        <div
          key={i}
          style={{
            paddingLeft: l.indent * 16,
            opacity: active ? 1 : 0,
            transition: `opacity 0.3s ease ${i * 0.045}s`,
          }}
        >
          {l.value === null ? (
            <span style={{ color: l.color }}>{l.key}</span>
          ) : (
            <>
              <span style={{ color: 'rgba(255,255,255,0.25)' }}>{l.key}</span>
              <span style={{ color: 'rgba(255,255,255,0.2)' }}>{': '}</span>
              <span style={{ color: l.color }}>{l.value}</span>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Counter ──────────────────────────────────────────────────────────────────
function Counter({ to, suffix = '', duration = 1800 }: { to: number; suffix?: string; duration?: number }) {
  const [v, setV] = useState(0);
  const { ref, inView } = useInView(0.5);

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const raf = (t: number) => {
      const p = Math.min((t - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setV(Math.round(ease * to));
      if (p < 1) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }, [inView, to, duration]);

  return <span ref={ref as any}>{v.toLocaleString()}{suffix}</span>;
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ForensicLanding() {
  // Section in-view hooks
  const ingest = useInView();
  const hash = useInView();
  const ai = useInView();
  const custody = useInView();
  const report = useInView();

  // Nav state
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  return (
    <div style={{ background: '#040506', minHeight: '100vh', overflowX: 'hidden', position: 'relative' }}>
      <ForensicCanvas />

      {/* ── NAV ─────────────────────────────────────────────────────────────── */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        height: 56,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 40px',
        background: scrolled ? 'rgba(4,5,6,0.96)' : 'transparent',
        borderBottom: scrolled ? '1px solid rgba(182,194,209,0.1)' : '1px solid transparent',
        backdropFilter: scrolled ? 'blur(24px)' : 'none',
        transition: 'all 0.3s ease',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 28, height: 28, background: '#2E6BFF', borderRadius: 7,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: '0.6875rem', color: '#fff', letterSpacing: '-0.01em',
          }}>FS</div>
          <span style={{ fontWeight: 700, fontSize: '0.9375rem', letterSpacing: '-0.03em', color: '#F8FAFC' }}>FiduScan</span>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: '#22C55E',
            background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)',
            padding: '2px 8px', borderRadius: 4, letterSpacing: '0.06em', textTransform: 'uppercase',
          }}>v2.4 · Beta</span>
        </div>
        <nav style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Link href="/login" style={{
            fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', color: '#B6C2D1',
            textDecoration: 'none', padding: '6px 14px', borderRadius: 6,
            transition: 'color 0.2s',
          }}>Sign In</Link>
          <Link href="/login" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: '#2E6BFF', color: '#fff',
            fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', fontWeight: 600,
            padding: '7px 20px', borderRadius: 7, textDecoration: 'none',
            letterSpacing: '-0.01em',
            boxShadow: '0 0 20px rgba(46,107,255,0.3)',
            transition: 'all 0.2s',
          }}>
            Access Platform →
          </Link>
        </nav>
      </header>

      {/* ── HERO ────────────────────────────────────────────────────────────── */}
      <section style={{
        minHeight: '100vh',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: '0 40px 80px',
        position: 'relative',
        zIndex: 1,
        borderBottom: '1px solid rgba(182,194,209,0.08)',
      }}>
        {/* Deep radial vignette to ground the text */}
        <div aria-hidden style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 100% 80% at 0% 100%, rgba(4,5,6,0.7) 0%, transparent 60%)',
          pointerEvents: 'none',
        }} />

        {/* Tag */}
        <div style={{ position: 'relative', zIndex: 2, marginBottom: 32 }}>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.14em',
            textTransform: 'uppercase', color: 'rgba(182,194,209,0.5)',
          }}>Forensic Intelligence Platform · Est. 2025</span>
        </div>

        {/* Headline */}
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 960 }}>
          <h1 style={{
            fontSize: 'clamp(3.5rem, 9vw, 8rem)',
            fontWeight: 800,
            letterSpacing: '-0.055em',
            lineHeight: 0.9,
            color: '#F8FAFC',
            marginBottom: 44,
          }}>
            Truth is<br />
            <span style={{
              background: 'linear-gradient(90deg, #F8FAFC 0%, #7EB2FF 55%, #5A8FFF 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>provable.</span>
          </h1>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 80, flexWrap: 'wrap' }}>
            <p style={{
              fontSize: '1.0625rem', lineHeight: 1.7,
              color: '#B6C2D1',
              maxWidth: 460, margin: 0,
              fontWeight: 400,
            }}>
              From evidence ingestion to court-ready reports — FiduScan creates a cryptographically sealed record of digital truth. Every pixel analyzed. Every action logged.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, paddingTop: 4 }}>
              {[
                { n: '99.3', s: '%', l: 'Detection Accuracy' },
                { n: '<2', s: 's', l: 'Analysis Time' },
                { n: '100', s: '%', l: 'Chain Integrity' },
              ].map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.4rem', fontWeight: 700, color: '#F8FAFC', letterSpacing: '-0.04em' }}>{s.n}{s.s}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'rgba(182,194,209,0.55)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>{s.l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div aria-hidden style={{ position: 'absolute', bottom: 40, right: 40, zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.575rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(182,194,209,0.35)', writingMode: 'vertical-rl' }}>Scroll</span>
          <div style={{ width: 1, height: 48, background: 'linear-gradient(to bottom, rgba(182,194,209,0.2), transparent)' }} />
        </div>
      </section>

      {/* ── NARRATIVE LABEL ─────────────────────────────────────────────────── */}
      <div style={{ padding: '64px 40px 0', maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(182,194,209,0.45)' }}>
          The Workflow
        </p>
        <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', fontWeight: 700, letterSpacing: '-0.04em', color: '#F8FAFC', marginTop: 12, lineHeight: 1.15 }}>
          Evidence → Analysis →<br />Verification → Custody → Report
        </h2>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          STEP 01 — EVIDENCE INGESTION
      ══════════════════════════════════════════════════════════════════════ */}
      <section style={{ padding: '80px 40px', maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div ref={ingest.ref} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
          {/* Left */}
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#2E6BFF', marginBottom: 24 }}>
              01 / Evidence Ingestion
            </div>
            <h3 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 3rem)', fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: 24, color: '#F8FAFC' }}>
              Every file begins as a suspect.
            </h3>
            <p style={{ fontSize: '1rem', lineHeight: 1.75, color: '#B6C2D1', marginBottom: 32 }}>
              Upload an image, audio clip, or video. The moment a file enters FiduScan, it's treated with the same rigor as physical evidence in a forensic lab.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {['Multimodal support: Image · Audio · Video', 'Metadata extraction and preservation', 'Tamper-evident ingestion protocol'].map((t, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#2E6BFF', flexShrink: 0 }} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#B6C2D1', letterSpacing: '0.02em' }}>{t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — File ingestion visualization */}
          <div style={{
            background: '#0B1018', border: '1px solid rgba(182,194,209,0.1)',
            borderRadius: 16, padding: 32,
            opacity: ingest.inView ? 1 : 0, transform: ingest.inView ? 'translateY(0)' : 'translateY(24px)',
            transition: 'all 0.6s ease',
          }}>
            {/* File row */}
            {[
              { name: 'profile_photo_eu.jpg', size: '2.4 MB', type: 'IMAGE', status: 'ingesting', progress: 100 },
              { name: 'testimony_audio.wav', size: '18.7 MB', type: 'AUDIO', status: 'queued', progress: 0 },
              { name: 'press_conference.mp4', size: '84.2 MB', type: 'VIDEO', status: 'queued', progress: 0 },
            ].map((f, i) => (
              <div key={i} style={{
                padding: '14px 0',
                borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                opacity: ingest.inView ? 1 : 0,
                transition: `opacity 0.4s ease ${i * 0.15}s`,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#F8FAFC', marginBottom: 3 }}>{f.name}</div>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'rgba(182,194,209,0.45)' }}>{f.size}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: f.type === 'IMAGE' ? '#4F6EF7' : f.type === 'AUDIO' ? '#22C55E' : '#EAB308' }}>{f.type}</span>
                    </div>
                  </div>
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: '0.55rem', letterSpacing: '0.1em', textTransform: 'uppercase',
                    color: f.status === 'ingesting' ? '#22C55E' : 'rgba(255,255,255,0.2)',
                    padding: '3px 8px', background: f.status === 'ingesting' ? 'rgba(34,197,94,0.08)' : 'rgba(255,255,255,0.03)',
                    borderRadius: 4, border: `1px solid ${f.status === 'ingesting' ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.06)'}`,
                  }}>{f.status}</span>
                </div>
                <div style={{ height: 2, background: 'rgba(255,255,255,0.05)', borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${f.progress}%`, background: '#4F6EF7', borderRadius: 99, transition: 'width 1s ease 0.5s' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          STEP 02 — SHA-256 HASHING
      ══════════════════════════════════════════════════════════════════════ */}
      <section style={{ padding: '80px 40px', maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1, borderTop: '1px solid rgba(182,194,209,0.07)' }}>
        <div ref={hash.ref} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
          {/* Left — Hash viz */}
          <div style={{
            background: '#0B1018', border: '1px solid rgba(182,194,209,0.1)',
            borderRadius: 16, padding: 32,
            opacity: hash.inView ? 1 : 0, transform: hash.inView ? 'translateY(0)' : 'translateY(24px)',
            transition: 'all 0.6s ease',
          }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: 20 }}>
              Integrity Fingerprint
            </div>
            <div style={{ marginBottom: 24 }}>
              <HashStream active={hash.inView} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 24, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              {[
                { k: 'algorithm', v: 'SHA-256' },
                { k: 'bits', v: '256' },
                { k: 'collisions', v: 'none' },
                { k: 'status', v: 'sealed ✓' },
              ].map((item, i) => (
                <div key={i}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.575rem', color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 3 }}>{item.k}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: item.v.includes('✓') ? '#22C55E' : 'rgba(255,255,255,0.7)' }}>{item.v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right */}
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#6378DC', marginBottom: 24 }}>
              02 / Cryptographic Hashing
            </div>
            <h3 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 3rem)', fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: 24, color: '#F8FAFC' }}>
              A fingerprint that cannot be forged.
            </h3>
            <p style={{ fontSize: '1rem', lineHeight: 1.75, color: '#B6C2D1', marginBottom: 32 }}>
              The SHA-256 hash of every file is computed at ingestion and sealed into the evidence record. Any modification — even a single bit — produces a completely different hash. Tamper evidence is mathematically guaranteed.
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          STEP 03 — AI FORENSIC ANALYSIS
      ══════════════════════════════════════════════════════════════════════ */}
      <section style={{ padding: '80px 40px', maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1, borderTop: '1px solid rgba(182,194,209,0.07)' }}>
        <div ref={ai.ref} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'start' }}>
          {/* Left */}
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#DC4C4C', marginBottom: 24 }}>
              03 / AI Forensic Analysis
            </div>
            <h3 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 3rem)', fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: 24, color: '#F8FAFC' }}>
              The model sees what eyes cannot.
            </h3>
            <p style={{ fontSize: '1rem', lineHeight: 1.75, color: '#B6C2D1', marginBottom: 40 }}>
              Vision Transformers analyze compression artifacts, facial geometry, and frequency domain anomalies to detect synthetic generation with explainable confidence scores.
            </p>

            {/* Confidence bars */}
            <div style={{ background: '#0B1018', border: '1px solid rgba(182,194,209,0.1)', borderRadius: 12, padding: '20px 24px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)', marginBottom: 16 }}>Model Output</div>
              <ConfidenceMeter value={98} label="AI Probability" color="#EF4444" active={ai.inView} />
              <ConfidenceMeter value={2} label="Authentic Probability" color="#22C55E" active={ai.inView} delay={200} />
              <ConfidenceMeter value={94} label="GAN Artifacts" color="#EAB308" active={ai.inView} delay={400} />
              <ConfidenceMeter value={87} label="Frequency Anomaly" color="#818CF8" active={ai.inView} delay={600} />
            </div>
          </div>

          {/* Right — Heatmap */}
          <div style={{
            background: '#0B1018', border: '1px solid rgba(182,194,209,0.1)',
            borderRadius: 16, padding: 24,
            opacity: ai.inView ? 1 : 0, transition: 'opacity 0.6s ease 0.2s',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)' }}>Forensic Heatmap</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: '#EF4444' }}>AI_GENERATED</span>
            </div>
            <HeatmapViz active={ai.inView} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 14, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              {['Low', 'Medium', 'High', 'Critical'].map((l, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: ['rgba(79,110,247,0.4)', 'rgba(234,179,8,0.6)', 'rgba(249,115,22,0.7)', 'rgba(239,68,68,0.9)'][i] }} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'rgba(255,255,255,0.25)' }}>{l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          STEP 04 — CHAIN OF CUSTODY
      ══════════════════════════════════════════════════════════════════════ */}
      <section style={{ padding: '80px 40px', maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1, borderTop: '1px solid rgba(182,194,209,0.07)' }}>
        <div ref={custody.ref} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'start' }}>
          {/* Left — timeline */}
          <div style={{
            background: '#0B1018', border: '1px solid rgba(182,194,209,0.1)',
            borderRadius: 16, padding: 32,
            opacity: custody.inView ? 1 : 0, transform: custody.inView ? 'translateY(0)' : 'translateY(24px)',
            transition: 'all 0.6s ease',
          }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: 24 }}>
              Custody Log · EV-8821
            </div>
            <CustodyTimeline active={custody.inView} />
          </div>

          {/* Right */}
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#22C55E', marginBottom: 24 }}>
              04 / Chain of Custody
            </div>
            <h3 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 3rem)', fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: 24, color: '#F8FAFC' }}>
              Every action is a permanent record.
            </h3>
            <p style={{ fontSize: '1rem', lineHeight: 1.75, color: '#B6C2D1', marginBottom: 32 }}>
              Who accessed the evidence. When. What they did. Every event in the investigation lifecycle is immutably logged with cryptographic hashes linking each action to the previous — an unbreakable chain.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {['Actor identity preserved at every step', 'Hash links prevent retroactive modification', 'Full audit trail exportable for legal proceedings'].map((t, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#22C55E', flexShrink: 0 }} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#B6C2D1', letterSpacing: '0.02em' }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          STEP 05 — FORENSIC REPORT
      ══════════════════════════════════════════════════════════════════════ */}
      <section style={{ padding: '80px 40px', maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1, borderTop: '1px solid rgba(182,194,209,0.08)' }}>
        <div ref={report.ref} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'start' }}>
          {/* Left */}
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#C89A2A', marginBottom: 24 }}>
              05 / Forensic Report
            </div>
            <h3 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 3rem)', fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: 24, color: '#F8FAFC' }}>
              Court-ready in seconds.
            </h3>
            <p style={{ fontSize: '1rem', lineHeight: 1.75, color: '#B6C2D1', marginBottom: 32 }}>
              Generate a cryptographically signed PDF or JSON forensic report containing the complete analysis, chain of custody, and SHA-256 verification signatures — ready for legal proceedings, law enforcement, or enterprise compliance.
            </p>
            <Link href="/login" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: '#2E6BFF', color: '#fff',
              fontFamily: 'var(--font-sans)', fontSize: '0.875rem', fontWeight: 600,
              padding: '12px 24px', borderRadius: 10, textDecoration: 'none',
              letterSpacing: '-0.01em',
              boxShadow: '0 0 28px rgba(46,107,255,0.3)',
            }}>
              Open an Investigation →
            </Link>
          </div>

          {/* Right — Report terminal */}
          <div style={{
            background: '#070A0F', border: '1px solid rgba(182,194,209,0.1)',
            borderRadius: 16, overflow: 'hidden',
            opacity: report.inView ? 1 : 0, transform: report.inView ? 'translateY(0)' : 'translateY(24px)',
            transition: 'all 0.6s ease',
          }}>
            {/* Terminal titlebar */}
            <div style={{ padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 6 }}>
              {['#EF4444', '#EAB308', '#22C55E'].map((c, i) => (
                <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: c, opacity: 0.6 }} />
              ))}
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'rgba(255,255,255,0.2)', marginLeft: 8 }}>fiduscan · forensic-report · rep_1749834512</span>
            </div>
            <div style={{ padding: '20px 20px 24px' }}>
              <ReportPreview active={report.inView} />
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ROW ──────────────────────────────────────────────────────── */}
      <section style={{ borderTop: '1px solid rgba(182,194,209,0.07)', borderBottom: '1px solid rgba(182,194,209,0.07)', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0 }}>
          {[
            { to: 99, s: '.3%', l: 'Detection Accuracy', mono: true },
            { to: 2, s: 's', l: 'Avg Analysis Time', mono: true },
            { to: 100, s: '%', l: 'Chain Integrity', mono: true },
            { to: 3, s: '', l: 'Modalities Supported', mono: true },
          ].map((s, i) => (
            <div key={i} style={{
              padding: '48px 40px',
              borderRight: i < 3 ? '1px solid rgba(255,255,255,0.05)' : 'none',
            }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, letterSpacing: '-0.04em', color: 'rgba(255,255,255,0.9)', lineHeight: 1, marginBottom: 8 }}>
                <Counter to={s.to} suffix={s.s} />
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)' }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA ──────────────────────────────────────────────────────── */}
      <section style={{ padding: '160px 40px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <div aria-hidden style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 50% 50% at 50% 50%, rgba(46,107,255,0.04) 0%, transparent 65%)',
        }} />
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(182,194,209,0.45)', marginBottom: 24 }}>
          Begin your investigation
        </p>
        <h2 style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 800, letterSpacing: '-0.055em', lineHeight: 1, color: '#F8FAFC', marginBottom: 40 }}>
          Every case deserves<br />
          <span style={{
            background: 'linear-gradient(90deg, #F8FAFC 0%, #7EB2FF 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>the truth.</span>
        </h2>
        <Link href="/login" style={{
          display: 'inline-flex', alignItems: 'center', gap: 10,
          background: '#2E6BFF', color: '#fff',
          fontFamily: 'var(--font-sans)', fontSize: '1rem', fontWeight: 600,
          letterSpacing: '-0.01em',
          padding: '16px 40px', borderRadius: 12, textDecoration: 'none',
          boxShadow: '0 0 40px rgba(46,107,255,0.3), 0 0 80px rgba(46,107,255,0.12)',
          transition: 'all 0.2s',
        }}>
          Enter FiduScan Platform →
        </Link>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────────────── */}
      <footer style={{ borderTop: '1px solid rgba(182,194,209,0.07)', padding: '28px 40px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 22, height: 22, background: '#2E6BFF', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.5rem', fontWeight: 800, color: '#fff' }}>FS</div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'rgba(182,194,209,0.4)', letterSpacing: '0.06em' }}>© 2025 FiduScan · Forensic Intelligence Platform</span>
          </div>
          <nav style={{ display: 'flex', gap: 24 }}>
            {[
              { label: 'API Docs', href: '/developer' },
              { label: 'Dashboard', href: '/dashboard' },
              { label: 'Privacy', href: '/settings' },
            ].map((l, i) => (
              <Link key={i} href={l.href} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'rgba(182,194,209,0.4)', textDecoration: 'none', letterSpacing: '0.06em', transition: 'color 0.2s' }}>
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  );
}
