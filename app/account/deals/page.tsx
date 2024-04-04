import React, { Suspense } from "react";
import AddressBook from "@/components/address-books";
import DealsComponent from "@/components/DealsComponent";

export default function AddressBookPage() {
  return (
    <Suspense fallback={<div className="h-[100vh] w-full flex justify-center text-center overlayer">Loading...</div>}>
    <DealsComponent />
    </Suspense>
  );
}
