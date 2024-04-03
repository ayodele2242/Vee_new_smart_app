"use client"
import React, { Suspense } from "react";
import { ServicesComponent } from "@/components/ServicesComponent";

export default function ServicesPage() {
  return (
    <Suspense fallback={<div className="h-[100vh] w-full flex justify-center text-center overlayer">Loading...</div>}>
      <ServicesComponent />
    </Suspense>
  );
}
