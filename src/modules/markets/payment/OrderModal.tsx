import { CustomModal } from '@/components/CustomModal'
import Image from 'next/image'
import React from 'react'
import DoneIcon from '@/assets/doneCircleIcon.svg'
import { CustomButton } from '@/components/CustomButton'
import { formatDateTime, formatMoney } from '@/helpers'
import { useRouter } from 'next/router'

function OrderModal({ isOpen, onCancel, orderInfo, totalMoney }) {
  const router = useRouter()
  return (
    <CustomModal
      isOpen={isOpen}
      onCancel={onCancel}
      width={432}
      closeIcon={false}
      maskClosable={false}
      customFooter={true}
    >
      <div className='py-4'>
        <div className='flex justify-center'>
          <Image src={DoneIcon} />
        </div>
        <p className='text-[#14BC25] text-center font-semibold'>Cảm ơn bạn!</p>
        <p className='text-[#14BC25] text-center font-semibold'>Đơn hàng của bạn đã được tiếp nhận</p>
        <div className='mt-7 flex flex-col gap-4'>
          <div className='flex justify-between items-center'>
            <p className='text-[#8F90A6]'>Mã đơn hàng:</p>
            <p className='text-[#28293D] font-medium'>{orderInfo?.code}</p>
          </div>
          <div className='flex justify-between items-center'>
            <p className='text-[#8F90A6]'>Thời gian đặt hàng:</p>
            <p className='text-[#28293D] font-medium'>{formatDateTime(orderInfo?.createdAt)}</p>
          </div>
          <div className='flex justify-between items-center'>
            <p className='text-[#8F90A6]'>Tổng tiền:</p>
            <p className='text-red-main'>{formatMoney(+totalMoney)}</p>
          </div>
          <div className='flex justify-between items-center'>
            <p className='text-[#8F90A6]'>Phương thức thanh toán:</p>
            <p className='text-[#28293D] font-medium'>Thanh toán khi nhận hàng</p>
          </div>
        </div>
        <div className='grid grid-cols-2 gap-2 mt-7'>
          <CustomButton className='!h-11 !rounded-lg' outline type='original' onClick={() => router.push('/markets')}>Trang chủ</CustomButton>
          <CustomButton className='!h-11 !rounded-lg' onClick={() => router.push('/markets/buy-order/')}>Đơn mua</CustomButton>
        </div>
      </div>
    </CustomModal>
  )
}

export default OrderModal