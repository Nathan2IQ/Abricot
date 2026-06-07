import Link from "next/link";

export default function LoginLinks() {
  return (
    <div className="flex flex-col items-center space-y-2">
      <p className="text-[#D3590B] underline cursor-pointer">
        Mot de passe oublié ?
      </p>
      <p className="text-sm text-gray-600  mt-30">
        Pas encore de compte ?{" "}
        <Link href="/register" className="text-[#D3590B] underline font-medium">
          S&apos;inscrire
        </Link>
      </p>
    </div>
  );
}
