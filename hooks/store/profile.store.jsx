import { create } from "zustand"
import { combine } from "zustand/middleware"

export const useProfileStore = create(
	combine({ wishList: [] }, (set) => ({
		setWishList: (wishList) => set({ wishList }),
	}))
)
