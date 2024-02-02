'use client';

import { useSearchParams } from "next/navigation"; // Import useRouter from next/router

import ProductDetailComponent from "@/components/Products/ProductDetailComponent";


export default function ProductDetailsPage() {
  
	const { get } = useSearchParams();
	const id = get("id");

  if (!id || typeof id !== 'string') {
    return <div>Product ID not found.</div>;
  }


  return (
    <div className="relative h-screen"
     
    >
      
      <ProductDetailComponent productId={id} /> {/* Pass the productId to ProductDetail */}
    </div>
  );
}
