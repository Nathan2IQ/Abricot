import CreateProjectButton from "./CreateProjectButton";

interface DashboardHeaderProps {
  userName?: string;
  userEmail?: string;
}

export default function DashboardHeader({
  userName,
  userEmail,
}: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between mt-30 mx-30">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold mb-2">Tableau de bord</h1>
        <h2 className="text-xl mb-4">
          Bonjour {userName || userEmail}, voici un aperçu de vos projets et
          tâches
        </h2>
      </div>
      <CreateProjectButton />
    </div>
  );
}
