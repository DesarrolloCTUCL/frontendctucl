import { create } from "zustand";
import { SessionState } from "@/types/user.types";


export const useSessionStore = create<SessionState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
  otherData: null,
  setOtherData: (data) => set({ otherData: data }),
}));
