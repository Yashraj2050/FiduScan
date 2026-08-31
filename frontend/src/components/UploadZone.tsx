'use client';

import { useCallback, useState, useEffect } from 'react';
import { Upload, ImageIcon, X, AlertCircle, CheckCircle2, ChevronRight } from 'lucide-react';
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

function AnalysisStages() {
  const stages = [
    "Ingesting evidence",
    "Running authenticity analysis",
    "Inspecting metadata",
    "Calculating risk",
    "Consulting Trust Agent",
    "Applying policy",
    "Recording audit"
  ];
  const [currentStage, setCurrentStage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStage(prev => (prev < stages.length - 1 ? prev + 1 : prev));
    }, 250);
    return () => clearInterval(interval);
  }, [stages.length]);

  return (
    <div className="flex flex-col items-start gap-3 w-full max-w-[200px] animate-fade-in">
      {stages.map((stage, index) => {
        const isActive = index === currentStage;
        const isPast = index < currentStage;
        const isFuture = index > currentStage;

        return (
          <div 
            key={index} 
            className={`flex items-center gap-3 text-sm transition-all duration-300 ${
              isActive ? 'text-white font-medium transform translate-x-1' : 
              isPast ? 'text-white/40' : 'text-white/20'
            }`}
          >
            {isPast ? (
              <CheckCircle2 size={14} className="text-emerald-500/70 shrink-0" />
            ) : isActive ? (
              <ChevronRight size={14} className="text-indigo-400 shrink-0 animate-pulse" />
            ) : (
              <div className="w-3.5 h-3.5 rounded-full border border-white/10 shrink-0" />
            )}
            <span className="truncate">{stage}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function UploadZone({ onFileSelect, isAnalyzing, status = 'idle', mode = 'image' }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const acceptedTypes = mode === 'image' ? ACCEPTED_IMAGE_TYPES : mode === 'audio' ? ACCEPTED_AUDIO_TYPES : ACCEPTED_VIDEO_TYPES;

  useEffect(() => {
    if (status === 'idle') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPreview(null);
      setSelectedFile(null);
      setError(null);
    }
  }, [status]);

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

  }, [acceptedTypes, mode]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (isAnalyzing || status === 'result') return;
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, [processFile, isAnalyzing, status]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (isAnalyzing || status === 'result') return;
    setIsDragging(true);
  }, [isAnalyzing, status]);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  }, [processFile]);

  const handleClear = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (isAnalyzing) return;
    setPreview(null);
    setSelectedFile(null);
    setError(null);
  }, [isAnalyzing]);

  if (status === 'analyzing') {
    return (
      <div className="w-full h-full min-h-[300px] flex items-center justify-center">
        <AnalysisStages />
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center group">
      {!selectedFile ? (
        <label htmlFor="image-upload" className="w-full h-full cursor-pointer flex flex-col items-center justify-center min-h-[250px]">
          <div
            className={`w-full h-full flex flex-col items-center justify-center p-8 transition-all duration-300 rounded border ${
              isDragging ? 'border-indigo-500/50 bg-indigo-500/5' : 'border-transparent group-hover:border-white/10 group-hover:bg-white/[0.02]'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <Upload size={24} className="text-white/40 mb-4 transition-transform group-hover:-translate-y-1" />
            <p className="text-sm font-medium text-white/90 mb-1">Upload evidence</p>
            <p className="text-xs text-white/50 mb-4">Drop an {mode} here or browse</p>
            <p className="text-[10px] text-white/30 uppercase tracking-wider font-mono">
              {mode === 'image' ? 'JPEG, PNG, WEBP, BMP' : mode === 'audio' ? 'WAV, MP3, M4A' : 'MP4, MOV, AVI, MKV'} · Max {MAX_SIZE_MB}MB
            </p>
          </div>
        </label>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center p-6 relative">
          <button
            onClick={handleClear}
            className="absolute top-2 right-2 p-1.5 rounded bg-black/60 hover:bg-black/80 text-white/70 hover:text-white transition-all border border-white/10"
          >
            <X size={14} />
          </button>
          
          <div className="w-full max-w-[240px] flex flex-col items-center gap-4">
            {mode === 'image' && preview !== 'media_placeholder' ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={preview!} alt="Preview" className="w-full h-32 object-contain rounded border border-white/10 bg-black/50" />
            ) : (
              <div className="w-full h-32 flex items-center justify-center rounded border border-white/10 bg-black/50">
                <ImageIcon size={32} className="text-white/20" />
              </div>
            )}
            
            <div className="flex flex-col items-center w-full">
              <span className="text-sm text-white/90 truncate w-full text-center font-mono">{selectedFile.name}</span>
              <span className="text-xs text-white/40 font-mono mt-1">{formatBytes(selectedFile.size)}</span>
            </div>
            
            <button 
              onClick={(e) => { e.preventDefault(); onFileSelect(selectedFile); }}
              className="w-full flex items-center justify-center gap-2 bg-white text-black py-2.5 rounded text-sm font-medium hover:bg-white/90 transition-colors mt-2 shadow-sm"
            >
              Analyze Evidence <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      <input
        id="image-upload"
        type="file"
        accept={acceptedTypes.join(',')}
        className="sr-only"
        onChange={handleInputChange}
        disabled={isAnalyzing}
      />
    </div>
  );
}
