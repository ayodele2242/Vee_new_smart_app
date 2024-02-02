"use client"

import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchProducts } from '@/services/product.service';
import { VeeVendorPart } from '@/types/types';
import { Navbar } from "@/components/navbar";
import Footer from "@/components/Home/Footer/Footer";
import bgHeroLeft from "@/public/images/bgHeroLeft.png"; 
import Link from 'next/link';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Breadcrumbs from './Breadcrumbs';
import ImageDisplay from './ImageDisplay';
import ProductDescription from './ProductDescription';
import SingleLoader from '@/loaders/singleLoader';
import TabsPage from './TabsPage';


interface ProductDetailComponentProps {
  productId: string; 
}

const ProductDetailComponent: React.FC<ProductDetailComponentProps> = ({ productId }) => {

  const [bgHeroLeftSrc, setBgHeroLeftSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [product, setProduct] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<string>('tab1');
  const fetchProductMemoized = useMemo(() => fetchProducts, []);

  useEffect(() => {
    setBgHeroLeftSrc(bgHeroLeft.src);
  }, []);

  useEffect(() => {
    setError(null);
    setLoading(true);

    const payload = {"ingramPartNumber": productId};

    if (!navigator.onLine) {
      setError("You are currently offline. Please check your internet connection.");
      setLoading(false);
      return;
    }

    fetchProducts(JSON.stringify(payload))
      .then((data) => {
        if(data.status == true){
          const productsData = data.data;
          setProduct(productsData);
        }else{
          setError(data.message);
        }
        
        
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 401) {
            setError("Please log in to access this content.");
          } else if (error.response.status === 403) {
            setError("You do not have permission to access this content.");
          } else {
            setError("An error occurred on the server. Please try again later by refreshing your browser.");
          }
        } else if (error.request) {
          setError("No response from the server. Please try again later.");
        } else {
          setError("An unexpected error occurred. Please try again later.");
        }
      })
      .finally(() => setLoading(false));
  }, [productId]);


  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  const selectedSearchedItems = (selectedItem: any) => {
    // console.log("Selected Item from Search on product page", selectedItem);
  };

    // Handle tab change logic
    const handleTabChange = (tab: string) => {
      setActiveTab(tab);
    };

  return (
    <>
      <div className="w-100"
        style={{
          backgroundImage: bgHeroLeftSrc ? `url(${bgHeroLeftSrc})` : 'none',
          backgroundPosition: 'right bottom',
          backgroundSize: 'cover',
          backgroundAttachment: 'fixed'
        }}>
        <Navbar onSelectedCategoriesChange={selectedSearchedItems} />

        <div className='w-100 p-10 bg-[#ffffff]'>

          <div className="flex justify-between">
            <Breadcrumbs
              loading={loading}
              category={product?.productCategory}
              subCategory={product?.productSubCategory}
              productType={product?.[0]?.productType}
            />

               {loading && !product ? (
                    <div className="w-[60px] h-[30px] mt-3 mr-3">
                    <SingleLoader numberOfItems={1} />
                    </div>
                    ) : (
                    <>
                    {!loading && product && (
                       <Link href="/quick_order">
                       <div className="rounded outline-2 outline-black radiou-border"> Quick Order</div>
                     </Link>
                    )}
                    </>
                )}

            
          </div>

                {loading && !product ? (
                    <div className="w-[500px] h-[30px] mt-3 mr-3">
                    <SingleLoader numberOfItems={1} />
                    </div>
                    ) : (
                    <>
                    {!loading && product && (
                       <Link href="/quick_order">
                       <div className="p-2 mb-5 mt-6 text-sm text-yellow-800 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300 flex justify-start" role="alert">
                        <span className="font-medium"><InfoOutlinedIcon fontSize="small" /> Warning:</span> This product is delivered directly from the vendor.
                      </div>
                     </Link>
                    )}
                    </>
                )}

          

          <section className='mt-4'>
            {error && <p className="text-danger color-[red]">Error occurred: {error}</p>}
            {!error && (
              <div className="flex content-detail">

                <div className="w-[30%] p-4 flex justify-center mediaDisplay">
                  <ImageDisplay
                      loading={loading}
                      product={product}
                      selectedImageIndex={selectedImageIndex}
                      handleImageClick={handleImageClick}
                    />
                </div>

                <div className="flex-1 w-32 p-4  description">
                  <div className="ProductDetail">
                  <ProductDescription product={product} loading={loading}/>
                  </div>
                
                </div>
              </div>
            )}
          </section>
          <section className="pt-5">
          <TabsPage
              loading={loading}
              product={product}
            />
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductDetailComponent;
