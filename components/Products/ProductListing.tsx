"use client"
import React, { useState, useEffect, useRef } from "react";
import { Navbar } from "@/components/navbar";
import bgHeroLeft from "@/public/images/bgHeroLeft.png"; 
import Menus from "@/components/Products/menus";
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
import { fetchProducts } from "@/services/product.service";
import { fetchSearch } from "@/services/product.service";
import { generateSelectedArray } from "@/hooks/utils";
import ProductGrid from "@/components/Products/ProductGrid";
import ProductList from "@/components/Products/ProductList";
import ProductsAnime from "@/loaders/ProductsAime";
import Pagination from "@/pagination/Pagination";
import { debounce } from "lodash";
import SingleLoader from "@/loaders/singleLoader";

interface ProductListingProps {
  searchTerm: any;
}

const ProductListing: React.FC<ProductListingProps> = ({ searchTerm }) => {
  
    const isMounted = useRef(true);
    const [subCategory, setSubCategory] = useState("");
    const [category, setCategory] = useState("");
    const [bgHeroLeftSrc, setBgHeroLeftSrc] = useState<string | null>(null);
    const [selectedCategories, setSelectedCategories] = useState<{ category: string[] } | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [products, setProducts] = useState<any[]>([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [recordsFound, setRecordsFound] = useState(0);
    const itemPerPage = 15;
    const maxVisiblePages = 5;
    const [currentPage, setCurrentPage] = useState(1);
    //const [layoutType, setLayoutType] = useState("list");
    const [layoutType, setLayoutType] = useState<"grid" | "list">("list"); 
    const PageSize = 15
    
    const [totalPages, setTotalPages] = useState(1);
    const [sortOption, setSortOption] = useState("");
  
  
  
  
  
    const debouncedFetchProducts = useRef(
      debounce((searchTerm: string) => {
        handleSelectedCategoriesChange({
          category: selectedCategories?.category || [],
          pageNumber: 1,
          searchTerm,
        });
      }, 500)
    ).current;
   
  
   // Update the useEffect to invoke debouncedFetchProducts when searchTerm changes
   useEffect(() => {
    if (searchTerm && searchTerm.trim() !== "") {
      debouncedFetchProducts(searchTerm);
    }
  }, [searchTerm, debouncedFetchProducts]);
  
  
    const selectedSearchedItems = (selectedItem: any) => {
      // console.log("Selected Item from Search on product page", selectedItem);
    };
  
    const handlePageChange = (pageNumber: number) => {
      setCurrentPage(pageNumber);
    
      // Capture the values at the time of defining the callback
      const currentSelectedCategories = selectedCategories?.category || [];
      const currentSearchTerm = searchTerm || "";
    
      handleSelectedCategoriesChange({
        category: currentSelectedCategories,
        pageNumber,
        searchTerm: currentSearchTerm,
      });
    };
  
    
    
    const handleSelectedCategoriesChange = ({
      category,
      pageNumber = 1,
      searchTerm,
    }: {
      category: string[];
      pageNumber?: number;
      searchTerm?: string;
    }) => {
      setError(null);
      setLoading(true);
    
      if (!navigator.onLine) {
        setError("You are currently offline. Please check your internet connection.");
        setLoading(false);
        return;
      }
    
      setSelectedCategories({ category });
    
      // Prepare payload
      let payload: {
        pageNumber: number;
        pageSize: number;
        category?: string[];
        keywords?: string;
        sortOption?: string;
      } = {
        pageNumber,
        pageSize: itemPerPage,
        sortOption,
      };
    
      if (category && category.length > 0) {
        payload.category = category;
      } else if (searchTerm && searchTerm.trim() !== "") {
        payload.keywords = searchTerm;
      }
    
      // Make both requests simultaneously
      Promise.all([
        fetchProducts(JSON.stringify(payload)),
        searchTerm ? fetchSearch(JSON.stringify(payload)) : Promise.resolve(null),
      ])
        .then(([productsData, searchData]) => {
          // Determine which data to use based on whether searchTerm is present
          const dataToUse = searchTerm ? searchData : productsData;
    
          if (dataToUse) {
            const productsData = dataToUse.data;
            setProducts(productsData);
            setRecordsFound(dataToUse.recordsFound);
    
            const totalPages = Math.ceil(dataToUse.recordsFound / itemPerPage);
            setTotalPages(totalPages);
          }
        })
        .catch((error) => {
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
        })
        .finally(() => setLoading(false));
    };
    
    
  
    
  
    const generateSelectedArrayForProductsCard = () => {
      if (selectedCategories && selectedCategories.category) {
        return generateSelectedArray(selectedCategories.category, []);
        // Use selectedCategories.category as the selected items array
      } else {
        // Handle case when selectedCategories is null or undefined
        return [];
      }
    };
  
    useEffect(() => {
      // Check if the component is mounted
      if (isMounted.current) {
        if (typeof window !== 'undefined') {
          const queryString = window.location.search;
          const urlParams = new URLSearchParams(queryString);
          const category = urlParams.get('category');
          const subCategory = urlParams.get('subCategory');
  
          // Check if category and subCategory are not null or undefined before using them
          if (category && subCategory) {
            setSubCategory(subCategory);
            setCategory(category);
          }
        }
      }
  
      // Set isMounted to false during cleanup
      return () => {
        isMounted.current = false;
      };
    }, []);
  
    useEffect(() => {
      setBgHeroLeftSrc(bgHeroLeft.src);
    }, []);
  
  
  
    const handleLayoutToggle = () => {
      setLayoutType((prevLayoutType) => (prevLayoutType === "list" ? "grid" : "list"));
    };

  return (
    <div
      className="relative flex flex-col h-screen"
      style={{
        backgroundImage: bgHeroLeftSrc ? `url(${bgHeroLeftSrc})` : 'none',
        backgroundPosition: 'right bottom',
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed'
      }}
    >
      <Navbar onSelectedCategoriesChange={selectedSearchedItems} />
      <div className="mt-4"></div>
      <div className="w-full pt-3 pl-5 pr-5 h-full products-items bg-[#ffffff]">
        <div className="sidebarMenus h-full ">{/*Side menus #starts*/}
          <Menus 
          headercategory={category as string} 
          headersubCategory={subCategory as string} 
          onSelectedCategoriesChange={handleSelectedCategoriesChange} 
          />
          <div className="pt-5 mb-5 h-[40px] w-full"></div>
        </div>{/*Side menus #ends*/}

        <div className="productsListing">{/*Products listing #starts*/}
          {category && subCategory && (
            <div className="title font-lightbold font-large text-wrap tracking-wider text-gray-400 text-2xl mb-3">
              Search results for {category} - {subCategory} 
            </div>
          )}

          {searchTerm && (
            <div className="title font-lightbold font-large text-wrap tracking-wider text-gray-400 text-2xl mb-3">
              Search result for {searchTerm}
            </div>
          )}

          <div className="listGrid">
            <div className="productCount w-[17%]">
              <div className="default-color font-semibold text-wrap text-xl mr-3">Products</div> 
              {loading ? (
                // Show loading status while data is being fetched
                <div className="productCountInfo"> <SingleLoader numberOfItems={1} /> </div>
              ) : (
                // Display recordsFound when data is loaded
                <div className="productCountInfo font-semibold">{recordsFound}</div>
              )}
            </div>
            <div className="gridLayout w-[80%]">
              <div className="listItems mr-8">
              <ListAltOutlinedIcon sx={{ fontSize: 35 }} onClick={handleLayoutToggle} />
               <GridViewOutlinedIcon sx={{ fontSize: 35 }} onClick={handleLayoutToggle} />
              </div>
              <div className="formDiv mr-3">
                <div className="formWrapper">
                <select
                    id="relevant"
                    name="relevant"
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                  >
                    <option value="" className="font-sm">
                      Sort By: Relevance
                    </option>
                    <option value="low-to-high" className="font-sm">
                      Price: Low to High
                    </option>
                    <option value="high-to-low" className="font-sm">
                      Price: High to Low
                    </option>
                  </select>

                </div>
              </div>
              <div className="btnDiv">Compare</div>
            </div>
          </div>

          <div className="productItems w-[100%] mt-5">
          {loading && <ProductsAnime  numberOfItems={5} />}
            {error && <p className="text-danger color-[red]">Error occured: {error}</p>}
            {!loading && !error && (
              layoutType === "list" ? <ProductList products={products} sortOption={sortOption} /> : <ProductGrid products={products} sortOption={sortOption} />
            )}

           {!loading && !error && products.length == 0 && (
              <div className="text-center mt-5 mb-5 h-200 w-100 ">
                <p className="text-danger color-[red]">No products found.</p>
              </div>
            )}

          </div>
          <div className="mt-4"></div>
          {recordsFound > 0 && !loading && (
						<div className="navContainer mt-4 mb-10">
							<Pagination
								onPageChange={handlePageChange}
								totalCount={recordsFound}
								siblingCount={1}
								currentPage={currentPage}
								pageSize={PageSize}
								className="pagination-bar"
							/>
              
						</div>
					)}
       
        </div>{/*Products listing #ends*/}
      </div>
      
     
    </div>
  );
}

export default ProductListing;
