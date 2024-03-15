import { Layout } from '@/layouts/Layout';
import { Meta } from '@/layouts/Meta';
import { GroupProvider } from '@/modules/partners/group-provider';

const Index = () => {
  return (
    <Layout
      meta={
        <Meta title="Pharm - Web dashboard" description="Nhóm nhà cung cấp" />
      }
      title="Nhóm nhà cung cấp"
    >
      <GroupProvider />
    </Layout>
  );
};

export default Index;
