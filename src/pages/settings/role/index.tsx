import { Layout } from '@/layouts/Layout';
import { Meta } from '@/layouts/Meta';
import { RoleInfo } from '@/modules/settings/role';

const Index = () => {
  return (
    <Layout
      meta={
        <Meta
          title="Pharm - Web dashboard"
          description="Quản lý vai trò và phân quyền"
        />
      }
      title="Quản lý vai trò và phân quyền"
    >
      <RoleInfo />
    </Layout>
  );
};

export default Index;
