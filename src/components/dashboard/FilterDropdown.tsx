"use client";

import { ChevronDown } from "lucide-react";

interface FilterDropdownProps {
  label: string;
  options?: string[];
  onSelect?: (option: string) => void;
}

export default function FilterDropdown({ label }: FilterDropdownProps) {
  return (
    <div className="relative">
      <button className="min-w-[200px] px-4 py-2.5 bg-transparent border-2 border-(--color-border-primary) rounded-md text-sm font-medium text-(--color-text-primary) flex items-center justify-between hover:border-(--color-accent-white) transition-colors">
        <span>{label}</span>
        <ChevronDown size={16} className="text-(--color-text-light)" />
      </button>
    </div>
  );
}
