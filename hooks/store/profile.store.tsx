import { create } from "zustand"
import { combine } from "zustand/middleware"

export const useProfileStore = create(
	combine({ wishList: [] }, (set: (arg0: { wishList: any }) => any) => ({
		setWishList: (wishList: any) => set({ wishList }),
	}))
)
