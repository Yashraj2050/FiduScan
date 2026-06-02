'use client';

import { useState } from 'react';
import { Shield, ArrowRight, PlayCircle, Building2, Lock, Zap, CheckCircle2 } from 'lucide-react';
import ResultCard from './ResultCard';
import { DetectionResult } from '@/types';

interface LandingDemoProps {
  onSignInClick: () => void;
  onRegisterClick: () => void;
}

export default function LandingDemo({ onSignInClick, onRegisterClick }: LandingDemoProps) {
  const [demoState, setDemoState] = useState<'idle' | 'analyzing' | 'result'>('idle');
  const [progress, setProgress] = useState(0);

  const mockResult: DetectionResult = {
    prediction: 'AI_GENERATED',
    confidence: 0.98,
    authentic_probability: 0.02,
    ai_probability: 0.98,
    inference_time_ms: 124,
    request_id: 'demo-req-12345',
    filename: 'synth_profile_04.jpg',
    metadata: {},
    heatmap_available: false,
    heatmap_b64: null,
    model_version: 'v1.0',
  };

  const startDemo = () => {
    setDemoState('analyzing');
    setProgress(0);
    
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 10;
      setProgress(currentProgress);
      if (currentProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => setDemoState('result'), 500);
      }
    }, 150);
  };

  const resetDemo = () => setDemoState('idle');

  // A4: Backend API docs URL
  const API_DOCS_URL = 'https://fiduscan-backend-production.up.railway.app/api/docs';

  return (
    <div className="min-h-screen bg-black text-white selection:bg-indigo-500/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/05 bg-black/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="text-indigo-500" size={24} />
            <span className="font-bold text-lg tracking-tight">FiduScan<span className="text-indigo-500">.</span></span>
          </div>
          <div className="flex items-center gap-4">
            {/* A4: Enterprise link scrolls to enterprise section */}
            <button
              onClick={() => document.getElementById('pricing-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-sm text-white/60 hover:text-white transition-colors hidden sm:block"
            >
              Pricing
            </button>
            <button
              onClick={() => document.getElementById('enterprise-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-sm text-white/60 hover:text-white transition-colors hidden sm:block"
            >
              Enterprise
            </button>
            {/* A4: API Docs links to live backend docs */}
            <a
              href={API_DOCS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-white/60 hover:text-white transition-colors hidden sm:block"
            >
              API Docs
            </a>
            <button 
              onClick={onSignInClick}
              className="text-sm bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors font-medium"
            >
              Sign In
            </button>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium mb-8">
            <Zap size={14} />
            {/* A7: Remove unverified claim — keep factual */}
            <span>Multimodal Deepfake Detection — Image, Audio &amp; Video</span>
          </div>
          {/* A7: "Cryptographic Certainty" → accurate, defensible headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            Detect AI-Generated Media<br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
              with Forensic Precision
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-white/40 max-w-2xl mx-auto mb-10 leading-relaxed">
            Protect your platform from synthetic media. FiduScan analyzes images, audio, and video using ensemble neural networks to detect AI-generated content with explainable confidence scores.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {/* A3: "Start Scanning Free" opens Register, not Login */}
            <button 
              onClick={onRegisterClick}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-8 py-3.5 rounded-xl font-medium transition-all shadow-lg shadow-indigo-500/25"
            >
              Start Scanning Free <ArrowRight size={18} />
            </button>
            <button 
              onClick={() => {
                document.getElementById('demo-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-8 py-3.5 rounded-xl font-medium transition-colors"
            >
              <PlayCircle size={18} className="text-white/60" /> See It In Action
            </button>
          </div>
        </section>

        {/* Interactive Demo Section */}
        <section id="demo-section" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">See FiduScan in Action</h2>
            <p className="text-white/40">Try the interactive simulation to see how we analyze media.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Simulation Controls */}
            <div className="glass-card p-6 sm:p-8">
              <h3 className="text-lg font-semibold mb-6">Upload Simulation</h3>
              
              <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center bg-white/[0.02] mb-6">
                {demoState === 'idle' ? (
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-indigo-500/20 flex items-center justify-center mb-4 cursor-pointer hover:scale-105 transition-transform" onClick={startDemo}>
                      <PlayCircle size={32} className="text-indigo-400" />
                    </div>
                    <p className="text-sm font-medium mb-1">Click to run sample analysis</p>
                    <p className="text-xs text-white/40">synth_profile_04.jpg (1.2MB)</p>
                  </div>
                ) : demoState === 'analyzing' ? (
                  <div className="flex flex-col items-center">
                    <div className="relative w-16 h-16 mb-4">
                      <div className="absolute inset-0 rounded-full border-2 border-indigo-500/20" />
                      <div 
                        className="absolute inset-0 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" 
                      />
                    </div>
                    <p className="text-sm font-medium mb-2">Analyzing Media...</p>
                    <div className="w-full max-w-[200px] h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-indigo-500 rounded-full transition-all duration-150" 
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
                      <CheckCircle2 size={32} className="text-emerald-400" />
                    </div>
                    <p className="text-sm font-medium mb-4">Analysis Complete</p>
                    <button 
                      onClick={resetDemo}
                      className="text-xs text-white/60 hover:text-white underline"
                    >
                      Run another test
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1"><Shield size={16} className="text-indigo-400" /></div>
                  <div>
                    <h4 className="text-sm font-medium">File Integrity Verification</h4>
                    <p className="text-xs text-white/40">Cryptographic hashing ensures tamper-free analysis.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1"><Zap size={16} className="text-indigo-400" /></div>
                  <div>
                    <h4 className="text-sm font-medium">Fast Inference</h4>
                    <p className="text-xs text-white/40">Results typically returned in under 500ms.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Preview */}
            <div className="opacity-100 transition-opacity duration-500">
              {demoState === 'result' ? (
                <ResultCard result={mockResult} />
              ) : (
                <div className="glass-card p-8 h-full flex flex-col items-center justify-center min-h-[400px] text-center border-dashed border-white/10 bg-white/[0.01]">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                    <Shield size={28} className="text-white/20" />
                  </div>
                  <p className="text-white/40 text-sm">Run the simulation to see a forensic report.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Pricing Section (B2) */}
        <section id="pricing-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-white/05">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-white/40">Scale your trust &amp; safety operations with plans designed for any volume.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Tier */}
            <div className="glass-card p-8 flex flex-col">
              <h3 className="text-xl font-bold mb-2">Free</h3>
              <p className="text-sm text-white/50 mb-6">Perfect for testing and personal use.</p>
              <div className="mb-8">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-white/40"> / month</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                {['100 Scans / month', 'Image Analysis Only', 'Standard Dashboard', 'Community Support'].map(feature => (
                  <li key={feature} className="flex items-center gap-3">
                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                    <span className="text-sm text-white/80">{feature}</span>
                  </li>
                ))}
              </ul>
              <button 
                onClick={onRegisterClick}
                className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-colors border border-white/10"
              >
                Start Free
              </button>
            </div>

            {/* Pro Tier */}
            <div className="glass-card p-8 flex flex-col relative border-indigo-500/50 transform md:-translate-y-4 shadow-2xl shadow-indigo-500/10">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-3 py-1 bg-indigo-500 text-white text-xs font-bold rounded-full">
                Most Popular
              </div>
              <h3 className="text-xl font-bold mb-2 text-indigo-400">Pro</h3>
              <p className="text-sm text-white/50 mb-6">For growing platforms and startups.</p>
              <div className="mb-8">
                <span className="text-4xl font-bold">$49</span>
                <span className="text-white/40"> / month</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                {['10,000 Scans / month', 'Image, Audio & Video', 'API Access', 'Priority Support'].map(feature => (
                  <li key={feature} className="flex items-center gap-3">
                    <CheckCircle2 size={16} className="text-indigo-400 shrink-0" />
                    <span className="text-sm text-white/80">{feature}</span>
                  </li>
                ))}
              </ul>
              <button 
                onClick={onRegisterClick}
                className="w-full py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-medium transition-colors shadow-lg shadow-indigo-500/25"
              >
                Upgrade to Pro
              </button>
            </div>

            {/* Enterprise Tier */}
            <div className="glass-card p-8 flex flex-col">
              <h3 className="text-xl font-bold mb-2">Enterprise</h3>
              <p className="text-sm text-white/50 mb-6">For high-volume media pipelines.</p>
              <div className="mb-8">
                <span className="text-4xl font-bold">Custom</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                {['Unlimited Scans', 'Custom SLAs', 'Dedicated Infrastructure', 'White-glove Onboarding'].map(feature => (
                  <li key={feature} className="flex items-center gap-3">
                    <CheckCircle2 size={16} className="text-purple-400 shrink-0" />
                    <span className="text-sm text-white/80">{feature}</span>
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => document.getElementById('enterprise-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-colors border border-white/10"
              >
                Contact Sales
              </button>
            </div>
          </div>
        </section>

        {/* Enterprise Section — A4: id added so nav link scrolls correctly */}
        <section id="enterprise-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-white/05">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Built for Scale</h2>
              {/* A7: Remove "99.99% uptime SLAs" and "SOC2 Compliant" — unverified claims */}
              <p className="text-white/40 mb-8 leading-relaxed">
                Integrate FiduScan directly into your trust &amp; safety workflows. Our REST API is designed for high-throughput media pipelines with consistent, low-latency responses.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  'REST API with JSON responses',
                  'Webhook notifications',
                  'Custom model fine-tuning (Enterprise)',
                  'Dedicated onboarding support',
                ].map(item => (
                  <li key={item} className="flex items-center gap-3">
                    <CheckCircle2 size={18} className="text-indigo-400 shrink-0" />
                    <span className="text-sm font-medium text-white/80">{item}</span>
                  </li>
                ))}
              </ul>
              {/* A4: "View Documentation" links to live docs */}
              <a
                href={API_DOCS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
              >
                View API Documentation <ArrowRight size={16} />
              </a>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {/* A7: Replace unverified "10M+ Scans / Month" with factual capability claims */}
              <div className="glass-card p-6 flex flex-col items-center text-center justify-center h-40">
                <Building2 size={24} className="text-white/40 mb-3" />
                <p className="text-xl font-bold">High-Volume</p>
                <p className="text-xs text-white/40 uppercase tracking-wider mt-1">Batch Processing</p>
              </div>
              <div className="glass-card p-6 flex flex-col items-center text-center justify-center h-40">
                <Zap size={24} className="text-white/40 mb-3" />
                <p className="text-xl font-bold">Sub-second</p>
                {/* A7: "< 200ms Avg Latency" removed — replace with honest description */}
                <p className="text-xs text-white/40 uppercase tracking-wider mt-1">Typical Inference</p>
              </div>
              <div className="glass-card p-6 flex flex-col items-center text-center justify-center h-40 col-span-2">
                <Lock size={24} className="text-white/40 mb-3" />
                <p className="text-xl font-bold">Privacy-First Design</p>
                <p className="text-xs text-white/40 mt-1 max-w-xs">Zero-retention options available for sensitive media pipelines.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/05 bg-black py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Shield className="text-white/40" size={20} />
            <span className="font-semibold text-white/40 tracking-tight">FiduScan</span>
          </div>
          <p className="text-xs text-white/30">&copy; 2026 FiduScan. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
