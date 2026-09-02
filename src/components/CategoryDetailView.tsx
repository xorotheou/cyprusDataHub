import React from 'react';
import {
  ArrowLeft,
  Database,
  ExternalLink,
  Radio,
  FileText,
  Clock,
  Building2,
  Download,
  Terminal,
  CheckCircle2,
  Sparkles,
  Info
} from 'lucide-react';
import { OpenDataCategory } from '../types';

interface CategoryDetailViewProps {
  category: OpenDataCategory;
  onBack: () => void;
}

export const CategoryDetailView: React.FC<CategoryDetailViewProps> = ({
  category,
  onBack,
}) => {
  return (
    <div id={`category-detail-view-${category.id}`} className="space-y-6">
      {/* Back button and breadcrumbs */}
      <div className="flex items-center justify-between">
        <button
          id="btn-back-to-categories"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Categories</span>
        </button>

        <span className="text-xs text-slate-400 font-mono">
          Category ID: #{category.id}
        </span>
      </div>

      {/* Hero card for selected category */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200/60">
                {category.badge}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                {category.apiType}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900">
              {category.name}
            </h2>
            <p className="text-sm font-medium text-amber-700 mt-0.5 font-sans">
              {category.greekName}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs text-slate-500 font-medium">Available Datasets</div>
              <div className="text-2xl font-bold text-slate-900">{category.datasetCount}</div>
            </div>
          </div>
        </div>

        <p className="text-sm text-slate-600 leading-relaxed mt-4">
          {category.description}
        </p>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
          {category.keyMetrics.map((metric, idx) => (
            <div
              key={idx}
              className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70"
            >
              <div className="text-xs text-slate-500 font-medium">{metric.label}</div>
              <div className="text-lg font-bold text-slate-800 mt-0.5">{metric.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Dataset & API Catalog */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              Published Datasets & Endpoints
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Accessible via public REST endpoints, CKAN APIs, and automated feeds
            </p>
          </div>
        </div>

        <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
          {category.sampleDatasets.map((dataset, idx) => (
            <div
              key={idx}
              id={`dataset-item-${idx}`}
              className="p-4 hover:bg-slate-50/70 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3"
            >
              <div className="space-y-1 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-slate-800">
                    {dataset.title}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    {dataset.source}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    Update: {dataset.updateFrequency}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="px-2.5 py-1 rounded-md text-xs font-mono font-medium bg-slate-100 text-slate-700 border border-slate-200">
                  {dataset.format}
                </span>
                <a
                  href="https://www.data.gov.cy"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-md text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200/70 hover:bg-amber-100 transition-colors"
                >
                  <span>API Docs</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Integration Code Snippet */}
      <div className="bg-slate-900 text-slate-100 border border-slate-800 rounded-2xl p-5 shadow-inner">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
            <Terminal className="w-4 h-4 text-amber-400" />
            <span>Sample Query (CKAN & Public API)</span>
          </div>
          <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-amber-400 font-mono">
            GET /api/3/action/package_search
          </span>
        </div>
        <pre className="bg-slate-950 p-3.5 rounded-xl text-xs font-mono text-emerald-400 overflow-x-auto border border-slate-800/80">
          <code>
{`// Query ${category.name} from Cyprus Open Data CKAN API
const url = 'https://www.data.gov.cy/api/3/action/package_search?q=${category.id}&rows=10';
const response = await fetch(url);
const data = await response.json();
console.log(data.result.results);`}
          </code>
        </pre>
      </div>
    </div>
  );
};
