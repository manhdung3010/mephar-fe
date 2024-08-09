import { Meta } from '@/layouts/Meta'
import { MarketLayout } from '@/modules/markets/MarketLayout'
import Payment from '@/modules/markets/payment'

function index() {
  return (
    <MarketLayout meta={<Meta title="Pharm - Thanh toán" description="Thanh toán" />} title="Pharm - Thanh toán">
      <Payment />
    </MarketLayout>
  )
}

export default index