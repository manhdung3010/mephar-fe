import { Meta } from '@/layouts/Meta'
import { MarketLayout } from '@/modules/markets/MarketLayout'
import ProductDetail from '@/modules/markets/product-detail'
import React from 'react'

function index() {
  return (
    <MarketLayout meta={<Meta title="Pharm - Chợ sản phẩm" description="Chợ sản phẩm" />} title="Pharm - Chợ sản phẩm">
      <ProductDetail />
    </MarketLayout>
  )
}

export default index