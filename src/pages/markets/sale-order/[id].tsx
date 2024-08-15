import { Meta } from '@/layouts/Meta'
import { MarketLayout } from '@/modules/markets/MarketLayout'
import SaleOrderDetail from '@/modules/markets/sale-order/saleOrderDetail'

function index() {
  return (
    <MarketLayout meta={<Meta title="Mephar - Đơn hàng bán" description="Đơn hàng bán" />} title="Mephar - Đơn hàng bán">
      <SaleOrderDetail />
    </MarketLayout>
  )
}

export default index