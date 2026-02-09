"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Button from "@/components/ui/Button";

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
    <div className="flex items-center justify-center gap-6 py-8 border-t border-(--color-border-primary) mt-8">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange?.(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-2"
      >
        <ChevronLeft size={20} />
      </Button>

      <div className="flex items-center gap-4">
        <div className="w-10 h-10 flex items-center justify-center bg-(--color-card-bg) border border-(--color-border-primary) rounded-lg text-sm font-bold text-(--color-text-primary)">
          {currentPage}
        </div>
        <span className="text-sm font-medium text-(--color-text-muted)">
          {startItem}-{endItem} of {totalItems} Projects
        </span>
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange?.(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-2"
      >
        <ChevronRight size={20} />
      </Button>
    </div>
  );
}
