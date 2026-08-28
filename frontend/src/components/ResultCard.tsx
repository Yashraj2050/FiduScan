'use client';

import { TrustAnalysisResponse } from '@/types';
import { ShieldAlert, ShieldCheck, Activity, Database, Key, Server, BrainCircuit, ShieldBan, Shield, XCircle, CheckCircle2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ResultCard({ result }: { result: TrustAnalysisResponse }) {
  const [scoreDisplay, setScoreDisplay] = useState(0);

  useEffect(() => {
    // Count up animation for score
    const target = result.risk.score;
    const duration = 1000;
    const steps = 30;
    const stepTime = duration / steps;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setScoreDisplay(target);
        clearInterval(timer);
      } else {
        setScoreDisplay(Math.round(current));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [result.risk.score]);

  const riskLevel = result.risk.level;
  const isHighRisk = riskLevel === 'HIGH' || riskLevel === 'CRITICAL';
  
  const riskColor = riskLevel === 'LOW' ? 'text-emerald-400' : 
                    riskLevel === 'MEDIUM' ? 'text-amber-400' : 
                    riskLevel === 'HIGH' ? 'text-orange-500' : 'text-red-500';

  const riskBg = riskLevel === 'LOW' ? 'bg-emerald-500' : 
                 riskLevel === 'MEDIUM' ? 'bg-amber-400' : 
                 riskLevel === 'HIGH' ? 'bg-orange-500' : 'bg-red-500';

  const agentAvailable = result.agent?.status === 'AVAILABLE' || !!result.agent?.assessment;
  const conflictOccurred = agentAvailable && result.agent?.recommended_action !== result.decision.action;

  return (
    <div className="fs-surface flex flex-col h-full animate-fade-in border border-white/[0.05] shadow-2xl rounded-lg overflow-hidden">
      
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/[0.05] flex justify-between items-center bg-white/[0.01]">
        <div className="flex items-center gap-2">
          <Activity size={14} className="text-white/40" />
          <span className="fs-label tracking-widest text-white/50">ANALYSIS COMPLETE</span>
        </div>
        <span className="text-[10px] font-mono text-white/30">{result.analysis_id?.split('-')[0] || 'Unknown ID'}</span>
      </div>

      <div className="p-6 flex-grow flex flex-col gap-8 overflow-y-auto custom-scrollbar">
        
        {/* SCORE & RISK */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-end mb-2">
            <div>
              <span className="text-5xl font-light tracking-tight font-mono">{scoreDisplay}</span>
              <span className="text-sm text-white/40 ml-1">/100</span>
            </div>
            <div className="text-right">
              <span className={`text-sm font-bold tracking-wider ${riskColor}`}>{riskLevel} RISK</span>
            </div>
          </div>
          {/* Minimal Risk Gauge */}
          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden flex">
            <div className={`h-full ${riskBg} transition-all duration-1000 ease-out`} style={{ width: `${scoreDisplay}%` }} />
          </div>
        </div>

        {/* EVIDENCE SIGNALS (Tabular) */}
        <div className="flex flex-col gap-3">
          <span className="fs-label text-white/40 border-b border-white/5 pb-2 mb-1">EVIDENCE SIGNALS</span>
          
          <div className="grid grid-cols-2 gap-4">
            {/* Image Authenticity */}
            <div className="flex flex-col gap-1 p-3 rounded bg-white/[0.02] border border-white/[0.03]">
              <span className="text-[10px] text-white/40 uppercase tracking-widest font-medium">Model Inference</span>
              <div className="flex justify-between items-center mt-1">
                <span className="text-sm font-mono truncate">{result.evidence.image?.classification || 'Authentic'}</span>
                <span className={`text-sm font-mono ${
                  result.evidence.image?.classification === 'authentic' ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {((result.evidence.image?.confidence || 0) * 100).toFixed(1)}%
                </span>
              </div>
            </div>

            {/* Metadata Hash */}
            <div className="flex flex-col gap-1 p-3 rounded bg-white/[0.02] border border-white/[0.03]">
              <span className="text-[10px] text-white/40 uppercase tracking-widest font-medium">Format / Size</span>
              <div className="flex justify-between items-center mt-1">
                <span className="text-xs font-mono text-white/70">
                  {result.evidence.metadata.format || 'Unknown'}
                </span>
                <span className="text-xs font-mono text-white/50">
                  {result.evidence.metadata.file_size_bytes ? 
                    Math.round(result.evidence.metadata.file_size_bytes / 1024) + ' KB' : 'Unknown'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* TRUST AGENT */}
        {agentAvailable && (
          <div className="flex flex-col gap-3">
            <span className="fs-label text-indigo-400 border-b border-white/5 pb-2 mb-1 flex items-center gap-2">
              <BrainCircuit size={12} /> AI REASONING
            </span>
            <div className="p-4 rounded border border-indigo-500/10 bg-indigo-500/5">
              <p className="text-sm text-white/80 leading-relaxed mb-4 italic">
                &quot;{result.agent?.assessment}&quot;
              </p>
              
              <div className="flex flex-col gap-1 mb-4 pl-3 border-l-2 border-white/10">
                {result.agent?.key_factors?.map((factor: string, i: number) => (
                  <span key={i} className="text-xs text-white/50">• {factor}</span>
                ))}
              </div>

              <div className="flex justify-between items-center border-t border-white/5 pt-3 mt-2">
                <span className="text-[10px] uppercase tracking-wider text-white/40">Agent Recommendation</span>
                <span className={`text-xs font-medium font-mono ${result.agent?.recommended_action === 'ALLOW' ? 'text-emerald-400' : result.agent?.recommended_action === 'BLOCK' ? 'text-red-400' : 'text-amber-400'}`}>
                  {result.agent?.recommended_action} ({(result.agent?.confidence || 0 * 100).toFixed(0)}% CONF)
                </span>
              </div>
            </div>
          </div>
        )}

        {/* SYSTEM DECISION */}
        <div className="flex flex-col gap-3 mt-2">
          <span className="fs-label text-white/40 border-b border-white/5 pb-2 mb-1">SYSTEM DECISION</span>
          <div className={`p-4 rounded flex items-center justify-between border ${
            result.decision.action === 'ALLOW' ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400' :
            result.decision.action === 'BLOCK' ? 'bg-red-500/5 border-red-500/20 text-red-400' :
            'bg-amber-500/5 border-amber-500/20 text-amber-400'
          }`}>
            <div className="flex items-center gap-3">
              {result.decision.action === 'ALLOW' ? <ShieldCheck size={20} /> : 
               result.decision.action === 'BLOCK' ? <ShieldBan size={20} /> : 
               <ShieldAlert size={20} />}
              <div>
                <div className="text-lg font-bold tracking-tight">{result.decision.action}</div>
                <div className="text-xs opacity-70 mt-0.5">{result.decision.requires_human_review ? 'Requires Human Review' : 'Automated Decision'}</div>
              </div>
            </div>
          </div>

          {/* Conflict Guardrail Visualization */}
          {conflictOccurred && (
            <div className="flex flex-col gap-2 p-3 mt-1 rounded bg-white/[0.02] border border-white/[0.05]">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                <ShieldAlert size={12} /> Policy Guardrail Override
              </span>
              <p className="text-xs text-white/50">
                Agent suggested <span className="font-mono text-white/70">{result.agent?.recommended_action}</span>, but deterministic policy enforced <span className="font-mono text-white/70">{result.decision.action}</span>.
              </p>
            </div>
          )}
        </div>

      </div>

      {/* Audit Footer */}
      <div className="p-4 border-t border-white/[0.05] bg-black/40 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            <CheckCircle2 size={12} className="text-emerald-500" />
            <Key size={12} className="text-emerald-500" />
          </div>
          <span className="text-[10px] text-white/40 uppercase tracking-widest font-medium">Immutable Ledger</span>
        </div>
        <span className="text-[10px] font-mono text-white/30 bg-white/5 px-2 py-1 rounded truncate max-w-[120px]">
          {result.audit.audit_id}
        </span>
      </div>

    </div>
  );
}
