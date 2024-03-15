import { Layout } from '@/layouts/Layout';
import { Meta } from '@/layouts/Meta';
import { Discount } from '@/modules/settings/discount';

const Index = () => {
  return (
    <Layout
      meta={<Meta title="Pharm - Web dashboard" description="Khuyến mại" />}
      title="Khuyến mại"
    >
      <Discount />
    </Layout>
  );
};

export default Index;
