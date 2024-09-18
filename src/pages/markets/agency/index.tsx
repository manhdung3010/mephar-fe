import { Layout } from '@/layouts/Layout';
import { Meta } from '@/layouts/Meta';
import Agency from '@/modules/markets/agency';

const Index = () => {
  return (
    <Layout
      meta={
        <Meta title="Mephar - Đại lý bán điểm" description="Đại lý bán điểm" />
      }
      title="Đại lý bán điểm"
    >
      <Agency />
    </Layout>
  );
};

export default Index;
