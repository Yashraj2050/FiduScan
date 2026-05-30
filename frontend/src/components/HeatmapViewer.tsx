'use client';

import { Eye, Zap, Download } from 'lucide-react';

interface HeatmapViewerProps {
  available: boolean;
  heatmapB64?: string | null;
}

export default function HeatmapViewer({ available, heatmapB64 }: HeatmapViewerProps) {
  const handleDownload = () => {
    if (!heatmapB64) return;
    const link = document.createElement('a');
    link.href = heatmapB64;
    link.download = `fiduscan_gradcam_${Date.now()}.png`;
    link.click();
  };

  return (
    <div className="glass-card p-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/25 flex items-center justify-center">
            <Eye size={16} className="text-purple-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white/90">Explainability Heatmap</h3>
            <p className="text-xs text-white/40">Grad-CAM attention visualization</p>
          </div>
        </div>
        {available && heatmapB64 && (
          <button
            id="download-heatmap"
            onClick={handleDownload}
            className="btn-ghost flex items-center gap-1.5 px-3 py-1.5 text-xs"
            title="Download Grad-CAM heatmap"
          >
            <Download size={13} />
            <span>Export</span>
          </button>
        )}
      </div>

      {available && heatmapB64 ? (
        /* ── Live Heatmap ────────────────────────────────────────── */
        <div className="space-y-3">
          <div className="relative rounded-xl overflow-hidden border border-purple-500/20">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={heatmapB64}
              alt="Grad-CAM Explainability Heatmap"
              className="w-full object-contain"
            />
            {/* Color scale legend */}
            <div className="absolute bottom-2 left-2 right-2 flex items-center gap-2">
              <span className="text-[10px] text-white/60 font-mono">Low</span>
              <div className="flex-1 h-2 rounded-full"
                style={{
                  background: 'linear-gradient(90deg, #000080, #0000ff, #00ffff, #00ff00, #ffff00, #ff0000)'
                }}
              />
              <span className="text-[10px] text-white/60 font-mono">High</span>
            </div>
          </div>
          <p className="text-xs text-white/30 text-center leading-relaxed">
            Red regions indicate areas most influential in the detection decision.
            Generated via Grad-CAM on the final convolutional block.
          </p>
        </div>
      ) : (
        /* ── Phase 2 Placeholder ─────────────────────────────────── */
        <div className="rounded-xl bg-white/[0.02] border border-dashed border-white/10 h-48 flex flex-col items-center justify-center gap-3">
          <div className="relative">
            <div className="absolute -inset-3 rounded-full bg-purple-500/10 animate-pulse"></div>
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
              <Zap size={20} className="text-purple-400/60" />
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-white/40 mb-1">
              Grad-CAM Unavailable
            </p>
            <p className="text-xs text-white/25 max-w-[220px] leading-relaxed">
              Train the model first. Heatmaps are generated automatically post-training.
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/08 border border-purple-500/15">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400/60"></span>
            <span className="text-[11px] text-purple-300/60 font-medium">
              Activates after model training
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
