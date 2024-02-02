"use client"
import React, { Suspense } from "react";
import ProductListing from "@/components/Products/ProductListing";
import { useSearchParams } from "next/navigation";

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="h-[100vh] w-full flex justify-center text-center overlayer">Loading...</div>}>
      <ProductsComponentWrapper />
    </Suspense>
  );
}

function ProductsComponentWrapper() {
  const { get } = useSearchParams();
  const searchTerm = get("search");

  return <ProductListing searchTerm={searchTerm} />;
}
