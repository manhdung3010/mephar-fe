import { Layout } from '@/layouts/Layout';
import { Meta } from '@/layouts/Meta';
import { ProductReport } from '@/modules/reports/product-report';

const Index = () => {
  return (
    <Layout
      meta={
        <Meta title="Pharm - Web dashboard" description="Báo cáo sản phẩm" />
      }
      title="Báo cáo sản phẩm"
    >
      <ProductReport />
    </Layout>
  );
};

export default Index;
