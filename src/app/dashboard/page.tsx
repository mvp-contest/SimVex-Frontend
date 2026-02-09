import DashboardLayout from "@/components/layout/DashboardLayout";
import ProjectCard from "@/components/dashboard/ProjectCard";
import CreateProjectCard from "@/components/dashboard/CreateProjectCard";
import SearchBar from "@/components/dashboard/SearchBar";
import FilterDropdown from "@/components/dashboard/FilterDropdown";
import Pagination from "@/components/dashboard/Pagination";

// Mock data
const mockProjects = [
  {
    id: "1",
    name: "SV Renderer",
    owner: "Kang sang-woo",
    memberCount: 5,
    viewCount: 27,
    updatedAt: "Apr 22, 2024",
    thumbnailUrl: "/images/simvex-logo.png",
  },
];

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="p-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[32px] font-semibold text-(--color-text-primary) mb-4">
            Projects Dashboard
          </h1>
          <p className="text-[24px] font-medium text-(--color-text-secondary)">
            Manage and create project whihin your team.
          </p>
        </div>

        {/* Filters and Search */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex gap-4">
            <FilterDropdown label="All Teams" />
            <FilterDropdown label="All Projects" />
          </div>
          <SearchBar />
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {mockProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
          <CreateProjectCard />
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={1}
          totalPages={1}
          totalItems={mockProjects.length}
          itemsPerPage={10}
        />
      </div>
    </DashboardLayout>
  );
}
