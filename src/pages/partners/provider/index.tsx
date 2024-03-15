import { Layout } from '@/layouts/Layout';
import { Meta } from '@/layouts/Meta';
import { Provider } from '@/modules/partners/provider';

const Index = () => {
  return (
    <Layout
      meta={<Meta title="Pharm - Web dashboard" description="Nhà cung cấp" />}
      title="Nhà cung cấp"
    >
      <Provider />
    </Layout>
  );
};

export default Index;
