import React, { useCallback, useState } from 'react'
import { useQuery } from '@tanstack/react-query';
import { getMarketStore } from '@/api/market.service';
import { MarketPaginationStyled } from '@/components/CustomPagination/styled';
import { Pagination } from 'antd';
import { useRecoilValue } from 'recoil';
import { branchState } from '@/recoil/state';
import StoreCard from '../markets/product-detail/StoreCard';
import StoreCardSkeleton from '../markets/product-detail/StoreCardSkeleton';
import { CustomInput } from '@/components/CustomInput';
import { debounce } from 'lodash';
import Image from 'next/image';
import SearchIcon from '@/assets/searchIcon.svg';

function CommonPage() {
  const branchId = useRecoilValue(branchState);
  const [formFilter, setFormFilter] = useState<any>({
    page: 1,
    limit: 10,
    keyword: "",
    isPrivateMarket: 1,
  });
  const [tempKeyword, setTempKeyword] = useState("");
  const { data: stores, isLoading } = useQuery(
    ['MARKET_STORE', JSON.stringify(formFilter)],
    () => getMarketStore({ ...formFilter }),
  );

  const onSearch = useCallback(
    debounce((value) => {
      setFormFilter({ ...formFilter, keyword: value });
    }, 300),
    []
  );
  return (
    <>
      <div className='bg-white rounded-lg min-h-screen'>
        <div className='px-3'>
          <div className='py-5 mt-5'>
            <CustomInput
              placeholder="Tìm kiếm theo tên cửa hàng"
              prefixIcon={<Image src={SearchIcon} alt="" />}
              className="h-11"
              value={tempKeyword}
              onChange={(value) => {
                setTempKeyword(value);
                onSearch(value);
              }}
            />
          </div>
          <div className='grid grid-cols-1 gap-5 mt-6'>
            {
              stores?.data?.items?.length <= 0 ? (
                <div className='text-center py-12 text-gray-500 text-lg'>Không tìm thấy cửa hàng!</div>
              ) : isLoading ? (
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
          {
            stores?.data?.items?.length > 0 && (
              <div className='flex justify-center py-12'>
                <MarketPaginationStyled>
                  <Pagination pageSize={formFilter?.limit} current={formFilter?.page} onChange={(value) => setFormFilter({ ...formFilter, page: value })} total={stores?.data?.totalItem} />
                </MarketPaginationStyled>
              </div>
            )
          }
        </div>
      </div>
    </>
  )
}

export default CommonPage