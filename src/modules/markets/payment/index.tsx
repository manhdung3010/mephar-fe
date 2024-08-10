import React, { useMemo } from 'react'
import MarkIcon from '@/assets/markRedIcon.svg'
import ArrowIcon from '@/assets/arrow-right-red.svg'
import Image from 'next/image'
import StoreIcon from '@/assets/storeIcon.svg'
import { useRecoilState } from 'recoil'
import { paymentProductState } from '@/recoil/state'
import { formatMoney, formatNumber, getImage } from '@/helpers'
import { CustomInput } from '@/components/CustomInput'
import StickyNoteIcon from '@/assets/stickynote.svg'
import { CustomButton } from '@/components/CustomButton'
import AddressModal from './AddressModal'

function Payment() {
  const [paymentProduct, setPaymentProduct] = useRecoilState<any>(paymentProductState);
  const [openAddress, setOpenAddress] = React.useState(false);

  console.log('paymentProduct', paymentProduct)

  const totalMoney = useMemo(() => {
    return paymentProduct[0]?.products?.reduce((total, product) => {
      return total + (product?.marketProduct?.discountPrice > 0 ? product?.marketProduct?.discountPrice : product?.price) * product?.quantity
    }, 0)
  }, [paymentProduct[0]?.products])

  const shipFee = 50000
  return (
    <div className='bg-[#fafafc] text-[#28293D]'>
      <div className='fluid-container'>
        <nav className="breadcrumb pt-3">
          <ul className="flex">
            <li className='!text-red-main'>
              <span className="">Trang chủ</span>
              <span className="mx-2">/</span>
            </li>
            <li className='!text-red-main'>
              <span className="">Giỏ hàng</span>
              <span className="mx-2">/</span>
            </li>
            <li>
              <a href="#" className="text-gray-500 hover:text-gray-700">Thanh toán</a>
            </li>
          </ul>
        </nav>

        <div className='bg-white my-4 p-6 border-t-4 border-[#FF3B3B] flex gap-2 items-center'>
          <div className='w-3/4'>
            <div className='flex items-center gap-1 text-red-main'>
              <Image src={MarkIcon} />
              <span>Địa chỉ nhận hàng</span>
            </div>
            <div className='mt-1 ml-7 text-[#28293D]'>
              <p className=''>Nguyễn Văn A | 0123456789</p>
              <p className=''>Số 12, Ngõ 12, Đường Nguyễn Văn A, Hà Nội</p>
            </div>
          </div>
          <div className='w-1/4 flex justify-end'>
            <Image src={ArrowIcon} className='cursor-pointer' onClick={() => setOpenAddress(true)} />
          </div>
        </div>

        <div className='bg-white p-6 grid grid-cols-10 text-center font-semibold rounded'>
          <div className='col-span-4'>
            Sản phẩm
          </div>
          <div className='col-span-2'>
            Đơn giá
          </div>
          <div className='col-span-2'>
            Số lượng
          </div>
          <div className='col-span-2'>
            Tổng tiền
          </div>
        </div>
        <div className='flex items-center gap-1 p-6 bg-white round border-b-[1px] border-[#E4E4EB] mt-4 text-[#333333] font-semibold'>
          <Image src={StoreIcon} />
          {paymentProduct[0]?.products[0]?.marketProduct?.store?.name}
        </div>
        <div>
          {
            paymentProduct[0]?.products?.map((product) => (
              <div className='p-[14px] grid grid-cols-10 text-center items-center' key={product?.id}>
                <div className='col-span-4 flex items-center gap-5'>
                  <Image src={getImage(product?.marketProduct?.imageCenter?.path)} width={80} height={80} className='object-cover rounded-lg border-[1px] border-[#E4E4EB]' />
                  <span className='text-base font-medium'>{product?.marketProduct?.product?.name}</span>
                </div>
                <div className='col-span-2 flex items-center justify-center gap-1'>
                  {product?.marketProduct?.discountPrice > 0 && (
                    <span className='text-[#999999] line-through'>{formatMoney(product?.price)}</span>
                  )}
                  <span className='text-base text-[#28293D] font-medium'>{formatMoney(product?.marketProduct?.discountPrice > 0 ? product?.marketProduct?.discountPrice : product?.price)}</span>
                </div>
                <div className='col-span-2'>
                  {"x" + formatNumber(product?.quantity)}
                </div>
                <div className='col-span-2 text-red-main text-base font-medium'>
                  {formatMoney((product?.marketProduct?.discountPrice > 0 ? product?.marketProduct?.discountPrice : product?.price) * product?.quantity)}
                </div>
              </div>
            ))
          }
        </div>

        <div className='bg-white'>
          <div className='py-3 px-4 bg-[#E5FFFF]'>
            <div className='pb-3 border-b-[1px] border-[#00CFDE] text-base text-[#00B7C4] font-semibold'>
              Phương thức vận chuyển
            </div>
            <div className='pt-3 flex items-center'>
              <div className='w-3/4 flex flex-col'>
                <span className='font-semibold'>Nhanh</span>
                <span className='text-[#8F90A6]'>Nhận hàng vào 3 Th07 - 5 Th07</span>
              </div>
              <div className='flex items-center w-1/4 justify-end'>
                {formatMoney(20000)}
                <Image src={ArrowIcon} />
              </div>
            </div>
          </div>

          <div className='px-4 flex justify-between pt-2 pb-4 border-b-[1px] border-[#EBEBF0]'>
            <span className='text-base font-medium '>Tin nhắn</span>
            <CustomInput onChange={() => { }} placeholder='Lưu ý cho người bán' className='!border-0' />
          </div>
          <div className='px-4 flex justify-between pt-4 pb-4'>
            <span className='text-base font-medium '>Tổng số tiền ({formatNumber(paymentProduct[0]?.products?.length)} sp)</span>
            <span className='text-red-main text-base font-medium'>{formatMoney(totalMoney)}</span>
          </div>

          <div className='px-4'>
            <div className='py-2 border-t-[6px] border-b-[6px] border-[#ECECEC]'>
              <div className='flex items-center gap-1'>
                <Image src={StickyNoteIcon} />
                <span className='text-base font-medium '>Chi tiết thanh toán</span>
              </div>
              <div className='mt-[14px] flex flex-col gap-3'>
                <div className='flex justify-between items-center font-medium'>
                  <span>Tổng tiền hàng</span>
                  <span>{formatMoney(totalMoney)}</span>
                </div>
                <div className='flex justify-between items-center font-medium'>
                  <span>Tổng tiền phí vận chuyển</span>
                  <span>{formatMoney(shipFee)}</span>
                </div>
                <div className='flex justify-between items-center font-medium'>
                  <span className='text-base'>Tổng thanh toán</span>
                  <span className='text-red-main text-xl font-semibold'>{formatMoney(totalMoney + shipFee)}</span>
                </div>
              </div>
            </div>
          </div>
          <div className='flex justify-end my-4'>
            <CustomButton className='!w-[300px] !h-[46px]'>Đặt hàng</CustomButton>
          </div>
        </div>


      </div>

      <AddressModal isOpen={openAddress} onCancel={() => setOpenAddress(false)} />
    </div>
  )
}

export default Payment