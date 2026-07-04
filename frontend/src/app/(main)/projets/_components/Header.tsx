import CreateProjectButton from "../../dashboard/_components/CreateProjectButton";

interface HeaderProps {
  onCreateProject?: () => void;
}

export default function Header({ onCreateProject }: HeaderProps) {
  return (
    <section className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mt-6 sm:mt-10">
      <div className="flex flex-col align-items items-baseline space-x-2 sm:space-x-4">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-medium text-gray-900 mb-2">
          Mes projets
        </h1>
        <h2 className="text-xs sm:text-sm lg:text-base font-medium">
          Gérer vos projets et leurs informations
        </h2>
      </div>
      <div className="shrink-0">
        <CreateProjectButton onClick={onCreateProject} />
      </div>
    </section>
  );
}
