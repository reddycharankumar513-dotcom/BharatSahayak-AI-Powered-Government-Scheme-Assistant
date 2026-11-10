'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/language-context';
import { useAuth } from '@/lib/auth-context';
import { apiRequest } from '@/services/api';
import { 
  FileText, 
  UploadCloud, 
  CheckCircle2, 
  XCircle, 
  Trash2, 
  ShieldCheck, 
  AlertCircle, 
  Sparkles, 
  ArrowRight,
  FileSearch,
  Lock,
  Layers
} from 'lucide-react';

interface UserDoc {
  id: number;
  document_type: string;
  file_name: string;
  file_size_bytes: number;
  mime_type: string;
  extracted_text?: string;
  extracted_fields: Record<string, any>;
  ocr_status: string;
  uploaded_at: string;
}

interface ReadinessItem {
  document_name: string;
  document_name_te?: string;
  is_mandatory: boolean;
  is_uploaded: boolean;
  matched_file_name?: string;
}

interface ReadinessReport {
  scheme_name: string;
  readiness_percentage: number;
  status: string;
  checklist: ReadinessItem[];
  missing_categories: string[];
}

export default function DocumentsPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const { user, token, isLoading: authLoading } = useAuth();

  const [documents, setDocuments] = useState<UserDoc[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState('Aadhaar Card');
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  // Scheme Readiness Checker
  const [selectedScheme, setSelectedScheme] = useState('pm-kisan');
  const [readiness, setReadiness] = useState<ReadinessReport | null>(null);
  const [checkingReadiness, setCheckingReadiness] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  const loadDocuments = async () => {
    try {
      const data = await apiRequest<UserDoc[]>('/documents');
      setDocuments(data);
    } catch (err) {
      console.error('Documents fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const checkReadiness = async (slug: string) => {
    setCheckingReadiness(true);
    try {
      const report = await apiRequest<ReadinessReport>('/documents/readiness-check', {
        method: 'POST',
        body: JSON.stringify({ scheme_slug: slug })
      });
      setReadiness(report);
    } catch (err) {
      console.error('Readiness error:', err);
    } finally {
      setCheckingReadiness(false);
    }
  };

  useEffect(() => {
    if (user && token) {
      loadDocuments();
      checkReadiness(selectedScheme);
    }
  }, [user, token, selectedScheme]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('document_type', documentType);

    try {
      const savedToken = localStorage.getItem('jansathi_token');
      const res = await fetch('http://localhost:8000/api/documents/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${savedToken}`
        },
        body: formData
      });

      if (!res.ok) {
        throw new Error('Upload failed');
      }

      setSelectedFile(null);
      await loadDocuments();
      await checkReadiness(selectedScheme);
    } catch (err: any) {
      alert(err.message || 'Upload error');
    } finally {
      setUploading(false);
    }
  };

  const deleteDoc = async (id: number) => {
    if (confirm('Delete this document permanently?')) {
      try {
        await apiRequest(`/documents/${id}`, { method: 'DELETE' });
        await loadDocuments();
        await checkReadiness(selectedScheme);
      } catch (err) {
        console.error('Delete error:', err);
      }
    }
  };

  if (authLoading || (loading && user)) {
    return (
      <div className="min-h-screen pt-36 pb-20 flex justify-center">
        <div className="w-9 h-9 border-4 border-saffron-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 border border-blue-200 text-blue-900 text-xs font-bold uppercase tracking-wider mb-2">
            <FileSearch className="w-3.5 h-3.5 text-blue-600" />
            <span>{language === 'te' ? 'పత్రాల సంసిద్ధతా కేంద్రం' : 'Document Intelligence Hub'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-navy-900 tracking-tight">
            {language === 'te' ? 'స్మార్ట్ OCR & పత్రాల పరిశీలన' : 'Smart Document Readiness & OCR'}
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            {language === 'te'
              ? 'సంక్షేమ పథకాలకు దరఖాస్తు చేసే ముందు మీ పత్రాలను అప్‌లోడ్ చేసి సరిచూసుకోండి.'
              : 'Safely upload sample certificates to extract details and verify readiness against scheme requirements.'}
          </p>
        </div>

        {/* 2-Column Grid: Upload + Scheme Readiness / Document List */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Upload Box & Scheme Prerequisite Checker (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Upload Box */}
            <div className="glass-panel p-6 rounded-3xl border border-slate-200 shadow-sm">
              <h2 className="text-base font-bold text-navy-900 mb-3 flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-saffron-600" />
                <span>Upload Document for OCR</span>
              </h2>

              <form onSubmit={handleUpload} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Document Category
                  </label>
                  <select
                    value={documentType}
                    onChange={(e) => setDocumentType(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 bg-white"
                  >
                    <option value="Aadhaar Card">Aadhaar Card (Identity Proof)</option>
                    <option value="Ration Card">Ration Card (Food Security)</option>
                    <option value="Income Certificate">Income Certificate (Meeseva / Tahsildar)</option>
                    <option value="Land Ownership Record (Khata/RoR)">Land Ownership (RoR / Khata / Passbook)</option>
                    <option value="Bank Account Passbook">Bank Account Passbook</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Choose File (PDF, JPG, PNG)
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    required
                    onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)}
                    className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-navy-900 file:text-white hover:file:bg-saffron-600 cursor-pointer"
                  />
                </div>

                <button
                  type="submit"
                  disabled={uploading || !selectedFile}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-saffron-600 to-orange-600 hover:from-saffron-700 text-white font-bold text-xs shadow-md transition-all disabled:opacity-50"
                >
                  {uploading ? 'Processing OCR Extraction...' : 'Upload & Extract Details'}
                </button>
              </form>

              {/* Privacy Notice */}
              <div className="mt-4 p-3 rounded-2xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Files are processed in an isolated sandbox. You can permanently delete files at any time.</span>
              </div>
            </div>

            {/* Scheme Prerequisite Readiness Checker */}
            <div className="glass-panel p-6 rounded-3xl border border-slate-200 shadow-sm">
              <h2 className="text-base font-bold text-navy-900 mb-2 flex items-center justify-between">
                <span>Check Readiness for Scheme</span>
                <Layers className="w-4 h-4 text-slate-400" />
              </h2>

              <div className="mb-4">
                <select
                  value={selectedScheme}
                  onChange={(e) => setSelectedScheme(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 bg-white"
                >
                  <option value="pm-kisan">PM-KISAN (Kisan Samman Nidhi)</option>
                  <option value="ayushman-bharat">Ayushman Bharat (PM-JAY Health)</option>
                  <option value="pm-awas-yojana">Pradhan Mantri Awas Yojana (PMAY)</option>
                  <option value="pm-mudra-yojana">PM Mudra Yojana (PMMY)</option>
                  <option value="sukanya-samriddhi">Sukanya Samriddhi Yojana (SSY)</option>
                </select>
              </div>

              {readiness && (
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold mb-1">
                      <span className="text-navy-900">{readiness.scheme_name}</span>
                      <span className="text-emerald-700">{readiness.readiness_percentage}% Ready</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                        style={{ width: `${readiness.readiness_percentage}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    {readiness.checklist.map((item, idx) => (
                      <div
                        key={idx}
                        className={`flex items-start justify-between p-2.5 rounded-xl border text-xs ${
                          item.is_uploaded
                            ? 'bg-emerald-50/60 border-emerald-200 text-slate-800'
                            : 'bg-red-50/60 border-red-200 text-red-900'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          {item.is_uploaded ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                          )}
                          <div>
                            <span className="font-semibold">{item.document_name}</span>
                            {item.matched_file_name && (
                              <p className="text-[10px] text-slate-500 mt-0.5">
                                Matched: {item.matched_file_name}
                              </p>
                            )}
                          </div>
                        </div>

                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          item.is_uploaded ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {item.is_uploaded ? 'Ready' : 'Missing'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: User Uploaded Documents List (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <h2 className="text-base font-bold text-navy-900 pb-2 border-b border-slate-200">
              Your Processed Documents ({documents.length})
            </h2>

            {documents.length > 0 ? (
              documents.map((doc) => (
                <div
                  key={doc.id}
                  className="glass-card p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-xs shrink-0 border border-purple-200">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-navy-900 text-sm">{doc.document_type}</h3>
                        <p className="text-xs text-slate-500">{doc.file_name} • {(doc.file_size_bytes / 1024).toFixed(1)} KB</p>
                      </div>
                    </div>

                    <button
                      onClick={() => deleteDoc(doc.id)}
                      className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                      title="Delete Document"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Extracted Fields Table */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-1.5">
                    <span className="font-bold text-[10px] uppercase tracking-wider text-saffron-700 block mb-1">
                      OCR Extracted Metadata:
                    </span>
                    {Object.entries(doc.extracted_fields).map(([k, v]) => (
                      <div key={k} className="flex justify-between text-slate-700">
                        <span className="capitalize text-slate-500">{k.replace(/_/g, ' ')}:</span>
                        <span className="font-semibold">{String(v)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <span>Uploaded: {new Date(doc.uploaded_at).toLocaleDateString()}</span>
                    <span className="text-emerald-600 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>OCR Status: Processed</span>
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="glass-panel p-12 rounded-3xl border border-slate-200 text-center">
                <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <h3 className="text-sm font-bold text-navy-900 mb-1">No documents uploaded yet</h3>
                <p className="text-xs text-slate-500">
                  Upload a sample Aadhaar, Ration Card, or Income Certificate to verify your document readiness.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
