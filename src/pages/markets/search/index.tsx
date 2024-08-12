import { Meta } from '@/layouts/Meta'
import { MarketLayout } from '@/modules/markets/MarketLayout'
import MarketSearch from '@/modules/markets/search'

function index() {
  return (
    <MarketLayout meta={<Meta title="Pharm - Tìm kiếm" description="Tìm kiếm" />} title="Pharm - Tìm kiếm">
      <MarketSearch />
    </MarketLayout>
  )
}

export default index