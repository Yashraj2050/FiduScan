'use client';

import { useEffect, useState } from 'react';
import { DetectionResult } from '@/types';
import { formatConfidence } from '@/lib/api';
import { ShieldCheck, ShieldAlert, Cpu, Clock, Hash, AlertTriangle, Shield, AlertOctagon } from 'lucide-react';

interface ResultCardProps {
  result: DetectionResult;
}

export default function ResultCard({ result }: ResultCardProps) {
  const isAI = result.prediction === 'AI_GENERATED';
  const confidencePct = result.confidence * 100;
  
  // Animation state for gauge
  const [animatedPct, setAnimatedPct] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => setAnimatedPct(confidencePct), 100);
    return () => clearTimeout(timer);
  }, [confidencePct]);

  // Risk calculation based on AI probability
  const aiProb = result.ai_probability;
  let riskLevel = 'Low Risk';
  let RiskIcon = ShieldCheck;
  let riskColor = 'text-emerald-400';
  let riskBg = 'bg-emerald-500/10 border-emerald-500/20';
  let riskWidth = 'w-1/3';
  let riskIndicatorColor = 'bg-emerald-500';

  if (aiProb >= 0.8) {
    riskLevel = 'High Risk';
    RiskIcon = AlertOctagon;
    riskColor = 'text-red-400';
    riskBg = 'bg-red-500/10 border-red-500/20';
    riskWidth = 'w-full';
    riskIndicatorColor = 'bg-red-500';
  } else if (aiProb >= 0.4) {
    riskLevel = 'Medium Risk';
    RiskIcon = AlertTriangle;
    riskColor = 'text-amber-400';
    riskBg = 'bg-amber-500/10 border-amber-500/20';
    riskWidth = 'w-2/3';
    riskIndicatorColor = 'bg-amber-500';
  }

  // Gauge parameters
  const radius = 36;
  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference - (animatedPct / 100) * circumference;

  return (
    <div className={`glass-card p-6 animate-fade-in ${isAI ? 'glow-ai' : 'glow-authentic'}`}>
      {/* ── Header with Gauge ─────────────────────────────────────────── */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="relative flex items-center justify-center">
            {/* SVG Semi-circle Gauge */}
            <svg className="w-24 h-16 transform rotate-180" viewBox="0 0 100 50">
              {/* Background track */}
              <path
                d="M 10 50 A 40 40 0 0 1 90 50"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="8"
                strokeLinecap="round"
              />
              {/* Foreground progress */}
              <path
                d="M 10 50 A 40 40 0 0 1 90 50"
                fill="none"
                stroke={isAI ? '#f87171' : '#34d399'}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute top-8 flex flex-col items-center">
              <span className="text-xl font-bold text-white/95">
                {Math.round(animatedPct)}%
              </span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={isAI ? 'badge-ai-generated' : 'badge-authentic'}>
                {isAI ? 'AI Generated' : 'Authentic'}
              </span>
            </div>
            <p className="text-sm text-white/40 mt-1">Confidence Score</p>
          </div>
        </div>
        
        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
            isAI
              ? 'bg-red-500/15 border border-red-500/25'
              : 'bg-emerald-500/15 border border-emerald-500/25'
          }`}
        >
          {isAI ? (
            <ShieldAlert size={24} className="text-red-400" />
          ) : (
            <ShieldCheck size={24} className="text-emerald-400" />
          )}
        </div>
      </div>

      {/* ── Risk Meter ─────────────────────────────────────────────── */}
      <div className={`rounded-xl border p-4 mb-6 ${riskBg} flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          <RiskIcon size={20} className={riskColor} />
          <div>
            <p className={`text-sm font-bold ${riskColor}`}>{riskLevel}</p>
            <p className="text-xs text-white/50 mt-0.5">Assessed forgery risk</p>
          </div>
        </div>
        <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden flex">
          <div className={`h-full ${riskWidth} ${riskIndicatorColor} transition-all duration-700`} />
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
          <div className="confidence-track bg-white/5 h-1.5 rounded-full overflow-hidden">
            <div
              className="confidence-fill-authentic bg-emerald-400 h-full transition-all duration-1000 ease-out"
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
          <div className="confidence-track bg-white/5 h-1.5 rounded-full overflow-hidden">
            <div
              className="confidence-fill-ai bg-red-400 h-full transition-all duration-1000 ease-out"
              style={{ width: `${result.ai_probability * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* ── Divider ────────────────────────────────────────────────── */}
      <div className="border-t border-white/05 mb-5" />

      {/* ── Stats Grid ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
    <div className="rounded-xl bg-white/[0.03] border border-white/[0.05] px-3 py-3 hover:bg-white/[0.05] transition-colors">
      <div className="flex items-center gap-1.5 mb-1.5">
        {icon}
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
