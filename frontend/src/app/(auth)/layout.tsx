"use client";

import Image from "next/image";
import {
  AuthBackgroundProvider,
  useAuthBackground,
} from "./context/AuthBackgroundContext";

function AuthLayoutContent({ children }: { children: React.ReactNode }) {
  const { backgroundImage } = useAuthBackground();

  return (
    <main className="relative flex min-h-screen w-full">
      {/* Conteneur du auth layout - côté gauche */}
      <div className="relative z-10 mr-auto w-full md:w-1/2 lg:w-2/5 bg-[#F9FAFB] backdrop-blur-sm shadow-2xl p-8">
        {children}
      </div>

      {/* Image de fond qui prend toute la page */}
      <Image
        src={backgroundImage}
        alt="Image d'illustration"
        fill
        className="object-cover"
        priority
      />
    </main>
  );
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthBackgroundProvider>
      <AuthLayoutContent>{children}</AuthLayoutContent>
    </AuthBackgroundProvider>
  );
}
