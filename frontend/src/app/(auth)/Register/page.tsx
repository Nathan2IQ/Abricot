import Image from "next/image";
import AuthLayout from "../../components/auth/authLayout";
import Register from "../../components/auth/register";

export default function SignupPage() {
  return (
    <main className="relative flex min-h-screen w-full">
      {/* Conteneur du auth layout - côté droit */}
      <div className="relative z-10 mr-auto w-full md:w-1/2 lg:w-2/5 bg-[#F9FAFB] backdrop-blur-sm shadow-2xl p-8">
        <AuthLayout>
          <Register />
        </AuthLayout>
      </div>

      {/* Image de fond qui prend toute la page */}
      <Image
        src="/BG_login.jpg"
        alt="Image d'illustration de connexion"
        fill
        className="object-cover"
        priority
      />
    </main>
  );
}
