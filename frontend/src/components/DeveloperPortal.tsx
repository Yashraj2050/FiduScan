'use client';

import { useState, useEffect } from 'react';
import { Key, Copy, Check, Trash2, Plus, AlertTriangle, ShieldCheck } from 'lucide-react';
import { createApiKey, listApiKeys, revokeApiKey } from '@/lib/api';
import { ApiKeyResponse } from '@/types';

export default function DeveloperPortal() {
  const [keys, setKeys] = useState<ApiKeyResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newKeyName, setNewKeyName] = useState('');
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchKeys();
  }, []);

  const fetchKeys = async () => {
    setLoading(true);
    try {
      const data = await listApiKeys();
      setKeys(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load API keys');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;

    setIsCreating(true);
    try {
      const result = await createApiKey(newKeyName);
      setNewlyCreatedKey(result.api_key);
      setNewKeyName('');
      await fetchKeys(); // refresh list
    } catch (err: any) {
      setError(err.message || 'Failed to create key');
    } finally {
      setIsCreating(false);
    }
  };

  const handleRevoke = async (id: string) => {
    if (!confirm('Are you sure you want to revoke this key? Any applications using it will instantly fail.')) return;
    
    try {
      await revokeApiKey(id);
      await fetchKeys(); // refresh list
    } catch (err: any) {
      setError(err.message || 'Failed to revoke key');
    }
  };

  const copyToClipboard = () => {
    if (newlyCreatedKey) {
      navigator.clipboard.writeText(newlyCreatedKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Header ────────────────────────────────────────── */}
      <div className="glass-card p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="flex items-center gap-4 mb-2 relative z-10">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
            <Key size={24} className="text-indigo-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">API Keys</h2>
            <p className="text-sm text-white/50">Manage your secret keys for API access</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400">
          <AlertTriangle size={18} />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* ── New Key Creation Alert ───────────────────────────────────── */}
      {newlyCreatedKey && (
        <div className="p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-4">
          <div className="flex items-center gap-3 text-emerald-400">
            <ShieldCheck size={24} />
            <h3 className="font-bold text-lg">New API Key Created!</h3>
          </div>
          <p className="text-sm text-emerald-400/80">
            Please copy this key and store it securely. For security reasons, <strong>it will never be shown again</strong>.
          </p>
          <div className="flex items-center gap-2">
            <code className="flex-1 bg-black/40 text-emerald-300 px-4 py-3 rounded-lg font-mono text-sm border border-emerald-500/30 overflow-x-auto">
              {newlyCreatedKey}
            </code>
            <button
              onClick={copyToClipboard}
              className="p-3 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 transition-colors shrink-0"
            >
              {copied ? <Check size={20} /> : <Copy size={20} />}
            </button>
          </div>
          <button 
            onClick={() => setNewlyCreatedKey(null)}
            className="text-sm text-emerald-400/60 hover:text-emerald-400 transition-colors"
          >
            I have saved it securely, dismiss
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Create Key Form ────────────────────────────────────────── */}
        <div className="glass-card p-6 h-fit">
          <h3 className="font-bold text-white mb-4">Generate New Key</h3>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5">Key Name</label>
              <input
                type="text"
                placeholder="e.g. Production Environment"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                maxLength={40}
                required
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={isCreating || !newKeyName.trim()}
              className="w-full flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2 rounded-lg font-medium transition-colors"
            >
              <Plus size={16} />
              {isCreating ? 'Generating...' : 'Generate Key'}
            </button>
          </form>
        </div>

        {/* ── Key List ──────────────────────────────────────────────── */}
        <div className="glass-card lg:col-span-2 overflow-hidden">
          <div className="p-6 border-b border-white/05">
            <h3 className="font-bold text-white">Active Keys</h3>
          </div>
          
          {loading ? (
            <div className="p-12 flex justify-center">
              <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
            </div>
          ) : keys.length === 0 ? (
            <div className="p-12 text-center">
              <Key size={32} className="text-white/20 mx-auto mb-4" />
              <p className="text-white/60 font-medium">No API keys generated</p>
              <p className="text-sm text-white/40 mt-1">Create one to integrate FiduScan into your app.</p>
            </div>
          ) : (
            <div className="divide-y divide-white/05">
              {keys.map((key) => (
                <div key={key.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:bg-white/[0.02] transition-colors">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className={`font-medium ${key.revoked ? 'text-white/40 line-through' : 'text-white/90'}`}>
                        {key.name}
                      </h4>
                      {key.revoked ? (
                        <span className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 text-[10px] font-bold uppercase tracking-wider">
                          Revoked
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold uppercase tracking-wider">
                          Active
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-white/40 font-mono">
                      {key.id}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-white/30 mt-2">
                      <span>Created: {new Date(key.created_at).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>Last used: {key.last_used_at ? new Date(key.last_used_at).toLocaleDateString() : 'Never'}</span>
                    </div>
                  </div>
                  
                  {!key.revoked && (
                    <button
                      onClick={() => handleRevoke(key.id)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors sm:opacity-0 group-hover:opacity-100 focus:opacity-100"
                    >
                      <Trash2 size={14} />
                      Revoke
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
