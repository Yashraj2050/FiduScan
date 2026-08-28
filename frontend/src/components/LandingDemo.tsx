'use client';

import { useState } from 'react';
import { Shield, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import ResultCard from './ResultCard';
import UploadZone from './UploadZone';
import { TrustAnalysisResponse } from '@/types';
import { analyzeTrust } from '@/lib/api';

interface LandingDemoProps {
  onSignInClick: () => void;
  onRegisterClick: () => void;
}

export default function LandingDemo({ onSignInClick, onRegisterClick }: LandingDemoProps) {
  const [demoState, setDemoState] = useState<'idle' | 'analyzing' | 'result' | 'error'>('idle');
  const [result, setResult] = useState<TrustAnalysisResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileSelect = async (file: File) => {
    setDemoState('analyzing');
    setErrorMsg(null);
    try {
      const [data] = await Promise.all([
        analyzeTrust(file),
        new Promise(resolve => setTimeout(resolve, 2000))
      ]);
      setResult(data);
      setDemoState('result');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to analyze evidence.');
      setDemoState('error');
    }
  };

  const resetDemo = () => {
    setDemoState('idle');
    setResult(null);
    setErrorMsg(null);
  };

  const API_DOCS_URL = 'https://fiduscan-backend-production.up.railway.app/api/docs';

  return (
    <div className="min-h-screen text-white selection:bg-indigo-500/30 flex flex-col relative">
      
      {/* Background styling is in globals.css, just need a relative wrapper */}
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/[0.04] bg-black/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="text-white" size={20} />
            <span className="font-semibold tracking-tight text-white text-sm">FiduScan</span>
          </div>
          <div className="flex items-center gap-6">
            <a href={API_DOCS_URL} target="_blank" rel="noopener noreferrer" className="text-xs text-white/50 hover:text-white transition-colors">
              API Reference
            </a>
            <button onClick={onSignInClick} className="text-xs text-white/50 hover:text-white transition-colors">
              Sign In
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-grow pt-24 pb-16 flex flex-col items-center justify-center">
        
        {/* Minimal Hero */}
        <section className="w-full max-w-4xl mx-auto px-4 text-center mb-16 animate-fade-up">
          <p className="fs-label mb-6 text-indigo-400">Digital Trust Infrastructure</p>
          <h1 className="fs-h1 mb-6">
            Trust digital evidence<br className="hidden sm:block" />
            before it triggers action.
          </h1>
          <p className="text-base text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed">
            AI-powered evidence analysis, metadata forensics and policy-driven risk decisions — with every decision recorded in a tamper-evident audit trail.
          </p>
          
          <div className="flex flex-col items-center gap-4">
            <button 
              onClick={() => document.getElementById('demo-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="flex items-center justify-center gap-2 bg-white hover:bg-white/90 text-black px-6 py-2.5 rounded font-medium transition-colors text-sm shadow-sm"
            >
              Analyze Evidence <ArrowRight size={16} />
            </button>
            <p className="text-xs text-white/30 flex items-center gap-2">
              <ShieldCheck size={12} /> Secure • Auditable • Evidence-driven
            </p>
          </div>
        </section>

        {/* Demo Section */}
        <section id="demo-section" className="w-full max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            
            {/* Upload Side */}
            <div className="fs-surface p-6 flex flex-col min-h-[420px]">
              <div className="flex justify-between items-center mb-6">
                <h2 className="fs-h3">Ingest Evidence</h2>
                {(demoState === 'result' || demoState === 'error') && (
                  <button onClick={resetDemo} className="text-xs text-white/50 hover:text-white transition-colors">
                    Reset
                  </button>
                )}
              </div>
              
              <div className="flex-grow relative rounded border border-white/[0.05] bg-black/20 flex flex-col items-center justify-center p-4">
                <UploadZone 
                  onFileSelect={handleFileSelect} 
                  isAnalyzing={demoState === 'analyzing'} 
                  status={demoState}
                  mode="image" 
                />
              </div>

              {errorMsg && (
                <div className="mt-4 p-3 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-red-400" />
                  {errorMsg}
                </div>
              )}
            </div>

            {/* Results Side */}
            <div className="min-h-[420px] transition-all duration-500 relative">
              {demoState === 'result' && result ? (
                <ResultCard result={result} />
              ) : (
                <div className="fs-panel p-6 h-full flex flex-col items-center justify-center text-center border border-dashed border-white/10 opacity-50">
                  <Shield size={24} className="text-white/20 mb-3" />
                  <p className="text-sm text-white/50">Analysis Pending</p>
                  <p className="text-xs text-white/30 mt-1">Upload evidence to generate a risk report.</p>
                </div>
              )}
            </div>
          </div>
        </section>

      </main>
      
      {/* Footer */}
      <footer className="border-t border-white/[0.04] py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <span className="font-semibold text-white/30 text-xs">FiduScan</span>
          <p className="text-xs text-white/30">&copy; 2026 FiduScan Infrastructure.</p>
        </div>
      </footer>
    </div>
  );
}
