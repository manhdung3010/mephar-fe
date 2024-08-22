import { Layout } from '@/layouts/Layout'
import { Meta } from '@/layouts/Meta'
import CommonPage from '@/modules/market/common'
import React from 'react'

function index() {
  return (
    <Layout
      meta={
        <Meta title="Mephar - Chợ đại lý" description="Danh sách đại lý đã theo dõi" />
      }
      title="Danh sách đại lý đã theo dõi"
    >
      <CommonPage />
    </Layout>
  )
}

export default index