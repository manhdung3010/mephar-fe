import { Layout } from '@/layouts/Layout';
import { Meta } from '@/layouts/Meta';
import { CustomerReport } from '@/modules/reports/customer-report/CustomerReport';

const Index = () => {
  return (
    <Layout
      meta={
        <Meta title="Pharm - Web dashboard" description="Báo cáo khách hàng" />
      }
      title="Báo cáo khách hàng"
    >
      <CustomerReport />
    </Layout>
  );
};

export default Index;
