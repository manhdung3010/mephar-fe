import { Meta } from '@/layouts/Meta'
import { MarketLayout } from '@/modules/markets/MarketLayout'
import SaleOrder from '@/modules/markets/sale-order'

function index() {
  return (
    <MarketLayout meta={<Meta title="Pharm - Đơn hàng bán" description="Đơn hàng bán" />} title="Pharm - Đơn hàng bán">
      <SaleOrder />
    </MarketLayout>
  )
}

export default index