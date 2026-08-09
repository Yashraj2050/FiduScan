'use client';

import { useEffect, useRef } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Node {
  x: number; y: number;
  vx: number; vy: number;
  radius: number;
  pulsePhase: number;
  pulseSpeed: number;
  kind: 'evidence' | 'hash' | 'analysis' | 'verified';
  label: string;
  alpha: number;
}

interface Edge {
  a: number; b: number;
  progress: number; // 0 → 1, animation state
  speed: number;
  active: boolean;
}

interface HashParticle {
  x: number; y: number;
  char: string;
  alpha: number;
  decay: number;
  vy: number;
}

interface ScanLine {
  y: number;
  speed: number;
  alpha: number;
}

// ─── Constants ───────────────────────────────────────────────────────────────
const ACCENT      = '46, 107, 255';   // #2E6BFF
const VERIFIED    = '34, 197, 94';    // #22C55E
const ALERT       = '239, 68, 68';    // #EF4444
const CHAIN       = '99, 120, 220';   // muted indigo
const DIM         = '182, 194, 209';  // #B6C2D1

const HASH_CHARS = '0123456789abcdef';
const EVIDENCE_LABELS = ['EV-8821', 'EV-9042', 'EV-7713', 'EV-8120', 'EV-6634', 'EV-5501'];
const HASH_LABELS = ['a3f8c2d9', 'b9d1e3f7', 'c4a7f2e8', 'd6b3e9a1', 'e2c8f4d7'];
const ANALYSIS_LABELS = ['VERIFIED', 'HASHED', 'ANALYZED', 'FLAGGED', 'SEALED'];

