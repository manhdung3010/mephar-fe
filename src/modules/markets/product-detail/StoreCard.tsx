import { CustomButton } from '@/components/CustomButton'
import Image from 'next/image'
import React from 'react'
import Logo from "@/public/apple-touch-icon.png";
import { formatNumber, getImage } from '@/helpers';
import { useRouter } from 'next/router';

function StoreCard({ store, branch }: { store: any, branch: any }) {
  const router = useRouter();
  return (
    <div className='grid grid-cols-3 items-center bg-white rounded-2xl p-6'>
      <div className='flex items-center gap-3 border-r-[1px] border-[#EBEBF0]'>
        <div className='w-[100px] h-[100px] rounded-full border-[1px] border-[#E4E4EB] overflow-hidden'>
          <Image className='object-contain w-full h-full' src={getImage(store?.logo?.path) || Logo} width={100} height={100} />
        </div>
        <div className='flex flex-col gap-2'>
          <h4 className='text-xl font-semibold'>{store?.name}</h4>
          <CustomButton className='!h-8 !rounded-lg !w-[100px]' outline onClick={() => router.push(`/markets/stores/${store?.id}`)}>Xem cửa hàng</CustomButton>
        </div>
      </div>
      <div className='flex flex-col gap-8 pl-[42px]'>
        <p>Tổng: <span className='text-red-main'>{formatNumber(store?.totalProduct)} sản phẩm</span></p>
        <p>Đã bán: <span className='text-red-main'>{formatNumber(store?.totalQuantitySold)}</span></p>
      </div>
    </div>
  )
}

export default StoreCard