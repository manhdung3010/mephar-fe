import { Layout } from '@/layouts/Layout';
import { Meta } from '@/layouts/Meta';
import { DeliveryTransaction } from '@/modules/transactions/delivery';

const Index = () => {
  return (
    <Layout
      meta={<Meta title="Pharm - Web dashboard" description="Chuyển hàng" />}
      title="Chuyển hàng"
    >
      <DeliveryTransaction />
    </Layout>
  );
};

export default Index;
