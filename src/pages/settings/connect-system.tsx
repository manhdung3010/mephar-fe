import { Layout } from '@/layouts/Layout';
import { Meta } from '@/layouts/Meta';
import { ConnectSystem } from '@/modules/settings/connect-system';

const Index = () => {
  return (
    <Layout
      meta={
        <Meta
          title="Pharm - Web dashboard"
          description="Liên thông hệ thống dược"
        />
      }
      title="Liên thông hệ thống dược"
    >
      <ConnectSystem />
    </Layout>
  );
};

export default Index;
