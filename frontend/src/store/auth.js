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
 * @property {(user: User, accessToken: string, refreshToken: string) => Promise<void>} login - Login user and store tokens
 * @property {() => void} logout - Logout user and clear tokens
 * @property {() => Promise<User|null>} updateUser - Update current user data by fetching from API
 * @property {() => Promise<void>} initializeAuth - Initialize auth state on app load
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
    const token = localStorage.getItem("accessToken");
    if (!token) {
      set({ user: null, isAuthenticated: false, isLoading: false });
      return null;
    }

    try {
      set({ isLoading: true });
      const response = await axiosInstance.get("/user");

      const userData = response.data?.data || response.data;

      if (!userData) {
        throw new Error("No user data received");
      }

      set({ user: userData, isAuthenticated: true });
      return userData;
    } catch (error) {
      console.error("Failed to fetch current user:", error);

      const status = error?.response?.status;

      if (status === 401) {
        get().logout();
      } else {
        set({ user: null, isAuthenticated: false });
      }

      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  login: async (user, accessToken, refreshToken) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    set({ user, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    set({ user: null, isAuthenticated: false });
  },

  updateUser: async () => {
    return await get().fetchCurrentUser();
  },

  initializeAuth: async () => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      await get().fetchCurrentUser();
    } else {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  hasToken: () => {
    return !!localStorage.getItem("accessToken");
  },

  checkAuth: async () => {
    return await get().fetchCurrentUser();
  },
}));
