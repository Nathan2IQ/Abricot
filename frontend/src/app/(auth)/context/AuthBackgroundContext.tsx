"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface AuthBackgroundContextType {
  backgroundImage: string;
  setBackgroundImage: (image: string) => void;
}

const AuthBackgroundContext = createContext<
  AuthBackgroundContextType | undefined
>(undefined);

export function AuthBackgroundProvider({ children }: { children: ReactNode }) {
  const [backgroundImage, setBackgroundImage] = useState("/BG_login.jpg");

  return (
    <AuthBackgroundContext.Provider
      value={{ backgroundImage, setBackgroundImage }}
    >
      {children}
    </AuthBackgroundContext.Provider>
  );
}

export function useAuthBackground() {
  const context = useContext(AuthBackgroundContext);
  if (context === undefined) {
    throw new Error(
      "useAuthBackground must be used within an AuthBackgroundProvider",
    );
  }
  return context;
}
