import { CustomButton } from '@/components/CustomButton'
import Image from 'next/image'
import React from 'react'
// import ProductImage from '@/assets/images/product1.jpg'
import { formatMoney } from '@/helpers'
import { useRouter } from 'next/router'

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
  const router = useRouter()
  return (
    <div className='shadow-lg rounded-[19px] overflow-hidden'>
      <div className='w-full h-[190px] cursor-pointer' onClick={() => router.push(`/markets/products/${product?.id}`)}>
        <img className='object-cover w-full h-full' src={"https://mephar-sit.acdtech.asia/_next/image/?url=https%3A%2F%2Fmephar-sit-api.acdtech.asia%2F%2Fupload%2Fimages%2F2024-06-14%2Fed4c6e71-4f03-42a0-8bac-a7238ce4c63b.jpeg&w=256&q=75"} />
      </div>
      <div className='p-4 pb-5 flex flex-col gap-3'>
        <h3 className='text-base font-semibold line-clamp-1 cursor-pointer' onClick={() => {
          router.push(`/markets/products/${product?.id}`)
        }}>{product?.name}</h3>
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