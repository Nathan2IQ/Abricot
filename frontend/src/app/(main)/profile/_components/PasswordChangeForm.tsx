"use client";

interface PasswordChangeFormProps {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  onCurrentPasswordChange: (password: string) => void;
  onNewPasswordChange: (password: string) => void;
  onConfirmPasswordChange: (password: string) => void;
  disabled?: boolean;
}

export default function PasswordChangeForm({
  currentPassword,
  newPassword,
  onCurrentPasswordChange,
  onNewPasswordChange,
  disabled = false,
}: PasswordChangeFormProps) {
  return (
    <div className="space-y-6">
      <div>
        <label
          htmlFor="currentPassword"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Mot de passe actuel
        </label>
        <input
          type="password"
          id="currentPassword"
          value={currentPassword}
          onChange={(e) => onCurrentPasswordChange(e.target.value)}
          disabled={disabled}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#D3590B] focus:border-[#D3590B]"
        />
      </div>

      <div>
        <label
          htmlFor="newPassword"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Nouveau mot de passe
        </label>
        <input
          type="password"
          id="newPassword"
          value={newPassword}
          onChange={(e) => onNewPasswordChange(e.target.value)}
          disabled={disabled}
          minLength={8}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#D3590B] focus:border-[#D3590B]"
        />
        <p className="mt-1 text-xs text-gray-500">Minimum 8 caractères</p>
      </div>
    </div>
  );
}
