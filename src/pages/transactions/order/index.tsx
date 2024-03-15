import { Layout } from '@/layouts/Layout';
import { Meta } from '@/layouts/Meta';
import { OrderTransaction } from '@/modules/transactions/order';

const Index = () => {
  return (
    <Layout
      meta={
        <Meta title="Pharm - Web dashboard" description="Danh sách đơn hàng" />
      }
      title="Danh sách đơn hàng"
    >
      <OrderTransaction />
    </Layout>
  );
};

export default Index;
