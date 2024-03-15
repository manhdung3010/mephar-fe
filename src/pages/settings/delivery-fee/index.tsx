import { Layout } from '@/layouts/Layout';
import { Meta } from '@/layouts/Meta';
import { Delivery } from '@/modules/settings/delivery-fee';

const Index = () => {
  return (
    <Layout
      meta={
        <Meta
          title="Pharm - Web dashboard"
          description="Cấu hình phí vận chuyển"
        />
      }
      title="Cấu hình phí vận chuyển"
    >
      <Delivery />
    </Layout>
  );
};

export default Index;
