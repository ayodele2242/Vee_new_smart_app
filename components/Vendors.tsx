import React, { useState, useEffect, useRef } from 'react';
import { fetchCategories } from '@/services/category.service';
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined';
import { useRouter } from 'next/navigation';
import SkeletonList from '@/loaders/SkeletonList';
import { ApiRequestService } from '@/services/apiRequest.service';
import Link from 'next/link';

const INITIAL_DISPLAY_COUNT = 10;
interface ResponseDataItem {
    status: string;
    message: string;
    data: any;
    totalRecords: any;
}

const Vendors: React.FC = () => {

    const { push } = useRouter();
    const [categories, setCategories] = useState<any[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<any | null>(null);
    const [displayCount, setDisplayCount] = useState(INITIAL_DISPLAY_COUNT);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [addScrollbar, setAddScrollbar] = useState(false);
    const [backendResponse, setBackendResponse] = useState(null)
    const [products, setProducts] = useState<any[]>([]);

    const childCategoriesRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/sellers/getSeller');
                const responseData: ResponseDataItem = await response.json();

                if (!Array.isArray(responseData.data)) {
                    throw new Error('Invalid data structure: expected an array');
                }

                setProducts(responseData.data);
            } catch (error: any) {
                setError(error.message || 'An error occurred while fetching data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div><SkeletonList numberOfItems={5} /></div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (products?.length === 0) {
        return <div>No data available.</div>;
    }

    const limitedProducts = products.slice(0, 12); // Limiting products to first 12 items

    return (
        <div className="vendorsContainers">

            <div className={`childrenCategory ${products.length > 12 ? 'scrollable' : ''}`}>
                {limitedProducts.map((vendor: any) => (
                    <div key={vendor.id} className="vendor w-full cursor-pointer hover:text-yellow-600 font-bold  mb-2" >
                        <Link href={`products?search=${vendor.name}`}>{vendor.name}</Link>
                    </div>
                ))}
               
                <style jsx>{`
                    .childrenCategory.scrollable {
                        max-height: 200px; /* Adjust the height as needed */
                        overflow-y: auto;
                    }
                `}</style>
            </div>
            {products.length > 12 && (
                    <div className="view-all">
                        <Link href="/all-vendors">View All</Link>
                    </div>
                )}
        </div>
    );
};

export default Vendors;
