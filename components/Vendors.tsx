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
          const response = await fetch(process.env.NEXT_PUBLIC_API_URL+'/sellers/getSeller');
          if (!response.status == false) {
            throw new Error('Failed to fetch data');
          }
          const responseData = await response.json();
          setProducts(responseData);
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

  



  return (
    <div className="productsContainer">
        
      <div className='childrenCategories'>
            {products.map((vendor: any) => (
                <div  key={vendor.id} className="vendor w-full" >
                  <Link href={`products?search=${vendor.name}`}>{vendor.name}</Link>   

                </div>
               
            ))}
      </div>
    </div>
  );
};

export default Vendors;
