import Link from "next/dist/client/link";

export default function Register() {
  return (
    <div className="flex flex-col items-center justify-between w-full space-y-6">
      {/* Formulaire principal */}
      <div className="flex flex-col items-center w-full space-y-6 mt-30">
        <h1 className="text-3xl font-bold text-[#D3590B]">Inscription</h1>
        <form className="space-y-4 w-full">
          <div>
            <label
              htmlFor="email"
              className="block text-sm ml-16 font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="mt-1 block mx-auto w-80 py-4 px-4 border border-[#E5E7EB] bg-white focus:outline-none focus:ring-[#D3590B] focus:border-[#D3590B] sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm ml-16 font-medium text-gray-700"
            >
              Mot de passe
            </label>
            <input
              type="password"
              id="password"
              className="mt-1 mx-auto block w-80 py-4 px-4 border border-[#E5E7EB] bg-white focus:outline-none focus:ring-[#D3590B] focus:border-[#D3590B] sm:text-sm"
            />
          </div>
          <div className="flex justify-center mt-6">
            <button
              type="submit"
              className="w-60 py-4 border rounded-2xl border-transparent font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2"
            >
              S&apos;inscrire
            </button>
          </div>
        </form>
        <p className="text-[#D3590B] underline cursor-pointer">
          Mot de passe oublié ?
        </p>
      </div>

      {/* Lien créer un compte */}
      <div className="flex justify-center w-full pt-8 mt-30">
        <p className="text-sm">
          Déjà inscrit ?{" "}
          <Link href="/" className="text-[#D3590B] underline font-medium">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
