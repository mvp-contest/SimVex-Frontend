"use client";

import Link from "next/link";
import { Plus } from "lucide-react";

export default function CreateProjectCard() {
  return (
    <Link href="/projects/create" className="block h-full">
      <div className="bg-(--color-card-bg) border-2 border-dashed border-(--color-border-primary) rounded-xl h-full min-h-[380px] flex flex-col items-center justify-center gap-6 hover:border-(--color-accent-white) hover:bg-(--color-card-bg)/80 transition-all cursor-pointer group">
        <div className="w-16 h-16 rounded-full bg-(--color-input-bg) flex items-center justify-center text-(--color-text-muted) group-hover:text-(--color-accent-blue) group-hover:bg-(--color-accent-blue)/10 transition-colors">
          <Plus size={32} />
        </div>
        <p className="text-xl font-medium text-(--color-text-primary) group-hover:text-(--color-accent-white) transition-colors">
          Create New Project
        </p>
      </div>
    </Link>
  );
}
