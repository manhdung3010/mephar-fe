import { Layout } from '@/layouts/Layout';
import { Meta } from '@/layouts/Meta';
import { EmployeeReport } from '@/modules/reports/employee-report/EmployeeReport';

const Index = () => {
  return (
    <Layout
      meta={
        <Meta title="Pharm - Web dashboard" description="Báo cáo nhân viên" />
      }
      title="Báo cáo nhân viên"
    >
      <EmployeeReport />
    </Layout>
  );
};

export default Index;
