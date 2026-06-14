import ProjectCard from "./ProjectCard";
import type { Project } from "@/app/types";

interface ProjectsSectionProps {
  projects: Project[];
}

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
  if (projects.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 text-gray-600 px-6 py-8 rounded-xl text-center">
        Aucun projet pour le moment
      </div>
    );
  }

  return (
    <section
      className=" min-h-[60vh] mx-20 px-6 py-4"
      aria-labelledby="projects-heading"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}
