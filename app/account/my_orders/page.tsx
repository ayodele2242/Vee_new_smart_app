import React, { Suspense } from "react";
import Orders from "@/components/Orders/Orders";


export default function MyOrders() {
  return (
    <Suspense fallback={<div className="h-[100vh] w-full flex justify-center text-center overlayer">Loading...</div>}>
     <Orders />
    </Suspense>
  );
}
