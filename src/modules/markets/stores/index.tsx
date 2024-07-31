import React from 'react'
import StoreCard from '../product-detail/StoreCard'

function Store() {
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
            Object.keys([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]).map((item, index) => (
              <StoreCard key={index} />
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default Store