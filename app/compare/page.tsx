import React, { Suspense } from "react";
import ProductComparison from "@/components/ProductComparison";

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="h-[100vh] w-full flex justify-center text-center overlayer">Loading...</div>}>
      <ProductComparison />
    </Suspense>
  );
}
