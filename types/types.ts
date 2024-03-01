

interface AvailabilityByWarehouse {
    quantityAvailable: number;
    warehouseId: string;
    location: string;
    quantityBackordered?: number;
    quantityBackorderedEta?: string;
    quantityOnOrder?: number;
  }
  
  interface Availability {
    available: boolean;
    totalAvailability: number;
    availabilityByWarehouse: AvailabilityByWarehouse[];
  }
  
  interface Pricing {
    mapPrice: number;
    currencyCode: string;
    retailPrice: number;
    customerPrice: number;
    specialBidPricingAvailable: boolean;
  }
  
  interface PriceDetails {
    ingramPartNumber: string;
    vendorPartNumber: string;
    extendedVendorPartNumber?: string;
    upc?: string;
    partNumberType?: string;
    vendorNumber?: string;
    vendorName?: string;
    description?: string;
    productClass?: string;
    uom?: string;
    acceptBackOrder?: boolean;
    productAuthorized?: boolean;
    returnableProduct?: boolean;
    endUserInfoRequired?: boolean;
    availability: Availability;
    pricing: Pricing;
    bundlePartIndicator?: boolean;
  }
  
  interface Product {
    descr: string;
    product_price(product_price: any): number | bigint;
    customerPrice?: any;
    detail?: string;
    compare: boolean;
    wishlist: any;
    category: string;
    Product_id: string | null;
    description: string;
    subCategory: string;
    productType: string;
    vendorPartNumber: string;
    upcCode: string;
    ingramPartNumber: string;
    vendorName: string;
    hasWarranty: string;
    properties: any; // Adjust the type based on the actual properties structure
    authorizedToPurchase: string;
    images_url?: any[] | any;
    price_details: PriceDetails;
    upc: string;
  }

  interface CartItem {
    quantity: number;
    description: any;
    ingramPartNumber: string;
    vendorPartNumber?: string;
    upc?: string;
    image_url: string;
    price?: any;
    detail?: string;
    descr?: string;
  }

  interface FormData {
    last_name: string;
    first_name: string;
    email: string;
    phone: string;
    company: string;
    selectedCountry: string;
    state: string;
    city: string;
    zip: string;
    password: string;
    cpassword: string;
}

  interface VendorPart {
    Product_id: null;
    description: string;
    category: string;
    subCategory: string;
    productType: string;
    vendorPartNumber: string;
    upcCode: string;
    ingramPartNumber: string;
    vendorName: string;
    hasWarranty: string;
    properties: null;
    authorizedToPurchase: string;
    images_url: string[];
    price_details: {
      ingramPartNumber: string;
      vendorPartNumber: string;
      extendedVendorPartNumber: string;
      upc: string;
      partNumberType: string;
      vendorNumber: string;
      vendorName: string;
      description: string;
      productClass: string;
      uom: string;
      acceptBackOrder: boolean;
      productAuthorized: boolean;
      returnableProduct: boolean;
      endUserInfoRequired: boolean;
      availability: {
        available: boolean;
        totalAvailability: number;
        availabilityByWarehouse: {
          quantityAvailable: number;
          warehouseId: string;
          location: string;
          quantityBackordered: number;
          quantityBackorderedEta: string;
          quantityOnOrder: number;
        }[];
      };
      pricing: {
        mapPrice: number;
        currencyCode: string;
        retailPrice: number;
        customerPrice: number;
        specialBidPricingAvailable: boolean;
      };
      bundlePartIndicator: boolean;
    };
  }
  
  
  interface ApiResponse {
    recordsFound: number;
    pageSize: number;
    pageNumber: number;
    data: Product[];
  }
  
  export type VeeProductType = Product;
  export type VeeApiResponse = ApiResponse;
  export type VeeCartItem = CartItem;
  export type VeeVendorPart = VendorPart;
  export type VeeCheckoutFormData = FormData;
  