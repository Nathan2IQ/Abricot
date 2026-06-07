import { faSearch } from "@fortawesome/free-solid-svg-icons/faSearch";
import TaskCard from "./TaskCard";
import type { Task } from "@/app/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface TaskListProps {
  tasks: Task[];
}

export default function TaskList({ tasks }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 text-gray-600 px-6 py-8 rounded-xl text-center">
        Aucune tâche assignée pour le moment
      </div>
    );
  }

  return (
    <section className="bg-white border border-gray-200 rounded-xl p-10 mb-20 mx-30">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h3 className="text-xl font-semibold mb-3"> Mes tâches assignées</h3>
          <p className="text-gray-500">Par ordre de priorité</p>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Rechercher une tâche"
            className="w-full py-4 px-8 pr-10 border border-gray-300 rounded-md"
          />
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
        </div>
      </div>

      <div className="space-y-4">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </section>
  );
}
