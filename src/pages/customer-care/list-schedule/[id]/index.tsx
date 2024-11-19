import { Layout } from "@/layouts/Layout";
import { Meta } from "@/layouts/Meta";
import TripDetail from "@/modules/customer-care/detail";

const Index = () => {
  return (
    <Layout
      meta={<Meta title="Pharm - Web dashboard" description="Chi tiết lịch trình" vietmap />}
      title="Chi tiết lịch trình"
    >
      <TripDetail />
    </Layout>
  );
};

export default Index;
