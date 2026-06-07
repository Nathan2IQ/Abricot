import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faFolderOpen } from "@fortawesome/free-solid-svg-icons";
import type { Task } from "@/app/types";

interface TaskCardProps {
  task: Task;
}

// Fonction pour obtenir la couleur de statut
function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    DONE: "bg-[#F1FFF7] text-[#27AE60]", // Vert clair pour DONE
    IN_PROGRESS: "bg-[#FFF0D7] text-[#E08D00]", // Orange clair pour IN_PROGRESS
    TODO: "bg-[#FFE0E0] text-[#EF4444]", // Rouge clair pour TODO
  };
  return colors[status] || "bg-gray-100 text-gray-800";
}

// Fonction pour obtenir le libellé du statut
function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    TODO: "À faire",
    IN_PROGRESS: "En cours",
    DONE: "Terminé",
  };
  return labels[status] || status;
}

// Fonction pour formater la date
function formatDate(dateString?: string): string {
  if (!dateString) return "Pas de date limite";
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function TaskCard({ task }: TaskCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex justify-between mb-4">
            <div>
              <h4 className="text-lg font-semibold mb-2">{task.title}</h4>
              {task.description && (
                <p className="text-gray-600 mb-3">{task.description}</p>
              )}
            </div>
            <div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  task.status,
                )}`}
              >
                {getStatusLabel(task.status)}
              </span>
            </div>
          </div>
          <div className="flex items-center  justify-between gap-4 text-sm text-gray-600">
            <div className="flex gap-4 items-center">
              <div>
                <FontAwesomeIcon
                  icon={faFolderOpen}
                  className="mr-2"
                  width={20}
                  height={20}
                />{" "}
                <span className="font-medium">{task.project.name}</span>
              </div>
              <p>|</p>
              <div className="flex items-center">
                <FontAwesomeIcon icon={faClock} className="mr-2" />
                {formatDate(task.dueDate)}
              </div>
            </div>
            <div>
              <button className="px-10 py-2 cursor-pointer bg-black text-white rounded-xl hover:bg-gray-800 transition-colors">
                Voir
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
