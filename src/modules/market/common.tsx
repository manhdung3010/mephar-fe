import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query';
import { getMarketStore } from '@/api/market.service';
import { MarketPaginationStyled } from '@/components/CustomPagination/styled';
import { Pagination } from 'antd';
import { useRecoilValue } from 'recoil';
import { branchState } from '@/recoil/state';
import StoreCard from '../markets/product-detail/StoreCard';
import StoreCardSkeleton from '../markets/product-detail/StoreCardSkeleton';

function CommonPage() {
  const branchId = useRecoilValue(branchState);
  const [formFilter, setFormFilter] = useState<any>({
    page: 1,
    limit: 10,
    keyword: "",
    isPrivateMarket: 1,
  });
  const { data: stores, isLoading } = useQuery(
    ['MARKET_STORE', JSON.stringify(formFilter), branchId],
    () => getMarketStore({ ...formFilter, branchId }),
  );
  return (
    <>
      <div className='bg-white rounded-lg'>
        <div className='px-3'>
          <div className='grid grid-cols-1 gap-5 mt-6'>
            {
              isLoading ? (
                Array.from({ length: 10 }).map((_, index) => (
                  <StoreCardSkeleton key={index} />
                ))
              ) : stores?.data?.items?.map((item, index) => (
                <div key={index} className='border-b border-[#E4E4EB]'>
                  <StoreCard store={item} branch={item?.name} />
                </div>
              ))
            }
          </div>
          <div className='flex justify-center py-12'>
            <MarketPaginationStyled>
              <Pagination pageSize={formFilter?.limit} current={formFilter?.page} onChange={(value) => setFormFilter({ ...formFilter, page: value })} total={stores?.data?.totalItem} />
            </MarketPaginationStyled>
          </div>
        </div>
      </div>
    </>
  )
}

export default CommonPage