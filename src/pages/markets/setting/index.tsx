import { Layout } from '@/layouts/Layout';
import { Meta } from '@/layouts/Meta';
import { MarketSetting } from '@/modules/markets/setting';

const Index = () => {
  return (
    <Layout
      meta={
        <Meta title="Pharm - Web dashboard" description="Cấu hình sản phẩm" />
      }
      title="Cấu hình sản phẩm"
    >
      <MarketSetting />
    </Layout>
  );
};

export default Index;
