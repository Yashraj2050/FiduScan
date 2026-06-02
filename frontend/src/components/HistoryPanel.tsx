'use client';

import { useState } from 'react';
import { Search, Filter, ShieldCheck, ShieldAlert, Image as ImageIcon, Music, Video, ChevronDown, Calendar, FileText } from 'lucide-react';

type Modality = 'image' | 'audio' | 'video';
type ResultType = 'authentic' | 'suspicious' | 'fake';
import { useEffect } from 'react';
import { getHistory } from '@/lib/api';
import { HistoryScan } from '@/types';
import { HistorySkeleton } from './Skeletons';

export default function HistoryPanel() {
  const [searchQuery, setSearchQuery] = useState('');
  const [modalityFilter, setModalityFilter] = useState<Modality | 'all'>('all');
  const [resultFilter, setResultFilter] = useState<ResultType | 'all'>('all');
  
  const [history, setHistory] = useState<HistoryScan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNext, setHasNext] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchHistory = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getHistory(page, modalityFilter, resultFilter);
        if (isMounted) {
          setHistory(data.items);
          setTotalPages(data.pages);
          setHasNext(data.has_next);
        }
      } catch (err: any) {
        if (isMounted) setError(err.message || 'Failed to load history');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchHistory();
    return () => { isMounted = false; };
  }, [page, modalityFilter, resultFilter]);

  // Client-side search (since API doesn't support search yet)
  const filteredHistory = history.filter(item => {
    return item.filename.toLowerCase().includes(searchQuery.toLowerCase()) || item.id.includes(searchQuery);
  });

  return (
    <div className="space-y-6">
      {/* ── Header & Filters ────────────────────────────────────────── */}
      <div className="glass-card p-6 flex flex-col sm:flex-row gap-4 justify-between items-center z-10 relative">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={16} />
          <input 
            type="text" 
            placeholder="Search filenames or IDs..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
            <Filter size={14} className="text-white/40" />
            <select 
              value={modalityFilter} 
              onChange={(e) => setModalityFilter(e.target.value as any)}
              className="bg-transparent text-sm text-white/80 focus:outline-none cursor-pointer appearance-none pr-4"
            >
              <option value="all" className="bg-gray-900">All Modalities</option>
              <option value="image" className="bg-gray-900">Images</option>
              <option value="audio" className="bg-gray-900">Audio</option>
              <option value="video" className="bg-gray-900">Video</option>
            </select>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
            <ShieldCheck size={14} className="text-white/40" />
            <select 
              value={resultFilter} 
              onChange={(e) => setResultFilter(e.target.value as any)}
              className="bg-transparent text-sm text-white/80 focus:outline-none cursor-pointer appearance-none pr-4"
            >
              <option value="all" className="bg-gray-900">All Results</option>
              <option value="authentic" className="bg-gray-900">Authentic</option>
              <option value="suspicious" className="bg-gray-900">Suspicious</option>
              <option value="fake" className="bg-gray-900">Fake (AI)</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── History List ───────────────────────────────────────────── */}
      <div className="glass-card overflow-hidden">
        {loading ? (
          <HistorySkeleton />
        ) : error ? (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <ShieldAlert size={32} className="text-red-400 mb-4" />
            <p className="text-white/80 font-medium">Error loading history</p>
            <p className="text-sm text-white/40 mt-1">{error}</p>
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
              <Search size={24} className="text-white/20" />
            </div>
            <p className="text-white/60 font-medium">No scans found</p>
            <p className="text-sm text-white/40 mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="divide-y divide-white/05">
            {filteredHistory.map((item) => (
              <div key={item.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                    {item.type === 'image' ? <ImageIcon size={18} className="text-indigo-400" /> : 
                     item.type === 'audio' ? <Music size={18} className="text-purple-400" /> : 
                     <Video size={18} className="text-emerald-400" />}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-white/90 truncate max-w-[200px] sm:max-w-[300px]">{item.filename}</h4>
                    <div className="flex items-center gap-2 text-xs text-white/40 mt-1">
                      <span className="uppercase tracking-wider">{item.type}</span>
                      <span>&bull;</span>
                      <span className="font-mono">{new Date(item.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-auto w-full border-t sm:border-0 border-white/05 pt-4 sm:pt-0">
                  <div className="flex flex-col items-start sm:items-end">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      item.result === 'authentic' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      item.result === 'fake' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                      'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {item.result === 'fake' ? 'AI Generated' : item.result === 'authentic' ? 'Authentic' : 'Suspicious'}
                    </span>
                    <span className="text-xs text-white/40 mt-1 font-mono">
                      {Math.round(item.confidence * 100)}% Confidence
                    </span>
                  </div>
                  
                  <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/40 hover:text-white">
                    <FileText size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && totalPages > 1 && (
          <div className="p-4 border-t border-white/05 flex items-center justify-between">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 text-sm text-white/60 hover:text-white hover:bg-white/5 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <span className="text-sm text-white/40">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={!hasNext}
              className="px-4 py-2 text-sm text-white/60 hover:text-white hover:bg-white/5 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
