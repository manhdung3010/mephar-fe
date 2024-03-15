import { Layout } from '@/layouts/Layout';
import { Meta } from '@/layouts/Meta';
import { ReturnTransaction } from '@/modules/transactions/return';

const Index = () => {
  return (
    <Layout
      meta={<Meta title="Pharm - Web dashboard" description="Trả hàng" />}
      title="Trả hàng"
    >
      <ReturnTransaction />
    </Layout>
  );
};

export default Index;
