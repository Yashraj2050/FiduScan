'use client';

import { useState } from 'react';
import { ImageMetadata } from '@/types';
import { Database, ChevronDown, ChevronUp, MapPin, Camera, Cpu, AlertTriangle } from 'lucide-react';
import { formatBytes } from '@/lib/api';

interface MetadataViewerProps {
  metadata: ImageMetadata;
}

export default function MetadataViewer({ metadata }: MetadataViewerProps) {
  const [exifExpanded, setExifExpanded] = useState(false);
  const exifEntries = Object.entries(metadata.exif || {}).filter(
    ([k]) => !['MakerNote', 'UserComment'].includes(k)
  );

  return (
    <div className="glass-card p-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/25 flex items-center justify-center">
          <Database size={16} className="text-blue-400" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white/90">Metadata Analysis</h3>
          <p className="text-xs text-white/40">EXIF · Forensic Flags · File Properties</p>
        </div>
      </div>

      {/* ── Forensic Flags ────────────────────────────────────────── */}
      {metadata.forensic_flags && metadata.forensic_flags.length > 0 && (
        <div className="mb-4 p-3 rounded-xl bg-amber-500/08 border border-amber-500/20">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={13} className="text-amber-400 shrink-0" />
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
              Forensic Flags
            </span>
          </div>
          <div className="space-y-1.5">
            {metadata.forensic_flags.map((flag, i) => (
              <p key={i} className="text-xs text-amber-300/70 font-mono leading-relaxed">
                · {flag}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* ── File Properties ───────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <MetaRow label="Format" value={metadata.format || '—'} />
        <MetaRow
          label="Dimensions"
          value={metadata.width && metadata.height ? `${metadata.width} × ${metadata.height}` : '—'}
        />
        <MetaRow
          label="File Size"
          value={metadata.file_size_bytes ? formatBytes(metadata.file_size_bytes) : '—'}
        />
        <MetaRow
          label="Megapixels"
          value={metadata.megapixels ? `${metadata.megapixels} MP` : '—'}
        />
      </div>

      {/* ── Camera / Software Info ─────────────────────────────────── */}
      {(metadata.camera_make || metadata.software) && (
        <div className="mb-4 space-y-2">
          {metadata.camera_make && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.05]">
              <Camera size={13} className="text-white/30 shrink-0" />
              <span className="text-xs text-white/50 shrink-0 w-20">Camera</span>
              <span className="text-xs text-white/75 font-mono truncate">
                {[metadata.camera_make, metadata.camera_model].filter(Boolean).join(' ')}
              </span>
            </div>
          )}
          {metadata.software && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.05]">
              <Cpu size={13} className="text-white/30 shrink-0" />
              <span className="text-xs text-white/50 shrink-0 w-20">Software</span>
              <span className="text-xs text-white/75 font-mono truncate">{metadata.software}</span>
            </div>
          )}
          {metadata.has_gps && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/08 border border-amber-500/15">
              <MapPin size={13} className="text-amber-400 shrink-0" />
              <span className="text-xs text-amber-300/80">GPS data present in EXIF</span>
            </div>
          )}
        </div>
      )}

      {/* ── Raw EXIF Toggle ────────────────────────────────────────── */}
      {exifEntries.length > 0 && (
        <div>
          <button
            id="toggle-exif"
            onClick={() => setExifExpanded(!exifExpanded)}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.05] hover:border-white/10 transition-all text-xs text-white/50 hover:text-white/70"
          >
            <span>Raw EXIF Data ({exifEntries.length} fields)</span>
            {exifExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {exifExpanded && (
            <div className="mt-2 p-3 rounded-lg bg-black/30 border border-white/[0.04] max-h-48 overflow-y-auto">
              <div className="space-y-1.5">
                {exifEntries.map(([key, value]) => (
                  <div key={key} className="flex gap-2 text-[11px] font-mono">
                    <span className="text-indigo-400/70 shrink-0 min-w-[120px] truncate">{key}</span>
                    <span className="text-white/45 truncate">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {exifEntries.length === 0 && (
        <p className="text-xs text-white/30 font-mono text-center py-2">
          No EXIF metadata found — common in AI-generated images
        </p>
      )}
    </div>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.05]">
      <p className="text-[10px] text-white/35 uppercase tracking-wider font-semibold mb-0.5">{label}</p>
      <p className="text-xs text-white/75 font-mono">{value}</p>
    </div>
  );
}
