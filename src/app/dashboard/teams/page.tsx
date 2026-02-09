"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { teams as teamsApi, type Team } from "@/lib/api";
import { useAuth } from "@/app/context/AuthContext";

interface TeamWithUI extends Team {
  selected: boolean;
}

export default function TeamsPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [teams, setTeams] = useState<TeamWithUI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");

  useEffect(() => {
    if (user?.id) {
      loadTeams();
    } else if (!user && !loading) {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const loadTeams = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      setError("");
      const data = await teamsApi.list(user.id);
      setTeams(data.map(t => ({ ...t, selected: false })));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load teams");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim() || !user?.id) return;

    try {
      setIsCreating(true);
      console.log("Creating team with name:", newTeamName);
      const result = await teamsApi.create(newTeamName, user.id);
      console.log("Team created successfully:", result);
      setNewTeamName("");
      setShowCreateForm(false);
      await loadTeams();
    } catch (err: unknown) {
      console.error("Team creation error:", err);
      console.error("Error details:", JSON.stringify(err, null, 2));

      const error = err as { message?: string };
      let userMessage = "Failed to create team. ";
      if (error.message?.includes("500") || error.message?.includes("Internal server error")) {
        userMessage += "The server encountered an error. Please try again later or contact support.";
      } else {
        userMessage += error.message || "Unknown error occurred.";
      }

      setError(userMessage);
      alert(userMessage);
    } finally {
      setIsCreating(false);
    }
  };

  const filteredTeams = teams.filter((t) =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const toggleTeamSelection = (id: string) => {
    setTeams((prev) =>
      prev.map((t) => (t.id === id ? { ...t, selected: !t.selected } : t)),
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-slate-400">Loading teams...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <h2 className="font-semibold text-slate-200 text-xl leading-normal mb-1">
        My Teams
      </h2>
      <p className="font-medium text-slate-500 text-sm leading-normal mb-8">
        Manage and view the teams you&apos;re a part of.
      </p>

      {error && (
        <div className="mb-4 p-4 bg-red-900/20 border border-red-500 rounded-md">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* All Teams Header + Search */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-200 text-base leading-normal">
          All Teams
        </h3>
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
            placeholder="Search Teams..."
            className="font-medium text-slate-500 text-xs leading-normal bg-transparent w-full outline-none placeholder:text-slate-500"
            aria-label="Search teams"
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

      {/* Team Cards Grid */}
      <div className="grid grid-cols-4 gap-x-5 gap-y-4 mb-6">
        {filteredTeams.map((team) => (
          <article
            key={team.id}
            className="rounded-xl overflow-hidden"
            style={{
              backgroundColor: "#1e2127",
              border: "1px solid #333b45",
            }}
          >
            {/* Thumbnail area */}
            <div
              className="relative h-[120px] flex items-center justify-center"
              style={{
                backgroundColor: "#12141b",
                borderBottom: "1px solid #333b45",
              }}
            >
              <button
                onClick={() => toggleTeamSelection(team.id)}
                className="absolute top-2 left-2 w-5 h-5 flex items-center justify-center"
              >
                <Image
                  src={
                    team.selected
                      ? "/icons/action/checkbox-checked.svg"
                      : "/icons/action/checkbox-unchecked.svg"
                  }
                  alt={team.selected ? "Selected" : "Unselected"}
                  width={18}
                  height={18}
                />
              </button>
              <Image
                src="/icons/brand/cube-preview.svg"
                alt="Team Icon"
                width={80}
                height={80}
              />
            </div>

            {/* Info */}
            <div className="px-4 pt-3 pb-4">
              <h4 className="font-semibold text-slate-200 text-sm leading-normal">
                {team.name}
              </h4>
              <span className="font-medium text-slate-500 text-xs leading-normal">
                {team.members.length} member{team.members.length !== 1 ? 's' : ''}
              </span>
              {team.description && (
                <p className="font-medium text-slate-500 text-xs leading-normal mt-2">
                  {team.description}
                </p>
              )}

              {/* Member Avatars */}
              <div className="flex items-center mt-3">
                {team.members.slice(0, 5).map((member, idx) => (
                  <div
                    key={member.id}
                    className="w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-medium"
                    style={{
                      backgroundColor: member.user.profile.avatar ? 'transparent' : '#333b45',
                      borderColor: "#1e2127",
                      marginLeft: idx === 0 ? 0 : -8,
                      zIndex: 5 - idx,
                      color: '#94a3b8'
                    }}
                    title={member.user.profile.nickname}
                  >
                    {member.user.profile.avatar ? (
                      <Image src={member.user.profile.avatar} alt={member.user.profile.nickname} width={24} height={24} className="rounded-full" />
                    ) : (
                      member.user.profile.nickname.charAt(0).toUpperCase()
                    )}
                  </div>
                ))}
                {team.members.length > 5 && (
                  <span className="font-medium text-slate-500 text-xs ml-2">
                    +{team.members.length - 5}
                  </span>
                )}
              </div>

              {/* View Team Button */}
              <Link
                href={`/dashboard/teams/${team.id}`}
                className="block w-full mt-4 py-2 rounded-md text-center text-sm font-medium transition-opacity hover:opacity-90"
                style={{
                  backgroundColor: "#333b45",
                  color: "#e2e8f0",
                }}
              >
                View Team
              </Link>
            </div>
          </article>
        ))}

        {/* Create New Team Card */}
        {showCreateForm ? (
          <form
            onSubmit={handleCreateTeam}
            className="rounded-xl flex flex-col items-center justify-center gap-4 min-h-[300px] p-6"
            style={{
              border: "2px dashed #333b45",
              backgroundColor: "#1e2127",
            }}
          >
            <h3 className="font-semibold text-slate-200 text-base">Create New Team</h3>
            <input
              type="text"
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
              placeholder="Team name"
              autoFocus
              className="w-full px-4 py-2 rounded-md bg-[#12141b] border border-[#333b45] text-slate-200 text-sm outline-none placeholder:text-slate-500"
            />
            <div className="flex gap-2 w-full">
              <button
                type="submit"
                disabled={isCreating || !newTeamName.trim()}
                className="flex-1 px-4 py-2 rounded-md bg-[#4a9eff] text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isCreating ? "Creating..." : "Create"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false);
                  setNewTeamName("");
                }}
                className="flex-1 px-4 py-2 rounded-md bg-[#333b45] text-slate-300 text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setShowCreateForm(true)}
            className="rounded-xl flex flex-col items-center justify-center gap-4 min-h-[300px] cursor-pointer transition-opacity hover:opacity-80"
            style={{
              border: "2px dashed #333b45",
              backgroundColor: "transparent",
            }}
          >
            <Image
              src="/icons/action/plus.svg"
              alt="Create"
              width={40}
              height={40}
            />
            <span className="font-medium text-slate-200 text-sm">
              Create New Team
            </span>
          </button>
        )}
      </div>

      {/* Pagination */}
      <div className="w-full h-px bg-[#333b45] mb-4" />
      <div className="flex items-center justify-center gap-3">
        <button
          className="flex items-center justify-center hover:opacity-70 transition-opacity"
          aria-label="Previous page"
        >
          <Image
            src="/icons/action/arrow-left.svg"
            alt="Previous"
            width={8}
            height={14}
          />
        </button>

        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ border: "1.5px solid #333b45" }}
        >
          <span className="font-medium text-slate-200 text-xs leading-normal">
            1
          </span>
        </div>

        <span className="font-medium text-slate-200 text-xs leading-normal">
          1-{filteredTeams.length} of 1 Projects
        </span>

        <button
          className="flex items-center justify-center hover:opacity-70 transition-opacity"
          aria-label="Next page"
        >
          <Image
            src="/icons/action/arrow-right.svg"
            alt="Next"
            width={8}
            height={14}
          />
        </button>
      </div>
    </div>
  );
}
