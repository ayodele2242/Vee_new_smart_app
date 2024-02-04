import React, { Suspense } from "react";

import RegisterComponent from "@/components/Register";

export default function Register() {
  return (
    <Suspense fallback={<div className="h-[100vh] w-full flex justify-center text-center overlayer">Loading...</div>}>
      <RegisterComponent />
    </Suspense>
  );
}
