'use client';

import { DetectionResult } from '@/types';
import { formatConfidence, formatBytes } from '@/lib/api';
import { ShieldCheck, ShieldAlert, Cpu, Clock, Hash } from 'lucide-react';

interface ResultCardProps {
  result: DetectionResult;
}

export default function ResultCard({ result }: ResultCardProps) {
  const isAI = result.prediction === 'AI_GENERATED';
  const confidencePct = result.confidence * 100;

  return (
    <div className={`glass-card p-6 animate-fade-in ${isAI ? 'glow-ai' : 'glow-authentic'}`}>
      {/* ── Header ────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
              isAI
                ? 'bg-red-500/15 border border-red-500/25'
                : 'bg-emerald-500/15 border border-emerald-500/25'
            }`}
          >
            {isAI ? (
              <ShieldAlert size={28} className="text-red-400" />
            ) : (
              <ShieldCheck size={28} className="text-emerald-400" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={isAI ? 'badge-ai-generated' : 'badge-authentic'}>
                {isAI ? 'AI Generated' : 'Authentic'}
              </span>
            </div>
            <p className="text-2xl font-bold text-white/95">
              {formatConfidence(result.confidence)}
            </p>
            <p className="text-xs text-white/40 mt-0.5">confidence score</p>
          </div>
        </div>
      </div>

      {/* ── Confidence Bars ────────────────────────────────────────── */}
      <div className="space-y-3 mb-6">
        {/* Authentic */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-white/50">Authentic Probability</span>
            <span className="mono text-emerald-400">
              {formatConfidence(result.authentic_probability)}
            </span>
          </div>
          <div className="confidence-track">
            <div
              className="confidence-fill-authentic"
              style={{ width: `${result.authentic_probability * 100}%` }}
            />
          </div>
        </div>

        {/* AI Generated */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-white/50">AI-Generated Probability</span>
            <span className="mono text-red-400">
              {formatConfidence(result.ai_probability)}
            </span>
          </div>
          <div className="confidence-track">
            <div
              className="confidence-fill-ai"
              style={{ width: `${result.ai_probability * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* ── Divider ────────────────────────────────────────────────── */}
      <div className="border-t border-white/05 mb-5" />

      {/* ── Stats Grid ────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-3">
        <StatTile
          icon={<Clock size={14} className="text-white/40" />}
          label="Inference"
          value={`${result.inference_time_ms.toFixed(0)}ms`}
        />
        <StatTile
          icon={<Cpu size={14} className="text-white/40" />}
          label="Model"
          value="EfficientNet-B0"
          small
        />
        <StatTile
          icon={<Hash size={14} className="text-white/40" />}
          label="Request ID"
          value={result.request_id.slice(0, 8) + '…'}
          small
        />
      </div>
    </div>
  );
}

function StatTile({
  icon,
  label,
  value,
  small = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  small?: boolean;
}) {
  return (
    <div className="rounded-xl bg-white/[0.03] border border-white/[0.05] px-3 py-3">
      <div className="flex items-center gap-1.5 mb-1.5">{icon}
        <span className="text-[10px] text-white/35 uppercase tracking-wider font-semibold">
          {label}
        </span>
      </div>
      <p className={`font-mono font-medium text-white/80 truncate ${small ? 'text-[11px]' : 'text-sm'}`}>
        {value}
      </p>
    </div>
  );
}
