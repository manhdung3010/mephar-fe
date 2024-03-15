import { Layout } from '@/layouts/Layout';
import { Meta } from '@/layouts/Meta';
import { PriceSetting } from '@/modules/products/price-setting';

const Index = () => {
  return (
    <Layout
      meta={<Meta title="Pharm - Web dashboard" description="Thiết lập giá" />}
      title="Thiết lập giá"
    >
      <PriceSetting />
    </Layout>
  );
};

export default Index;
