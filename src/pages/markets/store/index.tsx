import { Layout } from '@/layouts/Layout'
import { Meta } from '@/layouts/Meta'
import CommonPage from '@/modules/market/common'
import React from 'react'

function index() {
  return (
    <Layout
      meta={
        <Meta title="Pharm - Web dashboard" description="Danh sách sản phẩm" />
      }
      title="Danh sách sản phẩm"
    >
      <CommonPage />
    </Layout>
  )
}

export default index