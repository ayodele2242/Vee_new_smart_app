import React from 'react';
import Link from 'next/link';
import CartQuantityActionBtns from '../cart/cart-quantity-btn';
import PowerSettingsNewOutlinedIcon from '@mui/icons-material/PowerSettingsNewOutlined';
import SingleLoader from '@/loaders/singleLoader';


interface ProductDescriptionProps {
  product: any;
  loading: any;
}

const ProductDescription: React.FC<ProductDescriptionProps> = ({ product, loading }) => {

const currentDate = new Date();
const currentYear = currentDate.getFullYear();


  return (
    <div>
        <div className="topDiv-one flex mb-2">
                {loading && !product ? (
                    <div className="w-[120px] mt-3 mr-3">
                    <SingleLoader numberOfItems={1} />
                    </div>
                    ) : (
                    <>
                    {!loading && product && (
                      <span className="special-ends"><PowerSettingsNewOutlinedIcon fontSize="small" className="icon-small"/> Special Price ends 01/27/{currentYear}</span>
                    )}
                  </>
                )}
                {loading && !product ? (
                    <div className="w-[60px] mt-3 mr-3">
                    <SingleLoader numberOfItems={1} />
                    </div>
                    ) : (
                    <>
                    {!loading && product && (
                       <span className="deal">Vendor deal</span>
                    )}
                    </>
                )}
           
        </div>
        {loading && !product ? (
        <div className="w-[400px]">
          <SingleLoader numberOfItems={1} />
        </div>
      ) : (
        <>
         <h2 className="font-extrabold">{product?.description}</h2>
         <div className="text-sm w-full mb-8">
         {product?.descr}
            {/*product?.productCategory} - {product?.productSubCategory} - {product?.price_details?.extendedVendorPartNumber} 
            - {product?.price_details?.uom} - {product?.price_details?.productClass*/}
        </div>
        </>
        )}

       <div className="topDiv-one  flex justify-between mb-2">

            <div className="flex info-container">

           
                  <div className="topDev w-full">

                  {loading && !product ? (
                    <div className="w-[50px] mt-3 mr-3">
                    <SingleLoader numberOfItems={1} />
                    </div>
                    ) : (
                    <>
                    {!loading && product && (
                    <span className="mr-3 textSmall">
                      <b>VPN: </b> {product?.vendorPartNumber}
                    </span>
                    )}
                        </>
                    )}
                    
                    {loading && !product ? (
                    <div className="w-[50px] mt-3 mr-3">
                    <SingleLoader numberOfItems={1} />
                    </div>
                    ) : (
                    <>
                    {!loading && product && (
                     <span className="mr-3 textSmall">
                     <b>SKU: </b> {product?.ingramPartNumber}
                   </span>
                    )}
                        </>
                    )}


                    {loading && !product ? (
                    <div className="w-[50px] mt-3 mr-3">
                    <SingleLoader numberOfItems={1} />
                    </div>
                    ) : (
                    <>
                    {!loading && product && (
                     <span className="text-sm mr-3 textSmall">
                     <b>UPC: </b> {product?.upc}
                     </span>
                    )}
                        </>
                    )}
                 
                   
                 {loading && !product ? (
                    <div className="w-[50px] mt-3 mr-3">
                    <SingleLoader numberOfItems={1} />
                    </div>
                    ) : (
                    <>
                    {!loading && product && (
                     <span className="text-sm mr-3 textSmaller">
                     <b>By: </b> {product?.vendorName}
                   </span>
                    )}
                        </>
                    )}
                    

                    
                    </div>

                    <div className="topDev w-full mt-2">
                    {loading && !product ? (
                      
                    <div className="w-[50px] mt-3 mr-3">
                    <SingleLoader numberOfItems={1} />
                    </div>
                    ) : (
                    <>
                    {!loading && product && (
                     <Link href="/"><span className="download-btn">Download</span></Link>
                    )}
                        </>
                    )}
                        
                    </div>


                    <div className="topDev w-full mt-2">
                    {loading && !product ? (
                    <div className="w-[90px] mt-3 mr-3">
                    <SingleLoader numberOfItems={1} />
                    </div>
                    ) : (
                    <>
                    {!loading && product && (
                     <span className="endUser">End User Information Required</span>
                    )}
                        </>
                    )}
                        
                    </div>
                 
                

            </div>
            
            
            <div className="">
                <div className="price">
                {loading && !product ? (
                    <div className="w-[100px] mt-3">
                    <SingleLoader numberOfItems={1} />
                    </div>
                    ) : (
                    <>
                    {!loading && product && (
                    <>
                    {product?.pricing?.customerPrice ? (
                    <>
                  <h6 className="text-1xl lg:text-2xl font-bold">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD'
                    }).format(product?.pricing?.customerPrice)}
                  </h6>
                  <p>MSRP  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD'
                  }).format(product?.pricing.retailPrice)} </p>
                  <p>EXCL TAX</p>
                  </>
                ) : (
                  <h6 className="text-1xl lg:text-2xl font-bold">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD'
                    }).format(0.0)}
                  </h6>
                )}
                    </>
                    
                    )}
                        </>
                    
                        )}
               
                </div>
                <div className="addToCart">

                {loading && !product ? (
                    <div className="w-[100px] mt-3">
                    <SingleLoader numberOfItems={1} />
                    </div>
                    ) : (
                    <>
                    {!loading && product && (
                    
                    <CartQuantityActionBtns 
                    product={product} 
                    id={product?.ingramPartNumber}
                        />
                    )}
                        </>
                    
                        )}
                    
                
                </div>
                
            </div>

       </div>

    </div>
  );
};

export default ProductDescription;
