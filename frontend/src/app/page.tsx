'use client';

import { useState, useCallback, useEffect } from 'react';
import { Shield, Scan, RotateCcw, Activity, LogOut, User as UserIcon } from 'lucide-react';
import UploadZone from '@/components/UploadZone';
import ResultCard from '@/components/ResultCard';
import MetadataViewer from '@/components/MetadataViewer';
import HeatmapViewer from '@/components/HeatmapViewer';
import { detectImage, detectAudio, detectVideo } from '@/lib/api';
import { login, register, getToken, removeToken } from '@/lib/auth';
import { DetectionResult, AudioDetectionResult, VideoDetectionResult } from '@/types';

type AppState = 'idle' | 'analyzing' | 'result' | 'error';
type Modality = 'image' | 'audio' | 'video';

export default function Dashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  const [modality, setModality] = useState<Modality>('image');
  const [state, setState] = useState<AppState>('idle');
  const [result, setResult] = useState<DetectionResult | AudioDetectionResult | VideoDetectionResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (getToken()) setIsAuthenticated(true);
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    try {
      if (authMode === 'login') {
        await login(email, password);
      } else {
        await register(email, password);
      }
      setIsAuthenticated(true);
    } catch (err: any) {
      setAuthError(err.message || 'Authentication failed');
    }
  };

  const handleLogout = () => {
    removeToken();
    setIsAuthenticated(false);
    handleReset();
  };

  const handleFileSelect = useCallback(async (file: File) => {
    setState('analyzing');
    setResult(null);
    setErrorMsg(null);

    try {
      let data;
      if (modality === 'image') {
        data = await detectImage(file);
      } else if (modality === 'audio') {
        const audioData = await detectAudio(file);
        data = {
          ...audioData,
          metadata: audioData.explanation_metadata, // map for MetadataViewer
          heatmap_available: false,
          heatmap_b64: null
        } as unknown as DetectionResult;
      } else {
        const videoData = await detectVideo(file);
        data = {
          ...videoData,
          metadata: {
            "Frame Score": `${(videoData.frame_score * 100).toFixed(2)}% AI`,
            "Audio Score": `${(videoData.audio_score * 100).toFixed(2)}% AI`,
            "Metadata Score": `${(videoData.metadata_score * 100).toFixed(2)}% AI`,
            "Temporal Score": `${(videoData.temporal_score * 100).toFixed(2)}% AI`,
            "Explanation": videoData.explanation
          }, // map for MetadataViewer
          heatmap_available: false,
          heatmap_b64: null
        } as unknown as DetectionResult;
      }
      
      setResult(data);
      setState('result');
    } catch (err: any) {
      if (err.message.includes('401')) {
        handleLogout();
      }
      const message = err instanceof Error ? err.message : 'Detection failed. Please try again.';
      setErrorMsg(message);
      setState('error');
    }
  }, [modality]);

  const handleReset = useCallback(() => {
    setState('idle');
    setResult(null);
    setErrorMsg(null);
  }, []);

  if (!isAuthenticated) {
    return (
      <main className="relative min-h-screen flex items-center justify-center bg-black">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-indigo-600/10 blur-[120px]" />
        <div className="glass-card p-8 w-full max-w-md z-10">
          <div className="flex items-center gap-3 mb-8 justify-center">
            <Shield size={28} className="text-indigo-400" />
            <h1 className="text-2xl font-bold text-white">FiduScan Beta</h1>
          </div>
          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="text-xs text-white/50 mb-1 block">Email</label>
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500 transition-colors" 
                required 
              />
            </div>
            <div>
              <label className="text-xs text-white/50 mb-1 block">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500 transition-colors" 
                required 
              />
            </div>
            {authError && <p className="text-red-400 text-xs">{authError}</p>}
            <button type="submit" className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2 rounded-lg transition-colors">
              {authMode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
            <p className="text-center text-xs text-white/40 mt-4">
              {authMode === 'login' ? "Don't have an account? " : "Already have an account? "}
              <button type="button" onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')} className="text-indigo-400 hover:underline">
                {authMode === 'login' ? 'Register' : 'Sign In'}
              </button>
            </p>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen z-10">
      {/* ── Ambient Glows ───────────────────────────────────────────── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-indigo-600/10 blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-purple-600/08 blur-[100px]" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ── Header ────────────────────────────────────────────────── */}
        <header className="flex items-start justify-between mb-10">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 rounded-2xl bg-indigo-500/30 blur-lg scale-110" />
              <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                <Shield size={24} className="text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold gradient-text tracking-tight">FiduScan</h1>
              <p className="text-xs text-white/35 font-medium tracking-wider uppercase mt-0.5">
                AI Forensic Detection System · Phase 3 MVP
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex bg-white/[0.04] rounded-lg p-1 border border-white/10">
              <button 
                onClick={() => { setModality('image'); handleReset(); }} 
                className={`px-3 py-1.5 text-xs rounded-md transition-colors ${modality === 'image' ? 'bg-indigo-500/20 text-indigo-300 font-bold' : 'text-white/50 hover:text-white/80'}`}
              >
                Image
              </button>
              <button 
                onClick={() => { setModality('audio'); handleReset(); }} 
                className={`px-3 py-1.5 text-xs rounded-md transition-colors ${modality === 'audio' ? 'bg-indigo-500/20 text-indigo-300 font-bold' : 'text-white/50 hover:text-white/80'}`}
              >
                Audio (MVP)
              </button>
              <button 
                onClick={() => { setModality('video'); handleReset(); }} 
                className={`px-3 py-1.5 text-xs rounded-md transition-colors ${modality === 'video' ? 'bg-indigo-500/20 text-indigo-300 font-bold' : 'text-white/50 hover:text-white/80'}`}
              >
                Video (MVP)
              </button>
            </div>

            {/* System status indicator */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/08">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-50" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-xs text-white/50 font-medium">System Online</span>
            </div>

            {state === 'result' && (
              <button
                id="reset-btn"
                onClick={handleReset}
                className="btn-ghost flex items-center gap-2 px-4 py-2"
              >
                <RotateCcw size={14} />
                <span>New Scan</span>
              </button>
            )}
            
            <button onClick={handleLogout} className="btn-ghost flex items-center gap-2 px-3 py-2 text-white/50 hover:text-white/80 transition-colors">
              <LogOut size={14} />
              <span className="hidden sm:inline text-xs">Logout</span>
            </button>
          </div>
        </header>

        {/* ── Stats Bar ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { label: 'Model', value: modality === 'image' ? 'EfficientNet-B0' : modality === 'audio' ? 'Audio EfficientNet' : 'Multimodal Aggregation', icon: <Activity size={14} /> },
            { label: 'Classes', value: 'Binary (2)', icon: <Scan size={14} /> },
            { label: 'Input', value: modality === 'image' ? '224 × 224 px' : modality === 'audio' ? 'Log-Mel Spec (1x128xT)' : 'Multi-track', icon: <Shield size={14} /> },
          ].map((stat) => (
            <div key={stat.label} className="glass-card px-4 py-3 flex items-center gap-3">
              <span className="text-indigo-400/60">{stat.icon}</span>
              <div>
                <p className="text-[10px] text-white/30 uppercase tracking-wider font-semibold">{stat.label}</p>
                <p className="text-sm font-semibold text-white/80 font-mono">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Main Content ───────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6">

          {/* Left Column — Upload + Description */}
          <div className="space-y-6">

            {/* Upload Panel */}
            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center">
                  <Scan size={16} className="text-indigo-400" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-white/90">Forensic Analysis</h2>
                  <p className="text-xs text-white/40">Upload an {modality} to begin detection</p>
                </div>
              </div>

              <UploadZone
                onFileSelect={handleFileSelect}
                isAnalyzing={state === 'analyzing'}
                mode={modality}
              />

              {/* Error state */}
              {state === 'error' && errorMsg && (
                <div className="mt-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 animate-fade-in">
                  <p className="text-sm text-red-400 font-medium">Analysis Failed</p>
                  <p className="text-xs text-red-400/70 mt-1 font-mono">{errorMsg}</p>
                  <p className="text-xs text-white/30 mt-2">
                    Ensure the backend is running on{' '}
                    <span className="font-mono text-white/50">localhost:8000</span>
                  </p>
                </div>
              )}
            </div>

            {/* Heatmap */}
            {state === 'result' && result && (
              <HeatmapViewer
                available={result.heatmap_available}
                heatmapB64={result.heatmap_b64}
              />
            )}

            {/* How it works */}
            {state === 'idle' && (
              <div className="glass-card p-6">
                <h3 className="text-sm font-semibold text-white/80 mb-4">How FiduScan Works</h3>
                <div className="space-y-3">
                  {modality === 'image' ? [
                    { step: '01', title: 'Upload', desc: 'Drop any JPEG, PNG, WEBP, or BMP image into the analysis zone.' },
                    { step: '02', title: 'Validate', desc: 'File is security-checked: magic bytes, extension, and size limits enforced.' },
                    { step: '03', title: 'Analyze', desc: 'EfficientNet-B0 processes the 224×224 image through 9M parameters.' },
                    { step: '04', title: 'Explain', desc: 'Confidence scores, EXIF forensic flags, and Grad-CAM heatmaps returned.' },
                  ].map((item) => (
                    <div key={item.step} className="flex items-start gap-4">
                      <span className="text-indigo-500/60 font-mono text-xs font-bold shrink-0 mt-0.5">{item.step}</span>
                      <div>
                        <p className="text-sm font-medium text-white/75">{item.title}</p>
                        <p className="text-xs text-white/35 leading-relaxed mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                  )) : modality === 'audio' ? [
                    { step: '01', title: 'Upload', desc: 'Drop any WAV, MP3, or M4A audio file.' },
                    { step: '02', title: 'Preprocess', desc: 'Audio is resampled and converted to a Log-Mel Spectrogram.' },
                    { step: '03', title: 'Analyze', desc: 'A trained vision model analyzes the spectrogram for vocoder artifacts.' },
                    { step: '04', title: 'Explain', desc: 'Prediction and confidence scores are returned (Phase 3A MVP).' },
                  ].map((item) => (
                    <div key={item.step} className="flex items-start gap-4">
                      <span className="text-indigo-500/60 font-mono text-xs font-bold shrink-0 mt-0.5">{item.step}</span>
                      <div>
                        <p className="text-sm font-medium text-white/75">{item.title}</p>
                        <p className="text-xs text-white/35 leading-relaxed mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                  )) : [
                    { step: '01', title: 'Upload', desc: 'Drop any MP4, MOV, AVI, or MKV video file.' },
                    { step: '02', title: 'Extract', desc: 'Keyframes and audio tracks are separated for independent processing.' },
                    { step: '03', title: 'Analyze', desc: 'Image, Audio, Metadata, and Temporal analyses are run in parallel.' },
                    { step: '04', title: 'Aggregate', desc: 'A multimodal confidence score is returned along with forensic breakdowns (Phase 3B MVP).' },
                  ].map((item) => (
                    <div key={item.step} className="flex items-start gap-4">
                      <span className="text-indigo-500/60 font-mono text-xs font-bold shrink-0 mt-0.5">{item.step}</span>
                      <div>
                        <p className="text-sm font-medium text-white/75">{item.title}</p>
                        <p className="text-xs text-white/35 leading-relaxed mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column — Results */}
          <div className="space-y-6">
            {state === 'result' && result ? (
              <>
                <ResultCard result={result as DetectionResult} />
                <MetadataViewer metadata={(result as DetectionResult).metadata} />
              </>
            ) : state === 'analyzing' ? (
              <AnalyzingPlaceholder />
            ) : (
              <IdlePlaceholder />
            )}
          </div>
        </div>

        {/* ── Footer ────────────────────────────────────────────────── */}
        <footer className="mt-12 pt-6 border-t border-white/[0.04] flex items-center justify-between text-xs text-white/25">
          <span>FiduScan · Anti-Gravity Forensic System · Phase 1 MVP</span>
          <span className="font-mono">EfficientNet-B0 · PyTorch 2.4 · FastAPI</span>
        </footer>
      </div>
    </main>
  );
}

function IdlePlaceholder() {
  return (
    <div className="glass-card p-8 flex flex-col items-center justify-center min-h-[320px] gap-5">
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-indigo-500/10 blur-xl scale-150" />
        <div className="relative w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/08 flex items-center justify-center">
          <Shield size={28} className="text-white/15" />
        </div>
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-white/30 mb-1">Awaiting Image</p>
        <p className="text-xs text-white/20 max-w-[200px] leading-relaxed">
          Upload an image on the left to run forensic analysis
        </p>
      </div>
    </div>
  );
}

function AnalyzingPlaceholder() {
  return (
    <div className="glass-card p-8 flex flex-col items-center justify-center min-h-[320px] gap-6">
      {/* Concentric pulse rings */}
      <div className="relative flex items-center justify-center">
        <div className="absolute w-24 h-24 rounded-full border border-indigo-500/20 animate-ping" style={{ animationDuration: '2s' }} />
        <div className="absolute w-16 h-16 rounded-full border border-indigo-500/30 animate-ping" style={{ animationDuration: '1.5s' }} />
        <div className="w-10 h-10 rounded-full bg-indigo-500/30 border border-indigo-500/50 flex items-center justify-center">
          <Scan size={18} className="text-indigo-300" />
        </div>
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold text-white/60 mb-1">Analyzing Image</p>
        <p className="text-xs text-white/30">Running EfficientNet-B0 inference…</p>
      </div>
      {/* Scanning progress */}
      <div className="w-full max-w-[180px]">
        <div className="h-1 rounded-full bg-white/[0.05] overflow-hidden">
          <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-pulse" style={{ width: '70%' }} />
        </div>
      </div>
    </div>
  );
}
