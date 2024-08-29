import { CustomModal } from '@/components/CustomModal'
import Image from 'next/image'
import React from 'react'
import SellOrderIcon from '@/assets/sellOrder.svg'
import BuyOrderIcon from '@/assets/buyOrder.svg'
import RightIcon from '@/assets/arrow-right-red.svg'
import { useRouter } from 'next/router'

function OrderListModal({ isOpen, onCancel }) {
  const router = useRouter();

  const handleChangeRouter = (path) => {
    router.push(path);
    onCancel();
  }
  return (
    <CustomModal
      isOpen={isOpen}
      onCancel={onCancel}
      width={900}
      title="ĐƠN HÀNG"
      customFooter={true}
    >
      <div className='mt-4 flex flex-col text-[#28293D]'>
        <div className='flex items-center justify-between py-6 border-b-[1px] border-[#EBEBF0]'>
          <div className='flex items-center gap-2 cursor-pointer' onClick={() => handleChangeRouter('/markets/sale-order')}>
            <Image src={SellOrderIcon} />
            <span className='text-lg font-medium'>Đơn hàng bán</span>
          </div>
          <Image src={RightIcon} onClick={() => router.push('/markets/sale-order')} />
        </div>
        <div className='flex items-center justify-between py-6 '>
          <div className='flex items-center gap-2 cursor-pointer' onClick={() => handleChangeRouter('/markets/buy-order')}>
            <Image src={BuyOrderIcon} />
            <span className='text-lg font-medium'>Đơn hàng mua</span>
          </div>
          <Image src={RightIcon} onClick={() => router.push('/markets/buy-order')} />
        </div>
      </div>
    </CustomModal>
  )
}

export default OrderListModal