function randomBetween(a: number, b: number) {
  return a + Math.random() * (b - a);
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function ForensicCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // From here, canvas and ctx are guaranteed non-null
    const c = canvas!;
    const g = ctx!;

    let animId: number;
    let W = 0, H = 0;

    // ── State ─────────────────────────────────────────────────────────────────
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    const particles: HashParticle[] = [];
    const scanLines: ScanLine[] = [];
    let frame = 0;

    // ── Init ──────────────────────────────────────────────────────────────────
    function init() {
      W = c.width  = window.innerWidth;
      H = c.height = window.innerHeight;

      nodes.length = 0;
      edges.length = 0;
      particles.length = 0;
      scanLines.length = 0;

      const kinds: Node['kind'][] = ['evidence', 'hash', 'analysis', 'verified'];
      const kindLabels: Record<Node['kind'], string[]> = {
        evidence: EVIDENCE_LABELS,
        hash:     HASH_LABELS,
        analysis: ANALYSIS_LABELS,
        verified: ['VERIFIED ✓', 'SEALED ✓', 'AUTHENTIC ✓'],
      };

      // Distribute nodes in a loose grid with drift
      const count = Math.floor((W * H) / 68000);
      for (let i = 0; i < Math.min(count, 22); i++) {
        const kind = kinds[Math.floor(Math.random() * kinds.length)];
        nodes.push({
          x: randomBetween(W * 0.05, W * 0.95),
          y: randomBetween(H * 0.08, H * 0.92),
          vx: randomBetween(-0.08, 0.08),
          vy: randomBetween(-0.06, 0.06),
          radius: kind === 'evidence' ? randomBetween(3, 5) : randomBetween(2, 3.5),
          pulsePhase: Math.random() * Math.PI * 2,
          pulseSpeed: randomBetween(0.008, 0.018),
          kind,
          label: kindLabels[kind][Math.floor(Math.random() * kindLabels[kind].length)],
          alpha: randomBetween(0.25, 0.65),
        });
      }

      // Build edges — connect nearby nodes
      for (let a = 0; a < nodes.length; a++) {
        for (let b = a + 1; b < nodes.length; b++) {
          const dx = nodes[a].x - nodes[b].x;
          const dy = nodes[a].y - nodes[b].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < W * 0.28 && Math.random() < 0.45) {
            edges.push({
              a, b,
              progress: Math.random(), // start at random phase
              speed: randomBetween(0.003, 0.009),
              active: true,
            });
          }
        }
      }

      // Scan lines — 3 thin horizontal sweeps
      for (let i = 0; i < 3; i++) {
        scanLines.push({
          y: randomBetween(0, H),
          speed: randomBetween(0.18, 0.35),
          alpha: randomBetween(0.015, 0.04),
        });
      }
    }

    // ── Spawn hash particle near a node ───────────────────────────────────────
    function spawnParticle(nx: number, ny: number) {
      if (particles.length > 80) return;
      particles.push({
        x: nx + randomBetween(-40, 40),
        y: ny + randomBetween(-20, 20),
        char: HASH_CHARS[Math.floor(Math.random() * HASH_CHARS.length)],
        alpha: randomBetween(0.12, 0.28),
        decay: randomBetween(0.003, 0.008),
        vy: randomBetween(-0.2, -0.08),
      });
    }

    // ── Node color by kind ────────────────────────────────────────────────────
    function nodeColor(kind: Node['kind'], alpha: number): string {
      switch (kind) {
        case 'evidence':  return `rgba(${ACCENT}, ${alpha})`;
        case 'hash':      return `rgba(${CHAIN}, ${alpha})`;
        case 'analysis':  return `rgba(${DIM}, ${alpha * 0.7})`;
        case 'verified':  return `rgba(${VERIFIED}, ${alpha})`;
      }
    }

    // ── Draw ──────────────────────────────────────────────────────────────────
    function draw() {
      g.clearRect(0, 0, W, H);

      // 1 ── Very subtle grid
      g.save();
      g.strokeStyle = 'rgba(182,194,209,0.022)';
      g.lineWidth = 0.5;
      const gridSize = 64;
      for (let x = 0; x < W; x += gridSize) {
        g.beginPath(); g.moveTo(x, 0); g.lineTo(x, H); g.stroke();
      }
      for (let y = 0; y < H; y += gridSize) {
        g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke();
      }
      g.restore();

      // 2 ── Scan lines
      for (const sl of scanLines) {
        sl.y += sl.speed;
        if (sl.y > H) sl.y = -2;
        g.save();
        const grad = g.createLinearGradient(0, sl.y - 4, 0, sl.y + 4);
        grad.addColorStop(0,   `rgba(${ACCENT}, 0)`);
        grad.addColorStop(0.5, `rgba(${ACCENT}, ${sl.alpha})`);
        grad.addColorStop(1,   `rgba(${ACCENT}, 0)`);
        g.fillStyle = grad;
        g.fillRect(0, sl.y - 4, W, 8);
        g.restore();
      }

      // 3 ── Edges (animated data flow)
      for (const e of edges) {
        const na = nodes[e.a], nb = nodes[e.b];
        const dx = nb.x - na.x, dy = nb.y - na.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Static background line
        g.beginPath();
        g.moveTo(na.x, na.y);
        g.lineTo(nb.x, nb.y);
        g.strokeStyle = 'rgba(182,194,209,0.04)';
        g.lineWidth = 0.5;
        g.stroke();

        // Animated pulse along the edge
        e.progress += e.speed;
        if (e.progress > 1) e.progress = 0;

        const px = lerp(na.x, nb.x, e.progress);
        const py = lerp(na.y, nb.y, e.progress);
        const trailLen = Math.min(80, dist * 0.18);
        const pb = Math.max(0, e.progress - trailLen / dist);
        const px0 = lerp(na.x, nb.x, pb);
        const py0 = lerp(na.y, nb.y, pb);

        const grad = g.createLinearGradient(px0, py0, px, py);
        grad.addColorStop(0, `rgba(${ACCENT}, 0)`);
        grad.addColorStop(1, `rgba(${ACCENT}, 0.35)`);
        g.beginPath();
        g.moveTo(px0, py0);
        g.lineTo(px, py);
        g.strokeStyle = grad;
        g.lineWidth = 1;
        g.stroke();
      }

      // 4 ── Nodes
      for (const n of nodes) {
        // Drift
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 40 || n.x > W - 40) n.vx *= -1;
        if (n.y < 40 || n.y > H - 40) n.vy *= -1;

        // Pulse
        n.pulsePhase += n.pulseSpeed;
        const pulse = 0.5 + 0.5 * Math.sin(n.pulsePhase);
        const outerR = n.radius + pulse * 8;
        const alpha  = n.alpha * (0.75 + 0.25 * pulse);

        // Outer ring
        g.beginPath();
        g.arc(n.x, n.y, outerR, 0, Math.PI * 2);
        g.strokeStyle = nodeColor(n.kind, alpha * 0.2);
        g.lineWidth = 0.75;
        g.stroke();

        // Middle ring
        g.beginPath();
        g.arc(n.x, n.y, n.radius + 3, 0, Math.PI * 2);
        g.strokeStyle = nodeColor(n.kind, alpha * 0.45);
        g.lineWidth = 0.75;
        g.stroke();

        // Core dot
        g.beginPath();
        g.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        g.fillStyle = nodeColor(n.kind, alpha * 0.85);
        g.fill();

        // Label
        g.save();
        g.font = `500 9px 'JetBrains Mono', monospace`;
        g.fillStyle = nodeColor(n.kind, alpha * 0.55);
        g.fillText(n.label, n.x + n.radius + 7, n.y + 3.5);
        g.restore();

        // Occasionally spawn a hash particle
        if (frame % 90 === 0 && Math.random() < 0.4) {
          spawnParticle(n.x, n.y);
        }
      }

      // 5 ── Hash particles (floating hex chars)
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.y += p.vy;
        p.alpha -= p.decay;
        if (p.alpha <= 0) { particles.splice(i, 1); continue; }
        g.save();
        g.font = `400 9px 'JetBrains Mono', monospace`;
        g.fillStyle = `rgba(${CHAIN}, ${p.alpha})`;
        g.fillText(p.char, p.x, p.y);
        g.restore();
      }

      // 6 ── Verification rings (two fixed "verification stations")
      const stations = [
        { x: W * 0.22, y: H * 0.35 },
        { x: W * 0.78, y: H * 0.65 },
      ];
      for (const st of stations) {
        const t = (frame * 0.004) % (Math.PI * 2);
        for (let ring = 0; ring < 3; ring++) {
          const phase = t - ring * 0.6;
          const r = 28 + ring * 18 + Math.sin(phase) * 4;
          const a = Math.max(0, 0.06 - ring * 0.015 + Math.sin(phase) * 0.02);
          g.beginPath();
          g.arc(st.x, st.y, r, 0, Math.PI * 2);
          g.strokeStyle = `rgba(${VERIFIED}, ${a})`;
          g.lineWidth = 0.75;
          g.stroke();
        }
        // Center dot
        g.beginPath();
        g.arc(st.x, st.y, 3, 0, Math.PI * 2);
        g.fillStyle = `rgba(${VERIFIED}, 0.35)`;
        g.fill();
      }

      frame++;
      animId = requestAnimationFrame(draw);
    }

    function handleResize() {
      init();
    }

    init();
    draw();

    window.addEventListener('resize', handleResize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
}
