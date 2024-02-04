import React, { Suspense } from "react";
import HomeComponent from "@/components/HomeComponent";
import Login from "@/components/Login";

export default function Home() {
  return (
    <Suspense fallback={<div className="h-[100vh] w-full flex justify-center text-center overlayer">Loading...</div>}>
      <Login />
    </Suspense>
  );
}
