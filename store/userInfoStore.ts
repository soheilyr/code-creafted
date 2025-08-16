// stores/useSiteInfo.ts

import { getToken } from "@/lib/utils";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

type UserInfoStore = {
  userInfo: User | null;
  setUserinfo: (userInfo: User | null) => void;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
  fetchUserInfo: () => void;
};

export const useUserInfo = create<UserInfoStore>()(
  devtools(
    persist(
      (set) => ({
        userInfo: null,
        _hasHydrated: false,
        setHasHydrated: (state: boolean) => {
          set({
            _hasHydrated: state,
          });
        },
        setUserinfo: (userInfo: User) => {
          set({ userInfo });
        },
        fetchUserInfo: async () => {
          const token = getToken();
          try {
            const res = await fetch(`/api/profile`, {
              headers: {
                token: `${token}`,
              },
              signal: AbortSignal.timeout(
                +(process.env.NEXT_PUBLIC_FETCH_TIMEOUT ?? 5000)
              ),
            });
            if (!res.ok) throw new Error(`HTTP error ${res.status}`);
            const user = await res.json();
            // const validatedData = SiteInfoSchema.parse(data); TODO:You should add schema for this
            set({ userInfo: user.data });
          } catch (err) {
            console.log(err);
          }
        },
      }),
      {
        name: "user-storage",
        partialize: (state) => ({ userInfo: state.userInfo }),
        onRehydrateStorage(state) {
          return () => state.setHasHydrated(true);
        },
      }
    )
  )
);
