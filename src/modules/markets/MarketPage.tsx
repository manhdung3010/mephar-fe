import React from 'react'
import { MarketLayout } from './MarketLayout'
import MarketBanner from './banner'
import MarketProductList from './product-list'
import { Meta } from '@/layouts/Meta'

function MarketPage() {
  return (
    <MarketLayout meta={<Meta title="Pharm - Chợ sản phẩm" description="Chợ sản phẩm" />} title="Pharm - Chợ sản phẩm">
      <MarketBanner />
      <MarketProductList />
    </MarketLayout>
  )
}

export default MarketPage