import { Layout } from '@/layouts/Layout';
import { Meta } from '@/layouts/Meta';
import { BillTransaction } from '@/modules/transactions/bill';

const Index = () => {
  return (
    <Layout
      meta={<Meta title="Pharm - Web dashboard" description="Hóa đơn" />}
      title="Hóa đơn"
    >
      <BillTransaction />
    </Layout>
  );
};

export default Index;
