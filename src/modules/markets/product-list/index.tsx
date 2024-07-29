import Link from 'next/link'
import React from 'react'
import ProductCard from './ProductCard'

const productList = [
  {
    id: 1,
    name: 'Sản phẩm 1',
    price: 100000,
    primePrice: 120000,
    image: 'https://via.placeholder.com/150',
    address: 'Hà Nội',
    sold: 100
  },
  {
    id: 2,
    name: 'Sản phẩm 2',
    price: 200000,
    primePrice: 220000,
    image: 'https://via.placeholder.com/150',
    address: 'Hà Nội',
    sold: 200
  },
  {
    id: 3,
    name: 'Sản phẩm 3',
    price: 300000,
    primePrice: 320000,
    image: 'https://via.placeholder.com/150',
    address: 'Hà Nội',
    sold: 300
  },
  {
    id: 4,
    name: 'Sản phẩm 4',
    price: 400000,
    primePrice: 420000,
    image: 'https://via.placeholder.com/150',
    address: 'Hà Nội',
    sold: 400
  },
  {
    id: 5,
    name: 'Sản phẩm 5',
    price: 500000,
    primePrice: 520000,
    image: 'https://via.placeholder.com/150',
    address: 'Hà Nội',
    sold: 500
  },
  {
    id: 6,
    name: 'Sản phẩm 6',
    price: 600000,
    primePrice: 620000,
    image: 'https://via.placeholder.com/150',
    address: 'Hà Nội',
    sold: 600
  },
  {
    id: 7,
    name: 'Sản phẩm 7',
    price: 700000,
    primePrice: 720000,
    image: 'https://via.placeholder.com/150',
    address: 'Hà Nội',
    sold: 700
  },
  {
    id: 8,
    name: 'Sản phẩm 8',
    price: 800000,
    primePrice: 820000,
    image: 'https://via.placeholder.com/150',
    address: 'Hà Nội',
    sold: 800
  },
  {
    id: 9,
    name: 'Sản phẩm 9',
    price: 900000,
    primePrice: 920000,
    image: 'https://via.placeholder.com/150',
    address: 'Hà Nội',
    sold: 900
  },
  {
    id: 10,
    name: 'Sản phẩm 10',
    price: 1000000,
    primePrice: 1020000,
    image: 'https://via.placeholder.com/150',
    address: 'Hà Nội',
    sold: 1000
  },
  {
    id: 11,
    name: 'Sản phẩm 11',
    price: 1000000,
    primePrice: 1020000,
    image: 'https://via.placeholder.com/150',
    address: 'Hà Nội',
    sold: 1000
  },
  {
    id: 12,
    name: 'Sản phẩm 12',
    price: 1000000,
    primePrice: 1020000,
    image: 'https://via.placeholder.com/150',
    address: 'Hà Nội',
    sold: 1000
  },

]

function MarketProductList() {
  return (
    <div className='fluid-container !mt-16'>
      <h2 className='text-5xl font-semibold text-center'>Danh sách sản phẩm</h2>

      <div className='mt-12 grid grid-cols-4 gap-10'>
        {
          productList.map((product) => (
            <ProductCard product={product} key={product.id} />
          ))
        }
      </div>
    </div>
  )
}

export default MarketProductList