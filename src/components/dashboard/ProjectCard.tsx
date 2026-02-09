"use client";

import Image from "next/image";
import { Users, Eye, Clock } from "lucide-react";

interface ProjectCardProps {
  project: {
    id: string;
    name: string;
    owner: string;
    memberCount: number;
    viewCount: number;
    updatedAt: string;
    thumbnailUrl: string;
  };
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="bg-(--color-card-bg) border border-(--color-border-primary) rounded-xl p-5 flex flex-col gap-4 hover:border-(--color-accent-blue) transition-colors cursor-pointer group">
      {/* Thumbnail */}
      <div className="relative aspect-square w-full bg-[#12141b] rounded-lg flex items-center justify-center border border-(--color-card-border) overflow-hidden">
        <Image
          src={project.thumbnailUrl}
          alt={project.name}
          fill
          className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Project info */}
      <div className="flex flex-col gap-3">
        <div>
          <h3 className="text-xl font-semibold text-(--color-text-primary) mb-1 truncate">
            {project.name}
          </h3>
          <p className="text-sm text-(--color-text-muted) truncate">
            Owned by {project.owner}
          </p>
        </div>

        {/* Divider */}
        <div className="h-px bg-(--color-border-primary)" />

        {/* Stats */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-(--color-text-secondary)" title="Members">
              <Users size={16} />
              <span className="text-sm font-medium">{project.memberCount}</span>
            </div>
            <div className="flex items-center gap-1.5 text-(--color-text-secondary)" title="Views">
              <Eye size={16} />
              <span className="text-sm font-medium">{project.viewCount}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5 text-(--color-text-muted)" title="Last updated">
            <Clock size={14} />
            <span className="text-xs">{project.updatedAt}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
