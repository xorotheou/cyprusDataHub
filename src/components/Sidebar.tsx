import React from 'react';
import {
  Bus,
  Trees,
  Users,
  Zap,
  TrendingUp,
  Droplets,
  Activity,
  Landmark,
  Layers,
  Database,
  Search,
  ExternalLink,
  ShieldCheck,
  Globe2
} from 'lucide-react';
import { OpenDataCategory } from '../types';

interface SidebarProps {
  categories: OpenDataCategory[];
  selectedCategoryId: string | null;
  onSelectCategory: (id: string | null) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const getCategoryIcon = (iconName: string, className: string = 'w-4 h-4') => {
  switch (iconName) {
    case 'Bus':
      return <Bus className={className} />;
    case 'Trees':
      return <Trees className={className} />;
    case 'Users':
      return <Users className={className} />;
    case 'Zap':
      return <Zap className={className} />;
    case 'TrendingUp':
      return <TrendingUp className={className} />;
    case 'Droplets':
      return <Droplets className={className} />;
    case 'Activity':
      return <Activity className={className} />;
    case 'Landmark':
      return <Landmark className={className} />;
    default:
      return <Layers className={className} />;
  }
};

export const Sidebar: React.FC<SidebarProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
  searchQuery,
  onSearchChange,
}) => {
  const totalDatasets = categories.reduce((acc, cat) => acc + cat.datasetCount, 0);

  return (
    <aside
      id="cyprus-data-sidebar"
      className="w-full lg:w-72 bg-slate-900 text-slate-100 flex flex-col border-r border-slate-800 shrink-0 select-none"
    >
      {/* Sidebar Header */}
      <div className="p-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold shadow-inner text-sm">
            CY
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
              Cyprus Open Data
            </h1>
            <p className="text-xs text-slate-400">Portal & Free API Directory</p>
          </div>
        </div>

        {/* Search input in sidebar */}
        <div className="mt-4 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            id="sidebar-category-search-input"
            type="text"
            placeholder="Filter categories or domains..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-slate-800/80 border border-slate-700/70 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all"
          />
        </div>
      </div>

      {/* Main Navigation Actions */}
      <div className="px-3 pt-3 space-y-1">
        <button
          id="btn-all-categories"
          onClick={() => onSelectCategory(null)}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
            selectedCategoryId === null
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Layers className="w-4 h-4 text-amber-400" />
            <span>Category Grid Overview</span>
          </div>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
            {categories.length}
          </span>
        </button>

        <button
          id="btn-all-national-portal"
          onClick={() => onSelectCategory('all_portal')}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
            selectedCategoryId === 'all_portal'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Globe2 className="w-4 h-4 text-sky-400" />
            <span>All 1,940 National Datasets</span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-950 text-sky-300 border border-sky-800/60 font-mono">
            Full Catalog
          </span>
        </button>
      </div>

      {/* Category List */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
        <div className="px-2 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center justify-between">
          <span>Core Domains</span>
          <span className="font-mono text-[10px] text-slate-400 font-normal">{totalDatasets} items</span>
        </div>

        {categories.map((cat) => {
          const isSelected = selectedCategoryId === cat.id;
          return (
            <button
              key={cat.id}
              id={`sidebar-category-${cat.id}`}
              onClick={() => onSelectCategory(cat.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all text-left group ${
                isSelected
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-xs'
                  : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0 pr-1">
                <span
                  className={`transition-colors shrink-0 ${
                    isSelected ? 'text-amber-400' : 'text-slate-400 group-hover:text-amber-400'
                  }`}
                >
                  {getCategoryIcon(cat.iconName, 'w-4 h-4')}
                </span>
                <div className="truncate">
                  <div className="truncate text-slate-200 group-hover:text-white font-semibold">
                    {cat.name.split('&')[0].trim()}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    {cat.greekName}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-400 font-mono">
                  {cat.datasetCount}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800 text-[11px] text-slate-400 bg-slate-950/40 space-y-2">
        <div className="flex items-center gap-1.5 text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>Official Public Sources & Live APIs</span>
        </div>
        <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400">
          <span>data.gov.cy / PSI Directive</span>
          <a
            href="https://www.data.gov.cy"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-amber-400 hover:underline font-medium"
          >
            Portal <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </aside>
  );
};
