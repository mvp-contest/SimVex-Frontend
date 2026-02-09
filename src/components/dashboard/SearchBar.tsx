"use client";

import { Search } from "lucide-react";

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
}

export default function SearchBar({ placeholder = "Search projects...", onSearch }: SearchBarProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch?.(e.target.value);
  };

  return (
    <div className="relative w-[300px]">
      <input
        type="text"
        placeholder={placeholder}
        onChange={handleChange}
        className="w-full pl-4 pr-10 py-2.5 bg-transparent border-2 border-(--color-border-primary) rounded-md text-sm font-medium text-(--color-text-primary) placeholder:text-(--color-text-muted) outline-none focus:border-(--color-accent-blue) transition-colors"
      />
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-(--color-text-muted)">
        <Search size={18} />
      </div>
    </div>
  );
}
