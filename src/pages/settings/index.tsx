import { Layout } from '@/layouts/Layout';
import { Meta } from '@/layouts/Meta';
import { Settings } from '@/modules/settings';

const Index = () => {
  return (
    <Layout
      meta={
        <Meta title="Pharm - Web dashboard" description="Thiết lập cửa hàng" />
      }
      title="Thiết lập cửa hàng"
    >
      <Settings />
    </Layout>
  );
};

export default Index;
