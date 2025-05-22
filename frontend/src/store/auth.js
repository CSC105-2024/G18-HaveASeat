import { create } from "zustand";
import axiosInstance from "@/lib/axios.js";

const getCookie = (name) => {
  const cookies = document.cookie.split(";");
  for (let cookie of cookies) {
    const [cookieName, cookieValue] = cookie.trim().split("=");
    if (cookieName === name) {
      return cookieValue || null;
    }
  }
  return null;
};

/**
 * @typedef {Object} User
 * @property {string} id - User ID
 * @property {string} email - User email
 * @property {string} name - Username
 * @property {boolean} isAdmin - Whether the user is an admin
 * @property {string} [phoneNumber] - User phone number
 * @property {string} [birthday] - User birthday
 * @property {string} createdAt - User registered
 */

/**
 * @typedef {Object} AuthState
 * @property {User|null} user
 * @property {boolean} isAuthenticated
 * @property {boolean} isLoading
 */

/**
 * @typedef {Object} AuthActions
 * @property {() => Promise<User|null>} fetchCurrentUser
 * @property {(user: User) => Promise<void>} signIn
 * @property {() => void} signOut
 */

/**
 * @typedef {AuthState & AuthActions} AuthStore
 */

/**
 * @type {import("zustand").UseBoundStore<import("zustand").StoreApi<AuthStore>>}
 */
export const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  fetchCurrentUser: async () => {
    try {
      const authToken = getCookie("auth_token");

      if (!authToken) {
        console.log(authToken);
        set({ user: null, isAuthenticated: false });
        return null;
      }

      const response = await axiosInstance.get("/user");
      const userData = response.data?.data || response.data;

      if (!userData) {
        throw new Error("No user data received");
      }

      set({ user: userData, isAuthenticated: true });
      return userData;
    } catch (error) {
      console.error("Failed to fetch current user:", error);
      set({ user: null, isAuthenticated: false });
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  signIn: async (data) => {
    try {
      const { user } = await axiosInstance.post(
        "/authentication/sign-in",
        data,
      );
      set({ user, isAuthenticated: true });
    } finally {
      set({ isLoading: false });
    }
  },

  signOut: async () => {
    try {
      await axiosInstance.delete("/authentication/session");
      set({ user: null, isAuthenticated: false });
    } finally {
      set({ isLoading: false });
    }
  },
}));
