import Link from "next/link";

export default function LoginLinks() {
  return (
    <div className="flex flex-col items-center space-y-2">
      <button
        type="button"
        className="text-[#BE4E09] underline cursor-pointer bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-[#BE4E09] focus:ring-offset-2 rounded px-2 py-1"
        onClick={() => {
          alert("Fonctionnalité à venir");
        }}
        aria-label="Réinitialiser le mot de passe"
      >
        Mot de passe oublié ?
      </button>
      <p className="text-sm text-gray-600  mt-30">
        Pas encore de compte ?{" "}
        <Link
          href="/register"
          className="text-[#BE4E09] underline font-medium focus:outline-none focus:ring-2 focus:ring-[#BE4E09] focus:ring-offset-2 rounded"
        >
          S&apos;inscrire
        </Link>
      </p>
    </div>
  );
}
