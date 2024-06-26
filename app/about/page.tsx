"use client"
import React, { Suspense } from "react";
import AboutUs from "@/components/mobile/abount-component";

export default function AboutPage() {
  return (
    <Suspense fallback={<div className="h-[100vh] w-full flex justify-center text-center overlayer">Loading...</div>}>
      <AboutUs />
    </Suspense>
  );
}
