import { Layout } from "@/layouts/Layout";
import { Meta } from "@/layouts/Meta";
import dynamic from "next/dynamic";
const Check = dynamic(() => import("@/modules/customer-care/check"));

const Index = () => {
  return (
    <Layout
      meta={<Meta title="Pharm - Web dashboard" description="Check điểm bán" vietmap={true} />}
      title="Check điểm bán"
    >
      <Check />
    </Layout>
  );
};

export default Index;
