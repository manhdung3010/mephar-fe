import { Layout } from '@/layouts/Layout';
import { Meta } from '@/layouts/Meta';
import { Doctor } from '@/modules/partners/doctor';

const Index = () => {
  return (
    <Layout
      meta={<Meta title="Pharm - Web dashboard" description="Bác sĩ" />}
      title="Bác sĩ"
    >
      <Doctor />
    </Layout>
  );
};

export default Index;
