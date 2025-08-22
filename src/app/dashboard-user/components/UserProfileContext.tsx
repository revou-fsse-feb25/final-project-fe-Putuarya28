"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { fetchUserProfile } from "./api";
import { useSession } from "next-auth/react";

export interface UserProfile {
  name: string;
  email: string;
  profilePic?: string;
}

interface UserProfileContextType {
  profile: UserProfile | null;
  refreshProfile: () => Promise<void>;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(
  undefined
);

export function useUserProfile() {
  const ctx = useContext(UserProfileContext);
  if (!ctx)
    throw new Error("useUserProfile must be used within UserProfileProvider");
  return ctx;
}

export const UserProfileProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const refreshProfile = async () => {
    if (!session) return;
    const data = await fetchUserProfile(session);
    setProfile({
      name: data.name || "",
      email: data.email || "",
      profilePic: data.profilePic || "",
    });
  };

  useEffect(() => {
    if (status === "loading" || !session) return;
    refreshProfile();
    // eslint-disable-next-line
  }, [session, status]);

  return (
    <UserProfileContext.Provider
      value={{ profile, refreshProfile, setProfile }}
    >
      {children}
    </UserProfileContext.Provider>
  );
};
