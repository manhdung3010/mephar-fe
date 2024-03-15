import { Layout } from '@/layouts/Layout';
import { Meta } from '@/layouts/Meta';
import { ProviderReport } from '@/modules/reports/ProviderReport';

const Index = () => {
  return (
    <Layout
      meta={
        <Meta
          title="Pharm - Web dashboard"
          description="Báo cáo nhà cung cấp"
        />
      }
      title="Báo cáo nhà cung cấp"
    >
      <ProviderReport />
    </Layout>
  );
};

export default Index;
