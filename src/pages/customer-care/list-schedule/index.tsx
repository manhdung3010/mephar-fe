import { Layout } from '@/layouts/Layout';
import { Meta } from '@/layouts/Meta';
import ScheduleList from '@/modules/customer-care';
import { Customer } from '@/modules/partners/customer';

const Index = () => {
  return (
    <Layout
      meta={<Meta title="Pharm - Web dashboard" description="Lịch trình" />}
      title="Danh sách lịch trình"
    >
      <ScheduleList />
    </Layout>
  );
};

export default Index;
