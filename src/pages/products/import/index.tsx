import { Layout } from '@/layouts/Layout';
import { Meta } from '@/layouts/Meta';
import { ImportProduct } from '@/modules/products/import-product';

const Index = () => {
  return (
    <Layout
      meta={<Meta title="Pharm - Web dashboard" description="Nhập sản phẩm" />}
      title="Nhập sản phẩm"
    >
      <ImportProduct />
    </Layout>
  );
};

export default Index;
