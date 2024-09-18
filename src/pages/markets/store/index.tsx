import { Layout } from '@/layouts/Layout'
import { Meta } from '@/layouts/Meta'
import CommonPage from '@/modules/market/common'
import React from 'react'

function index() {
  return (
    <Layout
      meta={
        <Meta title="Mephar - Chợ hàng điểm" description="Danh sách hàng điểm đã theo dõi" />
      }
      title="Danh sách hàng điểm đã theo dõi"
    >
      <CommonPage />
    </Layout>
  )
}

export default index