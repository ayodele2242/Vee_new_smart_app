import React, { useEffect, useState } from "react";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import {
  addToWishList,
  getWishList,
  removeFromWishList,
} from "@/services/requestAll.service";
import { useProfileStore } from "@/hooks/store/profile.store";

interface AddToWishListProps {
  product: {
    description?: string;
    product_name?: string;
  };
  id: string;
}

const AddToWishList: React.FC<AddToWishListProps> = ({ product, id }) => {
  const [isWishListed, setIsWishListed] = useState<any>();
  const { wishList, setWishList } = useProfileStore();

  const init = () =>
    getWishList().then(({ data }) => setWishList(data || []));

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    if (!wishList) return;
    const item = wishList.find(
      (item: { product_name: string | undefined; }) =>
        item.product_name ===
        (product?.description || product?.product_name)
    );
    setIsWishListed(item);
  }, [wishList, product]);

  const _handleToggleWishList = () => {
    if (isWishListed) {
      return removeFromWishList({ id: isWishListed.id }).then(() => init());
    }
    addToWishList({ ingramPartNumber: id, image_url: "" }).then(() => init());
  };

  return (
    <div
      className="absolute top-4 left-2 cursor-pointer"
      onClick={_handleToggleWishList}
    >
      {!!isWishListed ? (
        <span className="text-BLUE_01">
          <FavoriteIcon fontSize="large" />
        </span>
      ) : (
        <FavoriteBorderIcon fontSize="large" />
      )}
    </div>
  );
};

export default AddToWishList;
