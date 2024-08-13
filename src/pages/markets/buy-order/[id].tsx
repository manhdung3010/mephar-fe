import { Meta } from '@/layouts/Meta'
import BuyOrderDetail from '@/modules/markets/buy-order/buyOrderDetail'
import { MarketLayout } from '@/modules/markets/MarketLayout'

function index() {
  return (
    <MarketLayout meta={<Meta title="Pharm - Chi tiết đơn hàng" description="Chi tiết đơn hàng" />} title="Pharm - Chi tiết đơn hàng">
      <BuyOrderDetail />
    </MarketLayout>
  )
}

export default index