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
  ArrowRight,
  Database,
  Radio,
  FileCode,
  CheckCircle2
} from 'lucide-react';
import { OpenDataCategory } from '../types';

interface CategoryGridProps {
  categories: OpenDataCategory[];
  onSelectCategory: (id: string) => void;
  activeDistrict: string;
}

const getCategoryIcon = (iconName: string, className: string = 'w-6 h-6') => {
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

export const CategoryGrid: React.FC<CategoryGridProps> = ({
  categories,
  onSelectCategory,
  activeDistrict,
}) => {
  if (categories.length === 0) {
    return (
      <div
        id="no-categories-found"
        className="p-12 text-center bg-white rounded-2xl border border-slate-200/80 shadow-sm"
      >
        <Database className="w-10 h-10 text-slate-400 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-slate-800">No categories match your search</h3>
        <p className="text-sm text-slate-500 mt-1">
          Try adjusting your search terms or filter keywords.
        </p>
      </div>
    );
  }

  return (
    <div id="cyprus-data-category-grid" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      {categories.map((category) => (
        <div
          key={category.id}
          id={`category-card-${category.id}`}
          onClick={() => onSelectCategory(category.id)}
          className="group relative bg-white border border-slate-200/90 rounded-2xl p-5 hover:border-amber-400/80 hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
        >
          {/* Card Header */}
          <div>
            <div className="flex items-start justify-between gap-3 mb-3.5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 border border-amber-200/60 flex items-center justify-center group-hover:scale-105 group-hover:bg-amber-100/80 transition-all">
                  {getCategoryIcon(category.iconName, 'w-6 h-6')}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 text-base leading-snug group-hover:text-amber-700 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-xs font-medium text-slate-500 font-sans">
                    {category.greekName}
                  </p>
                </div>
              </div>

              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                <Radio className="w-3 h-3 text-emerald-600 animate-pulse" />
                {category.badge}
              </span>
            </div>

            {/* Description */}
            <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-2">
              {category.description}
            </p>

            {/* Key Metrics row */}
            <div className="grid grid-cols-3 gap-2 py-2.5 px-3 bg-slate-50/80 rounded-xl border border-slate-100 mb-4">
              {category.keyMetrics.map((metric, idx) => (
                <div key={idx} className="text-left">
                  <div className="text-[10px] uppercase font-semibold text-slate-600 truncate">
                    {metric.label}
                  </div>
                  <div className="text-xs font-bold text-slate-800 truncate mt-0.5">
                    {metric.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Top Sample Datasets Preview */}
            <div className="space-y-1.5 mb-4">
              <div className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <FileCode className="w-3.5 h-3.5 text-amber-600" />
                <span>Sample Datasets & APIs</span>
              </div>
              <ul className="space-y-1">
                {category.sampleDatasets.slice(0, 2).map((dataset, idx) => (
                  <li
                    key={idx}
                    className="text-[11px] text-slate-600 flex items-center justify-between gap-2 p-1.5 rounded-lg bg-slate-50/50 hover:bg-slate-100/70"
                  >
                    <span className="truncate font-medium text-slate-700">
                      • {dataset.title}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-600 font-mono shrink-0">
                      {dataset.format}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Card Footer */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-slate-600 font-medium">
              <Database className="w-3.5 h-3.5 text-amber-600" />
              <span>{category.datasetCount} Datasets available</span>
            </div>

            <div className="inline-flex items-center gap-1 font-semibold text-amber-700 group-hover:translate-x-0.5 transition-transform">
              <span>Explore</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
