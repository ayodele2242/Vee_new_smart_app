"use client"
import React, { Suspense } from "react";
import AboutUs from "@/components/mobile/abount-component";
import PartnersList from "@/components/mobile/partners-component";

export default function PartnersPage() {
  return (
    <Suspense fallback={<div className="h-[100vh] w-full flex justify-center text-center overlayer">Loading...</div>}>
      <PartnersList />
    </Suspense>
  );
}
