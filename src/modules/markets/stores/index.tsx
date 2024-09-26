import React, { useCallback, useState } from 'react'
import StoreCard from '../product-detail/StoreCard'
import { useQuery } from '@tanstack/react-query';
import { getMarketStore } from '@/api/market.service';
import { MarketPaginationStyled } from '@/components/CustomPagination/styled';
import { Pagination } from 'antd';
import { useRecoilValue } from 'recoil';
import { branchState } from '@/recoil/state';
import StoreCardSkeleton from '../product-detail/StoreCardSkeleton';
import { CustomInput } from '@/components/CustomInput';
import Image from 'next/image';
import SearchIcon from '@/assets/searchIcon.svg';
import { debounce } from 'lodash';

function Store() {
  const branchId = useRecoilValue(branchState);
  const [formFilter, setFormFilter] = useState<any>({
    page: 1,
    limit: 10,
    keyword: "",
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
    <div className='bg-[#fafafc] min-h-screen'>
      <div className='fluid-container'>
        <nav className="breadcrumb pt-3">
          <ul className="flex">
            <li className='!text-red-main'>
              <span className="">Trang chủ</span>
              <span className="mx-2">/</span>
            </li>
            <li>
              <a href="#" className="text-gray-500 hover:text-gray-700">Danh sách cửa hàng</a>
            </li>
          </ul>
        </nav>

        <div className='my-5'>
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
              <div className='flex justify-center py-28'>
                <p className='text-lg'>Không tìm thấy cửa hàng hợp lệ!</p>
              </div>
            ) : isLoading ? (
              Array.from({ length: 10 }).map((_, index) => (
                <StoreCardSkeleton key={index} />
              ))
            ) : stores?.data?.items?.map((item, index) => (
              <StoreCard key={index} store={item} branch={item?.name} />
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
  )
}

export default Store