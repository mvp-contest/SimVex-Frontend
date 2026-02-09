"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { teams as teamsApi, projects as projectsApi, type Team, type Project } from "@/lib/api";
import { Home, Users, FolderOpen, Settings, ChevronRight, Hash } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [teams, setTeams] = useState<Team[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [expandedTeams, setExpandedTeams] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadData();
    } else if (!user) {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const loadData = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const [teamsData, projectsData] = await Promise.all([
        teamsApi.list(user.id),
        projectsApi.list(user.id),
      ]);
      setTeams(teamsData);
      setProjects(projectsData);
      if (teamsData.length > 0) {
        setExpandedTeams(new Set([teamsData[0].id]));
      }
    } catch (err) {
      console.error('Failed to load sidebar data:', err);
      // 에러 발생 시에도 빈 배열로 설정
      setTeams([]);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleTeam = (teamId: string) => {
    setExpandedTeams(prev => {
      const next = new Set(prev);
      if (next.has(teamId)) {
        next.delete(teamId);
      } else {
        next.add(teamId);
      }
      return next;
    });
  };

  const isActive = (path: string) => pathname === path || pathname.startsWith(`${path}/`);

  return (
    <aside className="w-[240px] min-h-full border-r border-(--color-border-primary) flex-shrink-0 bg-(--color-sidebar-bg) flex flex-col">
      <nav className="flex-1 pt-6 px-3 flex flex-col gap-1">
        {/* Home */}
        <Link
          href="/dashboard/teams"
          className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors group ${
            pathname === '/dashboard/teams' || pathname === '/dashboard'
              ? 'bg-(--color-accent-blue)/10 text-(--color-accent-blue)'
              : 'text-(--color-text-secondary) hover:bg-(--color-input-bg) hover:text-(--color-text-primary)'
          }`}
        >
          <Home size={18} />
          <span className="font-medium text-sm">Home</span>
        </Link>

        {/* My Teams */}
        <div className="mt-6 mb-2 px-3">
          <span className="text-xs font-semibold text-(--color-text-muted) uppercase tracking-wider">
            My Teams
          </span>
        </div>
        
        {loading ? (
          <div className="px-3 py-2 text-xs text-(--color-text-muted)">Loading...</div>
        ) : teams.length === 0 ? (
          <div className="px-3 py-2 text-xs text-(--color-text-muted)">No teams yet</div>
        ) : (
          teams.map((team) => (
            <div key={team.id} className="mb-1">
              <div 
                className={`flex items-center rounded-lg transition-colors ${
                  isActive(`/dashboard/teams/${team.id}`)
                    ? 'bg-(--color-input-bg)'
                    : 'hover:bg-(--color-input-bg)/50'
                }`}
              >
                <Link
                  href={`/dashboard/teams/${team.id}`}
                  className={`flex items-center gap-3 px-3 py-2 flex-1 min-w-0 ${
                    isActive(`/dashboard/teams/${team.id}`)
                      ? 'text-(--color-text-primary)'
                      : 'text-(--color-text-secondary) hover:text-(--color-text-primary)'
                  }`}
                >
                  <Users size={16} className={isActive(`/dashboard/teams/${team.id}`) ? "text-(--color-accent-blue)" : ""} />
                  <span className="font-medium text-sm truncate">{team.name}</span>
                </Link>
                <button
                  onClick={() => toggleTeam(team.id)}
                  className="p-2 text-(--color-text-muted) hover:text-(--color-text-primary) transition-colors"
                >
                  <ChevronRight
                    size={14}
                    className={`transition-transform duration-200 ${
                      expandedTeams.has(team.id) ? 'rotate-90' : ''
                    }`}
                  />
                </button>
              </div>

              {/* Projects under this team */}
              {expandedTeams.has(team.id) && (
                <div className="ml-4 mt-1 pl-3 border-l border-(--color-border-primary) flex flex-col gap-0.5">
                  {projects
                    .filter((p) => p.teamId === team.id)
                    .map((project) => (
                      <Link
                        key={project.id}
                        href={`/dashboard/projects/${project.id}`}
                        className={`flex items-center gap-2.5 px-3 py-1.5 rounded-md text-sm transition-colors ${
                          isActive(`/dashboard/projects/${project.id}`)
                            ? 'text-(--color-accent-blue) bg-(--color-accent-blue)/5'
                            : 'text-(--color-text-muted) hover:text-(--color-text-primary) hover:bg-(--color-input-bg)/50'
                        }`}
                      >
                        <Hash size={14} />
                        <span className="truncate">{project.name}</span>
                      </Link>
                    ))}
                  {projects.filter((p) => p.teamId === team.id).length === 0 && (
                    <div className="px-3 py-1.5 text-xs text-(--color-text-muted)">No projects</div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </nav>

      {/* Settings (Bottom) */}
      <div className="p-3 border-t border-(--color-border-primary)">
        <Link
          href="/dashboard/settings"
          className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
            pathname === '/dashboard/settings'
              ? 'bg-(--color-accent-blue)/10 text-(--color-accent-blue)'
              : 'text-(--color-text-secondary) hover:bg-(--color-input-bg) hover:text-(--color-text-primary)'
          }`}
        >
          <Settings size={18} />
          <span className="font-medium text-sm">Settings</span>
        </Link>
      </div>
    </aside>
  );
}
