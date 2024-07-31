import { CustomButton } from '@/components/CustomButton'
import Image from 'next/image'
import React from 'react'

function StoreCard() {
  return (
    <div className='grid grid-cols-3 items-center bg-white rounded-2xl p-6'>
      <div className='flex items-center gap-3 border-r-[1px] border-[#EBEBF0]'>
        <div className='w-[100px] h-[100px] rounded-full border-[1px] border-[#E4E4EB] overflow-hidden'>
          <Image className='object-cover' src={"https://mephar-sit.acdtech.asia/_next/image/?url=https%3A%2F%2Fmephar-sit-api.acdtech.asia%2F%2Fupload%2Fimages%2F2024-06-14%2Fed4c6e71-4f03-42a0-8bac-a7238ce4c63b.jpeg&w=256&q=75"} width={100} height={100} />
        </div>
        <div className='flex flex-col gap-2'>
          <h4 className='text-xl font-semibold'>TIM Care Diamond</h4>
          <p className='text-gray-400'>Chi nhánh Hà Nội</p>
          <CustomButton className='!h-8 !rounded-lg' outline>Xem cửa hàng</CustomButton>
        </div>
      </div>
      <div className='flex flex-col gap-8 pl-[42px]'>
        <p>Tổng: <span className='text-red-main'>100 sản phẩm</span></p>
        <p>Đã bán: <span className='text-red-main'>2.4k</span></p>
      </div>
    </div>
  )
}

export default StoreCard