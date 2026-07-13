"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSquareCheck,
  faCalendarDays,
} from "@fortawesome/free-solid-svg-icons";

type ViewMode = "list" | "kanban";

interface ViewToggleProps {
  onViewChange?: (view: ViewMode) => void;
}

export default function ViewToggle({ onViewChange }: ViewToggleProps) {
  const [activeView, setActiveView] = useState<ViewMode>("list");

  const handleViewChange = (view: ViewMode) => {
    setActiveView(view);
    onViewChange?.(view);
  };

  return (
    <div
      className="flex items-center justify-start my-4 sm:my-6 space-x-2 sm:space-x-4"
      role="group"
      aria-label="Basculer entre les vues"
    >
      <button
        onClick={() => handleViewChange("list")}
        className={`px-4 sm:px-5 lg:px-6 py-2 sm:py-3 text-sm lg:text-base cursor-pointer rounded-xl transition-colors ${
          activeView === "list"
            ? "bg-[#FFF4F0] text-[#BE4E09]"
            : "bg-white text-[#BE4E09] hover:bg-[#FFF4F0]"
        }`}
        aria-pressed={activeView === "list"}
        aria-label="Afficher en liste"
      >
        <FontAwesomeIcon
          icon={faSquareCheck}
          className="mr-2"
          aria-hidden="true"
        />
        Liste
      </button>
      <button
        onClick={() => handleViewChange("kanban")}
        className={`px-4 sm:px-5 lg:px-6 py-2 sm:py-3 text-sm lg:text-base cursor-pointer rounded-xl transition-colors ${
          activeView === "kanban"
            ? "bg-[#FFF4F0] text-[#BE4E09]"
            : "bg-white text-[#BE4E09] hover:bg-[#FFF4F0]"
        }`}
        aria-pressed={activeView === "kanban"}
        aria-label="Afficher en kanban"
      >
        <FontAwesomeIcon
          icon={faCalendarDays}
          className="mr-2"
          aria-hidden="true"
        />
        Kanban
      </button>
    </div>
  );
}
