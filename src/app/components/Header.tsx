"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { ChevronRight, Settings, LogOut } from "lucide-react";

export default function Header() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="h-[60px] flex items-center justify-between px-6 border-b border-(--color-border-primary) flex-shrink-0 bg-(--color-header-bg)">
      <Link href="/" className="flex items-center gap-3">
        <div className="w-8 h-8 flex items-center justify-center relative">
          <Image
            src="/icons/brand/simvex-logo.svg"
            alt="Simvex Logo"
            fill
            className="object-contain"
          />
        </div>
        <span className="font-bold text-(--color-text-primary) text-xl tracking-tight">
          SIMVEX
        </span>
      </Link>
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-3 px-2 py-1.5 rounded-lg hover:bg-(--color-card-bg) transition-colors group"
        >
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium bg-(--color-border-primary) text-(--color-text-muted) group-hover:bg-(--color-input-border) transition-colors">
            {user?.nickname?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex items-center gap-1">
            <span className="font-medium text-(--color-text-primary) text-sm">
              {user?.nickname ?? "User"}
            </span>
            <ChevronRight
              size={16}
              className={`text-(--color-text-muted) transition-transform duration-200 ${dropdownOpen ? 'rotate-90' : ''}`}
            />
          </div>
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-56 rounded-xl shadow-xl overflow-hidden z-50 bg-(--color-card-bg) border border-(--color-border-primary) animate-in fade-in zoom-in-95 duration-100">
            <div className="px-4 py-3 border-b border-(--color-border-primary) bg-(--color-header-bg)/50">
              <p className="font-medium text-(--color-text-primary) text-sm truncate">{user?.nickname}</p>
              <p className="text-xs text-(--color-text-muted) mt-0.5 truncate">{user?.email}</p>
            </div>
            <div className="p-1">
              <Link
                href="/dashboard/settings"
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-(--color-input-bg) transition-colors text-(--color-text-secondary) hover:text-(--color-text-primary)"
                onClick={() => setDropdownOpen(false)}
              >
                <Settings size={16} />
                <span className="text-sm font-medium">Settings</span>
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-(--color-status-danger-bg)/10 transition-colors text-left text-(--color-status-danger)"
              >
                <LogOut size={16} />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
