import React, { Suspense } from "react";
import Wishes from "@/components/wishlist/list";


export default function WishList() {
  return (
    <Suspense fallback={<div className="h-[100vh] w-full flex justify-center text-center overlayer">Loading...</div>}>
     <Wishes />
    </Suspense>
  );
}
