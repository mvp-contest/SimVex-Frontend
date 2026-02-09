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
    <header
      className="h-[60px] flex items-center justify-between px-5 border-b-2 flex-shrink-0"
      style={{
        backgroundColor: "var(--background)",
        borderColor: "#333b45",
      }}
    >
      <Link href="/" className="flex items-center gap-2.5">
        <div className="w-[34px] h-[34px] flex items-center justify-center">
          <Image
            src="/icons/brand/simvex-logo.svg"
            alt="Simvex Logo"
            width={34}
            height={34}
          />
        </div>
        <span className="font-bold text-slate-200 text-xl leading-normal">
          SIMVEX
        </span>
      </Link>
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-[#1e2127] transition-colors"
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium"
            style={{ backgroundColor: '#333b45', color: '#94a3b8' }}
          >
            {user?.nickname?.charAt(0).toUpperCase() || 'U'}
          </div>
          <span className="font-semibold text-slate-200 text-sm leading-normal">
            {user?.nickname ?? "User"}
          </span>
          <ChevronRight
            size={16}
            className={`transition-transform ${dropdownOpen ? 'rotate-90' : ''}`}
          />
        </button>

        {dropdownOpen && (
          <div
            className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg overflow-hidden z-50"
            style={{
              backgroundColor: '#1e2127',
              border: '1px solid #333b45',
            }}
          >
            <div className="px-4 py-3 border-b" style={{ borderColor: '#333b45' }}>
              <p className="font-semibold text-slate-200 text-sm">{user?.nickname}</p>
              <p className="font-medium text-slate-500 text-xs mt-1">{user?.email}</p>
            </div>
            <div className="py-1">
              <Link
                href="/dashboard/settings"
                className="flex items-center gap-2 px-4 py-2 hover:bg-[#12141b] transition-colors"
                onClick={() => setDropdownOpen(false)}
              >
                <Settings size={16} />
                <span className="font-medium text-slate-200 text-sm">Settings</span>
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2 hover:bg-[#12141b] transition-colors text-left"
              >
                <LogOut size={16} className="text-red-400" />
                <span className="font-medium text-red-400 text-sm">Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
