import { getConfigProduct } from '@/api/market.service';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import ProductCard from './ProductCard';
import { Pagination, Skeleton } from 'antd'; // Import Skeleton from Ant Design
import ProductCardSkeleton from './ProductCardSkeleton';
import { MarketPaginationStyled } from '@/components/CustomPagination/styled';
import { useRecoilValue } from 'recoil';
import { branchState } from '@/recoil/state';

function MarketProductList() {
  const branchId = useRecoilValue(branchState);
  const [formFilter, setFormFilter] = useState({
    page: 1,
    limit: 16,
    keyword: "",
    status: "active",
    "createdAt[start]": undefined,
    "createdAt[end]": undefined,
    sortBy: "quantitySold",
    type: 'common',
  });

  const { data: configProduct, isLoading } = useQuery(
    ['CONFIG_PRODUCT', JSON.stringify(formFilter), branchId],
    () => getConfigProduct({ ...formFilter }),
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

      <div className='flex justify-center my-12'>
        <MarketPaginationStyled>
          <Pagination pageSize={formFilter?.limit} current={formFilter?.page} onChange={(value) => setFormFilter({ ...formFilter, page: value })} total={configProduct?.data?.totalItem} />
        </MarketPaginationStyled>
      </div>
    </div>
  );
}

export default MarketProductList;
