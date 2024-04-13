import { Layout } from '@/layouts/Layout';
import { Meta } from '@/layouts/Meta';
import { SaleReport } from '@/modules/reports/sales-report/SaleReport';

const Index = () => {
  return (
    <Layout
      meta={
        <Meta title="Pharm - Web dashboard" description="Báo cáo bán hàng" />
      }
      title="Báo cáo bán hàng"
    >
      <SaleReport />
    </Layout>
  );
};

export default Index;
