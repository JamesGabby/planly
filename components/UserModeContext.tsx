"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

export type UserMode = "teacher" | "extended" | "tutor" | "student";

interface UserModeContextType {
  mode: UserMode;
  setMode: (mode: UserMode) => void;
}

const UserModeContext = createContext<UserModeContextType | undefined>(undefined);

export const UserModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<UserMode>("teacher");

    useEffect(() => {
      const stored = localStorage.getItem("userMode");
      if (stored) setMode(stored as UserMode);
    }, []);

    useEffect(() => {
      localStorage.setItem("userMode", mode);
    }, [mode]);


  return (
    <UserModeContext.Provider value={{ mode, setMode }}>
      {children}
    </UserModeContext.Provider>
  );
};

export const useUserMode = () => {
  const ctx = useContext(UserModeContext);
  if (!ctx) throw new Error("useUserMode must be used inside UserModeProvider");
  return ctx;
};
