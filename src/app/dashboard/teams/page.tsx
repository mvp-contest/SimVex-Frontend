"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { teams as teamsApi, type Team } from "@/lib/api";
import { useAuth } from "@/app/context/AuthContext";
import Button from "@/components/ui/Button";
import TextInput from "@/components/ui/TextInput";
import { Search, Plus, Check } from "lucide-react";

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
      await teamsApi.create(newTeamName, user.id);
      setNewTeamName("");
      setShowCreateForm(false);
      await loadTeams();
    } catch (err: unknown) {
      const error = err as { message?: string };
      let userMessage = "Failed to create team. ";
      if (error.message?.includes("500") || error.message?.includes("Internal server error")) {
        userMessage += "The server encountered an error. Please try again later.";
      } else {
        userMessage += error.message || "Unknown error occurred.";
      }
      setError(userMessage);
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
        <p className="text-(--color-text-muted)">Loading teams...</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto p-6 md:p-8">
      {/* Page Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-(--color-text-primary) mb-2">
          My Teams
        </h2>
        <p className="text-(--color-text-secondary)">
          Manage and view the teams you&apos;re a part of.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-(--color-status-danger-bg) border border-(--color-status-danger-border) rounded-md">
          <p className="text-(--color-status-danger) text-sm">{error}</p>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-(--color-text-primary)">
          All Teams
        </h3>
        <div className="w-[300px] relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-(--color-text-muted)">
            <Search size={16} />
          </div>
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Teams..."
            className="w-full pl-9 pr-4 py-2 bg-(--color-input-bg) border border-(--color-input-border) rounded-md text-sm text-(--color-text-primary) outline-none focus:border-(--color-accent-blue) transition-colors"
          />
        </div>
      </div>

      {/* Team Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {filteredTeams.map((team) => (
          <article
            key={team.id}
            className="group bg-(--color-card-bg) border border-(--color-card-border) rounded-xl overflow-hidden hover:border-(--color-accent-blue) transition-colors"
          >
            {/* Thumbnail area */}
            <div className="relative h-[140px] bg-[#12141b] flex items-center justify-center border-b border-(--color-card-border)">
              <button
                onClick={() => toggleTeamSelection(team.id)}
                className="absolute top-3 left-3 w-6 h-6 flex items-center justify-center rounded bg-(--color-card-bg) border border-(--color-card-border) text-(--color-accent-blue) opacity-0 group-hover:opacity-100 transition-opacity"
              >
                {team.selected && <Check size={14} />}
              </button>
              <Image
                src="/SIMVEX_logo_2.svg"
                alt="Team Icon"
                width={80}
                height={80}
                className="opacity-80 group-hover:opacity-100 transition-opacity"
              />
            </div>

            {/* Info */}
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-(--color-text-primary) truncate flex-1 pr-2">
                  {team.name}
                </h4>
                <span className="text-xs font-medium text-(--color-text-muted) bg-(--color-input-bg) px-2 py-1 rounded">
                  {team.members.length} {team.members.length === 1 ? 'member' : 'members'}
                </span>
              </div>
              
              {team.description && (
                <p className="text-sm text-(--color-text-secondary) line-clamp-2 mb-4 h-10">
                  {team.description}
                </p>
              )}

              {/* Member Avatars */}
              <div className="flex items-center mb-4 h-8">
                {team.members.slice(0, 5).map((member, idx) => (
                  <div
                    key={member.id}
                    className="w-8 h-8 rounded-full border-2 border-(--color-card-bg) flex items-center justify-center text-xs font-medium bg-(--color-input-bg) text-(--color-text-muted)"
                    style={{
                      marginLeft: idx === 0 ? 0 : -10,
                      zIndex: 5 - idx,
                    }}
                    title={member.user.profile.nickname}
                  >
                    {member.user.profile.avatar ? (
                      <Image src={member.user.profile.avatar} alt={member.user.profile.nickname} width={32} height={32} className="rounded-full" />
                    ) : (
                      member.user.profile.nickname.charAt(0).toUpperCase()
                    )}
                  </div>
                ))}
                {team.members.length > 5 && (
                  <div 
                    className="w-8 h-8 rounded-full border-2 border-(--color-card-bg) flex items-center justify-center text-xs font-medium bg-(--color-input-bg) text-(--color-text-muted)"
                    style={{ marginLeft: -10, zIndex: 0 }}
                  >
                    +{team.members.length - 5}
                  </div>
                )}
              </div>

              {/* View Team Button */}
              <Link href={`/dashboard/teams/${team.id}`}>
                <Button variant="secondary" className="w-full text-sm py-2">
                  View Team
                </Button>
              </Link>
            </div>
          </article>
        ))}

        {/* Create New Team Card */}
        {showCreateForm ? (
          <form
            onSubmit={handleCreateTeam}
            className="bg-(--color-card-bg) border-2 border-dashed border-(--color-card-border) rounded-xl flex flex-col items-center justify-center gap-4 p-6 min-h-[340px]"
          >
            <h3 className="font-semibold text-(--color-text-primary)">Create New Team</h3>
            <TextInput
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
              placeholder="Team name"
              autoFocus
              className="text-center"
            />
            <div className="flex flex-col gap-2 w-full mt-2">
              <Button
                type="submit"
                variant="primary"
                disabled={isCreating || !newTeamName.trim()}
                className="w-full"
              >
                {isCreating ? "Creating..." : "Create"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setShowCreateForm(false);
                  setNewTeamName("");
                }}
                className="w-full"
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setShowCreateForm(true)}
            className="group bg-transparent border-2 border-dashed border-(--color-card-border) rounded-xl flex flex-col items-center justify-center gap-4 min-h-[340px] hover:border-(--color-accent-blue) hover:bg-(--color-card-bg)/30 transition-all"
          >
            <div className="w-12 h-12 rounded-full bg-(--color-input-bg) flex items-center justify-center text-(--color-text-muted) group-hover:text-(--color-accent-blue) group-hover:bg-(--color-accent-blue)/10 transition-colors">
              <Plus size={24} />
            </div>
            <span className="font-medium text-(--color-text-secondary) group-hover:text-(--color-text-primary)">
              Create New Team
            </span>
          </button>
        )}
      </div>

      {/* Pagination (Optional - currently static) */}
      <div className="border-t border-(--color-border-primary) pt-4 flex items-center justify-center gap-2">
        <Button variant="ghost" size="sm" disabled>Previous</Button>
        <div className="px-3 py-1 rounded bg-(--color-card-bg) border border-(--color-card-border) text-sm font-medium text-(--color-text-primary)">
          1
        </div>
        <Button variant="ghost" size="sm" disabled>Next</Button>
      </div>
    </div>
  );
}
