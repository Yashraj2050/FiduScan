'use client';

import { CreditCard, CheckCircle2, Zap, ArrowRight, Clock, Receipt } from 'lucide-react';

export default function BillingDashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
          <CreditCard size={20} className="text-indigo-400" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">Billing & Plans</h2>
          <p className="text-sm text-white/50">Manage your subscription and payment methods</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Current Plan Card */}
        <div className="glass-card p-6 relative overflow-hidden flex flex-col">
          <div className="absolute top-0 right-0 p-6">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
              <CheckCircle2 size={12} />
              Active
            </span>
          </div>
          
          <div className="mb-8">
            <p className="text-sm text-white/50 font-medium mb-1">Current Plan</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-bold text-white">Pro</h3>
              <span className="text-white/40 text-sm">/ month</span>
            </div>
          </div>
          
          <div className="space-y-3 flex-1 mb-8">
            {[
              '10,000 Scans / month',
              'Advanced Audio Analysis',
              'Enterprise API Access',
              'Dedicated Support'
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <CheckCircle2 size={16} className="text-indigo-400" />
                <span className="text-sm text-white/80">{feature}</span>
              </div>
            ))}
          </div>

          <button className="w-full py-2.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 font-medium transition-colors border border-indigo-500/20 flex items-center justify-center gap-2">
            Manage Subscription
            <ArrowRight size={16} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Payment Method */}
          <div className="glass-card p-6">
            <h4 className="text-sm font-semibold text-white/80 mb-4">Payment Method</h4>
            <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-8 bg-gradient-to-br from-gray-800 to-gray-900 rounded border border-white/10 flex items-center justify-center">
                  <span className="text-xs font-bold italic text-white/80">VISA</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-white/90">•••• •••• •••• 4242</p>
                  <p className="text-xs text-white/40">Expires 12/28</p>
                </div>
              </div>
              <button className="text-sm text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                Edit
              </button>
            </div>
          </div>

          {/* Billing History */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold text-white/80">Billing History</h4>
              <button className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                View All
              </button>
            </div>
            
            <div className="space-y-3">
              {[
                { date: 'Jun 1, 2026', amount: '$49.00', status: 'Paid' },
                { date: 'May 1, 2026', amount: '$49.00', status: 'Paid' },
                { date: 'Apr 1, 2026', amount: '$49.00', status: 'Paid' },
              ].map((invoice, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-indigo-500/10 transition-colors">
                      <Receipt size={14} className="text-white/40 group-hover:text-indigo-400 transition-colors" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white/90">{invoice.amount}</p>
                      <p className="text-xs text-white/40">{invoice.date}</p>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full">
                    {invoice.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
