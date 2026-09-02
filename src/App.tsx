import React, { useState, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { CategoryGrid } from './components/CategoryGrid';
import { CategoryDetailView } from './components/CategoryDetailView';
import { CYPRUS_DATA_CATEGORIES } from './data/categories';
import {
  Search,
  MapPin,
  Database,
  Radio,
  ExternalLink,
  Sparkles,
  SlidersHorizontal,
  Info
} from 'lucide-react';

const CYPRUS_DISTRICTS = [
  'All Districts',
  'Nicosia (Λευκωσία)',
  'Limassol (Λεμεσός)',
  'Larnaca (Λάρνακα)',
  'Paphos (Πάφος)',
  'Famagusta (Αμμόχωστος)',
];

export default function App() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All Districts');
  const [activeFilter, setActiveFilter] = useState<'all' | 'realtime' | 'ckan'>('all');

  // Filtered categories
  const filteredCategories = useMemo(() => {
    return CYPRUS_DATA_CATEGORIES.filter((category) => {
      const matchesSearch =
        category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.greekName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.sampleDatasets.some((d) =>
          d.title.toLowerCase().includes(searchQuery.toLowerCase())
        );

      if (!matchesSearch) return false;

      if (activeFilter === 'realtime') {
        return category.apiType === 'Real-Time Feed' || category.badge.includes('Real-Time') || category.badge.includes('Sensor');
      }
      if (activeFilter === 'ckan') {
        return category.apiType === 'CKAN' || category.apiType === 'REST';
      }

      return true;
    });
  }, [searchQuery, activeFilter]);

  const selectedCategory = useMemo(() => {
    return CYPRUS_DATA_CATEGORIES.find((c) => c.id === selectedCategoryId) || null;
  }, [selectedCategoryId]);

  const totalDatasets = useMemo(() => {
    return CYPRUS_DATA_CATEGORIES.reduce((sum, c) => sum + c.datasetCount, 0);
  }, []);

  return (
    <div id="cyprus-app-root" className="min-h-screen bg-slate-100 flex flex-col lg:flex-row text-slate-800 antialiased font-sans">
      {/* Sidebar Navigation */}
      <Sidebar
        categories={CYPRUS_DATA_CATEGORIES}
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={setSelectedCategoryId}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto max-h-screen">
        {/* Top Navbar */}
        <header
          id="app-top-header"
          className="bg-white border-b border-slate-200 sticky top-0 z-10 px-6 py-3.5 flex flex-wrap items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 leading-tight">
                Cyprus Open Data Catalog & APIs
              </h2>
              <p className="text-xs text-slate-500">
                Official free public datasets and live sensor interfaces in Cyprus
              </p>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-2.5">
            {/* District Selector */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700">
              <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <select
                id="district-select"
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                aria-label="Filter by Cyprus District"
                className="bg-transparent text-xs font-medium text-slate-800 focus:outline-none cursor-pointer"
              >
                {CYPRUS_DISTRICTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Filter buttons */}
            <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50 text-xs">
              <button
                id="filter-all-btn"
                onClick={() => setActiveFilter('all')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  activeFilter === 'all'
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                All Sources
              </button>
              <button
                id="filter-realtime-btn"
                onClick={() => setActiveFilter('realtime')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors flex items-center gap-1 ${
                  activeFilter === 'realtime'
                    ? 'bg-white text-amber-700 shadow-xs font-semibold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Radio className="w-3 h-3 text-emerald-500" />
                Live Feeds
              </button>
              <button
                id="filter-ckan-btn"
                onClick={() => setActiveFilter('ckan')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  activeFilter === 'ckan'
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                CKAN / REST
              </button>
            </div>
          </div>
        </header>

        {/* Content Container */}
        <main className="p-6 max-w-7xl w-full mx-auto space-y-6">
          {/* Overview KPI Banner when on grid view */}
          {!selectedCategory && (
            <div
              id="kpi-banner"
              className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Active Registry
                  </span>
                  <span className="text-xs text-slate-500">
                    PSI Directive Compliant
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  Explore {CYPRUS_DATA_CATEGORIES.length} Open Data Sectors
                </h3>
                <p className="text-xs text-slate-600 max-w-2xl">
                  Filter through datasets across Transportation, Environment, Demographics, Energy, Public Health, and more.
                </p>
              </div>

              <div className="flex items-center gap-4 divide-x divide-slate-100 shrink-0">
                <div className="text-center px-3">
                  <div className="text-xs text-slate-500 font-medium">Categories</div>
                  <div className="text-xl font-bold text-slate-900">{CYPRUS_DATA_CATEGORIES.length}</div>
                </div>
                <div className="text-center px-3">
                  <div className="text-xs text-slate-500 font-medium">Total Datasets</div>
                  <div className="text-xl font-bold text-amber-700">{totalDatasets}+</div>
                </div>
                <div className="text-center px-3">
                  <div className="text-xs text-slate-500 font-medium">Live Feeds</div>
                  <div className="text-xl font-bold text-emerald-600">8 APIs</div>
                </div>
              </div>
            </div>
          )}

          {/* Active view: Category Detail or Category Grid */}
          {selectedCategory ? (
            <CategoryDetailView
              category={selectedCategory}
              onBack={() => setSelectedCategoryId(null)}
            />
          ) : (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Cyprus Data Categories
                  </h3>
                  <p className="text-xs text-slate-500">
                    Showing {filteredCategories.length} category domains ({selectedDistrict})
                  </p>
                </div>

                {searchQuery && (
                  <button
                    id="clear-search-btn"
                    onClick={() => setSearchQuery('')}
                    className="text-xs font-medium text-amber-700 hover:underline"
                  >
                    Clear search filter
                  </button>
                )}
              </div>

              <CategoryGrid
                categories={filteredCategories}
                onSelectCategory={(id) => setSelectedCategoryId(id)}
                activeDistrict={selectedDistrict}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
