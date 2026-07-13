import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-between h-full py-12">
      <div className="flex justify-center">
        <Image
          src="/Logo_Orange.png"
          alt="Abricot - Plateforme de gestion de projets et tâches"
          width={250}
          height={250}
          priority
        />
      </div>
      <main className="w-full max-w-md">{children}</main>
      <div></div>
    </div>
  );
}
