import React, { Suspense } from "react";
import MessageComponent from "@/components/MessagesComponent";


export default function Messages() {
  return (
    <Suspense fallback={<div className="h-[100vh] w-full flex justify-center text-center overlayer">Loading...</div>}>
      <MessageComponent />
    </Suspense>
  );
}
