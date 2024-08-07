import { CustomButton } from '@/components/CustomButton'
import Image from 'next/image'
import React from 'react'
// import ProductImage from '@/assets/images/product1.jpg'
import { formatMoney, formatNumber } from '@/helpers'
import { useRouter } from 'next/router'

interface ProductCardProps {
  id: number
  name: string
  price: number
  primePrice: number
  image: string
  address: string
  sold: number
  imageCenter: {
    filePath: string
  }
  product: {
    name: string
    price: number

  }
  discountPrice: number
  quantitySold: number
}

function ProductCard({ product }: { product: any }) {
  const router = useRouter()
  return (
    <div className='shadow-lg rounded-[19px] overflow-hidden'>
      <div className='w-full h-[190px] cursor-pointer' onClick={() => router.push(`/markets/products/${product?.id}`)}>
        <img className='object-cover w-full h-full' src={product?.imageCenter?.filePath} />
      </div>
      <div className='p-4 pb-5 flex flex-col gap-3'>
        <h3 className='text-base font-semibold line-clamp-1 cursor-pointer' onClick={() => {
          router.push(`/markets/products/${product?.id}`)
        }}>{product?.product?.name}</h3>
        <div className='flex items-center gap-3'>
          <span className='text-red-main text-xl font-semibold'>{formatMoney(product?.price)}</span>
          <span className='text-xl font-medium text-[#999999] line-through'>{formatMoney(product?.discountPrice)}</span>
        </div>
        <div className='flex justify-between'>
          <span>{product?.address || 'Hà Nội'}</span>
          <span>Đã bán: {formatNumber(product?.quantitySold)}</span>
        </div>
        <CustomButton className='!h-12 !rounded-xl' outline>Thêm vào giỏ hàng</CustomButton>
      </div>
    </div>
  )
}

export default ProductCard