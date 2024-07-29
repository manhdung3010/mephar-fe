import { CustomButton } from '@/components/CustomButton'
import Image from 'next/image'
import React from 'react'
import ProductImage from '@/assets/images/product1.jpg'
import { formatMoney } from '@/helpers'

interface ProductCardProps {
  id: number
  name: string
  price: number
  primePrice: number
  image: string
  address: string
  sold: number
}

function ProductCard({ product }: { product: ProductCardProps }) {
  return (
    <div className='shadow-lg rounded-[19px]'>
      <Image src={ProductImage} />
      <div className='p-4 pb-5 flex flex-col gap-3'>
        <h3 className='text-base font-semibold line-clamp-1'>{product?.name}</h3>
        <div className='flex items-center gap-3'>
          <span className='text-red-main text-xl font-semibold'>{formatMoney(product?.price)}</span>
          <span className='text-xl font-medium text-[#999999] line-through'>{formatMoney(product?.primePrice)}</span>
        </div>
        <div className='flex justify-between'>
          <span>{product?.address}</span>
          <span>Đã bán: {product?.sold}</span>
        </div>
        <CustomButton className='!h-12 !rounded-xl' outline>Thêm vào giỏ hàng</CustomButton>
      </div>
    </div>
  )
}

export default ProductCard