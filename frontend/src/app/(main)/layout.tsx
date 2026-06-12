"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTableCellsLarge,
  faFolderOpen,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "@/app/context/AuthContext";

// Fonction pour extraire les initiales
function getInitials(user: { name?: string; email: string } | null): string {
  if (!user) return "??";

  // Si l'utilisateur a un nom, utiliser les initiales du nom
  if (user.name) {
    const names = user.name.trim().split(" ");
    if (names.length >= 2) {
      // Prénom + Nom
      return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    }
    // Un seul nom
    return names[0].substring(0, 2).toUpperCase();
  }

  // Sinon, utiliser les 2 premières lettres de l'email
  return user.email.substring(0, 2).toUpperCase();
}

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  // Fonction pour déterminer si le lien est actif
  const isActive = (path: string) => pathname.startsWith(path);

  return (
    <>
      <header className="bg-white flex items-center justify-between p-2 mx-10">
        <div>
          <Link href="/dashboard" className="flex items-center">
            <Image
              src="/Logo_Orange.png"
              alt="Logo Abricot"
              width={140}
              height={50}
              className="object-contain"
            />
          </Link>
        </div>
        <nav className="flex space-x-4" aria-label="Navigation principale">
          <Link
            href="/dashboard"
            className={`text-[#D3590B] flex items-center rounded-2xl font-medium p-5 focus:outline-none focus:text-white focus:bg-black ${
              isActive("/dashboard")
                ? "text-white bg-black"
                : "text-[#D3590B] hover:bg-gray-100"
            }`}
            aria-current={isActive("/dashboard") ? "page" : undefined}
          >
            <FontAwesomeIcon
              icon={faTableCellsLarge}
              className="mr-2"
              width={20}
              height={20}
              aria-hidden="true"
            />
            Tableau de bord
          </Link>

          <Link
            href="/projets"
            className={`text-[#D3590B] flex items-center rounded-2xl font-medium p-5 focus:outline-none focus:text-white focus:bg-black ${
              isActive("/projets")
                ? "text-white bg-black"
                : "text-[#D3590B] hover:bg-gray-100"
            }`}
            aria-current={isActive("/projets") ? "page" : undefined}
          >
            <FontAwesomeIcon
              icon={faFolderOpen}
              className="mr-2"
              width={20}
              height={20}
              aria-hidden="true"
            />
            Projets
          </Link>
        </nav>
        <div>
          <Link
            href="/profile"
            className="text-black bg-[#FFE8D9] rounded-full font-medium p-4 hover:bg-[#FFD4B8] transition-colors"
            aria-label={`Profil de ${user?.name || user?.email}`}
          >
            {getInitials(user)}
          </Link>
        </div>
      </header>
      <main className="bg-[#F9FAFB]">{children}</main>
      <footer className="bg-white flex items-center justify-between p-5 mx-10 mt-auto">
        <div>
          <Image
            src="/Logo_Noir.png"
            alt="Logo Abricot"
            width={140}
            height={50}
            className="object-contain"
          />
        </div>
        <div>
          <button
            onClick={logout}
            className="flex cursor-pointer items-center gap-2 text-[#D3590B] hover:text-white hover:bg-[#D3590B] font-medium px-4 py-2 rounded-lg transition-colors"
            aria-label="Se déconnecter"
          >
            <FontAwesomeIcon
              icon={faRightFromBracket}
              width={16}
              height={16}
              aria-hidden="true"
            />
            Déconnexion
          </button>
        </div>
        <div>
          <p className="font-semibold">Abricot 2026</p>
        </div>
      </footer>
    </>
  );
}
