import Link from "next/link";
import PlusIcon from "@/components/icons/plus-icon.svg";

export default function CreateProjectCard() {
  return (
    <Link href="/projects/create">
      <div className="bg-(--color-card-bg) border-[2px] border-dashed border-(--color-border-primary) rounded-[15px] h-full min-h-[454px] flex flex-col items-center justify-center gap-6 hover:border-(--color-accent-white) transition-colors cursor-pointer">
        <PlusIcon className="w-[62px] h-[62px]" style={{ fill: "#64748B" }} />
        <p className="text-[24px] font-medium text-(--color-text-primary)">
          Creat New Project
        </p>
      </div>
    </Link>
  );
}
