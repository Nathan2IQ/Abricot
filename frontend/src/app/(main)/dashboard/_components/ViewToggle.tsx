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
      className="flex items-center justify-start my-10 mx-30 space-x-4"
      role="group"
      aria-label="Basculer entre les vues"
    >
      <button
        onClick={() => handleViewChange("list")}
        className={`px-5 py-3 cursor-pointer rounded-xl transition-colors ${
          activeView === "list"
            ? "bg-[#FFE8D9] text-[#D3590B]"
            : "bg-white text-[#D3590B] hover:bg-[#FFE8D9]"
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
        className={`px-5 py-3 cursor-pointer rounded-xl transition-colors ${
          activeView === "kanban"
            ? "bg-[#FFE8D9] text-[#D3590B]"
            : "bg-white text-[#D3590B] hover:bg-[#FFE8D9]"
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
