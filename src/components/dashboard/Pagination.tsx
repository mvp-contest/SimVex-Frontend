"use client";

import ChevronLeftIcon from "@/components/icons/chevron-left-icon.svg";
import ChevronRightIcon from "@/components/icons/chevron-right-icon.svg";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange?: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}: PaginationProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex items-center justify-center gap-6 py-8">
      <button
        onClick={() => onPageChange?.(currentPage - 1)}
        disabled={currentPage === 1}
        className="disabled:opacity-30"
      >
        <ChevronLeftIcon className="w-[12px] h-[21px]" style={{ fill: "#64748B" }} />
      </button>

      <div className="flex items-center gap-4">
        <div className="w-[40px] h-[40px] flex items-center justify-center bg-(--color-card-bg) border-[2px] border-(--color-border-primary) rounded text-[18px] font-medium text-(--color-text-primary)">
          {currentPage}
        </div>
        <span className="text-[18px] font-medium text-(--color-text-primary)">
          {startItem}-{endItem} of {totalItems} Projects
        </span>
      </div>

      <button
        onClick={() => onPageChange?.(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="disabled:opacity-30"
      >
        <ChevronRightIcon className="w-[12px] h-[21px]" style={{ fill: "#64748B" }} />
      </button>
    </div>
  );
}
