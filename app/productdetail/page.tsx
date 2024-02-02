"use client"

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ProductDetailComponent from "@/components/Products/ProductDetailComponent";

export default function ProductDetailsPage() {
  return (
    <Suspense fallback={<div className="h-[100vh] w-full flex justify-center text-center overlayer">Loading...</div>}>
      <ProductDetailsComponentWrapper />
    </Suspense>
  );
}

function ProductDetailsComponentWrapper() {
  const { get } = useSearchParams();
  const id = get("id");

  if (!id || typeof id !== "string") {
    return <div>Product ID not found.</div>;
  }

  return <ProductDetailComponent productId={id} />;
}
