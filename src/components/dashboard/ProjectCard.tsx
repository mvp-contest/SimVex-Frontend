"use client";

import Image from "next/image";

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
    <div className="bg-(--color-card-bg) border-[1px] border-(--color-border-primary) rounded-[15px] p-6 flex flex-col items-center gap-4 hover:border-(--color-accent-white) transition-colors cursor-pointer">
      {/* Thumbnail */}
      <div className="w-[221px] h-[221px] flex items-center justify-center">
        <Image
          src={project.thumbnailUrl}
          alt={project.name}
          width={221}
          height={221}
          className="object-contain"
        />
      </div>

      {/* Project info */}
      <div className="w-full">
        <h3 className="text-[28px] font-semibold text-(--color-text-primary) mb-1">
          {project.name}
        </h3>
        <p className="text-[18px] font-medium text-(--color-text-muted) mb-4">
          {project.owner}
        </p>

        {/* Divider */}
        <div className="w-full h-[2px] bg-(--color-border-primary) mb-4" />

        {/* Stats */}
        <div className="flex items-center gap-4 mb-4">
          {/* Avatar placeholders */}
          <div className="flex items-center -space-x-2">
            <div className="w-[30px] h-[30px] rounded-full bg-gray-400 border-2 border-(--color-card-bg)" />
            <div className="w-[30px] h-[30px] rounded-full bg-red-400 border-2 border-(--color-card-bg)" />
            <div className="w-[30px] h-[30px] rounded-full bg-gray-700 border-2 border-(--color-card-bg)" />
          </div>
          <span className="text-[18px] font-medium text-(--color-text-muted)">
            +{project.memberCount} memvers
          </span>
          <span className="text-[20px] font-medium text-(--color-text-muted) ml-auto">
            {project.viewCount} Views
          </span>
        </div>

        {/* Divider */}
        <div className="w-full h-[2px] bg-(--color-border-primary) mb-3" />

        {/* Updated date */}
        <p className="text-[18px] font-medium text-(--color-text-muted) text-center">
          Updated {project.updatedAt}
        </p>
      </div>
    </div>
  );
}
