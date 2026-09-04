import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  ExternalLink,
  Calendar,
  Building2,
  Mail,
  User,
  Shield,
  FileCode,
  Tag
} from 'lucide-react';
import { CyprusDatasetItem } from '../types';

interface DatasetDetailModalProps {
  dataset: CyprusDatasetItem | null;
  onClose: () => void;
}

export const DatasetDetailModal: React.FC<DatasetDetailModalProps> = ({ dataset, onClose }) => {
  const [copiedId, setCopiedId] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'json'>('details');

  if (!dataset) return null;

  const handleCopyId = () => {
    navigator.clipboard.writeText(dataset.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(dataset, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const formattedModified = dataset.modified
    ? new Date(dataset.modified).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Unknown';

  const formattedIssued = dataset.issued
    ? new Date(dataset.issued).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : null;

  return (
    <div
      id="dataset-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        id="dataset-modal-card"
        className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-start justify-between gap-4 bg-slate-50/50">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                Official Open Dataset
              </span>
              {dataset.qualityScoring && (
                <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  Quality: {dataset.qualityScoring}%
                </span>
              )}
            </div>
            <h3 className="text-lg font-bold text-slate-900 leading-snug">
              {dataset.title}
            </h3>
            {dataset.greekTitle && dataset.greekTitle !== dataset.title && (
              <p className="text-xs font-medium text-amber-800 font-sans">
                {dataset.greekTitle}
              </p>
            )}
          </div>

          <button
            id="btn-close-modal"
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs switcher */}
        <div className="px-6 pt-3 border-b border-slate-100 flex items-center gap-4 text-xs font-medium">
          <button
            onClick={() => setActiveTab('details')}
            className={`pb-2.5 border-b-2 transition-colors ${
              activeTab === 'details'
                ? 'border-amber-600 text-amber-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Metadata & Description
          </button>
          <button
            onClick={() => setActiveTab('json')}
            className={`pb-2.5 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'json'
                ? 'border-amber-600 text-amber-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Raw API Payload (JSON)</span>
          </button>
        </div>

        {/* Body content */}
        <div className="p-6 overflow-y-auto space-y-5 text-slate-700 text-sm">
          {activeTab === 'details' ? (
            <>
              {/* Description */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Description
                </h4>
                <p className="text-slate-700 leading-relaxed text-sm bg-slate-50/70 p-3.5 rounded-xl border border-slate-100">
                  {dataset.description || 'No description provided in English.'}
                </p>
                {dataset.greekDescription && dataset.greekDescription !== dataset.description && (
                  <p className="text-xs text-slate-500 font-sans italic bg-slate-50/40 p-3 rounded-lg border border-slate-100 mt-2">
                    {dataset.greekDescription}
                  </p>
                )}
              </div>

              {/* Publisher and Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>Publishing Authority</span>
                  </div>
                  <div className="font-semibold text-slate-900 text-sm">
                    {dataset.publisher}
                  </div>
                  <div className="text-xs text-slate-400">
                    Republic of Cyprus National Portal
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Timestamps</span>
                  </div>
                  <div className="text-xs text-slate-700 font-medium">
                    <span className="text-slate-500">Last Modified:</span> {formattedModified}
                  </div>
                  {formattedIssued && (
                    <div className="text-xs text-slate-700">
                      <span className="text-slate-500">Issued:</span> {formattedIssued}
                    </div>
                  )}
                </div>
              </div>

              {/* Contact point if available */}
              {dataset.contactPoint && (dataset.contactPoint.name || dataset.contactPoint.email) && (
                <div className="p-3.5 bg-amber-50/50 rounded-xl border border-amber-100/70 space-y-1">
                  <div className="text-xs font-semibold text-amber-900 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-amber-700" />
                    <span>Designated Contact Point</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-amber-800">
                    {dataset.contactPoint.name && (
                      <span>Name: {dataset.contactPoint.name}</span>
                    )}
                    {dataset.contactPoint.email && (
                      <a
                        href={`mailto:${dataset.contactPoint.email}`}
                        className="flex items-center gap-1 underline text-amber-900 hover:text-amber-950"
                      >
                        <Mail className="w-3 h-3" />
                        {dataset.contactPoint.email}
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Formats & Identifier */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Data Distribution & Formats
                </h4>
                <div className="flex flex-wrap items-center gap-2">
                  {dataset.formats.map((fmt) => (
                    <span
                      key={fmt}
                      className="px-2.5 py-1 rounded-md text-xs font-mono font-medium bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1"
                    >
                      <Tag className="w-3 h-3 text-slate-400" />
                      {fmt}
                    </span>
                  ))}
                </div>
              </div>

              {/* ID Bar */}
              <div className="flex items-center justify-between p-3 bg-slate-100/80 rounded-xl border border-slate-200 text-xs font-mono">
                <span className="truncate text-slate-600 mr-2">
                  ID: {dataset.id}
                </span>
                <button
                  onClick={handleCopyId}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 transition-colors shrink-0"
                >
                  {copiedId ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy ID</span>
                    </>
                  )}
                </button>
              </div>
            </>
          ) : (
            /* JSON View */
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">
                  Direct Response from European Data Portal / Cyprus National Catalog
                </span>
                <button
                  onClick={handleCopyJson}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                >
                  {copiedJson ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Full JSON</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-4 bg-slate-950 text-emerald-400 font-mono text-xs rounded-xl overflow-x-auto max-h-96 border border-slate-800 leading-relaxed">
                <code>{JSON.stringify(dataset, null, 2)}</code>
              </pre>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            Official Source: Republic of Cyprus Open Data
          </div>

          <div className="flex items-center gap-2">
            <a
              href={dataset.portalUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium bg-amber-600 text-white hover:bg-amber-700 transition-colors shadow-xs"
            >
              <span>Open on European Data Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <a
              href={dataset.cyprusPortalUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              <span>data.gov.cy</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
