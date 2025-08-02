'use client'
import ProductList from '@/components/product/product-list';
import { useSearchParams } from 'next/navigation';
import React from 'react';

function Page() {
  const searchParams = useSearchParams();
  const price = searchParams.get('price'); // read ?price=...

  return (
    <div className="container mx-auto px-4">
      <ProductList price={price} />
    </div>
  );
}

export default Page;
