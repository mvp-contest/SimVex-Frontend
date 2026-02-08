"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { teams as teamsApi, projects as projectsApi, type Team, type Project } from "@/lib/api";

export default function TeamDetailPage() {
  const params = useParams();
  const teamId = params.id as string;
  
  const [activeTab, setActiveTab] = useState<"members" | "projects" | "chat">("members");
  const [searchQuery, setSearchQuery] = useState("");
  const [team, setTeam] = useState<Team | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [teamName, setTeamName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isCreatingProject, setIsCreatingProject] = useState(false);

  useEffect(() => {
    loadTeam();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamId]);

  const loadTeam = async () => {
    try {
      setLoading(true);
      setError("");
      const [teamData, projectsData] = await Promise.all([
        teamsApi.get(teamId),
        projectsApi.listByTeam(teamId),
      ]);
      setTeam(teamData);
      setProjects(projectsData);
      setTeamName(teamData.name);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load team");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async () => {
    const name = prompt("Enter project name:");
    if (!name) return;

    try {
      setIsCreatingProject(true);
      await projectsApi.create(teamId, name);
      await loadTeam();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to create project");
    } finally {
      setIsCreatingProject(false);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      await projectsApi.remove(projectId);
      await loadTeam();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete project");
    }
  };

  const handleSaveName = async () => {
    if (!teamName.trim()) return;
    try {
      setIsSaving(true);
      await teamsApi.update(teamId, teamName);
      await loadTeam();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update team name");
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (!confirm("Are you sure you want to remove this member?")) return;
    try {
      await teamsApi.removeMember(teamId, userId);
      await loadTeam();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to remove member");
    }
  };

  const handleUpdateRole = async (userId: string, newRole: number) => {
    try {
      await teamsApi.updateMemberRole(teamId, userId, newRole);
      await loadTeam();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update role");
    }
  };

  const handleDeleteTeam = async () => {
    if (!confirm("Are you sure you want to disband this team? This action is irreversible.")) return;
    try {
      await teamsApi.remove(teamId);
      window.location.href = "/dashboard/teams";
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete team");
    }
  };

  const handleCopyInviteCode = () => {
    if (team?.inviteCode) {
      navigator.clipboard.writeText(team.inviteCode);
      alert("Invite code copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-slate-400">Loading team...</p>
      </div>
    );
  }

  if (error || !team) {
    return (
      <div className="p-4 bg-red-900/20 border border-red-500 rounded-md">
        <p className="text-red-400">{error || "Team not found"}</p>
      </div>
    );
  }

  const filteredMembers = team.members.filter(
    (m) =>
      m.user.nickname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.user.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div>
      {/* Team Header */}
      <h2 className="font-semibold text-slate-200 text-xl leading-normal mb-1">
        {team.name}
      </h2>
      {team.description && (
        <p className="font-medium text-slate-500 text-sm leading-normal mb-6">
          {team.description}
        </p>
      )}

      {/* Tabs */}
      <div className="flex gap-8 mb-1">
        <button
          onClick={() => setActiveTab("members")}
          className={`font-medium text-base leading-normal pb-2 transition-colors ${
            activeTab === "members"
              ? "text-slate-200 border-b-2 border-slate-200"
              : "text-[#787878]"
          }`}
        >
          Team Members
        </button>
        <button
          onClick={() => setActiveTab("projects")}
          className={`font-medium text-base leading-normal pb-2 transition-colors ${
            activeTab === "projects"
              ? "text-slate-200 border-b-2 border-slate-200"
              : "text-[#787878]"
          }`}
        >
          Projects ({projects.length})
        </button>
        <button
          onClick={() => setActiveTab("chat")}
          className={`font-medium text-base leading-normal pb-2 transition-colors ${
            activeTab === "chat"
              ? "text-slate-200 border-b-2 border-slate-200"
              : "text-[#787878]"
          }`}
        >
          Chat
        </button>
      </div>
      <div className="w-full h-px bg-[#333b45] mb-4" />

      {activeTab === "members" ? (
        <div className="flex gap-6">
          {/* Left: Members Table */}
          <div className="flex-1">
            {/* Subtitle + Search */}
            <div className="flex items-center justify-between mb-4">
              <p className="font-medium text-slate-500 text-sm leading-normal">
                Manage the members of your team below.
              </p>
              <div
                className="w-[220px] h-7 rounded-md flex items-center px-3 gap-2 flex-shrink-0"
                style={{
                  backgroundColor: "var(--input-bg)",
                  border: "1px solid var(--input-border)",
                }}
              >
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search members..."
                  className="font-medium text-slate-500 text-xs leading-normal bg-transparent w-full outline-none placeholder:text-slate-500"
                  aria-label="Search members"
                />
                <Image
                  src="/icons/action/search.svg"
                  alt="Search"
                  width={14}
                  height={14}
                  className="flex-shrink-0"
                />
              </div>
            </div>

            {/* Table */}
            <div
              className="rounded-lg overflow-hidden"
              style={{ border: "1px solid #333b45" }}
            >
              {/* Table Header */}
              <div
                className="grid grid-cols-[48px_1fr_120px_48px] items-center px-4 py-2"
                style={{
                  backgroundColor: "#12141b",
                  borderBottom: "1px solid #333b45",
                }}
              >
                <span className="font-medium text-slate-500 text-xs">
                  profile
                </span>
                <span className="font-medium text-slate-500 text-xs">
                  Name
                </span>
                <span />
                <span />
              </div>

              {/* Table Rows */}
              {filteredMembers.map((member) => (
                <div
                  key={member.id}
                  className="grid grid-cols-[48px_1fr_120px_48px] items-center px-4 py-3"
                  style={{
                    backgroundColor: "#1e2127",
                    borderBottom: "1px solid #333b45",
                  }}
                >
                  {/* Avatar */}
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium"
                    style={{ backgroundColor: member.user.avatar ? 'transparent' : '#333b45', color: '#94a3b8' }}
                  >
                    {member.user.avatar ? (
                      <Image src={member.user.avatar} alt={member.user.nickname} width={32} height={32} className="rounded-full" />
                    ) : (
                      member.user.nickname.charAt(0).toUpperCase()
                    )}
                  </div>

                  {/* Name + Email */}
                  <div>
                    <p className="font-medium text-slate-200 text-sm leading-normal">
                      {member.user.nickname}
                    </p>
                    <p className="font-medium text-slate-500 text-xs leading-normal">
                      {member.user.email}
                    </p>
                  </div>

                  {/* Role Badge */}
                  <div className="flex items-center gap-1">
                    <span
                      className="px-3 py-1 rounded text-xs font-medium cursor-pointer"
                      style={{
                        backgroundColor: "#333b45",
                        color: member.role === 0 ? "#e2e8f0" : "#94a3b8",
                      }}
                      onClick={() => member.role !== 0 && handleUpdateRole(member.user.id, member.role === 1 ? 2 : 1)}
                    >
                      {member.role === 0 ? 'Owner' : member.role === 1 ? 'Admin' : 'Member'}{" "}
                      {member.role !== 0 && (
                        <span className="text-slate-500">&#9662;</span>
                      )}
                    </span>
                  </div>

                  {/* Action Icon */}
                  <div className="flex justify-center">
                    {member.role !== 0 && (
                      <button onClick={() => handleRemoveMember(member.user.id)}>
                        <Image
                          src="/icons/action/user-remove.svg"
                          alt="Remove"
                          width={16}
                          height={16}
                          className="opacity-60 hover:opacity-100 cursor-pointer transition-opacity"
                        />
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {/* Empty rows to fill space */}
              {filteredMembers.length < 6 &&
                Array.from({ length: 6 - filteredMembers.length }).map(
                  (_, i) => (
                    <div
                      key={`empty-${i}`}
                      className="px-4 py-5"
                      style={{
                        backgroundColor: "#1e2127",
                        borderBottom: "1px solid #333b45",
                      }}
                    />
                  ),
                )}
            </div>
          </div>

          {/* Right: Team Settings Panel */}
          <div
            className="w-[280px] rounded-lg p-5 flex-shrink-0 self-start"
            style={{
              backgroundColor: "#1e2127",
              border: "1px solid #333b45",
            }}
          >
            <h3 className="font-semibold text-slate-200 text-sm leading-normal mb-4">
              Team Settings
            </h3>

            {/* Team Name */}
            <label className="font-medium text-slate-500 text-xs leading-normal block mb-2">
              Team Name
            </label>
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="w-full h-8 rounded-md px-3 text-xs outline-none mb-3"
              style={{
                backgroundColor: "var(--input-bg)",
                border: "1px solid var(--input-border)",
                color: "var(--text-light)",
              }}
            />
            <button
              onClick={handleSaveName}
              disabled={isSaving}
              className="w-full py-2 rounded-md text-xs font-medium transition-opacity hover:opacity-90 mb-5 disabled:opacity-50"
              style={{
                backgroundColor: "#333b45",
                color: "#e2e8f0",
              }}
            >
              {isSaving ? 'Saving...' : 'Save Name'}
            </button>

            {/* Invite Code */}
            <p className="font-medium text-slate-500 text-xs leading-normal mb-3">
              Generate a unique invite code to share with new members. They can
              use this code to join the team.
            </p>
            <div className="flex items-center gap-2 mb-3">
              <button
                onClick={handleCopyInviteCode}
                disabled={!team.inviteCode}
                className="flex-1 py-2 rounded-md text-xs font-medium flex items-center justify-center gap-2 transition-opacity hover:opacity-90 disabled:opacity-50"
                style={{
                  backgroundColor: "#333b45",
                  color: "#e2e8f0",
                }}
              >
                Copy Code
                <Image
                  src="/icons/action/copy.svg"
                  alt="Copy"
                  width={14}
                  height={14}
                />
              </button>
            </div>

            <div
              className="w-full py-3 rounded-md text-center text-lg font-bold tracking-widest mb-3"
              style={{
                backgroundColor: "var(--input-bg)",
                border: "1px solid var(--input-border)",
                color: "var(--text-light)",
              }}
            >
              {team.inviteCode || 'No code'}
            </div>

            <button
              className="w-full py-2 rounded-md text-xs font-medium transition-opacity hover:opacity-90 mb-6"
              style={{
                backgroundColor: "#333b45",
                color: "#e2e8f0",
              }}
            >
              Generate New Code
            </button>

            {/* Disband Section */}
            <div className="pt-4" style={{ borderTop: "1px solid #333b45" }}>
              <h4 className="font-semibold text-slate-200 text-sm leading-normal mb-1">
                Team Settings{" "}
                <span className="font-normal text-slate-500 text-xs">
                  (owner only)
                </span>
              </h4>
              <p className="font-medium text-slate-500 text-xs leading-normal mb-1">
                Disbanding a team will remove all members and the team.
              </p>
              <p className="font-medium text-red-400 text-xs leading-normal mb-3">
                This action is irreversible.
              </p>
              <button
                onClick={handleDeleteTeam}
                className="w-full py-2 rounded-md text-xs font-medium transition-opacity hover:opacity-90"
                style={{
                  backgroundColor: "#7f1d1d",
                  color: "#fca5a5",
                  border: "1px solid #991b1b",
                }}
              >
                Disband Team
              </button>
            </div>
          </div>
        </div>
      ) : activeTab === "projects" ? (
        <div>
          {/* Projects Header */}
          <div className="flex items-center justify-between mb-4">
            <p className="font-medium text-slate-500 text-sm leading-normal">
              Manage projects within this team.
            </p>
            <button
              onClick={handleCreateProject}
              disabled={isCreatingProject}
              className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{
                backgroundColor: "var(--accent-blue)",
                color: "#e2e8f0",
              }}
            >
              <Image
                src="/icons/action/plus.svg"
                alt="Add"
                width={16}
                height={16}
              />
              {isCreatingProject ? "Creating..." : "New Project"}
            </button>
          </div>

          {/* Projects Grid */}
          {projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Image
                src="/icons/navigation/project.svg"
                alt="No projects"
                width={60}
                height={60}
                className="opacity-50 mb-4"
              />
              <p className="text-slate-400 text-lg font-medium mb-2">No Projects Yet</p>
              <p className="text-slate-500 text-sm">Create your first project to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-x-5 gap-y-4">
              {projects.map((project) => (
                <article
                  key={project.id}
                  className="rounded-xl overflow-hidden"
                  style={{
                    backgroundColor: "#1e2127",
                    border: "1px solid #333b45",
                  }}
                >
                  <div
                    className="relative h-[120px] flex items-center justify-center"
                    style={{
                      backgroundColor: "#12141b",
                      borderBottom: "1px solid #333b45",
                    }}
                  >
                    <Image
                      src="/icons/brand/cube-preview.svg"
                      alt="Project"
                      width={80}
                      height={80}
                    />
                  </div>
                  <div className="px-4 pt-3 pb-4">
                    <h4 className="font-semibold text-slate-200 text-sm leading-normal mb-1">
                      {project.name}
                    </h4>
                    <span className="font-medium text-slate-500 text-xs leading-normal">
                      {project.members.length} member{project.members.length !== 1 ? 's' : ''}
                    </span>
                    <div className="flex gap-2 mt-4">
                      <Link
                        href={`/dashboard/projects/${project.id}`}
                        className="flex-1 py-2 rounded-md text-center text-xs font-medium transition-opacity hover:opacity-90"
                        style={{
                          backgroundColor: "#333b45",
                          color: "#e2e8f0",
                        }}
                      >
                        Open
                      </Link>
                      <button
                        onClick={() => handleDeleteProject(project.id)}
                        className="px-3 py-2 rounded-md text-xs font-medium transition-opacity hover:opacity-90"
                        style={{
                          backgroundColor: "#7f1d1d",
                          color: "#fca5a5",
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-center h-64">
          <p className="text-slate-500 text-sm">Chat feature coming soon.</p>
        </div>
      )}
    </div>
  );
}
