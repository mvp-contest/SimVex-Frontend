"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <nav className="w-full h-[88px] border-b-2 border-[#333B45] flex items-center justify-between px-8 flex-shrink-0 z-10 bg-[#14171C]">
      <div className="flex items-center gap-3">
        <div className="relative w-15 h-15">
          <Image
            src="/SIMVEX_logo_2.svg"
            alt="SIMVEX"
            fill
            className="object-contain"
          />
        </div>
        <span className="text-[32px] font-bold text-white">SIMVEX</span>
      </div>

      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-3 hover:opacity-80 transition"
        >
          <div className="relative w-10 h-10">
            <Image
              src={user?.profileImage || "/profile-photo.jpg"}
              alt="Profile"
              fill
              className="rounded-full object-cover bg-[#C5D0E1]"
            />
          </div>
          <span className="text-[28px] font-semibold text-white">
            {user?.username || "User"}
          </span>
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-[#1E2127] border-2 border-[#333B45] rounded-lg shadow-lg overflow-hidden">
            <button
              onClick={() => {
                setDropdownOpen(false);
                router.push("/dashboard/settings");
              }}
              className="w-full px-4 py-3 text-left text-white hover:bg-[#2C303B] transition"
            >
              Settings
            </button>
            <button
              onClick={handleLogout}
              className="w-full px-4 py-3 text-left text-red-400 hover:bg-[#2C303B] transition"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
