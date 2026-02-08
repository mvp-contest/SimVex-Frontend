"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { teams as teamsApi, projects as projectsApi, type Team, type Project } from "@/lib/api";
import { Home, Users, FolderOpen, Settings, ChevronRight } from "lucide-react";

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

  const isActive = (path: string) => pathname === path;

  return (
    <aside
      className="w-[160px] min-h-full border-r flex-shrink-0 relative"
      style={{
        backgroundColor: "#1e2127",
        borderColor: "#333b45",
      }}
    >

      <nav className="pt-12 flex flex-col gap-2">
        {/* Home */}
        <Link
          href="/dashboard/teams"
          className="flex items-center gap-2.5 px-4 py-1.5 hover:opacity-80 transition-opacity relative"
        >
          {(pathname === '/dashboard/teams' || pathname === '/dashboard') && (
            <div className="absolute left-0 w-[6px] h-10 bg-slate-50 rounded-r-[10px]" />
          )}
          <div className="w-5 h-5 flex items-center justify-center">
            <Home 
              size={18} 
              className={(pathname === '/dashboard/teams' || pathname === '/dashboard') ? 'text-slate-50' : 'text-[#787878]'}
            />
          </div>
          <span className={`font-semibold text-sm leading-normal ${
            (pathname === '/dashboard/teams' || pathname === '/dashboard') ? 'text-slate-50' : 'text-[#787878]'
          }`}>
            Home
          </span>
        </Link>

        {/* My Teams */}
        <div className="mt-2">
          <div className="px-4 py-1.5">
            <span className="font-semibold text-[#787878] text-xs leading-normal uppercase">
              My Teams
            </span>
          </div>
          {loading ? (
            <div className="px-4 py-2 text-xs text-slate-500">Loading...</div>
          ) : teams.length === 0 ? (
            <div className="px-4 py-2 text-xs text-slate-500">No teams yet</div>
          ) : (
            teams.map((team) => (
              <div key={team.id}>
                <div className="flex items-center relative">
                  {isActive(`/dashboard/teams/${team.id}`) && (
                    <div className="absolute left-0 w-[6px] h-10 bg-slate-50 rounded-r-[10px]" />
                  )}
                  <Link
                    href={`/dashboard/teams/${team.id}`}
                    className="flex items-center gap-2.5 px-4 py-1.5 flex-1 hover:opacity-80 transition-opacity"
                  >
                    <div className="w-5 h-5 flex items-center justify-center">
                      <Users 
                        size={18} 
                        className={isActive(`/dashboard/teams/${team.id}`) ? 'text-slate-50' : 'text-[#787878]'}
                      />
                    </div>
                    <span className={`font-semibold text-sm leading-normal truncate ${
                      isActive(`/dashboard/teams/${team.id}`) ? 'text-slate-50' : 'text-[#787878]'
                    }`}>
                      {team.name}
                    </span>
                  </Link>
                  <button
                    onClick={() => toggleTeam(team.id)}
                    className="pr-4 hover:opacity-80 transition-opacity"
                  >
                    <ChevronRight
                      size={16}
                      className={`transition-transform ${
                        expandedTeams.has(team.id) ? 'rotate-90' : ''
                      }`}
                    />
                  </button>
                </div>

                {/* Projects under this team */}
                {expandedTeams.has(team.id) && (
                  <div className="ml-6">
                    {projects
                      .filter((p) => p.teamId === team.id)
                      .map((project) => (
                        <Link
                          key={project.id}
                          href={`/dashboard/projects/${project.id}`}
                          className="flex items-center gap-2.5 px-4 py-1.5 hover:opacity-80 transition-opacity relative"
                        >
                          {isActive(`/dashboard/projects/${project.id}`) && (
                            <div className="absolute left-0 w-[6px] h-8 bg-slate-50 rounded-r-[10px]" />
                          )}
                          <div className="w-5 h-5 flex items-center justify-center">
                            <FolderOpen 
                              size={16} 
                              className={isActive(`/dashboard/projects/${project.id}`) ? 'text-slate-50' : 'text-[#787878]'}
                            />
                          </div>
                          <span className={`font-semibold text-xs leading-normal truncate ${
                            isActive(`/dashboard/projects/${project.id}`) ? 'text-slate-50' : 'text-[#787878]'
                          }`}>
                            {project.name}
                          </span>
                        </Link>
                      ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Settings */}
        <div className="mt-auto pt-4">
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-2.5 px-4 py-1.5 hover:opacity-80 transition-opacity relative"
          >
            {pathname === '/dashboard/settings' && (
              <div className="absolute left-0 w-[6px] h-10 bg-slate-50 rounded-r-[10px]" />
            )}
            <div className="w-5 h-5 flex items-center justify-center">
              <Settings 
                size={18} 
                className={pathname === '/dashboard/settings' ? 'text-slate-50' : 'text-[#787878]'}
              />
            </div>
            <span className={`font-semibold text-sm leading-normal ${
              pathname === '/dashboard/settings' ? 'text-slate-50' : 'text-[#787878]'
            }`}>
              Settings
            </span>
          </Link>
        </div>
      </nav>
    </aside>
  );
}
