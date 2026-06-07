"use client";

import { useAuth } from "@/app/context/AuthContext";
import { useState } from "react";
import type { UpdatePasswordData, UpdateProfileData } from "@/app/types";
import ProfileInfoForm from "./_components/ProfileInfoForm";
import PasswordChangeForm from "./_components/PasswordChangeForm";

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();

  const [profileData, setProfileData] = useState<UpdateProfileData>({
    name: user?.name ?? "",
    email: user?.email ?? "",
  });

  const [passwordData, setPasswordData] = useState<UpdatePasswordData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      // Mise à jour du profil
      const profileResponse = await fetch("/api/profile/userInfo", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      });

      const profileResponseData = await profileResponse.json();

      if (!profileResponse.ok) {
        throw new Error(
          profileResponseData.message ||
            "Erreur lors de la mise à jour du profil",
        );
      }

      // Mise à jour du mot de passe si renseigné
      if (passwordData.currentPassword && passwordData.newPassword) {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
          throw new Error("Les mots de passe ne correspondent pas");
        }

        if (passwordData.newPassword.length < 8) {
          throw new Error(
            "Le nouveau mot de passe doit contenir au moins 8 caractères",
          );
        }

        const passwordResponse = await fetch("/api/profile/password", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            currentPassword: passwordData.currentPassword,
            newPassword: passwordData.newPassword,
          }),
        });

        const passwordResponseData = await passwordResponse.json();

        if (!passwordResponse.ok) {
          throw new Error(
            passwordResponseData.message ||
              "Erreur lors de la mise à jour du mot de passe",
          );
        }

        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }

      setSuccess("Profil mis à jour avec succès");
      await refreshUser();
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message || "Une erreur est survenue");
      } else {
        setError("Une erreur est survenue");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[75vw] mx-auto my-10">
        <div className="bg-white shadow rounded-lg py-10 px-20">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Mon compte
          </h1>
          <h2 className="text-lg font-medium text-gray-500 mb-10">
            {profileData.name}
          </h2>

          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-800 rounded-md">
              {success}
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Section Informations personnelles */}
            <div>
              <ProfileInfoForm
                name={profileData.name ?? ""}
                email={profileData.email ?? ""}
                onNameChange={(name) =>
                  setProfileData({ ...profileData, name })
                }
                onEmailChange={(email) =>
                  setProfileData({ ...profileData, email })
                }
                disabled={isLoading}
              />
            </div>

            {/* Section Mot de passe */}
            <div>
              <PasswordChangeForm
                currentPassword={passwordData.currentPassword}
                newPassword={passwordData.newPassword}
                confirmPassword={passwordData.confirmPassword}
                onCurrentPasswordChange={(currentPassword) =>
                  setPasswordData({ ...passwordData, currentPassword })
                }
                onNewPasswordChange={(newPassword) =>
                  setPasswordData({ ...passwordData, newPassword })
                }
                onConfirmPasswordChange={(confirmPassword) =>
                  setPasswordData({ ...passwordData, confirmPassword })
                }
                disabled={isLoading}
              />
            </div>

            {/* Bouton unique en bas */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="px-10 py-3 text-medium font-medium text-white bg-black rounded-md hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isLoading ? "Modification..." : "Modifier les informations"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
