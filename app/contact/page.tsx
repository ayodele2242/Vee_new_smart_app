"use client"
import React, { Suspense } from "react";
import { ContactComponent } from "@/components/ContactComponent";

export default function ContactPage() {
  return (
    <Suspense fallback={<div className="h-[100vh] w-full flex justify-center text-center overlayer">Loading...</div>}>
      <ContactComponent />
    </Suspense>
  );
}
