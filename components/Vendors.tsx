import React, { useState, useEffect, useRef } from 'react';
import { fetchCategories } from '@/services/category.service';
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined';
import { useRouter } from 'next/navigation';
import SkeletonList from '@/loaders/SkeletonList';
import { ApiRequestService } from '@/services/apiRequest.service';

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
    fetchData('sellers/getSeller', 1);
  }, []);

  const fetchData = async (url: string, pageNumber: number) => {
    try {
      
      let payload = {};
      let userJson = localStorage.getItem("user");
      if (!userJson) return;
      let user = JSON.parse(userJson);
  
  
      payload = {
        action: "get",
      };
  
      const response = await ApiRequestService.callAPI<ResponseDataItem>(JSON.stringify(payload), url);
      const responseData = response.data;
  
    
      if (response.status === 200) {
        const { status, message, data } = responseData;
        setProducts(responseData.data);
        setError(null);
        setLoading(false);
                    
    } else {
        const { status, message } = responseData;
        setBackendResponse(status);
        setLoading(false);
    }
      
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      setLoading(false);
      if (error.response) {
        if (error.response.status === 401) {
          setError("Please log in to access this content.");
        } else if (error.response.status === 403) {
          setError("You do not have permission to access this content.");
        } else {
          setError("An error occurred on the server. Please try again later.");
        }
      } else if (error.request) {
        setError("No response from the server. Please try again later.");
      } else {
        setError("An unexpected error occurred. Please try again later.");
      }
    }
  };
  

 

  if (loading) {
    return <div className="w-[400px] "><SkeletonList numberOfItems={5} /></div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (categories.length === 0) {
    return <div>No data available.</div>;
  }

  



  return (
    <div className="productsContainer">
        
      <div className='childrenCategories'>
            {products.map((vendor: any) => (
                <div  key={vendor.id} className="vendor w-full" >
                    {vendor.name}

                </div>
               
            ))}
      </div>
    </div>
  );
};

export default Vendors;
