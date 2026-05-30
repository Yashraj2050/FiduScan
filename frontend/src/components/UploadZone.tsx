'use client';

import { useCallback, useState } from 'react';
import { Upload, ImageIcon, X, AlertCircle } from 'lucide-react';
import { formatBytes } from '@/lib/api';

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  isAnalyzing: boolean;
  mode?: 'image' | 'audio' | 'video';
}

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/bmp'];
const ACCEPTED_AUDIO_TYPES = ['audio/wav', 'audio/mpeg', 'audio/mp3', 'audio/mp4', 'audio/x-m4a'];
const ACCEPTED_VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska'];
const MAX_SIZE_MB = 20;

export default function UploadZone({ onFileSelect, isAnalyzing, mode = 'image' }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const acceptedTypes = mode === 'image' ? ACCEPTED_IMAGE_TYPES : mode === 'audio' ? ACCEPTED_AUDIO_TYPES : ACCEPTED_VIDEO_TYPES;

  const processFile = useCallback((file: File) => {
    setError(null);

    if (!acceptedTypes.includes(file.type) && !file.name.endsWith('.m4a') && !file.name.endsWith('.mkv')) {
      const errorMsg = mode === 'image' ? 'Unsupported format. Please upload JPEG, PNG, WEBP, or BMP.' :
                       mode === 'audio' ? 'Unsupported format. Please upload WAV, MP3, or M4A.' :
                       'Unsupported format. Please upload MP4, MOV, AVI, or MKV.';
      setError(errorMsg);
      return;
    }

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`File too large. Maximum size is ${MAX_SIZE_MB}MB.`);
      return;
    }

    setSelectedFile(file);
    if (mode === 'image') {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreview('audio_placeholder');
    }
    onFileSelect(file);
  }, [onFileSelect, acceptedTypes, mode]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, [processFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  }, [processFile]);

  const handleClear = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    setSelectedFile(null);
    setError(null);
  }, []);

  return (
    <div className="w-full">
      <label htmlFor="image-upload" className="block cursor-pointer">
        <div
          id="upload-zone"
          className={`upload-zone min-h-[280px] flex flex-col items-center justify-center p-8 transition-all duration-300 ${
            isDragging ? 'dragover' : ''
          } ${isAnalyzing ? 'scanning' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {preview ? (
            /* ── Preview State ─────────────────────────────────────── */
            <div className="relative w-full flex flex-col items-center gap-4">
              <div className="relative rounded-xl overflow-hidden border border-white/10 max-h-[200px] flex items-center justify-center bg-black/20">
                {mode === 'image' && preview !== 'audio_placeholder' && preview !== 'video_placeholder' ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={preview}
                    alt="Preview"
                    className="object-contain max-h-[200px] max-w-full"
                  />
                ) : (
                  <div className="p-10 flex flex-col items-center">
                    <Upload size={40} className="text-indigo-400 opacity-50 mb-4" />
                    <span className="text-white/50 text-sm">
                      {mode === 'audio' ? 'Audio Selected' : 'Video Selected'}
                    </span>
                  </div>
                )}
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="relative flex h-8 w-8">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-50"></span>
                        <span className="relative inline-flex rounded-full h-8 w-8 bg-indigo-500"></span>
                      </div>
                      <span className="text-xs text-white/80 font-medium mt-1">Analyzing...</span>
                    </div>
                  </div>
                )}
                {!isAnalyzing && (
                  <button
                    onClick={handleClear}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-white/70 hover:text-white transition-all"
                    aria-label="Remove image"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {selectedFile && (
                <div className="flex items-center gap-2 text-xs text-white/40">
                  <ImageIcon size={12} />
                  <span className="mono">{selectedFile.name}</span>
                  <span>·</span>
                  <span className="mono">{formatBytes(selectedFile.size)}</span>
                </div>
              )}

              {!isAnalyzing && (
                <p className="text-xs text-indigo-400/70 mt-1">
                  Click or drop a new {mode} to replace
                </p>
              )}
            </div>
          ) : (
            /* ── Empty State ───────────────────────────────────────── */
            <div className="flex flex-col items-center gap-5 select-none">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-indigo-500/20 blur-xl scale-150"></div>
                <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center">
                  <Upload size={28} className="text-indigo-400" />
                </div>
              </div>

              <div className="text-center">
                <p className="text-base font-semibold text-white/80 mb-1">
                  Drop {mode} here or{' '}
                  <span className="text-indigo-400 hover:text-indigo-300 transition-colors">
                    browse files
                  </span>
                </p>
                <p className="text-sm text-white/35">
                  {mode === 'image' ? 'JPEG, PNG, WEBP, BMP' : mode === 'audio' ? 'WAV, MP3, M4A' : 'MP4, MOV, AVI, MKV'} · Max {MAX_SIZE_MB}MB
                </p>
              </div>

              <div className="flex items-center gap-3">
                {(mode === 'image' ? ['JPEG', 'PNG', 'WEBP', 'BMP'] : mode === 'audio' ? ['WAV', 'MP3', 'M4A'] : ['MP4', 'MOV', 'AVI', 'MKV']).map((fmt) => (
                  <span
                    key={fmt}
                    className="px-2.5 py-1 rounded-md text-[11px] font-mono font-medium text-white/40 bg-white/5 border border-white/08"
                  >
                    .{fmt.toLowerCase()}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </label>

      <input
        id="image-upload"
        type="file"
        accept={acceptedTypes.join(',')}
        className="sr-only"
        onChange={handleInputChange}
        disabled={isAnalyzing}
      />

      {error && (
        <div className="mt-3 flex items-center gap-2 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-fade-in">
          <AlertCircle size={15} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
