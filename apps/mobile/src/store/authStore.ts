import { create } from "zustand";
import type { User } from "../types";
import { STORAGE_KEYS } from "../constants/config";
import { getItem, removeItem, setItem } from "../utils/storage";

interface AuthState {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
  isHydrated: boolean;
  setAuth: (user: User, token: string) => Promise<void>;
  clearAuth: () => Promise<void>;
  hydrate: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoggedIn: false,
  isHydrated: false,
  setAuth: async (user, token) => {
    await setItem(STORAGE_KEYS.user, user);
    await setItem(STORAGE_KEYS.token, token);
    set({ user, token, isLoggedIn: true });
  },
  clearAuth: async () => {
    await removeItem(STORAGE_KEYS.user);
    await removeItem(STORAGE_KEYS.token);
    set({ user: null, token: null, isLoggedIn: false });
  },
  hydrate: async () => {
    const [user, token] = await Promise.all([
      getItem<User>(STORAGE_KEYS.user),
      getItem<string>(STORAGE_KEYS.token),
    ]);
    set({
      user,
      token,
      isLoggedIn: Boolean(user && token),
      isHydrated: true,
    });
  },
}));
