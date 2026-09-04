import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
  Search,
  Filter,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Info,
  Layers,
  Code,
  CheckCircle2,
  Calendar,
  Eye,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { OpenDataCategory, CyprusDatasetItem } from '../types';
import { fetchCyprusDatasets } from '../services/cyprusDataService';
import { DatasetDetailModal } from './DatasetDetailModal';
import { DatasetPagination } from './DatasetPagination';
import { ApiHealthIndicator } from './ApiHealthIndicator';

interface CategoryDetailViewProps {
  category: OpenDataCategory;
  onBack: () => void;
}

export const CategoryDetailView: React.FC<CategoryDetailViewProps> = ({
  category,
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState<'all_datasets' | 'live_feeds'>('all_datasets');

  // Datasets state
  const [datasets, setDatasets] = useState<CyprusDatasetItem[]>([]);
  const [totalCount, setTotalCount] = useState<number>(category.datasetCount);
  const [publishersList, setPublishersList] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  // Filters & Pagination
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedPublisher, setSelectedPublisher] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<string>('modified+desc');
  const [page, setPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(20);

  // Modal inspection
  const [inspectingDataset, setInspectingDataset] = useState<CyprusDatasetItem | null>(null);

  // Expanded descriptions map
  const [expandedDesc, setExpandedDesc] = useState<Record<string, boolean>>({});

  const toggleExpandDesc = (id: string) => {
    setExpandedDesc((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const loadData = useCallback(
    async (showRefreshSpinner = false) => {
      if (showRefreshSpinner) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setErrorNotice(null);

      try {
        const res = await fetchCyprusDatasets({
          categoryQuery: category.searchQuery,
          userQuery: searchTerm,
          publisher: selectedPublisher,
          sort: sortOrder,
          page,
          pageSize,
          categoryId: category.id,
        });

        setDatasets(res.datasets);
        setTotalCount(res.totalCount);
        if (res.publishers.length > 0) {
          setPublishersList(res.publishers);
        }
      } catch (err) {
        console.error('Failed to load datasets:', err);
        setErrorNotice('Could not reach remote API; displaying cached official registry.');
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [category.searchQuery, category.id, searchTerm, selectedPublisher, sortOrder, page, pageSize]
  );

  // Trigger data load on parameters change
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Reset to page 0 when search or filters change
  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    setPage(0);
  };

  const handlePublisherChange = (val: string) => {
    setSelectedPublisher(val);
    setPage(0);
  };

  const handleSortChange = (val: string) => {
    setSortOrder(val);
    setPage(0);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    const anchor = document.getElementById('datasets-list-anchor');
    if (anchor) {
      anchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(0);
    const anchor = document.getElementById('datasets-list-anchor');
    if (anchor) {
      anchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const startItemNumber = totalCount === 0 ? 0 : page * pageSize + 1;
  const endItemNumber = Math.min((page + 1) * pageSize, totalCount);

  return (
    <div id={`category-detail-view-${category.id}`} className="space-y-6">
      {/* Top Bar: Back & Breadcrumb */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          id="btn-back-to-categories"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Categories</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live National API Connected
          </span>
          <span className="font-mono text-[11px] text-slate-400">
            Sector: {category.id}
          </span>
        </div>
      </div>

      {/* Hero Category Header Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200/70">
                {category.badge}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                {category.apiType}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-sky-50 text-sky-700 border border-sky-200">
                EU DCAT-AP Standard
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {category.name}
            </h1>
            <p className="text-sm font-semibold text-amber-700 mt-1 font-sans">
              {category.greekName}
            </p>

            {/* Featured API Field with Endpoint Health Status & Uptime Indicator */}
            <div className="mt-3.5 flex flex-wrap items-center gap-2">
              <div
                id={`featured-api-field-${category.id}`}
                className="inline-flex flex-wrap items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/90 text-xs shadow-2xs"
              >
                <span className="text-[11px] uppercase tracking-wider font-bold text-slate-500">
                  Featured API:
                </span>
                <span className="font-semibold text-slate-900">
                  {category.featuredApi}
                </span>
                <span className="text-slate-300 hidden sm:inline" aria-hidden="true">
                  •
                </span>
                <ApiHealthIndicator
                  categoryId={category.id}
                  featuredApi={category.featuredApi}
                  endpointUrl={category.featuredApiEndpoint}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/80 shrink-0">
            <div className="text-right">
              <div className="text-xs text-slate-500 font-medium">Official Datasets</div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {totalCount}
              </div>
            </div>
            <button
              onClick={() => loadData(true)}
              disabled={isRefreshing}
              title="Refresh datasets from official API"
              className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-amber-700 hover:bg-slate-50 transition-colors shadow-2xs disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-amber-600' : ''}`} />
            </button>
          </div>
        </div>

        <p className="text-sm text-slate-600 leading-relaxed mt-4 max-w-4xl">
          {category.description}
        </p>

        {/* Sector KPIs */}
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

      {/* Main Tabs switcher */}
      <div className="border-b border-slate-200 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <button
            id="tab-all-datasets"
            onClick={() => setActiveTab('all_datasets')}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'all_datasets'
                ? 'border-amber-600 text-amber-700 bg-amber-50/30'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>All Official Datasets</span>
            <span className="px-2 py-0.5 rounded-full text-xs bg-slate-100 text-slate-700 font-bold">
              {totalCount}
            </span>
          </button>

          <button
            id="tab-live-feeds"
            onClick={() => setActiveTab('live_feeds')}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'live_feeds'
                ? 'border-amber-600 text-amber-700 bg-amber-50/30'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Radio className="w-4 h-4 text-emerald-600" />
            <span>Curated Real-Time Feeds & APIs</span>
            <span className="px-2 py-0.5 rounded-full text-xs bg-emerald-100 text-emerald-800 font-semibold">
              {category.sampleDatasets.length}
            </span>
          </button>
        </div>

        {activeTab === 'all_datasets' && (
          <div className="text-xs text-slate-500 py-2">
            Showing <strong className="text-slate-800">{startItemNumber} - {endItemNumber}</strong> of <strong className="text-slate-800">{totalCount}</strong> datasets
          </div>
        )}
      </div>

      {/* Tab 1: All Official Datasets List with Filtering & Paging */}
      {activeTab === 'all_datasets' && (
        <div className="space-y-4">
          {/* Controls Bar: Search, Publisher Filter, Sort, Page Size */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={`Search all ${totalCount} datasets (e.g., "Nicosia", "Paphos", "sensor", "monthly")...`}
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 text-slate-800 placeholder-slate-400"
                />
                {searchTerm && (
                  <button
                    onClick={() => handleSearchChange('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Publisher Filter */}
              <div className="flex items-center gap-2">
                <select
                  value={selectedPublisher}
                  onChange={(e) => handlePublisherChange(e.target.value)}
                  aria-label="Filter by Publisher"
                  className="py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 cursor-pointer font-medium max-w-[220px] truncate"
                >
                  <option value="">All Publishers / Ministries</option>
                  {publishersList.map((pub) => (
                    <option key={pub} value={pub}>
                      {pub}
                    </option>
                  ))}
                </select>

                {/* Sort Order */}
                <select
                  value={sortOrder}
                  onChange={(e) => handleSortChange(e.target.value)}
                  aria-label="Sort Datasets"
                  className="py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 cursor-pointer font-medium"
                >
                  <option value="modified+desc">Newest Updated</option>
                  <option value="modified+asc">Oldest Updated</option>
                  <option value="title.en+asc">Title (A - Z)</option>
                </select>

                {/* Page Size */}
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setPage(0);
                  }}
                  aria-label="Items per page"
                  className="py-2 px-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500/30 cursor-pointer font-medium"
                >
                  <option value="10">10 / pg</option>
                  <option value="20">20 / pg</option>
                  <option value="50">50 / pg</option>
                  <option value="100">100 / pg</option>
                </select>
              </div>
            </div>

            {/* Active filters indicators */}
            {(searchTerm || selectedPublisher) && (
              <div className="flex items-center gap-2 text-xs pt-1 border-t border-slate-100 flex-wrap">
                <span className="text-slate-400 font-medium">Active filters:</span>
                {searchTerm && (
                  <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 flex items-center gap-1 font-medium">
                    Search: "{searchTerm}"
                    <button onClick={() => handleSearchChange('')} className="hover:opacity-75">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {selectedPublisher && (
                  <span className="px-2 py-0.5 rounded-md bg-sky-100 text-sky-900 flex items-center gap-1 font-medium">
                    Publisher: {selectedPublisher}
                    <button onClick={() => handlePublisherChange('')} className="hover:opacity-75">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedPublisher('');
                    setPage(0);
                  }}
                  className="text-amber-700 font-medium underline text-xs ml-auto"
                >
                  Reset all filters
                </button>
              </div>
            )}
          </div>

          {/* Anchor for smooth scroll-to-top on page change */}
          <div id="datasets-list-anchor" className="scroll-mt-6" />

          {/* Top Compact Pagination (visible when there are multiple pages) */}
          {totalPages > 1 && (
            <DatasetPagination
              currentPage={page}
              totalPages={totalPages}
              totalCount={totalCount}
              pageSize={pageSize}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              isLoading={isLoading}
              variant="compact"
              idPrefix="top-dataset-pagination"
            />
          )}

          {/* Loading state skeleton */}
          {isLoading && (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((idx) => (
                <div
                  key={idx}
                  className="p-5 bg-white rounded-2xl border border-slate-200/80 animate-pulse space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="h-4 bg-slate-200 rounded w-1/3" />
                    <div className="h-4 bg-slate-200 rounded w-24" />
                  </div>
                  <div className="h-3 bg-slate-100 rounded w-2/3" />
                  <div className="h-3 bg-slate-100 rounded w-1/2" />
                  <div className="flex gap-2 pt-2">
                    <div className="h-6 bg-slate-100 rounded w-16" />
                    <div className="h-6 bg-slate-100 rounded w-20" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No results state */}
          {!isLoading && datasets.length === 0 && (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
              <Database className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-base font-semibold text-slate-800">
                No datasets found matching your criteria
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                No open datasets match your current query or publisher filter. Try clearing your search or switching to another category.
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedPublisher('');
                  setPage(0);
                }}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
              >
                Show all {category.name} datasets
              </button>
            </div>
          )}

          {/* Datasets List */}
          {!isLoading && datasets.length > 0 && (
            <div className="space-y-3">
              {datasets.map((dataset, idx) => {
                const isExpanded = expandedDesc[dataset.id];
                const formattedDate = dataset.modified
                  ? new Date(dataset.modified).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })
                  : 'Recent';

                return (
                  <div
                    key={dataset.id || idx}
                    id={`dataset-card-${dataset.id}`}
                    className="bg-white border border-slate-200/80 hover:border-amber-300 rounded-2xl p-5 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between gap-4"
                  >
                    <div className="space-y-2">
                      {/* Card Header: Title & Badges */}
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                        <div className="space-y-0.5">
                          <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-700 leading-snug">
                            {dataset.title}
                          </h3>
                          {dataset.greekTitle && dataset.greekTitle !== dataset.title && (
                            <p className="text-xs font-medium text-amber-800/90 font-sans">
                              {dataset.greekTitle}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {dataset.formats.map((fmt) => (
                            <span
                              key={fmt}
                              className="px-2 py-0.5 rounded-md text-[11px] font-mono font-medium bg-slate-100 text-slate-700 border border-slate-200"
                            >
                              {fmt}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Description */}
                      <div className="text-xs text-slate-600 leading-relaxed">
                        {isExpanded || dataset.description.length < 180 ? (
                          <p>{dataset.description}</p>
                        ) : (
                          <p>
                            {dataset.description.slice(0, 180)}...{' '}
                            <button
                              onClick={() => toggleExpandDesc(dataset.id)}
                              className="text-amber-700 font-semibold hover:underline ml-1"
                            >
                              more
                            </button>
                          </p>
                        )}
                        {isExpanded && dataset.description.length >= 180 && (
                          <button
                            onClick={() => toggleExpandDesc(dataset.id)}
                            className="text-amber-700 font-semibold hover:underline text-xs mt-1 block"
                          >
                            less
                          </button>
                        )}
                      </div>

                      {/* Metadata Row: Publisher, Date, ID */}
                      <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-500 pt-1">
                        <span className="flex items-center gap-1.5 font-medium text-slate-700">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
                          <span>{dataset.publisher}</span>
                        </span>

                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>Updated: {formattedDate}</span>
                        </span>

                        <span className="font-mono text-[11px] text-slate-400">
                          ID: {dataset.id.slice(0, 18)}...
                        </span>
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100">
                      <button
                        onClick={() => setInspectingDataset(dataset)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-500" />
                        <span>Inspect Metadata & API JSON</span>
                      </button>

                      <div className="flex items-center gap-2">
                        <a
                          href={dataset.portalUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition-colors"
                        >
                          <span>data.europa.eu</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                        <a
                          href={dataset.cyprusPortalUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 transition-colors"
                        >
                          <span>data.gov.cy</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Dataset Pagination Component */}
          {totalPages > 1 && (
            <DatasetPagination
              currentPage={page}
              totalPages={totalPages}
              totalCount={totalCount}
              pageSize={pageSize}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              isLoading={isLoading}
              variant="full"
              idPrefix="category-datasets-pagination"
            />
          )}
        </div>
      )}

      {/* Tab 2: Curated Real-Time Feeds & APIs */}
      {activeTab === 'live_feeds' && (
        <div className="space-y-4">
          <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <Radio className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-emerald-950">
                  Direct Real-Time Streaming Feeds & Developer Endpoints
                </h3>
                <p className="text-xs text-emerald-800/90 mt-0.5 leading-relaxed">
                  In addition to the catalog of official datasets, Cyprus authorities provide live real-time feeds updated continuously (sensors, GTFS GPS locations, air metrics, grid generation).
                </p>
              </div>
            </div>
            <div className="shrink-0 flex items-center gap-2 bg-white/80 px-3 py-1.5 rounded-xl border border-emerald-200/80">
              <span className="text-[11px] font-bold text-emerald-950 uppercase tracking-wider">
                Sector Endpoint:
              </span>
              <ApiHealthIndicator
                categoryId={category.id}
                featuredApi={category.featuredApi}
                endpointUrl={category.featuredApiEndpoint}
              />
            </div>
          </div>

          <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl bg-white overflow-hidden shadow-xs">
            {category.sampleDatasets.map((feed, idx) => (
              <div
                key={idx}
                id={`curated-feed-${idx}`}
                className="p-5 hover:bg-slate-50/70 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">
                      {feed.title}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      Live Feed
                    </span>
                  </div>

                  {feed.description && (
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {feed.description}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      {feed.source}
                    </span>
                    <span className="flex items-center gap-1 text-emerald-700 font-medium">
                      <Clock className="w-3.5 h-3.5" />
                      Interval: {feed.updateFrequency}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="px-2.5 py-1 rounded-md text-xs font-mono font-medium bg-slate-100 text-slate-700 border border-slate-200">
                    {feed.format}
                  </span>
                  <a
                    href="https://www.data.gov.cy"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-md text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200/80 hover:bg-amber-100 transition-colors"
                  >
                    <span>Feed Docs</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Developer API Integration Snippet */}
      <div className="bg-slate-900 text-slate-100 border border-slate-800 rounded-2xl p-5 shadow-inner">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
            <Terminal className="w-4 h-4 text-amber-400" />
            <span>Developer Query — Cyprus Open Data API Endpoint</span>
          </div>
          <span className="text-[11px] px-2.5 py-0.5 rounded bg-slate-800 text-amber-400 font-mono border border-slate-700">
            CORS Enabled • GET JSON
          </span>
        </div>
        <pre className="bg-slate-950 p-4 rounded-xl text-xs font-mono text-emerald-400 overflow-x-auto border border-slate-800 leading-relaxed">
          <code>
{`// Query all Cyprus ${category.name} datasets directly via public API:
const params = new URLSearchParams({
  q: '${category.searchQuery}',
  filter: 'dataset',
  facets: JSON.stringify({ country: ['cy'] }),
  limit: '50',
  sort: 'modified+desc'
});

const url = 'https://data.europa.eu/api/hub/search/search?' + params;
const response = await fetch(url);
const { result } = await response.json();

console.log('Total datasets found:', result.count);
console.log('Datasets list:', result.results.map(d => d.title.en || d.title.el));`}
          </code>
        </pre>
      </div>

      {/* Dataset Inspection Modal */}
      <DatasetDetailModal
        dataset={inspectingDataset}
        onClose={() => setInspectingDataset(null)}
      />
    </div>
  );
};
