"use client";

import ChevronDownIcon from "@/components/icons/chevron-down-icon.svg";

interface FilterDropdownProps {
  label: string;
  options?: string[];
  onSelect?: (option: string) => void;
}

export default function FilterDropdown({ label, options = [], onSelect }: FilterDropdownProps) {
  return (
    <div className="relative">
      <button className="w-[267px] h-[42px] px-4 bg-transparent border-[2px] border-(--color-border-primary) rounded-md text-[20px] font-medium text-(--color-text-primary) flex items-center justify-between hover:border-(--color-accent-white) transition-colors">
        <span>{label}</span>
        <ChevronDownIcon className="w-[16px] h-[9px]" style={{ fill: "#E2E8F0" }} />
      </button>
    </div>
  );
}
