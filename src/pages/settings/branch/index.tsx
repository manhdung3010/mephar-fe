import { Layout } from '@/layouts/Layout';
import { Meta } from '@/layouts/Meta';
import { BranchInfo } from '@/modules/settings/branch';

const Index = () => {
  return (
    <Layout
      meta={
        <Meta title="Pharm - Web dashboard" description="Quản lý chi nhánh" />
      }
      title="Quản lý chi nhánh"
    >
      <BranchInfo />
    </Layout>
  );
};

export default Index;
