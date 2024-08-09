import { getConfigProduct } from '@/api/market.service';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import ProductCard from './ProductCard';
import { Skeleton } from 'antd'; // Import Skeleton from Ant Design
import ProductCardSkeleton from './ProductCardSkeleton';

function MarketProductList() {
  const [formFilter, setFormFilter] = useState({
    page: 1,
    limit: 12,
    keyword: "",
    status: "",
    "createdAt[start]": undefined,
    "createdAt[end]": undefined,
    sortBy: "quantitySold",
    type: 'common'
  });

  const { data: configProduct, isLoading } = useQuery(
    ['CONFIG_PRODUCT', JSON.stringify(formFilter)],
    () => getConfigProduct(formFilter),
  );

  return (
    <div className='fluid-container !mt-16'>
      <h2 className='text-5xl font-semibold text-center'>Danh sách sản phẩm</h2>

      <div className='mt-12 grid grid-cols-4 gap-10'>
        {isLoading ? ( // Check if data is loading
          // Display skeleton when loading
          Array.from({ length: 12 }).map((_, index) => (
            <ProductCardSkeleton />
          ))
        ) : (
          // Display product cards when data is loaded
          configProduct?.data?.items.map((product) => (
            <ProductCard product={product} key={product.id} />
          ))
        )}
      </div>
    </div>
  );
}

export default MarketProductList;
