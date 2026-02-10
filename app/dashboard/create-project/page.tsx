"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { api, Team } from "@/lib/api";

export default function CreateProjectPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [teams, setTeams] = useState<Team[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    teamId: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const loadTeams = useCallback(async () => {
    if (!user) return;
    try {
      const data = await api.getTeams(user.id);
      setTeams(data);
    } catch (error) {
      console.error("Failed to load teams:", error);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadTeams();
    }
  }, [user, loadTeams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setError("");
    setLoading(true);

    try {
      const projectData = {
        name: formData.name,
        description: formData.description || undefined,
        teamId: formData.teamId || undefined,
        creatorId: user.id,
      };

      const project = await api.createProject(projectData);
      router.push(`/dashboard/projects/${project.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Create New Project</h1>
        <p className="text-[#787878] text-lg">
          Start a new 3D project for your team or personal use
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-white text-sm font-medium mb-2">
            Project Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full bg-[#1E2127] border-2 border-[#333B45] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#64748B] transition"
            placeholder="Enter project name"
            required
          />
        </div>

        <div>
          <label className="block text-white text-sm font-medium mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full bg-[#1E2127] border-2 border-[#333B45] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#64748B] transition resize-none"
            placeholder="Enter project description (optional)"
            rows={4}
          />
        </div>

        <div>
          <label className="block text-white text-sm font-medium mb-2">
            Team (Optional)
          </label>
          <select
            value={formData.teamId}
            onChange={(e) =>
              setFormData({ ...formData, teamId: e.target.value })
            }
            className="w-full bg-[#1E2127] border-2 border-[#333B45] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#64748B] transition"
          >
            <option value="">Personal Project</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
          <p className="text-[#787878] text-sm mt-2">
            Select a team to create a collaborative project, or leave empty for
            a personal project
          </p>
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 bg-[#333B45] hover:bg-[#3f4854] text-white font-semibold py-3 rounded-lg transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-[#64748B] hover:bg-[#526075] text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating..." : "Create Project"}
          </button>
        </div>
      </form>
    </div>
  );
}
