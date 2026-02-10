"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { api, Project } from "@/lib/api";
import Link from "next/link";

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const projectId = params.id as string;

  const loadProject = useCallback(async () => {
    if (!projectId) return;
    try {
      const data = await api.getProject(projectId);
      setProject(data);
      await api.updateProjectAccess(projectId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load project");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    loadProject();
  }, [loadProject]);

  const handleDelete = async () => {
    if (!project || !confirm("Are you sure you want to delete this project?")) return;
    try {
      await api.deleteProject(project.id);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete project");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-[#787878] text-xl">Loading project...</div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-red-400 text-xl mb-4">{error || "Project not found"}</p>
        <Link
          href="/dashboard"
          className="bg-[#64748B] hover:bg-[#526075] text-white font-semibold px-6 py-3 rounded-lg transition"
        >
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => router.push("/dashboard")}
          className="text-[#787878] hover:text-white transition text-2xl"
        >
          &larr;
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-bold">{project.name}</h1>
            {project.teamId && (
              <span className="text-sm bg-[#333B45] px-3 py-1 rounded">Team</span>
            )}
          </div>
          {project.description && (
            <p className="text-[#787878] text-lg mt-2">{project.description}</p>
          )}
        </div>
        {project.creatorId === user?.id && (
          <button
            onClick={handleDelete}
            className="border-2 border-red-500 text-red-500 hover:bg-red-500/10 font-semibold px-6 py-2 rounded-lg transition"
          >
            Delete
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#1E2127] border-2 border-[#333B45] rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Project Info</h2>
          <div className="space-y-3 text-[#787878]">
            <div className="flex justify-between">
              <span>Created</span>
              <span className="text-white">
                {new Date(project.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Last Updated</span>
              <span className="text-white">
                {new Date(project.updatedAt).toLocaleDateString()}
              </span>
            </div>
            {project.lastAccessedAt && (
              <div className="flex justify-between">
                <span>Last Accessed</span>
                <span className="text-white">
                  {new Date(project.lastAccessedAt).toLocaleDateString()}
                </span>
              </div>
            )}
            {project.team && (
              <div className="flex justify-between">
                <span>Team</span>
                <span className="text-white">{project.team.name}</span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-[#1E2127] border-2 border-[#333B45] rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Members</h2>
          {project.members && project.members.length > 0 ? (
            <div className="space-y-3">
              {project.members.map((member) => (
                <div
                  key={member.userId}
                  className="flex items-center justify-between"
                >
                  <span className="text-white">
                    {member.user?.username || member.userId}
                  </span>
                  <span className="text-xs bg-[#333B45] px-2 py-1 rounded">
                    {member.role}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[#787878]">No members yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
