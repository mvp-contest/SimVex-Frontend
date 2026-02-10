"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { api, Project } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";

export default function DashboardPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");

  const loadProjects = useCallback(async () => {
    if (!user) return;
    try {
      const data = await api.getProjects(user.id);
      setProjects(data);
    } catch (error) {
      console.error("Failed to load projects:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadProjects();
    }
  }, [user, loadProjects]);

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilter =
      filter === "all" ||
      (filter === "team" && project.teamId) ||
      (filter === "personal" && !project.teamId);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Projects</h1>
        <p className="text-[#787878] text-lg">
          Manage and collaborate on your 3D projects
        </p>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects..."
            className="w-full bg-[#1E2127] border-2 border-[#333B45] rounded-lg px-4 py-3 pl-12 text-white focus:outline-none focus:border-[#64748B] transition"
          />
          <Image
            src="/Search.svg"
            alt="Search"
            width={24}
            height={24}
            className="absolute left-4 top-1/2 -translate-y-1/2"
          />
        </div>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-[#1E2127] border-2 border-[#333B45] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#64748B] transition"
        >
          <option value="all">All Projects</option>
          <option value="team">Team Projects</option>
          <option value="personal">Personal Projects</option>
        </select>

        <Link
          href="/dashboard/create-project"
          className="bg-[#64748B] hover:bg-[#526075] text-white font-semibold px-6 py-3 rounded-lg transition flex items-center gap-2"
        >
          <span className="text-xl">+</span>
          New Project
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-12 text-[#787878]">
          Loading projects...
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-[#787878] text-lg mb-4">
            {searchQuery || filter !== "all"
              ? "No projects found"
              : "No projects yet"}
          </p>
          {!searchQuery && filter === "all" && (
            <Link
              href="/dashboard/create-project"
              className="inline-block bg-[#64748B] hover:bg-[#526075] text-white font-semibold px-6 py-3 rounded-lg transition"
            >
              Create your first project
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Link
              key={project.id}
              href={`/dashboard/projects/${project.id}`}
              className="bg-[#1E2127] border-2 border-[#333B45] rounded-lg p-6 hover:border-[#64748B] transition group"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-semibold group-hover:text-[#64748B] transition">
                  {project.name}
                </h3>
                {project.teamId && (
                  <span className="text-xs bg-[#333B45] px-2 py-1 rounded">
                    Team
                  </span>
                )}
              </div>

              {project.description && (
                <p className="text-[#787878] text-sm mb-4 line-clamp-2">
                  {project.description}
                </p>
              )}

              <div className="flex items-center justify-between text-sm text-[#787878]">
                <span>
                  {new Date(project.createdAt).toLocaleDateString()}
                </span>
                {project.lastAccessedAt && (
                  <span>
                    Last accessed:{" "}
                    {new Date(project.lastAccessedAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
