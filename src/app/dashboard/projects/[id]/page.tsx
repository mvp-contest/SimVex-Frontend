"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { projects as projectsApi, type Project } from "@/lib/api";

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.id as string;
  
  const [activeTab, setActiveTab] = useState<"3d" | "workflow">("3d");
  const [searchQuery, setSearchQuery] = useState("");
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProject();
  }, [projectId]);

  const loadProject = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await projectsApi.get(projectId);
      setProject(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load project");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-slate-400">Loading project...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="p-4 bg-red-900/20 border border-red-500 rounded-md">
        <p className="text-red-400">{error || "Project not found"}</p>
      </div>
    );
  }


  return (
    <div>
      {/* Project Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold text-slate-200 text-xl leading-normal">
          {project.name}
        </h2>
        <button
          className="flex items-center gap-1.5 px-5 py-2 rounded-full text-sm font-semibold transition-opacity hover:opacity-90"
          style={{ backgroundColor: "var(--accent-blue)", color: "#e2e8f0" }}
        >
          Start
          <Image
            src="/icons/action/play-arrow.svg"
            alt="Start"
            width={12}
            height={12}
          />
        </button>
      </div>

      {/* Owner Info */}
      <div className="flex items-center gap-2 mb-5">
        <div className="flex items-center justify-center">
          <Image
            src="/icons/navigation/team.svg"
            alt="Team"
            width={16}
            height={16}
          />
        </div>
        <span className="font-medium text-slate-500 text-xs leading-normal">
          {project.members.length} member{project.members.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Tabs + Search Row */}
      <div className="flex items-start justify-between mb-[5px]">
        <div>
          <nav className="flex gap-16">
            <button
              onClick={() => setActiveTab("3d")}
              className={`font-medium text-base leading-normal transition-colors ${
                activeTab === "3d" ? "text-slate-200" : "text-[#787878]"
              }`}
            >
              3D Models
            </button>
            <button
              onClick={() => setActiveTab("workflow")}
              className={`font-medium text-base leading-normal transition-colors ${
                activeTab === "workflow" ? "text-slate-200" : "text-[#787878]"
              }`}
            >
              Workflow
            </button>
          </nav>
        </div>

        {/* Search box */}
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
            placeholder="Search models..."
            className="font-medium text-slate-500 text-xs leading-normal bg-transparent w-full outline-none placeholder:text-slate-500"
            aria-label="Search models"
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

      {/* Divider */}
      <div className="w-full h-px bg-[#333b45] mb-3" />

      {/* Stats Row */}
      <div className="flex items-center gap-4 mb-5">
        <p className="font-medium text-sm leading-normal">
          <span className="text-slate-200">0 </span>
          <span className="text-[#787878]">models Uploaded</span>
        </p>
        <div className="w-px h-4 bg-[#787878]" />
        <p className="font-medium text-sm leading-normal">
          <span className="text-slate-200">0</span>
          <span className="text-[#787878]"> Files Uploaded</span>
        </p>
        <span className="font-medium text-slate-500 text-sm leading-normal">
          (0 MB)
        </span>
      </div>

      {/* Empty State or Model Cards Grid */}
      {activeTab === "3d" ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Image
            src="/icons/brand/cube-preview.svg"
            alt="No models"
            width={80}
            height={80}
            className="opacity-50 mb-4"
          />
          <p className="text-slate-400 text-lg font-medium mb-2">No 3D Models Yet</p>
          <p className="text-slate-500 text-sm mb-6">Upload your first 3D model to get started</p>
          <button
            className="px-6 py-3 rounded-md text-sm font-medium transition-opacity hover:opacity-90"
            style={{
              backgroundColor: "var(--accent-blue)",
              color: "#e2e8f0",
            }}
          >
            Upload Model
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-slate-400 text-lg font-medium mb-2">Workflow Coming Soon</p>
          <p className="text-slate-500 text-sm">This feature is under development</p>
        </div>
      )}
    </div>
  );
}
