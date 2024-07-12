import { Layout } from '@/layouts/Layout';
import { Meta } from '@/layouts/Meta';
import Check from '@/modules/customer-care/check';

const Index = () => {
  return (
    <Layout
      meta={<Meta title="Pharm - Web dashboard" description="Check điểm bán" />}
      title="Check điểm bán"
    >
      <Check />
    </Layout>
  );
};

export default Index;
