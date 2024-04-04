"use client"
import React, { Suspense } from "react";
import BrandsList from "@/components/mobile/brands-component";
import { AllVendorsComponent } from "@/components/AllVendorsComponent";

export default function BrandsPage() {
  return (
    <Suspense fallback={<div className="h-[100vh] w-full flex justify-center text-center overlayer">Loading...</div>}>
      <AllVendorsComponent />
    </Suspense>
  );
}
