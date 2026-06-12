import Link from "next/link";

export default function LoginLinks() {
  return (
    <div className="flex flex-col items-center space-y-2">
      <button
        type="button"
        className="text-[#D3590B] underline cursor-pointer bg-transparent border-none"
        onClick={() => {
          // TODO: Implémenter la fonctionnalité "Mot de passe oublié"
          console.log("Mot de passe oublié");
        }}
      >
        Mot de passe oublié ?
      </button>
      <p className="text-sm text-gray-600  mt-30">
        Pas encore de compte ?{" "}
        <Link href="/register" className="text-[#D3590B] underline font-medium">
          S&apos;inscrire
        </Link>
      </p>
    </div>
  );
}
