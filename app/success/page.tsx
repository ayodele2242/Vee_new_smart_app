"use client"
import React, { Suspense } from "react";
import { SuccessComponent } from "@/components/SuccessComponent";
import { useSearchParams } from "next/navigation";

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="h-[100vh] w-full flex justify-center text-center overlayer">Loading...</div>}>
      <SuccessComponentWrapper />
    </Suspense>
  );
}

function SuccessComponentWrapper() {
  const { get } = useSearchParams();
  const sessionId = get("session_id");

  return <SuccessComponent sessionId={sessionId} />;
}
