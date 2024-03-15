import { Layout } from '@/layouts/Layout';
import { Meta } from '@/layouts/Meta';
import { Home } from '@/modules/home';

const Index = () => {
  return (
    <Layout
      meta={<Meta title="Pharm - Web dashboard" description="Tổng quan" />}
      title="Tổng quan"
    >
      <Home />
    </Layout>
  );
};

export default Index;
