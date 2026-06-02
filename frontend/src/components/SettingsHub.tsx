'use client';

import { useState } from 'react';
import { User, Shield, CreditCard, Activity, Code, Settings, LogOut, ExternalLink, Mail, Lock } from 'lucide-react';
import BillingDashboard from '@/components/Billing/Dashboard';
import UsageDashboard from '@/components/UsageDashboard';
import DeveloperPortal from '@/components/DeveloperPortal';
import { removeToken } from '@/lib/auth';
import { useToast } from '@/components/ToastContext';

type SettingsTab = 'profile' | 'security' | 'billing' | 'usage' | 'developer';

export default function SettingsHub() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User size={18} /> },
    { id: 'security', label: 'Security', icon: <Shield size={18} /> },
    { id: 'billing', label: 'Billing', icon: <CreditCard size={18} /> },
    { id: 'usage', label: 'Usage', icon: <Activity size={18} /> },
    { id: 'developer', label: 'Developer Portal', icon: <Code size={18} /> },
  ] as const;

  const handleLogout = () => {
    removeToken();
    window.location.reload();
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 animate-fade-in">
      {/* ── Sidebar ────────────────────────────────────────────────── */}
      <div className="w-full lg:w-64 shrink-0">
        <div className="glass-card p-4 lg:sticky lg:top-8">
          <div className="flex items-center gap-3 mb-6 px-2">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
              <Settings size={20} className="text-white/80" />
            </div>
            <div>
              <h2 className="font-bold text-white">Settings</h2>
              <p className="text-xs text-white/40">Manage your account</p>
            </div>
          </div>

          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as SettingsTab)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm font-medium ${
                  activeTab === tab.id
                    ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                    : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
          
          <div className="mt-8 pt-6 border-t border-white/05 px-2">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 text-red-400/80 hover:text-red-400 transition-colors text-sm font-medium w-full"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* ── Main Content Area ────────────────────────────────────────── */}
      <div className="flex-1 min-w-0">
        {activeTab === 'profile' && <ProfileSettings />}
        {activeTab === 'security' && <SecuritySettings />}
        {activeTab === 'billing' && <BillingDashboard />}
        {activeTab === 'usage' && <UsageDashboard />}
        {activeTab === 'developer' && <DeveloperPortal />}
      </div>
    </div>
  );
}

// ─── Sub-Components (Profile & Security) ────────────────────────────────

function ProfileSettings() {
  const toast = useToast();
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
          <User size={20} className="text-indigo-400" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">Profile Settings</h2>
          <p className="text-sm text-white/50">Update your personal information</p>
        </div>
      </div>

      <div className="glass-card p-6 max-w-2xl">
        <form className="space-y-5" onSubmit={e => { e.preventDefault(); toast.success('Profile updated successfully'); }}>
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={16} />
              <input 
                type="email" 
                defaultValue="name@example.com"
                disabled
                className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white/50 focus:outline-none cursor-not-allowed"
              />
            </div>
            <p className="text-xs text-white/30 mt-2">To change your email, please contact support.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Full Name</label>
            <input 
              type="text" 
              placeholder="e.g. John Doe"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Organization</label>
            <input 
              type="text" 
              placeholder="Company Name"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div className="pt-4 border-t border-white/05 flex justify-end">
            <button type="submit" className="px-6 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium transition-colors shadow-lg shadow-indigo-500/20">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function SecuritySettings() {
  const toast = useToast();
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
          <Shield size={20} className="text-indigo-400" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">Security</h2>
          <p className="text-sm text-white/50">Manage your password and active sessions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 max-w-2xl">
        <div className="glass-card p-6">
          <h3 className="font-bold text-white mb-4">Change Password</h3>
          <form className="space-y-4" onSubmit={e => { e.preventDefault(); toast.success('Password updated successfully'); }}>
            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5">Current Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={16} />
                <input 
                  type="password" 
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={16} />
                <input 
                  type="password" 
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>
            <button type="submit" className="px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg font-medium transition-colors">
              Update Password
            </button>
          </form>
        </div>

        <div className="glass-card p-6">
          <h3 className="font-bold text-white mb-4">Active Sessions</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
              <div>
                <p className="text-sm font-medium text-white">Mac OS • Chrome</p>
                <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Active Now
                </p>
              </div>
              <p className="text-xs text-white/40 font-mono">192.168.1.1</p>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg hover:bg-white/5 border border-transparent transition-colors">
              <div>
                <p className="text-sm font-medium text-white/70">iOS • Safari</p>
                <p className="text-xs text-white/40 mt-1">Last active: 2 hours ago</p>
              </div>
              <button 
                onClick={() => toast.success('Session revoked')}
                className="text-xs text-red-400 hover:text-red-300 font-medium transition-colors"
              >
                Revoke
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
