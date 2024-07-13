import { Layout } from '@/layouts/Layout';
import { Meta } from '@/layouts/Meta';
import ScheduleList from '@/modules/customer-care';
import TripDetail from '@/modules/customer-care/detail';
import { Customer } from '@/modules/partners/customer';

const Index = () => {
  return (
    <Layout
      meta={<Meta title="Pharm - Web dashboard" description="Chi tiết lịch trình" />}
      title="Chi tiết lịch trình"
    >
      <TripDetail />
    </Layout>
  );
};

export default Index;
