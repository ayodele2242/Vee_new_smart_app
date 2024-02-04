"use client"
import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import VerifyComponent from "@/components/VerifyComponent";

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="h-[100vh] w-full flex justify-center text-center overlayer">Loading...</div>}>
      <VerifyComponentWrapper />
    </Suspense>
  );
}

function VerifyComponentWrapper() {
  const { get } = useSearchParams();
  const key = get("key");

  return <VerifyComponent verifyKey={key} />;
}
