"use client";

import SearchIcon from "@/components/icons/search-icon.svg";

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
}

export default function SearchBar({ placeholder = "Search projects...", onSearch }: SearchBarProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch?.(e.target.value);
  };

  return (
    <div className="relative">
      <input
        type="text"
        placeholder={placeholder}
        onChange={handleChange}
        className="w-[280px] h-[42px] pl-4 pr-12 bg-transparent border-[2px] border-(--color-border-primary) rounded-md text-[20px] font-medium text-(--color-text-muted) placeholder:text-(--color-text-muted) outline-none focus:border-(--color-accent-white) transition-colors"
      />
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
        <SearchIcon className="w-[20px] h-[20px]" style={{ fill: "#64748B" }} />
      </div>
    </div>
  );
}
