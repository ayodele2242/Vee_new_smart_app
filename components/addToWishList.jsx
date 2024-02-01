"use client"
import { useEffect, useState } from "react"
import FavoriteIcon from "@mui/icons-material/Favorite"
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder"
import {
	addToWishList,
	getWishList,
	removeFromWishList,
} from "@/services/requestAll.service"
import { useProfileStore } from "@/hooks/store/profile.store"

const AddToWishList = ({ product, id }) => {
	const [isWishListed, setIsWishListed] = useState()
	const { wishList, setWishList } = useProfileStore()

	const init = () => getWishList().then(({ data }) => setWishList(data || []))
	useEffect(() => {
		init()
	}, [init])

	useEffect(() => {
		if (!product || !wishList) return;
		const item = wishList.find(
			(item) =>
				item.product_name ===
				(product?.description || product?.product_name)
		)
		setIsWishListed(item)
	}, [product, wishList])

	const _handleToggleWishList = () => {
		if (isWishListed) {
			return removeFromWishList({ id: isWishListed.id }).then(() =>
				init()
			)
		}
		addToWishList({ ingramPartNumber: id, image_url: "" }).then(() =>
			init()
		)
	}

	return (
		<div
			className="absolute top-4 left-2 cursor-pointer"
			onClick={_handleToggleWishList}
		>
			{!!isWishListed ? (
				<span className="text-BLUE_01">
					<FavoriteIcon size={30} />
				</span>
			) : (
				<FavoriteBorderIcon />
			)}
		</div>
	)
}

export default AddToWishList
