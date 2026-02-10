import DashboardLayout from "@/components/layout/DashboardLayout";
import ProjectCard from "@/components/dashboard/ProjectCard";
import CreateProjectCard from "@/components/dashboard/CreateProjectCard";
import SearchBar from "@/components/dashboard/SearchBar";
import FilterDropdown from "@/components/dashboard/FilterDropdown";
import Pagination from "@/components/dashboard/Pagination";


const mockProjects = [
  {
    id: "1",
    name: "3D Design Project",
    owner: "Team Lead",
    memberCount: 5,
    viewCount: 27,
    updatedAt: "Apr 22, 2024",
    thumbnailUrl: "/SIMVEX_logo_2.svg",
  },
];

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="max-w-[1400px] mx-auto p-8">
        {}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-(--color-text-primary) mb-2">
            Projects Dashboard
          </h1>
          <p className="text-lg text-(--color-text-secondary)">
            Manage and create project within your team.
          </p>
        </div>

        {}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div className="flex gap-4 w-full md:w-auto">
            <FilterDropdown label="All Teams" />
            <FilterDropdown label="All Projects" />
          </div>
          <div className="w-full md:w-auto">
            <SearchBar />
          </div>
        </div>

        {}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {mockProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
          <CreateProjectCard />
        </div>

        {}
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
