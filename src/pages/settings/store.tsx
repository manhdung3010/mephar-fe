import { Layout } from '@/layouts/Layout';
import { Meta } from '@/layouts/Meta';
import { StoreInfo } from '@/modules/settings/store';

const Index = () => {
  return (
    <Layout
      meta={
        <Meta title="Pharm - Web dashboard" description="THÔNG TIN CỬA HÀNG" />
      }
      title="ThÔNG TIN CỬA HÀNG"
    >
      <StoreInfo />
    </Layout>
  );
};

export default Index;
