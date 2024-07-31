import { Meta } from '@/layouts/Meta'
import { MarketLayout } from '@/modules/markets/MarketLayout'
import Store from '@/modules/markets/stores'
import React from 'react'

function index() {
  return (
    <MarketLayout meta={<Meta title="Pharm - Danh sách cửa hàng" description="Danh sách cửa hàng" />} title="Pharm - Danh sách cửa hàng">
      <Store />
    </MarketLayout>
  )
}

export default index