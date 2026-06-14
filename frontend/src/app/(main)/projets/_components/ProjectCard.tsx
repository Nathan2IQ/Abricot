"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers } from "@fortawesome/free-solid-svg-icons";
import type { Project } from "@/app/types";
import Link from "next/link";

interface ProjectCardProps {
  project: Project;
}

// Fonction pour obtenir les initiales (prénom + nom)
function getInitials(name: string): string {
  const words = name.trim().split(/\s+/);
  if (words.length >= 2) {
    // Si on a au moins 2 mots, prendre première lettre de chacun des 2 premiers
    return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
  }
  // Sinon, juste la première lettre
  return words[0].charAt(0).toUpperCase();
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const totalTasks = project._count?.tasks ?? 0;
  const completedTasks = project._count?.completedTasks ?? 0;
  const progress =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const membersCount = project.members.length + 1; // +1 pour le propriétaire

  return (
    <Link href={`/projets/${project.id}`}>
      <article className="bg-white border min-h-85 border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col">
        {/* En-tête avec nom */}
        <div className="mb-3">
          <h3 className="text-lg font-semibold">{project.name}</h3>
        </div>

        {/* Description */}
        {project.description && (
          <p className="text-gray-600 text-sm mb-6 line-clamp-2">
            {project.description}
          </p>
        )}

        {/* Barre de progression */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2 text-sm">
            <span className="text-gray-600">Progression</span>
            <span className="font-semibold text-gray-900">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-blue-500 h-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Tâches terminées */}
        <div className="text-sm text-gray-600 mb-6">
          {completedTasks}/{totalTasks} tâches terminées
        </div>

        {/* Section Équipe */}
        <div className="pt-4 space-y-3 mt-auto">
          {/* En-tête Équipe */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FontAwesomeIcon icon={faUsers} className="w-4 h-4" />
            <span>Équipe ({membersCount})</span>
          </div>

          {/* Propriétaire et membres sur la même ligne */}
          <div className="flex items-center gap-3">
            {/* Propriétaire */}
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-full bg-orange-100 border-2 border-white flex items-center justify-center text-xs font-semibold"
                title={project.owner.name || project.owner.email}
              >
                {getInitials(project.owner.name || project.owner.email)}
              </div>
              <span className="px-3 py-1 bg-orange-100 text-orange-600 text-xs font-medium rounded-full">
                Propriétaire
              </span>
            </div>

            {/* Autres membres */}
            {project.members.length > 0 && (
              <div className="flex -space-x-2">
                {/* Avatars des membres (max 3) */}
                {project.members.slice(0, 3).map((member) => (
                  <div
                    key={member.id}
                    className="w-8 h-8 rounded-full bg-[#E5E7EB] border-2 border-white flex items-center justify-center text-xs font-semibold"
                    title={member.user.name || member.user.email}
                  >
                    {getInitials(member.user.name || member.user.email)}
                  </div>
                ))}
                {/* Indicateur s'il y a plus de membres */}
                {project.members.length > 3 && (
                  <div
                    className="w-8 h-8 rounded-full bg-[#E5E7EB] border-2 border-white flex items-center justify-center text-white text-xs font-semibold"
                    title={`+${project.members.length - 3} autres membres`}
                  >
                    +{project.members.length - 3}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
