"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { teams as teamsApi, type Team } from "@/lib/api";
import HomeIcon from "@/components/icons/home-icon.svg";
import UsersIcon from "@/components/icons/users-icon.svg";
import ChevronDownIcon from "@/components/icons/chevron-down-icon.svg";
import CubeIcon from "@/components/icons/cube-icon.svg";
import SettingsIcon from "@/components/icons/settings-icon.svg";

export default function Sidebar() {
    const pathname = usePathname();
    const { user } = useAuth();
    const [isMyTeamsOpen, setIsMyTeamsOpen] = useState(true);
    const [teams, setTeams] = useState<Team[]>([]);

    useEffect(() => {
        if (user?.id) {
            loadTeams();
        }
    }, [user?.id]);

    const loadTeams = async () => {
        if (!user?.id) return;
        try {
            const data = await teamsApi.list(user.id);
            setTeams(data);
        } catch (err) {
            console.error("Failed to load teams:", err);
        }
    };

    const isActive = (path: string) => pathname === path || pathname.startsWith(path);

    return (
        <aside className="w-[224px] bg-(--color-card-bg) border-r-[2px] border-(--color-border-primary) min-h-[calc(100vh-88px)]">
            <nav className="py-8">
                {/* Home */}
                <NavItem
                    href="/"
                    icon={<HomeIcon className="w-[23px] h-[25px]" style={{ fill: "#787878" }} />}
                    label="Home"
                    active={false}
                />

                {/* My Teams with dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setIsMyTeamsOpen(!isMyTeamsOpen)}
                        className={`w-full flex items-center gap-3 px-6 py-3 text-[24px] font-semibold ${
                            isMyTeamsOpen
                                ? "text-(--color-accent-white)"
                                : "text-(--color-text-secondary)"
                        }`}
                    >
                        <UsersIcon
                            className="w-[27px] h-[27px]"
                            style={{ fill: isMyTeamsOpen ? "#F8FAFC" : "#787878" }}
                        />
                        <span>My Teams</span>
                        <ChevronDownIcon
                            className="w-[16px] h-[9px] ml-auto mr-2"
                            style={{ fill: isMyTeamsOpen ? "#F8FAFC" : "#787878" }}
                        />
                    </button>

                    {isMyTeamsOpen && (
                        <div className="space-y-1">
                            {teams.map((team) => (
                                <div key={team.id} className="relative">
                                    {isActive(`/dashboard/teams/${team.id}`) && (
                                        <div className="absolute left-0 top-0 w-[10px] h-[58px] bg-(--color-accent-white) rounded-r-[15px]" />
                                    )}
                                    <NavItem
                                        href={`/dashboard/teams/${team.id}`}
                                        icon={
                                            <CubeIcon
                                                className="w-[27px] h-[29px]"
                                                style={{
                                                    fill: isActive(`/dashboard/teams/${team.id}`)
                                                        ? "#F8FAFC"
                                                        : "#787878",
                                                }}
                                            />
                                        }
                                        label={team.name}
                                        active={isActive(`/dashboard/teams/${team.id}`)}
                                        isSubItem
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Settings */}
                <NavItem
                    href="/settings"
                    icon={
                        <SettingsIcon className="w-[28px] h-[28px]" style={{ fill: "#787878" }} />
                    }
                    label="Settings"
                    active={false}
                />
            </nav>
        </aside>
    );
}

interface NavItemProps {
    href: string;
    icon: React.ReactNode;
    label: string;
    active: boolean;
    isSubItem?: boolean;
}

function NavItem({ href, icon, label, active, isSubItem = false }: NavItemProps) {
    return (
        <Link
            href={href}
            className={`flex items-center gap-3 px-6 py-3 text-[24px] font-semibold ${
                active ? "text-(--color-accent-white)" : "text-(--color-text-secondary)"
            } ${isSubItem ? "pl-[65px]" : ""}`}
        >
            {icon}
            <span>{label}</span>
        </Link>
    );
}
