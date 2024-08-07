import React from 'react'
import StoreCard from '../product-detail/StoreCard'
import { useQuery } from '@tanstack/react-query';
import { getMarketStore } from '@/api/market.service';

function Store() {
  const { data: stores, isLoading } = useQuery(
    ['MARKET_STORE'],
    () => getMarketStore(),
  );
  return (
    <div className='bg-[#fafafc] '>
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

        <div className='grid grid-cols-1 gap-5 mt-6'>
          {
            stores?.data.map((item, index) => (
              <StoreCard key={index} store={item} branch={null} />
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default Store