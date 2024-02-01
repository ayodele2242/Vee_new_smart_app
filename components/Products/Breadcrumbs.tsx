// Breadcrumbs.tsx

import React from 'react';
import SingleLoader from '@/loaders/singleLoader';
import { Breadcrumbs as NextUIBreadcrumbs, BreadcrumbItem } from "@nextui-org/react";
import Link from 'next/link';


interface BreadcrumbsProps {
  loading: boolean;
  category: string;
  subCategory: string;
  productType: string;
}

const BreadcrumbComponent: React.FC<BreadcrumbsProps> = ({ loading, category, subCategory, productType }) => {
  return (
    <NextUIBreadcrumbs>
      <BreadcrumbItem href="/" color="warning" className="BreadcrumbItem">Home</BreadcrumbItem>
      <BreadcrumbItem href="/products" className="BreadcrumbItem">Products</BreadcrumbItem>
      <BreadcrumbItem  className="BreadcrumbItem">
        {loading ? (
          <>
            <SingleLoader numberOfItems={1} />
          </>
        ) : (
          <Link href={`/products?search=${category}`}>
          <span className="font-bold">
            {category || ''}
          </span>
          </Link>
        )}
      </BreadcrumbItem>
      <BreadcrumbItem href={`/products?search=${subCategory}`} className="BreadcrumbItem">
        {loading ? (
          <>
            <SingleLoader numberOfItems={1} />
          </>
        ) : (
          <Link href={`/products?search=${subCategory}`}>
          <span className="font-bold">
            {subCategory || ''}
          </span>
          </Link>
        )}
      </BreadcrumbItem>
     {/* <BreadcrumbItem className="BreadcrumbItem">
        {loading ? (
          <>
            <SingleLoader numberOfItems={1} />
          </>
        ) : (
          <span className="font-bold">
            {productType || ''}
          </span>
        )}
      </BreadcrumbItem>*/}
    </NextUIBreadcrumbs>
  );
};

export default BreadcrumbComponent;
