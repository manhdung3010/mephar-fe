import { Layout } from '@/layouts/Layout';
import { Meta } from '@/layouts/Meta';
import { EmployeeInfo } from '@/modules/settings/employee';

const Index = () => {
  return (
    <Layout
      meta={
        <Meta title="Pharm - Web dashboard" description="Quản lý nhân viên" />
      }
      title="Quản lý nhân viên"
    >
      <EmployeeInfo />
    </Layout>
  );
};

export default Index;
