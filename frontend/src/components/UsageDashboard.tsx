'use client';

import { Activity, Image as ImageIcon, Music, Video, Code, ArrowUpRight } from 'lucide-react';

export default function UsageDashboard() {
  const usageStats = [
    { label: 'Image Scans', value: 8432, limit: 10000, icon: <ImageIcon size={18} className="text-indigo-400" />, color: 'bg-indigo-500' },
    { label: 'Audio Scans', value: 1240, limit: 5000, icon: <Music size={18} className="text-purple-400" />, color: 'bg-purple-500' },
    { label: 'Video Scans', value: 342, limit: 1000, icon: <Video size={18} className="text-emerald-400" />, color: 'bg-emerald-500' },
    { label: 'API Calls', value: 45210, limit: 100000, icon: <Code size={18} className="text-amber-400" />, color: 'bg-amber-500' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
            <Activity size={20} className="text-indigo-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Usage & Limits</h2>
            <p className="text-sm text-white/50">Current billing cycle resets in 14 days</p>
          </div>
        </div>
        <button className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 font-medium transition-colors text-sm border border-white/10">
          Upgrade Limits
          <ArrowUpRight size={16} className="text-white/40" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {usageStats.map((stat, i) => {
          const percentage = Math.min(100, Math.round((stat.value / stat.limit) * 100));
          return (
            <div key={i} className="glass-card p-6 relative overflow-hidden group">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                    {stat.icon}
                  </div>
                  <h3 className="font-semibold text-white/90">{stat.label}</h3>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-white">{stat.value.toLocaleString()}</p>
                  <p className="text-xs text-white/40">/ {stat.limit.toLocaleString()}</p>
                </div>
              </div>
              
              <div className="w-full bg-white/10 rounded-full h-1.5 mb-2 overflow-hidden">
                <div 
                  className={`${stat.color} h-1.5 rounded-full transition-all duration-1000 ease-out`} 
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-white/40">{percentage}% used</span>
                {percentage > 80 && (
                  <span className="text-amber-400 font-medium animate-pulse">Approaching limit</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="glass-card p-6 mt-6">
        <h3 className="font-bold text-white mb-4">Storage Usage</h3>
        <div className="flex items-end justify-between mb-2">
          <div>
            <p className="text-3xl font-bold text-white">4.2 <span className="text-lg text-white/50">GB</span></p>
            <p className="text-sm text-white/40 mt-1">Total storage used for scan history</p>
          </div>
          <p className="text-sm font-medium text-white/80">42% of 10 GB</p>
        </div>
        <div className="w-full bg-white/10 rounded-full h-2 mt-4 overflow-hidden">
          <div className="bg-indigo-500 h-2 rounded-full transition-all duration-1000 w-[42%]" />
        </div>
      </div>
    </div>
  );
}
