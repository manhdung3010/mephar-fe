import { Meta } from '@/layouts/Meta'
import { MarketLayout } from '@/modules/markets/MarketLayout'
import StoreDetail from '@/modules/markets/stores/storeDetail'
import React from 'react'

function index() {
  return (
    <MarketLayout meta={<Meta title="Pharm - Chi tiết cửa hàng" description="Chi tiết cửa hàng" />} title="Pharm - Chi tiết cửa hàng">
      <StoreDetail />
    </MarketLayout>
  )
}

export default index