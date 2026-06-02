import React from 'react';
import { Shield, Scan, Activity } from 'lucide-react';

export function DashboardSkeleton() {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-start justify-between mb-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/[0.05]" />
          <div>
            <div className="h-6 w-32 bg-white/[0.05] rounded mb-2" />
            <div className="h-3 w-48 bg-white/[0.05] rounded" />
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex bg-white/[0.02] rounded-lg p-1 border border-white/05 w-48 h-8" />
          <div className="w-24 h-8 bg-white/[0.02] rounded-full" />
        </div>
      </div>

      {/* Stats Bar Skeleton */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass-card px-4 py-3 flex items-center gap-3 bg-white/[0.02] border-white/05">
            <div className="w-8 h-8 rounded-full bg-white/[0.05]" />
            <div>
              <div className="h-2 w-16 bg-white/[0.05] rounded mb-2" />
              <div className="h-4 w-24 bg-white/[0.05] rounded" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6">
        <div className="space-y-6">
          <div className="glass-card p-6 h-64 bg-white/[0.02] border-white/05" />
          <div className="glass-card p-6 h-48 bg-white/[0.02] border-white/05" />
        </div>
        <div className="space-y-6">
          <div className="glass-card p-6 h-[400px] bg-white/[0.02] border-white/05" />
        </div>
      </div>
    </div>
  );
}

export function ScanResultSkeleton() {
  return (
    <div className="glass-card p-8 flex flex-col items-center justify-center min-h-[400px] gap-6 animate-pulse bg-white/[0.02] border-white/05">
      {/* Concentric pulse rings */}
      <div className="relative flex items-center justify-center">
        <div className="absolute w-24 h-24 rounded-full border border-indigo-500/20 animate-ping" style={{ animationDuration: '2s' }} />
        <div className="absolute w-16 h-16 rounded-full border border-indigo-500/30 animate-ping" style={{ animationDuration: '1.5s' }} />
        <div className="w-12 h-12 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
          <Scan size={20} className="text-indigo-400" />
        </div>
      </div>
      
      <div className="text-center w-full mt-4 space-y-4">
        <div className="h-4 w-32 bg-white/[0.08] mx-auto rounded" />
        <div className="h-2 w-48 bg-white/[0.05] mx-auto rounded" />
      </div>

      <div className="w-full mt-6 space-y-4">
        <div className="h-2 w-full bg-white/[0.05] rounded" />
        <div className="h-2 w-[80%] bg-white/[0.05] rounded" />
        <div className="h-2 w-[90%] bg-white/[0.05] rounded" />
      </div>

      <div className="w-full grid grid-cols-3 gap-3 mt-4">
        <div className="h-16 rounded-xl bg-white/[0.03]" />
        <div className="h-16 rounded-xl bg-white/[0.03]" />
        <div className="h-16 rounded-xl bg-white/[0.03]" />
      </div>
    </div>
  );
}

export function HistorySkeleton() {
  return (
    <div className="glass-card p-6 space-y-4 animate-pulse bg-white/[0.02] border-white/05">
      <div className="flex items-center justify-between mb-6">
        <div className="h-5 w-32 bg-white/[0.08] rounded" />
        <div className="h-8 w-24 bg-white/[0.05] rounded-lg" />
      </div>
      
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/[0.02]">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-white/[0.05]" />
            <div>
              <div className="h-3 w-40 bg-white/[0.08] rounded mb-2" />
              <div className="h-2 w-24 bg-white/[0.05] rounded" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-6 w-16 bg-white/[0.05] rounded-full" />
            <div className="h-8 w-8 rounded-lg bg-white/[0.05]" />
          </div>
        </div>
      ))}
    </div>
  );
}
