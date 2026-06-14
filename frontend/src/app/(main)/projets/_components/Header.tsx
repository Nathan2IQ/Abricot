import CreateProjectButton from "../../dashboard/_components/CreateProjectButton";

export default function Header() {
  return (
    <section className="flex items-center justify-between mt-30 mx-30">
      <div className="flex flex-col align-items items-baseline space-x-4">
        <h1 className="text-3xl font-medium text-gray-900 mb-2">Mes projets</h1>
        <h2 className="text-1xl font-medium ">
          Gérer vos projets et leurs informations
        </h2>
      </div>
      <div>
        <CreateProjectButton />
      </div>
    </section>
  );
}
