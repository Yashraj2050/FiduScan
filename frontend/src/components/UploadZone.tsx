'use client';

import { useCallback, useState, useEffect } from 'react';
import { Upload, ImageIcon, X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { formatBytes } from '@/lib/api';

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  isAnalyzing: boolean;
  status?: 'idle' | 'analyzing' | 'result' | 'error';
  mode?: 'image' | 'audio' | 'video';
}

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/bmp'];
const ACCEPTED_AUDIO_TYPES = ['audio/wav', 'audio/mpeg', 'audio/mp3', 'audio/mp4', 'audio/x-m4a'];
const ACCEPTED_VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska'];
const MAX_SIZE_MB = 20;

export default function UploadZone({ onFileSelect, isAnalyzing, status = 'idle', mode = 'image' }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Progress states
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const acceptedTypes = mode === 'image' ? ACCEPTED_IMAGE_TYPES : mode === 'audio' ? ACCEPTED_AUDIO_TYPES : ACCEPTED_VIDEO_TYPES;

  // Clear file when changing modes or external reset
  useEffect(() => {
    if (status === 'idle' && !isUploading) {
      setPreview(null);
      setSelectedFile(null);
      setError(null);
      setUploadProgress(0);
    }
  }, [status, isUploading]);

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
      setPreview('media_placeholder');
    }

    // Simulate upload progress
    setIsUploading(true);
    setUploadProgress(0);
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 15) + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => {
          setIsUploading(false);
          onFileSelect(file);
        }, 500);
      }
      setUploadProgress(progress);
    }, 150);

  }, [onFileSelect, acceptedTypes, mode]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (isAnalyzing || isUploading || status === 'result') return;
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, [processFile, isAnalyzing, isUploading, status]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (isAnalyzing || isUploading || status === 'result') return;
    setIsDragging(true);
  }, [isAnalyzing, isUploading, status]);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  }, [processFile]);

  const handleClear = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (isAnalyzing || isUploading) return;
    setPreview(null);
    setSelectedFile(null);
    setError(null);
    setUploadProgress(0);
  }, [isAnalyzing, isUploading]);

  return (
    <div className="w-full">
      <label htmlFor={isAnalyzing || isUploading || status === 'result' ? undefined : "image-upload"} className={`block ${isAnalyzing || isUploading || status === 'result' ? 'cursor-default' : 'cursor-pointer'}`}>
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
              <div className="relative rounded-xl overflow-hidden border border-white/10 max-h-[200px] w-full flex items-center justify-center bg-black/20">
                {mode === 'image' && preview !== 'media_placeholder' ? (
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

                {/* Overlays for different states */}
                {(isUploading || isAnalyzing || status === 'result' || status === 'error') && (
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center backdrop-blur-sm animate-fade-in">
                    <div className="flex flex-col items-center gap-3 w-full max-w-[200px]">
                      
                      {isUploading && (
                        <>
                          <div className="flex justify-between w-full text-xs text-white/80 font-medium mb-1">
                            <span>Uploading</span>
                            <span>{uploadProgress}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-indigo-500 rounded-full transition-all duration-200" 
                              style={{ width: `${uploadProgress}%` }}
                            />
                          </div>
                        </>
                      )}

                      {!isUploading && status === 'analyzing' && (
                        <>
                          <div className="relative flex h-10 w-10 mb-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-50"></span>
                            <span className="relative inline-flex rounded-full h-10 w-10 bg-indigo-500 items-center justify-center">
                              <Upload size={18} className="text-white animate-pulse" />
                            </span>
                          </div>
                          <span className="text-sm text-white/90 font-medium">Processing...</span>
                          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mt-1">
                            <div className="h-full w-1/2 bg-indigo-500 rounded-full animate-progress" />
                          </div>
                        </>
                      )}

                      {!isUploading && status === 'result' && (
                        <div className="flex flex-col items-center gap-2 animate-bounce-in">
                          <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                            <CheckCircle2 size={24} className="text-emerald-400" />
                          </div>
                          <span className="text-sm text-emerald-400 font-medium">Analysis Complete</span>
                        </div>
                      )}

                      {!isUploading && status === 'error' && (
                        <div className="flex flex-col items-center gap-2 animate-bounce-in">
                          <div className="w-12 h-12 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center">
                            <X size={24} className="text-red-400" />
                          </div>
                          <span className="text-sm text-red-400 font-medium">Failed</span>
                        </div>
                      )}

                    </div>
                  </div>
                )}

                {!isAnalyzing && !isUploading && status !== 'result' && status !== 'error' && (
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

              {status !== 'result' && status !== 'error' && !isUploading && !isAnalyzing && (
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
                <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center group-hover:scale-105 transition-transform">
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

              <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3">
                {(mode === 'image' ? ['JPEG', 'PNG', 'WEBP', 'BMP'] : mode === 'audio' ? ['WAV', 'MP3', 'M4A'] : ['MP4', 'MOV', 'AVI', 'MKV']).map((fmt) => (
                  <span
                    key={fmt}
                    className="px-2.5 py-1 rounded-md text-[10px] sm:text-[11px] font-mono font-medium text-white/40 bg-white/5 border border-white/08"
                  >
                    .{fmt.toLowerCase()}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </label>

      {(!isAnalyzing && !isUploading && status !== 'result') && (
        <input
          id="image-upload"
          type="file"
          accept={acceptedTypes.join(',')}
          className="sr-only"
          onChange={handleInputChange}
          disabled={isAnalyzing || isUploading}
        />
      )}

      {error && (
        <div className="mt-3 flex items-center gap-2 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-fade-in">
          <AlertCircle size={15} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
