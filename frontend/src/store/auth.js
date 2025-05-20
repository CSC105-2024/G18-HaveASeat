import { create } from "zustand";
import axiosInstance from "@/lib/axios.js";

/**
 * @typedef {Object} User
 * @property {string} id - User ID
 * @property {string} email - User email
 * @property {string} name - User name
 * @property {boolean} isAdmin - Whether the user is an admin
 * @property {string} [phoneNumber] - User phone number
 * @property {string} [birthday] - User birthday
 * @property {string} createdAt - User registed
 */

/**
 * @typedef {Object} AuthState
 * @property {User|null} user - Current authenticated user
 * @property {boolean} isAuthenticated - Whether the user is authenticated
 * @property {boolean} isLoading - Whether auth state is being loaded
 */

/**
 * @typedef {Object} AuthActions
 * @property {() => Promise<User|null>} fetchCurrentUser - Fetch current user data from API
 * @property {(user: User) => Promise<void>} signIn - Login user and store tokens
 * @property {() => void} signOut - Logout user and clear tokens
 * @property {() => Promise<User|null>} updateUser - Update current user data by fetching from API
 */

/**
 * @typedef {AuthState & AuthActions} AuthStore
 */

/**
 * Auth store for managing user authentication state
 * @type {import("zustand").UseBoundStore<import("zustand").StoreApi<AuthStore>>}
 */
export const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  fetchCurrentUser: async () => {
    try {
      const response = await axiosInstance.get("/user");
      const userData = response.data?.data || response.data;

      if (!userData) {
        throw new Error("No user data received");
      }

      set({ user: userData, isAuthenticated: true });
      return userData;
    } catch (error) {
      console.error("Failed to fetch current user:", error);
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  signIn: async (data) => {
    try {
      const {user} = await axiosInstance.post("/authentication/sign-in", data);
      set({ user, isAuthenticated: true});
    } finally {
      set({isLoading: false});
    }
  },

  signOut: async () => {
    try {
      await axiosInstance.delete("/authentication/session");
      set({user: null, isAuthenticated: false});
    } finally {
      set({isLoading: false});
    }
  },
}));
