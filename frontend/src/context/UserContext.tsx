"use client";

import { mockUser } from "@/config/mockUser";
import { createUser, getCredentials, updateCurrentUser } from "@/helper/db";
import type { User } from "@/types/User";
import React, { createContext, useContext, useEffect, useState } from "react";

interface UserContextType {
  user: User;
  loading: boolean;
  updateUser: (updates: Partial<User>) => void;
  logUser: (userCredentials: User) => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return context;
};

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User>(mockUser);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    setLoading(true);

    try {
      const user = await getCredentials();

      if (user) {
        setUser({
          id: user.id ?? null,
          verified: user.verified ?? false,
          citizenShip_front: user.citizenShip_front ?? null,
          citizenShip_back: user.citizenShip_back ?? null,
          username: user.username ?? "",
          gmail: user.gmail ?? "",
          contact: user.contact ?? "",
          identity: user.identity ?? "user",
          latitude: user.latitude ?? null,
          longitude: user.longitude ?? null,
        });
      } else {
        setUser(mockUser);
      }
    } catch (error: unknown) {
      console.error("Error fetching user credentials:", error);
      setUser(mockUser);
    } finally {
      setLoading(false);
    }
  };

  const logUser = async (userCredentials: Partial<User>) => {
    setLoading(true);

    try {
      const user = await getCredentials();
      if (user && user.username) {
        return;
      }
      const userData = await createUser(userCredentials);
      setUser(userData);
    } catch (error) {
      console.error("Error logging in user:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const updateUser = async (updates: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : prev));
    await updateCurrentUser({ ...updates });
  };

  return (
    <UserContext.Provider
      value={{ user, loading, updateUser, logUser, setUser, refreshUser }}
    >
      {children}
    </UserContext.Provider>
  );
};
