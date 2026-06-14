"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faPlus, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import type { Project } from "@/app/types";
import Link from "next/link";

interface ProjectHeaderProps {
  project: Project;
}

// Fonction pour obtenir les initiales (prénom + nom)
function getInitials(name: string): string {
  const words = name.trim().split(/\s+/);
  if (words.length >= 2) {
    return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
  }
  return words[0].charAt(0).toUpperCase();
}

export default function ProjectHeader({ project }: ProjectHeaderProps) {
  const totalMembers = project.members.length + 1; // +1 pour le propriétaire

  return (
    <div className="p-8 mb-6">
      {/* En-tête avec nom et actions */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex ">
          <Link
            href="/projets"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-[#FF6B35] transition-colors"
          >
            <FontAwesomeIcon
              icon={faArrowLeft}
              className="w-4 h-4 border border-gray-300 bg-white rounded-xl p-4"
            />
          </Link>
          <div className="ml-4">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-medium">{project.name}</h1>
              <button className="text-[#D3590B] text-sm font-medium cursor-pointer underline">
                Modifier
              </button>
            </div>
            {project.description && (
              <p className="text-gray-600 text-lg">{project.description}</p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            className="px-4 py-4 bg-black text-white rounded-lg flex items-center gap-2"
            aria-label="Créer une tâche"
          >
            <FontAwesomeIcon icon={faPlus} className="w-4 h-4" />
            Créer une tâche
          </button>
          <button className="px-4 py-4 bg-[#D3590B] text-white rounded-lg flex items-center gap-2">
            <FontAwesomeIcon icon={faStar} className="w-4 h-4" />
            IA
          </button>
        </div>
      </div>

      {/* Section Contributeurs */}
      <div className="bg-[#F3F4F6] flex justify-between items-center mt-20 rounded-xl p-6">
        <h2 className="text-sm font-semibold">
          Contributeurs{" "}
          <span className="text-gray-500 font-normal">
            {totalMembers} personnes
          </span>
        </h2>

        <div className="flex flex-wrap items-center gap-3">
          {/* Propriétaire */}
          <div className="flex items-center gap-2 bg-gray-50 rounded-full pr-3 border border-gray-200">
            <div
              className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-xs font-semibold"
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
            >
              <div
                className="w-8 h-8 rounded-full bg-[#E5E7EB] flex items-center justify-center text-xs font-semibold"
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
