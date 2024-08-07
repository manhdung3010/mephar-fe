import Image from 'next/image'
import React from 'react'
import StoreIcon from '@/assets/storeIcon.svg'
import { CustomRadio } from '@/components/CustomRadio'

function Cart() {
  return (
    <div className='bg-[#fafafc]'>
      <div className='fluid-container'>
        <nav className="breadcrumb pt-3">
          <ul className="flex">
            <li className='!text-red-main'>
              <span className="">Trang chủ</span>
              <span className="mx-2">/</span>
            </li>
            <li>
              <a href="#" className="text-gray-500 hover:text-gray-700">Giỏ hàng</a>
            </li>
          </ul>
        </nav>

        <div className='grid grid-cols-12 p-[26px] bg-white rounded my-4 font-semibold'>
          <div className='col-span-6'>
            Sản phẩm
          </div>
          <div className='col-span-6 grid grid-cols-4'>
            <div>
              Đơn giá
            </div>
            <div>
              Số lượng
            </div>
            <div>
              Số tiền
            </div>
            <div>
              Thao tác
            </div>
          </div>
        </div>
        <div className='grid grid-cols-12 p-[26px] bg-white rounded font-semibold'>
          <div className='col-span-6 flex items-center gap-2'>
            <CustomRadio value={true} onChange={() => { }} options={[]} />
            <Image src={StoreIcon} />
            <span>TIM Care Diamond</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart