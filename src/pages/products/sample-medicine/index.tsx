import { Layout } from '@/layouts/Layout';
import { Meta } from '@/layouts/Meta';
import SampleMedicine from '@/modules/products/sample-medicine';

const Index = () => {
  return (
    <Layout
      meta={
        <Meta
          title="Pharm - Web dashboard"
          description="Danh sách đơn thuốc mẫu"
        />
      }
      title="Danh sách đơn thuốc mẫu"
    >
      <SampleMedicine />
    </Layout>
  );
};

export default Index;
