import { Skeleton } from 'antd'
import React from 'react'

function ProductCardSkeleton() {
  return (
    <div className='shadow-lg rounded-[19px] overflow-hidden'>
      <div className='w-full h-[190px] cursor-pointer'>
        <Skeleton.Image active rootClassName=' !w-full !h-full' className='!w-full !h-full' />
      </div>
      <div className='p-4 pb-5 flex flex-col gap-3'>
        <div className='flex justify-between'>
          <Skeleton active />
        </div>
        <Skeleton.Button active className='!w-full !h-12' />
      </div>
    </div>
  )
}

export default ProductCardSkeleton