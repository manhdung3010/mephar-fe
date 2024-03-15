import { Layout } from '@/layouts/Layout';
import { Meta } from '@/layouts/Meta';
import { ReturnProduct } from '@/modules/products/return-product';

const Index = () => {
  return (
    <Layout
      meta={<Meta title="Pharm - Web dashboard" description="Trả hàng nhập" />}
      title="Trả hàng nhập"
    >
      <ReturnProduct />
    </Layout>
  );
};

export default Index;
