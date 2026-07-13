"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faPlus, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import type { Project } from "@/app/types";
import Link from "next/link";
import { getInitials } from "@/lib/utils";

interface ProjectHeaderProps {
  project: Project;
  currentUserId: string;
  onEditProject: () => void;
  onCreateTask: () => void;
  onAICreateTask: () => void;
}

export default function ProjectHeader({
  project,
  currentUserId,
  onEditProject,
  onCreateTask,
  onAICreateTask,
}: ProjectHeaderProps) {
  const totalMembers = project.members.length + 1; // +1 pour le propriétaire
  const canEditProject = project.owner.id === currentUserId;

  return (
    <div className="p-3 sm:p-6 mb-4 sm:mb-6">
      {/* En-tête avec nom et actions */}
      <div className="flex flex-col lg:flex-row items-start justify-between mb-4 sm:mb-6 gap-4">
        <div className="flex flex-col sm:flex-row w-full lg:w-auto">
          <Link
            href="/projets"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-[#FF6B35] transition-colors mb-3 sm:mb-0 focus:outline-none focus:ring-2 focus:ring-[#D3590B] focus:ring-offset-2 rounded-xl"
            aria-label="Retour à la liste des projets"
          >
            <FontAwesomeIcon
              icon={faArrowLeft}
              className="w-3 h-3 sm:w-4 sm:h-4 border border-gray-300 bg-white rounded-xl p-3 sm:p-4"
              aria-hidden="true"
            />
          </Link>
          <div className="sm:ml-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
              <h1 className="text-lg sm:text-xl lg:text-3xl font-medium">
                {project.name}
              </h1>
              {canEditProject && (
                <button
                  type="button"
                  onClick={onEditProject}
                  className="text-[#BE4E09] text-xs sm:text-sm lg:text-base font-medium cursor-pointer underline self-start"
                >
                  Modifier
                </button>
              )}
            </div>
            {project.description && (
              <p className="text-gray-600 text-sm sm:text-base lg:text-lg mt-1">
                {project.description}
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3 w-full lg:w-auto">
          {canEditProject && (
            <button
              type="button"
              onClick={onCreateTask}
              className="flex-1 lg:flex-none px-3 sm:px-4 lg:px-6 py-2 sm:py-3 text-xs sm:text-sm lg:text-base bg-black text-white cursor-pointer rounded-lg flex items-center justify-center gap-2 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
              aria-label="Créer une nouvelle tâche"
            >
              <FontAwesomeIcon
                icon={faPlus}
                className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5"
                aria-hidden="true"
              />
              <span className="hidden sm:inline">Créer une tâche</span>
              <span className="sm:hidden">Créer</span>
            </button>
          )}
          {canEditProject && (
            <button
              type="button"
              onClick={onAICreateTask}
              className="flex-1 lg:flex-none px-3 sm:px-4 lg:px-6 py-2 sm:py-3 text-xs sm:text-sm lg:text-base bg-[#C2510A] text-white cursor-pointer rounded-lg flex items-center justify-center gap-2 hover:bg-[#b94a09] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D3590B]"
              aria-label="Créer une tâche avec l'intelligence artificielle"
            >
              <FontAwesomeIcon
                icon={faStar}
                className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5"
                aria-hidden="true"
              />
              <span>IA</span>
            </button>
          )}
        </div>
      </div>

      {/* Section Contributeurs */}
      <div className="bg-[#F3F4F6] flex flex-col sm:flex-row justify-between items-start sm:items-center mt-8 sm:mt-12 lg:mt-20 rounded-xl p-4 sm:p-6 gap-2">
        <h2 className="text-xs sm:text-sm lg:text-base font-semibold">
          Contributeurs{" "}
          <span className="text-gray-600 font-normal">
            {totalMembers} personnes
          </span>
        </h2>

        <div
          className="flex flex-wrap items-center gap-3"
          role="list"
          aria-label="Liste des contributeurs du projet"
        >
          {/* Propriétaire */}
          <div
            className="flex items-center gap-2 bg-gray-50 rounded-full pr-3 border border-gray-200"
            role="listitem"
          >
            <div
              className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-xs font-semibold"
              role="img"
              aria-label={`Avatar de ${project.owner.name || project.owner.email}, propriétaire`}
              title={project.owner.name || project.owner.email}
            >
              {getInitials(project.owner.name || project.owner.email)}
            </div>
            <span className="text-sm text-gray-700">
              {project.owner.name || project.owner.email}
            </span>
            <span className="px-2 py-0.5 bg-orange-100 text-orange-600 text-xs font-medium rounded-full">
              Propriétaire
            </span>
          </div>

          {/* Membres */}
          {project.members.map((member) => (
            <div
              key={member.id}
              className="flex items-center gap-2 bg-gray-50 rounded-full pr-3 border border-gray-200"
              role="listitem"
            >
              <div
                className="w-8 h-8 rounded-full bg-[#E5E7EB] flex items-center justify-center text-xs font-semibold"
                role="img"
                aria-label={`Avatar de ${member.user.name || member.user.email}`}
                title={member.user.name || member.user.email}
              >
                {getInitials(member.user.name || member.user.email)}
              </div>
              <span className="text-sm text-gray-700">
                {member.user.name || member.user.email}
              </span>
              {member.role === "ADMIN" && (
                <span className="px-2 py-0.5 bg-blue-100 text-blue-600 text-xs font-medium rounded-full">
                  Admin
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
