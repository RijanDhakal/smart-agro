import { API_BASE_URL, type UserApiResponse } from "@/config/apiDetails";
import type { User } from "@/types/User";
import axios from "axios";

export const createUser = async (user: Partial<User>): Promise<User> => {
  try {
    const response = await axios.post<UserApiResponse>(
      `${API_BASE_URL}/users/create`,
      {
        username: user.username,
        contact: user.contact,
        gmail: user.gmail,
        identity: user.identity,
        latitude: user.latitude,
        longitude: user.longitude,
      }
    );

    if (response.data.statusCode === 200) {
      const userData: User = {
        id: response.data.data.farmerID || response.data.data.userId || "",
        verified: response.data.data.verified || false,
        citizenShip_front: response.data.data.citizenShip_front || null,
        citizenShip_back: response.data.data.citizenShip_back || null,
        username: response.data.data.username || "",
        gmail: response.data.data.gmail || "",
        contact: response.data.data.contact.toString() || "",
        identity: (user.identity as "user" | "farmer") || "user",
        latitude: (user.latitude as number | null) || 27.62958,
        longitude: (user.longitude as number | null) || 83.4724,
      };

      await localStorage.setItem("userCredentials", JSON.stringify(userData));
      return userData;
    } else {
      throw new Error(response.data.message || "Failed to create user");
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to create user");
    }
    throw error;
  }
};

export const getCredentials = async (): Promise<User | null> => {
  try {
    const user = localStorage.getItem("userCredentials");
    return user ? (JSON.parse(user) as User) : null;
  } catch (error) {
    console.error("Error retrieving user credentials:", error);
    return null;
  }
};

export const updateCurrentUser = async (
  updates: Partial<User>
): Promise<User | null> => {
  try {
    const currentUser = await getCredentials();

    if (!currentUser) {
      throw new Error("No user found to update");
    }

    const updatedUser: User = { ...currentUser, ...updates };

    await localStorage.setItem("userCredentials", JSON.stringify(updatedUser));

    return updatedUser;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};
