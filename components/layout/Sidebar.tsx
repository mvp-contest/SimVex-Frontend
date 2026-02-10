"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { api, Team } from "@/lib/api";

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTeams = useCallback(async () => {
    if (!user) return;
    try {
      const data = await api.getTeams(user.id);
      setTeams(data);
    } catch (error) {
      console.error("Failed to load teams:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadTeams();
    }
  }, [user, loadTeams]);

  const isActive = (path: string) => pathname === path;

  return (
    <aside className="w-[224px] bg-[#1E2127] border-r-2 border-[#333B45] flex-shrink-0 flex flex-col pt-[76px] px-5 gap-[33px]">
      <Link
        href="/dashboard"
        className={`flex items-center gap-3 transition font-semibold text-2xl group relative ${
          isActive("/dashboard")
            ? "text-white"
            : "text-zinc-400 hover:text-white"
        }`}
      >
        {isActive("/dashboard") && (
          <div className="absolute bg-white rounded-r-full w-[10px] h-[58px] -left-5 top-1/2 -translate-y-1/2" />
        )}
        <Image src="/Home_icon.svg" alt="Home" width={34} height={34} />
        <span>Home</span>
      </Link>

      <Link
        href="/dashboard/my-teams"
        className={`flex items-center transition font-semibold text-2xl relative ${
          isActive("/dashboard/my-teams")
            ? "text-white"
            : "text-zinc-400 hover:text-white"
        }`}
      >
        {isActive("/dashboard/my-teams") && (
          <div className="absolute bg-white rounded-r-full w-[10px] h-[58px] -left-5 top-1/2 -translate-y-1/2" />
        )}
        <Image
          src="/MyTeams_icon2.svg"
          alt="My Teams"
          width={34}
          height={34}
          className="mr-3 flex-shrink-0"
        />
        <div className="flex items-center gap-[17px]">
          <span className="whitespace-nowrap">My Teams</span>
          <Image
            src="/Arrow.svg"
            alt="arrow"
            width={9}
            height={16}
            className="flex-shrink-0"
          />
        </div>
      </Link>

      {loading ? (
        <div className="text-zinc-500 text-sm pl-12">Loading teams...</div>
      ) : teams.length > 0 ? (
        <div className="pl-12 space-y-3">
          {teams.slice(0, 5).map((team) => (
            <Link
              key={team.id}
              href="/dashboard/my-teams"
              className="block text-zinc-400 hover:text-white transition text-lg truncate"
            >
              {team.name}
            </Link>
          ))}
        </div>
      ) : null}

      <Link
        href="/dashboard/settings"
        className={`flex items-center gap-3 transition font-semibold text-2xl relative ${
          isActive("/dashboard/settings")
            ? "text-white"
            : "text-zinc-400 hover:text-white"
        }`}
      >
        {isActive("/dashboard/settings") && (
          <div className="absolute bg-white rounded-r-full w-[10px] h-[58px] -left-5 top-1/2 -translate-y-1/2" />
        )}
        <Image
          src="/Setting_icon2.svg"
          alt="Settings"
          width={34}
          height={34}
        />
        <span>Settings</span>
      </Link>
    </aside>
  );
}
