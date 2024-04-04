"use client"

import React, { useRef, useEffect, useState } from 'react';
import { Navbar } from "@/components/navbar";
import Footer from "@/components/Home/Footer/Footer";
import Link from 'next/link';

interface ResponseDataItem {
    status: string;
    message: string;
    data: any;
    totalRecords: any;
}

export const AllVendorsComponent: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [products, setProducts] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/sellers/getSeller');
                const responseData: ResponseDataItem = await response.json();

                if (!Array.isArray(responseData.data)) {
                    throw new Error('Invalid data structure: expected an array');
                }

                // Sort the products alphabetically by name
                const sortedProducts = responseData.data.sort((a, b) => a.name.localeCompare(b.name));
                setProducts(sortedProducts);
            } catch (error: any) {
                setError(error.message || 'An error occurred while fetching data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const selectedSearchedItems = (selectedItem: any) => {
        // console.log("Selected Item from Search on product page", selectedItem);
    };

    return (
        <div className="flex flex-col min-h-screen">
            <div className="flex-grow relative">
                <Navbar onSelectedCategoriesChange={selectedSearchedItems} />
                <div className="mt-4"></div>
                <div className="w-full lg:p-6 bg-gray-200 lg:pl-5 lg:pr-5 vendorsContainers">
                    <div className="w-full mt-4 mb-5 lg:p-8 lg:pl-12 lg:pr-5 brands-title font-extrabold text-xl text-yellow-600">Brands</div>
                    <div className="w-full flex lg:p-6 lg:pl-5 lg:pr-5">
                    <div className="allVendors">
                        {loading ? (
                            <div>Loading Brands...</div>
                        ) : error ? (
                            <div>Error: {error}</div>
                        ) : (
                            products.map((vendor: any) => (
                                <div key={vendor.id} className="vendor w-full cursor-pointer hover:text-yellow-600 font-bold  mb-2" >
                                    <Link href={`products?search=${vendor.name}`}>{vendor.name}</Link>
                                </div>
                            ))
                        )}
                    </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default AllVendorsComponent;
