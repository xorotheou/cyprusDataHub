import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Hash,
  ArrowRight
} from 'lucide-react';

export interface DatasetPaginationProps {
  currentPage: number; // 0-indexed
  totalPages: number;
  totalCount: number;
  pageSize: number;
  onPageChange: (newPage: number) => void;
  onPageSizeChange?: (newPageSize: number) => void;
  isLoading?: boolean;
  pageSizeOptions?: number[];
  variant?: 'full' | 'compact';
  idPrefix?: string;
}

export const DatasetPagination: React.FC<DatasetPaginationProps> = ({
  currentPage,
  totalPages,
  totalCount,
  pageSize,
  onPageChange,
  onPageSizeChange,
  isLoading = false,
  pageSizeOptions = [10, 20, 50, 100],
  variant = 'full',
  idPrefix = 'pagination',
}) => {
  const [jumpInput, setJumpInput] = useState<string>('');
  const [jumpError, setJumpError] = useState<boolean>(false);

  // Sync jump input placeholder when page changes
  useEffect(() => {
    setJumpInput('');
    setJumpError(false);
  }, [currentPage]);

  if (totalPages <= 1 && totalCount <= pageSize && variant === 'compact') {
    return null;
  }

  const startItem = totalCount === 0 ? 0 : currentPage * pageSize + 1;
  const endItem = Math.min((currentPage + 1) * pageSize, totalCount);

  const handleJumpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pageNum = parseInt(jumpInput.trim(), 10);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      onPageChange(pageNum - 1);
      setJumpInput('');
      setJumpError(false);
    } else {
      setJumpError(true);
      setTimeout(() => setJumpError(false), 2000);
    }
  };

  // Compact variant (used e.g. at the top of dataset list or for tight spaces)
  if (variant === 'compact') {
    return (
      <div
        id={`${idPrefix}-compact`}
        className="flex items-center justify-between gap-3 text-xs text-slate-600 bg-slate-50/90 px-3.5 py-2 rounded-xl border border-slate-200/80"
      >
        <div className="font-medium text-slate-700">
          Showing <strong className="text-slate-900 font-bold">{startItem}–{endItem}</strong> of{' '}
          <strong className="text-slate-900 font-bold">{totalCount}</strong>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            id={`${idPrefix}-compact-first`}
            onClick={() => onPageChange(0)}
            disabled={currentPage === 0 || isLoading}
            title="First page"
            aria-label="First page"
            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white border border-transparent hover:border-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronsLeft className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            id={`${idPrefix}-compact-prev`}
            onClick={() => onPageChange(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0 || isLoading}
            title="Previous page"
            aria-label="Previous page"
            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white border border-transparent hover:border-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          <span className="px-2 font-medium text-slate-800 text-[11px] select-none whitespace-nowrap">
            Page <strong className="font-bold text-amber-700">{currentPage + 1}</strong> / {totalPages}
          </span>

          <button
            type="button"
            id={`${idPrefix}-compact-next`}
            onClick={() => onPageChange(Math.min(totalPages - 1, currentPage + 1))}
            disabled={currentPage >= totalPages - 1 || isLoading}
            title="Next page"
            aria-label="Next page"
            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white border border-transparent hover:border-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            id={`${idPrefix}-compact-last`}
            onClick={() => onPageChange(totalPages - 1)}
            disabled={currentPage >= totalPages - 1 || isLoading}
            title="Last page"
            aria-label="Last page"
            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white border border-transparent hover:border-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronsRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  // Full variant: Smart ellipsis generation for uncluttered display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const current = currentPage + 1; // 1-indexed

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (current <= 4) {
        // Near beginning: 1 2 3 4 5 ... totalPages
        pages.push(2, 3, 4, 5);
        pages.push('ellipsis-end');
        pages.push(totalPages);
      } else if (current >= totalPages - 3) {
        // Near end: 1 ... (totalPages-4) (totalPages-3) (totalPages-2) (totalPages-1) totalPages
        pages.push('ellipsis-start');
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // In the middle: 1 ... (current-1) current (current+1) ... totalPages
        pages.push('ellipsis-start');
        pages.push(current - 1, current, current + 1);
        pages.push('ellipsis-end');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div
      id={`${idPrefix}-container`}
      className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs transition-all space-y-4"
    >
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Left: Range and Count info */}
        <div className="flex items-center gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
            <span>
              Showing <strong className="text-slate-900 font-semibold">{startItem}–{endItem}</strong> of{' '}
              <strong className="text-slate-900 font-bold">{totalCount}</strong> items
            </span>
          </div>

          <span className="hidden sm:inline text-slate-300">•</span>

          <span className="hidden sm:inline text-slate-500 font-medium">
            Page <strong className="text-slate-800">{currentPage + 1}</strong> of{' '}
            <strong className="text-slate-800">{totalPages}</strong>
          </span>
        </div>

        {/* Center: Pagination controls with smart ellipsis */}
        <div className="flex items-center justify-center sm:justify-start gap-1 flex-wrap">
          {/* First page button */}
          <button
            type="button"
            id={`${idPrefix}-btn-first`}
            onClick={() => onPageChange(0)}
            disabled={currentPage === 0 || isLoading}
            title="First page (Page 1)"
            aria-label="Go to first page"
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl text-xs font-medium bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1 shadow-2xs"
          >
            <ChevronsLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">First</span>
          </button>

          {/* Previous page button */}
          <button
            type="button"
            id={`${idPrefix}-btn-prev`}
            onClick={() => onPageChange(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0 || isLoading}
            title="Previous page"
            aria-label="Go to previous page"
            className="p-1.5 sm:px-3 sm:py-1.5 rounded-xl text-xs font-medium bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1 shadow-2xs"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Prev</span>
          </button>

          {/* Page numbers with ellipsis */}
          <div className="flex items-center gap-1 px-1">
            {pageNumbers.map((p, idx) => {
              if (typeof p === 'string') {
                return (
                  <span
                    key={`${p}-${idx}`}
                    className="w-7 h-7 flex items-center justify-center text-xs text-slate-400 font-bold select-none"
                    aria-hidden="true"
                  >
                    …
                  </span>
                );
              }

              const isCurrent = p - 1 === currentPage;
              return (
                <button
                  key={p}
                  type="button"
                  id={`${idPrefix}-page-${p}`}
                  onClick={() => onPageChange(p - 1)}
                  disabled={isLoading}
                  aria-current={isCurrent ? 'page' : undefined}
                  aria-label={`Page ${p}`}
                  className={`w-8 h-8 rounded-xl text-xs font-semibold transition-all flex items-center justify-center ${
                    isCurrent
                      ? 'bg-amber-600 text-white shadow-xs font-bold ring-2 ring-amber-600/30'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-2xs'
                  }`}
                >
                  {p}
                </button>
              );
            })}
          </div>

          {/* Next page button */}
          <button
            type="button"
            id={`${idPrefix}-btn-next`}
            onClick={() => onPageChange(Math.min(totalPages - 1, currentPage + 1))}
            disabled={currentPage >= totalPages - 1 || isLoading}
            title="Next page"
            aria-label="Go to next page"
            className="p-1.5 sm:px-3 sm:py-1.5 rounded-xl text-xs font-medium bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1 shadow-2xs"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          {/* Last page button */}
          <button
            type="button"
            id={`${idPrefix}-btn-last`}
            onClick={() => onPageChange(totalPages - 1)}
            disabled={currentPage >= totalPages - 1 || isLoading}
            title={`Last page (Page ${totalPages})`}
            aria-label="Go to last page"
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl text-xs font-medium bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1 shadow-2xs"
          >
            <span className="hidden sm:inline">Last</span>
            <ChevronsRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right: Quick Jump & Page Size selector */}
        <div className="flex items-center justify-between sm:justify-end gap-2.5 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
          {/* Quick jump to page input */}
          {totalPages > 3 && (
            <form onSubmit={handleJumpSubmit} className="flex items-center gap-1.5">
              <label htmlFor={`${idPrefix}-jump-input`} className="text-[11px] text-slate-500 font-medium whitespace-nowrap">
                Go to:
              </label>
              <div className="relative">
                <input
                  id={`${idPrefix}-jump-input`}
                  type="number"
                  min="1"
                  max={totalPages}
                  placeholder={`${currentPage + 1}`}
                  value={jumpInput}
                  onChange={(e) => setJumpInput(e.target.value)}
                  className={`w-14 px-2 py-1 text-xs text-center font-medium bg-slate-50 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    jumpError
                      ? 'border-red-400 focus:ring-red-400 text-red-700'
                      : 'border-slate-200 focus:border-amber-500 focus:ring-amber-500/20 text-slate-800'
                  }`}
                />
              </div>
              <button
                type="submit"
                title="Go to page"
                className="px-2 py-1 text-xs font-semibold bg-slate-100 hover:bg-amber-600 hover:text-white border border-slate-200 rounded-lg text-slate-700 transition-colors shadow-2xs"
              >
                Go
              </button>
            </form>
          )}

          {/* Page size dropdown */}
          {onPageSizeChange && (
            <div className="flex items-center gap-1.5">
              <label htmlFor={`${idPrefix}-page-size`} className="text-[11px] text-slate-500 font-medium whitespace-nowrap">
                Per page:
              </label>
              <select
                id={`${idPrefix}-page-size`}
                value={pageSize}
                onChange={(e) => onPageSizeChange(Number(e.target.value))}
                aria-label="Select items per page"
                className="py-1 px-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 cursor-pointer shadow-2xs"
              >
                {pageSizeOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
