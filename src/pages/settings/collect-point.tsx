import { Layout } from '@/layouts/Layout';
import { Meta } from '@/layouts/Meta';
import { CollectPoint } from '@/modules/settings/collect-point';

const Index = () => {
  return (
    <Layout
      meta={
        <Meta title="Pharm - Web dashboard" description="Thiết lập tích điểm" />
      }
      title="Thiết lập tích điểm"
    >
      <CollectPoint />
    </Layout>
  );
};

export default Index;
