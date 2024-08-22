import { Skeleton } from 'antd'
import React from 'react'

function StoreCardSkeleton() {
  return (
    <div className='grid grid-cols-3 items-center bg-white rounded-2xl p-6'>
      <div className='flex items-center gap-3 border-r-[1px] border-[#EBEBF0]'>
        <div className='w-[100px] h-[100px] rounded-full border-[1px] border-[#E4E4EB] overflow-hidden'>
          <Skeleton.Image active rootClassName=' !w-full !h-full' className='!w-full !h-full' />
        </div>
        <div className='flex flex-col gap-2 flex-1'>
          <Skeleton active paragraph={{ rows: 1, }} />
          <Skeleton.Button active className='!h-8 !rounded-lg !w-[100px]' />
        </div>
      </div>
      <div className='flex flex-col gap-8 pl-[42px]'>
        <Skeleton active paragraph={{ rows: 1 }} />
      </div>
    </div>
  )
}

export default StoreCardSkeleton