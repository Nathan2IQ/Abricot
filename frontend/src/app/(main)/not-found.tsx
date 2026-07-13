import Link from "next/link";

export default function MainNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-7xl font-bold text-orange-600 mb-4">404</h1>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Page non trouvée
          </h2>
          <p className="text-gray-600">
            Cette page n&apos;existe pas ou vous n&apos;avez pas les permissions
            nécessaires pour y accéder.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center px-6 py-3 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          >
            Retour au tableau de bord
          </Link>
          <Link
            href="/projets"
            className="inline-flex items-center justify-center px-6 py-3 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          >
            Voir mes projets
          </Link>
        </div>
      </div>
    </div>
  );
}
