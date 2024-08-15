import { Layout } from '@/layouts/Layout';
import { Meta } from '@/layouts/Meta';
import Agency from '@/modules/markets/agency';

const Index = () => {
  return (
    <Layout
      meta={
        <Meta title="Mephar - Đăng ký mua hàng từ đại lý" description="Đăng ký mua hàng từ đại lý" />
      }
      title="Đăng ký mua hàng từ đại lý"
    >
      <Agency />
    </Layout>
  );
};

export default Index;
