'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useLanguage } from '@/lib/language-context';
import { apiRequest } from '@/services/api';
import { 
  ShieldCheck, 
  Users, 
  Layers, 
  FileCheck2, 
  RefreshCw, 
  Plus, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  History,
  ExternalLink,
  X
} from 'lucide-react';

interface AnalyticsData {
  total_citizens: number;
  total_schemes: number;
  total_categories: number;
  total_documents_processed: number;
  source_freshness: {
    fresh_count: number;
    due_for_review_count: number;
    freshness_ratio: string;
  };
  recent_audit_logs: Array<{
    id: number;
    action: string;
    target_entity: string;
    target_id: number;
    details: Record<string, any>;
    timestamp: string;
  }>;
}

interface AdminScheme {
  id: number;
  name: string;
  name_te?: string;
  slug: string;
  level: string;
  category: string;
  last_verified_date: string;
  is_fresh: boolean;
  official_website: string;
  rules_count: number;
  documents_count: number;
  sources_count: number;
  is_active: boolean;
}

export default function AdminPage() {
  const router = useRouter();
  const { user, token, isLoading: authLoading } = useAuth();
  const { language } = useLanguage();

  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [schemes, setSchemes] = useState<AdminScheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [verifyingId, setVerifyingId] = useState<number | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New scheme form state
  const [newScheme, setNewScheme] = useState({
    name: '',
    name_te: '',
    slug: '',
    category_id: 1,
    level: 'Central',
    summary: '',
    description: '',
    benefits: '',
    application_procedure: '',
    official_website: ''
  });

  const loadData = async () => {
    try {
      const [anData, scData] = await Promise.all([
        apiRequest<AnalyticsData>('/admin/analytics'),
        apiRequest<AdminScheme[]>('/admin/schemes')
      ]);
      setAnalytics(anData);
      setSchemes(scData);
    } catch (err) {
      console.error('Admin load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/auth/login');
      } else {
        loadData();
      }
    }
  }, [user, authLoading, router]);

  const verifySource = async (schemeId: number) => {
    setVerifyingId(schemeId);
    try {
      await apiRequest('/admin/sources/verify', {
        method: 'POST',
        body: JSON.stringify({ scheme_id: schemeId, notes: 'Routine Gazette verification completed by Nodal Officer.' })
      });
      await loadData();
    } catch (err) {
      alert('Verification update failed');
    } finally {
      setVerifyingId(null);
    }
  };

  const handleCreateScheme = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest('/admin/schemes', {
        method: 'POST',
        body: JSON.stringify(newScheme)
      });
      setShowAddModal(false);
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Create scheme failed');
    }
  };

  if (authLoading || (loading && user)) {
    return (
      <div className="min-h-screen pt-36 pb-20 flex justify-center">
        <div className="w-8 h-8 border-4 border-saffron-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Bar */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-200 shadow-sm mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-saffron-700 bg-orange-100 px-3 py-0.5 rounded-full">
                Admin Console
              </span>
              <span className="text-xs text-slate-500 font-semibold">
                Officer: {user?.full_name || 'Nodal Officer'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-navy-900 mt-1">
              Public Scheme Administration & Audit
            </h1>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-saffron-600 to-orange-600 text-white font-bold text-xs shadow-md hover:shadow transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Scheme</span>
          </button>
        </div>

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="glass-card p-5 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-500 font-semibold">Registered Citizens</span>
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-2xl font-black text-navy-900">{analytics?.total_citizens || 1}</h3>
            <p className="text-[11px] text-slate-400 mt-1">Active platform accounts</p>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-500 font-semibold">Total Welfare Schemes</span>
              <Layers className="w-5 h-5 text-saffron-600" />
            </div>
            <h3 className="text-2xl font-black text-navy-900">{analytics?.total_schemes || 5}</h3>
            <p className="text-[11px] text-slate-400 mt-1">Central & State registries</p>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-500 font-semibold">Source Freshness Ratio</span>
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="text-2xl font-black text-emerald-700">
              {analytics?.source_freshness.freshness_ratio || '100%'}
            </h3>
            <p className="text-[11px] text-slate-400 mt-1">Verified within 30 days</p>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-500 font-semibold">Documents Processed</span>
              <FileCheck2 className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="text-2xl font-black text-navy-900">{analytics?.total_documents_processed || 0}</h3>
            <p className="text-[11px] text-slate-400 mt-1">OCR metadata checks</p>
          </div>
        </div>

        {/* Scheme Management & Verification Monitor */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-200 shadow-sm mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-navy-900">
              Scheme Registry & Source Freshness Monitor
            </h2>
            <span className="text-xs text-slate-500 font-semibold">
              {schemes.length} Registered Initiatives
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase tracking-wider font-bold">
                <tr>
                  <th className="p-3.5">Scheme Title</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Level</th>
                  <th className="p-3.5">Last Verified</th>
                  <th className="p-3.5">Freshness Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {schemes.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3.5 font-bold text-navy-900">
                      <Link href={`/schemes/${s.slug}`} className="hover:text-saffron-600">
                        {s.name}
                      </Link>
                    </td>
                    <td className="p-3.5 text-slate-600">{s.category}</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded bg-slate-100 font-semibold text-slate-700">
                        {s.level}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-600">
                      {new Date(s.last_verified_date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded-full font-bold flex items-center gap-1 w-fit ${
                        s.is_fresh ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {s.is_fresh ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                        <span>{s.is_fresh ? 'Fresh (<30d)' : 'Due for Review'}</span>
                      </span>
                    </td>
                    <td className="p-3.5 text-right space-x-2">
                      <button
                        onClick={() => verifySource(s.id)}
                        disabled={verifyingId === s.id}
                        className="py-1 px-3 rounded-lg bg-navy-900 hover:bg-saffron-600 text-white font-bold transition-colors disabled:opacity-50"
                      >
                        {verifyingId === s.id ? 'Verifying...' : 'Verify Gazette'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Audit Logs Table */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-navy-900 mb-4 flex items-center gap-2">
            <History className="w-5 h-5 text-blue-600" />
            <span>Recent Administrative Audit Logs</span>
          </h2>

          <div className="space-y-2">
            {analytics?.recent_audit_logs && analytics.recent_audit_logs.length > 0 ? (
              analytics.recent_audit_logs.map((log) => (
                <div key={log.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-navy-900 uppercase tracking-wider bg-white px-2 py-0.5 rounded border border-slate-200">
                      {log.action}
                    </span>
                    <span className="text-slate-700">{log.target_entity} ID #{log.target_id}</span>
                  </div>
                  <span className="text-slate-400 text-[11px]">{new Date(log.timestamp).toLocaleString()}</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400">No audit logs recorded yet.</p>
            )}
          </div>
        </div>

        {/* Add Scheme Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <h3 className="text-lg font-bold text-navy-900">Publish New Government Scheme</h3>
                <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateScheme} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Scheme Title (English)</label>
                  <input
                    type="text"
                    required
                    value={newScheme.name}
                    onChange={(e) => setNewScheme({ ...newScheme, name: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Scheme Title (Telugu)</label>
                  <input
                    type="text"
                    value={newScheme.name_te}
                    onChange={(e) => setNewScheme({ ...newScheme, name_te: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Unique Slug</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. pm-poshan-scheme"
                    value={newScheme.slug}
                    onChange={(e) => setNewScheme({ ...newScheme, slug: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Summary</label>
                  <textarea
                    required
                    rows={2}
                    value={newScheme.summary}
                    onChange={(e) => setNewScheme({ ...newScheme, summary: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Core Benefits</label>
                  <input
                    type="text"
                    required
                    value={newScheme.benefits}
                    onChange={(e) => setNewScheme({ ...newScheme, benefits: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Official Portal URL</label>
                  <input
                    type="url"
                    required
                    value={newScheme.official_website}
                    onChange={(e) => setNewScheme({ ...newScheme, official_website: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>

                <div className="pt-3 flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-saffron-600 text-white font-bold"
                  >
                    Publish Scheme
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
