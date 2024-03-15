import { Layout } from '@/layouts/Layout';
import { Meta } from '@/layouts/Meta';
import { GroupCustomer } from '@/modules/partners/group-customer';

const Index = () => {
  return (
    <Layout
      meta={
        <Meta title="Pharm - Web dashboard" description="Nhóm khách hàng" />
      }
      title="Nhóm khách hàng"
    >
      <GroupCustomer />
    </Layout>
  );
};

export default Index;
