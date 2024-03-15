import { Layout } from '@/layouts/Layout';
import { Meta } from '@/layouts/Meta';
import { ConnectDelivery } from '@/modules/settings/connect-delivery';

const Index = () => {
  return (
    <Layout
      meta={
        <Meta title="Pharm - Web dashboard" description="Kết nối vận chuyển" />
      }
      title="Kết nối vận chuyển"
    >
      <ConnectDelivery />
    </Layout>
  );
};

export default Index;
