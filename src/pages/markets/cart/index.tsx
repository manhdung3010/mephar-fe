import { Meta } from '@/layouts/Meta'
import Cart from '@/modules/markets/cart/Cart'
import { MarketLayout } from '@/modules/markets/MarketLayout'
import React from 'react'

function index() {
  return (
    <MarketLayout meta={<Meta title="Pharm - Giỏ hàng" description="Giỏ hàng" />} title="Pharm - Giỏ hàng">
      <Cart />
    </MarketLayout>
  )
}

export default index