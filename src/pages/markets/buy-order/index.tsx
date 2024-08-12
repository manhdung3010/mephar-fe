import { Meta } from '@/layouts/Meta'
import BuyOrder from '@/modules/markets/buy-order'
import { MarketLayout } from '@/modules/markets/MarketLayout'

function index() {
  return (
    <MarketLayout meta={<Meta title="Pharm - Đơn hàng mua" description="Đơn hàng mua" />} title="Pharm - Đơn hàng mua">
      <BuyOrder />
    </MarketLayout>
  )
}

export default index