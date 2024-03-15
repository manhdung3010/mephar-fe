import { Layout } from '@/layouts/Layout';
import { Meta } from '@/layouts/Meta';
import { Medicines } from '@/modules/medicine-category';

const Index = () => {
  return (
    <Layout
      meta={<Meta title="Pharm - Web dashboard" description="Danh mục thuốc" />}
      title="Danh mục thuốc"
    >
      <Medicines />
    </Layout>
  );
};

export default Index;
