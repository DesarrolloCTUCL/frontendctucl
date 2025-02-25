import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { SessionState } from "@/types/user.types";

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
      otherData: null,
      setOtherData: (data) => set({ otherData: data }),
    }),
    {
      name: "session-storage",
      storage: createJSONStorage(() => localStorage), // Maneja mejor la serialización
    }
  )
);
