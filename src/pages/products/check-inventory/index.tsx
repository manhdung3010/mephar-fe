import { Layout } from '@/layouts/Layout';
import { Meta } from '@/layouts/Meta';
import { CheckInventory } from '@/modules/products/check-inventory';

const Index = () => {
  return (
    <Layout
      meta={<Meta title="Pharm - Web dashboard" description="Kiểm kho" />}
      title="Kiểm kho"
    >
      <CheckInventory />
    </Layout>
  );
};

export default Index;
