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
          alt="Logo d'Abricot Orange"
          width={250}
          height={250}
          priority
        />
      </div>
      <div className="w-full max-w-md">{children}</div>
      <div></div>
    </div>
  );
}
