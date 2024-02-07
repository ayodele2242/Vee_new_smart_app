import React, { Suspense } from "react";
import Dashboard from "@/components/profile/dashboard";


export default function ProfileSettings() {
  return (
    <Suspense fallback={<div className="h-[100vh] w-full flex justify-center text-center overlayer">Loading...</div>}>
        <Dashboard />
    </Suspense>
  );
}
