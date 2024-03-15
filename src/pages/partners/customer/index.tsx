import { Layout } from '@/layouts/Layout';
import { Meta } from '@/layouts/Meta';
import { Customer } from '@/modules/partners/customer';

const Index = () => {
  return (
    <Layout
      meta={<Meta title="Pharm - Web dashboard" description="Khách hàng" />}
      title="Khách hàng"
    >
      <Customer />
    </Layout>
  );
};

export default Index;
