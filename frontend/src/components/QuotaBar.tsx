'use client';

import { useState, useEffect } from 'react';
import { getUsage } from '@/lib/api';
import { Zap, AlertTriangle } from 'lucide-react';

export default function QuotaBar() {
  const [usage, setUsage] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchQuota() {
      try {
        const data = await getUsage();
        setUsage(data);
      } catch (err) {
        console.error('Failed to fetch usage:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchQuota();
  }, []);

  if (loading || !usage) {
    return <div className="h-8 w-48 bg-white/5 animate-pulse rounded-lg hidden sm:block"></div>;
  }

  const { current_plan, usage_limits } = usage;
  
  // Aggregate total scans for a simplified quota view in the header
  const totalScansUsed = usage.image_scans + usage.audio_scans + usage.video_scans;
  const totalScansLimit = usage_limits.image + usage_limits.audio + usage_limits.video;
  
  const percentage = totalScansLimit > 0 ? Math.min(100, Math.round((totalScansUsed / totalScansLimit) * 100)) : 0;
  
  const isNearLimit = percentage >= 80;
  const isAtLimit = percentage >= 100;

  // Calculate days until reset (mock logic as per requirements to show a reset date)
  // Normally this would come from the backend, but we'll use a standard "14 days" or similar static calculation if backend doesn't provide it, 
  // or simple visual if not. The prompt says "Show monthly reset date", we'll just derive one from the current month for display.
  const today = new Date();
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
  const daysUntilReset = Math.max(1, Math.ceil((nextMonth.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));

  return (
    <div className="hidden lg:flex items-center gap-4 px-4 py-1.5 bg-white/[0.04] border border-white/10 rounded-lg">
      <div className="flex flex-col">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-white/50">{current_plan} Plan</span>
          {isAtLimit ? (
            <AlertTriangle size={10} className="text-red-400" />
          ) : (
            <span className="text-[10px] text-white/30">Resets in {daysUntilReset}d</span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ${isAtLimit ? 'bg-red-500' : isNearLimit ? 'bg-amber-400' : 'bg-indigo-500'}`}
              style={{ width: `${percentage}%` }}
            />
          </div>
          <span className={`text-xs font-medium font-mono ${isAtLimit ? 'text-red-400' : 'text-white/70'}`}>
            {totalScansUsed.toLocaleString()} / {totalScansLimit.toLocaleString()}
          </span>
        </div>
      </div>
      <button className="flex items-center justify-center w-6 h-6 rounded-md bg-white/5 hover:bg-white/10 transition-colors text-white/40 hover:text-white" title="Upgrade Plan">
        <Zap size={12} />
      </button>
    </div>
  );
}
